const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const products = {
  spa_rood: { amount: "2.50", description: "3B · Spa rood voor straks" },
  bitterballen: { amount: "8.00", description: "3B · Rondje bitterballen" },
} as const;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const mollieKey = Deno.env.get("MOLLIE_API_KEY");
  const returnUrl = Deno.env.get("PAYMENT_RETURN_URL") || "https://kruin.github.io/3b/";
  if (!mollieKey) return json({ error: "payment_not_configured" }, 503);

  let item = "";
  try {
    item = String((await request.json())?.item || "");
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const product = products[item as keyof typeof products];
  if (!product) return json({ error: "unknown_item" }, 400);

  const response = await fetch("https://api.mollie.com/v2/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${mollieKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: { currency: "EUR", value: product.amount },
      description: product.description,
      redirectUrl: returnUrl,
      metadata: { item, application: "3B" },
    }),
  });
  const payment = await response.json();
  if (!response.ok) return json({ error: "mollie_rejected_payment" }, 502);
  const checkoutUrl = payment?._links?.checkout?.href;
  if (!checkoutUrl) return json({ error: "missing_checkout_url" }, 502);
  return json({ checkout_url: checkoutUrl });
});
