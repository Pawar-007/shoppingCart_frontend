import { useEffect, useState } from "react";
import adminApi from "@/api/adminApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { Users } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="shelf-heading">
        <h2>Users</h2>
      </div>

      {loading && <LoadingSpinner label="Loading users" />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && users.length === 0 && (
        <EmptyState icon={Users} title="No users found" />
      )}
      {!loading && !error && users.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.userId ?? u.id}>
                  <td className="px-5 py-3.5 text-ink font-medium">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-5 py-3.5 text-ink-soft">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${u.role === "ADMIN" ? "bg-accent-light text-accent" : "bg-bg text-ink-soft"}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
