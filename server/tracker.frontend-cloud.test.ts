import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const mainSource = readFileSync(resolve(process.cwd(), "client/src/main.tsx"), "utf8");

describe("tracker frontend static JSON persistence wiring", () => {
  it("loads and saves tracker data through browser localStorage keys", () => {
    expect(homeSource).toContain('window.localStorage.getItem("bgpt.invoices")');
    expect(homeSource).toContain('window.localStorage.getItem("bgpt.bgs")');
    expect(homeSource).toContain('window.localStorage.getItem("bgpt.paymentHistory")');
    expect(homeSource).toContain('window.localStorage.setItem("bgpt.invoices", JSON.stringify(invoices))');
    expect(homeSource).toContain('window.localStorage.setItem("bgpt.bgs", JSON.stringify(bgs))');
    expect(homeSource).toContain('window.localStorage.setItem("bgpt.paymentHistory", JSON.stringify(paymentHistory))');
  });

  it("keeps JSON backup import/export controls available for browser-to-browser transfer", () => {
    expect(homeSource).toContain("function handleExportData()");
    expect(homeSource).toContain("function handleImportData(event)");
    expect(homeSource).toContain("importInputRef");
    expect(homeSource).toContain(">Export Data<");
    expect(homeSource).toContain(">Import Data<");
    expect(homeSource).toContain("bg-payment-tracker-backup-");
  });

  it("does not mount the authenticated tRPC cloud client in the static entry path", () => {
    expect(mainSource).not.toContain("trpc.Provider");
    expect(mainSource).not.toContain("QueryClientProvider");
    expect(homeSource).not.toContain("trpc.tracker.getState.useQuery");
    expect(homeSource).not.toContain("trpc.tracker.saveState.useMutation");
  });
});
