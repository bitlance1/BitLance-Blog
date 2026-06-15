import { useEffect, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState("publisher");

  const fetchUsers = () => {
    fetch("/api/users")
      .then(r => r.json())
      .then(setUsers)
      .catch(console.error);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      fetch(`/api/users/${id}`, { method: "DELETE" })
        .then(() => fetchUsers());
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newUserName, role: newUserRole })
    })
      .then(() => {
        setNewUserName("");
        setIsAddingUser(false);
        fetchUsers();
      });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Users</h1>
          <p className="text-gray-500 mt-1">Manage team members and publishers.</p>
        </div>
        <button 
          onClick={() => setIsAddingUser(true)}
          className="flex items-center gap-2 bg-brand-500 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-brand-600 transition-colors shadow-sm"
        >
          <UserPlus className="h-5 w-5" />
          Add User
        </button>
      </div>

      {isAddingUser && (
        <form onSubmit={handleAddUser} className="mb-8 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-brand-500" 
              value={newUserName}
              onChange={e => setNewUserName(e.target.value)}
              placeholder="Alice Satoshi"
            />
          </div>
          <div className="w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
            <select 
              className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-brand-500 bg-white"
              value={newUserRole}
              onChange={e => setNewUserRole(e.target.value)}
            >
              <option value="publisher">Publisher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setIsAddingUser(false)} className="px-4 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Save
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-gray-100" />
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-brand-100 text-brand-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    <button onClick={() => handleDelete(user.id)} className="hover:text-red-500 transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="py-12 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
