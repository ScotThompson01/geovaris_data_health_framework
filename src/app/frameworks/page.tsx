import Link from "next/link";

import { getFrameworks } from "@/db/repositories/framework-repository";

export default async function FrameworksPage() {
  const frameworkList = await getFrameworks();

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              GeoVaris Assessment Platform
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Frameworks
            </h1>

            <p className="mt-2 text-slate-600">
              Manage assessment frameworks available within the platform.
            </p>
          </div>

          <Link
            href="/frameworks/new"
            className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white"
          >
            Add Framework
          </Link>
        </div>

        {frameworkList.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8">
            <h2 className="text-lg font-semibold text-slate-900">
              No frameworks found
            </h2>

            <p className="mt-2 text-slate-600">
              Create the first framework to begin configuring assessment
              methodologies.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {frameworkList.map((framework) => (
              <div
                key={framework.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {framework.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Code: {framework.code}
                    </p>

                    {framework.description && (
                      <p className="mt-3 text-slate-600">
                        {framework.description}
                      </p>
                    )}
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize text-slate-700">
                    {framework.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}