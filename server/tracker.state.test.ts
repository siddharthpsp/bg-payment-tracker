import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import { deserializeTrackerState, serializeTrackerState } from "./db";
import type { TrackerStatePayload } from "./db";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  getTrackerStateByUserId: vi.fn(),
  saveTrackerStateForUserId: vi.fn(),
}));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getTrackerStateByUserId: dbMocks.getTrackerStateByUserId,
    saveTrackerStateForUserId: dbMocks.saveTrackerStateForUserId,
  };
});

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 11): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `cloud-user-${userId}`,
    email: `cloud-user-${userId}@example.com`,
    name: "Cloud User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("tracker cloud state helpers", () => {
  it("serializes and deserializes tracker arrays without changing their contents", () => {
    const state: TrackerStatePayload = {
      invoices: [{ id: 1, invoiceNo: "GJ0160012325", paidAmt: 1686607.2 }],
      bgs: [{ id: 1, bgNo: "0452NDLG00001127", bgAmount: 40000000 }],
      paymentHistory: [{ id: 1, amountReceived: 2000000, allocations: [{ invoiceId: 1 }] }],
    };

    const serialized = serializeTrackerState(state);
    expect(JSON.parse(serialized.invoicesJson)).toEqual(state.invoices);
    expect(JSON.parse(serialized.bgsJson)).toEqual(state.bgs);
    expect(JSON.parse(serialized.paymentHistoryJson)).toEqual(state.paymentHistory);
    expect(deserializeTrackerState(serialized)).toEqual(state);
  });

  it("falls back to empty arrays for invalid stored JSON", () => {
    expect(deserializeTrackerState({
      invoicesJson: "not-json",
      bgsJson: JSON.stringify({ not: "an array" }),
      paymentHistoryJson: JSON.stringify([]),
    })).toEqual({ invoices: [], bgs: [], paymentHistory: [] });
  });
});

describe("tracker cloud procedures", () => {
  beforeEach(() => {
    dbMocks.getTrackerStateByUserId.mockReset();
    dbMocks.saveTrackerStateForUserId.mockReset();
  });

  it("loads cloud tracker state for the authenticated user", async () => {
    const expected: TrackerStatePayload = {
      invoices: [{ invoiceNo: "GJ0160003495" }],
      bgs: [{ bgNo: "HPCL-BG-2CR" }],
      paymentHistory: [],
    };
    dbMocks.getTrackerStateByUserId.mockResolvedValue(expected);

    const caller = appRouter.createCaller(createAuthContext(42));
    const result = await caller.tracker.getState();

    expect(dbMocks.getTrackerStateByUserId).toHaveBeenCalledWith(42);
    expect(result).toEqual(expected);
  });

  it("saves tracker state under the authenticated user's cloud workspace", async () => {
    const input: TrackerStatePayload = {
      invoices: [{ invoiceNo: "GJ0160013158", netAmt: 3269097.96 }],
      bgs: [{ bgNo: "0452NDLG00007726", bgAmount: 10000000 }],
      paymentHistory: [{ paymentDate: "2026-05-09", amountReceived: 500000 }],
    };
    dbMocks.saveTrackerStateForUserId.mockResolvedValue(input);

    const caller = appRouter.createCaller(createAuthContext(77));
    const result = await caller.tracker.saveState(input);

    expect(dbMocks.saveTrackerStateForUserId).toHaveBeenCalledWith(77, input);
    expect(result).toEqual(input);
  });
});
