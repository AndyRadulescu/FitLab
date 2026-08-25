import { useState, useMemo } from 'react';
import { userStore } from '../store/user.store';
import { useNavigate } from 'react-router-dom';
import { EditableName } from '../components/editable-name';
import { Button, TimeToCheckin } from '@my-org/shared-ui';
import { Users, UserCheck, UserX, Clock, UserPlus } from 'lucide-react';
import { LinkUserModal } from '../components/link-user-modal/link-user-modal';

type FilterType = 'all' | 'linked' | 'unlinked' | 'pending';

export const UsersList = () => {
  const currentUser = userStore((state) => state.user);
  const rawUsers = userStore((state) => state.userList);
  const users = useMemo(() => rawUsers || [], [rawUsers]);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const linkedUsers = useMemo(
    () => users.filter((u) => u.connectionStatus === 'active' || !u.connectionStatus),
    [users]
  );
  const unlinkedUsers = useMemo(
    () => users.filter((u) => u.connectionStatus === 'unlinked'),
    [users]
  );
  const pendingUsers = useMemo(
    () => users.filter((u) => u.connectionStatus === 'pending'),
    [users]
  );

  const filteredUsers = useMemo(() => {
    switch (filter) {
      case 'linked':
        return linkedUsers;
      case 'unlinked':
        return unlinkedUsers;
      case 'pending':
        return pendingUsers;
      case 'all':
      default:
        return users;
    }
  }, [filter, users, linkedUsers, unlinkedUsers, pendingUsers]);

  const handleUserClick = (userId: string) => {
    navigate(userId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Registered Users</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and view all registered participants.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 bg-gray-100/80 rounded-xl border border-gray-200 gap-1">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>All</span>
              <span
                className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                  filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {users.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('linked')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                filter === 'linked'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>Linked</span>
              <span
                className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                  filter === 'linked' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {linkedUsers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('unlinked')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                filter === 'unlinked'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <UserX className="h-4 w-4" />
              <span>Unlinked</span>
              <span
                className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                  filter === 'unlinked' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {unlinkedUsers.length}
              </span>
            </button>

            {pendingUsers.length > 0 && (
              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'pending'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>Pending</span>
                <span
                  className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                    filter === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {pendingUsers.length}
                </span>
              </button>
            )}
          </div>

          <Button
            type="primary"
            buttonType="button"
            onClick={() => setIsLinkModalOpen(true)}
            className="!w-auto flex items-center gap-2 text-sm py-2 px-4 shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            Link User
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                  User Details
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Measurements
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Created
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Check-in
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const isUnlinked = user.connectionStatus === 'unlinked';
                const isPending = user.connectionStatus === 'pending';

                return (
                  <tr
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="hover:bg-indigo-50/30 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold overflow-hidden ${
                            isUnlinked
                              ? 'bg-amber-100 text-amber-700'
                              : isPending
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
                          ) : (
                            (user.displayName || user.email || user.id).substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="ml-4">
                          <EditableName
                            userId={user.userId || user.id}
                            initialName={user.displayName || user.email || user.id}
                            className="text-sm font-bold text-gray-900"
                            inputClassName="text-sm font-bold"
                          />
                          <div className="text-xs text-gray-400 font-mono">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-semibold">
                        {user.weights && user.weights.length > 0 ? `${user.weights.at(-1)?.weight} kg` : <span className="text-gray-300 font-normal italic">N/A</span>}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.height ? `${user.height} cm` : <span className="text-gray-300 italic">N/A</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isUnlinked ? (
                          <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-tight">
                            Unlinked
                          </span>
                        ) : isPending ? (
                          <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-tight">
                            Pending
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-tight">
                            Linked
                          </span>
                        )}
                        {user.isAdmin && (
                          <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase tracking-tight">
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {user.createdAt?.toDate
                        ? user.createdAt.toDate().toLocaleDateString()
                        : user.createdAt instanceof Date
                        ? user.createdAt.toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <TimeToCheckin checkins={user.checkins || []} />
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <span>
                        {filter === 'all'
                          ? 'No users found in the system.'
                          : `No ${filter} users found.`}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LinkUserModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        coachId={currentUser?.uid}
      />
    </div>
  );
};


