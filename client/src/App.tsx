import { useEffect, useMemo, useState } from "react";

type Invoice = {
  id: string;
  date: string;
  company: string;
  invoiceNo: string;
  terminal: string;
  amount: number;
  paid: number;
  remarks: string;
};

type TrackerState = {
  invoices: Invoice[];
};

const STORAGE_KEY = "bg-payment-tracker-final-live-v1";
const INITIAL_STATE: TrackerState = {
  invoices: [
    { id: "1", date: "2026-04-16", company: "HPCL", invoiceNo: "GJ0160003495", terminal: "HPCL PIPAVAV", amount: 3530382.52, paid: 0, remarks: "" },
    { id: "2", date: "2026-04-16", company: "HPCL", invoiceNo: "GJ0160003460", terminal: "HPCL PIPAVAV", amount: 3110950.82, paid: 0, remarks: "" },
    { id: "3", date: "2026-05-07", company: "HPCL", invoiceNo: "GJ0160012856", terminal: "HPCL KANDLA", amount: 3146246.5, paid: 0, remarks: "" },
  ],
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

async function loadCloud(): Promise<TrackerState | null> {
  if (!supabaseUrl || !supabaseKey) return null;
  const response = await fetch(`${supabaseUrl}/rest/v1/bg_tracker_state?id=eq.default&select=data`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
  });
  if (!response.ok) throw new Error(await response.text());
  const rows = await response.json();
  return rows?.[0]?.data ?? null;
}

async function saveCloud(data: TrackerState) {
  if (!supabaseUrl || !supabaseKey) return;
  const response = await fetch(`${supabaseUrl}/rest/v1/bg_tracker_state?id=eq.default`, {
    method: "PATCH",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ data }),
  });
  if (!response.ok) throw new Error(await response.text());
}

