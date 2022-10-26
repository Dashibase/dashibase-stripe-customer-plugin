import { getCurrencySymbol, getInterval, getTime } from '../utils/functions'

export default function Subscriptions({ subscriptions }) {
  return (
    <>
      {subscriptions.length ? (
      <>
        {
          subscriptions.map(s => (
            <div
              className="flex items-center justify-between px-4 py-3 mb-2 border border-gray-200 rounded" key={s.id}
            >
              <div>
                <div className="flex items-center mb-1">
                  <p className="text-base">
                    {s.plan.product.name}
                  </p>
                  <span className={`ml-3 px-2 ${s.status === 'active' ? 'bg-lime-100 text-lime-700' : 'bg-neutral-200 text-neutral-500'} rounded text-xs`}>
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </div>

                {s.status === 'canceled' ? (
                  <p className="text-sm text-gray-400">
                    {`Subscription ended: ${getTime(s.ended_at*1000)}`}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">
                    {`Subscription started: ${getTime(s.start_date*1000)}`}
                  </p>
                )}
              </div>
              <SubscriptionPlan subscription={s} />
            </div>
          ))
        }
      </>
      ) : (
        <p className="font-light text-neutral-400">No subscription.</p>
      )}
    </>
  )
}

function SubscriptionPlan({ subscription }) {
  return (
    <p className="pb-1 text-base font-normal">
      <span className="text-xl font-semibold">
        {`${getCurrencySymbol(subscription.plan.currency)} ${subscription.plan.amount/100}`}
      </span>
      {` / ${getInterval(subscription.plan.interval)}`}
    </p>
  )
}
