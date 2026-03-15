import React, { useEffect, useState } from 'react';
import { useBills } from '@/hooks/useBills';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { fmtINR, fmtDate } from '@/utils/formatters';
import { DEFAULT_SITE_DETAILS } from '@/config/constants';
import type { Bill, BillStatus } from '@/types/bill.types';
import type { UserRole } from '@/types/user.types';

interface Props {
  isAdmin: boolean;
  uName: string;
  userRole: UserRole;
  assignedSites?: string[];
  showToast: (msg: string, type?: 'ok' | 'err') => void;
}

const SITES = DEFAULT_SITE_DETAILS.map(s => s.name);
const blank: Omit<Bill, 'id' | 'created_at'> = {
  site: 'MRPL', bill_no: '', date: new Date().toISOString().slice(0, 10),
  description: '', gross_amount: 0, gst_amount: 0, sd_amount: 0,
  gst_hold: 0, net_receivable: 0, received_amount: 0,
  wo_no: '', status: 'Pending', remarks: '',
};

export const BillsTab: React.FC<Props> = ({ isAdmin, uName, assignedSites, showToast }) => {
  const { bills, loading, fetch, save, remove } = useBills(assignedSites);
  const [search, setSearch] = useState('');
  const [siteFilter, setSiteFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modal, setModal] = useState<{ type: 'add' | 'edit' | 'view'; bill?: Bill } | null>(null);
  const [form, setForm] = useState<Omit<Bill, 'id' | 'created_at'>>(blank);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = bills.filter(b => {
    const s = !search || b.bill_no.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase());
    const si = siteFilter === 'All' || b.site === siteFilter;
    const st = statusFilter === 'All' || b.status === statusFilter;
    return s && si && st;
  });

  const sf = (k: keyof typeof form, v: string | number) => {
    setForm(p => {
      const updated = { ...p, [k]: v };
      // Auto-calc net receivable
      if (['gross_amount', 'gst_amount', 'sd_amount', 'gst_hold'].includes(k as string)) {
        updated.net_receivable = (Number(updated.gross_amount) + Number(updated.gst_amount)) - Number(updated.sd_amount) - Number(updated.gst_hold);
      }
      return updated;
    });
  };

  const handleSave = async () => {
    if (!form.bill_no.trim()) return showToast('Bill number required', 'err');
    setSaving(true);
    const err = await save({ ...form, updated_by: uName }, modal?.bill?.id);
    setSaving(false);
    if (err) return showToast(err, 'err');
    showToast(`Bill ${modal?.type === 'edit' ? 'updated' : 'added'}`);
    setModal(null);
  };

  const statusColor: Record<BillStatus, { bg: string; c: string }> = {
    Pending: { bg: '#fffbeb', c: '#d97706' },
    Partial: { bg: '#eff6ff', c: '#1d4ed8' },
    Paid:    { bg: '#f0fdf4', c: '#16a34a' },
  };

  if (loading) return <Spinner />;

  const totalPending = filtered.filter(b => b.status !== 'Paid').reduce((s, b) => s + (b.net_receivable - b.received_amount), 0);
  const totalBilled = filtered.reduce((s, b) => s + b.gross_amount, 0);

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          ['Total Billed', fmtINR(totalBilled), '#1d4ed8'],
          ['Outstanding', fmtINR(totalPending), '#dc2626'],
          ['Bills', String(filtered.length), '#0f172a'],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 20px', flex: 1, minWidth: 110 }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'IBM Plex Mono, monospace', color: c }}>{v}</div>
            <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'IBM Plex Mono, monospace' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder="Search bill no / desc..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, minWidth: 180 }} />
          <select value={siteFilter} onChange={e => setSiteFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, background: '#f8fafc' }}>
            <option>All</option>
            {SITES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, background: '#f8fafc' }}>
            {['All', 'Pending', 'Partial', 'Paid'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        {isAdmin && <Button onClick={() => { setForm({ ...blank }); setModal({ type: 'add' }); }}>+ Add Bill</Button>}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Bill No', 'Site', 'Date', 'Description', 'Gross', 'Net Recv.', 'Received', 'Balance', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Bill No' || h === 'Site' || h === 'Description' || h === '' ? 'left' : 'right', fontSize: 9, color: '#64748b', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: 1, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={10} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>No bills found</td></tr>
              : filtered.map(bill => {
                const balance = bill.net_receivable - bill.received_amount;
                const sc = statusColor[bill.status];
                return (
                  <tr key={bill.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                    onClick={() => setModal({ type: 'view', bill })}>
                    <td style={{ padding: '12px 14px', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700 }}>{bill.bill_no}</td>
                    <td style={{ padding: '12px 14px' }}><span style={{ background: '#f1f5f9', color: '#475569', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700 }}>{bill.site}</span></td>
                    <td style={{ padding: '12px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>{fmtDate(bill.date)}</td>
                    <td style={{ padding: '12px 14px', color: '#475569', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bill.description}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace' }}>{fmtINR(bill.gross_amount)}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace' }}>{fmtINR(bill.net_receivable)}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace', color: '#16a34a' }}>{fmtINR(bill.received_amount)}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace', color: balance > 0 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>{fmtINR(balance)}</td>
                    <td style={{ padding: '12px 14px' }}><span style={{ background: sc.bg, color: sc.c, borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 700 }}>{bill.status}</span></td>
                    <td style={{ padding: '12px 14px' }} onClick={e => e.stopPropagation()}>
                      {isAdmin && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Button variant="info" style={{ fontSize: 9, padding: '3px 8px' }} onClick={() => { setForm({ ...bill }); setModal({ type: 'edit', bill }); }}>✎</Button>
                          <Button variant="danger" style={{ fontSize: 9, padding: '3px 8px' }} onClick={async () => { if (confirm('Delete bill?')) { const err = await remove(bill.id); err ? showToast(err, 'err') : showToast('Bill deleted'); } }}>✕</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal && modal.type !== 'view' && (
        <Modal title={modal.type === 'edit' ? 'Edit Bill' : 'Add Bill'} wide onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {([
              ['Site', 'site', 'select', SITES],
              ['Bill No *', 'bill_no', 'text'],
              ['Date', 'date', 'date'],
              ['W.O. No', 'wo_no', 'text'],
              ['Description', 'description', 'text', null, true],
              ['Gross Amount', 'gross_amount', 'number'],
              ['GST Amount', 'gst_amount', 'number'],
              ['SD Amount', 'sd_amount', 'number'],
              ['GST Hold', 'gst_hold', 'number'],
              ['Net Receivable', 'net_receivable', 'number'],
              ['Received Amount', 'received_amount', 'number'],
              ['Status', 'status', 'select', ['Pending', 'Partial', 'Paid']],
              ['Remarks', 'remarks', 'text', null, true],
            ] as Array<[string, keyof typeof form, string, string[] | null | undefined, boolean?]>).map(([label, key, type, opts, span]) => (
              <div key={key} style={span ? { gridColumn: '1/-1' } : {}}>
                <label style={{ fontSize: 10, color: '#64748b', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: 1, display: 'block', marginBottom: 4 }}>{label.toUpperCase()}</label>
                {type === 'select' && opts ? (
                  <select value={form[key] as string} onChange={e => sf(key, e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, background: '#f8fafc' }}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={type} value={form[key] as string | number}
                    onChange={e => sf(key, type === 'number' ? Number(e.target.value) : e.target.value)}
                    readOnly={key === 'net_receivable'}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, boxSizing: 'border-box', background: key === 'net_receivable' ? '#f0fdf4' : '#fff' }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Button onClick={handleSave} loading={saving} style={{ flex: 1, padding: '11px 0' }}>
              {modal.type === 'edit' ? '✓ Save Changes' : '+ Add Bill'}
            </Button>
            <Button variant="ghost" onClick={() => setModal(null)} style={{ flex: 1, padding: '11px 0' }}>Cancel</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
