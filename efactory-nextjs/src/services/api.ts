import { postJson, getJson, httpRequest, postJsonRaw, postFormData, httpRequestRaw } from '@/lib/api/http';
import type {
  GridRowResponse,
  GridSelectedView,
  GridViewListData,
  ListGridViewsRequest,
  ListGridViewsResponse,
  ReadGridRowsRequest,
  SelectGridViewRequest,
} from '@/types/api/grid';
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
  ReadGeneralSettingsRequest,
  ReadGeneralSettingsResponse,
  ExportAddressesRequest,
  AddressBookFilter,
  MassUploadEnvironment,
} from '@/types/api/orderpoints';
import type {
  FeedbackSubmissionRequest,
  FeedbackSubmissionResponse,
  UserProfileData,
  UpdateEmailRequest,
  UpdateEmailResponse,
} from '@/types/api';
import type { ListTeamMembersRequest, ListTeamMembersResponse } from '@/types/api/team';
import type {
  AddressDto as RmaAddressDto,
  DeleteRmaDraftsRequest,
  GenerateRmaNumberRequest,
  GenerateRmaNumberResponse,
  ListRmaDraftsRequest,
  ListRmaDraftsResponse,
  ReadRmaEntryRequest,
  ReadRmaEntryResponse,
  ReadRmaFromOrderRequest,
  ReadRmaGeneralSettingsRequest,
  ReadRmaSettingsRequest,
  ReadRmaSettingsResponse,
  RmaAuthItemDto,
  RmaHeaderDto,
  RmaHeaderSaveDto,
  RmaReadResponse,
  RmaSettingsDto,
  RmaShipItemDto,
  SaveRmaEntryRequest,
  SaveRmaEntryResponse,
} from '@/types/api/returntrak';

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

// ==========================
// Grid Views + Rows (AG Grid) API
// ==========================

// Fetch view definitions (columns, filters, defaults) for a resource
export async function listGridViews(resource: string): Promise<GridViewListData> {
  const body: ListGridViewsRequest = { action: 'list', views: [resource] };
  const res = await postJson<ListGridViewsResponse>('/api/views', body);
  return (res.data as any)[0];
}

// Select a saved view by id for a resource (server returns updated structure)
export async function selectGridView(resource: string, id: number): Promise<GridViewListData> {
  const body: SelectGridViewRequest = { action: 'select', view: resource, id } as any;
  const res = await postJson<ListGridViewsResponse>('/api/views', body as any);
  return (res.data as any)[0];
}

