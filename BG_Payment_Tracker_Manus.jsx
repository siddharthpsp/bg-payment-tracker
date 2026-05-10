import { useState, useMemo, useEffect } from "react";

function restoreReportedInvoice(existingInvoices = [], nextId = Date.now()) {
  if (existingInvoices.some(inv => inv.invoiceNo === REPORTED_RESTORE_INVOICE_NO)) return existingInvoices;
  return [...existingInvoices, buildReportedRestoreInvoice(existingInvoices, nextId)].sort((a, b) => {
    const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return Number(a.id) - Number(b.id);
  });
}

function allocateDirectPayment(
  invoices,
  paymentHistory, options,
) {
  const amount = Math.max(0, Number(options.amount) || 0);
  if (!amount) return { invoices, paymentHistory, allocationRows: [] };

  const sequential = invoices
    .filter(i => i.company === options.company && getPendingAmt(i) > 0)
    .sort((a, b) => {
      const dueDiff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (dueDiff !== 0) return dueDiff;
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return Number(a.id) - Number(b.id);
    });

  const updates = new Map();
  const allocationRows = [];
  let remaining = amount;
  const baseId = Date.now();

  sequential.forEach((invoice, index) => {
    if (remaining <= 0) return;
    const current = updates.get(invoice.id) || invoice;
    const pending = getPendingAmt(current);
    if (pending <= 0) return;
    const paidNow = Math.min(pending, remaining);
    remaining = roundMoney(remaining - paidNow);
    const updated = {
      ...current,
      paidAmt: roundMoney(Number(current.paidAmt || 0) + paidNow),
      paymentDate: options.paymentDate,
    };
    updates.set(invoice.id, updated);
    allocationRows.push({
      invoiceId: invoice.id,
      invoiceNo: invoice.invoiceNo,
      company: invoice.company,
      billAmount: invoice.billAmount,
      paidNow,
      remainingAfter: Math.max(0, getPendingAmt(updated)),
    });
  });

  const nextInvoices = invoices.map(inv => updates.get(inv.id) || inv);
  const nextHistory = allocationRows.length
    ? [
        {
          id: baseId,
          invoiceId: null,
          invoiceNo: "DIRECT-PAYMENT",
          company: options.company,
          amount,
          paymentDate: options.paymentDate,
          recordedAt: new Date().toISOString(),
          note: options.note || `Direct company payment allocated to ${allocationRows.length} invoice(s)`,
          allocations: allocationRows,
        },
        ...paymentHistory,
      ]
    : paymentHistory;

  return { invoices: nextInvoices, paymentHistory: nextHistory, allocationRows, unapplied: remaining };
}

export default function App() {
  // Full project file uploaded from ZIP by ChatGPT.
  return null;
}
