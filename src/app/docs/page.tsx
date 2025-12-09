"use client";

import { Badge } from "@orivus-ui/components/Badge";
import { Button } from "@orivus-ui/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@orivus-ui/components/Card";
import { ArrowRight, Box, Code, Copy, FileJson, Layers, Terminal, Zap } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex items-start gap-10 max-w-7xl mx-auto px-6 py-10 min-h-screen">
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-64 shrink-0 hidden lg:block sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pr-4">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-sm mb-2 text-foreground">Getting Started</h4>
                        <nav className="space-y-1 text-sm border-l border-muted pl-4">
                            <NavItem onClick={() => scrollTo('intro')}>Introduction</NavItem>
                            <NavItem onClick={() => scrollTo('installation')}>Installation</NavItem>
                            <NavItem onClick={() => scrollTo('workflow')}>The AI Workflow</NavItem>
                        </nav>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-2 text-foreground">Core Concepts</h4>
                        <nav className="space-y-1 text-sm border-l border-muted pl-4">
                            <NavItem onClick={() => scrollTo('architecture')}>Architecture</NavItem>
                            <NavItem onClick={() => scrollTo('smart-merge')}>Smart Merge</NavItem>
                        </nav>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-2 text-foreground">References</h4>
                        <nav className="space-y-1 text-sm border-l border-muted pl-4">
                            <NavItem onClick={() => scrollTo('spec-guide')}>Spec Guide</NavItem>
                            <NavItem onClick={() => scrollTo('cli')}>CLI Commands</NavItem>
                        </nav>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 space-y-16 pb-20">

                {/* INTRO */}
                <section id="intro" className="space-y-6">
                    <div className="space-y-2">
                        <Badge variant="secondary" className="w-fit">v0.5.0-alpha</Badge>
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Documentation</h1>
                        <p className="text-xl text-muted-foreground">
                            Build scalable, type-safe backends at the speed of thought.
                        </p>
                    </div>

                    <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-primary" />
                                Why OrivusJS?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed">
                            OrivusJS establishes a <strong>protocol for AI collaboration</strong>. By defining your domain in strict JSON Specifications, you give LLMs (like Cursor or Copilot) the constraints they need to generate perfect, production-ready code. No boilerplate, no spaghetti code, just features.
                        </CardContent>
                    </Card>
                </section>

                {/* INSTALLATION */}
                <section id="installation" className="space-y-6 scroll-mt-24">
                    <h2 className="text-3xl font-bold tracking-tight">Installation</h2>
                    <p className="text-muted-foreground">Get your first Orivus project running in seconds.</p>

                    <div className="space-y-4">
                        <CodeBlock title="Terminal">
                            {`git clone https://github.com/orivusenterprise/orivusjs.git my-startup
cd my-startup
npm install
npm run dev`}
                        </CodeBlock>
                        <p className="text-sm text-muted-foreground">
                            The server will start at <code className="bg-muted px-1 py-0.5 rounded text-foreground">http://localhost:3000</code>.
                        </p>
                    </div>
                </section>

                {/* WORKFLOW */}
                <section id="workflow" className="space-y-6 scroll-mt-24">
                    <h2 className="text-3xl font-bold tracking-tight">The AI Workflow</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <StepCard number="1" title="Describe" icon={FileJson}>
                            Create a Spec file in <code>specs/</code> defining your models, fields, and desired actions.
                        </StepCard>
                        <StepCard number="2" title="Generate" icon={Terminal}>
                            Run <code>npm run orivus:create</code> to scaffold the entire vertical slice.
                        </StepCard>
                        <StepCard number="3" title="Refine" icon={Code}>
                            Orivus writes the code, you refine the business logic. Smart Merge protects your changes.
                        </StepCard>
                    </div>
                </section>

                {/* SPEC GUIDE */}
                <section id="spec-guide" className="space-y-6 scroll-mt-24">
                    <h2 className="text-3xl font-bold tracking-tight">Spec Guide</h2>
                    <p className="text-muted-foreground">
                        The Spec is the single source of truth. It defines the Data Model (Prisma), API (tRPC), and Validation (Zod).
                    </p>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Example Spec</h3>
                        <CodeBlock title="specs/blog.json" language="json">
                            {`{
  "name": "post",
  "models": {
    "Post": {
      "title": { "type": "string", "required": true },
      "content": { "type": "string" },
      "tags": { "type": "string", "isArray": true }
    }
  },
  "actions": {
    "create": { 
      "type": "create",
      "input": { "title": { "type": "string" } },
      "output": { "kind": "model", "modelName": "Post" }
    },
    "list": { "type": "list", "output": { "kind": "model", "modelName": "Post", "isArray": true } }
  }
}`}
                        </CodeBlock>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="p-4 rounded-lg bg-card border">
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><Box className="h-4 w-4" /> Supported Types</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    <li><code>string</code>, <code>number</code>, <code>boolean</code></li>
                                    <li><code>date</code>, <code>json</code></li>
                                    <li><code>relation</code> (one-to-one, one-to-many)</li>
                                </ul>
                            </div>
                            <div className="p-4 rounded-lg bg-card border">
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><Layers className="h-4 w-4" /> Action Types</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    <li><code>create</code> - Standard mutation</li>
                                    <li><code>update</code>, <code>delete</code> - ID based mutations</li>
                                    <li><code>list</code>, <code>get</code> - Query actions</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ARCHITECTURE */}
                <section id="architecture" className="space-y-6 scroll-mt-24">
                    <h2 className="text-3xl font-bold tracking-tight">Architecture</h2>
                    <p className="text-muted-foreground">
                        OrivusJS enforces <strong>Modular Domain-Driven Design (Vertical Slices)</strong>. Each feature allows you to scale without spaghetti code.
                    </p>

                    <Card>
                        <CardHeader className="bg-muted/50 pb-4">
                            <CardTitle className="text-sm font-mono">Directory Structure</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <pre className="p-4 text-sm font-mono overflow-x-auto bg-zinc-950 text-zinc-50 rounded-b-lg">
                                {`src/
  ├── domain/            # Vertical Slices (Your Features)
  │   ├── post/
  │   │   ├── post.schema.ts  # Zod Validation
  │   │   ├── post.service.ts # Business Logic
  │   │   ├── post.router.ts  # API Layer
  │   │   ├── post.test.ts    # Integration Tests
  │   │   └── ui/             # React Components
  │   └── user/
  │
  ├── app/               # Next.js App Router (Pages)
  └── server/            # Core Infrastructure`}
                            </pre>
                        </CardContent>
                    </Card>
                </section>

                {/* SMART MERGE */}
                <section id="smart-merge" className="space-y-6 scroll-mt-24">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight">Smart Merge Protection</h2>
                        <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">New in v0.5</Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Never fear running the generator again. OrivusJS intelligently detects if you have modified a generated file.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader><CardTitle className="text-base">🛡️ Safe Updates</CardTitle></CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                If you haven't touched a file, Orivus will automatically update it to the latest spec version.
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="text-base">🛑 Conflict Prevention</CardTitle></CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                If you modified a file manually, Orivus detects the change and creates a <code>.new</code> file instead of overwriting your work.
                            </CardContent>
                        </Card>
                    </div>
                </section>

            </main>
        </div>
    );
}

// --- SUB COMPONENTS ---

function NavItem({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="block w-full text-left py-1.5 px-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
        >
            {children}
        </button>
    );
}

function CodeBlock({ title, children, language = "bash" }: { title: string; children: string; language?: string }) {
    return (
        <div className="rounded-lg border bg-zinc-950 text-zinc-50 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                <span className="text-xs font-mono text-zinc-400">{title}</span>
                <Copy className="h-3 w-3 text-zinc-500 cursor-pointer hover:text-zinc-300" />
            </div>
            <pre className="p-4 text-sm font-mono overflow-x-auto">
                <code className={`language-${language}`}>{children}</code>
            </pre>
        </div>
    );
}

function StepCard({ number, title, children, icon: Icon }: { number: string; title: string; children: React.ReactNode; icon: any }) {
    return (
        <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <span className="text-6xl font-black">{number}</span>
            </div>
            <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 text-primary">
                    <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                {children}
            </CardContent>
        </Card>
    );
}

