import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../init-firebase-auth';
import { userStore } from '../store/user.store';

export const UsersList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const isAdmin = userStore((state) => state.isAdmin);
  const currentUser = userStore((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      if (isAdmin === true) {
        setFetchingUsers(true);
        try {
          const usersSnapshot = await getDocs(collection(db, 'users'));
          const usersList = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(usersList);
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setFetchingUsers(false);
        }
      }
    };

    fetchUsers();
  }, [isAdmin]);

  if (isAdmin === null || fetchingUsers) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4 shadow-sm rounded-r-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">Permission Required</h3>
            <p className="text-sm text-red-700 mt-1">
              You must have administrative privileges to view the registered users list.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Registered Users</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and view all registered participants.</p>
        </div>
        <div className="flex items-center bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
          <span className="text-indigo-700 font-bold text-lg mr-2">{users.length}</span>
          <span className="text-indigo-600 text-sm font-medium uppercase tracking-wider">Total</span>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors duration-150">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                        {(user.userId || user.id).substring(0, 2).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{user.userId || user.id}</div>
                        <div className="text-xs text-gray-400 font-mono">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-semibold">
                      {user.weight ? `${user.weight} kg` : <span className="text-gray-300 font-normal italic">N/A</span>}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.height ? `${user.height} cm` : <span className="text-gray-300 italic">N/A</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {user.isAdmin ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase tracking-tighter">
                        Admin
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-tighter">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>No users found in the system.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
