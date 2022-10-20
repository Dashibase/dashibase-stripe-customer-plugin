export default function CustomerCard({ customer }) {
  return (
    <div className="px-5 py-3 text-indigo-500 border border-indigo-200 rounded bg-gradient-to-t from-indigo-50">
      <p className="text-xl font-bold">
        {customer.name ? customer.name : "Stripe customer"}
      </p>
      <p className="font-light">
        {customer.email ? customer.email : "No email attached"}
      </p>
    </div>
  )
}
