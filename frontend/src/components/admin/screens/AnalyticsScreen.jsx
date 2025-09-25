"use client";

import ChartCard from "../ChartCard";
import StatCard from "../StatCard";

export default function AnalyticsScreen() {
  // Mock analytics data
  const salesData = [
    { month: "Jan", sales: 45000, orders: 120 },
    { month: "Feb", sales: 52000, orders: 145 },
    { month: "Mar", sales: 48000, orders: 132 },
    { month: "Apr", sales: 61000, orders: 167 },
    { month: "May", sales: 55000, orders: 156 },
    { month: "Jun", sales: 67000, orders: 189 }
  ];

  const topCategories = [
    { name: "Kitchen & Dining", sales: 25000, percentage: 35 },
    { name: "Home Decor", sales: 18000, percentage: 25 },
    { name: "Personal Care", sales: 14000, percentage: 20 },
    { name: "Bags & Accessories", sales: 10000, percentage: 14 },
    { name: "Others", sales: 4000, percentage: 6 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-black">Analytics</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue"
          value="₹348K"
          change="12.5"
          description="vs last month"
          icon="trend"
        />
        <StatCard 
          title="Total Orders"
          value="1,089"
          change="8.2"
          description="vs last month"
          icon="orders"
        />
        <StatCard 
          title="Avg Order Value"
          value="₹1,650"
          change="5.1"
          description="vs last month"
          icon="trend"
        />
        <StatCard 
          title="Customer Retention"
          value="68%"
          change="3.2"
          description="vs last month"
          icon="users"
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sales Trend Chart */}
        <div className="col-span-8">
          <ChartCard title="Sales Trend" hasDropdown dropdownValue="Last 6 Months">
            <div className="h-64 flex items-end justify-between space-x-2">
              {salesData.map((data, index) => (
                <div key={data.month} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-200 rounded-t-lg relative overflow-hidden">
                    <div 
                      className="bg-[#1a4032] rounded-t-lg transition-all duration-1000 ease-out"
                      style={{ height: `${(data.sales / 70000) * 200}px` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">{data.month}</div>
                  <div className="text-xs font-semibold text-gray-900">₹{data.sales / 1000}K</div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Top Categories */}
        <div className="col-span-4">
          <ChartCard title="Top Categories">
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-[#1a4032] h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm font-semibold text-gray-900">₹{category.sales / 1000}K</div>
                    <div className="text-xs text-gray-500">{category.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Customer Analytics */}
        <div className="col-span-6">
          <ChartCard title="Customer Analytics">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1a4032]">2,847</div>
                <div className="text-sm text-gray-600">Total Customers</div>
                <div className="text-xs text-green-600 mt-1">+156 this month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1a4032]">1,234</div>
                <div className="text-sm text-gray-600">Active Customers</div>
                <div className="text-xs text-green-600 mt-1">+89 this month</div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Customers</span>
                <span className="text-sm font-semibold text-gray-900">23%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "23%" }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Returning Customers</span>
                <span className="text-sm font-semibold text-gray-900">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "68%" }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Churned Customers</span>
                <span className="text-sm font-semibold text-gray-900">9%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: "9%" }}></div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Traffic Sources */}
        <div className="col-span-6">
          <ChartCard title="Traffic Sources">
            <div className="space-y-4">
              {[
                { source: "Organic Search", visits: 45, color: "bg-green-500" },
                { source: "Direct", visits: 25, color: "bg-blue-500" },
                { source: "Social Media", visits: 15, color: "bg-purple-500" },
                { source: "Email", visits: 10, color: "bg-yellow-500" },
                { source: "Referral", visits: 5, color: "bg-red-500" }
              ].map((item) => (
                <div key={item.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-900">{item.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.visits}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{item.visits}%</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Recent Activity */}
        <div className="col-span-12">
          <ChartCard title="Recent Activity">
            <div className="space-y-4">
              {[
                { action: "New order placed", user: "Priya Sharma", time: "2 minutes ago", type: "order" },
                { action: "Product review submitted", user: "Rajesh Kumar", time: "15 minutes ago", type: "review" },
                { action: "New supplier application", user: "GreenTech Co.", time: "1 hour ago", type: "supplier" },
                { action: "Customer support ticket", user: "Anita Patel", time: "2 hours ago", type: "support" },
                { action: "Product stock updated", user: "System", time: "4 hours ago", type: "system" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'order' ? 'bg-green-500' :
                      activity.type === 'review' ? 'bg-blue-500' :
                      activity.type === 'supplier' ? 'bg-purple-500' :
                      activity.type === 'support' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                      <div className="text-xs text-gray-500">by {activity.user}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
