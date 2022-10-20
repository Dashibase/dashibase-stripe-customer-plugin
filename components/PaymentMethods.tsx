export default function PaymentMethods({ cards }) {
  
  return (
    <>
      <h2 className="mt-5 mb-2">
        Payment Methods
      </h2>
      {cards.length ? (
      <>
        {
          cards.map(card => (
            <div
              className="px-5 py-2 mb-2 border border-indigo-200 rounded" key={card.id}
            >
              <div className="flex items-center">
                <p className="pb-1 text-base font-normal">
                  {"···· " + card.card.last4}
                </p>
                <span className="px-2 py-1 ml-3 font-mono text-xs text-indigo-500 rounded bg-indigo-50">
                  {card.card.brand}
                </span>
                <span className="px-2 py-1 ml-3 font-mono text-xs text-indigo-500 rounded bg-indigo-50">
                  {card.card.funding}
                </span>
              </div>
              <p className="text-sm font-light text-neutral-400">
                {"Expires " + card.card.exp_month + "/" + card.card.exp_year}
              </p>
            </div>
          ))
        }
      </>
      ) : (
        <p className="font-light text-neutral-400">No payment methods.</p>
      )}
    </>
  )
}