export default function App() {
  const [state, setState] = useState<TrackerState>(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState("Starting final live version...");
  const [form, setForm] = useState({ date: "", company: "HPCL", invoiceNo: "", terminal: "", amount: "", paid: "", remarks: "" });

  useEffect(() => {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        setState(JSON.parse(local));
        setStatus("Live — local autosave loaded");
      } catch {
        setStatus("Live — fresh tracker opened");
      }
    } else {
      setStatus("Live — fresh tracker opened");
    }
    setLoaded(true);

    loadCloud()
      .then((cloud) => {
        if (cloud && Array.isArray(cloud.invoices)) {
          setState(cloud);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloud));
          setStatus("Live — Supabase cloud connected");
        }
      })
      .catch(() => setStatus("Live — local autosave active; cloud optional"));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const timer = window.setTimeout(() => {
      saveCloud(state)
        .then(() => setStatus("Live — saved"))
        .catch(() => setStatus("Live — saved locally; cloud optional"));
    }, 600);
    return () => window.clearTimeout(timer);
  }, [state, loaded]);

  const totals = useMemo(() => {
    return state.invoices.reduce(
      (acc, invoice) => {
        acc.amount += Number(invoice.amount || 0);
        acc.paid += Number(invoice.paid || 0);
        acc.pending += Math.max(0, Number(invoice.amount || 0) - Number(invoice.paid || 0));
        return acc;
      },
      { amount: 0, paid: 0, pending: 0 },
    );
  }, [state.invoices]);

  function addInvoice(event: React.FormEvent) {
    event.preventDefault();
    if (!form.invoiceNo || !form.amount) return;
    const invoice: Invoice = {
      id: crypto.randomUUID(),
      date: form.date || new Date().toISOString().slice(0, 10),
      company: form.company || "HPCL",
      invoiceNo: form.invoiceNo,
      terminal: form.terminal,
      amount: Number(form.amount || 0),
      paid: Number(form.paid || 0),
      remarks: form.remarks,
    };
    setState((current) => ({ invoices: [invoice, ...current.invoices] }));
    setForm({ date: "", company: "HPCL", invoiceNo: "", terminal: "", amount: "", paid: "", remarks: "" });
  }

  function updatePaid(id: string, paid: number) {
    setState((current) => ({
      invoices: current.invoices.map((invoice) => (invoice.id === id ? { ...invoice, paid } : invoice)),
    }));
  }

  function removeInvoice(id: string) {
    setState((current) => ({ invoices: current.invoices.filter((invoice) => invoice.id !== id) }));
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a", fontFamily: "Inter, system-ui, sans-serif", padding: 20 }}>
      <section style={{ background: "linear-gradient(135deg,#020617,#1d4ed8)", color: "white", borderRadius: 24, padding: 24, display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 800, letterSpacing: 2, fontSize: 12, opacity: 0.8 }}>FINAL LIVE VERSION</div>
          <h1 style={{ margin: "8px 0", fontSize: 34 }}>BG Payment Tracker</h1>
          <div>{status}</div>
        </div>
        <button onClick={() => window.location.reload()} style={{ border: 0, borderRadius: 14, background: "white", color: "#0f172a", padding: "12px 16px", fontWeight: 800, cursor: "pointer" }}>Refresh</button>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginTop: 18 }}>
        {[
          ["Total Bills", totals.amount],
          ["Paid", totals.paid],
          ["Pending", totals.pending],
        ].map(([label, value]) => (
          <div key={label as string} style={{ background: "white", padding: 20, borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(15,23,42,.06)" }}>
            <div style={{ color: "#64748b", fontWeight: 700 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>{formatMoney(value as number)}</div>
          </div>
        ))}
      </section>

      <form onSubmit={addInvoice} style={{ marginTop: 18, background: "white", borderRadius: 20, padding: 18, border: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} />
        <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={inputStyle} />
        <input placeholder="Invoice No" value={form.invoiceNo} onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })} style={inputStyle} />
        <input placeholder="Terminal" value={form.terminal} onChange={(e) => setForm({ ...form, terminal: e.target.value })} style={inputStyle} />
        <input placeholder="Bill Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={inputStyle} />
        <input placeholder="Paid" type="number" value={form.paid} onChange={(e) => setForm({ ...form, paid: e.target.value })} style={inputStyle} />
        <input placeholder="Remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} style={inputStyle} />
        <button type="submit" style={{ border: 0, borderRadius: 12, background: "#2563eb", color: "white", fontWeight: 900, padding: 12, cursor: "pointer" }}>Add Invoice</button>
      </form>

      <section style={{ marginTop: 18, background: "white", borderRadius: 20, padding: 18, border: "1px solid #e2e8f0", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 850 }}>
          <thead>
            <tr>{["Date", "Company", "Invoice", "Terminal", "Bill", "Paid", "Pending", "Remarks", "Action"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {state.invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td style={tdStyle}>{invoice.date}</td>
                <td style={tdStyle}>{invoice.company}</td>
                <td style={tdStyle}>{invoice.invoiceNo}</td>
                <td style={tdStyle}>{invoice.terminal}</td>
                <td style={tdStyle}>{formatMoney(invoice.amount)}</td>
                <td style={tdStyle}><input type="number" value={invoice.paid} onChange={(e) => updatePaid(invoice.id, Number(e.target.value || 0))} style={{ ...inputStyle, width: 120 }} /></td>
                <td style={tdStyle}>{formatMoney(Math.max(0, invoice.amount - invoice.paid))}</td>
                <td style={tdStyle}>{invoice.remarks}</td>
                <td style={tdStyle}><button onClick={() => removeInvoice(invoice.id)} style={{ border: 0, borderRadius: 10, background: "#fee2e2", color: "#991b1b", padding: "8px 10px", fontWeight: 800, cursor: "pointer" }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = { padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", font: "inherit", minWidth: 0 };
const thStyle: React.CSSProperties = { textAlign: "left", padding: 12, borderBottom: "1px solid #e2e8f0", color: "#475569", fontSize: 13 };
const tdStyle: React.CSSProperties = { padding: 12, borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" };
