"use client";

export function PrintReportButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-purple-dark"
    >
      Print / Save as PDF
    </button>
  );
}