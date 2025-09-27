
import React from 'react';
import { useAuth } from '../App';
import { User } from '../App';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { users, grantAccess, revokeAccess } = useAuth();

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Access Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.filter(u => u.role !== 'admin').map((user: User) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.hasAccess ? (
                      <span className="flex items-center text-green-600"><CheckCircle size={16} className="mr-2"/> Has Access</span>
                    ) : user.accessRequested ? (
                      <span className="flex items-center text-yellow-600"><Clock size={16} className="mr-2"/> Requested Access</span>
                    ) : (
                      <span className="flex items-center text-red-600"><XCircle size={16} className="mr-2"/> No Access</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {user.hasAccess ? (
                      <button onClick={() => revokeAccess(user.id)} className="text-red-600 hover:text-red-900">Revoke Access</button>
                    ) : (
                      <button onClick={() => grantAccess(user.id)} className="text-indigo-600 hover:text-indigo-900">Grant Access</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
