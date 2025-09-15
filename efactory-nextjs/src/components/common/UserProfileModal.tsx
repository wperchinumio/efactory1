import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  IconMail, 
  IconUser, 
  IconX, 
  IconBuilding, 
  IconKey, 
  IconMapPin, 
  IconEye, 
  IconCheck,
  IconAlertCircle,
  IconCopy,
  IconRefresh
} from '@tabler/icons-react';
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatAccountsVisibility = (accounts: string) => {
    if (!accounts) return 'No accounts visible';
    
    // Split by comma and create a more readable format
    const accountList = accounts.split(', ').map(account => {
      const [accountNum, region] = account.split(' - ');
      return { account: accountNum, region };
    });
    
    // Group by account number
    const grouped = accountList.reduce((acc, item) => {
      if (!acc[item.account]) acc[item.account] = [];
      acc[item.account].push(item.region);
      return acc;
    }, {} as Record<string, string[]>);
    
    return Object.entries(grouped).map(([account, regions]) => 
      `${account} (${regions.join(', ')})`
    ).join(', ');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader className="pb-3 border-b border-border-color">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-10 rounded-md">
                <IconUser className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-font-color">User Profile</DialogTitle>
                <p className="text-xs text-font-color-100">Manage your account information</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-primary-10 rounded-md transition-colors"
            >
              <IconX className="w-4 h-4 text-font-color-100" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-1">
            {/* User Information Card */}
            <Card className="border-border-color shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-font-color">
                  <IconUser className="w-4 h-4 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-primary-5 rounded-md">
                  <div className="flex items-center gap-2">
                    <IconUser className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-font-color-100">Username</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5">
                      {userData.username}
                    </Badge>
                    <button
                      onClick={() => copyToClipboard(userData.username)}
                      className="p-0.5 hover:bg-primary-10 rounded transition-colors"
                      title="Copy username"
                    >
                      <IconCopy className="w-3 h-3 text-font-color-100" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 bg-primary-5 rounded-md">
                  <div className="flex items-center gap-2">
                    <IconBuilding className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-font-color-100">Company</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-font-color">{userData.company_name}</div>
                    <div className="text-xs text-font-color-100">{userData.company_code}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Details Card */}
            <Card className="border-border-color shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-font-color">
                  <IconKey className="w-4 h-4 text-primary" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-primary-5 rounded-md">
                  <div className="flex items-center gap-2">
                    <IconKey className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-font-color-100">Policy Code</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
                    {userData.policy_code}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2 bg-primary-5 rounded-md">
                  <div className="flex items-center gap-2">
                    <IconKey className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-font-color-100">Account #</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
                    {userData.policy_account}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2 bg-primary-5 rounded-md">
                  <div className="flex items-center gap-2">
                    <IconMapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-font-color-100">Region</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
                    {userData.policy_region}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Accounts Visibility Card - Full Width */}
            <Card className="lg:col-span-2 border-border-color shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-font-color">
                  <IconEye className="w-4 h-4 text-primary" />
                  Account Visibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-primary-5 rounded-md">
                  <div className="text-xs text-font-color-100 mb-1">Visible Accounts & Regions:</div>
                  <div className="text-xs font-medium text-font-color break-words leading-relaxed">
                    {formatAccountsVisibility(userData.accounts_visibility)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Management Card - Full Width */}
            <Card className="lg:col-span-2 border-border-color shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-font-color">
                  <IconMail className="w-4 h-4 text-primary" />
                  Email Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <IconMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-font-color-100" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-10 text-sm"
                  />
                </div>
                
                <Button
                  onClick={handleUpdateEmail}
                  loading={isUpdating}
                  disabled={isUpdating}
                  className="w-full h-10 text-sm font-medium"
                >
                  {isUpdating ? (
                    <>
                      <IconRefresh className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <IconCheck className="w-4 h-4 mr-2" />
                      Update Email
                    </>
                  )}
                </Button>

                {updateMessage && (
                  <div className={`flex items-center gap-2 p-3 rounded-md text-sm ${
                    updateMessage.type === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {updateMessage.type === 'success' ? (
                      <IconCheck className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <IconAlertCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{updateMessage.text}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-border-color">
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-6 h-9 text-sm"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
