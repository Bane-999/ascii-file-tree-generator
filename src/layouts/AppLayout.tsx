import {Folder} from 'lucide-react';
import type {ReactNode} from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({children}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 p-4 font-sans text-zinc-50 md:p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex items-center gap-3 border-b border-zinc-900 pb-4">
          <div className="rounded-lg bg-emerald-500/10 p-2">
            <Folder className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
              ASCII File Tree Generator
            </h1>
            <p className="text-sm text-zinc-400">
              Convert indented text or folders into clean ASCII directory trees.
            </p>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
