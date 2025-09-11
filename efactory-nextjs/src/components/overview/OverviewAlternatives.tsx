import React from 'react';
import { Button } from '@/components/ui/shadcn/button';
import { IconShoppingCart, IconTruck, IconAlertTriangle, IconTags, IconClipboardList, IconPackage, IconBox, IconWand, IconRefresh, IconSettings, IconEye, IconTrendingUp, IconActivity, IconCalendar, IconFilter, IconChevronDown } from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import dynamic from 'next/dynamic';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

// Alternative Layout 1: Card Paradise - STUNNING CARD-FOCUSED LAYOUT
export function OverviewAlternative1({ layout, totals, visibleTiles, renderTile, fulfillments, activity, rmaActivity, inventory, orders, refreshAll, isRefreshing, router, hideZeroQty, setHideZeroQty, invFilters, setInvFilters, ordersTab, setOrdersTab, Chart30Days, ChartRma30Days, FulfillmentTable, InventoryTable, LatestOrders }: any) {
  return (
    <div className="w-full overflow-y-auto bg-gradient-to-br from-emerald-50/30 via-white to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <div className="p-4 lg:p-8 space-y-8">
        {/* SPECTACULAR HERO HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-success via-emerald-500 to-teal-500 dark:from-success-800 dark:via-emerald-700 dark:to-teal-600 rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
          
          <div className="relative p-8 lg:p-12 text-center">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-3xl">
                  <IconBox className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white">
                    Card Paradise
                  </h1>
                  <p className="text-white/90 text-xl mt-2">Beautiful card-focused insights for modern workflows</p>
                </div>
              </div>
              
              <div className="flex justify-center items-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Card Layout</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <span className="font-medium">Enhanced UX</span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button size="lg" variant="outline" onClick={() => router.push('/overview')} className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  ← Executive Dashboard
                </Button>
                <Button size="lg" onClick={refreshAll} disabled={isRefreshing} className="bg-white text-success hover:bg-white/90 font-semibold">
                  <IconRefresh className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Syncing...' : 'Refresh All'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* SPECTACULAR METRICS CARDS */}
        {layout.areas.find((a: any) => a.name === 'tiles')?.visible && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleTiles.map((t: any, index: number) => (
              <div 
                key={t} 
                className="group transform hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:z-10 relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-success/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {renderTile(t)}
              </div>
            ))}
          </div>
        )}

        {/* MAGNIFICENT CARD PARADISE GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* STUNNING ACTIVITY CARD - SPANS 8 COLUMNS */}
          {layout.areas.find((a: any) => a.name === '30days')?.visible && (
            <Card className="xl:col-span-8 group border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/70 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-700/60 hover:shadow-3xl transition-all duration-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <CardHeader className="relative pb-4 bg-gradient-to-r from-primary/15 via-primary/8 to-transparent dark:from-primary/25 dark:via-primary/15">
                <CardTitle className="flex items-center gap-4 text-2xl font-bold">
                  <div className="p-4 bg-gradient-to-br from-primary to-primary-600 rounded-2xl shadow-xl">
                    <IconTrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-font-color">Performance Analytics</div>
                    <div className="text-sm text-font-color-100 font-normal mt-1">
                      {activity.length} data points • Comprehensive insights
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="px-4 py-2 bg-primary/15 text-primary rounded-2xl text-sm font-bold shadow-lg">
                      LIVE ANALYTICS
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative p-8">
                <Chart30Days />
              </CardContent>
            </Card>
          )}

          {/* BEAUTIFUL ORDERS CARD - SPANS 4 COLUMNS */}
          {layout.areas.find((a: any) => a.name === '50orders')?.visible && (
            <Card className="xl:col-span-4 group border-0 shadow-2xl bg-gradient-to-br from-white via-emerald-50/50 to-green-50/70 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-700/60 hover:shadow-3xl transition-all duration-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <CardHeader className="relative pb-4 bg-gradient-to-r from-success/15 via-success/8 to-transparent dark:from-success/25 dark:via-success/15">
                <CardTitle className="flex items-center gap-4 text-xl font-bold">
                  <div className="p-3 bg-gradient-to-br from-success to-success-600 rounded-2xl shadow-xl">
                    <IconClipboardList className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-font-color">Order Pipeline</div>
                    <div className="text-sm text-font-color-100 font-normal mt-1">
                      Latest {orders.length} transactions
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative p-0">
                <LatestOrders />
              </CardContent>
            </Card>
          )}

          {/* STUNNING INVENTORY CARD - SPANS 6 COLUMNS */}
          {layout.areas.find((a: any) => a.name === 'inventory')?.visible && (
            <Card className="xl:col-span-6 group border-0 shadow-2xl bg-gradient-to-br from-white via-cyan-50/50 to-blue-50/70 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-700/60 hover:shadow-3xl transition-all duration-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-info/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <CardHeader className="relative pb-4 bg-gradient-to-r from-info/15 via-info/8 to-transparent dark:from-info/25 dark:via-info/15">
                <CardTitle className="flex items-center gap-4 text-xl font-bold">
                  <div className="p-3 bg-gradient-to-br from-info to-info-600 rounded-2xl shadow-xl">
                    <IconBox className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-font-color">Stock Intelligence</div>
                    <div className="text-sm text-font-color-100 font-normal mt-1">
                      {inventory.length} items monitored
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative p-0">
                <InventoryTable />
              </CardContent>
            </Card>
          )}

          {/* MAGNIFICENT RMA CARD - SPANS 6 COLUMNS */}
          {layout.areas.find((a: any) => a.name === '30days_rmas')?.visible && (
            <Card className="xl:col-span-6 group border-0 shadow-2xl bg-gradient-to-br from-white via-amber-50/50 to-orange-50/70 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-700/60 hover:shadow-3xl transition-all duration-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <CardHeader className="relative pb-4 bg-gradient-to-r from-warning/15 via-warning/8 to-transparent dark:from-warning/25 dark:via-warning/15">
                <CardTitle className="flex items-center gap-4 text-xl font-bold">
                  <div className="p-3 bg-gradient-to-br from-warning to-warning-600 rounded-2xl shadow-xl">
                    <IconTags className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-font-color">Returns & RMA</div>
                    <div className="text-sm text-font-color-100 font-normal mt-1">
                      Quality & satisfaction metrics
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative p-8">
                <ChartRma30Days />
              </CardContent>
            </Card>
          )}
        </div>

        {/* SPECTACULAR FULFILLMENT CARD - FULL WIDTH */}
        {layout.areas.find((a: any) => a.name === 'fulfillment')?.visible && (
          <Card className="group border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50/70 to-gray-50/70 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-700/60 hover:shadow-3xl transition-all duration-700 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <CardHeader className="relative pb-4 bg-gradient-to-r from-slate-100/70 via-slate-50/50 to-transparent dark:from-slate-700/70 dark:via-slate-800/50">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold">
                <div className="p-4 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl shadow-xl">
                  <IconTruck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-font-color">Global Fulfillment Network</div>
                  <div className="text-sm text-font-color-100 font-normal mt-1">
                    {fulfillments.length} distribution centers • Worldwide operations
                  </div>
                </div>
                <div className="ml-auto">
                  <div className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-bold shadow-lg">
                    OPERATIONAL
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative p-0">
              <FulfillmentTable />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Alternative Layout 2: Dashboard-Style Layout
export function OverviewAlternative2({ layout, totals, visibleTiles, renderTile, fulfillments, activity, rmaActivity, inventory, orders, refreshAll, isRefreshing, router, hideZeroQty, setHideZeroQty, invFilters, setInvFilters, ordersTab, setOrdersTab, Chart30Days, ChartRma30Days, FulfillmentTable, InventoryTable, LatestOrders }: any) {
  return (
    <div className="w-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
          <div>
            <h1 className="text-2xl font-bold text-font-color">Executive Dashboard</h1>
            <p className="text-font-color-100">Comprehensive business metrics at a glance</p>
          </div>
          <div className="flex gap-3">
            <Button size="sm" variant="outline" onClick={() => router.push('/overview')}>
              ← Default View
            </Button>
            <Button size="sm" variant="default" onClick={refreshAll} disabled={isRefreshing}>
              <IconRefresh className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* KPI Row */}
        {layout.areas.find((a: any) => a.name === 'tiles')?.visible && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleTiles.map((t: any) => (
              <div key={t} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {renderTile(t)}
              </div>
            ))}
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Charts */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
          {layout.areas.find((a: any) => a.name === '30days')?.visible && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="flex items-center gap-3">
                  <IconTrendingUp className="w-5 h-5 text-primary" />
                  Performance Analytics
                  <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Last 30 Days
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent><Chart30Days /></CardContent>
            </Card>
          )}

          {layout.areas.find((a: any) => a.name === 'fulfillment')?.visible && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800">
                <CardTitle className="flex items-center gap-3">
                  <IconTruck className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  Fulfillment Operations
                </CardTitle>
              </CardHeader>
              <CardContent><FulfillmentTable /></CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Quick Info */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {layout.areas.find((a: any) => a.name === '50orders')?.visible && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-success/5 to-transparent">
                <CardTitle className="flex items-center gap-3">
                  <IconClipboardList className="w-5 h-5 text-success" />
                  Order Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent><LatestOrders /></CardContent>
            </Card>
          )}

          {layout.areas.find((a: any) => a.name === 'inventory')?.visible && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-info/5 to-transparent">
                <CardTitle className="flex items-center gap-3">
                  <IconBox className="w-5 h-5 text-info" />
                  Stock Levels
                </CardTitle>
              </CardHeader>
              <CardContent><InventoryTable /></CardContent>
            </Card>
          )}

          {layout.areas.find((a: any) => a.name === '30days_rmas')?.visible && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-warning/5 to-transparent">
                <CardTitle className="flex items-center gap-3">
                  <IconTags className="w-5 h-5 text-warning" />
                  Returns & RMA
                </CardTitle>
              </CardHeader>
              <CardContent><ChartRma30Days /></CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

// Alternative Layout 3: Timeline-Based Layout
export function OverviewAlternative3({ layout, totals, visibleTiles, renderTile, fulfillments, activity, rmaActivity, inventory, orders, refreshAll, isRefreshing, router, hideZeroQty, setHideZeroQty, invFilters, setInvFilters, ordersTab, setOrdersTab, Chart30Days, ChartRma30Days, FulfillmentTable, InventoryTable, LatestOrders }: any) {
  return (
    <div className="w-full overflow-y-auto">
      <div className="p-6 space-y-8">
      {/* Timeline Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-font-color flex items-center justify-center gap-3">
          <IconCalendar className="w-8 h-8 text-primary" />
          Timeline Overview
        </h1>
        <p className="text-font-color-100 max-w-2xl mx-auto">
          Track your business progress through time with this chronological view
        </p>
        <div className="flex justify-center gap-2">
          <Button size="sm" variant="outline" onClick={() => router.push('/overview')}>
            ← Back to Default
          </Button>
          <Button size="sm" variant="default" onClick={refreshAll} disabled={isRefreshing}>
            <IconRefresh className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Timeline
          </Button>
        </div>
      </div>

      {/* Current Status Cards */}
      {layout.areas.find((a: any) => a.name === 'tiles')?.visible && (
        <div className="bg-gradient-to-r from-primary/5 via-transparent to-success/5 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-font-color mb-4 flex items-center gap-2">
            <IconActivity className="w-5 h-5 text-primary" />
            Current Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleTiles.map((t: any) => (
              <div key={t} className="transform hover:scale-105 transition-all duration-300">
                {renderTile(t)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Content */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-success to-warning"></div>

        <div className="space-y-8">
          {/* Activity Timeline Item */}
          {layout.areas.find((a: any) => a.name === '30days')?.visible && (
            <div className="relative flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <IconTrendingUp className="w-8 h-8 text-white" />
              </div>
              <Card className="flex-1 border-0 shadow-xl bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    30-Day Performance Trend
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Recent Activity
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent><Chart30Days /></CardContent>
              </Card>
            </div>
          )}

          {/* Orders Timeline Item */}
          {layout.areas.find((a: any) => a.name === '50orders')?.visible && (
            <div className="relative flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-success rounded-full flex items-center justify-center shadow-lg">
                <IconClipboardList className="w-8 h-8 text-white" />
              </div>
              <Card className="flex-1 border-0 shadow-xl bg-gradient-to-br from-success/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    Latest Order Activity
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                      Live Updates
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent><LatestOrders /></CardContent>
              </Card>
            </div>
          )}

          {/* Inventory Timeline Item */}
          {layout.areas.find((a: any) => a.name === 'inventory')?.visible && (
            <div className="relative flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-info rounded-full flex items-center justify-center shadow-lg">
                <IconBox className="w-8 h-8 text-white" />
              </div>
              <Card className="flex-1 border-0 shadow-xl bg-gradient-to-br from-info/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    Inventory Snapshot
                    <span className="text-xs bg-info/10 text-info px-2 py-1 rounded-full">
                      Current Stock
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent><InventoryTable /></CardContent>
              </Card>
            </div>
          )}

          {/* Fulfillment Timeline Item */}
          {layout.areas.find((a: any) => a.name === 'fulfillment')?.visible && (
            <div className="relative flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center shadow-lg">
                <IconTruck className="w-8 h-8 text-white" />
              </div>
              <Card className="flex-1 border-0 shadow-xl bg-gradient-to-br from-slate-50 to-transparent dark:from-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    Fulfillment Operations
                    <span className="text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">
                      All Centers
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent><FulfillmentTable /></CardContent>
              </Card>
            </div>
          )}

          {/* RMA Timeline Item */}
          {layout.areas.find((a: any) => a.name === '30days_rmas')?.visible && (
            <div className="relative flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-warning rounded-full flex items-center justify-center shadow-lg">
                <IconTags className="w-8 h-8 text-white" />
              </div>
              <Card className="flex-1 border-0 shadow-xl bg-gradient-to-br from-warning/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    RMA Trends
                    <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">
                      30-Day View
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent><ChartRma30Days /></CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

// Alternative Layout 4: Grid-Based Layout
export function OverviewAlternative4({ layout, totals, visibleTiles, renderTile, fulfillments, activity, rmaActivity, inventory, orders, refreshAll, isRefreshing, router, hideZeroQty, setHideZeroQty, invFilters, setInvFilters, ordersTab, setOrdersTab, Chart30Days, ChartRma30Days, FulfillmentTable, InventoryTable, LatestOrders }: any) {
  return (
    <div className="w-full overflow-y-auto">
      <div className="p-6 space-y-6">
      {/* Grid Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-font-color flex items-center gap-3">
            <IconFilter className="w-7 h-7 text-primary" />
            Grid Overview
          </h1>
          <p className="text-sm text-font-color-100 mt-1">Organized grid layout for systematic analysis</p>
        </div>
        <div className="flex gap-3">
          <Button size="sm" variant="outline" onClick={() => router.push('/overview')}>
            ← Default View
          </Button>
          <Button size="sm" variant="default" onClick={refreshAll} disabled={isRefreshing}>
            <IconRefresh className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Grid
          </Button>
        </div>
      </div>

      {/* Masonry Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
        {/* KPI Tiles */}
        {layout.areas.find((a: any) => a.name === 'tiles')?.visible && visibleTiles.map(t => (
          <div key={t} className="transform hover:scale-105 transition-all duration-300 hover:z-10 relative">
            {renderTile(t)}
          </div>
        ))}

        {/* Activity Chart - Spans 2 columns */}
        {layout.areas.find((a: any) => a.name === '30days')?.visible && (
          <Card className="md:col-span-2 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <IconTrendingUp className="w-5 h-5 text-primary" />
                Activity Grid
              </CardTitle>
            </CardHeader>
            <CardContent><Chart30Days /></CardContent>
          </Card>
        )}

        {/* Orders */}
        {layout.areas.find((a: any) => a.name === '50orders')?.visible && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-success/5 to-success/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <IconClipboardList className="w-5 h-5 text-success" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent><LatestOrders /></CardContent>
          </Card>
        )}

        {/* Inventory */}
        {layout.areas.find((a: any) => a.name === 'inventory')?.visible && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-info/5 to-info/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <IconBox className="w-5 h-5 text-info" />
                Stock
              </CardTitle>
            </CardHeader>
            <CardContent><InventoryTable /></CardContent>
          </Card>
        )}

        {/* RMA Chart */}
        {layout.areas.find((a: any) => a.name === '30days_rmas')?.visible && (
          <Card className="md:col-span-2 border-0 shadow-lg bg-gradient-to-br from-warning/5 to-warning/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <IconTags className="w-5 h-5 text-warning" />
                RMA Grid
              </CardTitle>
            </CardHeader>
            <CardContent><ChartRma30Days /></CardContent>
          </Card>
        )}

        {/* Fulfillment - Full width */}
        {layout.areas.find((a: any) => a.name === 'fulfillment')?.visible && (
          <Card className="md:col-span-2 lg:col-span-3 xl:col-span-4 border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <IconTruck className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                Fulfillment Grid
              </CardTitle>
            </CardHeader>
            <CardContent><FulfillmentTable /></CardContent>
          </Card>
        )}
      </div>
    </div>
    </div>
  );
}

// Alternative Layout 5: Modern Minimalist Layout
export function OverviewAlternative5({ layout, totals, visibleTiles, renderTile, fulfillments, activity, rmaActivity, inventory, orders, refreshAll, isRefreshing, router, hideZeroQty, setHideZeroQty, invFilters, setInvFilters, ordersTab, setOrdersTab, Chart30Days, ChartRma30Days, FulfillmentTable, InventoryTable, LatestOrders }: any) {
  return (
    <div className="w-full overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="p-8 space-y-12">
        {/* Minimalist Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-4 bg-white dark:bg-slate-800 rounded-full px-8 py-4 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <h1 className="text-2xl font-light text-font-color">Overview</h1>
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <p className="text-font-color-100 font-light">Simplified, focused insights</p>
          <div className="flex justify-center gap-4">
            <Button size="sm" variant="ghost" onClick={() => router.push('/overview')} className="rounded-full">
              ← Default
            </Button>
            <Button size="sm" variant="ghost" onClick={refreshAll} disabled={isRefreshing} className="rounded-full">
              <IconRefresh className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Minimalist Metrics */}
        {layout.areas.find((a: any) => a.name === 'tiles')?.visible && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleTiles.map((t: any) => (
              <div key={t} className="group">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  {renderTile(t)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clean Content Sections */}
        <div className="space-y-16">
          {/* Charts Section */}
          {(layout.areas.find((a: any) => a.name === '30days')?.visible || layout.areas.find((a: any) => a.name === '30days_rmas')?.visible) && (
            <div className="space-y-8">
              <h2 className="text-xl font-light text-font-color text-center">Analytics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {layout.areas.find((a: any) => a.name === '30days')?.visible && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <h3 className="font-light text-font-color">Activity</h3>
                    </div>
                    <Chart30Days />
                  </div>
                )}
                {layout.areas.find((a: any) => a.name === '30days_rmas')?.visible && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <h3 className="font-light text-font-color">Returns</h3>
                    </div>
                    <ChartRma30Days />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Data Section */}
          {(layout.areas.find((a: any) => a.name === '50orders')?.visible || layout.areas.find((a: any) => a.name === 'inventory')?.visible) && (
            <div className="space-y-8">
              <h2 className="text-xl font-light text-font-color text-center">Data</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {layout.areas.find((a: any) => a.name === '50orders')?.visible && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <h3 className="font-light text-font-color">Orders</h3>
                    </div>
                    <LatestOrders />
                  </div>
                )}
                {layout.areas.find((a: any) => a.name === 'inventory')?.visible && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-2 bg-info rounded-full"></div>
                      <h3 className="font-light text-font-color">Inventory</h3>
                    </div>
                    <InventoryTable />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Operations Section */}
          {layout.areas.find((a: any) => a.name === 'fulfillment')?.visible && (
            <div className="space-y-8">
              <h2 className="text-xl font-light text-font-color text-center">Operations</h2>
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <h3 className="font-light text-font-color">Fulfillment</h3>
                </div>
                <FulfillmentTable />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
