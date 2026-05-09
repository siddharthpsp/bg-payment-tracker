import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("tracker frontend cloud persistence wiring", () => {
  it("loads and saves tracker data through the authenticated cloud tRPC procedures", () => {
    expect(homeSource).toContain("trpc.tracker.getState.useQuery");
    expect(homeSource).toContain("trpc.tracker.saveState.useMutation");
    expect(homeSource).toContain("saveTrackerState.mutate({ invoices, bgs, paymentHistory })");
    expect(homeSource).toContain("const restoredInvoices = Array.isArray(cloudState.invoices) ? cloudState.invoices : INITIAL_INVOICES");
    expect(homeSource).toContain("setInvoices(missingReportedInvoice ? [...restoredInvoices, buildReportedRestoreInvoice(restoredInvoices)]");
    expect(homeSource).toContain("setBgs(Array.isArray(cloudState.bgs) ? cloudState.bgs : INITIAL_BGS)");
    expect(homeSource).toContain("setPaymentHistory(Array.isArray(cloudState.paymentHistory) ? cloudState.paymentHistory : [])");
  });

  it("does not use browser-local persistence or import/export backup controls", () => {
    expect(homeSource).not.toContain("localStorage");
    expect(homeSource).not.toContain("handleExportData");
    expect(homeSource).not.toContain("handleImportData");
    expect(homeSource).not.toContain("importInputRef");
    expect(homeSource).not.toContain(">Export Data<");
    expect(homeSource).not.toContain(">Import Data<");
  });
});
