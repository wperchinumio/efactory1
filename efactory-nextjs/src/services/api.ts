import { postJson, getJson, httpRequest, postJsonRaw, postFormData, httpRequestRaw } from '@/lib/api/http';
import type {
  GridRowResponse,
  GridSelectedView,
  GridViewListData,
  ListGridViewsRequest,
  ListGridViewsResponse,
  ReadGridRowsRequest,
  SelectGridViewRequest,
  // Saved filters & export
  ListSavedFiltersRequest,
  ListSavedFiltersResponse,
  SelectSavedFilterRequest,
  UnsetSavedFilterRequest,
  GetAvailableFieldsRequest,
  GetAvailableFieldsResponse,
  CreateSavedFilterRequest,
  UpdateSavedFilterRequest,
  DeleteSavedFilterRequest,
  ExportGridRowsRequest,
  GetSavedFilterDetailRequest,
  SavedFilterDetailResponse,
} from '@/types/api/grid';
import type {
  CreateScheduleRequest,
  DeleteScheduleRequest,
  ReadSchedulesRequest,
  ReadSchedulesResponse,
  SchedulerTask,
  UpdateScheduleRequest,
} from '@/types/api/scheduler';
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
  ListDraftsBody,
  ListDraftsResponse,
  OrderDetailDto as OPOrderDetailDto,
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
  UpdateOrderResponse,
  // FTP Batches
  FtpBatchRow,
  ListFtpBatchesBody,
  ListFtpBatchesResponse,
} from '@/types/api/orderpoints';
import type {
  InventoryItemForCartDto,
  InventoryStatusForCartBody,
  ReadDangerousGoodsBody,
  ReadDangerousGoodsResponse,
  UpdateDangerousGoodsBody,
  ReadLotRevisionBody,
  ReadLotRevisionResponse,
  UpdateLotRevisionBody,
  ReadBundleDataBody,
  ReadBundleDataResponse,
  SaveBundleDataBody,
  ExpireBundleBody,
  EditAsnLineBody,
  CancelAsnLineBody,
  CloseShortAsnLineBody,
  ReadItemDetailBody,
  ReadItemDetailResponse,
  UpdateItemBody,
  UpdateItemResponse,
  ReadCyclecountChartBody,
  ReadCyclecountChartResponse,
} from '@/types/api/inventory';
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
import type {
  OrderDetailDto as OrdersOrderDetailDto,
  ReadOrderDetailRequest,
  ReadOrderDetailResponse,
  OrderDetailResult,
  PutOnHoldBody as OrdersPutOnHoldBody,
  CancelOrderBody as OrdersCancelOrderBody,
  TransferOrderBody as OrdersTransferOrderBody,
  CloneOrderBody as OrdersCloneOrderBody,
  ResendShipConfirmationBody,
} from '@/types/api/orders';

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

// In-flight dedupe: prevent duplicate concurrent /views calls (e.g., StrictMode double mount)
const viewListInFlight = new Map<string, Promise<GridViewListData>>();

// Fetch view definitions (columns, filters, defaults) for a resource
export async function listGridViews(resource: string): Promise<GridViewListData> {
  const cacheKey = `list:${resource}`;
  const inFlight = viewListInFlight.get(cacheKey);
  if (inFlight) return inFlight;

  const promise = (async () => {
    const body: ListGridViewsRequest = { action: 'list', views: [resource] };
    const res = await postJson<ListGridViewsResponse>('/api/views', body);
    const data = (res.data as any)[0] as GridViewListData;
    viewListInFlight.delete(cacheKey);
    return data;
  })();

  viewListInFlight.set(cacheKey, promise);
  return promise;
}

