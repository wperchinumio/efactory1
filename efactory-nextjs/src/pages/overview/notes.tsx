import { useState, useEffect, useRef } from 'react';
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [useFullHeight, setUseFullHeight] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

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

  // Check if browser height is <= 400px and disable height calculations
  // Also check if height is in middle range (400px-612px) and adjust accordingly
  useEffect(() => {
    const checkHeight = () => {
      const height = window.innerHeight;
      if (height <= 400) {
        setUseFullHeight(true); // Use full height for small screens
      } else if (height <= 612) {
        setUseFullHeight(true); // Use full height for middle range too
      } else {
        setUseFullHeight(false); // Use calculated heights for large screens
      }
    };
    
    checkHeight();
    window.addEventListener('resize', checkHeight);
    return () => window.removeEventListener('resize', checkHeight);
  }, []);

  // Auto-resize textarea when in full height mode
  useEffect(() => {
    if (useFullHeight && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [noteContent, useFullHeight]);

  // Initialize line numbers scroll behavior
  useEffect(() => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.style.scrollBehavior = 'auto';
    }
  }, []);

  // Handle body overflow for delete dialog
  useEffect(() => {
    document.body.classList[showDeleteDialog ? "add" : "remove"]("overflow-hidden");
  }, [showDeleteDialog]);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const fetchedNotes = await fetchNotes();
      setNotes(fetchedNotes);
      if (fetchedNotes.length > 0 && !selectedNoteId && fetchedNotes[0]) {
        setSelectedNoteId(fetchedNotes[0].id);
      }
      
    } catch (error) {
      console.error('Failed to load notes:', error);
      // Silent error handling - just log to console
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) return;
    
    try {
      setIsLoading(true);
      const newNote = await createNote({ title: newNoteTitle.trim() });
      
      // Close dialog first
      setNewNoteTitle('');
      setShowCreateDialog(false);
      
      // Reload notes list like legacy code does
      await loadNotes();
      
      // Select the new note
      setSelectedNoteId(newNote.id);
      
      // Success message like legacy system
      console.log('Note created successfully:', newNote);
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNoteId) return;

    const selectedNote = notes.find(n => n.id === selectedNoteId);
    if (!selectedNote) return;

    try {
      setIsLoading(true);
      
      // Send the ENTIRE note object like legacy code does
      const noteToSave = {
        ...selectedNote,  // Spread all existing properties
        note: noteContent, // Override the content
        changed: true      // Mark as changed
      };
      
      await updateNote(noteToSave);
      
      // Reload notes list like legacy code does and keep selection
      const currentSelectedId = selectedNoteId;
      await loadNotes();
      setSelectedNoteId(currentSelectedId);
      
      // Success message like legacy system
      console.log('Note saved successfully:', noteToSave);
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = (noteId: number) => {
    setNoteToDelete(noteId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      setIsLoading(true);
      await deleteNote(noteToDelete);
      
      // Close dialog
      setShowDeleteDialog(false);
      setNoteToDelete(null);
      
      // Reload notes list like legacy code does
      await loadNotes();
      
      // Success message like legacy system
      console.log('Note deleted successfully:', noteToDelete);
    } catch (error) {
      console.error('Failed to delete note:', error);
      // Even on error, reload notes like legacy code does
      await loadNotes();
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDeleteNote = () => {
    setShowDeleteDialog(false);
    setNoteToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleTextareaScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      // Instant scroll sync - no animation, no smooth behavior
      lineNumbersRef.current.style.scrollBehavior = 'auto';
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Calculate line height and ensure perfect sync
  const getLineCount = () => {
    if (!noteContent) return 1;
    return noteContent.split('\n').length;
  };

  const lineHeight = 21; // 14px font * 1.5 line-height = 21px

  // Instant sync after content changes - no delays
  useEffect(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      // Force immediate scroll sync with no smooth behavior
      lineNumbersRef.current.style.scrollBehavior = 'auto';
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, [noteContent]);

  // Handle paste events for instant sync
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Prevent any scroll animation during paste
    if (lineNumbersRef.current) {
      lineNumbersRef.current.style.scrollBehavior = 'auto';
    }
    
    // Let the default paste happen first
    setTimeout(() => {
      if (textareaRef.current && lineNumbersRef.current) {
        // Force immediate sync after paste - no animation
        lineNumbersRef.current.style.scrollBehavior = 'auto';
        lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
      }
    }, 0);
  };

  const safeNotes = Array.isArray(notes) ? notes : [];
  const filteredNotes = safeNotes.filter(note => {
    if (!searchFilter || searchFilter.trim() === '') return true;
    
    const searchTerm = searchFilter.toLowerCase();
    const title = note.title || '';
    const content = note.note || '';
    
    return (
      title.toLowerCase().includes(searchTerm) ||
      content.toLowerCase().includes(searchTerm)
    );
  });

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  return (
    <div 
      className="notes-container"
      style={{ 
        display: 'flex', 
        height: useFullHeight ? 'auto' : 'calc(100vh - 80px)', 
        backgroundColor: 'var(--body-color)',
        overflow: useFullHeight ? 'visible' : 'hidden'
      }}>
      {/* Sidebar */}
      <div 
        className="notes-sidebar"
        style={{ 
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
        <div 
          className="scroll-area"
          style={{ 
            flex: 1, 
            padding: '8px',
            maxHeight: useFullHeight ? 'none' : 'calc(100vh - 200px)',
            overflow: useFullHeight ? 'visible' : 'auto'
          }}>
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
      <div 
        className="notes-main-content"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                <div 
                  className="edit-preview-toggle"
                  style={{ 
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
            <div 
              className="notes-content-area"
              style={{ 
                flex: 1, 
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '400px',
                maxHeight: useFullHeight ? 'none' : 'calc(100vh - 160px)',
                overflow: useFullHeight ? 'visible' : 'hidden'
              }}>
              {!isPreviewMode ? (
                <div style={{
                  width: '100%',
                  flex: useFullHeight ? 'none' : 1,
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--card-color)',
                  display: 'flex',
                  flexDirection: 'row',
                  overflow: useFullHeight ? 'visible' : 'hidden',
                  height: useFullHeight ? 'auto' : 'auto',
                  maxHeight: useFullHeight ? 'none' : 'auto'
                }}>
                  {/* Line Numbers */}
                  <div 
                    ref={lineNumbersRef}
                    className="line-numbers"
                    style={{
                      width: '50px',
                      backgroundColor: 'var(--font-color-200)',
                      borderRight: '1px solid var(--border-color)',
                      padding: '12px 0',
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      color: 'var(--font-color-100)',
                      textAlign: 'right',
                      lineHeight: '1.5',
                      userSelect: 'none',
                      overflow: useFullHeight ? 'visible' : 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                      flexGrow: 0,
                      flexBasis: '50px',
                      height: useFullHeight ? 'auto' : '100%',
                      maxHeight: useFullHeight ? 'none' : 'none',
                      minHeight: useFullHeight ? 'auto' : 'auto'
                    }}>
                    <div style={{
                      paddingRight: '4px'
                    }}>
                      {Array.from({ length: getLineCount() }, (_, index) => (
                        <div 
                          key={index + 1}
                          style={{ 
                            height: `${lineHeight}px`,
                            lineHeight: `${lineHeight}px`,
                            fontSize: '14px',
                            textAlign: 'right',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            minHeight: `${lineHeight}px`
                          }}
                        >
                          {index + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    onScroll={handleTextareaScroll}
                    onPaste={handlePaste}
                    placeholder="Type your note here... (Markdown supported)"
                    className={useFullHeight ? "" : "scroll-area"}
                    style={{
                      flex: useFullHeight ? 1 : 1,
                      width: '100%',
                      height: useFullHeight ? 'auto' : '100%',
                      minHeight: useFullHeight ? 'auto' : 'auto',
                      maxHeight: useFullHeight ? 'none' : 'auto',
                      padding: '12px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--font-color)',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      lineHeight: `${lineHeight}px`,
                      resize: 'none',
                      outline: 'none',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      overflow: useFullHeight ? 'visible' : 'auto',
                      scrollbarWidth: useFullHeight ? 'none' : 'auto',
                      msOverflowStyle: useFullHeight ? 'none' : 'auto'
                    }}
                  />
                </div>
              ) : (
                <div 
                  className="scroll-area"
                  style={{
                    width: '100%',
                    flex: 1,
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--card-color)',
                    color: 'var(--font-color)'
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
                    <span><strong>Markdown supported:</strong> **bold**, *italic*, `code`, # headers, - lists, [links](url), ```code blocks```, &gt; quotes, tables, and more!</span>
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

      {/* Delete Confirmation Dialog - Luno Style */}
      {showDeleteDialog && (
        <>
          <div className="fixed p-4 w-full max-w-[500px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[6]">
            <div className="bg-card-color rounded-lg overflow-hidden" style={{ boxShadow: 'var(--shadow-lg)' }}>
              <div className="p-4 flex gap-5 justify-between border-b border-border-color">
                <p className="text-[20px]/[26px] font-medium">
                  Delete Note
                </p>
                <button onClick={cancelDeleteNote}>
                  <IconX />
                </button>
              </div>
              <div className="py-6 px-6">
                <div className="mb-6">
                  <p className="text-font-color-100 mb-4">
                    Are you sure you want to delete this note? This action cannot be undone.
                  </p>
                  {noteToDelete && (
                    <div className="bg-body-color p-3 rounded-md">
                      <p className="font-medium text-sm">
                        {notes.find(n => n.id === noteToDelete)?.title || 'Untitled Note'}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-stretch gap-3">
                  <button 
                    onClick={cancelDeleteNote} 
                    className="btn btn-secondary flex-1"
                    disabled={isLoading}
                    style={{ fontSize: '14px', padding: '8px 16px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDeleteNote} 
                    className="btn btn-danger flex-1"
                    disabled={isLoading}
                    style={{ fontSize: '14px', padding: '8px 16px' }}
                  >
                    {isLoading ? 'Deleting...' : 'Delete Note'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div onClick={cancelDeleteNote} className="fixed z-[5] w-full h-full left-0 top-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)' }}></div>
        </>
      )}

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
            <div className="flex items-stretch gap-3">
              <button
                onClick={() => setShowCreateDialog(false)}
                className="btn btn-secondary flex-1"
                style={{ fontSize: '14px', padding: '8px 16px' }}
              >
                Close
              </button>
              <button
                onClick={handleCreateNote}
                disabled={!newNoteTitle.trim() || isLoading}
                className="btn btn-primary flex-1"
                style={{ 
                  fontSize: '14px', 
                  padding: '8px 16px',
                  opacity: !newNoteTitle.trim() || isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? 'Creating...' : 'Add Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}