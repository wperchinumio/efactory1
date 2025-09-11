import { useState, useEffect } from 'react';
import { fetchNotes, createNote, updateNote, deleteNote } from '@/services/api';
import type { Note } from '@/types/api/notes';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { 
  IconPlus, 
  IconEdit, 
  IconEye, 
  IconX, 
  IconDeviceFloppy,
  IconNote,
  IconInfoCircle
} from '@tabler/icons-react';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Update content when selected note changes
  useEffect(() => {
    if (selectedNoteId) {
      const note = notes.find(n => n.id === selectedNoteId);
      setNoteContent(note?.note || '');
    } else {
      setNoteContent('');
    }
  }, [selectedNoteId, notes]);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const fetchedNotes = await fetchNotes();
      setNotes(fetchedNotes);
      if (fetchedNotes.length > 0 && !selectedNoteId) {
        setSelectedNoteId(fetchedNotes[0].id);
      }
      console.log('Notes loaded successfully:', fetchedNotes.length, 'notes');
    } catch (error) {
      console.error('Failed to load notes:', error);
      // Show user-friendly message
      alert('Failed to load notes. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) return;
    
    try {
      setIsLoading(true);
      const newNote = await createNote({ title: newNoteTitle.trim() });
      setNotes(prev => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
      setNewNoteTitle('');
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNoteId) return;

    try {
      setIsLoading(true);
      const updatedNote = await updateNote({
        id: selectedNoteId,
        note: noteContent,
        changed: true,
      });
      setNotes(prev => prev.map(n => n.id === selectedNoteId ? updatedNote : n));
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      setIsLoading(true);
      await deleteNote(noteId);
      setNotes(prev => prev.filter(n => n.id !== noteId));
      if (selectedNoteId === noteId) {
        const remainingNotes = notes.filter(n => n.id !== noteId);
        setSelectedNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredNotes = notes.filter(note => {
    const searchTerm = searchFilter.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchTerm) ||
      note.note.toLowerCase().includes(searchTerm)
    );
  });

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 120px)', 
      backgroundColor: 'var(--body-color)' 
    }}>
      {/* Sidebar */}
      <div style={{ 
        width: '320px', 
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '16px', 
          borderBottom: '1px solid var(--border-color)' 
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px' 
          }}>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: 'var(--font-color)',
              margin: 0
            }}>
              Notebook
            </h1>
            <button
              onClick={() => setShowCreateDialog(true)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconPlus size={16} />
            </button>
          </div>
          
          {/* Search */}
          <input
            type="text"
            placeholder="filter"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              backgroundColor: 'var(--card-color)',
              color: 'var(--font-color)'
            }}
          />
        </div>

        {/* Notes List */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
          {filteredNotes.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '32px 16px', 
              color: 'var(--font-color-100)' 
            }}>
              {notes.length === 0 ? 'No notes yet. Create your first note!' : 'No notes match your search.'}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: selectedNoteId === note.id ? 'var(--primary-10)' : 'var(--card-color)',
                  border: selectedNoteId === note.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  position: 'relative'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start' 
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: 'var(--font-color)',
                      margin: '0 0 4px 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {note.title}
                    </h3>
                    <p style={{ 
                      fontSize: '12px', 
                      color: 'var(--font-color-100)',
                      margin: '0 0 8px 0',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {note.note || 'No content'}
                    </p>
                    <div style={{ 
                      fontSize: '11px', 
                      color: 'var(--font-color-100)' 
                    }}>
                      {formatDate(note.created_at)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                      border: 'none',
                      background: 'none',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconX size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedNote ? (
          <>
            {/* Content Header */}
            <div style={{ 
              padding: '16px', 
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: 'var(--font-color)',
                  margin: '0 0 4px 0'
                }}>
                  {selectedNote.title}
                </h2>
                <p style={{ 
                  fontSize: '14px', 
                  color: 'var(--font-color-100)',
                  margin: 0
                }}>
                  Created on {formatDate(selectedNote.created_at)}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {/* Edit/Preview Toggle */}
                <div style={{ 
                  display: 'flex', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setIsPreviewMode(false)}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      backgroundColor: !isPreviewMode ? 'var(--primary)' : 'var(--card-color)',
                      color: !isPreviewMode ? 'white' : 'var(--font-color)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <IconEdit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => setIsPreviewMode(true)}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      backgroundColor: isPreviewMode ? 'var(--primary)' : 'var(--card-color)',
                      color: isPreviewMode ? 'white' : 'var(--font-color)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <IconEye size={14} />
                    Preview
                  </button>
                </div>
                <button
                  onClick={handleSaveNote}
                  disabled={isLoading}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <IconDeviceFloppy size={16} />
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, padding: '16px' }}>
              {!isPreviewMode ? (
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Type your note here... (Markdown supported)"
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--card-color)',
                    color: 'var(--font-color)',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    resize: 'none',
                    outline: 'none'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  padding: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--card-color)',
                  color: 'var(--font-color)',
                  overflow: 'auto'
                }}>
                  {noteContent.trim() ? (
                    <div className="prose">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      >
                        {noteContent}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div style={{ 
                      color: 'var(--font-color-100)', 
                      fontStyle: 'italic',
                      textAlign: 'center',
                      paddingTop: '40px'
                    }}>
                      No content to preview. Switch to Edit mode to add content.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Info Bar */}
            <div style={{ 
              padding: '12px 16px', 
              borderTop: '1px solid var(--border-color)',
              fontSize: '12px',
              color: 'var(--font-color-100)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {!isPreviewMode ? (
                  <>
                    <IconInfoCircle size={14} />
                    <span><strong>Markdown supported:</strong> **bold**, *italic*, `code`, # headers, - lists, [links](url), ```code blocks```, > quotes, tables, and more!</span>
                  </>
                ) : (
                  <>
                    <IconEye size={14} />
                    <span><strong>Preview Mode:</strong> Viewing rendered markdown. Switch to Edit mode to make changes.</span>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                color: 'var(--font-color-100)', 
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <IconNote size={48} />
              </div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '500', 
                color: 'var(--font-color)',
                margin: '0 0 8px 0'
              }}>
                No Note Selected
              </h3>
              <p style={{ 
                color: 'var(--font-color-100)',
                margin: 0
              }}>
                {notes.length === 0 
                  ? 'Create your first note to get started' 
                  : 'Select a note from the sidebar to view and edit it'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Note Dialog */}
      {showCreateDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--card-color)',
            padding: '24px',
            borderRadius: '8px',
            width: '400px',
            maxWidth: '90vw'
          }}>
            <h3 style={{ 
              margin: '0 0 16px 0', 
              color: 'var(--font-color)' 
            }}>
              New Note
            </h3>
            <input
              type="text"
              placeholder="Type the note title"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateNote();
                }
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                backgroundColor: 'var(--card-color)',
                color: 'var(--font-color)',
                marginBottom: '16px'
              }}
            />
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={() => setShowCreateDialog(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  color: 'var(--font-color)',
                  cursor: 'pointer'
                }}
              >
                CLOSE
              </button>
              <button
                onClick={handleCreateNote}
                disabled={!newNoteTitle.trim() || isLoading}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  cursor: !newNoteTitle.trim() || isLoading ? 'not-allowed' : 'pointer',
                  opacity: !newNoteTitle.trim() || isLoading ? 0.6 : 1
                }}
              >
                ADD NOTE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}