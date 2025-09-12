import { postJson, getJson, httpRequest, postJsonRaw } from '@/lib/api/http';
import type {
  ActivityPointDto,
  FulfillmentRowDto,
  Get30DaysActivityBody,
  Get30DaysActivityResponse,
  GetFulfillmentsBody,
  GetFulfillmentsResponse,
  GetInventoryBody,
  GetInventoryResponse,
  GetLast30DaysRMAsBody,
  GetLast30DaysRMAsResponse,
  GetLatest50OrdersReceivedBody,
  GetLatest50OrdersResponse,
  GetLatest50OrdersShippedBody,
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
import type {
  AddressDto,
  AddressValidationResult,
  CancelOrderBody,
  CloneOrderBody,
  CloneTemplateBody,
  CreateAddressBody,
  CreateOrderPointsBody,
  CreateOrderPointsResponse,
  DeleteAddressBody,
  DeleteDraftsBody,
  DraftOrderReadResponse,
  GenerateOrderNumberBody,
  GenerateOrderNumberResponse,
  InventoryItemForCartDto,
  InventoryStatusForCartBody,
  ListDraftsBody,
  ListDraftsResponse,
  OrderDetailDto,
  OrderHeaderDto,
  OrderPointsSettingsDto,
  OrderReadResponse,
  PutOnHoldBody,
  ReadAddressesBody,
  ReadAddressesResponse,
  ReadOrderPointsBody,
  ReadOrderPointsSettingsRequest,
  ReadOrderPointsSettingsResponse,
  SaveEntryResponse,
  ToggleTemplateBody,
  TransferOrderBody,
  UpdateAddressBody,
  UpdateOrderPointsBody,
  ValidateAddressBody,
} from '@/types/api/orderpoints';
import type {
  FeedbackSubmissionRequest,
  FeedbackSubmissionResponse,
} from '@/types/api';

// Overview API
export async function fetchFulfillments(): Promise<FulfillmentRowDto[]> {
  // Legacy overview returns a raw object keyed by '1001'
  const body: GetFulfillmentsBody[] = [ { overview_id: 1001 } ];
  const res = await postJsonRaw<Record<'1001', GetFulfillmentsResponse>, GetFulfillmentsBody[]>('/api/overview', body);
  return res['1001'].data;
}

export async function fetch30DaysActivity(): Promise<ActivityPointDto[]> {
  const body: Get30DaysActivityBody[] = [ { overview_id: 1002 } ];
  const res = await postJsonRaw<Record<'1002', Get30DaysActivityResponse>, Get30DaysActivityBody[]>('/api/overview', body);
  return res['1002'].data;
}

export async function fetchLatest50Orders(type: 'received' | 'shipped' = 'received'): Promise<LatestOrderDto[]> {
  if (type === 'received') {
    const body: GetLatest50OrdersReceivedBody[] = [ { overview_id: 1003 } ];
    const res = await postJsonRaw<Record<'1003', GetLatest50OrdersResponse>, GetLatest50OrdersReceivedBody[]>('/api/overview', body);
    return res['1003'].data;
  } else {
    const body: GetLatest50OrdersShippedBody[] = [ { overview_id: 1004 } ];
    const res = await postJsonRaw<Record<'1004', GetLatest50OrdersResponse>, GetLatest50OrdersShippedBody[]>('/api/overview', body);
    return res['1004'].data;
  }
}

export async function fetchInventory(filters: InventoryFilters): Promise<ReadonlyArray<ReturnType<typeof mapInventoryItem>>> {
  const body: GetInventoryBody[] = [ { overview_id: 1005, filters } ];
  const res = await postJsonRaw<Record<'1005', GetInventoryResponse>, GetInventoryBody[]>('/api/overview', body);
  return res['1005'].data.map(mapInventoryItem);
}

function mapInventoryItem(item: GetInventoryResponse['data'][number]) {
  return item;
}

export async function fetchRma30Days(): Promise<RmaActivityPointDto[]> {
  const body: GetLast30DaysRMAsBody[] = [ { overview_id: 1007 } ];
  const res = await postJsonRaw<Record<'1007', GetLast30DaysRMAsResponse>, GetLast30DaysRMAsBody[]>('/api/overview', body);
  return res['1007'].data;
}

export async function fetchDefaultOverviewLayout(): Promise<OverviewLayout> {
  const res = await postJson<GetOverviewLayoutResponse>('/api/views', {
    action: 'get_default_overview',
  } as GetDefaultOverviewLayoutRequest);
  return res.data.overview_layout;
}

export async function saveOverviewLayout(layout: OverviewLayout): Promise<OverviewLayout> {
  const res = await postJson<GetOverviewLayoutResponse>('/api/views', {
    action: 'save_overview',
    data: { overview_layout: layout },
  } as SaveOverviewLayoutRequest);
  return res.data.overview_layout;
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


// ==========================
// OrderPoints API
// ==========================

// Order number
export async function generateOrderNumber(): Promise<string> {
  const body: GenerateOrderNumberBody = { action: 'generate_number' };
  const res = await postJson<GenerateOrderNumberResponse>('/api/orderpoints', body as any);
  return (res.data as any).number;
}

// Create draft or place order
export async function createOrderPoints(payload: CreateOrderPointsBody): Promise<CreateOrderPointsResponse> {
  const res = await postJson<CreateOrderPointsResponse>('/api/orderpoints', payload as any);
  return res.data;
}

export async function saveEntry(order_header: OrderHeaderDto, order_detail: OrderDetailDto[]): Promise<SaveEntryResponse> {
  const body: CreateOrderPointsBody = {
    action: 'create',
    to_draft: false,
    data: { order_header, order_detail },
  };
  const res = await postJson<SaveEntryResponse>('/api/orderpoints', body as any);
  return res.data;
}

export async function saveDraft(order_header: OrderHeaderDto, order_detail: OrderDetailDto[]): Promise<CreateOrderPointsResponse> {
  const body: CreateOrderPointsBody = {
    action: 'create',
    to_draft: true,
    version: 2,
    data: { order_header, order_detail },
  };
  const res = await postJson<CreateOrderPointsResponse>('/api/orderpoints', body as any);
  return res.data;
}

export async function readOrderPoints(params: ReadOrderPointsBody): Promise<OrderReadResponse | DraftOrderReadResponse> {
  const res = await postJson<OrderReadResponse | DraftOrderReadResponse>('/api/orderpoints', params as any);
  return res.data;
}

export async function updateOrderPoints(body: UpdateOrderPointsBody): Promise<OrderReadResponse> {
  const res = await postJson<OrderReadResponse>('/api/orderpoints', body as any);
  return res.data;
}

export async function cancelOrder(body: CancelOrderBody): Promise<void> {
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

export async function putOnHold(body: PutOnHoldBody): Promise<void> {
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

export async function transferOrder(body: TransferOrderBody): Promise<void> {
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

export async function cloneTemplate(body: CloneTemplateBody): Promise<void> {
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

export async function cloneOrder(body: CloneOrderBody): Promise<void> {
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

// Address Book
export async function createAddress(body: CreateAddressBody): Promise<void> {
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

export async function updateAddress(body: UpdateAddressBody): Promise<void> {
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

export async function deleteAddress(body: DeleteAddressBody): Promise<void> {
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

export async function readAddresses(body: ReadAddressesBody): Promise<ReadAddressesResponse> {
  const res = await postJson<ReadAddressesResponse>('/api/orderpoints', body as any);
  return res.data;
}

export async function validateAddress(body: ValidateAddressBody): Promise<AddressValidationResult> {
  const res = await postJson<AddressValidationResult>('/api/orderpoints', body as any);
  return res.data;
}

// Drafts
export async function listDrafts(): Promise<ListDraftsResponse> {
  const body: ListDraftsBody = { action: 'list_drafts' };
  const res = await postJson<ListDraftsResponse>('/api/orderpoints', body as any);
  return res.data;
}

export async function deleteDrafts(order_ids: number[]): Promise<void> {
  const body: DeleteDraftsBody = { action: 'delete_draft', order_ids };
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

// Inventory modal
export async function fetchInventoryForCart(args: Omit<InventoryStatusForCartBody, 'resource' | 'action'>): Promise<{ rows: InventoryItemForCartDto[]; total: number }> {
  const payload: InventoryStatusForCartBody = { resource: 'inventory-status-for-cart', action: 'read', ...args };
  // Legacy inventory uses /api/inventory with non-standard envelope; but we keep standard here
  const res = await postJson<{ rows: InventoryItemForCartDto[]; total: number }>('/api/inventory', payload as any);
  // Some legacy responses use data.rows; normalize
  return res.data;
}

// Order Points Settings
export async function readOrderPointsSettings(): Promise<OrderPointsSettingsDto> {
  const request: ReadOrderPointsSettingsRequest = {
    action: 'read_settings'
  };
  
  const response = await postJson<ReadOrderPointsSettingsResponse>('/api/orderpoints', request);
  return (response.data as unknown) as OrderPointsSettingsDto;
}

// Feedback API
export async function submitFeedback(feedback: FeedbackSubmissionRequest): Promise<FeedbackSubmissionResponse> {
  const formData = new FormData();
  if (feedback.file) {
    formData.append('file', feedback.file);
  }

  // Get authentication token
  let token = '';
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem('authToken');
      if (raw) {
        const authData = JSON.parse(raw);
        token = authData?.api_token || '';
      }
    } catch {
      // Ignore parsing errors
    }
  }

  const response = await fetch('/api/proxy/api/upload', {
    method: 'POST',
    headers: {
      'X-Access-Token': token,
      'X-Upload-Params': JSON.stringify({
        func: 'feedback_upload',
        type: feedback.type,
        message: feedback.message
      })
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to submit feedback: ${response.status} ${response.statusText}`);
  }

  // Parse JSON response
  await response.json();
  return { success: true, message: 'Feedback sent successfully' };
}

