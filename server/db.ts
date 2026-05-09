import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertTrackerState, InsertUser, trackerStates, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export type TrackerStatePayload = {
  invoices: unknown[];
  bgs: unknown[];
  paymentHistory: unknown[];
};

const SHARED_TRACKER_USER_ID = 0;

const parseJsonArray = (value: string | null | undefined): unknown[] => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function normalizeTrackerState(state: TrackerStatePayload): TrackerStatePayload {
  return {
    invoices: Array.isArray(state.invoices) ? state.invoices : [],
    bgs: Array.isArray(state.bgs) ? state.bgs : [],
    paymentHistory: Array.isArray(state.paymentHistory) ? state.paymentHistory : [],
  };
}

export function serializeTrackerState(input: TrackerStatePayload): Pick<InsertTrackerState, "invoicesJson" | "bgsJson" | "paymentHistoryJson"> {
  const normalized = normalizeTrackerState(input);
  return {
    invoicesJson: JSON.stringify(normalized.invoices),
    bgsJson: JSON.stringify(normalized.bgs),
    paymentHistoryJson: JSON.stringify(normalized.paymentHistory),
  };
}

export function deserializeTrackerState(row: { invoicesJson: string; bgsJson: string; paymentHistoryJson: string }): TrackerStatePayload {
  return {
    invoices: parseJsonArray(row.invoicesJson),
    bgs: parseJsonArray(row.bgsJson),
    paymentHistory: parseJsonArray(row.paymentHistoryJson),
  };
}

export async function getTrackerStateByUserId(userId: number): Promise<TrackerStatePayload | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get tracker state: database not available");
    return null;
  }

  const rows = await db.select().from(trackerStates).where(eq(trackerStates.userId, userId)).limit(1);
  if (rows.length === 0) return null;

  return deserializeTrackerState(rows[0]);
}

export async function saveTrackerStateForUserId(userId: number, state: TrackerStatePayload): Promise<TrackerStatePayload> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available; tracker data could not be saved to cloud storage.");
  }

  const normalized = normalizeTrackerState(state);
  const serialized = serializeTrackerState(normalized);
  await db.insert(trackerStates).values({
    userId,
    ...serialized,
  }).onDuplicateKeyUpdate({
    set: serialized,
  });

  return normalized;
}

export async function getSharedTrackerState(): Promise<TrackerStatePayload | null> {
  return getTrackerStateByUserId(SHARED_TRACKER_USER_ID);
}

export async function saveSharedTrackerState(state: TrackerStatePayload): Promise<TrackerStatePayload> {
  return saveTrackerStateForUserId(SHARED_TRACKER_USER_ID, state);
}
