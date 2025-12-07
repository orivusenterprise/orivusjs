"use client";

import Link from "next/link";

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Header */}
            <header className="border-b border-gray-100 bg-white sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm">Or</span>
                        <span>OrivusJS Docs</span>
                    </Link>
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">v0.4.1-alpha</span>
                        <Link href="/" className="text-gray-500 hover:text-gray-900">← Back to App</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12 flex gap-12">
                {/* Sidebar Navigation */}
                <aside className="hidden md:block w-64 shrink-0 sticky top-24 h-fit">
                    <div className="space-y-1">
                        <h4 className="font-semibold text-sm text-gray-900 mb-2 uppercase tracking-wide">Guide</h4>
                        <a href="#intro" className="block text-gray-600 hover:text-indigo-600 py-1">Introduction</a>
                        <a href="#workflow" className="block text-gray-600 hover:text-indigo-600 py-1">Workflow</a>
                        <a href="#structure" className="block text-gray-600 hover:text-indigo-600 py-1">Spec Structure</a>
                    </div>
                    <div className="space-y-1 mt-6">
                        <h4 className="font-semibold text-sm text-gray-900 mb-2 uppercase tracking-wide">Features</h4>
                        <a href="#relations" className="block text-gray-600 hover:text-indigo-600 py-1">Relationships</a>
                        <a href="#skipui" className="block text-gray-600 hover:text-indigo-600 py-1">Backend Only</a>
                    </div>
                </aside>

                {/* Content */}
                <div className="prose prose-indigo prose-lg max-w-none flex-1">
                    <section id="intro">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Documentation</h1>
                        <p className="text-xl text-gray-500 leading-relaxed mb-8">
                            OrivusJS is an AI-Native framework designed to build modular applications efficiently.
                            By defining <strong>Specifications (Specs)</strong>, Orivus generates the entire Full-Stack boilerplate for you.
                        </p>
                    </section>

                    <hr className="my-8 border-gray-100" />

                    <section id="workflow" className="mb-16 scroll-mt-24">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">🚀 The Workflow</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                                <div>
                                    <h3 className="font-bold text-lg m-0">Define</h3>
                                    <p className="text-gray-600 m-0">Create a JSON file in <code>specs/examples/</code> describing your data models and actions.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                                <div>
                                    <h3 className="font-bold text-lg m-0">Generate</h3>
                                    <p className="text-gray-600 m-0">Run the CLI command to scaffold the code.</p>
                                    <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm mt-2 overflow-x-auto">
                                        npm run orivus:create specs/examples/your-spec.json
                                    </pre>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                                <div>
                                    <h3 className="font-bold text-lg m-0">Develop</h3>
                                    <p className="text-gray-600 m-0">The generated code is standard Next.js, tRPC & Prisma. Edit it freely!</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="structure" className="mb-16 scroll-mt-24">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">📄 Spec Structure</h2>
                        <p className="text-gray-600 mb-4">A simple Spec file looks like this:</p>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden text-sm">
                            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 text-xs text-gray-500 font-mono">specs/examples/blog.json</div>
                            <pre className="p-4 overflow-x-auto font-mono text-gray-800">
                                {`{
  "name": "post",
  "description": "A simple blog post module",
  "models": {
    "Post": {
      "title": { "type": "string", "required": true },
      "content": { "type": "string", "required": true },
      "published": { "type": "boolean", "default": false }
    }
  },
  "actions": {
    "create": { 
      "input": { 
         "title": { "type": "string" }, 
         "content": { "type": "string" } 
      }
    },
    // Adding isArray: true tells Orivus this is a list view
    "list": { "output": { "kind": "model", "modelName": "Post", "isArray": true } }
  }
}`}
                            </pre>
                        </div>
                    </section>

                    <section id="skipui" className="mb-16 scroll-mt-24">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">🛠️ Backend Only Modules</h2>
                        <p className="text-gray-600">
                            Sometimes you need a module just for database logic or an API endpoint (e.g., junction tables, webhooks).
                            Use the <code>skipUI</code> flag to prevent generating React components and Pages.
                        </p>
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                            <code className="text-amber-900 font-bold">"skipUI": true</code>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
