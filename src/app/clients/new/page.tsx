import Link from "next/link";

import { AppShell } from "@/components/brand/AppShell";

import {
  getClientCreationOptions,
} from "@/db/repositories/client-repository";

import {
  createClientAction,
} from "./actions";

export default async function NewClientPage() {
  const options =
    await getClientCreationOptions();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="mb-6">
          <Link
            href="/clients"
            className="text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
          >
            ← Back to Clients
          </Link>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
            Client Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-brand-text">
            Create New Client
          </h1>

          <p className="mt-2 max-w-2xl text-brand-muted">
            Create a client organization
            that can be assigned assessment
            templates and evaluated through
            the GeoVaris Data Health Framework™.
          </p>
        </div>

        <form
          action={createClientAction}
          className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Organization */}

            <div className="sm:col-span-2">
              <label
                htmlFor="organizationId"
                className="text-sm font-medium text-brand-text"
              >
                Organization
              </label>

              <select
                id="organizationId"
                name="organizationId"
                required
                defaultValue=""
                className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-text"
              >
                <option
                  value=""
                  disabled
                >
                  Select organization
                </option>

                {options.organizations.map(
                  (organization) => (
                    <option
                      key={
                        organization.id
                      }
                      value={
                        organization.id
                      }
                    >
                      {
                        organization.name
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Client Name */}

            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-brand-text"
              >
                Client Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={200}
                className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm text-brand-text"
              />
            </div>

            {/* Legal Name */}

            <div>
              <label
                htmlFor="legalName"
                className="text-sm font-medium text-brand-text"
              >
                Legal Name
              </label>

              <input
                id="legalName"
                name="legalName"
                type="text"
                maxLength={250}
                className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm text-brand-text"
              />
            </div>

            {/* Industry */}

            <div>
              <label
                htmlFor="industry"
                className="text-sm font-medium text-brand-text"
              >
                Industry
              </label>

              <input
                id="industry"
                name="industry"
                type="text"
                maxLength={100}
                placeholder="e.g. Telecommunications"
                className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm text-brand-text"
              />
            </div>

            {/* Status */}

            <div>
              <label
                htmlFor="status"
                className="text-sm font-medium text-brand-text"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue="active"
                className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-text"
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

            {/* Description */}

            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-brand-text"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Optional notes or description for this client."
                className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm text-brand-text"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-brand-border pt-6">
            <Link
              href="/clients"
              className="rounded-lg border border-brand-border px-5 py-2.5 text-sm font-medium text-brand-text hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
            >
              Create Client
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}