import { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users")
      .then((r) => setUsers(r.data.users || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const { data } = await api.put(`/users/${id}`, { role: newRole });
      setUsers((prev) => prev.map((u) => u._id === id ? data.user : u));
      toast.success(`Role changed to ${newRole}`);
    } catch {
      toast.error("Failed to update role");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Users ({users.length})</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Avatar", "Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  {u.profilePicture?.url ? (
                    <img src={u.profilePicture.url} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <button onClick={() => u._id !== currentUser._id && handleRoleToggle(u._id, u.role)}
                    className={`cursor-pointer ${u._id === currentUser._id ? "cursor-default opacity-60" : ""}`}
                    title={u._id === currentUser._id ? "Cannot change your own role" : "Click to toggle role"}
                  >
                    <Badge label={u.role} color={u.role === "admin" ? "blue" : "gray"} />
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {u._id !== currentUser._id && (
                    <button onClick={() => handleDelete(u._id, u.name)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
