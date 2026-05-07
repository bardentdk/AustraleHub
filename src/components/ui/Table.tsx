"use client";
import React from 'react';

export const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
    <table className="w-full text-left border-collapse">
      {children}
    </table>
  </div>
);

export const THead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-slate-50/50 border-b border-slate-200">
    {children}
  </thead>
);

export const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
    {children}
  </th>
);

export const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-6 py-4 text-sm text-slate-600 border-b border-slate-100 last:border-0 ${className}`}>
    {children}
  </td>
);

export const Badge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: 'success' | 'warning' | 'error' | 'info' | 'default' }) => {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    error: "bg-red-50 text-red-700 border-red-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
    default: "bg-slate-50 text-slate-700 border-slate-100",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[variant]}`}>
      {children}
    </span>
  );
};