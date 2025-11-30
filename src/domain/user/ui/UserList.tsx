"use client";

import { trpc } from "@/utils/trpc";

export function UserList() {
    const { data: users, isLoading } = trpc.user.list.useQuery();

    if (isLoading) return <div>Loading users...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">User List</h2>
            <ul className="space-y-2">
                {users?.map((user) => (
                    <li key={user.id} className="p-4 bg-white rounded shadow border border-gray-100">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                    </li>
                ))}
            </ul>
            {users?.length === 0 && <p className="text-gray-500">No users found.</p>}
        </div>
    );
}
