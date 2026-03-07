import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { AdminAPI } from '../utils/api';
import { FiUsers, FiAlertTriangle, FiCheckCircle, FiTrendingUp, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    if (user?.role !== 'owner' && user?.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, logsRes] = await Promise.all([
        AdminAPI.getPlatformStats(),
        AdminAPI.getAllUsers(),
        AdminAPI.getModerationLogs()
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setLogs(logsRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm('Are you sure you want to ban this user?')) return;

    try {
      await AdminAPI.banUser(userId, { reason: 'Admin action' });
      toast.success('User banned successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await AdminAPI.unbanUser(userId);
      toast.success('User unbanned successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to unban user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) return;

    try {
      await AdminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.includes(searchTerm) || (u.username?.includes(searchTerm) || '');
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Access denied. Admin only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Role: {user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 px-4">
        <div className="max-w-7xl mx-auto flex gap-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-3 border-b-2 transition ${
              activeTab === 'dashboard'
                ? 'border-red-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 border-b-2 transition ${
              activeTab === 'users'
                ? 'border-red-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-3 border-b-2 transition ${
              activeTab === 'moderation'
                ? 'border-red-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Moderation
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <StatCard
                  icon={<FiUsers className="text-2xl" />}
                  title="Total Users"
                  value={stats.totalUsers}
                  color="blue"
                />
                <StatCard
                  icon={<FiCheckCircle className="text-2xl" />}
                  title="Active Users"
                  value={stats.activeUsers}
                  color="green"
                />
                <StatCard
                  icon={<FiAlertTriangle className="text-2xl" />}
                  title="Banned Users"
                  value={stats.bannedUsers}
                  color="red"
                />
                <StatCard
                  icon={<FiTrendingUp className="text-2xl" />}
                  title="Verified Users"
                  value={stats.verifiedUsers}
                  color="purple"
                />
                <StatCard
                  icon={<FiAlertTriangle className="text-2xl" />}
                  title="Total Violations"
                  value={stats.totalViolations}
                  color="yellow"
                />
                <StatCard
                  icon={<FiUsers className="text-2xl" />}
                  title="Admin Users"
                  value={stats.adminUsers}
                  color="indigo"
                />
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search by email or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Username</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Verified</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                          <td className="py-3 px-4 text-sm">{u.email}</td>
                          <td className="py-3 px-4 text-sm">{u.username || '-'}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              u.role === 'owner' ? 'bg-purple-600' :
                              u.role === 'admin' ? 'bg-blue-600' :
                              'bg-gray-600'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              u.isBanned ? 'bg-red-600' : 'bg-green-600'
                            }`}>
                              {u.isBanned ? 'Banned' : 'Active'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {u.faceVerified ? (
                              <span className="text-green-500">✓</span>
                            ) : (
                              <span className="text-gray-500">✗</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex gap-2">
                              {u.isBanned ? (
                                <button
                                  onClick={() => handleUnbanUser(u._id)}
                                  className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs transition"
                                >
                                  Unban
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleBanUser(u._id)}
                                  className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs transition"
                                >
                                  Ban
                                </button>
                              )}
                              {user?.role === 'owner' && (
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs transition"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-400 mt-4">Showing {filteredUsers.length} of {users.length} users</p>
              </div>
            )}

            {/* Moderation Tab */}
            {activeTab === 'moderation' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Moderation Logs</h2>
                <div className="space-y-4">
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <div key={log._id} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{log.userId?.email}</p>
                            <p className="text-sm text-gray-400">
                              Type: {log.violationType}
                            </p>
                          </div>
                          <span className="bg-red-600 px-3 py-1 rounded text-sm">
                            {log.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{log.reason}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No moderation logs found.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
    yellow: 'bg-yellow-600',
    indigo: 'bg-indigo-600'
  };

  return (
    <div className={`${colors[color]} rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-200 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl opacity-50">{icon}</div>
      </div>
    </div>
  );
}