// Select a saved view by id for a resource (server returns updated structure)
export async function selectGridView(resource: string, id: number): Promise<GridViewListData> {
  const cacheKey = `select:${resource}:${id}`;
  const inFlight = viewListInFlight.get(cacheKey);
  if (inFlight) return inFlight;

  const promise = (async () => {
    const body: SelectGridViewRequest = { action: 'select', view: resource, id } as any;
    const res = await postJson<ListGridViewsResponse>('/api/views', body as any);
    const data = (res.data as any)[0] as GridViewListData;
    viewListInFlight.delete(cacheKey);
    return data;
  })();

  viewListInFlight.set(cacheKey, promise);
  return promise;
}

// Read rows from the rows endpoint provided by the view response
export async function readGridRows<T = any>(rowsUrl: string, payload: ReadGridRowsRequest): Promise<GridRowResponse<T>> {
  const res = await postJson<{ data: GridRowResponse<T> }>(rowsUrl, payload as any);
  return res.data as unknown as GridRowResponse<T>;
}

// ==========================
// Grid Saved Filters (Views API)
// ==========================

export async function listSavedFilters(resource: string): Promise<ListSavedFiltersResponse['data']> {
  const body: ListSavedFiltersRequest = { action: 'list', resource: 'filter', view: resource } as any;
  const res = await postJson<ListSavedFiltersResponse>('/api/views', body as any);
  return (res.data as unknown) as any;
}

export async function selectSavedFilter(id: number): Promise<void> {
  const body: SelectSavedFilterRequest = { action: 'select', resource: 'filter', id } as any;
  await postJson<Record<string, never>>('/api/views', body as any);
}

export async function unsetSavedFilter(resource: string): Promise<void> {
  const body: UnsetSavedFilterRequest = { action: 'unset', resource: 'filter', view: resource } as any;
  await postJson<Record<string, never>>('/api/views', body as any);
}

export async function getAvailableFieldsForView(resource: string, viewId: number) {
  const body: GetAvailableFieldsRequest = { action: 'detail', view: resource, id: viewId } as any;
  const res = await postJson<GetAvailableFieldsResponse>('/api/views', body as any);
  return res.data;
}

export async function createSavedFilter(resource: string, name: string, description: string | undefined, filter: any): Promise<void> {
  const body: CreateSavedFilterRequest = { action: 'create', resource: 'filter', view: resource, data: { name, description, filter } } as any;
  await postJson<Record<string, never>>('/api/views', body as any);
}

export async function updateSavedFilter(id: number, name: string, description: string | undefined, filter: any): Promise<void> {
  const body: UpdateSavedFilterRequest = { action: 'update', resource: 'filter', id, data: { name, description, filter } } as any;
  await postJson<Record<string, never>>('/api/views', body as any);
}

export async function deleteSavedFilter(id: number): Promise<void> {
  const body: DeleteSavedFilterRequest = { action: 'delete', resource: 'filter', id } as any;
  await postJson<Record<string, never>>('/api/views', body as any);
}

export async function getSavedFilterDetail(id: number): Promise<SavedFilterDetailResponse['data']> {
  const body: GetSavedFilterDetailRequest = { action: 'get', resource: 'filter', id } as any;
  const res = await postJson<SavedFilterDetailResponse>('/api/views', body as any);
  return res.data as any;
}

// ==========================
// Grid Export (Rows endpoint)
// ==========================

export async function exportGridRows(rowsUrl: string, request: ExportGridRowsRequest): Promise<void> {
  // Use httpRequestRaw to trigger browser download; legacy expects JSON in X-Download-Params
  const headers = { 'X-Download-Params': JSON.stringify(request) } as any;
  await httpRequestRaw<Blob>({ method: 'get', path: rowsUrl, headers });
}

// ==========================
// Scheduler API
// ==========================

export async function readSchedules(): Promise<ReadSchedulesResponse['data']> {
  const body: ReadSchedulesRequest = { action: 'read_tasks' };
  const res = await postJson<ReadSchedulesResponse>('/api/scheduler', body as any);
  return res.data as any;
}

