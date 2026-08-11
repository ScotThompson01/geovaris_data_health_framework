import Link from "next/link";

import { createAssessmentAction } from "./actions";

import {
  getAssessmentCreationOptions,
} from "@/db/repositories/assessment-repository";

export default async function NewAssessmentPage() {
  const options =
    await getAssessmentCreationOptions();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/assessments"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Assessments
          </Link>

          <p className="mt-6 text-sm font-medium text-indigo-600">
            GeoVaris Assessment Platform
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Create New Assessment
          </h1>

          <p className="mt-2 text-slate-600">
            Create a new draft assessment for a client.
          </p>
        </div>

        <form
          action={createAssessmentAction}
          className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="clientId"
                className="block text-sm font-medium text-slate-700"
              >
                Client
              </label>

              <select
                id="clientId"
                name="clientId"
                required
                defaultValue=""
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
              >
                <option value="" disabled>
                  Select a client
                </option>

                {options.clients.map(
                  (client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.name}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="templateVersionId"
                className="block text-sm font-medium text-slate-700"
              >
                Assessment Template
              </label>

              <select
                id="templateVersionId"
                name="templateVersionId"
                required
                defaultValue=""
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
              >
                <option value="" disabled>
                  Select an assessment template
                </option>

                {options.templates.map(
                  (template) => (
                    <option
                      key={
                        template.templateVersionId
                      }
                      value={
                        template.templateVersionId
                      }
                    >
                      {template.frameworkName}
                      {" — "}
                      {template.methodologyName}
                      {" — "}
                      {template.templateName}
                      {" — v"}
                      {template.versionLabel}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="assessmentCode"
                className="block text-sm font-medium text-slate-700"
              >
                Assessment Code
              </label>

              <input
                id="assessmentCode"
                name="assessmentCode"
                type="text"
                required
                maxLength={50}
                placeholder="GDHF-TEST-002"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />

              <p className="mt-2 text-xs text-slate-500">
                Unique identifier for this assessment.
              </p>
            </div>

            <div>
              <label
                htmlFor="assessmentName"
                className="block text-sm font-medium text-slate-700"
              >
                Assessment Name
              </label>

              <input
                id="assessmentName"
                name="assessmentName"
                type="text"
                required
                maxLength={250}
                placeholder="Validation Test Assessment"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Optional description or assessment scope."
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>

          <div className="mt-8 flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
            <Link
              href="/assessments"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Create Assessment
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}