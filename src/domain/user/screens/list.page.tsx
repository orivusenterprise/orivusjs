"use client";

import { UserList, CreateUserForm } from "../ui";

export default function UserListPage() {
    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">User Management</h1>
                    <p className="mt-2 text-lg text-gray-600">Domain-Driven Page Example</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <CreateUserForm />
                    </div>
                    <div>
                        <UserList />
                    </div>
                </div>
            </div>
        </main>
    );
}
