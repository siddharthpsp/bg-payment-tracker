import fs from 'node:fs';

const path = '/home/ubuntu/bg-payment-tracker/client/src/pages/Home.tsx';
let text = fs.readFileSync(path, 'utf8');

text = text.replace('import { useState, useMemo, useEffect, useRef } from "react";\n', 'import { useState, useMemo, useEffect } from "react";\nimport { trpc } from "@/lib/trpc";\n');

const oldStateBlock = `export default function Home() {
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = window.localStorage.getItem("bgpt.invoices");
      if (saved) {
        const parsed = JSON.parse(saved);
        const alreadyRestored = window.localStorage.getItem("bgpt.restored.GJ0160012325") === "true";
        const missingReportedInvoice = Array.isArray(parsed) && !parsed.some(inv => inv.invoiceNo === REPORTED_RESTORE_INVOICE_NO);
        if (missingReportedInvoice && !alreadyRestored) {
          window.localStorage.setItem("bgpt.restored.GJ0160012325", "true");
          return [...parsed, buildReportedRestoreInvoice(parsed)].sort((a, b) => new Date(a.date) - new Date(b.date) || Number(a.id) - Number(b.id));
        }
        return parsed;
      }
      return INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });
  const [bgs, setBgs] = useState(() => {
    try {
      const saved = window.localStorage.getItem("bgpt.bgs");
      return saved ? JSON.parse(saved) : INITIAL_BGS;
    } catch {
      return INITIAL_BGS;
    }
  });
  const [paymentHistory, setPaymentHistory] = useState(() => {
    try {
      const saved = window.localStorage.getItem("bgpt.paymentHistory");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });`;

const newStateBlock = `export default function Home() {
  const cloudStateQuery = trpc.tracker.getState.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const saveTrackerState = trpc.tracker.saveState.useMutation();
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [bgs, setBgs] = useState(INITIAL_BGS);
  const [paymentHistory, setPaymentHistory] = useState([]);`;

if (!text.includes(oldStateBlock)) throw new Error('state block not found');
text = text.replace(oldStateBlock, newStateBlock);

const oldPersistenceBlock = `  const importInputRef = useRef(null);

  useEffect(() => {
    window.localStorage.setItem("bgpt.invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    window.localStorage.setItem("bgpt.bgs", JSON.stringify(bgs));
  }, [bgs]);

  useEffect(() => {
    window.localStorage.setItem("bgpt.paymentHistory", JSON.stringify(paymentHistory));
  }, [paymentHistory]);`;

const newPersistenceBlock = `  useEffect(() => {
    if (cloudLoaded || cloudStateQuery.isLoading) return;

    const cloudState = cloudStateQuery.data;
    if (cloudState) {
      const restoredInvoices = Array.isArray(cloudState.invoices) ? cloudState.invoices : INITIAL_INVOICES;
      const missingReportedInvoice = !restoredInvoices.some(inv => inv.invoiceNo === REPORTED_RESTORE_INVOICE_NO);
      setInvoices(missingReportedInvoice ? [...restoredInvoices, buildReportedRestoreInvoice(restoredInvoices)].sort((a, b) => new Date(a.date) - new Date(b.date) || Number(a.id) - Number(b.id)) : restoredInvoices);
      setBgs(Array.isArray(cloudState.bgs) ? cloudState.bgs : INITIAL_BGS);
      setPaymentHistory(Array.isArray(cloudState.paymentHistory) ? cloudState.paymentHistory : []);
    }

    setCloudLoaded(true);
  }, [cloudLoaded, cloudStateQuery.data, cloudStateQuery.isLoading]);

  useEffect(() => {
    if (!cloudLoaded) return;

    const timeout = window.setTimeout(() => {
      saveTrackerState.mutate({ invoices, bgs, paymentHistory });
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [cloudLoaded, invoices, bgs, paymentHistory]);`;

if (!text.includes(oldPersistenceBlock)) throw new Error('persistence block not found');
text = text.replace(oldPersistenceBlock, newPersistenceBlock);

text = text.replace('      window.localStorage.setItem("bgpt.restored.GJ0160012325", "true");\n      return [...prev, buildReportedRestoreInvoice(prev)].sort((a, b) => new Date(a.date) - new Date(b.date) || Number(a.id) - Number(b.id));', '      return [...prev, buildReportedRestoreInvoice(prev)].sort((a, b) => new Date(a.date) - new Date(b.date) || Number(a.id) - Number(b.id));');

const exportImportRegex = /\n  function handleExportData\(\) \{[\s\S]*?\n  function generatePDFReport\(\) \{/;
if (!exportImportRegex.test(text)) throw new Error('export/import function block not found');
text = text.replace(exportImportRegex, '\n  function generatePDFReport() {');

const headerControls = `          <button onClick={handleExportData} style={{ ...btnSecondary, background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.28)" }}>Export Data</button>
          <button onClick={handleImportClick} style={{ ...btnSecondary, background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.22)" }}>Import Data</button>
          <input ref={importInputRef} type="file" accept="application/json,.json" onChange={handleImportData} style={{ display: "none" }} />`;
const cloudStatus = `          <span style={{ background: "rgba(16,185,129,0.16)", color: "#d1fae5", border: "1px solid rgba(209,250,229,0.28)", borderRadius: 999, padding: "8px 12px", fontSize: 12, fontWeight: 700 }}>
            {cloudStateQuery.isLoading ? "Loading cloud data..." : saveTrackerState.isPending ? "Saving to cloud..." : saveTrackerState.isError ? "Cloud save needs retry" : "Cloud saved"}
          </span>`;
if (!text.includes(headerControls)) throw new Error('header controls not found');
text = text.replace(headerControls, cloudStatus);

text = text.replace('          New browser showing different data? Use <b>Export Data</b> in the old browser, then <b>Import Data</b> here. This static app saves working data inside each browser.', '          Your invoices, bank guarantees, and payment history are saved to the authenticated cloud database for this app. Import and export backups are no longer required.');

if (/localStorage|handleExportData|handleImportClick|handleImportData|importInputRef/.test(text)) {
  throw new Error('local import/export/localStorage references remain');
}

fs.writeFileSync(path, text);