export async function createSchedule(task: SchedulerTask): Promise<{ id?: number }> {
  const body: CreateScheduleRequest = { action: 'create_task', task } as any;
  const res = await postJson<{ data: { id?: number } }>('/api/scheduler', body as any);
  return (res.data as any) || {};
}

export async function updateSchedule(id: number, task: SchedulerTask): Promise<void> {
  const body: UpdateScheduleRequest = { action: 'update_task', id, task } as any;
  await postJson<Record<string, never>>('/api/scheduler', body as any);
}

export async function deleteSchedule(id: number): Promise<void> {
  const body: DeleteScheduleRequest = { action: 'delete_task', id } as any;
  await postJson<Record<string, never>>('/api/scheduler', body as any);
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

export async function saveEntry(order_header: OrderHeaderDto, order_detail: OPOrderDetailDto[], order_id?: number, from_draft?: boolean): Promise<SaveEntryResponse> {
  const body: CreateOrderPointsBody = {
    action: 'create',
    to_draft: false,
    from_draft: from_draft || false,
    data: { 
      order_header: order_id ? { ...order_header, order_id } : order_header, 
      order_detail 
    },
  };
  const res = await postJson<SaveEntryResponse>('/api/orderpoints', body as any);
  return res.data;
}

export async function saveDraft(order_header: OrderHeaderDto, order_detail: OPOrderDetailDto[]): Promise<CreateOrderPointsResponse> {
  const body: CreateOrderPointsBody = {
    action: 'create',
    to_draft: true,
    version: 2,
    data: { order_header, order_detail },
  };
  const res = await postJson<CreateOrderPointsResponse>('/api/orderpoints', body as any);
  
  
  return res.data;
}

export async function updateDraft(order_id: number, order_header: OrderHeaderDto, order_detail: OPOrderDetailDto[]): Promise<CreateOrderPointsResponse> {
  const body: UpdateOrderPointsBody = {
    action: 'update',
    from_draft: true,
    data: { 
      order_header: { ...order_header, order_id },
      order_detail 
    },
  };
  const res = await postJson<CreateOrderPointsResponse>('/api/orderpoints', body as any);
  
  
  return res.data;
}

export async function updateOrder(order_id: number, order_header: OrderHeaderDto, order_detail: OPOrderDetailDto[]): Promise<UpdateOrderResponse> {
  const body: UpdateOrderPointsBody = {
    action: 'update',
    from_draft: false,
    data: { 
      order_header: { ...order_header, order_id },
      order_detail 
    },
  };
  const res = await postJson<UpdateOrderResponse>('/api/orderpoints', body as any);
  
  
  return res.data as any;
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

// ==========================
// Inventory: DG Data
// ==========================
export async function readDangerousGoods(item_number: string, account_wh: string): Promise<ReadDangerousGoodsResponse['data']> {
  const body: ReadDangerousGoodsBody = { action: 'get_dg_data', item_number, account_wh };
  const res = await postJson<ReadDangerousGoodsResponse>('/api/inventory', body as any);
  return res.data as any;
}

export async function updateDangerousGoods(data: UpdateDangerousGoodsBody['data']): Promise<void> {
  const body: UpdateDangerousGoodsBody = { action: 'post_dg_data', data };
  await postJson<Record<string, never>>('/api/inventory', body as any);
}

// ==========================
// Inventory: Lot Revision
// ==========================
export async function readLotRevision(payload: ReadLotRevisionBody): Promise<ReadLotRevisionResponse['data']> {
  const res = await postJson<ReadLotRevisionResponse>('/api/inventory', payload as any);
  return res.data as any;
}

export async function updateLotRevision(lot_master: UpdateLotRevisionBody['data']): Promise<void> {
  const body: UpdateLotRevisionBody = { action: 'post_lot_revision', data: lot_master };
  await postJson<Record<string, never>>('/api/inventory', body as any);
}

// ==========================
// Inventory: Bundle & ASN Helpers
// ==========================
export async function readBundleData(bundle_item_id: number, warehouseRegion: string): Promise<ReadBundleDataResponse['data']> {
  const body: ReadBundleDataBody = { action: 'get_bundle_data', bundle_item_id, warehouse: warehouseRegion };
  const res = await postJson<ReadBundleDataResponse>('/api/inventory', body as any);
  return res.data as any;
}

export async function saveBundleData(data: SaveBundleDataBody['data']): Promise<void> {
  const body: SaveBundleDataBody = { action: 'save_bundle_data', data };
  await postJson<Record<string, never>>('/api/inventory', body as any);
}

export async function expireBundle(bundle_item_id: number, warehouseRegion: string): Promise<void> {
  const body: ExpireBundleBody = { action: 'expire_bundle', data: { bundle_item_id, warehouse: warehouseRegion } };
  await postJson<Record<string, never>>('/api/inventory', body as any);
}

export async function editAsnLine(dcl_po: string | number, dcl_po_line: string | number, order_type: string, new_date: string): Promise<void> {
  const body: EditAsnLineBody = { action: 'edit_asn_line', data: { dcl_po, dcl_po_line, order_type, new_date } };
  await postJson<Record<string, never>>('/api/inventory', body as any);
}

export async function cancelAsnLine(dcl_po: string | number, dcl_po_line: string | number, order_type: string): Promise<void> {
  const body: CancelAsnLineBody = { action: 'cancel_asn_line', data: { dcl_po, dcl_po_line, order_type } };
  await postJson<Record<string, never>>('/api/inventory', body as any);
}

export async function closeShortAsnLine(dcl_po: string | number, dcl_po_line: string | number, order_type: string): Promise<void> {
  const body: CloseShortAsnLineBody = { action: 'close_short_asn_line', data: { dcl_po, dcl_po_line, order_type } };
  await postJson<Record<string, never>>('/api/inventory', body as any);
}

// ==========================
// Inventory: Item Detail (Invoices/Edit Item)
// ==========================
export async function readItemDetail(payload: ReadItemDetailBody): Promise<ReadItemDetailResponse['data']> {
  const res = await postJson<ReadItemDetailResponse>('/api/inventory', payload as any);
  return res.data as any;
}

export async function updateItem(payload: UpdateItemBody): Promise<UpdateItemResponse['data']> {
  const res = await postJson<UpdateItemResponse>('/api/inventory', payload as any);
  return res.data as any;
}

// ==========================
// Inventory: Cyclecount Chart (Analytics)
// ==========================
export async function readCyclecountChart(body: ReadCyclecountChartBody): Promise<ReadCyclecountChartResponse['data']> {
  const res = await postJson<ReadCyclecountChartResponse>('/api/inventory', body as any);
  return res.data as any;
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

// ==========================
// Order Detail (Fulfillment) API
// ==========================

export async function readOrderDetail(order_number: string, account_number?: string | null, policy_code?: string | number | null): Promise<OrderDetailResult> {
  const filters: any[] = [];
  if (order_number) filters.push({ order_num: order_number } as any);
  if (account_number && String(account_number).trim().length > 0) filters.push({ account_num: account_number } as any);

  const body: ReadOrderDetailRequest = {
    action: 'read',
    resource: 'order',
    page_num: 1,
    page_size: 2, // detect multiple by requesting 2
    sort: [{ order_date: 'desc' } as any],
    filter: { and: filters, or: [] },
    fields: ['*'],
    policy_code: policy_code ?? undefined,
  } as any;

  const res = await postJson<ReadOrderDetailResponse>('/api/fulfillment', body as any);
  const rows = (res?.data?.rows || res?.data?.data?.rows || (res as any)?.rows || []) as OrdersOrderDetailDto[];
  if (rows.length === 1) return { kind: 'single', order: rows[0] as OrdersOrderDetailDto };
  if (rows.length === 0) return { kind: 'not_found' };
  return { kind: 'multiple', orders: rows as OrdersOrderDetailDto[] };
}

// ==========================
// Order Detail toolbar actions (legacy parity)
// ==========================

export async function orderPutOnHold(order_id: number | string, location: string, reason: string): Promise<void> {
  const body: OrdersPutOnHoldBody = { action: 'on_hold', order_id, location, reason } as any;
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

export async function orderPutOffHold(order_id: number | string, location: string): Promise<void> {
  const body: OrdersPutOnHoldBody = { action: 'off_hold', order_id, location } as any;
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

export async function orderCancel(order_id: number | string, location: string): Promise<void> {
  const body: OrdersCancelOrderBody = { action: 'cancel_order', order_id, location } as any;
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

export async function orderTransfer(order_id: number | string, source_warehouse: string, destination_warehouse: string): Promise<void> {
  const body: OrdersTransferOrderBody = { action: 'transfer-order', order_id, source_warehouse, destination_warehouse } as any;
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

export async function orderCloneToDraft(order_number: string, account_number: string): Promise<{ total_drafts?: number; draft_order?: any }> {
  const body: OrdersCloneOrderBody = { action: 'clone_order', order_number, account_number } as any;
  const res = await postJson<{ data?: { total_drafts?: number; draft_order?: any } }>('/api/orderpoints', body as any);
  return (res as any).data || {};
}

export async function resendShipConfirmation(order_number: string, account_number: string, ship_to_email: string, bill_to_email: string): Promise<void> {
  const body: ResendShipConfirmationBody = { action: 'resend_ship_confirmation', order_number, account_number, ship_to_email, bill_to_email } as any;
  await postJson<Record<string, never>>('/api/orderpoints', body as any);
}

export async function readOrderFrom(order_id: number | string, location: string, from_draft: boolean = false): Promise<any> {
  const body = { action: 'read', order_id, location, from_draft } as any;
  const res = await postJson<{ data?: any }>('/api/orderpoints', body as any);
  return res.data;
}

// ==========================
// Invoicing: Document downloads (PDF/Excel)
// ==========================

export async function downloadInvoicePdf(doc_no: string | number): Promise<void> {
  // Legacy expects GET /api/documents/{doc_no}I
  const id = `${doc_no}I`;
  await httpRequestRaw<Blob>({ method: 'get', path: `/api/documents/${encodeURIComponent(String(id))}` });
}

export async function downloadInvoiceDetail(doc_no: string | number): Promise<void> {
  // Legacy expects GET /api/documents/{doc_no}D
  const id = `${doc_no}D`;
  await httpRequestRaw<Blob>({ method: 'get', path: `/api/documents/${encodeURIComponent(String(id))}` });
}

// ==========================
// OrderPoints: FTP Batches
// ==========================

export async function listFtpBatches(
  page_num: number,
  page_size: number,
  filter: any,
  sort: Array<Record<string, 'asc' | 'desc'>>,
): Promise<{ rows: FtpBatchRow[]; total: number }> {
  const body: ListFtpBatchesBody = {
    action: 'list_batches',
    filter,
    page_num,
    page_size,
    sort,
  } as any;
  const res = await postJson<{ data: ListFtpBatchesResponse }>('/api/orderpoints', body as any);
  return (res.data as unknown) as ListFtpBatchesResponse;
}

export async function downloadFtpBatch(id: number | string): Promise<void> {
  // Legacy uses POST with action params and triggers file download; emulate via raw GET header trick
  const headers = { 'X-Download-Params': JSON.stringify({ action: 'get_batch_content', id }) } as any;
  await httpRequestRaw<Blob>({ method: 'get', path: '/api/orderpoints', headers });
}

export async function downloadFtpAck(id: number | string): Promise<void> {
  const headers = { 'X-Download-Params': JSON.stringify({ action: 'get_ack_content', id }) } as any;
  await httpRequestRaw<Blob>({ method: 'get', path: '/api/orderpoints', headers });
}

