// Notes API Types
export interface Note {
  id: number;
  title: string;
  note: string;
  created_at: string;
  updated_at?: string;
  changed?: boolean;
}

export interface GetNotesRequest {
  // No parameters needed for GET /api/notes
}

export interface GetNotesResponse {
  data: Note[];
}

export interface CreateNoteRequest {
  title: string;
}

export interface CreateNoteResponse {
  data: Note;
}

export interface UpdateNoteRequest {
  id: number;
  title?: string;
  note?: string;
  changed?: boolean;
}

export interface UpdateNoteResponse {
  data: Note;
}

export interface DeleteNoteRequest {
  id: number;
}

export interface DeleteNoteResponse {
  success: boolean;
}

// UI State Types
export interface NotesState {
  notes: Note[];
  selectedNoteId: number | null;
  isLoading: boolean;
  error: string | null;
}

export interface EditedNote {
  oldInput: string;
  newInput: string;
}

export interface EditedNotes {
  [noteId: number]: EditedNote;
}
