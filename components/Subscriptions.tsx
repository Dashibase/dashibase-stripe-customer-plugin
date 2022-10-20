import { getCurrencySymbol, getTime } from '../utils/functions'

export default function Subscriptions({ subscriptions }) {
  return (
    <>
      <h2 className="mt-5 mb-2">
        Subscriptions
      </h2>
      {subscriptions.length ? (
      <>
        {
          subscriptions.map(s => (
            <div
              className="px-5 py-2 mb-2 border border-indigo-200 rounded" key={s.id}
            >
              <div className="flex items-center">
                <p className="pb-1 text-base font-normal">
                  {`${getCurrencySymbol(s.plan.currency)} ${s.plan.amount/100} / ${s.plan.interval}`}
                </p>
                <span className={`ml-3 px-2 py-1 font-mono ${s.status === 'active' ? 'bg-lime-100 text-lime-600' : 'bg-neutral-200 text-neutral-500'} rounded text-xs`}>
                  {s.status}
                </span>
              </div>
              <p className="text-sm font-light text-neutral-400">
                {`Started ${getTime(s.start_date*1000)} • Next invoice ${getTime(s.current_period_end*1000)}`}
              </p>
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
