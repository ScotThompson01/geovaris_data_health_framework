import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/brand/AppShell";

import {
  getClientById,
} from "@/db/repositories/client-repository";

import {
  updateClientAction,
} from "./actions";

type EditClientPageProps = {
  params: Promise<{
    clientId: string;
  }>;
};

export default async function EditClientPage({
  params,
}: EditClientPageProps) {
  const { clientId } =
    await params;

  const client =
    await getClientById(
      clientId,
    );

  if (!client) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        {/* Navigation */}

        <div className="mb-6">
          <Link
            href={`/clients/${client.clientId}`}
            className="text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
          >
            ← Back to Client
          </Link>
        </div>

        {/* Header */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
            Client Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-brand-text">
            Edit Client
          </h1>

          <p className="mt-2 text-brand-muted">
            Update client information and
            administrative status.
          </p>
        </div>

        {/* Form */}

        <form
          action={updateClientAction}
          className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm"
        >
          <input
            type="hidden"
            name="clientId"
            value={client.clientId}
          />

          <div className="grid gap-6 sm:grid-cols-2">
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
                defaultValue={
                  client.clientName
                }
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
                defaultValue={
                  client.legalName ?? ""
                }
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
                defaultValue={
                  client.industry ?? ""
                }
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
                required
                defaultValue={
                  client.status
                }
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
                defaultValue={
                  client.description ?? ""
                }
                className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm text-brand-text"
              />
            </div>
          </div>

          {/* Actions */}

          <div className="mt-6 flex justify-end gap-3 border-t border-brand-border pt-6">
            <Link
              href={`/clients/${client.clientId}`}
              className="rounded-lg border border-brand-border px-5 py-2.5 text-sm font-medium text-brand-text hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}