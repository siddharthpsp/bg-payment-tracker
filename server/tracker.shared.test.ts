import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMock = vi.hoisted(() => ({
  getSharedTrackerState: vi.fn(),
  saveSharedTrackerState: vi.fn(),
  getTrackerStateByUserId: vi.fn(),
  saveTrackerStateForUserId: vi.fn(),
}));

vi.mock("./db", () => dbMock);

const { appRouter } = await import("./routers");

const createPublicContext = (): TrpcContext => ({
  user: null,
  req: {
    protocol: "https",
    headers: {},
  } as TrpcContext["req"],
  res: {
    clearCookie: vi.fn(),
  } as unknown as TrpcContext["res"],
});

describe("tracker shared cloud state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows the GitHub Pages frontend to read shared cloud state without an authenticated user", async () => {
    const cloudState = {
      invoices: [{ invoiceNo: "GJ0160012325" }],
      bgs: [{ bgNo: "HPCL-BG-2CR" }],
      paymentHistory: [{ id: 1, amountReceived: 1000 }],
    };
    dbMock.getSharedTrackerState.mockResolvedValue(cloudState);

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.tracker.getSharedState();

    expect(result).toEqual(cloudState);
    expect(dbMock.getSharedTrackerState).toHaveBeenCalledTimes(1);
  });

  it("allows the GitHub Pages frontend to save shared cloud state without browser local storage", async () => {
    const input = {
      invoices: [{ invoiceNo: "GJ0160013158", paidAmt: 0 }],
      bgs: [{ bgNo: "0452NDLG00001127", bgAmount: 40000000 }],
      paymentHistory: [],
    };
    dbMock.saveSharedTrackerState.mockResolvedValue(input);

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.tracker.saveSharedState(input);

    expect(result).toEqual(input);
    expect(dbMock.saveSharedTrackerState).toHaveBeenCalledWith(input);
  });
});
