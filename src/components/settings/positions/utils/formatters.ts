export const formatPayType = (type: string) => {
  switch (type) {
    case 'hourly':
      return 'per hour';
    case 'salary':
      return 'per year';
    case 'session':
      return 'per session';
    default:
      return '';
  }
};

export const formatPayRate = (rate: number | null | undefined) => {
  if (rate === null || rate === undefined) return '0';
  try {
    return rate.toLocaleString();
  } catch (error) {
    console.error('Error formatting pay rate:', error);
    return '0';
  }
};