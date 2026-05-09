import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import { deserializeTrackerState, serializeTrackerState } from "./db";
import type { TrackerStatePayload } from "./db";
import type { TrpcContext } from "./_core/context";
import { allocateDirectPayment, deletePaymentEntry, removeInvoicePayments, restoreReportedInvoice } from "../shared/trackerLogic";

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

  it("persists add, edit, delete, payment allocation, payment deletion, and restore flows across fresh cloud reads", async () => {
    const userId = 91;
    let storedState: TrackerStatePayload = { invoices: [], bgs: [], paymentHistory: [] };

    dbMocks.getTrackerStateByUserId.mockImplementation(async () => storedState);
    dbMocks.saveTrackerStateForUserId.mockImplementation(async (_savedUserId: number, nextState: TrackerStatePayload) => {
      storedState = JSON.parse(JSON.stringify(nextState)) as TrackerStatePayload;
      return storedState;
    });

    const saveCaller = appRouter.createCaller(createAuthContext(userId));
    const freshRead = async () => appRouter.createCaller(createAuthContext(userId)).tracker.getState();

    const addedState: TrackerStatePayload = {
      invoices: [{ id: 1, invoiceNo: "GJ0160012325", netAmt: 2967174.9, paidAmt: 0, status: "unpaid" }],
      bgs: [{ id: 1, bgNo: "HPCL-BG-2CR", bgAmount: 20000000, marginPct: 15 }],
      paymentHistory: [],
    };
    await saveCaller.tracker.saveState(addedState);
    expect(await freshRead()).toEqual(addedState);

    const editedState: TrackerStatePayload = {
      ...addedState,
      invoices: [{ ...addedState.invoices[0], terminal: "HPCL PIPAVAV", qty: 28.5 }],
      bgs: [{ ...addedState.bgs[0], bankName: "ICICI Bank - Himatnagar" }],
    };
    await saveCaller.tracker.saveState(editedState);
    expect(await freshRead()).toEqual(editedState);

    const paymentAllocatedState: TrackerStatePayload = {
      ...editedState,
      invoices: [{ ...editedState.invoices[0], paidAmt: 1686607.2, status: "partial", paidDate: "2026-05-08" }],
      paymentHistory: [{
        id: 10,
        paymentDate: "2026-05-08",
        company: "HPCL",
        amountReceived: 1686607.2,
        allocatedAmount: 1686607.2,
        unallocatedAmount: 0,
        allocations: [{ invoiceId: 1, invoiceNo: "GJ0160012325", amountAdjusted: 1686607.2 }],
      }],
    };
    await saveCaller.tracker.saveState(paymentAllocatedState);
    expect(await freshRead()).toEqual(paymentAllocatedState);

    const paymentDeletedState: TrackerStatePayload = {
      ...editedState,
      invoices: [{ ...editedState.invoices[0], paidAmt: 0, status: "unpaid", paidDate: null }],
      paymentHistory: [],
    };
    await saveCaller.tracker.saveState(paymentDeletedState);
    expect(await freshRead()).toEqual(paymentDeletedState);

    const invoiceDeletedState: TrackerStatePayload = {
      invoices: [],
      bgs: paymentDeletedState.bgs,
      paymentHistory: [],
    };
    await saveCaller.tracker.saveState(invoiceDeletedState);
    expect(await freshRead()).toEqual(invoiceDeletedState);

    await saveCaller.tracker.saveState(addedState);
    expect(await freshRead()).toEqual(addedState);
    expect(dbMocks.getTrackerStateByUserId).toHaveBeenCalledWith(userId);
    expect(dbMocks.saveTrackerStateForUserId).toHaveBeenCalledWith(userId, expect.any(Object));
  });
});

describe("shared tracker business logic", () => {
  it("allocates a lump-sum company payment to the oldest pending invoices first", () => {
    const invoices = [
      { id: 2, invoiceNo: "NEW", company: "HPCL", date: "2026-05-02", dueDate: "2026-06-01", terminal: "HPCL PIPAVAV", netAmt: 200, paidAmt: 0, status: "unpaid" },
      { id: 1, invoiceNo: "OLD", company: "HPCL", date: "2026-04-16", dueDate: "2026-05-16", terminal: "HPCL PIPAVAV", netAmt: 100, paidAmt: 25, status: "partial" },
      { id: 3, invoiceNo: "IOCL", company: "IOCL", date: "2026-04-16", dueDate: "2026-05-15", terminal: "IOCL", netAmt: 500, paidAmt: 0, status: "unpaid" },
    ];

    const result = allocateDirectPayment(invoices, [], {
      company: "HPCL",
      amount: 125,
      paymentDate: "2026-05-09",
      paymentId: 99,
    });

    expect(result.invoices.find(inv => inv.id === 1)).toMatchObject({ paidAmt: 100, status: "paid", paidDate: "2026-05-09" });
    expect(result.invoices.find(inv => inv.id === 2)).toMatchObject({ paidAmt: 50, status: "partial", paidDate: "2026-05-09" });
    expect(result.invoices.find(inv => inv.id === 3)).toMatchObject({ paidAmt: 0, status: "unpaid" });
    expect(result.paymentHistory[0]).toMatchObject({ id: 99, amountReceived: 125, allocatedAmount: 125, unallocatedAmount: 0 });
    expect(result.paymentHistory[0].allocations.map(row => row.invoiceNo)).toEqual(["OLD", "NEW"]);
  });

  it("reverses payment deletion and per-invoice payment removal without losing unallocated amounts", () => {
    const invoices = [
      { id: 1, invoiceNo: "A", company: "HPCL", netAmt: 100, paidAmt: 100, paidDate: "2026-05-09", status: "paid" },
      { id: 2, invoiceNo: "B", company: "HPCL", netAmt: 200, paidAmt: 50, paidDate: "2026-05-09", status: "partial" },
    ];
    const paymentHistory = [{
      id: 10,
      allocatedAmount: 150,
      unallocatedAmount: 25,
      allocations: [
        { invoiceId: 1, amountAdjusted: 100 },
        { invoiceId: 2, amountAdjusted: 50 },
      ],
    }];

    const deleted = deletePaymentEntry(invoices, paymentHistory, 10);
    expect(deleted.invoices).toEqual([
      { ...invoices[0], paidAmt: 0, paidDate: null, status: "unpaid" },
      { ...invoices[1], paidAmt: 0, paidDate: null, status: "unpaid" },
    ]);
    expect(deleted.paymentHistory).toEqual([]);

    const removed = removeInvoicePayments(invoices, paymentHistory, 2);
    expect(removed.invoices.find(inv => inv.id === 2)).toMatchObject({ paidAmt: 0, paidDate: null, status: "unpaid" });
    expect(removed.paymentHistory[0]).toMatchObject({ allocatedAmount: 100, unallocatedAmount: 75 });
    expect(removed.paymentHistory[0].allocations).toEqual([{ invoiceId: 1, amountAdjusted: 100 }]);
  });

  it("restores the reported GJ0160012325 invoice exactly once", () => {
    const restored = restoreReportedInvoice([], 12345);
    expect(restored).toHaveLength(1);
    expect(restored[0]).toMatchObject({ invoiceNo: "GJ0160012325", paidAmt: 1686607.2, status: "partial" });
    expect(restoreReportedInvoice(restored, 67890)).toBe(restored);
  });
});
