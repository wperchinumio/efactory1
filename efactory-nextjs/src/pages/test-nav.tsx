import React from 'react';

const TestNav: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Navigation Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Navigation System Status</h2>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-green-900 mb-2">✅ Page Loaded Successfully</h3>
              <p className="text-green-800">
                This page is accessible at <code className="bg-green-100 px-2 py-1 rounded">/test-nav</code>
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Next Steps</h3>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Try accessing <code className="bg-blue-100 px-2 py-1 rounded">/demo-navigation</code> to see the full navigation system</li>
                <li>If you get a 404, check the browser console for any import errors</li>
                <li>Make sure the development server is running with <code className="bg-blue-100 px-2 py-1 rounded">npm run dev</code></li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-yellow-900 mb-2">Troubleshooting</h3>
              <p className="text-yellow-800 mb-2">
                If the demo page still shows 404, it might be due to:
              </p>
              <ul className="list-disc list-inside text-yellow-800 space-y-1 text-sm">
                <li>Import path issues with the MainLayout component</li>
                <li>TypeScript compilation errors</li>
                <li>Missing dependencies or build issues</li>
                <li>Next.js not recognizing the new page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestNav;
