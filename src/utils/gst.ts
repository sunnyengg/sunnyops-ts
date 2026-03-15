import { OUR_STATE_CODE } from '@/config/constants';

/** Returns true if client GSTIN is from a different state (triggers IGST) */
export function isInterState(clientGstin: string | undefined | null): boolean {
  if (!clientGstin || clientGstin.length < 2) return false;
  return clientGstin.substring(0, 2) !== OUR_STATE_CODE;
}

export interface GSTBreakdown {
  base: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

/** Calculate GST breakdown based on inter/intra state */
export function calcGST(baseAmount: number, rate: number, clientGstin?: string): GSTBreakdown {
  const gstAmt = parseFloat(((baseAmount * rate) / 100).toFixed(2));
  if (isInterState(clientGstin)) {
    return { base: baseAmount, cgst: 0, sgst: 0, igst: gstAmt, total: baseAmount + gstAmt };
  }
  const half = parseFloat((gstAmt / 2).toFixed(2));
  return { base: baseAmount, cgst: half, sgst: half, igst: 0, total: baseAmount + gstAmt };
}

/** Amount in words — Indian number system */
export function amountInWords(amount: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(n: number): string {
    if (n === 0) return '';
    if (n < 20) return ones[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + ' ' + ones[n % 10] + ' ';
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred ' + convert(n % 100);
    if (n < 100000) return convert(Math.floor(n / 1000)) + 'Thousand ' + convert(n % 1000);
    if (n < 10000000) return convert(Math.floor(n / 100000)) + 'Lakh ' + convert(n % 100000);
    return convert(Math.floor(n / 10000000)) + 'Crore ' + convert(n % 10000000);
  }

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let result = convert(rupees).trim();
  if (!result) result = 'Zero';
  result += ' Rupees';
  if (paise > 0) result += ' and ' + convert(paise).trim() + ' Paise';
  result += ' Only';
  return result;
}
