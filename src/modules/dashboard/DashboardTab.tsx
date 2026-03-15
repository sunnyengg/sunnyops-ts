import React, { useEffect, useState } from 'react';
import { db } from '@/config/supabase';
import { Spinner } from '@/components/ui/Spinner';
import { fmtINR, fmtNum } from '@/utils/formatters';
import type { Bill, Payable } from '@/types/bill.types';

interface Props {
  assignedSites?: string[];
  isDirector: boolean;
  isAdmin: boolean;
  uName: string;
  userRole: string;
  getPerm: (p: string) => boolean;
  showToast: (msg: string, type?: 'ok' | 'err') => void;
}

export const DashboardTab: React.FC<Props> = ({ assignedSites }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [payables, setPayables] = useState<Payable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      db.from('bills').select('*'),
      db.from('payables').select('*'),
    ]).then(([b, p]) => {
      let billData = b.data ?? [];
      let payData = p.data ?? [];
      if (assignedSites?.length) {
        billData = billData.filter(x => assignedSites.includes(x.site));
        payData = payData.filter(x => assignedSites.includes(x.site));
      }
      setBills(billData);
      setPayables(payData);
      setLoading(false);
    });
  }, [assignedSites?.join(',')]);

  if (loading) return <Spinner />;

  const totalReceivable = bills.reduce((s, b) => s + (b.net_receivable - b.received_amount), 0);
  const totalPayable = payables.reduce((s, p) => s + (p.amount - p.paid_amount), 0);
  const totalBilled = bills.reduce((s, b) => s + b.gross_amount, 0);
  const totalPaid = bills.reduce((s, b) => s + b.received_amount, 0);

  // Site-wise summary
  const sites = [...new Set(bills.map(b => b.site))];
  const siteData = sites.map(site => {
    const sb = bills.filter(b => b.site === site);
    const sp = payables.filter(p => p.site === site);
    return {
      site,
      billed: sb.reduce((s, b) => s + b.gross_amount, 0),
      received: sb.reduce((s, b) => s + b.received_amount, 0),
      payable: sp.reduce((s, p) => s + (p.amount - p.paid_amount), 0),
    };
  }).sort((a, b) => b.billed - a.billed);

  return (
    <div>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Billed', val: fmtINR(totalBilled), color: '#1d4ed8', bg: '#eff6ff', br: '#bfdbfe' },
          { label: 'Received', val: fmtINR(totalPaid), color: '#15803d', bg: '#f0fdf4', br: '#bbf7d0' },
          { label: 'Outstanding', val: fmtINR(totalReceivable), color: '#dc2626', bg: '#fef2f2', br: '#fecaca' },
          { label: 'Payable', val: fmtINR(totalPayable), color: '#d97706', bg: '#fffbeb', br: '#fcd34d' },
        ].map(card => (
          <div key={card.label} style={{ background: card.bg, border: `1px solid ${card.br}`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: card.color, fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1 }}>{card.val}</div>
            <div style={{ fontSize: 10, color: card.color, marginTop: 6, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: 1, fontWeight: 700 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Site-wise table */}
      {siteData.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, fontSize: 11, color: '#64748b', letterSpacing: 2 }}>SITE-WISE SUMMARY</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Site', 'Billed', 'Received', 'Outstanding', 'Payable'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Site' ? 'left' : 'right', fontSize: 9, color: '#64748b', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: 1, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {siteData.map(s => (
                <tr key={s.site} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{s.site}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace' }}>{fmtINR(s.billed)}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace', color: '#16a34a' }}>{fmtINR(s.received)}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace', color: s.billed - s.received > 0 ? '#dc2626' : '#16a34a' }}>{fmtINR(s.billed - s.received)}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace', color: '#d97706' }}>{fmtINR(s.payable)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                <td style={{ padding: '12px 14px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11 }}>TOTAL</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace' }}>{fmtINR(totalBilled)}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace', color: '#16a34a' }}>{fmtINR(totalPaid)}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace', color: '#dc2626' }}>{fmtINR(totalReceivable)}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace', color: '#d97706' }}>{fmtINR(totalPayable)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Bills status breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {[
          { label: 'Pending Bills', val: bills.filter(b => b.status === 'Pending').length, color: '#d97706' },
          { label: 'Partially Paid', val: bills.filter(b => b.status === 'Partial').length, color: '#1d4ed8' },
          { label: 'Fully Paid', val: bills.filter(b => b.status === 'Paid').length, color: '#16a34a' },
          { label: 'Pending Payables', val: payables.filter(p => p.status !== 'Paid').length, color: '#dc2626' },
        ].map(s => (
          <div key={s.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '14px 18px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'IBM Plex Mono, monospace', color: s.color }}>{fmtNum(s.val)}</div>
            <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'IBM Plex Mono, monospace', marginTop: 4, letterSpacing: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
