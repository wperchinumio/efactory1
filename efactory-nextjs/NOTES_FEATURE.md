# Personal Notes Feature

## Overview
The Personal Notes feature allows users to create, edit, and manage personal notes with full markdown support. This feature is integrated with the legacy eFactory API and provides a modern, responsive interface.

## Features

### ✅ Core Functionality
- **Create Notes**: Add new notes with custom titles
- **Edit Notes**: Real-time editing with auto-save functionality
- **Delete Notes**: Remove notes with confirmation dialog
- **Search & Filter**: Find notes by title or content
- **Real-time Updates**: Changes are tracked and saved to the legacy API

### ✅ Markdown Support
The Notes feature includes full markdown support with:

#### Basic Formatting
- **Bold text**: `**bold**` or `__bold__`
- *Italic text*: `*italic*` or `_italic_`
- `Inline code`: `` `code` ``
- ~~Strikethrough~~: `~~text~~`

#### Headers
```markdown
# Header 1
## Header 2
### Header 3
#### Header 4
```

#### Lists
```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another item
   1. Nested item
```

#### Links and Images
```markdown
[Link text](https://example.com)
![Image alt text](image-url.jpg)
```

#### Code Blocks
```markdown
```javascript
function hello() {
  console.log("Hello, world!");
}
```
```

#### Tables
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

#### Blockquotes
```markdown
> This is a blockquote
> It can span multiple lines
```

### ✅ Theme Support
- **Light/Dark Mode**: Fully compatible with the application's theme system
- **Theme Colors**: Uses the selected Luno theme colors
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Proper contrast and keyboard navigation

### ✅ User Experience
- **Edit/Preview Toggle**: Switch between editing and preview modes
- **Live Preview**: See markdown rendered in real-time
- **Auto-save**: Changes are automatically tracked
- **Unsaved Changes Indicator**: Visual feedback for edited notes
- **Loading States**: Proper loading indicators during API calls
- **Error Handling**: User-friendly error messages

## API Integration

The Notes feature uses the legacy eFactory API endpoints:

- `GET /api/notes` - Fetch all notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update an existing note
- `DELETE /api/notes/:id` - Delete a note

All API calls are properly typed with TypeScript interfaces and include error handling.

## Navigation

The Notes feature is accessible through:
- **Sidebar Menu**: "Personal notes" under the Overview section
- **Direct URL**: `/notes`
- **App ID**: 3 (matches legacy system)

## Technical Implementation

### Technologies Used
- **React Markdown**: For markdown parsing and rendering
- **Remark GFM**: GitHub Flavored Markdown support
- **Rehype Highlight**: Code syntax highlighting
- **Tailwind CSS**: Styling and theming
- **Luno Components**: UI components for consistency

### Key Components
- **NotesPage**: Main page component with list/detail layout
- **API Service**: Typed API client for Notes endpoints
- **Types**: TypeScript interfaces for all data structures
- **Hooks**: Custom hooks for async operations and error handling

### File Structure
```
efactory-nextjs/
├── src/
│   ├── pages/
│   │   └── notes.tsx              # Main Notes page
│   ├── services/
│   │   └── api.ts                 # API client with Notes endpoints
│   ├── types/api/
│   │   └── notes.ts               # TypeScript interfaces
│   └── config/
│       └── navigation.ts          # Navigation configuration
└── styles/
    └── globals.css                # Markdown styling
```

## Usage Tips

1. **Creating Notes**: Click the "+" button in the sidebar to create a new note
2. **Editing**: Select a note and start typing in the edit mode
3. **Preview**: Use the "Preview" tab to see how your markdown will render
4. **Saving**: Changes are automatically tracked; click "Save" to persist them
5. **Searching**: Use the search box to filter notes by title or content
6. **Markdown Help**: The info bar at the bottom provides quick markdown tips

## Future Enhancements

Potential improvements for the Notes feature:
- [ ] Note categories/tags
- [ ] Export notes to various formats
- [ ] Note sharing capabilities
- [ ] Attachment support
- [ ] Full-text search with highlighting
- [ ] Note templates
- [ ] Collaborative editing
