import { COMPANY, DEFAULT_SITE_DETAILS } from '@/config/constants';
import { fmtDate } from './formatters';
import { amountInWords } from './gst';
import type { Challan } from '@/types/request.types';
import type { PurchaseOrder } from '@/types/procurement.types';
import type { EInvoice } from '@/types/bill.types';

function openPrint(html: string): void {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 500);
}

function siteInfo(siteName: string) {
  return DEFAULT_SITE_DETAILS.find(s => s.name === siteName);
}

export function printChallan(challan: Challan, issuedByName: string, designation: string): void {
  const from = siteInfo(challan.from_site);
  const to = siteInfo(challan.to_site);
  const rows = challan.items.map(item =>
    `<tr><td>${item.name}</td><td>${item.serial_no ?? '—'}</td><td style="text-align:right">${item.qty}</td><td>${item.unit ?? 'Nos'}</td></tr>`
  ).join('');

  const html = `<!DOCTYPE html><html><head><title>Delivery Challan — ${challan.challan_no}</title>
<style>
  body{font-family:Arial,sans-serif;font-size:11px;padding:24px}
  h2{color:#0f172a;margin:0 0 2px}
  table{width:100%;border-collapse:collapse}
  th{background:#0f172a;color:#fff;padding:8px;text-align:left;font-size:10px}
  td{padding:8px;border-bottom:1px solid #e2e8f0}
  .header{display:flex;justify-content:space-between;margin-bottom:16px}
  .sig{margin-top:40px;display:flex;justify-content:space-between}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="header">
  <div>
    <h2>${COMPANY.name}</h2>
    <div>GSTIN: ${COMPANY.gstin} | ${COMPANY.phone}</div>
  </div>
  <div style="text-align:right">
    <h2>DELIVERY CHALLAN</h2>
    <div>No: ${challan.challan_no} | Date: ${fmtDate(challan.date)}</div>
    ${challan.vehicle_no ? `<div>Vehicle: ${challan.vehicle_no}</div>` : ''}
  </div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
  <div style="background:#f8fafc;padding:12px;border-radius:6px">
    <div style="font-weight:700;margin-bottom:4px">FROM</div>
    <div>${challan.from_site}</div>
    ${from ? `<div>${from.address}, ${from.city}</div>` : ''}
    ${from?.gstin ? `<div>GSTIN: ${from.gstin}</div>` : ''}
  </div>
  <div style="background:#f8fafc;padding:12px;border-radius:6px">
    <div style="font-weight:700;margin-bottom:4px">TO</div>
    <div>${challan.to_site}</div>
    ${to ? `<div>${to.address}, ${to.city}</div>` : ''}
    ${to?.gstin ? `<div>GSTIN: ${to.gstin}</div>` : ''}
  </div>
</div>
<table>
  <thead><tr><th>Item Description</th><th>Serial / Tag No</th><th style="text-align:right">Qty</th><th>Unit</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
${challan.remarks ? `<p style="margin-top:12px;font-size:10px;color:#64748b">Remarks: ${challan.remarks}</p>` : ''}
<div class="sig">
  <div><div style="border-top:1px solid #000;padding-top:4px;width:200px">Received By</div></div>
  <div style="text-align:right">
    <div>${issuedByName}</div>
    <div style="color:#64748b">${designation}</div>
    <div style="border-top:1px solid #000;padding-top:4px;width:200px">Issued By</div>
  </div>
</div>
</body></html>`;
  openPrint(html);
}

