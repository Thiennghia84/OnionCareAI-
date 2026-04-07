import React, { useState } from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, GraduationCap, History, Settings, Menu, X, Key, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'diagnosis', label: 'Tư vấn AI', icon: GraduationCap },
    { id: 'history', label: 'Lịch sử', icon: History },
    { id: 'settings', label: 'Cấu hình', icon: Settings },
  ] as const;

  const handleNavClick = (view: ViewState) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-primary-600">
          <GraduationCap className="w-6 h-6" />
          <span className="font-bold text-lg">Skill Education</span>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href="https://aistudio.google.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-red-500 font-bold hover:underline flex items-center gap-1"
          >
            Lấy API key
            <ExternalLink className="w-3 h-3" />
          </a>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0",
        isMobileMenuOpen ? "translate-x-0 pt-16 lg:pt-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="hidden lg:flex items-center gap-3 px-6 py-8 text-primary-600">
            <GraduationCap className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight">Skill Education</span>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary-50 text-primary-600 shadow-sm" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-primary-600" : "text-slate-400")} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <a 
              href="https://aistudio.google.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 p-4 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center gap-2 text-red-600">
                <Key className="w-4 h-4" />
                <span className="font-bold text-xs">Lấy API key để sử dụng app</span>
              </div>
              <p className="text-[10px] text-red-500/80 leading-relaxed font-medium"> Click để nhận key miễn phí từ Google AI Studio </p>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col pt-16 lg:pt-0 h-screen overflow-hidden relative">
        {/* Desktop Header Overlay for API Key */}
        <div className="hidden lg:flex absolute top-0 right-0 p-8 z-10 pointer-events-none">
          <a 
            href="https://aistudio.google.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-red-100 rounded-full shadow-sm hover:bg-white transition-all transform hover:scale-105"
          >
            <span className="text-red-500 font-bold text-xs">Lấy API key để sử dụng app</span>
            <ExternalLink className="w-3 h-3 text-red-400" />
          </a>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
