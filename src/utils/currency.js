// src/utils/currency.js

// Reusable INR formatter with Indian grouping and no fractional digits by default
const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Formats a value in INR (₹) with Indian digit grouping.
 * - Accepts string/number; non-finite values return '₹0'.
 * - Set options.fractionDigits to control decimals (default 0).
 */
export function formatINR(value, options = {}) {
  const { fractionDigits } = options;
  const num = Number(value);
  if (!Number.isFinite(num)) return '₹0';

  if (typeof fractionDigits === 'number') {
    const fmt = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    return fmt.format(num);
  }

  return INR_FORMATTER.format(num);
}

/**
 * Parses to number safely; returns 0 for invalid values.
 */
export function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export default { formatINR, toNumber };
