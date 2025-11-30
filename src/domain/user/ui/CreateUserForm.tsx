"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";

export function CreateUserForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const utils = trpc.useContext();

    const mutation = trpc.user.create.useMutation({
        onSuccess: () => {
            setName("");
            setEmail("");
            utils.user.list.invalidate();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Note: We are passing the data inside 'input' wrapper as per our router change
        mutation.mutate({ input: { name, email } });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium">Create New User</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={mutation.isLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {mutation.isLoading ? "Creating..." : "Create User"}
            </button>
            {mutation.error && (
                <p className="text-red-500 text-sm">{mutation.error.message}</p>
            )}
        </form>
    );
}