// Read rows from the rows endpoint provided by the view response
export async function readGridRows<T = any>(rowsUrl: string, payload: ReadGridRowsRequest): Promise<GridRowResponse<T>> {
  const res = await postJson<{ data: GridRowResponse<T> }>(rowsUrl, payload as any);
  return res.data as unknown as GridRowResponse<T>;
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
  
  // Debug logging to see the full response
  console.log('SaveDraft API response:', res);
  
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

export async function cloneOrder(body: CloneOrderBody): Promise<CreateOrderPointsResponse> {
  const res = await postJson<CreateOrderPointsResponse>('/api/orderpoints', body as any);
  return res.data as any;
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

// Address Book Export / Import
export async function exportAddresses(filter?: AddressBookFilter | null): Promise<void> {
  const body: ExportAddressesRequest = { action: 'export', page_num: 1, page_size: 100000, filter: filter ?? null } as any;
  // Use raw XHR download pattern via http helper
  const headers = { 'X-Download-Params': JSON.stringify(body) } as any;
  await httpRequestRaw<Blob>({ method: 'get', path: '/api/orderpoints', headers });
}

export async function importAddresses(file: File, action: string = 'import'): Promise<void> {
  const form = new FormData();
  form.append('file', file);
  await postFormData('/api/upload', form, { 'X-Upload-Params': JSON.stringify({ func: 'address_upload', action }) });
}

// Mass Upload - OrderPoints
export async function uploadMassOrders(file: File, environment: MassUploadEnvironment): Promise<{ message?: string }> {
  const form = new FormData();
  form.append('file', file);
  const headers = { 'X-Upload-Params': JSON.stringify({ func: 'mass_upload', environment }) } as Record<string, string>;
  const res = await postFormData<{ data?: { message?: string }; message?: string; error_message?: string }>('/api/upload', form, headers);
  // Normalize message from legacy which may return { data } or plain { message }
  const message = (res as any)?.data?.message || (res as any)?.message;
  return { message };
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

export async function toggleDraftTemplate(order_id: number, is_template: boolean): Promise<void> {
  const body: ToggleTemplateBody = { action: 'toggle_template', order_id, is_template } as any;
  await postJson<Record<string, never>>('/api/orderpoints', body);
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
  if (feedback.file) formData.append('file', feedback.file);

  // Send via our centralized multipart helper; params in header mimic legacy handler
  await postFormData('/api/upload', formData, {
    'X-Upload-Params': JSON.stringify({
      func: 'feedback_upload',
      type: feedback.type,
      message: feedback.message,
    }),
  });

  return { success: true, message: 'Feedback sent successfully' };
}


// ==========================
// Team Members API
// ==========================
export async function fetchTeamMembers(): Promise<ListTeamMembersResponse> {
  const body: ListTeamMembersRequest = { action: 'list' };
  const res = await postJson<ListTeamMembersResponse>('/api/member', body as any);
  return res.data;
}

// ==========================
// User Profile API
// ==========================
export async function updateUserEmail(email: string): Promise<UpdateEmailResponse> {
  const body: UpdateEmailRequest = {
    func: 'update_email',
    email
  };
  const res = await postJson<UpdateEmailResponse>('/api/profile', body);
  return res.data;
}

// ==========================
// OrderPoints Settings API
// ==========================
export async function readGeneralSettings(): Promise<ReadGeneralSettingsResponse> {
  const body: ReadGeneralSettingsRequest = { action: 'read_general' };
  const res = await postJson<ReadGeneralSettingsResponse>('/api/orderpoints', body as any);
  return res.data;
}

// ==========================
// ReturnTrak API
// ==========================

export async function readReturnTrakSettings(): Promise<RmaSettingsDto> {
  const body: ReadRmaSettingsRequest = { action: 'read_settings' };
  const res = await postJson<ReadRmaSettingsResponse>('/api/returntrak', body as any);
  return (res.data as unknown) as RmaSettingsDto;
}

export async function readReturnTrakGeneralSettings(): Promise<any> {
  const body: ReadRmaGeneralSettingsRequest = { action: 'read_general' } as any;
  const res = await postJson<any>('/api/returntrak', body);
  return res.data;
}

export async function generateRmaNumber(): Promise<string> {
  const body: GenerateRmaNumberRequest = { action: 'generate_number' };
  const res = await postJson<GenerateRmaNumberResponse>('/api/returntrak', body as any);
  return (res.data as any).number;
}

export async function readRmaEntry(rma_id: number): Promise<RmaReadResponse> {
  const body: ReadRmaEntryRequest = { action: 'read', rma_id } as any;
  const res = await postJson<ReadRmaEntryResponse>('/api/returntrak', body);
  return res.data as any;
}

export async function readRmaFromOrder(account_number: string, order_number: string): Promise<RmaReadResponse> {
  const body: ReadRmaFromOrderRequest = { action: 'read_from_order', order_number, account_number } as any;
  const res = await postJson<ReadRmaEntryResponse>('/api/returntrak', body);
  return res.data as any;
}

export async function saveRma(
  rma_header: RmaHeaderSaveDto,
  to_receive: RmaAuthItemDto[],
  to_ship: RmaShipItemDto[],
): Promise<SaveRmaEntryResponse> {
  const body: SaveRmaEntryRequest = { action: 'save', data: { rma_header, to_receive, to_ship } } as any;
  const res = await postJson<SaveRmaEntryResponse>('/api/returntrak', body);
  
  // Debug logging to see the full response
  console.log('SaveRma API response:', res);
  
  return res.data as any;
}

export async function listRmaDrafts(): Promise<ListRmaDraftsResponse['data']> {
  const body: ListRmaDraftsRequest = { action: 'list_drafts' } as any;
  const res = await postJson<ListRmaDraftsResponse>('/api/returntrak', body);
  return res.data as any;
}

export async function deleteRmaDrafts(rma_ids: number[]): Promise<void> {
  const body: DeleteRmaDraftsRequest = { action: 'delete_draft', rma_ids } as any;
  await postJson<Record<string, never>>('/api/returntrak', body);
}

