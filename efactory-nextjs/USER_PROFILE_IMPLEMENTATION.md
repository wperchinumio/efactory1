# User Profile Modal Implementation

This document describes the implementation of the User Profile Modal component that matches the legacy eFactory design.

## Overview

The User Profile Modal displays user details and allows updating the email address. It's integrated into the header's user profile dropdown and can be accessed by clicking "My Profile" in the user menu.

## Components

### 1. UserProfileModal (`src/components/common/UserProfileModal.tsx`)

A modal component that displays:
- **User Details Section**: Username, company name, company code, policy code, policy account, policy region, and accounts visibility
- **Email Address Section**: Input field for email with update functionality
- **API Integration**: Clean interface for updating email addresses

#### Props
```typescript
interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserProfileData;
}
```

#### Features
- Email validation
- Loading states during API calls
- Success/error message display
- Responsive design matching Luno theme
- Clean TypeScript interfaces

### 2. API Types (`src/types/api/index.ts`)

Added user profile related types:

```typescript
export interface UserProfileData {
  username: string;
  company_name: string;
  company_code: string;
  policy_code: string;
  policy_account: string;
  policy_region: string;
  accounts_visibility: string;
  email?: string;
}

export interface UpdateEmailRequest {
  func: 'update_email';
  email: string;
}

export interface UpdateEmailResponse {
  success: boolean;
  message: string;
}
```

### 3. API Service (`src/services/api.ts`)

Added API function for updating email:

```typescript
export async function updateUserEmail(email: string): Promise<UpdateEmailResponse> {
  const body: UpdateEmailRequest = {
    func: 'update_email',
    email
  };
  const res = await postJson<UpdateEmailResponse>('/api/profile', body);
  return res.data;
}
```

### 4. Header Integration (`src/components/partial/Header.tsx`)

The modal is integrated into the existing header component:
- Added state management for the modal
- Updated "My Profile" link to open the modal
- Added user profile data building from auth token
- Renders the modal conditionally

## Usage

### Basic Usage

```tsx
import UserProfileModal from '@/components/common/UserProfileModal';
import type { UserProfileData } from '@/types/api';

const [modalOpen, setModalOpen] = useState(false);
const userData: UserProfileData = {
  username: 'dem000',
  company_name: 'DCL Demo 1',
  company_code: 'DEM',
  policy_code: 'DEM',
  policy_account: '10501',
  policy_region: 'LA',
  accounts_visibility: '10501 - FR, 10502 - FR, 10503 - FR, 10505 - FR, 10501 - LA, 10502 - LA, 10503 - LA, 10505 - LA, 10501 - LN, 10501 - YK, 10504 - EU, 10506 - EX',
  email: 'demo@example.com'
};

<UserProfileModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  userData={userData}
/>
```

### Integration with Header

The modal is automatically available in the header's user profile dropdown. Users can access it by:
1. Clicking the user icon in the header
2. Selecting "My Profile" from the dropdown menu

## API Endpoint

The email update functionality expects a POST request to `/api/profile` with the following structure:

```json
{
  "func": "update_email",
  "email": "user@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "Email updated successfully"
}
```

## Styling

The component uses the Luno theme system with:
- CSS custom properties for theming
- Responsive design
- Consistent spacing and typography
- Hover and focus states
- Loading states

## Demo Page

A demo page is available at `/demo-user-profile` that shows:
- Sample user data
- Modal functionality
- API integration details
- Feature list

## Error Handling

The component includes comprehensive error handling:
- Email validation (format checking)
- API error handling
- User feedback for success/error states
- Loading states during API calls

## TypeScript Support

Full TypeScript support with:
- Strict typing for all props and data
- API request/response interfaces
- User profile data interface
- Component prop interfaces

## Future Enhancements

The right section of the modal is reserved for future profile settings that might be added later, maintaining the same layout structure as the legacy design.
