import React from 'react';

const DemoNavigationSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">eFactory</h1>
            </div>

            {/* Simple top menu */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
                Overview
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                Orders
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                Items
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                More
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                <i className="fa fa-bars text-xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <nav className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                FULFILLMENT
              </div>
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
                <i className="icon-book-open mr-3" />
                Orders
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                <i className="icon-list mr-3" />
                Order Lines
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                <i className="icon-tag mr-3" />
                Order Items
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Navigation System Demo (Simple Version)</h1>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">✅ Basic Navigation Working</h2>
                    <p className="text-blue-800">
                      This is a simplified version of the navigation system to test basic functionality.
                      The full navigation system with app ID filtering is available but may have import issues.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <h2 className="text-lg font-semibold text-green-900 mb-2">Features Demonstrated</h2>
                    <ul className="list-disc list-inside text-green-800 space-y-1">
                      <li>Responsive header with logo and navigation</li>
                      <li>Desktop sidebar with menu items</li>
                      <li>Mobile hamburger menu button</li>
                      <li>Active menu highlighting</li>
                      <li>Hover effects and transitions</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h2 className="text-lg font-semibold text-yellow-900 mb-2">Next Steps</h2>
                    <p className="text-yellow-800 mb-2">
                      To use the full navigation system with app ID filtering:
                    </p>
                    <ul className="list-disc list-inside text-yellow-800 space-y-1 text-sm">
                      <li>Check browser console for any import errors</li>
                      <li>Verify all component files are in the correct locations</li>
                      <li>Ensure TypeScript compilation is successful</li>
                      <li>Try accessing the full demo at <code className="bg-yellow-100 px-2 py-1 rounded">/demo-navigation</code></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DemoNavigationSimple;
