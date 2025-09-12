import React, { useState } from 'react';
import UserProfileModal from '@/components/common/UserProfileModal';
import Button from '@/components/ui/Button';
import type { UserProfileData } from '@/types/api';

const DemoUserProfilePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // Sample user data for demonstration (matching legacy structure)
  const sampleUserData: UserProfileData = {
    username: 'dem000',
    company_name: 'DCL Demo 1',
    company_code: 'DEM',
    policy_code: 'DEM',
    policy_account: '10301',
    policy_region: 'LA',
    accounts_visibility: 'LN,EX - LN,EX, LN - LN, FR,LA,LN,EX,EU,LFS,YK - FR,LA,LN,EX,EU,LFS,YK, LN,LA,YK - LN,LA,YK, FR - FR, FR,LN - FR,LN, LA,FR,LT - LA,FR,LT, LN,LA,FR - LN,LA, FR, FR,EU - FR,EU, FR,LN - FR,LN, FR - FR, FR,LT - FR,LT, FR,LA,LN,EX - FR,LA,LN, EX, FR - FR, LA - LA, FR,EX,LA - FR,EX, LA, LA,EX,LN - LA,EX,LN, FR - FR, EU - EU, FR,LA, YK - FR,LA, YK, FR,EX, LA - FR,EX,LA, FR,LN - FR,LN, LT,FR,EX - LT,FR,EX, FR,LN,LA - FR,LN,LA, FR - FR, FR,EX - FR,EX, FR - FR, FR,LA - FR,LA, LA,LN - LA,LN, FR,LN - FR,LN, LN,LA, YK,FR - LN,LA, YK,FR, FR - FR, EX - EX, YK,LN,LA - YK,LN, LA, LA,EX, YK - LA,EX,YK, LT,EX - LT,EX, LA,LN - LA,LN, FR,LN - FR,LN, LN,FR - LN,FR, LN,LA - LN, LA, LA - LA, LN - LN, LN,LA - LN,LA, FR - FR, LN,LA, YK - LN,LA, YK, LA,FR,EX - LA,FR,EX, LN - LN, FR,LN - FR,LN, FR,LN - FR,LN, LA,LN,EX - LA,LN,EX, LN - LN, LA,YK - LA, YK, LA,FR, EU,EX,LN, YK - LA,FR, EU, EX,LN,YK, FR,LT,LN - FR,LT,LN, FR,LT,LN - FR, LT,LN, FR - FR, YK,LA - YK, LA, LA, YK - LA,YK, LN - LN, LA - LA, LN,YK - LN,YK, LA, YK - LA,YK, YK - YK, LA - LA, LA - LA, FR - FR, LN,FR - LN,FR, LN,LA, YK - LN,LA, YK, LA, YK - LA,YK, LN - LN, LN - LN, LN,FR - LN,FR, FR - FR, LA - LA, YK - YK, LA,YK - LA,YK, LN - LN, LN - LN, LN - LN, LN - LN, LN - LN, FR,LA, EU, LT,LN, YK - FR,LA, EU, LT,LN, YK, YK - YK, LN - LN, LN,FR - LN,FR, LN,FR - LN,FR, LN - LN, LN - LN, LN - LN, YK - YK, LN - LN, LA - LA, FR - FR, YK,LA - YK,LA, LN - LN, LN - LN, LN,LA - LN,LA, LN LN,CD - CD, LA - LA, CD - CD',
    email: 'demo@example.com'
  };

  return (
    <div className="min-h-screen bg-body-color p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-font-color mb-8">User Profile Modal Demo</h1>
        
        <div className="bg-card-color rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-font-color mb-4">Demo User Profile Modal</h2>
          <p className="text-font-color-100 mb-6">
            This demo shows the User Profile Modal component that matches the legacy eFactory design.
            Click the button below to open the modal.
          </p>
          
          <Button onClick={() => setModalOpen(true)}>
            Open User Profile Modal
          </Button>
        </div>

        <div className="mt-8 bg-card-color rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-font-color mb-4">Features</h3>
          <ul className="space-y-2 text-font-color-100">
            <li>• Displays user details (username, company info, policy details, accounts visibility)</li>
            <li>• Email address input with validation</li>
            <li>• Update email functionality with API integration</li>
            <li>• Success/error message display</li>
            <li>• Responsive design matching Luno theme</li>
            <li>• Clean TypeScript interfaces for API calls</li>
          </ul>
        </div>

        <div className="mt-8 bg-card-color rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-font-color mb-4">API Integration</h3>
          <p className="text-font-color-100 mb-4">
            The component includes a clean API integration for updating email addresses:
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 font-mono text-sm">
            <div className="text-green-600 dark:text-green-400">// API Types</div>
            <div>interface UpdateEmailRequest &#123;</div>
            <div className="ml-4">func: 'update_email';</div>
            <div className="ml-4">email: string;</div>
            <div>&#125;</div>
            <br />
            <div className="text-green-600 dark:text-green-400">// API Function</div>
            <div>updateUserEmail(email: string): Promise&lt;UpdateEmailResponse&gt;</div>
          </div>
        </div>
      </div>

      <UserProfileModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        userData={sampleUserData}
      />
    </div>
  );
};

export default DemoUserProfilePage;
