import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import CustomerCard from '../components/CustomerCard'
import PaymentMethods from '../components/PaymentMethods'
import Subscriptions from '../components/Subscriptions'
import { getTime } from "../utils/functions";

const Home: NextPage = () => {
  const [customerId, setCustomerId] = useState()
  const [customer, setCustomer] = useState<any>({})
  const [cards, setCards] = useState([])
  const [loadingCustomer, setLoadingCustomer] = useState(true)
  const [loadingCards, setLoadingCards] = useState(true)
  const [error, setError] = useState<any>()

  function onReceiveMessage(event: MessageEvent) {
    if (event.origin === "http://localhost:5173") {
      const message = event.data
      switch (message.type) {
        case "SETUP":
          setCustomerId(message.data.customerId)
          break;
      }
    }
  }

  useEffect(() => {
    window.addEventListener("message", onReceiveMessage)
    return () => window.removeEventListener("message", onReceiveMessage)
  }, [])

  useEffect(() => {
    if (!customerId) return;
    
    fetch(`/api/customer?customerId=${customerId}`)
      .then(resp => resp.json())
      .then(data => {
        if (!data.error) {
          setCustomer(data)
          setLoadingCustomer(false)
        } else {
          setError(data.error)
        }
      })

    fetch(`/api/cards?customerId=${customerId}`)
      .then(resp => resp.json())
      .then(data => {
        if (!data.error) {
          setCards(data.data)
          setLoadingCards(false)
        }
      })
  }, [customerId])

  if (error) {
    return (
      <div className="h-[100vh] flex items-center text-center bg-red-200">
        <div className="w-2/3 p-10 mx-auto text-red-600 border-2 border-red-400 rounded">
          <span className="block py-1 mb-4 font-mono text-xs text-white bg-red-600 rounded">
            {error.raw.statusCode}
          </span>
          <p className="font-semibold">
            {error.raw.message}
          </p>
          <p className="font-mono text-sm font-light">
            {error.raw.code}
          </p>
        </div>
      </div>
    )
  }
  
  if (loadingCustomer || loadingCards) {
    return (
      <div className="p-5 animate-pulse">
        <div
          className="px-5 py-3 mb-5 text-indigo-500 border border-indigo-200 rounded bg-gradient-to-t from-indigo-50"
        >
          <div className="h-5 mb-3 bg-indigo-200 rounded" />
          <div className="w-2/3 h-5 bg-indigo-100 rounded" />
        </div>

        <div
          className="flex flex-col justify-center px-5 py-2 mb-2 border border-indigo-200 rounded items"
        >
          <div className="flex">
            <div className="w-3/5 h-5 mb-3 bg-indigo-200 rounded" />
            <div className="w-1/5 h-5 mb-3 ml-3 rounded bg-indigo-50" />
          </div>
          <div className="w-1/3 h-5 mb-1 bg-indigo-100 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-5">
      <CustomerCard customer={customer} />
      
      <PaymentMethods cards={cards} />

      <Subscriptions subscriptions={customer.subscriptions.data} />

      <p className="my-5 text-black">
        <span className="font-light">Customer since: </span>{getTime(customer.created*1000)}
      </p>
    </div>
  )
}

export default Home
