// @ts-nocheck
/**
 * Design philosophy: Swiss Financial Modernism for a BG and invoice operations dashboard.
 * This page prioritizes ledger clarity, reserve-bank navy accents, rupee-green status cues,
 * compact controls, and highly readable tabular finance data.
 */
import { useState, useMemo, useEffect } from "react";

const INITIAL_INVOICES = [
  { id: 1, date: "2026-04-16", invoiceNo: "GJ0160003495", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 35.52, netAmt: 3530382.52, dueDate: "2026-05-16", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 2, date: "2026-04-16", invoiceNo: "GJ0160003460", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 31.30, netAmt: 3110950.82, dueDate: "2026-05-16", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 3, date: "2026-04-27", invoiceNo: "GJ0160006771", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 22.12, netAmt: 2198537.76, dueDate: "2026-05-27", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 4, date: "2026-04-27", invoiceNo: "GJ0160006797", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 35.45, netAmt: 3523425.14, dueDate: "2026-05-27", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 5, date: "2026-04-27", invoiceNo: "GJ0160006752", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 23.17, netAmt: 2302898.74, dueDate: "2026-05-27", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 6, date: "2026-04-29", invoiceNo: "GJ0160007450", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 22.66, netAmt: 2252209.12, dueDate: "2026-05-29", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 7, date: "2026-04-29", invoiceNo: "GJ0160007507", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 30.22, netAmt: 3003608.10, dueDate: "2026-05-29", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 8, date: "2026-05-02", invoiceNo: "GJ0160009128", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 31.95, netAmt: 3326359.24, dueDate: "2026-06-01", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 9, date: "2026-05-03", invoiceNo: "GJ0160009214", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 32.41, netAmt: 3374250.48, dueDate: "2026-06-02", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 10, date: "2026-05-03", invoiceNo: "GJ0160009213", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 32.34, netAmt: 3366962.68, dueDate: "2026-06-02", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 11, date: "2026-05-03", invoiceNo: "GJ0160009215", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 30.68, netAmt: 3194137.76, dueDate: "2026-06-02", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 12, date: "2026-05-04", invoiceNo: "GJ0160010572", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 31.73, netAmt: 3303454.72, dueDate: "2026-06-03", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 13, date: "2026-05-04", invoiceNo: "GJ0160010648", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 32.08, netAmt: 3339893.72, dueDate: "2026-06-03", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 14, date: "2026-05-05", invoiceNo: "GJ0160012325", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 28.50, netAmt: 2967174.90, dueDate: "2026-06-04", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 15, date: "2026-05-07", invoiceNo: "GJ0160012856", company: "HPCL", terminal: "HPCL KANDLA", qty: 30.22, netAmt: 3146246.50, dueDate: "2026-06-06", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 16, date: "2026-05-07", invoiceNo: "GJ0160012806", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 22.92, netAmt: 2386233.28, dueDate: "2026-06-06", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 17, date: "2026-05-07", invoiceNo: "GJ0160012889", company: "HPCL", terminal: "HPCL KANDLA", qty: 24.52, netAmt: 2552811.52, dueDate: "2026-06-06", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 18, date: "2026-05-07", invoiceNo: "GJ0160012888", company: "HPCL", terminal: "HPCL KANDLA", qty: 23.72, netAmt: 2469522.40, dueDate: "2026-06-06", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 19, date: "2026-05-07", invoiceNo: "GJ0160012853", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 36.04, netAmt: 3752174.86, dueDate: "2026-06-06", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 20, date: "2026-05-08", invoiceNo: "GJ0160013158", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 31.40, netAmt: 3269097.96, dueDate: "2026-06-07", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 21, date: "2026-05-08", invoiceNo: "GJ0160013104", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 32.08, netAmt: 3339893.72, dueDate: "2026-06-07", paidDate: null, paidAmt: 0, status: "unpaid" },
  { id: 22, date: "2026-05-08", invoiceNo: "GJ0160013108", company: "HPCL", terminal: "HPCL PIPAVAV", qty: 22.92, netAmt: 2386233.28, dueDate: "2026-06-07", paidDate: null, paidAmt: 0, status: "unpaid" },
];

const INITIAL_BGS = [
  { id: 1, company: "HPCL", bgNo: "HPCL-BG-2CR", bgAmount: 20000000, marginPct: 15, marginAmt: 3000000, commissionPct: 0.8, bgStartDate: "2026-05-07", bgEndDate: "2026-06-30", bankName: "ICICI Bank - Himatnagar", stampDuty: 300, bgRefNo: "N/A", claimExpiry: "2026-09-30" },
  { id: 2, company: "HPCL", bgNo: "0452NDLG00001127", bgAmount: 40000000, marginPct: 15, marginAmt: 6000000, commissionPct: 0.8, bgStartDate: "2026-04-24", bgEndDate: "2026-06-30", bankName: "ICICI Bank - Himatnagar", stampDuty: 300, bgRefNo: "0452NDLG00001127", claimExpiry: "2026-06-30" },
  { id: 3, company: "IOCL", bgNo: "0452NDLG00007726", bgAmount: 10000000, marginPct: 15, marginAmt: 1500000, commissionPct: 0.8, bgStartDate: "2025-11-18", bgEndDate: "2026-06-13", bankName: "ICICI Bank - Himatnagar", stampDuty: 300, bgRefNo: "0452NDLG00007726", claimExpiry: "2026-06-13" },
];


const EXCEL_DASHBOARD = {
  title: "NH PACKAGE 03 & 04 AMD-RAJKOT — BITUMEN DASHBOARD",
  period: "Financial Year 2026-27 | Data Period: April 2026 - May 2026",
  material: "Bitumen VG40",
  overall: { particular: "Bitumen VG40 (Total)", qtyMt: 643.95, qtyTon: 643.95, taxable: 56013948.50, cgst: 5041255.36, sgst: 5041255.36, net: 66096459.22, trips: 22, avgRate: 86984.9343893159 },
  terminalBreakdown: [
    { particular: "HPCL KANDLA", qtyMt: 78.46, qtyTon: 78.46, taxable: 6922525.80, cgst: 623027.31, sgst: 623027.31, net: 8168580.42, trips: 3, avgRate: 88230 },
    { particular: "HPCL PIPAVAV", qtyMt: 565.49, qtyTon: 565.49, taxable: 49091422.70, cgst: 4418228.05, sgst: 4418228.05, net: 57927878.80, trips: 19, avgRate: 86812.185361368 },
  ],
  companyBreakdown: [
    { particular: "HPCL", qtyMt: 643.95, qtyTon: 643.95, taxable: 56013948.50, cgst: 5041255.36, sgst: 5041255.36, net: 66096459.22, trips: 22, avgRate: 86984.9343893159 },
    { particular: "IOCL", qtyMt: 0, qtyTon: 0, taxable: 0, cgst: 0, sgst: 0, net: 0, trips: 0, avgRate: 0 },
    { particular: "BPCL", qtyMt: 0, qtyTon: 0, taxable: 0, cgst: 0, sgst: 0, net: 0, trips: 0, avgRate: 0 },
  ],
  datewiseDetails: [
    { date: "2026-04-16", month: "APRIL 2026", invoiceNo: "GJ0160003495", billingDocNo: "9021893308", vehicleNo: "GJ14AT2055", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 35520, qtyMt: 35.52, taxable: 2991849.60, cgst: 269266.46, sgst: 269266.46, net: 3530382.52 },
    { date: "2026-04-16", month: "APRIL 2026", invoiceNo: "GJ0160003460", billingDocNo: "9021891025", vehicleNo: "RJ46GA6272", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 31300, qtyMt: 31.30, taxable: 2636399.00, cgst: 237275.91, sgst: 237275.91, net: 3110950.82 },
    { date: "2026-04-27", month: "APRIL 2026", invoiceNo: "GJ0160006771", billingDocNo: "9022100097", vehicleNo: "GJ10TX7751", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 22120, qtyMt: 22.12, taxable: 1863167.60, cgst: 167685.08, sgst: 167685.08, net: 2198537.76 },
    { date: "2026-04-27", month: "APRIL 2026", invoiceNo: "GJ0160006797", billingDocNo: "9022102689", vehicleNo: "GJ14AT2055", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 35450, qtyMt: 35.45, taxable: 2985953.50, cgst: 268735.82, sgst: 268735.82, net: 3523425.14 },
    { date: "2026-04-27", month: "APRIL 2026", invoiceNo: "GJ0160006752", billingDocNo: "9022098844", vehicleNo: "GJ10TX7761", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 23170, qtyMt: 23.17, taxable: 1951609.10, cgst: 175644.82, sgst: 175644.82, net: 2302898.74 },
    { date: "2026-04-29", month: "APRIL 2026", invoiceNo: "GJ0160007450", billingDocNo: "9022149054", vehicleNo: "GJ06AX4705", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 22660, qtyMt: 22.66, taxable: 1908651.80, cgst: 171778.66, sgst: 171778.66, net: 2252209.12 },
    { date: "2026-04-29", month: "APRIL 2026", invoiceNo: "GJ0160007507", billingDocNo: "9022151526", vehicleNo: "GJ06BY1044", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 30220, qtyMt: 30.22, taxable: 2545430.60, cgst: 229088.75, sgst: 229088.75, net: 3003608.10 },
    { date: "2026-05-02", month: "MAY 2026", invoiceNo: "GJ0160009128", billingDocNo: "9022205352", vehicleNo: "GJ06BV7705", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 31950, qtyMt: 31.95, taxable: 2818948.50, cgst: 253705.37, sgst: 253705.37, net: 3326359.24 },
    { date: "2026-05-03", month: "MAY 2026", invoiceNo: "GJ0160009214", billingDocNo: "9022236850", vehicleNo: "GJ06BV5705", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 32410, qtyMt: 32.41, taxable: 2859534.30, cgst: 257358.09, sgst: 257358.09, net: 3374250.48 },
    { date: "2026-05-03", month: "MAY 2026", invoiceNo: "GJ0160009213", billingDocNo: "9022236825", vehicleNo: "GJ06BY9077", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 32340, qtyMt: 32.34, taxable: 2853358.20, cgst: 256802.24, sgst: 256802.24, net: 3366962.68 },
    { date: "2026-05-03", month: "MAY 2026", invoiceNo: "GJ0160009215", billingDocNo: "9022236885", vehicleNo: "GJ06BY9005", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 30680, qtyMt: 30.68, taxable: 2706896.40, cgst: 243620.68, sgst: 243620.68, net: 3194137.76 },
    { date: "2026-05-04", month: "MAY 2026", invoiceNo: "GJ0160010572", billingDocNo: "9022277720", vehicleNo: "GJ06BX0705", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 31730, qtyMt: 31.73, taxable: 2799537.90, cgst: 251958.41, sgst: 251958.41, net: 3303454.72 },
    { date: "2026-05-04", month: "MAY 2026", invoiceNo: "GJ0160010648", billingDocNo: "9022281779", vehicleNo: "GJ06BY1044", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 32080, qtyMt: 32.08, taxable: 2830418.40, cgst: 254737.66, sgst: 254737.66, net: 3339893.72 },
    { date: "2026-05-05", month: "MAY 2026", invoiceNo: "GJ0160012325", billingDocNo: "9022329156", vehicleNo: "GJ06BV6705", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 28500, qtyMt: 28.50, taxable: 2514555.00, cgst: 226309.95, sgst: 226309.95, net: 2967174.90 },
    { date: "2026-05-07", month: "MAY 2026", invoiceNo: "GJ0160012856", billingDocNo: "9022373110", vehicleNo: "RJ38GA1492", company: "HPCL", terminal: "HPCL KANDLA", qtyKg: 30220, qtyMt: 30.22, taxable: 2666310.60, cgst: 239967.95, sgst: 239967.95, net: 3146246.50 },
    { date: "2026-05-07", month: "MAY 2026", invoiceNo: "GJ0160012806", billingDocNo: "9022370208", vehicleNo: "GJ06AX4705", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 22920, qtyMt: 22.92, taxable: 2022231.60, cgst: 182000.84, sgst: 182000.84, net: 2386233.28 },
    { date: "2026-05-07", month: "MAY 2026", invoiceNo: "GJ0160012889", billingDocNo: "9022374728", vehicleNo: "GJ10TV7727", company: "HPCL", terminal: "HPCL KANDLA", qtyKg: 24520, qtyMt: 24.52, taxable: 2163399.60, cgst: 194705.96, sgst: 194705.96, net: 2552811.52 },
    { date: "2026-05-07", month: "MAY 2026", invoiceNo: "GJ0160012888", billingDocNo: "9022374630", vehicleNo: "GJ10TV6377", company: "HPCL", terminal: "HPCL KANDLA", qtyKg: 23720, qtyMt: 23.72, taxable: 2092815.60, cgst: 188353.40, sgst: 188353.40, net: 2469522.40 },
    { date: "2026-05-07", month: "MAY 2026", invoiceNo: "GJ0160012853", billingDocNo: "9022373008", vehicleNo: "GJ14AT3005", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 36040, qtyMt: 36.04, taxable: 3179809.20, cgst: 286182.83, sgst: 286182.83, net: 3752174.86 },
    { date: "2026-05-08", month: "MAY 2026", invoiceNo: "GJ0160013158", billingDocNo: "9022393735", vehicleNo: "GJ06BX3705", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 31400, qtyMt: 31.40, taxable: 2770422.00, cgst: 249337.98, sgst: 249337.98, net: 3269097.96 },
    { date: "2026-05-08", month: "MAY 2026", invoiceNo: "GJ0160013104", billingDocNo: "9022391504", vehicleNo: "GJ06BY9005", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 32080, qtyMt: 32.08, taxable: 2830418.40, cgst: 254737.66, sgst: 254737.66, net: 3339893.72 },
    { date: "2026-05-08", month: "MAY 2026", invoiceNo: "GJ0160013108", billingDocNo: "9022391609", vehicleNo: "GJ06AV5705", company: "HPCL", terminal: "HPCL PIPAVAV", qtyKg: 22920, qtyMt: 22.92, taxable: 2022231.60, cgst: 182000.84, sgst: 182000.84, net: 2386233.28 },
  ],
};

