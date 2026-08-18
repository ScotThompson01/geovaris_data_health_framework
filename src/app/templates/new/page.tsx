import Link from "next/link";

import { AppShell } from "@/components/brand/AppShell";

import {
  getTemplateCreationOptions,
} from "@/db/repositories/template-repository";

import {
  createAssessmentTemplateAction,
} from "./actions";

export default async function NewTemplatePage() {
  const options =
    await getTemplateCreationOptions();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        {/* Navigation */}

        <div className="mb-6">
          <Link
            href="/templates"
            className="text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
          >
            ← Back to Assessment Templates
          </Link>
        </div>

        {/* Header */}

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
            Template Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-brand-text">
            Create New Assessment Template
          </h1>

          <p className="mt-2 max-w-2xl text-brand-muted">
            Create a new assessment template
            and initialize its first draft as
            Version 1.0.
          </p>
        </div>

        {/* Form */}

        <form
          action={createAssessmentTemplateAction}
          className="rounded-2xl border border-brand-border bg-white p-8 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Methodology */}

            <div className="md:col-span-2">
              <label
                htmlFor="methodologyId"
                className="block text-sm font-medium text-brand-text"
              >
                Framework / Methodology
              </label>

              <select
                id="methodologyId"
                name="methodologyId"
                required
                defaultValue=""
                className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-brand-text"
              >
                <option
                  value=""
                  disabled
                >
                  Select a framework and methodology
                </option>

                {options.methodologies.map(
                  (methodology) => (
                    <option
                      key={
                        methodology.methodologyId
                      }
                      value={
                        methodology.methodologyId
                      }
                    >
                      {
                        methodology.frameworkName
                      }
                      {" — "}
                      {
                        methodology.methodologyName
                      }
                    </option>
                  ),
                )}
              </select>

              <p className="mt-2 text-xs text-brand-muted">
                The selected methodology
                determines the framework and
                organization for this template.
              </p>
            </div>

            {/* Template Name */}

            <div className="md:col-span-2">
              <label
                htmlFor="templateName"
                className="block text-sm font-medium text-brand-text"
              >
                Template Name
              </label>

              <input
                id="templateName"
                name="templateName"
                type="text"
                required
                maxLength={200}
                placeholder="Enterprise Data Health Assessment"
                className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
              />
            </div>

            {/* Scope */}

            <div>
              <label
                htmlFor="templateScope"
                className="block text-sm font-medium text-brand-text"
              >
                Template Scope
              </label>

              <select
                id="templateScope"
                name="templateScope"
                defaultValue="master"
                className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-brand-text"
              >
                <option value="master">
                  Master
                </option>

                <option value="client">
                  Client Specific
                </option>

                <option value="industry">
                  Industry Specific
                </option>

                <option value="specialized">
                  Specialized
                </option>
              </select>
            </div>

            {/* Initial Version */}

            <div>
              <p className="block text-sm font-medium text-brand-text">
                Initial Version
              </p>

              <div className="mt-2 rounded-lg border border-brand-border bg-slate-50 px-3 py-2.5">
                <p className="font-medium text-brand-text">
                  Version 1.0
                </p>

                <p className="mt-1 text-xs text-brand-muted">
                  Draft
                </p>
              </div>
            </div>

            {/* Description */}

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-brand-text"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe the purpose, intended audience, and scope of this assessment template."
                className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
              />
            </div>
          </div>

          {/* Actions */}

          <div className="mt-8 flex flex-wrap items-center justify-end gap-4 border-t border-brand-border pt-6">
            <Link
              href="/templates"
              className="rounded-lg border border-brand-border px-5 py-2.5 text-sm font-medium text-brand-text hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
            >
              Create Template
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}