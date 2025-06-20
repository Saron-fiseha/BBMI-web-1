import Stripe from "stripe"

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export default stripe

// Payment utilities
export async function createPaymentIntent(amount: number, courseId: string, userId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      metadata: {
        courseId,
        userId,
      },
    })
    return paymentIntent
  } catch (error) {
    console.error("Stripe payment intent error:", error)
    throw error
  }
}

export async function confirmPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error("Stripe payment confirmation error:", error)
    throw error
  }
}
