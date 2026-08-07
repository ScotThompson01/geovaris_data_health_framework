import Link from "next/link";

import { createFrameworkAction } from "../actions";

export default function NewFrameworkPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            GeoVaris Assessment Platform
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Create Framework
          </h1>

          <p className="mt-2 text-slate-600">
            Add a new assessment framework to the platform.
          </p>
        </div>

        <form
          action={createFrameworkAction}
          className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              name="name"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="AI Readiness Framework"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Code
            </label>
            <input
              name="code"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="AIRF"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              rows={5}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Describe the purpose of this framework."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white"
            >
              Create Framework
            </button>

            <Link
              href="/frameworks"
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
