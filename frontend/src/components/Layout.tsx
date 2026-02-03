import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            {/* Spill logo - speech bubble shape with smile */}
            <svg width="26" height="30" viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M62 3C72 8 85 28 85 55C85 82 65 97 40 97C15 97 0 78 0 55C0 32 18 18 35 18C48 18 55 12 62 3Z" fill="#2DD4BF"/>
              <path d="M18 58C20 68 28 76 42 74" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none"/>
            </svg>
            <span className="text-xl font-extrabold text-slate-900">spill</span>
          </Link>
          <nav className="flex items-center gap-6">
            <a
              href="https://spill.chat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              About us
            </a>
            <a
              href="mailto:support@spill.chat"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Need help?
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full">
        {children}
      </main>
      <footer className="bg-slate-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            Spill
          </p>
        </div>
      </footer>
    </div>
  );
}
