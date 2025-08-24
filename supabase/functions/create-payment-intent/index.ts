import { corsHeaders } from '../_shared/cors.ts'

interface PaymentRequest {
  amount: number
  currency: string
  metadata?: any
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { amount, currency = 'usd', metadata }: PaymentRequest = await req.json()

    // Here you would integrate with Stripe API
    // For demo purposes, we'll return a mock payment intent
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: 'requires_payment_method'
    }

    return new Response(
      JSON.stringify(paymentIntent),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})