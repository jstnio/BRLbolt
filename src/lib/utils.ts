import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'react-hot-toast';
import { isValid, format as formatDateFns } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (error: any) => {
  const message = error?.message || 'An error occurred';
  toast.error(message);
};

export const formatCurrency = (amount: number | string | undefined, currency: string = 'USD') => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (typeof numericAmount !== 'number' || isNaN(numericAmount)) {
    return `${currency} 0.00`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(numericAmount);
};

export const formatNumber = (value: number | string | undefined, decimals: number = 2): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (typeof numericValue !== 'number' || isNaN(numericValue)) {
    return '0.00';
  }
  return numericValue.toFixed(decimals);
};

export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return 'Not set';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isValid(dateObj) ? formatDateFns(dateObj, 'PPp') : 'Invalid date';
};

export const formatShortDate = (date: string | Date | undefined): string => {
  if (!date) return 'Not set';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isValid(dateObj) ? formatDateFns(dateObj, 'PP') : 'Invalid date';
};