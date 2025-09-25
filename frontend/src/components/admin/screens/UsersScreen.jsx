"use client";

import { useState } from "react";
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";

export default function UsersScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const users = [
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 98765 43210",
      role: "customer",
      status: "active",
      joinDate: "2024-01-15",
      orders: 12,
      totalSpent: 15640
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91 87654 32109",
      role: "customer",
      status: "active",
      joinDate: "2024-02-20",
      orders: 8,
      totalSpent: 9850
    },
    {
      id: 3,
      name: "GreenTech Suppliers",
      email: "contact@greentech.com",
      phone: "+91 76543 21098",
      role: "supplier",
      status: "active",
      joinDate: "2023-12-05",
      orders: 145,
      totalSpent: 0
    },
    {
      id: 4,
      name: "Anita Patel",
      email: "anita@example.com",
      phone: "+91 65432 10987",
      role: "customer",
      status: "inactive",
      joinDate: "2024-03-10",
      orders: 3,
      totalSpent: 2340
    },
    {
      id: 5,
      name: "Admin User",
      email: "admin@aveoearth.com",
      phone: "+91 54321 09876",
      role: "admin",
      status: "active",
      joinDate: "2023-11-01",
      orders: 0,
      totalSpent: 0
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800"
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`;
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      supplier: "bg-blue-100 text-blue-800",
      customer: "bg-gray-100 text-gray-800"
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[role]}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-black">Users</h1>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export
          </button>
          <button className="bg-[#1a4032] hover:bg-[#0f2319] text-white px-4 py-2 rounded-lg transition-colors">
            Send Notification
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4032] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4032] focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="supplier">Suppliers</option>
              <option value="admin">Admins</option>
            </select>
            
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <AdjustmentsHorizontalIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Contact</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Role</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Orders</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Total Spent</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Join Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getRoleBadge(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(user.status)}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">{user.orders}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">
                      {user.role === 'customer' ? `₹${user.totalSpent.toLocaleString()}` : '-'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">{user.joinDate}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <EyeIcon className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <PencilIcon className="h-4 w-4 text-gray-600" />
                      </button>
                      {user.role !== 'admin' && (
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <TrashIcon className="h-4 w-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Customers</h3>
          <p className="text-2xl font-bold text-blue-600">
            {users.filter(u => u.role === 'customer').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Suppliers</h3>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.role === 'supplier').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Users</h3>
          <p className="text-2xl font-bold text-gray-900">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
      </div>
    </div>
  );
}
