import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-08-01'
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = new URL(req.url as string, 'http://localhost:3000')
  const searchParams = new URLSearchParams(url.search)
  const params = new Proxy(searchParams, {
    get: (searchParams, prop) => searchParams.get(prop as string),
  })
  const { customerId } = params as any

  try {
    const customer = await stripe.customers.retrieve(customerId, {
      expand: ['sources']
    });
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      expand: ['data.plan.product']

    })
    res.status(200).json({ customer, subscriptions })
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      res.status(error.statusCode ? error.statusCode : 400).json({ error })
    }
  }
}

