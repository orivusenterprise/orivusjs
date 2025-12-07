"use client";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-6">
                OrivusJS
            </h1>
            <p className="text-2xl text-gray-600 mb-8 font-light">
                The AI-Native Full-Stack Framework
            </p>

            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm max-w-2xl w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🚀 Get Started</h3>
                <p className="text-gray-600 mb-4">
                    Your environment is ready. Create your first module by defining a spec in <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">specs/</code> and running:
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm shadow-inner">
                    npm run orivus:create specs/examples/starter-blog.json
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">📚 Documentation</h4>
                        <a href="/docs" className="text-indigo-600 hover:text-indigo-800 hover:underline">Read the Docs &rarr;</a>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">🧩 Examples</h4>
                        <p className="text-sm text-gray-500">Check <code>specs/examples</code> for inspiration.</p>
                    </div>
                </div>
            </div>

            <p className="mt-12 text-xs text-gray-300">
                v0.4.1-alpha
            </p>
        </main>
    );
}