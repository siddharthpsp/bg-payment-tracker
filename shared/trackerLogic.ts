export type TrackerInvoice = Record<string, any>;
export type TrackerPayment = Record<string, any>;

export const REPORTED_RESTORE_INVOICE_NO = "GJ0160012325";

export const REPORTED_RESTORE_INVOICE: TrackerInvoice = {
  id: 14,
  date: "2026-05-05",
  invoiceNo: REPORTED_RESTORE_INVOICE_NO,
  company: "HPCL",
  terminal: "HPCL PIPAVAV",
  qty: 28.5,
  netAmt: 2967174.9,
  dueDate: "2026-06-04",
  paidDate: "2026-05-08",
  paidAmt: 1686607.2,
  status: "partial",
};

export function getPaidAmt(inv: TrackerInvoice): number {
  return Math.min(Number(inv.netAmt || 0), Math.max(0, Number(inv.paidAmt || 0)));
}

export function getPendingAmt(inv: TrackerInvoice): number {
  return Math.max(0, Number(inv.netAmt || 0) - getPaidAmt(inv));
}

export function getInvoiceStatus(inv: TrackerInvoice): "paid" | "partial" | "unpaid" {
  const paid = getPaidAmt(inv);
  const net = Number(inv.netAmt || 0);
  if (net > 0 && paid >= net - 0.01) return "paid";
  if (paid > 0) return "partial";
  return "unpaid";
}

export function buildReportedRestoreInvoice(existingInvoices: TrackerInvoice[] = [], nextId = Date.now()): TrackerInvoice {
  const idTaken = existingInvoices.some(inv => Number(inv.id) === Number(REPORTED_RESTORE_INVOICE.id));
  return { ...REPORTED_RESTORE_INVOICE, id: idTaken ? nextId : REPORTED_RESTORE_INVOICE.id };
}

export function restoreReportedInvoice(existingInvoices: TrackerInvoice[] = [], nextId = Date.now()): TrackerInvoice[] {
  if (existingInvoices.some(inv => inv.invoiceNo === REPORTED_RESTORE_INVOICE_NO)) return existingInvoices;
  return [...existingInvoices, buildReportedRestoreInvoice(existingInvoices, nextId)].sort((a, b) => {
    const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return Number(a.id) - Number(b.id);
  });
}

export function allocateDirectPayment(
  invoices: TrackerInvoice[],
  paymentHistory: TrackerPayment[],
  options: { company: string; amount: number; paymentDate: string; paymentId?: number },
): { invoices: TrackerInvoice[]; paymentHistory: TrackerPayment[]; allocationRows: TrackerPayment[] } {
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

  const allocation: Record<string, number> = {};
  const allocationRows: TrackerPayment[] = [];
  let remaining = amount;

  for (const inv of sequential) {
    if (remaining <= 0) break;
    const pendingBefore = getPendingAmt(inv);
    const applied = Math.min(pendingBefore, remaining);
    if (applied > 0) {
      allocation[String(inv.id)] = applied;
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

  if (allocationRows.length === 0) return { invoices, paymentHistory, allocationRows: [] };

  const nextInvoices = invoices.map(inv => {
    const applied = allocation[String(inv.id)] || 0;
    if (!applied) return inv;
    const paidAmt = Math.min(Number(inv.netAmt || 0), getPaidAmt(inv) + applied);
    const status = paidAmt >= Number(inv.netAmt || 0) - 0.01 ? "paid" : "partial";
    return { ...inv, paidAmt, paidDate: options.paymentDate, status };
  });

  const allocatedAmount = allocationRows.reduce((sum, row) => sum + Number(row.amountAdjusted || 0), 0);
  const nextPaymentHistory = [{
    id: options.paymentId ?? Date.now(),
    paymentDate: options.paymentDate,
    company: options.company,
    amountReceived: amount,
    allocatedAmount,
    unallocatedAmount: Math.max(0, amount - allocatedAmount),
    allocations: allocationRows,
  }, ...paymentHistory];

  return { invoices: nextInvoices, paymentHistory: nextPaymentHistory, allocationRows };
}

export function deletePaymentEntry(
  invoices: TrackerInvoice[],
  paymentHistory: TrackerPayment[],
  paymentId: number,
): { invoices: TrackerInvoice[]; paymentHistory: TrackerPayment[] } {
  const payment = paymentHistory.find(p => p.id === paymentId);
  if (!payment) return { invoices, paymentHistory };

  const reversalByInvoice: Record<string, number> = {};
  (payment.allocations || []).forEach((row: TrackerPayment) => {
    reversalByInvoice[String(row.invoiceId)] = (reversalByInvoice[String(row.invoiceId)] || 0) + Number(row.amountAdjusted || 0);
  });

  const nextInvoices = invoices.map(inv => {
    const reversal = reversalByInvoice[String(inv.id)] || 0;
    if (!reversal) return inv;

    const paidAmt = Math.max(0, Math.min(Number(inv.netAmt || 0), getPaidAmt(inv) - reversal));
    const status = paidAmt >= Number(inv.netAmt || 0) - 0.01 ? "paid" : paidAmt > 0 ? "partial" : "unpaid";
    const paidDate = paidAmt > 0 ? inv.paidDate : null;

    return { ...inv, paidAmt, paidDate, status };
  });

  return {
    invoices: nextInvoices,
    paymentHistory: paymentHistory.filter(p => p.id !== paymentId),
  };
}

export function removeInvoicePayments(
  invoices: TrackerInvoice[],
  paymentHistory: TrackerPayment[],
  invoiceId: number,
): { invoices: TrackerInvoice[]; paymentHistory: TrackerPayment[] } {
  const nextInvoices = invoices.map(i => i.id === invoiceId ? { ...i, status: "unpaid", paidDate: null, paidAmt: 0 } : i);
  const nextPaymentHistory = paymentHistory.map(payment => {
    const allocations = payment.allocations || [];
    const removedAmount = allocations
      .filter((row: TrackerPayment) => row.invoiceId === invoiceId)
      .reduce((sum: number, row: TrackerPayment) => sum + Number(row.amountAdjusted || 0), 0);

    if (!removedAmount) return payment;

    const remainingAllocations = allocations.filter((row: TrackerPayment) => row.invoiceId !== invoiceId);
    const allocatedAmount = Math.max(0, Number(payment.allocatedAmount || 0) - removedAmount);
    const unallocatedAmount = Math.max(0, Number(payment.unallocatedAmount || 0) + removedAmount);
    return { ...payment, allocations: remainingAllocations, allocatedAmount, unallocatedAmount };
  });

  return { invoices: nextInvoices, paymentHistory: nextPaymentHistory };
}
