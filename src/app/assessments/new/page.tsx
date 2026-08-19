import Link from "next/link";

import { AppShell } from "@/components/brand/AppShell";

import {
  getAssessmentCreationOptions,
} from "@/db/repositories/assessment-repository";

import {
  createAssessmentAction,
} from "./actions";

type NewAssessmentPageProps = {
  searchParams: Promise<{
    clientId?: string;
  }>;
};

export default async function NewAssessmentPage({
  searchParams,
}: NewAssessmentPageProps) {
  const { clientId } =
    await searchParams;

  const options =
    await getAssessmentCreationOptions();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/assessments"
            className="text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
          >
            ← Back to Assessments
          </Link>

          <p className="mt-6 text-sm font-medium text-brand-purple">
            GeoVaris Assessment Platform
          </p>

          <h1 className="mt-1 text-3xl font-bold text-brand-text">
            Create New Assessment
          </h1>

          <p className="mt-2 text-brand-muted">
            Create a new draft assessment for a client.
          </p>
        </div>

        <form
          action={createAssessmentAction}
          className="rounded-xl border border-brand-border bg-brand-surface p-8 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Client */}

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
                defaultValue={
                  clientId ?? ""
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
              >
                <option
                  value=""
                  disabled
                >
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

            {/* Assessment Template */}

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
                <option
                  value=""
                  disabled
                >
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

            {/* Assessment Code */}

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

            {/* Assessment Name */}

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

          {/* Description */}

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

          {/* Actions */}

          <div className="mt-8 flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
            <Link
              href="/assessments"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
            >
              Create Assessment
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}