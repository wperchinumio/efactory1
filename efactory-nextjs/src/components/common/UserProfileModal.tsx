import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { IconMail, IconUser, IconX } from '@tabler/icons-react';
import { updateUserEmail } from '@/services/api';
import type { UserProfileData } from '@/types/api';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserProfileData;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  open,
  onOpenChange,
  userData
}) => {
  const [email, setEmail] = useState(userData.email || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Reset email when modal opens or userData changes
  useEffect(() => {
    if (open) {
      setEmail(userData.email || '');
      setUpdateMessage(null);
    }
  }, [open, userData.email]);

  const handleUpdateEmail = async () => {
    if (!email.trim()) {
      setUpdateMessage({ type: 'error', text: 'Please enter an email address' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setUpdateMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      const response = await updateUserEmail(email);
      if (response.success) {
        setUpdateMessage({ type: 'success', text: 'Email updated successfully!' });
        // Update the userData with new email
        userData.email = email;
      } else {
        setUpdateMessage({ type: 'error', text: response.message || 'Failed to update email' });
      }
    } catch (error) {
      setUpdateMessage({ 
        type: 'error', 
        text: 'An error occurred while updating email. Please try again.' 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setUpdateMessage(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconUser className="w-6 h-6 text-primary" />
              <DialogTitle>User profile</DialogTitle>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
            {/* User Detail Section */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
                User Detail
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Username:</span>
                  <span className="text-sm font-medium">{userData.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Company Name:</span>
                  <span className="text-sm font-medium">{userData.company_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Company Code:</span>
                  <span className="text-sm font-medium">{userData.company_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Policy Code:</span>
                  <span className="text-sm font-medium">{userData.policy_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Policy Account #:</span>
                  <span className="text-sm font-medium">{userData.policy_account}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Policy Region:</span>
                  <span className="text-sm font-medium">{userData.policy_region}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">Accounts Visibility:</span>
                  <span className="text-sm font-medium break-words">
                    {userData.accounts_visibility}
                  </span>
                </div>
              </div>
            </div>

            {/* E-mail address Section */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
                E-mail address
              </h3>
              <div className="space-y-3">
                <div className="relative">
                  <IconMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="E-mail address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={handleUpdateEmail}
                  loading={isUpdating}
                  disabled={isUpdating}
                  className="w-full"
                >
                  UPDATE E-MAIL ADDRESS
                </Button>
                {updateMessage && (
                  <div className={`text-sm p-3 rounded-md ${
                    updateMessage.type === 'success' 
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {updateMessage.text}
                  </div>
                )}
              </div>
            </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-6"
          >
            CLOSE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
