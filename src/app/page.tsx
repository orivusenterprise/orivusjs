"use client";

import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">OrivusJS</h1>
            <p className="text-xl text-gray-600 mb-8">The AI-Native Full-Stack Framework</p>

            <Link
                href="/users"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
                Go to User Module →
            </Link>
        </main>
    );
}