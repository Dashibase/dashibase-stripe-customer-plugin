export const getTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
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
