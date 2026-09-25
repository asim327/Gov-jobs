import React, { useState } from 'react';
import { Users, Search, ShieldCheck, UserCheck, Trash2, Power, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { User as UserType } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const { users, toggleUserStatus, changeUserRole, deleteUser, currentUser } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);

  const filteredUsers = users.filter((u) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.city?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            User Accounts & RBAC ({users.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage candidates, role assignments (Admin vs Candidate), and account statuses.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-80 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <Search className="w-4 h-4 text-emerald-600 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or city..."
          className="w-full bg-transparent text-xs font-medium focus:outline-hidden"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User Particulars</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold flex items-center justify-center">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">
                          {u.name}
                        </span>
                        <span className="text-slate-500">{u.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{u.city || '—'}</td>

                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      disabled={u.id === currentUser?.id}
                      onChange={(e) => changeUserRole(u.id, e.target.value as any)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                    >
                      <option value="user">Candidate</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'active'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      disabled={u.id === currentUser?.id}
                      onClick={() => toggleUserStatus(u.id)}
                      className={`text-xs font-bold ${
                        u.id === currentUser?.id
                          ? 'text-slate-300 cursor-not-allowed'
                          : u.status === 'active'
                          ? 'text-amber-600 hover:underline'
                          : 'text-emerald-600 hover:underline'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>

                    <button
                      disabled={u.id === currentUser?.id}
                      onClick={() => setUserToDelete(u)}
                      className={`p-1.5 rounded-lg ${
                        u.id === currentUser?.id
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-400 hover:text-rose-500'
                      }`}
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!userToDelete}
        title="Delete User Account?"
        message={`Are you sure you want to permanently delete "${userToDelete?.name}"?`}
        confirmText="Delete User"
        danger
        onConfirm={() => {
          if (userToDelete) {
            deleteUser(userToDelete.id);
            setUserToDelete(null);
          }
        }}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
};
