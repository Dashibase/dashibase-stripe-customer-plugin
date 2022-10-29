# Stripe customer plugin for Dashibase

![Dashibase Stripe customer plugin](https://user-images.githubusercontent.com/37393381/198848637-f9e151fd-88b8-4914-a9a8-b0832a6f2519.png)

Dashibase lets you build internal admin dashboards using a Notion-like UI.

You can extend the functionality of your dashboards by developing a plugin. For example, you could display each customer's Stripe information, show support tickets from Zendesk, send emails via SendGrid, and more.

This is one such plugin that displays each customer's Stripe information. It is ready to be deployed and used within your own dashboards. You can also fork and customize this to meet your requirements!

## Getting Started

### 1. Set up a dashboard in Dashibase

You can skip this step if you already have a dashboard in Dashibase.

If not, you can sign up for free [here](https://dashibase.com). After you have created a dashboard and added a table from your database, click into any of the items on your table. Here is where we will add the plugin.

### 2. Clone and deploy this repo

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDashibase%2Fdashibase-stripe-customer-plugin&env=STRIPE_SECRET_KEY&envDescription=Stripe%20secret%20key%20is%20needed%20to%20fetch%20customer%20information%20from%20Stripe)

Easily deploy this plugin yourself by clicking the button. You will be asked to enter your Stripe secret key for the `STRIPE_SECRET_KEY` environment variable.

### 3. Add plugin to your dashboard

Go back to your dashboard in Dashibase. While viewing any of the items on a table, add a Plugin block by typing '/plugin'. Then, add the URL of your deployed plugin and click "Set up".

You should see the a dropdown for selecting the column in your table which contains users' Stripe customer IDs. After selecting the column and saving your dashboard, you should be able to see each user's Stripe information.

If you have any questions, feel free to reach us via Twitter ([@dashibase](https://twitter.com/dashibase)) or sk@dashibase.com.

## Learn More

You might find the following resources helpful:

- [Hello World Next.js plugin tutorial](https://dashibase.com/docs/hello-world-nextjs-plugin/)
- [Plugin API reference](https://dashibase.com/docs/plugin-api-reference)
