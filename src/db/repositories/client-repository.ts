import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import {
  clients,
  organizations,
} from "@/db/schema";

// ==================================================
// Client List
// ==================================================

export async function getClients() {
  return db
    .select({
      clientId:
        clients.id,

      organizationId:
        clients.organizationId,

      clientName:
        clients.name,

      legalName:
        clients.legalName,

      industry:
        clients.industry,

      status:
        clients.status,

      description:
        clients.description,

      createdAt:
        clients.createdAt,

      updatedAt:
        clients.updatedAt,
    })
    .from(clients)
    .orderBy(
      asc(clients.name),
    );
}

// ==================================================
// Client Details
// ==================================================

export async function getClientById(
  clientId: string,
) {
  const [client] = await db
    .select({
      clientId:
        clients.id,

      organizationId:
        clients.organizationId,

      clientName:
        clients.name,

      legalName:
        clients.legalName,

      industry:
        clients.industry,

      status:
        clients.status,

      description:
        clients.description,

      createdAt:
        clients.createdAt,

      updatedAt:
        clients.updatedAt,
    })
    .from(clients)
    .where(
      eq(
        clients.id,
        clientId,
      ),
    )
    .limit(1);

  return client ?? null;
}

// ==================================================
// Client Creation Options
// ==================================================

export async function getClientCreationOptions() {
  const organizationOptions =
    await db
      .select({
        id:
          organizations.id,

        name:
          organizations.name,
      })
      .from(organizations)
      .orderBy(
        asc(
          organizations.name,
        ),
      );

  return {
    organizations:
      organizationOptions,
  };
}

// ==================================================
// Create Client
// ==================================================

export async function createClient(
  input: {
    organizationId: string;
    name: string;
    legalName?: string | null;
    industry?: string | null;
    status?: string;
    description?: string | null;
  },
) {
  const [organization] =
    await db
      .select({
        id:
          organizations.id,
      })
      .from(organizations)
      .where(
        eq(
          organizations.id,
          input.organizationId,
        ),
      )
      .limit(1);

  if (!organization) {
    throw new Error(
      "Selected organization was not found.",
    );
  }

  const clientName =
    input.name.trim();

  if (!clientName) {
    throw new Error(
      "Client name is required.",
    );
  }

  const [client] =
    await db
      .insert(clients)
      .values({
        organizationId:
          input.organizationId,

        name:
          clientName,

        legalName:
          input.legalName?.trim() ||
          null,

        industry:
          input.industry?.trim() ||
          null,

        status:
          input.status ??
          "active",

        description:
          input.description?.trim() ||
          null,
      })
      .returning();

  return client;
}
// ==================================================
// Update Client
// ==================================================

export async function updateClient(
  input: {
    clientId: string;
    name: string;
    legalName?: string | null;
    industry?: string | null;
    status: string;
    description?: string | null;
  },
) {
  const clientName =
    input.name.trim();

  if (!clientName) {
    throw new Error(
      "Client name is required.",
    );
  }

  const [existingClient] =
    await db
      .select({
        id:
          clients.id,
      })
      .from(clients)
      .where(
        eq(
          clients.id,
          input.clientId,
        ),
      )
      .limit(1);

  if (!existingClient) {
    throw new Error(
      "Client was not found.",
    );
  }

  const [updatedClient] =
    await db
      .update(clients)
      .set({
        name:
          clientName,

        legalName:
          input.legalName?.trim() ||
          null,

        industry:
          input.industry?.trim() ||
          null,

        status:
          input.status,

        description:
          input.description?.trim() ||
          null,

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          clients.id,
          input.clientId,
        ),
      )
      .returning();

  if (!updatedClient) {
    throw new Error(
      "Client could not be updated.",
    );
  }

  return updatedClient;
}