import React from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, Users, LogOut } from "lucide-react";

export function AdminLayout() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
      isActive
        ? "bg-brand-50 text-brand-600"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">B</div>
          <span className="font-bold text-gray-900 tracking-tight">Bitlance CMS</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/admin" end className={navClass}>
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/articles" className={navClass}>
            <FileText className="h-5 w-5" />
            Articles
          </NavLink>
          <NavLink to="/admin/users" className={navClass}>
            <Users className="h-5 w-5" />
            Users
          </NavLink>
          <NavLink to="/admin/settings" className={navClass}>
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
           <Link to="/" className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-gray-900 transition-colors">
             <LogOut className="h-5 w-5" />
             Exit to Site
           </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
