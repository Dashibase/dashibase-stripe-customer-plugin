import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import Dropdown from '../components/Dropdown'
import CustomerInfo from '../components/CustomerInfo'
import Subscriptions from '../components/Subscriptions'
//import PluginClient from '@dashibase/plugin-client'

import type PluginClient from '@dashibase/plugin-client'
interface columnIdOption {
  name: string
}

const Home: NextPage = () => {
  const clientInitialized = useRef(false)
  const client = useRef<PluginClient>()
  const [options, setOptions] = useState<columnIdOption[]>([])    // Store columnIds for populating dropdown
  const [columnId, setColumnId] = useState<columnIdOption>()      // Store column selected by user
  const [setupRequired, setSetupRequired] = useState(false)       // Check whether plugin has finished setup

  const [customerId, setCustomerId] = useState()
  const [customer, setCustomer] = useState<any>()
  const [subscriptions, setSubscriptions] = useState<any>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>()

  async function importClient () {
    const PluginClient = (await import('@dashibase/plugin-client')).default
    client.current = new PluginClient()

    // Setup plugin
    client.current.onSetup((data) => {
      if (!data || !data.store) return;

      if (data.store.stripeColumnId) {
        // Get stripe customer ID
        const storedColumnId = data.store.stripeColumnId 
        getStripeCustomerId(storedColumnId)
      } else {
        // Show dropdown for plugin setup
        setSetupRequired(true)
        if (data.columnIds.length) {
          setColumnId({ name: data.columnIds[0] })
          setOptions(data.columnIds.map(col => ({ name: col })))
        }
      }
    })

    // Send setup request to Dashibase
    client.current.init()
  }

  function handleSave () {
    client.current.store("stripeColumnId", columnId.name)
      .then((response) => {
        const columnId = response.value
        getStripeCustomerId(columnId)
      })
  }

  function getStripeCustomerId (key: string) {
    console.log("request stripe customer id")
    client.current.request(key)
      .then((response) => {
        const stripeCustomerId = response.value
        setCustomerId(stripeCustomerId)
        setSetupRequired(false)
      })
  }

  useEffect(() => {
    if (clientInitialized.current === false) {
      clientInitialized.current = true
      importClient()
    }
  }, [])

  /*
  useEffect(() => {
    if (!customerId) return;
    
    setLoading(true)
    fetch(`/api/customer?customerId=${customerId}`)
      .then(resp => resp.json())
      .then(data => {
        if (!data.error) {
          setCustomer(data.customer)
          setSubscriptions(data.subscriptions)
          setLoading(false)
        } else {
          setError(data.error)
        }
      })
  }, [customerId])
  */

  if (setupRequired) {
    return (
      <div className="z-0 p-5 text-right">
        <Dropdown options={options} columnId={columnId} setColumnId={setColumnId} />
        <button onClick={handleSave} className="flex items-center px-3 py-1 mt-5 text-sm text-white bg-indigo-400 rounded justify-evenly">
          Save
        </button>
    </div>
    )
  }

  /*
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
  */
  
  if (loading) {
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
  /*

  return (
    <div className="px-10 py-5">
      <CustomerInfo customer={customer} />
      <Subscriptions subscriptions={subscriptions.data} />
    </div>
  )
  */

}

export default Home
