import { postJson, getJson, httpRequest, postJsonRaw } from '@/lib/api/http';
import type {
  ActivityPointDto,
  FulfillmentRowDto,
  Get30DaysActivityResponse,
  GetFulfillmentsResponse,
  GetInventoryBody,
  GetInventoryResponse,
  GetLast30DaysRMAsResponse,
  GetLatest50OrdersResponse,
  InventoryFilters,
  LatestOrderDto,
  RmaActivityPointDto,
} from '@/types/api/overview';
import type {
  GetDefaultOverviewLayoutRequest,
  GetOverviewLayoutResponse,
  OverviewArea,
  OverviewLayout,
  SaveOverviewLayoutRequest,
} from '@/types/api/views';
import type {
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
} from '@/types/api/notes';

// Overview API
export async function fetchFulfillments(): Promise<FulfillmentRowDto[]> {
  // Legacy overview returns a raw object keyed by '1001'
  const res = await postJsonRaw<Record<'1001', GetFulfillmentsResponse>>('/api/overview', [ { overview_id: 1001 } ]);
  return res['1001'].data;
}

export async function fetch30DaysActivity(): Promise<ActivityPointDto[]> {
  const res = await postJsonRaw<Record<'1002', Get30DaysActivityResponse>>('/api/overview', [ { overview_id: 1002 } ]);
  return res['1002'].data;
}

export async function fetchLatest50Orders(type: 'received' | 'shipped' = 'received'): Promise<LatestOrderDto[]> {
  const body = type === 'received' ? [ { overview_id: 1003 as const } ] : [ { overview_id: 1004 as const } ];
  const res = await postJsonRaw<
    Record<'1003' | '1004', GetLatest50OrdersResponse>
  >('/api/overview', body as any);
  return type === 'received' ? res['1003'].data : res['1004'].data;
}

export async function fetchInventory(filters: InventoryFilters): Promise<ReadonlyArray<ReturnType<typeof mapInventoryItem>>> {
  const body: GetInventoryBody[] = [ { overview_id: 1005, filters } ];
  const res = await postJsonRaw<Record<'1005', GetInventoryResponse>>('/api/overview', body);
  return res['1005'].data.map(mapInventoryItem);
}

function mapInventoryItem(item: GetInventoryResponse['data'][number]) {
  return item;
}

export async function fetchRma30Days(): Promise<RmaActivityPointDto[]> {
  const res = await postJsonRaw<Record<'1007', GetLast30DaysRMAsResponse>>('/api/overview', [ { overview_id: 1007 } ]);
  return res['1007'].data;
}

export async function fetchDefaultOverviewLayout(): Promise<OverviewLayout> {
  const res = await postJson<GetOverviewLayoutResponse>('/api/views', {
    action: 'get_default_overview',
  } as GetDefaultOverviewLayoutRequest);
  return res.data.overview_layout as any;
}

export async function saveOverviewLayout(layout: OverviewLayout): Promise<OverviewLayout> {
  const res = await postJson<GetOverviewLayoutResponse>('/api/views', {
    action: 'save_overview',
    data: { overview_layout: layout },
  } as SaveOverviewLayoutRequest);
  return res.data.overview_layout as any;
}

// Notes API
export async function fetchNotes(): Promise<Note[]> {
  const res = await getJson<Note[]>('/api/notes');
  return res.data;
}

export async function createNote(noteData: CreateNoteRequest): Promise<Note> {
  const res = await postJson<Note>('/api/notes', noteData);
  return res.data;
}

export async function updateNote(noteData: UpdateNoteRequest): Promise<Note> {
  const res = await httpRequest<Note>({
    method: 'put',
    path: `/api/notes/${noteData.id}`,
    body: noteData
  });
  return res.data;
}

export async function deleteNote(noteId: number): Promise<void> {
  await httpRequest({
    method: 'delete',
    path: `/api/notes/${noteId}`
  });
}


