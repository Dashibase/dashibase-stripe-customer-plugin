export const getTime = (timestamp: number) => {
   const date = new Date(timestamp)
   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
   return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
 }

export const getCurrencySymbol = (currency: string) => {
  const currencySymbols = {
    'usd': '$', // US Dollar
    'eur': '€', // Euro
    'crc': '₡', // Costa Rican Colón
    'gbp': '£', // British Pound Sterling
    'ils': '₪', // Israeli New Sheqel
    'inr': '₹', // Indian Rupee
    'jpy': '¥', // Japanese Yen
    'krw': '₩', // South Korean Won
    'ngn': '₦', // Nigerian Naira
    'php': '₱', // Philippine Peso
    'pln': 'zł', // Polish Zloty
    'pyg': '₲', // Paraguayan Guarani
    'thb': '฿', // Thai Baht
    'uah': '₴', // Ukrainian Hryvnia
    'vnd': '₫', // Vietnamese Dong
  };
  
  if (currencySymbols[currency]) {
      return currencySymbols[currency];
  } else {
    return currency
  }
}

export const getInterval = (interval: string) => {
  let string = ''
  switch (interval) {
    case 'day':
      string = 'day'
      break;
    case 'week':
      string = 'wk'
      break;
    case 'month':
      string = 'mo'
      break;
    case 'year':
      string = 'yr'
      break;
  }

  return string
}