export function printPO(po: PurchaseOrder): void {
  const rows = po.items.map((item, i) => `
    <tr>
      <td style="text-align:center">${i + 1}</td>
      <td>${item.description}</td>
      <td style="text-align:center">${item.hsn_sac ?? '—'}</td>
      <td style="text-align:right">${item.qty}</td>
      <td>${item.unit}</td>
      <td style="text-align:right">₹${item.rate.toLocaleString('en-IN')}</td>
      <td style="text-align:right">₹${item.amount.toLocaleString('en-IN')}</td>
      <td style="text-align:center">${item.gst_rate}%</td>
      <td style="text-align:right">₹${(item.cgst + item.sgst + item.igst).toLocaleString('en-IN')}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html><html><head><title>PO — ${po.po_no}</title>
<style>
  body{font-family:Arial,sans-serif;font-size:10px;padding:20px}
  h2{margin:0}table{width:100%;border-collapse:collapse;font-size:10px}
  th{background:#0f172a;color:#fff;padding:6px;font-size:9px}
  td{padding:6px;border:1px solid #e2e8f0}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div style="display:flex;justify-content:space-between;margin-bottom:16px">
  <div><h2>${COMPANY.name}</h2><div>GSTIN: ${COMPANY.gstin}</div><div>${COMPANY.address}, ${COMPANY.city}</div></div>
  <div style="text-align:right"><h2>PURCHASE ORDER</h2><div>PO No: ${po.po_no}</div><div>Date: ${fmtDate(po.date)}</div><div>Site: ${po.site}</div></div>
</div>
<div style="background:#f8fafc;padding:12px;margin-bottom:16px;border-radius:6px">
  <strong>Vendor:</strong> ${po.vendor_name}<br/>
  ${po.vendor_gstin ? `<strong>GSTIN:</strong> ${po.vendor_gstin}<br/>` : ''}
  ${po.vendor_address ? `<strong>Address:</strong> ${po.vendor_address}` : ''}
</div>
<table>
  <thead><tr><th>#</th><th>Description</th><th>HSN/SAC</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th><th>GST%</th><th>GST Amt</th></tr></thead>
  <tbody>${rows}</tbody>
  <tfoot>
    <tr><td colspan="6" style="text-align:right;font-weight:700">Sub Total</td><td colspan="3">₹${po.sub_total.toLocaleString('en-IN')}</td></tr>
    <tr><td colspan="6" style="text-align:right;font-weight:700">Total GST</td><td colspan="3">₹${po.total_gst.toLocaleString('en-IN')}</td></tr>
    <tr style="background:#f0fdf4"><td colspan="6" style="text-align:right;font-weight:800">Grand Total</td><td colspan="3" style="font-weight:800">₹${po.grand_total.toLocaleString('en-IN')}</td></tr>
    <tr><td colspan="9">${amountInWords(po.grand_total)}</td></tr>
  </tfoot>
</table>
${po.terms ? `<p style="margin-top:12px"><strong>Terms:</strong> ${po.terms}</p>` : ''}
<div style="margin-top:40px;text-align:right"><div style="border-top:1px solid #000;padding-top:4px;width:200px;display:inline-block">Authorised Signatory</div></div>
</body></html>`;
  openPrint(html);
}

export function printEInvoice(inv: EInvoice): void {
  const site = siteInfo(inv.site);
  const rows = inv.items.map((item, i) => `
    <tr>
      <td>${i + 1}</td><td>${item.description}</td><td>${item.hsn_sac}</td>
      <td style="text-align:right">${item.qty}</td><td>${item.unit}</td>
      <td style="text-align:right">₹${item.rate.toLocaleString('en-IN')}</td>
      <td style="text-align:right">₹${item.amount.toLocaleString('en-IN')}</td>
      <td style="text-align:center">${item.gst_rate}%</td>
      ${item.cgst > 0
        ? `<td style="text-align:right">₹${item.cgst.toLocaleString('en-IN')}</td><td style="text-align:right">₹${item.sgst.toLocaleString('en-IN')}</td><td>—</td>`
        : `<td>—</td><td>—</td><td style="text-align:right">₹${item.igst.toLocaleString('en-IN')}</td>`
      }
    </tr>`).join('');

  const total = inv.items.reduce((s, i) => s + i.amount, 0);
  const totalGST = inv.items.reduce((s, i) => s + i.cgst + i.sgst + i.igst, 0);

  const html = `<!DOCTYPE html><html><head><title>Invoice — ${inv.invoice_no}</title>
<style>
  body{font-family:Arial,sans-serif;font-size:10px;padding:20px}
  table{width:100%;border-collapse:collapse}th{background:#0f172a;color:#fff;padding:6px;font-size:9px}
  td{padding:6px;border:1px solid #e2e8f0}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div style="display:flex;justify-content:space-between;margin-bottom:16px">
  <div><strong>${COMPANY.name}</strong><br/>GSTIN: ${COMPANY.gstin}<br/>${COMPANY.address}, ${COMPANY.city} — ${COMPANY.pincode}</div>
  <div style="text-align:right"><strong>TAX INVOICE</strong><br/>No: ${inv.invoice_no}<br/>Date: ${fmtDate(inv.date)}${inv.irn ? `<br/>IRN: ${inv.irn}` : ''}</div>
</div>
<div style="background:#f8fafc;padding:10px;margin-bottom:12px">
  <strong>Billed To:</strong> ${inv.site}<br/>
  ${site ? `${site.address}, ${site.city} — ${site.pincode}<br/>GSTIN: ${site.gstin || 'N/A'}` : ''}
</div>
<table>
  <thead><tr><th>#</th><th>Description</th><th>HSN/SAC</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th><th>GST%</th><th>CGST</th><th>SGST</th><th>IGST</th></tr></thead>
  <tbody>${rows}</tbody>
  <tfoot>
    <tr><td colspan="6" style="text-align:right;font-weight:700">Taxable Amount</td><td colspan="5">₹${total.toLocaleString('en-IN')}</td></tr>
    <tr><td colspan="6" style="text-align:right;font-weight:700">Total GST</td><td colspan="5">₹${totalGST.toLocaleString('en-IN')}</td></tr>
    <tr style="background:#f0fdf4"><td colspan="6" style="text-align:right;font-weight:800">Grand Total</td><td colspan="5" style="font-weight:800">₹${(total + totalGST).toLocaleString('en-IN')}</td></tr>
    <tr><td colspan="11">${amountInWords(total + totalGST)}</td></tr>
  </tfoot>
</table>
<div style="margin-top:40px;text-align:right"><div style="border-top:1px solid #000;padding-top:4px;width:200px;display:inline-block">Authorised Signatory<br/>${COMPANY.name}</div></div>
</body></html>`;
  openPrint(html);
}
