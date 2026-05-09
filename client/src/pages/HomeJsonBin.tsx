import { useState, useMemo, useEffect } from "react";
import { allocateDirectPayment, deletePaymentEntry, removeInvoicePayments as applyRemoveInvoicePayments, restoreReportedInvoice } from "@shared/trackerLogic";

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3';
const MASTER_KEY = import.meta.env.VITE_JSONBIN_MASTER_KEY || '';

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

async function getOrCreateBinId(): Promise<string> {
  let binId = localStorage.getItem('tracker_bin_id');
  if (binId) return binId as string;

  // Create new bin with initial data
  try {
    const res = await fetch(`${JSONBIN_API_URL}/b`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY,
      },
      body: JSON.stringify({
        invoices: INITIAL_INVOICES,
        bgs: INITIAL_BGS,
        paymentHistory: [],
        lastUpdated: Date.now(),
      }),
    });

    if (!res.ok) throw new Error('Failed to create bin');
    const data = await res.json();
    const newBinId = data.metadata.id as string;
    localStorage.setItem('tracker_bin_id', newBinId);
    return newBinId;
  } catch (err) {
    console.error('Error creating bin:', err);
    throw err;
  }
}

async function loadTrackerData(binId: string) {
  const res = await fetch(`${JSONBIN_API_URL}/b/${binId}`, {
    method: 'GET',
    headers: { 'X-Master-Key': MASTER_KEY },
  });

  if (!res.ok) throw new Error('Failed to load data');
  const data = await res.json();
  return data.record;
}

async function saveTrackerData(binId: string, data: any) {
  const res = await fetch(`${JSONBIN_API_URL}/b/${binId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': MASTER_KEY,
    },
    body: JSON.stringify({
      invoices: data.invoices,
      bgs: data.bgs,
      paymentHistory: data.paymentHistory,
      lastUpdated: Date.now(),
    }),
  });

  if (!res.ok) throw new Error('Failed to save data');
}

export default function HomeJsonBin() {
  const [invoices, setInvoices] = useState<any[]>(INITIAL_INVOICES);
  const [bgs, setBgs] = useState<any[]>(INITIAL_BGS);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [binId, setBinId] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = await getOrCreateBinId();
        setBinId(id as string);
        const data = await loadTrackerData(id);
        if (data) {
          setInvoices(data.invoices || INITIAL_INVOICES);
          setBgs(data.bgs || INITIAL_BGS);
          setPaymentHistory(data.paymentHistory || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Auto-save on changes
  useEffect(() => {
    if (loading || !binId) return;
    
    const save = async () => {
      try {
        setSaving(true);
        await saveTrackerData(binId, { invoices, bgs, paymentHistory });
      } catch (err) {
        console.error('Save error:', err);
      } finally {
        setSaving(false);
      }
    };

    const timer = setTimeout(save, 1000);
    return () => clearTimeout(timer);
  }, [invoices, bgs, paymentHistory, binId, loading]);

  const handleDirectPayment = (company: string, amount: number) => {
    const result = allocateDirectPayment(invoices, paymentHistory, {
      company,
      amount,
      paymentDate: new Date().toISOString().split('T')[0],
    });
    setInvoices(result.invoices);
    setPaymentHistory(result.paymentHistory);
  };

  const handleDeletePayment = (index: number) => {
    const payment = paymentHistory[index];
    const result = deletePaymentEntry(invoices, paymentHistory, payment);
    if (result && result.invoices) {
      setInvoices(result.invoices);
      setPaymentHistory(result.paymentHistory || paymentHistory);
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading tracker data...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>BG Payment Tracker - JsonBin Cloud Storage</h1>
      
      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      {saving && (
        <div style={{ background: '#dbeafe', color: '#1e40af', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
          Saving to JsonBin...
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>TOTAL OUTSTANDING</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc2626' }}>
            ₹{(invoices.reduce((sum, inv) => sum + (inv.netAmt - (inv.paidAmt || 0)), 0) / 10000000).toFixed(2)} Cr
          </div>
        </div>
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>TOTAL BG AMOUNT</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>
            ₹{(bgs.reduce((sum, bg) => sum + bg.bgAmount, 0) / 10000000).toFixed(2)} Cr
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Invoices ({invoices.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Invoice No</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Company</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Net Amount</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Paid</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px' }}>{inv.invoiceNo}</td>
                <td style={{ padding: '10px' }}>{inv.company}</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>₹{(inv.netAmt / 100000).toFixed(2)} L</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>₹{(inv.paidAmt / 100000).toFixed(2)} L</td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    background: inv.status === 'paid' ? '#dcfce7' : inv.status === 'partial' ? '#fef3c7' : '#fee2e2',
                    color: inv.status === 'paid' ? '#166534' : inv.status === 'partial' ? '#92400e' : '#991b1b',
                  }}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Payment History ({paymentHistory.length})</h2>
        {paymentHistory.length === 0 ? (
          <p style={{ color: '#666' }}>No payments recorded yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Company</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px' }}>{payment.date}</td>
                  <td style={{ padding: '10px' }}>{payment.company}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>₹{(payment.amountReceived / 100000).toFixed(2)} L</td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => handleDeletePayment(idx)} style={{
                      padding: '4px 8px',
                      background: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Direct Payment</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="number" id="paymentAmount" placeholder="Amount (in rupees)" style={{ flex: 1, padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
          <button onClick={() => {
            const amount = parseFloat((document.getElementById('paymentAmount') as HTMLInputElement).value);
            if (amount > 0) {
              handleDirectPayment('HPCL', amount);
              (document.getElementById('paymentAmount') as HTMLInputElement).value = '';
            }
          }} style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}>
            Record Payment
          </button>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: '#666', marginTop: '40px', padding: '20px', background: '#f9fafb', borderRadius: '6px' }}>
        <p>✓ Data is automatically saved to JsonBin cloud storage</p>
        <p>✓ Bin ID: {binId}</p>
        <p>✓ Master Key configured: {MASTER_KEY ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
