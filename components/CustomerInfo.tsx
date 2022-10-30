export default function CustomerInfo({ customer }) {
  return (
    <div className="flex items-center justify-between py-4 rounded">
      <div>
        <p className="text-3xl font-semibold">
          {customer.name ? customer.name : "Stripe customer"}
        </p>
      </div>
      <a href={`https://dashboard.stripe.com/customers/${customer.id}`} target="_blank" rel="noreferrer">
        <button className="px-3 py-2 text-sm text-white bg-indigo-500 rounded">
          View in Stripe
        </button>
      </a>
    </div>
  )
}