const TODAY = "2026-05-09";

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function calcIOCLDue(invoiceDate) {
  // IOCL rule: payment always falls on 15th
  // Order 1st-15th → pay 15th of next month (30-45 days)
  // Order 16th-31st → pay 15th of next month (15-30 days)
  // So ALL orders pay on 15th of the NEXT month
  const d = new Date(invoiceDate);
  const month = d.getMonth();
  const year = d.getFullYear();
  const due = new Date(year, month + 1, 15);
  return due.toISOString().split("T")[0];
}

function daysUntil(dateStr) {
  const today = new Date(TODAY);
  const d = new Date(dateStr);
  return Math.ceil((d - today) / 86400000);
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCurrency(n) {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + " L";
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function formatAmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function getPaidAmt(inv) {
  return Math.min(Number(inv.netAmt || 0), Math.max(0, Number(inv.paidAmt || 0)));
}

function getPendingAmt(inv) {
  return Math.max(0, Number(inv.netAmt || 0) - getPaidAmt(inv));
}

function getInvoiceStatus(inv) {
  const paid = getPaidAmt(inv);
  const net = Number(inv.netAmt || 0);
  if (net > 0 && paid >= net - 0.01) return "paid";
  if (paid > 0) return "partial";
  return "unpaid";
}


function formatQty(n) {
  return Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function formatRate(n) {
  return "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function StatusBadge({ status, daysLeft }) {
  let bg, color, text;
  if (status === "paid") {
    bg = "#dcfce7"; color = "#15803d"; text = "PAID ✓";
  } else if (status === "partial") {
    bg = "#e0f2fe"; color = "#0369a1"; text = "PARTLY PAID";
  } else if (daysLeft < 0) {
    bg = "#fecaca"; color = "#b91c1c"; text = `OVERDUE ${Math.abs(daysLeft)}d`;
  } else if (daysLeft <= 5) {
    bg = "#fef3c7"; color = "#b45309"; text = `DUE in ${daysLeft}d ⚠`;
  } else if (daysLeft <= 10) {
    bg = "#fff7ed"; color = "#c2410c"; text = `${daysLeft} days left`;
  } else {
    bg = "#eff6ff"; color = "#1d4ed8"; text = `${daysLeft} days left`;
  }
  return <span style={{ background: bg, color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: 0.3 }}>{text}</span>;
}

function Overlay({ children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: 16, padding: 28, width: 440, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = window.localStorage.getItem("bgpt.invoices");
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
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
  });
  const [tab, setTab] = useState("dashboard");
  const [filterCompany, setFilterCompany] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [showAddBG, setShowAddBG] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [directPayCompany, setDirectPayCompany] = useState("HPCL");
  const [showEditInvoice, setShowEditInvoice] = useState(null);
  const [showEditBG, setShowEditBG] = useState(null);
  const [editInv, setEditInv] = useState(null);
  const [editBG, setEditBG] = useState(null);
  const [payDate, setPayDate] = useState(TODAY);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [newInv, setNewInv] = useState({ date: "", invoiceNo: "", company: "HPCL", terminal: "", qty: "", netAmt: "" });
  const [newBG, setNewBG] = useState({ company: "HPCL", bgAmount: "", marginPct: 15, commissionPct: 0.8, bgStartDate: "", bgEndDate: "", bankName: "", bgNo: "", stampDuty: 300, claimExpiry: "" });

  useEffect(() => {
    window.localStorage.setItem("bgpt.invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    window.localStorage.setItem("bgpt.bgs", JSON.stringify(bgs));
  }, [bgs]);

  useEffect(() => {
    window.localStorage.setItem("bgpt.paymentHistory", JSON.stringify(paymentHistory));
  }, [paymentHistory]);

  const stats = useMemo(() => {
    const totalOutstanding = invoices.reduce((s, i) => s + getPendingAmt(i), 0);
    const totalPaid = invoices.reduce((s, i) => s + getPaidAmt(i), 0);
    const overdue = invoices.filter(i => getPendingAmt(i) > 0 && daysUntil(i.dueDate) < 0).length;
    const dueSoon = invoices.filter(i => getPendingAmt(i) > 0 && daysUntil(i.dueDate) >= 0 && daysUntil(i.dueDate) <= 7).length;
    const totalBG = bgs.reduce((s, b) => s + b.bgAmount, 0);
    const totalMargin = bgs.reduce((s, b) => s + b.marginAmt, 0);
    return { totalOutstanding, totalPaid, overdue, dueSoon, totalBG, totalMargin };
  }, [invoices, bgs]);

  const bgDetails = useMemo(() => {
    // Group BGs by company and sort by amount (smallest first) for sequential utilization
    const companyBGs = {};
    bgs.forEach(bg => {
      if (!companyBGs[bg.company]) companyBGs[bg.company] = [];
      companyBGs[bg.company].push(bg);
    });
    // Sort each company's BGs by amount ascending (fill smaller first)
    Object.values(companyBGs).forEach(arr => arr.sort((a, b) => a.bgAmount - b.bgAmount));

    return bgs.map(bg => {
      const startD = new Date(bg.bgStartDate);
      const endD = new Date(bg.bgEndDate);
      const todayD = new Date(TODAY);
      const totalDays = Math.ceil((endD - startD) / 86400000);
      const usedDays = Math.max(0, Math.ceil((todayD - startD) / 86400000));
      const remainingDays = Math.ceil((endD - todayD) / 86400000);
      const annualCommission = bg.bgAmount * bg.commissionPct / 100;
      const dailyRate = annualCommission / 365;
      const usedCommission = dailyRate * usedDays;
      const monthlyCommission = annualCommission / 12;

      // Sequential utilization: calculate how much outstanding falls on THIS BG
      const totalOutstanding = invoices.filter(i => i.company === bg.company).reduce((s, i) => s + getPendingAmt(i), 0);
      const sameCoBGs = companyBGs[bg.company] || [];
      const myIndex = sameCoBGs.findIndex(b => b.id === bg.id);
      let remaining = totalOutstanding;
      let utilized = 0;
      for (let i = 0; i < sameCoBGs.length; i++) {
        if (i === myIndex) {
          utilized = Math.min(remaining, sameCoBGs[i].bgAmount);
          break;
        } else {
          remaining = Math.max(0, remaining - sameCoBGs[i].bgAmount);
        }
      }

      const available = bg.bgAmount - utilized;
      const isExpiringSoon = remainingDays <= 30 && remainingDays > 0;
      const isExpired = remainingDays <= 0;
      const utilizationPct = (utilized / bg.bgAmount) * 100;
      return { ...bg, totalDays, usedDays, remainingDays, annualCommission, usedCommission, monthlyCommission, dailyRate, utilized, available, isExpiringSoon, isExpired, utilizationPct, totalOutstanding };
    });
  }, [bgs, invoices]);

  const bgSummaryByCompany = useMemo(() => {
    const summary = {};
    bgDetails.forEach(bg => {
      if (!summary[bg.company]) summary[bg.company] = { totalBG: 0, totalMargin: 0, totalCommUsed: 0, totalAnnualComm: 0, count: 0, utilized: 0, totalOutstanding: 0 };
      summary[bg.company].totalBG += bg.bgAmount;
      summary[bg.company].totalMargin += bg.marginAmt;
      summary[bg.company].totalCommUsed += bg.usedCommission;
      summary[bg.company].totalAnnualComm += bg.annualCommission;
      summary[bg.company].count += 1;
      summary[bg.company].totalOutstanding = bg.totalOutstanding; // same for all BGs of same company
      summary[bg.company].utilized = bg.totalOutstanding;
    });
    return summary;
  }, [bgDetails]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(i => {
      if (filterCompany !== "ALL" && i.company !== filterCompany) return false;
      const status = getInvoiceStatus(i);
      const pending = getPendingAmt(i);
      if (filterStatus === "paid" && status !== "paid") return false;
      if (filterStatus === "partial" && status !== "partial") return false;
      if (filterStatus === "unpaid" && status === "paid") return false;
      if (filterStatus === "overdue" && (pending <= 0 || daysUntil(i.dueDate) >= 0)) return false;
      if (filterStatus === "due_soon" && (pending <= 0 || daysUntil(i.dueDate) < 0 || daysUntil(i.dueDate) > 7)) return false;
      return true;
    }).sort((a, b) => {
      const statusA = getInvoiceStatus(a);
      const statusB = getInvoiceStatus(b);
      if (statusA === "paid" && statusB !== "paid") return 1;
      if (statusA !== "paid" && statusB === "paid") return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [invoices, filterCompany, filterStatus]);

  const paymentHistorySorted = useMemo(() => {
    return [...paymentHistory].sort((a, b) => {
      const dateDiff = new Date(b.paymentDate) - new Date(a.paymentDate);
      if (dateDiff !== 0) return dateDiff;
      return Number(b.id || 0) - Number(a.id || 0);
    });
  }, [paymentHistory]);

  function handleAddInvoice() {
    const company = newInv.company;
    let dueDate;
    if (company === "IOCL") {
      dueDate = calcIOCLDue(newInv.date);
    } else {
      dueDate = addDays(newInv.date, 30);
    }
    const inv = {
      id: Date.now(),
      date: newInv.date,
      invoiceNo: newInv.invoiceNo,
      company,
      terminal: newInv.terminal,
      qty: parseFloat(newInv.qty),
      netAmt: parseFloat(newInv.netAmt),
      dueDate,
      paidDate: null,
      paidAmt: 0,
      status: "unpaid"
    };
    setInvoices(prev => [...prev, inv]);
    setShowAddInvoice(false);
    setNewInv({ date: "", invoiceNo: "", company: "HPCL", terminal: "", qty: "", netAmt: "" });
  }

  function openDirectPayment(company = filterCompany !== "ALL" ? filterCompany : "HPCL") {
    setDirectPayCompany(company);
    setShowPayModal(true);
    setPaymentAmount("");
    setPayDate(TODAY);
  }

  function openPaymentModal(inv) {
    openDirectPayment(inv.company);
  }

  function handlePay() {
    const amount = Math.max(0, parseFloat(paymentAmount) || 0);
    if (!amount) return;

    const sequential = invoices
      .filter(i => i.company === directPayCompany && getPendingAmt(i) > 0)
      .sort((a, b) => {
        const dueDiff = new Date(a.dueDate) - new Date(b.dueDate);
        if (dueDiff !== 0) return dueDiff;
        const dateDiff = new Date(a.date) - new Date(b.date);
        if (dateDiff !== 0) return dateDiff;
        return Number(a.id) - Number(b.id);
      });
    const allocation = {};
    const allocationRows = [];
    let remaining = amount;

    for (const inv of sequential) {
      if (remaining <= 0) break;
      const pendingBefore = getPendingAmt(inv);
      const applied = Math.min(pendingBefore, remaining);
      if (applied > 0) {
        allocation[inv.id] = applied;
        allocationRows.push({
          invoiceId: inv.id,
          invoiceNo: inv.invoiceNo,
          invoiceDate: inv.date,
          dueDate: inv.dueDate,
          terminal: inv.terminal,
          invoiceAmount: Number(inv.netAmt || 0),
          pendingBefore,
          amountAdjusted: applied,
          pendingAfter: Math.max(0, pendingBefore - applied),
        });
      }
      remaining -= applied;
    }

    if (allocationRows.length === 0) return;

    setInvoices(prev => prev.map(inv => {
      const applied = allocation[inv.id] || 0;
      if (!applied) return inv;
      const paidAmt = Math.min(Number(inv.netAmt || 0), getPaidAmt(inv) + applied);
      const status = paidAmt >= Number(inv.netAmt || 0) - 0.01 ? "paid" : "partial";
      return { ...inv, paidAmt, paidDate: payDate, status };
    }));

    const allocatedAmount = allocationRows.reduce((sum, row) => sum + row.amountAdjusted, 0);
    setPaymentHistory(prev => [{
      id: Date.now(),
      paymentDate: payDate,
      company: directPayCompany,
      amountReceived: amount,
      allocatedAmount,
      unallocatedAmount: Math.max(0, amount - allocatedAmount),
      allocations: allocationRows,
    }, ...prev]);

    setShowPayModal(false);
    setPayDate(TODAY);
    setPaymentAmount("");
  }

  function handleAddBG() {
    const bg = {
      id: Date.now(),
      company: newBG.company,
      bgNo: newBG.bgNo,
      bgAmount: parseFloat(newBG.bgAmount),
      marginPct: parseFloat(newBG.marginPct),
      marginAmt: parseFloat(newBG.bgAmount) * parseFloat(newBG.marginPct) / 100,
      commissionPct: parseFloat(newBG.commissionPct),
      bgStartDate: newBG.bgStartDate,
      bgEndDate: newBG.bgEndDate,
      bankName: newBG.bankName,
      stampDuty: parseFloat(newBG.stampDuty) || 0,
      bgRefNo: newBG.bgNo,
      claimExpiry: newBG.claimExpiry || newBG.bgEndDate,
    };
    setBgs(prev => [...prev, bg]);
    setShowAddBG(false);
    setNewBG({ company: "HPCL", bgAmount: "", marginPct: 15, commissionPct: 0.8, bgStartDate: "", bgEndDate: "", bankName: "", bgNo: "", stampDuty: 300, claimExpiry: "" });
  }

  function openEditInvoice(inv) {
    setEditInv({ ...inv, qty: String(inv.qty), netAmt: String(inv.netAmt) });
    setShowEditInvoice(inv.id);
  }

  function handleEditInvoice() {
    const company = editInv.company;
    let dueDate;
    if (company === "IOCL") {
      dueDate = calcIOCLDue(editInv.date);
    } else {
      dueDate = addDays(editInv.date, 30);
    }
    setInvoices(prev => prev.map(i => i.id === editInv.id ? {
      ...i,
      date: editInv.date,
      invoiceNo: editInv.invoiceNo,
      company: editInv.company,
      terminal: editInv.terminal,
      qty: parseFloat(editInv.qty),
      netAmt: parseFloat(editInv.netAmt),
      dueDate,
    } : i));
    setShowEditInvoice(null);
    setEditInv(null);
  }

  function handleDeleteInvoice(id) {
    setInvoices(prev => prev.filter(i => i.id !== id));
  }

  function handleUndoPay(id) {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: "unpaid", paidDate: null, paidAmt: 0 } : i));
  }

  function openEditBG(bg) {
    setEditBG({ ...bg, bgAmount: String(bg.bgAmount), marginPct: String(bg.marginPct), commissionPct: String(bg.commissionPct), stampDuty: String(bg.stampDuty || 0) });
    setShowEditBG(bg.id);
  }

  function handleEditBG() {
    setBgs(prev => prev.map(b => b.id === editBG.id ? {
      ...b,
      company: editBG.company,
      bgNo: editBG.bgNo || b.bgNo,
      bgAmount: parseFloat(editBG.bgAmount),
      marginPct: parseFloat(editBG.marginPct),
      marginAmt: parseFloat(editBG.bgAmount) * parseFloat(editBG.marginPct) / 100,
      commissionPct: parseFloat(editBG.commissionPct),
      bgStartDate: editBG.bgStartDate,
      bgEndDate: editBG.bgEndDate,
      bankName: editBG.bankName,
      stampDuty: parseFloat(editBG.stampDuty) || 0,
      claimExpiry: editBG.claimExpiry || editBG.bgEndDate,
    } : b));
    setShowEditBG(null);
    setEditBG(null);
  }

  function handleDeleteBG(id) {
    setBgs(prev => prev.filter(b => b.id !== id));
  }

  function generatePDFReport() {
    const unpaid = invoices.filter(i => getPendingAmt(i) > 0).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const paid = invoices.filter(i => getPaidAmt(i) > 0).sort((a, b) => new Date(b.paidDate || b.date) - new Date(a.paidDate || a.date));
    const totalOutstanding = unpaid.reduce((s, i) => s + getPendingAmt(i), 0);
    const totalPaid = paid.reduce((s, i) => s + getPaidAmt(i), 0);

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Payment Report</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  body { font-family: Arial, sans-serif; font-size: 10px; color: #1e293b; margin: 0; padding: 0; }
  .header { background: #0f172a; color: white; padding: 18px 24px; margin: -12mm -12mm 16px -12mm; }
  .header h1 { margin: 0; font-size: 18px; }
  .header p { margin: 4px 0 0; font-size: 11px; color: #94a3b8; }
  .section { margin-bottom: 20px; }
  .section h2 { font-size: 13px; margin: 0 0 8px; padding: 8px 12px; background: #f1f5f9; border-left: 4px solid #1a56db; }
  .section h2.paid { border-left-color: #16a34a; }
  .section h2.bg { border-left-color: #7c3aed; }
  table { width: 100%; border-collapse: collapse; font-size: 9px; }
  th { background: #f8fafc; padding: 6px 5px; text-align: left; font-weight: 700; border-bottom: 2px solid #e2e8f0; text-transform: uppercase; font-size: 8px; color: #64748b; }
  td { padding: 5px 5px; border-bottom: 1px solid #f1f5f9; }
  .r { text-align: right; }
  .b { font-weight: 700; }
  .red { color: #dc2626; }
  .green { color: #16a34a; }
  .total-row { background: #f1f5f9; font-weight: 700; }
  .total-row td { border-top: 2px solid #cbd5e1; padding: 8px 5px; }
  .kpi { display: inline-block; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 18px; margin-right: 10px; margin-bottom: 8px; }
  .kpi .label { font-size: 8px; color: #8896a8; text-transform: uppercase; }
  .kpi .val { font-size: 16px; font-weight: 700; margin-top: 2px; }
  .overdue { background: #fef2f2; }
  .stamp { text-align: center; font-size: 9px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; }
</style></head><body>
<div class="header"><h1>NH Package 03 &amp; 04 AMD-RAJKOT — Payment &amp; Outstanding Report</h1><p>Generated: ${formatDate(TODAY)} | M/s Paresh S. Patel</p></div>

<div style="margin-bottom:16px;">
  <div class="kpi"><div class="label">Total Invoices</div><div class="val">${invoices.length}</div></div>
  <div class="kpi"><div class="label">Outstanding</div><div class="val red">${formatAmt(totalOutstanding)}</div></div>
  <div class="kpi"><div class="label">Total Paid</div><div class="val green">${formatAmt(totalPaid)}</div></div>
  <div class="kpi"><div class="label">Unpaid Count</div><div class="val red">${unpaid.length}</div></div>
  <div class="kpi"><div class="label">Paid Count</div><div class="val green">${paid.length}</div></div>
  <div class="kpi"><div class="label">Total BG</div><div class="val">${formatCurrency(bgs.reduce((s, b) => s + b.bgAmount, 0))}</div></div>
</div>

${unpaid.length > 0 ? `<div class="section"><h2>OUTSTANDING / UNPAID INVOICES (${unpaid.length})</h2>
<table><thead><tr><th>#</th><th>Inv Date</th><th>Invoice No</th><th>Company</th><th>Terminal</th><th class="r">Qty (MT)</th><th class="r">Net Amount</th><th class="r">Pending</th><th>Due Date</th><th>Days Left</th><th>BG Used</th></tr></thead><tbody>
${unpaid.map((inv, i) => {
  const dl = daysUntil(inv.dueDate);
  // Find which BG this invoice falls under
  const sameCoBGs = bgs.filter(b => b.company === inv.company).sort((a, b) => a.bgAmount - b.bgAmount);
  const bgLabel = sameCoBGs.length > 0 ? sameCoBGs.map(b => formatCurrency(b.bgAmount)).join(' → ') : '-';
  return `<tr class="${dl < 0 ? 'overdue' : ''}"><td>${i+1}</td><td>${formatDate(inv.date)}</td><td class="b">${inv.invoiceNo}</td><td>${inv.company}</td><td>${inv.terminal}</td><td class="r">${inv.qty.toFixed(2)}</td><td class="r b">${formatAmt(inv.netAmt)}</td><td class="r red b">${formatAmt(getPendingAmt(inv))}</td><td>${formatDate(inv.dueDate)}</td><td class="${dl < 0 ? 'red b' : ''}">${dl < 0 ? 'OVERDUE '+Math.abs(dl)+'d' : dl+'d'}</td><td>${bgLabel}</td></tr>`;
}).join('')}
<tr class="total-row"><td></td><td colspan="4">TOTAL OUTSTANDING</td><td class="r">${unpaid.reduce((s,i)=>s+i.qty,0).toFixed(2)}</td><td></td><td class="r red">${formatAmt(totalOutstanding)}</td><td colspan="3"></td></tr>
</tbody></table></div>` : ''}

${paid.length > 0 ? `<div class="section"><h2 class="paid">PAID / CLEARED INVOICES (${paid.length})</h2>
<table><thead><tr><th>#</th><th>Inv Date</th><th>Invoice No</th><th>Company</th><th>Terminal</th><th class="r">Qty (MT)</th><th class="r">Amount Paid</th><th class="r">Pending</th><th>Due Date</th><th>Paid Date</th></tr></thead><tbody>
${paid.map((inv, i) => `<tr><td>${i+1}</td><td>${formatDate(inv.date)}</td><td class="b">${inv.invoiceNo}</td><td>${inv.company}</td><td>${inv.terminal}</td><td class="r">${inv.qty.toFixed(2)}</td><td class="r green b">${formatAmt(getPaidAmt(inv))}</td><td class="r red">${formatAmt(getPendingAmt(inv))}</td><td>${formatDate(inv.dueDate)}</td><td>${formatDate(inv.paidDate)}</td></tr>`).join('')}
<tr class="total-row"><td></td><td colspan="4">TOTAL PAID</td><td class="r">${paid.reduce((s,i)=>s+i.qty,0).toFixed(2)}</td><td class="r green">${formatAmt(totalPaid)}</td><td></td><td colspan="2"></td></tr>
</tbody></table></div>` : ''}

<div class="section"><h2 class="bg">BANK GUARANTEE STATUS</h2>
<table><thead><tr><th>#</th><th>BG Number</th><th>Company</th><th>Bank</th><th class="r">BG Amount</th><th class="r">Utilized</th><th class="r">Available</th><th>Utilization</th><th>Expiry</th><th>Days Left</th><th>Status</th></tr></thead><tbody>
${bgDetails.map((bg, i) => `<tr><td>${i+1}</td><td class="b">${bg.bgNo || 'N/A'}</td><td>${bg.company}</td><td>${bg.bankName}</td><td class="r b">${formatCurrency(bg.bgAmount)}</td><td class="r red">${formatCurrency(bg.utilized)}</td><td class="r green">${formatCurrency(Math.max(0, bg.available))}</td><td>${bg.utilizationPct.toFixed(1)}%</td><td>${formatDate(bg.bgEndDate)}</td><td class="${bg.remainingDays <= 30 ? 'red b' : ''}">${bg.remainingDays > 0 ? bg.remainingDays+'d' : 'EXPIRED'}</td><td class="b">${bg.isExpired ? 'EXPIRED' : bg.isExpiringSoon ? 'EXPIRING' : 'ACTIVE'}</td></tr>`).join('')}
</tbody></table></div>

<div class="stamp">This is a system-generated report from NH Package 03 &amp; 04 BG &amp; Payment Tracker | Report Date: ${formatDate(TODAY)}</div>
</body></html>`;

    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => { w.print(); }, 500);
  }

  const cardStyle = { background: "white", borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #eef2f6" };
  const labelStyle = { fontSize: 11, color: "#8896a8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 };
  const valStyle = { fontSize: 26, fontWeight: 700, letterSpacing: -0.5 };
  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #dde3ea", fontSize: 13, boxSizing: "border-box", outline: "none" };
  const selectStyle = { ...inputStyle, background: "white" };
  const btnPrimary = { background: "#1a56db", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
  const btnSecondary = { background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
  const tabStyle = (active) => ({ padding: "10px 22px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: active ? "#1a56db" : "#f1f5f9", color: active ? "white" : "#64748b", transition: "all 0.15s" });

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f6f8fb", minHeight: "100vh", padding: "0 0 40px 0", color: "#1e293b" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", padding: "28px 28px 20px", color: "white" }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}>NH Package 03 & 04 — BG & Payment Tracker</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Bank Guarantee • Invoice Payment • Due Date Reminders</div>
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          {["dashboard", "invoices", "payments", "bg_details", "bg_report"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>
              {t === "dashboard" ? "Dashboard" : t === "invoices" ? "Invoices" : t === "payments" ? "Payment History" : t === "bg_details" ? "BG Details" : "BG Report"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 28px" }}>
        {/* ===== DASHBOARD TAB ===== */}
        {tab === "dashboard" && (
          <>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 22 }}>
              <div style={cardStyle}>
                <div style={labelStyle}>Total Outstanding</div>
                <div style={{ ...valStyle, color: "#dc2626" }}>{formatCurrency(stats.totalOutstanding)}</div>
              </div>
              <div style={cardStyle}>
                <div style={labelStyle}>Total Paid</div>
                <div style={{ ...valStyle, color: "#16a34a" }}>{formatCurrency(stats.totalPaid)}</div>
              </div>
              <div style={cardStyle}>
                <div style={labelStyle}>Overdue</div>
                <div style={{ ...valStyle, color: stats.overdue > 0 ? "#dc2626" : "#64748b" }}>{stats.overdue}</div>
              </div>
              <div style={cardStyle}>
                <div style={labelStyle}>Due in 7 Days</div>
                <div style={{ ...valStyle, color: stats.dueSoon > 0 ? "#f59e0b" : "#64748b" }}>{stats.dueSoon}</div>
              </div>
              <div style={cardStyle}>
                <div style={labelStyle}>Total BG Amount</div>
                <div style={{ ...valStyle, color: "#1a56db" }}>{formatCurrency(stats.totalBG)}</div>
              </div>
              <div style={cardStyle}>
                <div style={labelStyle}>Margin Money Blocked</div>
                <div style={{ ...valStyle, color: "#7c3aed" }}>{formatCurrency(stats.totalMargin)}</div>
              </div>
            </div>


            {/* Excel Dashboard Summary */}
            <div style={{ ...cardStyle, marginBottom: 18, border: "1px solid #dbe7f3" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.2 }}>{EXCEL_DASHBOARD.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{EXCEL_DASHBOARD.period}</div>
                </div>
                <div style={{ background: "#ecfdf5", color: "#047857", border: "1px solid #bbf7d0", borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 700 }}>{EXCEL_DASHBOARD.material}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 18 }}>
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: 14 }}><div style={labelStyle}>Total Qty</div><div style={{ ...valStyle, fontSize: 22 }}>{formatQty(EXCEL_DASHBOARD.overall.qtyMt)} MT</div></div>
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: 14 }}><div style={labelStyle}>Taxable Value</div><div style={{ ...valStyle, fontSize: 22, color: "#0f766e" }}>{formatCurrency(EXCEL_DASHBOARD.overall.taxable)}</div></div>
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: 14 }}><div style={labelStyle}>Net Amount</div><div style={{ ...valStyle, fontSize: 22, color: "#1a56db" }}>{formatCurrency(EXCEL_DASHBOARD.overall.net)}</div></div>
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: 14 }}><div style={labelStyle}>Trips</div><div style={{ ...valStyle, fontSize: 22 }}>{EXCEL_DASHBOARD.overall.trips}</div></div>
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: 14 }}><div style={labelStyle}>Avg Rate / MT</div><div style={{ ...valStyle, fontSize: 22, color: "#b45309" }}>{formatRate(EXCEL_DASHBOARD.overall.avgRate)}</div></div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16, marginBottom: 18 }}>
                {[
                  { title: "Terminal-wise Breakdown", rows: EXCEL_DASHBOARD.terminalBreakdown },
                  { title: "Company-wise Breakdown", rows: EXCEL_DASHBOARD.companyBreakdown },
                ].map(section => (
                  <div key={section.title} style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ background: "#0f172a", color: "white", padding: "10px 12px", fontSize: 12, fontWeight: 700 }}>{section.title}</div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 620 }}>
                        <thead><tr style={{ background: "#f8fafc" }}>{["Particulars", "Qty MT", "Taxable", "GST", "Net", "Trips", "Avg/MT"].map(h => <th key={h} style={{ padding: "9px 10px", textAlign: h === "Particulars" ? "left" : "right", fontSize: 10, color: "#64748b", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>{h}</th>)}</tr></thead>
                        <tbody>
                          {section.rows.map(row => (
                            <tr key={row.particular} style={{ borderBottom: "1px solid #f1f5f9" }}>
                              <td style={{ padding: "10px", fontWeight: 700 }}>{row.particular}</td>
                              <td style={{ padding: "10px", textAlign: "right" }}>{formatQty(row.qtyMt)}</td>
                              <td style={{ padding: "10px", textAlign: "right" }}>{formatCurrency(row.taxable)}</td>
                              <td style={{ padding: "10px", textAlign: "right" }}>{formatCurrency(row.cgst + row.sgst)}</td>
                              <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#1a56db" }}>{formatCurrency(row.net)}</td>
                              <td style={{ padding: "10px", textAlign: "right" }}>{row.trips}</td>
                              <td style={{ padding: "10px", textAlign: "right" }}>{formatRate(row.avgRate)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BG Utilization Card */}
            {bgDetails.map(bg => (
              <div key={bg.id} style={{ ...cardStyle, marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{bg.company} Bank Guarantee</span>
                    <span style={{ fontSize: 12, color: "#8896a8", marginLeft: 10 }}>{bg.bankName}</span>
                  </div>
                  <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{formatCurrency(bg.bgAmount)}</span>
                </div>
                {/* Utilization bar */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: "#64748b" }}>Utilized: {formatCurrency(bg.utilized)}</span>
                    <span style={{ color: "#16a34a", fontWeight: 600 }}>Available: {formatCurrency(bg.available)}</span>
                  </div>
                  <div style={{ background: "#f1f5f9", borderRadius: 8, height: 14, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (bg.utilized / bg.bgAmount) * 100)}%`, height: "100%", background: bg.utilized > bg.bgAmount ? "#dc2626" : "linear-gradient(90deg, #3b82f6, #1d4ed8)", borderRadius: 8, transition: "width 0.4s" }} />
                  </div>
                  <div style={{ textAlign: "right", fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{((bg.utilized / bg.bgAmount) * 100).toFixed(1)}% utilized</div>
                  {bg.utilized > bg.bgAmount && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginTop: 8, fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>⚠ BG LIMIT EXCEEDED by {formatCurrency(bg.utilized - bg.bgAmount)}</div>}
                </div>
                {/* Commission details */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, background: "#f8fafc", borderRadius: 10, padding: 14 }}>
                  <div><div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase" }}>Margin ({bg.marginPct}%)</div><div style={{ fontSize: 15, fontWeight: 600 }}>{formatCurrency(bg.marginAmt)}</div></div>
                  <div><div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase" }}>Annual Commission</div><div style={{ fontSize: 15, fontWeight: 600 }}>{formatAmt(bg.annualCommission)}</div></div>
                  <div><div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase" }}>Monthly Rate</div><div style={{ fontSize: 15, fontWeight: 600 }}>{formatAmt(bg.monthlyCommission)}</div></div>
                  <div><div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase" }}>Used ({bg.usedDays} days)</div><div style={{ fontSize: 15, fontWeight: 600, color: "#c2410c" }}>{formatAmt(bg.usedCommission)}</div></div>
                  <div><div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase" }}>Valid From</div><div style={{ fontSize: 14, fontWeight: 600 }}>{formatDate(bg.bgStartDate)}</div></div>
                  <div><div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase" }}>Valid Till</div><div style={{ fontSize: 14, fontWeight: 600 }}>{formatDate(bg.bgEndDate)}</div></div>
                </div>
              </div>
            ))}

            {/* Payment Rules Info */}
            <div style={{ ...cardStyle, marginBottom: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Payment Rules</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div style={{ background: "#eff6ff", borderRadius: 10, padding: 14, borderLeft: "4px solid #3b82f6" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8" }}>HPCL</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>Invoice date + <b>30 days</b></div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>BG backed purchase</div>
                </div>
                <div style={{ background: "#fef3c7", borderRadius: 10, padding: 14, borderLeft: "4px solid #f59e0b" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309" }}>BPCL</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>Invoice date + <b>30 days</b></div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>BG backed purchase</div>
                </div>
                <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 14, borderLeft: "4px solid #16a34a" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>IOCL</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>Pay every <b>15th</b> of next month</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Order 1st → 45 days to pay</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>Order 31st → only 15 days to pay</div>
                </div>
              </div>
            </div>

            {/* Upcoming Due - next 7 days */}
            <div style={cardStyle}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>⚠ Upcoming Payments (Next 7 Days)</div>
              {invoices.filter(i => getPendingAmt(i) > 0 && daysUntil(i.dueDate) >= 0 && daysUntil(i.dueDate) <= 7).length === 0 ? (
                <div style={{ color: "#94a3b8", fontSize: 13, padding: "12px 0" }}>No payments due in next 7 days 🎉</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                      {["Invoice", "Company", "Terminal", "Due Date", "Days Left", "Amount"].map(h => (
                        <th key={h} style={{ padding: "8px 6px", textAlign: "left", fontSize: 10, textTransform: "uppercase", color: "#8896a8", fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.filter(i => getPendingAmt(i) > 0 && daysUntil(i.dueDate) >= 0 && daysUntil(i.dueDate) <= 7).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).map(i => (
                      <tr key={i.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "10px 6px", fontWeight: 600 }}>{i.invoiceNo}</td>
                        <td style={{ padding: "10px 6px" }}>{i.company}</td>
                        <td style={{ padding: "10px 6px" }}>{i.terminal}</td>
                        <td style={{ padding: "10px 6px" }}>{formatDate(i.dueDate)}</td>
                        <td style={{ padding: "10px 6px" }}><StatusBadge status={getInvoiceStatus(i)} daysLeft={daysUntil(i.dueDate)} /></td>
                        <td style={{ padding: "10px 6px", fontWeight: 600, color: "#dc2626" }}>{formatAmt(getPendingAmt(i))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ===== INVOICES TAB ===== */}
        {tab === "invoices" && (
          <>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <select value={filterCompany} onChange={e => setFilterCompany(e.target.value)} style={{ ...selectStyle, width: "auto" }}>
                <option value="ALL">All Companies</option>
                <option value="HPCL">HPCL</option>
                <option value="IOCL">IOCL</option>
                <option value="BPCL">BPCL</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...selectStyle, width: "auto" }}>
                <option value="ALL">All Status</option>
                <option value="unpaid">Unpaid / Pending</option>
                <option value="partial">Partly paid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="due_soon">Due in 7 days</option>
              </select>
              <div style={{ flex: 1 }} />
              <button onClick={generatePDFReport} style={{ ...btnSecondary, background: "#dc2626", color: "white", border: "none" }}>📄 PDF Report</button>
              <button onClick={() => openDirectPayment()} style={{ ...btnPrimary, background: "#16a34a" }}>+ Direct Payment</button>
              <button onClick={() => setShowAddInvoice(true)} style={btnPrimary}>+ Add Invoice</button>
            </div>

            <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["#", "Inv Date", "Invoice No", "Company", "Terminal", "Qty (MT)", "Net Amount", "Paid", "Pending", "Due Date", "Status", "Paid Date", "Action"].map(h => (
                        <th key={h} style={{ padding: "12px 8px", textAlign: "left", fontSize: 10, textTransform: "uppercase", color: "#8896a8", fontWeight: 600, borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((inv, idx) => {
                      const dl = daysUntil(inv.dueDate);
                      const status = getInvoiceStatus(inv);
                      const pending = getPendingAmt(inv);
                      const paid = getPaidAmt(inv);
                      return (
                        <tr key={inv.id} style={{ borderBottom: "1px solid #f1f5f9", background: status === "paid" ? "#f0fdf4" : status === "partial" ? "#f0f9ff" : dl < 0 ? "#fef2f2" : "white" }}>
                          <td style={{ padding: "10px 8px", color: "#94a3b8" }}>{idx + 1}</td>
                          <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>{formatDate(inv.date)}</td>
                          <td style={{ padding: "10px 8px", fontWeight: 600, fontSize: 11 }}>{inv.invoiceNo}</td>
                          <td style={{ padding: "10px 8px" }}><span style={{ background: inv.company === "HPCL" ? "#dbeafe" : inv.company === "IOCL" ? "#dcfce7" : "#fef3c7", color: inv.company === "HPCL" ? "#1d4ed8" : inv.company === "IOCL" ? "#15803d" : "#b45309", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>{inv.company}</span></td>
                          <td style={{ padding: "10px 8px", fontSize: 11 }}>{inv.terminal}</td>
                          <td style={{ padding: "10px 8px", textAlign: "right" }}>{inv.qty.toFixed(2)}</td>
                          <td style={{ padding: "10px 8px", textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" }}>{formatAmt(inv.netAmt)}</td>
                          <td style={{ padding: "10px 8px", textAlign: "right", color: "#16a34a", fontWeight: 600, whiteSpace: "nowrap" }}>{paid > 0 ? formatAmt(paid) : "-"}</td>
                          <td style={{ padding: "10px 8px", textAlign: "right", color: pending > 0 ? "#dc2626" : "#16a34a", fontWeight: 700, whiteSpace: "nowrap" }}>{formatAmt(pending)}</td>
                          <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>{formatDate(inv.dueDate)}</td>
                          <td style={{ padding: "10px 8px" }}><StatusBadge status={status} daysLeft={dl} /></td>
                          <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>{inv.paidDate ? formatDate(inv.paidDate) : "-"}</td>
                          <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>
                            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                              {status !== "paid" ? (
                                <>
                                  <button onClick={() => openPaymentModal(inv)} style={{ background: "#16a34a", color: "white", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Pay Company ✓</button>
                                  <button onClick={() => openEditInvoice(inv)} style={{ background: "#f59e0b", color: "white", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                                  <button onClick={() => handleDeleteInvoice(inv.id)} style={{ background: "#ef4444", color: "white", border: "none", borderRadius: 6, padding: "6px 8px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>✕</button>
                                </>
                              ) : (
                                <>
                                  <span style={{ color: "#16a34a", fontWeight: 600, fontSize: 11 }}>✓ Cleared</span>
                                  <button onClick={() => handleUndoPay(inv.id)} style={{ background: "#94a3b8", color: "white", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 10, fontWeight: 600, cursor: "pointer", marginLeft: 4 }}>Undo</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Summary footer */}
              <div style={{ background: "#f8fafc", padding: "14px 16px", display: "flex", gap: 24, fontSize: 12, fontWeight: 600, borderTop: "2px solid #e2e8f0" }}>
                <span>Total: {filteredInvoices.length} invoices</span>
                <span style={{ color: "#dc2626" }}>Outstanding: {formatCurrency(filteredInvoices.reduce((s, i) => s + getPendingAmt(i), 0))}</span>
                <span style={{ color: "#16a34a" }}>Paid: {formatCurrency(filteredInvoices.reduce((s, i) => s + getPaidAmt(i), 0))}</span>
              </div>
            </div>
          </>
        )}

        {/* ===== PAYMENT HISTORY TAB ===== */}
        {tab === "payments" && (
          <>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.2 }}>Date-wise Lump-Sum Payment History</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Every direct payment is saved with the payment date, company, amount received, and invoice-wise adjustment details.</div>
              </div>
              <button onClick={() => openDirectPayment()} style={{ ...btnPrimary, background: "#16a34a" }}>+ Direct Payment</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 18 }}>
              <div style={cardStyle}><div style={labelStyle}>Total Payments Entered</div><div style={{ ...valStyle, color: "#0f172a" }}>{paymentHistory.length}</div></div>
              <div style={cardStyle}><div style={labelStyle}>Amount Received</div><div style={{ ...valStyle, color: "#16a34a" }}>{formatCurrency(paymentHistory.reduce((s, p) => s + Number(p.amountReceived || 0), 0))}</div></div>
              <div style={cardStyle}><div style={labelStyle}>Adjusted to Invoices</div><div style={{ ...valStyle, color: "#1a56db" }}>{formatCurrency(paymentHistory.reduce((s, p) => s + Number(p.allocatedAmount || 0), 0))}</div></div>
              <div style={cardStyle}><div style={labelStyle}>Unadjusted Excess</div><div style={{ ...valStyle, color: "#b45309" }}>{formatCurrency(paymentHistory.reduce((s, p) => s + Number(p.unallocatedAmount || 0), 0))}</div></div>
            </div>

            {paymentHistorySorted.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: "34px 22px" }}>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>No lump-sum payment recorded yet</div>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 18 }}>Click Direct Payment, enter the company, date, and amount. The ledger will show date-wise adjustment automatically.</div>
                <button onClick={() => openDirectPayment()} style={{ ...btnPrimary, background: "#16a34a" }}>Enter First Payment</button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {paymentHistorySorted.map(payment => (
                  <div key={payment.id} style={{ ...cardStyle, padding: 0, overflow: "hidden", border: "1px solid #dbe7f3" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", padding: "16px 18px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800 }}>{formatDate(payment.paymentDate)} — {payment.company}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>Payment ID: {payment.id}</div>
                      </div>
                      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", textAlign: "right" }}>
                        <div><div style={labelStyle}>Received</div><div style={{ fontSize: 18, fontWeight: 800, color: "#16a34a" }}>{formatAmt(payment.amountReceived)}</div></div>
                        <div><div style={labelStyle}>Adjusted</div><div style={{ fontSize: 18, fontWeight: 800, color: "#1a56db" }}>{formatAmt(payment.allocatedAmount)}</div></div>
                        {Number(payment.unallocatedAmount || 0) > 0 && <div><div style={labelStyle}>Unadjusted</div><div style={{ fontSize: 18, fontWeight: 800, color: "#b45309" }}>{formatAmt(payment.unallocatedAmount)}</div></div>}
                      </div>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 820 }}>
                        <thead>
                          <tr style={{ background: "white" }}>
                            {["#", "Invoice No", "Inv Date", "Due Date", "Terminal", "Pending Before", "Adjusted", "Pending After"].map(h => (
                              <th key={h} style={{ padding: "10px 12px", textAlign: h.includes("Pending") || h === "Adjusted" ? "right" : "left", fontSize: 10, textTransform: "uppercase", color: "#8896a8", fontWeight: 700, borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(payment.allocations || []).map((row, idx) => (
                            <tr key={`${payment.id}-${row.invoiceId}`} style={{ borderBottom: "1px solid #f1f5f9" }}>
                              <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{idx + 1}</td>
                              <td style={{ padding: "10px 12px", fontWeight: 700 }}>{row.invoiceNo}</td>
                              <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>{formatDate(row.invoiceDate)}</td>
                              <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>{formatDate(row.dueDate)}</td>
                              <td style={{ padding: "10px 12px" }}>{row.terminal}</td>
                              <td style={{ padding: "10px 12px", textAlign: "right", color: "#dc2626", fontWeight: 600 }}>{formatAmt(row.pendingBefore)}</td>
                              <td style={{ padding: "10px 12px", textAlign: "right", color: "#16a34a", fontWeight: 800 }}>{formatAmt(row.amountAdjusted)}</td>
                              <td style={{ padding: "10px 12px", textAlign: "right", color: row.pendingAfter > 0 ? "#b45309" : "#16a34a", fontWeight: 700 }}>{formatAmt(row.pendingAfter)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== BG DETAILS TAB ===== */}
        {tab === "bg_details" && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button onClick={() => setShowAddBG(true)} style={btnPrimary}>+ Add Bank Guarantee</button>
            </div>
            {bgDetails.map(bg => (
              <div key={bg.id} style={{ ...cardStyle, marginBottom: 18, border: bg.isExpired ? "2px solid #ef4444" : bg.isExpiringSoon ? "2px solid #f59e0b" : "1px solid #eef2f6" }}>
                {/* Expiry warning banner */}
                {bg.isExpired && <div style={{ background: "#fef2f2", borderRadius: "10px 10px 0 0", margin: "-20px -22px 16px -22px", padding: "10px 22px", color: "#b91c1c", fontWeight: 700, fontSize: 13 }}>⚠ BG EXPIRED — Renew immediately!</div>}
                {bg.isExpiringSoon && !bg.isExpired && <div style={{ background: "#fef3c7", borderRadius: "10px 10px 0 0", margin: "-20px -22px 16px -22px", padding: "10px 22px", color: "#b45309", fontWeight: 700, fontSize: 13 }}>⚠ BG expiring in {bg.remainingDays} days — Plan renewal</div>}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{bg.company} — Bank Guarantee</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{bg.bankName}</div>
                    <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>BG No: <b>{bg.bgNo || bg.bgRefNo || "N/A"}</b></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: "#1a56db" }}>{formatCurrency(bg.bgAmount)}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>BG Amount</div>
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      <button onClick={() => openEditBG(bg)} style={{ background: "#f59e0b", color: "white", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                      <button onClick={() => handleDeleteBG(bg.id)} style={{ background: "#ef4444", color: "white", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>✕</button>
                    </div>
                  </div>
                </div>

                {/* Dates row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 14, background: "#f8fafc", borderRadius: 10, padding: 14 }}>
                  <div><div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase" }}>Issue Date</div><div style={{ fontSize: 14, fontWeight: 600 }}>{formatDate(bg.bgStartDate)}</div></div>
                  <div><div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase" }}>Expiry Date</div><div style={{ fontSize: 14, fontWeight: 600, color: bg.isExpired ? "#dc2626" : bg.isExpiringSoon ? "#b45309" : "#1e293b" }}>{formatDate(bg.bgEndDate)}</div></div>
                  <div><div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase" }}>Claim Expiry</div><div style={{ fontSize: 14, fontWeight: 600 }}>{formatDate(bg.claimExpiry || bg.bgEndDate)}</div></div>
                  <div><div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase" }}>Days Remaining</div><div style={{ fontSize: 14, fontWeight: 700, color: bg.isExpired ? "#dc2626" : bg.isExpiringSoon ? "#b45309" : "#16a34a" }}>{bg.remainingDays > 0 ? bg.remainingDays + " days" : "EXPIRED"}</div></div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 18 }}>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase", fontWeight: 600 }}>Margin Money ({bg.marginPct}%)</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#7c3aed", marginTop: 4 }}>{formatCurrency(bg.marginAmt)}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Blocked with bank</div>
                  </div>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase", fontWeight: 600 }}>Commission Rate</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#c2410c", marginTop: 4 }}>{bg.commissionPct}% p.a.</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{formatAmt(bg.dailyRate)}/day</div>
                  </div>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase", fontWeight: 600 }}>Annual Commission</div>
                    <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{formatAmt(bg.annualCommission)}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{formatAmt(bg.monthlyCommission)}/month</div>
                  </div>
                  <div style={{ background: "#fff7ed", borderRadius: 10, padding: 16, border: "1px solid #fed7aa" }}>
                    <div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase", fontWeight: 600 }}>Commission Used</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#ea580c", marginTop: 4 }}>{formatAmt(bg.usedCommission)}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{bg.usedDays} days used of {bg.totalDays}</div>
                  </div>
                </div>

                {/* Utilization */}
                <div style={{ background: "#f0f9ff", borderRadius: 10, padding: 16, border: "1px solid #bae6fd" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>BG Utilization (Outstanding against {bg.company})</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                    <span>Utilized: <b style={{ color: "#dc2626" }}>{formatCurrency(bg.utilized)}</b></span>
                    <span>Available: <b style={{ color: "#16a34a" }}>{formatCurrency(Math.max(0, bg.available))}</b></span>
                  </div>
                  <div style={{ background: "#e0f2fe", borderRadius: 8, height: 20, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (bg.utilized / bg.bgAmount) * 100)}%`, height: "100%", background: bg.utilized > bg.bgAmount * 0.9 ? "#ef4444" : bg.utilized > bg.bgAmount * 0.7 ? "#f59e0b" : "#3b82f6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", fontWeight: 700 }}>
                      {((bg.utilized / bg.bgAmount) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ===== BG REPORT TAB ===== */}
        {tab === "bg_report" && (
          <>
            {/* Overall Summary */}
            <div style={{ ...cardStyle, marginBottom: 18 }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Bank Guarantee — Complete Report</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 18 }}>
                <div style={{ background: "#eff6ff", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase", fontWeight: 600 }}>Total BG Count</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#1d4ed8", marginTop: 4 }}>{bgs.length}</div>
                </div>
                <div style={{ background: "#eff6ff", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase", fontWeight: 600 }}>Total BG Amount</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#1d4ed8", marginTop: 4 }}>{formatCurrency(bgs.reduce((s, b) => s + b.bgAmount, 0))}</div>
                </div>
                <div style={{ background: "#f5f3ff", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase", fontWeight: 600 }}>Total Margin Blocked</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#7c3aed", marginTop: 4 }}>{formatCurrency(bgs.reduce((s, b) => s + b.marginAmt, 0))}</div>
                </div>
                <div style={{ background: "#fff7ed", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase", fontWeight: 600 }}>Total Commission Used</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#ea580c", marginTop: 4 }}>{formatAmt(bgDetails.reduce((s, b) => s + b.usedCommission, 0))}</div>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase", fontWeight: 600 }}>Total Stamp Duty</div>
                  <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{formatAmt(bgs.reduce((s, b) => s + (b.stampDuty || 0), 0))}</div>
                </div>
                <div style={{ background: bgDetails.some(b => b.isExpiringSoon || b.isExpired) ? "#fef2f2" : "#f0fdf4", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, color: "#8896a8", textTransform: "uppercase", fontWeight: 600 }}>Expiry Alerts</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: bgDetails.filter(b => b.isExpiringSoon || b.isExpired).length > 0 ? "#dc2626" : "#16a34a", marginTop: 4 }}>{bgDetails.filter(b => b.isExpiringSoon || b.isExpired).length}</div>
                </div>
              </div>
            </div>

            {/* Company-wise Summary */}
            <div style={{ ...cardStyle, marginBottom: 18 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Company-wise BG Summary</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    {["Company", "No. of BGs", "Total BG Amount", "Total Margin", "Total Comm. Used", "Outstanding", "Net Available"].map(h => (
                      <th key={h} style={{ padding: "10px 8px", textAlign: "left", fontSize: 10, textTransform: "uppercase", color: "#8896a8", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(bgSummaryByCompany).map(([co, v]) => (
                    <tr key={co} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px 8px", fontWeight: 700 }}>{co}</td>
                      <td style={{ padding: "10px 8px" }}>{v.count}</td>
                      <td style={{ padding: "10px 8px", fontWeight: 600 }}>{formatCurrency(v.totalBG)}</td>
                      <td style={{ padding: "10px 8px", color: "#7c3aed" }}>{formatCurrency(v.totalMargin)}</td>
                      <td style={{ padding: "10px 8px", color: "#ea580c" }}>{formatAmt(v.totalCommUsed)}</td>
                      <td style={{ padding: "10px 8px", color: "#dc2626", fontWeight: 600 }}>{formatCurrency(v.utilized)}</td>
                      <td style={{ padding: "10px 8px", color: "#16a34a", fontWeight: 600 }}>{formatCurrency(Math.max(0, v.totalBG - v.utilized))}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "#f1f5f9", fontWeight: 700 }}>
                    <td style={{ padding: "10px 8px" }}>TOTAL</td>
                    <td style={{ padding: "10px 8px" }}>{bgs.length}</td>
                    <td style={{ padding: "10px 8px" }}>{formatCurrency(Object.values(bgSummaryByCompany).reduce((s, v) => s + v.totalBG, 0))}</td>
                    <td style={{ padding: "10px 8px", color: "#7c3aed" }}>{formatCurrency(Object.values(bgSummaryByCompany).reduce((s, v) => s + v.totalMargin, 0))}</td>
                    <td style={{ padding: "10px 8px", color: "#ea580c" }}>{formatAmt(Object.values(bgSummaryByCompany).reduce((s, v) => s + v.totalCommUsed, 0))}</td>
                    <td style={{ padding: "10px 8px", color: "#dc2626" }}>{formatCurrency(Object.values(bgSummaryByCompany).reduce((s, v) => s + v.utilized, 0))}</td>
                    <td style={{ padding: "10px 8px", color: "#16a34a" }}>{formatCurrency(Object.values(bgSummaryByCompany).reduce((s, v) => s + Math.max(0, v.totalBG - v.utilized), 0))}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Full BG Register */}
            <div style={{ ...cardStyle, padding: 0, overflow: "hidden", marginBottom: 18 }}>
              <div style={{ padding: "16px 20px", borderBottom: "2px solid #e2e8f0", fontWeight: 700, fontSize: 16 }}>BG Register — All Bank Guarantees</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["#", "BG Number", "Company", "Bank", "BG Amount", "Margin (%)", "Margin Amt", "Issue Date", "Expiry Date", "Claim Expiry", "Days Left", "Comm Rate", "Comm Used", "Stamp Duty", "Status"].map(h => (
                        <th key={h} style={{ padding: "10px 6px", textAlign: "left", fontSize: 9, textTransform: "uppercase", color: "#8896a8", fontWeight: 600, borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bgDetails.map((bg, idx) => (
                      <tr key={bg.id} style={{ borderBottom: "1px solid #f1f5f9", background: bg.isExpired ? "#fef2f2" : bg.isExpiringSoon ? "#fffbeb" : "white" }}>
                        <td style={{ padding: "10px 6px", color: "#94a3b8" }}>{idx + 1}</td>
                        <td style={{ padding: "10px 6px", fontWeight: 600, fontSize: 11 }}>{bg.bgNo || "N/A"}</td>
                        <td style={{ padding: "10px 6px" }}><span style={{ background: bg.company === "HPCL" ? "#dbeafe" : bg.company === "IOCL" ? "#dcfce7" : "#fef3c7", color: bg.company === "HPCL" ? "#1d4ed8" : bg.company === "IOCL" ? "#15803d" : "#b45309", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>{bg.company}</span></td>
                        <td style={{ padding: "10px 6px", fontSize: 11 }}>{bg.bankName}</td>
                        <td style={{ padding: "10px 6px", fontWeight: 600 }}>{formatCurrency(bg.bgAmount)}</td>
                        <td style={{ padding: "10px 6px" }}>{bg.marginPct}%</td>
                        <td style={{ padding: "10px 6px" }}>{formatCurrency(bg.marginAmt)}</td>
                        <td style={{ padding: "10px 6px", whiteSpace: "nowrap" }}>{formatDate(bg.bgStartDate)}</td>
                        <td style={{ padding: "10px 6px", whiteSpace: "nowrap" }}>{formatDate(bg.bgEndDate)}</td>
                        <td style={{ padding: "10px 6px", whiteSpace: "nowrap" }}>{formatDate(bg.claimExpiry || bg.bgEndDate)}</td>
                        <td style={{ padding: "10px 6px", fontWeight: 700, color: bg.isExpired ? "#dc2626" : bg.isExpiringSoon ? "#b45309" : "#16a34a" }}>{bg.remainingDays > 0 ? bg.remainingDays + "d" : "EXP"}</td>
                        <td style={{ padding: "10px 6px" }}>{bg.commissionPct}%</td>
                        <td style={{ padding: "10px 6px", color: "#ea580c", fontWeight: 600 }}>{formatAmt(bg.usedCommission)}</td>
                        <td style={{ padding: "10px 6px" }}>{formatAmt(bg.stampDuty || 0)}</td>
                        <td style={{ padding: "10px 6px" }}><span style={{ background: bg.isExpired ? "#fecaca" : bg.isExpiringSoon ? "#fef3c7" : "#dcfce7", color: bg.isExpired ? "#b91c1c" : bg.isExpiringSoon ? "#b45309" : "#15803d", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>{bg.isExpired ? "EXPIRED" : bg.isExpiringSoon ? "EXPIRING" : "ACTIVE"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cost Summary */}
            <div style={{ ...cardStyle }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Total BG Cost Breakdown</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {[
                    ["Total Margin Money Blocked with Bank", formatCurrency(bgs.reduce((s, b) => s + b.marginAmt, 0)), "#7c3aed"],
                    ["Total Commission Charged (till date)", formatAmt(bgDetails.reduce((s, b) => s + b.usedCommission, 0)), "#ea580c"],
                    ["Total Stamp Duty Paid", formatAmt(bgs.reduce((s, b) => s + (b.stampDuty || 0), 0)), "#475569"],
                    ["Total Cost of BG (Commission + Stamp Duty)", formatAmt(bgDetails.reduce((s, b) => s + b.usedCommission, 0) + bgs.reduce((s, b) => s + (b.stampDuty || 0), 0)), "#dc2626"],
                  ].map(([label, val, color], i) => (
                    <tr key={i} style={{ borderBottom: i < 3 ? "1px solid #f1f5f9" : "none", background: i === 3 ? "#fef2f2" : "transparent" }}>
                      <td style={{ padding: "12px 8px", fontWeight: i === 3 ? 700 : 400 }}>{label}</td>
                      <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: 700, color, fontSize: i === 3 ? 16 : 14 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add Invoice Modal */}
      {showAddInvoice && (
        <Overlay onClose={() => setShowAddInvoice(false)}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Add New Invoice</div>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Company</label>
              <select value={newInv.company} onChange={e => setNewInv({ ...newInv, company: e.target.value })} style={selectStyle}>
                <option>HPCL</option><option>IOCL</option><option>BPCL</option>
              </select>
              {newInv.company === "IOCL" && <div style={{ fontSize: 11, color: "#b45309", marginTop: 4, background: "#fef3c7", padding: "4px 8px", borderRadius: 6 }}>IOCL: Due date = 15th of next billing cycle</div>}
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Invoice Date</label>
              <input type="date" value={newInv.date} onChange={e => setNewInv({ ...newInv, date: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Invoice No</label>
              <input value={newInv.invoiceNo} onChange={e => setNewInv({ ...newInv, invoiceNo: e.target.value })} style={inputStyle} placeholder="e.g. GJ0160009214" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Terminal</label>
              <input value={newInv.terminal} onChange={e => setNewInv({ ...newInv, terminal: e.target.value })} style={inputStyle} placeholder="e.g. HPCL PIPAVAV" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Qty (MT)</label>
                <input type="number" value={newInv.qty} onChange={e => setNewInv({ ...newInv, qty: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Net Amount (₹)</label>
                <input type="number" value={newInv.netAmt} onChange={e => setNewInv({ ...newInv, netAmt: e.target.value })} style={inputStyle} />
              </div>
            </div>
            {newInv.date && <div style={{ fontSize: 12, color: "#1d4ed8", background: "#eff6ff", padding: "8px 12px", borderRadius: 8 }}>Due Date: <b>{formatDate(newInv.company === "IOCL" ? calcIOCLDue(newInv.date) : addDays(newInv.date, 30))}</b></div>}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={handleAddInvoice} disabled={!newInv.date || !newInv.invoiceNo || !newInv.netAmt} style={{ ...btnPrimary, opacity: (!newInv.date || !newInv.invoiceNo || !newInv.netAmt) ? 0.5 : 1 }}>Add Invoice</button>
              <button onClick={() => setShowAddInvoice(false)} style={btnSecondary}>Cancel</button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Pay Modal */}
      {showPayModal && (
        <Overlay onClose={() => setShowPayModal(false)}>
          {(() => {
            const orderedForPreview = invoices
              .filter(i => i.company === directPayCompany && getPendingAmt(i) > 0)
              .sort((a, b) => {
                const dueDiff = new Date(a.dueDate) - new Date(b.dueDate);
                if (dueDiff !== 0) return dueDiff;
                const dateDiff = new Date(a.date) - new Date(b.date);
                if (dateDiff !== 0) return dateDiff;
                return Number(a.id) - Number(b.id);
              });
            const pendingTotal = orderedForPreview.reduce((sum, row) => sum + getPendingAmt(row), 0);
            let previewRemaining = Math.max(0, parseFloat(paymentAmount) || 0);
            const allocationPreview = orderedForPreview.map(row => {
              const pending = getPendingAmt(row);
              const applied = Math.min(pending, previewRemaining);
              previewRemaining -= applied;
              return { ...row, pending, applied, balanceAfter: pending - applied };
            }).filter(row => row.applied > 0);
            const unallocatedAmount = Math.max(0, previewRemaining);
            return (
              <>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Direct Payment Entry</div>
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: 12, marginBottom: 14, color: "#1e3a8a", fontSize: 12, lineHeight: 1.55 }}>
                  Enter the <b>new payment received now</b>. The system will automatically apply it to the selected company’s oldest pending invoice first, then continue invoice by invoice. For the second payment, enter only the second received amount; it will continue from the next pending or partly paid invoice.
                </div>
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Company</label>
                      <select value={directPayCompany} onChange={e => setDirectPayCompany(e.target.value)} style={selectStyle}>
                        <option value="HPCL">HPCL</option>
                        <option value="IOCL">IOCL</option>
                        <option value="BPCL">BPCL</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Total Pending for Company</label>
                      <div style={{ ...inputStyle, display: "flex", alignItems: "center", background: "white", fontWeight: 800, color: pendingTotal > 0 ? "#dc2626" : "#16a34a" }}>{formatAmt(pendingTotal)}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Payment Date</label>
                      <input type="date" value={payDate} onChange={e => setPayDate(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>New Payment Amount Received Now (₹)</label>
                      <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} style={inputStyle} placeholder="e.g. 5000000" />
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 5 }}>Example: for a second ₹20 lakh receipt, type only 2000000.</div>
                    </div>
                  </div>
                </div>
                {allocationPreview.length > 0 && (
                  <div style={{ background: "#ecfdf5", border: "1px solid #bbf7d0", borderRadius: 10, padding: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 8 }}>Automatic sequential allocation preview</div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {allocationPreview.map(row => (
                        <div key={row.id} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: 8, fontSize: 11 }}>
                          <span><b>{row.invoiceNo}</b></span>
                          <span style={{ color: "#16a34a" }}>Pay {formatAmt(row.applied)}</span>
                          <span style={{ color: row.balanceAfter > 0 ? "#dc2626" : "#16a34a" }}>Pending {formatAmt(row.balanceAfter)}</span>
                        </div>
                      ))}
                    </div>
                    {unallocatedAmount > 0 && (
                      <div style={{ marginTop: 8, fontSize: 11, color: "#b45309", fontWeight: 700 }}>Unallocated extra amount after clearing all pending invoices: {formatAmt(unallocatedAmount)}</div>
                    )}
                  </div>
                )}
                {orderedForPreview.length === 0 && (
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 12, marginBottom: 16, color: "#166534", fontSize: 12, fontWeight: 700 }}>
                    No pending invoice balance is available for {directPayCompany}.
                  </div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handlePay} disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || orderedForPreview.length === 0} style={{ ...btnPrimary, background: "#16a34a", opacity: (!paymentAmount || parseFloat(paymentAmount) <= 0 || orderedForPreview.length === 0) ? 0.55 : 1 }}>Allocate Payment ✓</button>
                  <button onClick={() => { setShowPayModal(false); setPaymentAmount(""); }} style={btnSecondary}>Cancel</button>
                </div>
              </>
            );
          })()}
        </Overlay>
      )}

      {/* Add BG Modal */}
      {showAddBG && (
        <Overlay onClose={() => setShowAddBG(false)}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Add Bank Guarantee</div>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Company</label>
                <select value={newBG.company} onChange={e => setNewBG({ ...newBG, company: e.target.value })} style={selectStyle}>
                  <option>HPCL</option><option>IOCL</option><option>BPCL</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>BG Number</label>
                <input value={newBG.bgNo} onChange={e => setNewBG({ ...newBG, bgNo: e.target.value })} style={inputStyle} placeholder="e.g. 0452NDLG00001127" />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>BG Amount (₹)</label>
              <input type="number" value={newBG.bgAmount} onChange={e => setNewBG({ ...newBG, bgAmount: e.target.value })} style={inputStyle} placeholder="e.g. 20000000" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Bank Name</label>
              <input value={newBG.bankName} onChange={e => setNewBG({ ...newBG, bankName: e.target.value })} style={inputStyle} placeholder="e.g. ICICI Bank - Himatnagar" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Margin %</label>
                <input type="number" value={newBG.marginPct} onChange={e => setNewBG({ ...newBG, marginPct: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Commission % p.a.</label>
                <input type="number" step="0.1" value={newBG.commissionPct} onChange={e => setNewBG({ ...newBG, commissionPct: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Start Date</label>
                <input type="date" value={newBG.bgStartDate} onChange={e => setNewBG({ ...newBG, bgStartDate: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>End Date</label>
                <input type="date" value={newBG.bgEndDate} onChange={e => setNewBG({ ...newBG, bgEndDate: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Claim Expiry Date</label>
                <input type="date" value={newBG.claimExpiry} onChange={e => setNewBG({ ...newBG, claimExpiry: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Stamp Duty (₹)</label>
                <input type="number" value={newBG.stampDuty} onChange={e => setNewBG({ ...newBG, stampDuty: e.target.value })} style={inputStyle} />
              </div>
            </div>
            {newBG.bgAmount && <div style={{ background: "#f0f9ff", borderRadius: 8, padding: 12, fontSize: 12 }}>
              <div>Margin Money: <b>{formatCurrency(newBG.bgAmount * newBG.marginPct / 100)}</b></div>
              <div>Annual Commission: <b>{formatAmt(newBG.bgAmount * newBG.commissionPct / 100)}</b></div>
              <div>Monthly: <b>{formatAmt(newBG.bgAmount * newBG.commissionPct / 100 / 12)}</b></div>
            </div>}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={handleAddBG} disabled={!newBG.bgAmount || !newBG.bgStartDate} style={{ ...btnPrimary, opacity: (!newBG.bgAmount || !newBG.bgStartDate) ? 0.5 : 1 }}>Add BG</button>
              <button onClick={() => setShowAddBG(false)} style={btnSecondary}>Cancel</button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Edit Invoice Modal */}
      {showEditInvoice && editInv && (
        <Overlay onClose={() => { setShowEditInvoice(null); setEditInv(null); }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Edit Invoice</div>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Company</label>
              <select value={editInv.company} onChange={e => setEditInv({ ...editInv, company: e.target.value })} style={selectStyle}>
                <option>HPCL</option><option>IOCL</option><option>BPCL</option>
              </select>
              {editInv.company === "IOCL" && <div style={{ fontSize: 11, color: "#b45309", marginTop: 4, background: "#fef3c7", padding: "4px 8px", borderRadius: 6 }}>IOCL: Due date = 15th of next month</div>}
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Invoice Date</label>
              <input type="date" value={editInv.date} onChange={e => setEditInv({ ...editInv, date: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Invoice No</label>
              <input value={editInv.invoiceNo} onChange={e => setEditInv({ ...editInv, invoiceNo: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Terminal</label>
              <input value={editInv.terminal} onChange={e => setEditInv({ ...editInv, terminal: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Qty (MT)</label>
                <input type="number" value={editInv.qty} onChange={e => setEditInv({ ...editInv, qty: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Net Amount (₹)</label>
                <input type="number" value={editInv.netAmt} onChange={e => setEditInv({ ...editInv, netAmt: e.target.value })} style={inputStyle} />
              </div>
            </div>
            {editInv.date && <div style={{ fontSize: 12, color: "#1d4ed8", background: "#eff6ff", padding: "8px 12px", borderRadius: 8 }}>Due Date will be: <b>{formatDate(editInv.company === "IOCL" ? calcIOCLDue(editInv.date) : addDays(editInv.date, 30))}</b></div>}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={handleEditInvoice} style={{ ...btnPrimary, background: "#f59e0b" }}>Save Changes</button>
              <button onClick={() => { setShowEditInvoice(null); setEditInv(null); }} style={btnSecondary}>Cancel</button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Edit BG Modal */}
      {showEditBG && editBG && (
        <Overlay onClose={() => { setShowEditBG(null); setEditBG(null); }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Edit Bank Guarantee</div>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Company</label>
                <select value={editBG.company} onChange={e => setEditBG({ ...editBG, company: e.target.value })} style={selectStyle}>
                  <option>HPCL</option><option>IOCL</option><option>BPCL</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>BG Number</label>
                <input value={editBG.bgNo || ""} onChange={e => setEditBG({ ...editBG, bgNo: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>BG Amount (₹)</label>
              <input type="number" value={editBG.bgAmount} onChange={e => setEditBG({ ...editBG, bgAmount: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Bank Name</label>
              <input value={editBG.bankName} onChange={e => setEditBG({ ...editBG, bankName: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Margin %</label>
                <input type="number" value={editBG.marginPct} onChange={e => setEditBG({ ...editBG, marginPct: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Commission % p.a.</label>
                <input type="number" step="0.1" value={editBG.commissionPct} onChange={e => setEditBG({ ...editBG, commissionPct: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Start Date</label>
                <input type="date" value={editBG.bgStartDate} onChange={e => setEditBG({ ...editBG, bgStartDate: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>End Date</label>
                <input type="date" value={editBG.bgEndDate} onChange={e => setEditBG({ ...editBG, bgEndDate: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Claim Expiry Date</label>
                <input type="date" value={editBG.claimExpiry || ""} onChange={e => setEditBG({ ...editBG, claimExpiry: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Stamp Duty (₹)</label>
                <input type="number" value={editBG.stampDuty} onChange={e => setEditBG({ ...editBG, stampDuty: e.target.value })} style={inputStyle} />
              </div>
            </div>
            {editBG.bgAmount && <div style={{ background: "#f0f9ff", borderRadius: 8, padding: 12, fontSize: 12 }}>
              <div>Margin Money: <b>{formatCurrency(editBG.bgAmount * editBG.marginPct / 100)}</b></div>
              <div>Annual Commission: <b>{formatAmt(editBG.bgAmount * editBG.commissionPct / 100)}</b></div>
              <div>Monthly: <b>{formatAmt(editBG.bgAmount * editBG.commissionPct / 100 / 12)}</b></div>
            </div>}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={handleEditBG} style={{ ...btnPrimary, background: "#f59e0b" }}>Save Changes</button>
              <button onClick={() => { setShowEditBG(null); setEditBG(null); }} style={btnSecondary}>Cancel</button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}
