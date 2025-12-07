import { settlePayment, facilitator } from "thirdweb/x402";
import { createThirdwebClient } from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";
import { USDC_FUJI_ADDRESS, PAYMENT_AMOUNTS, API_ENDPOINTS } from "@/lib/constants";

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

const thirdwebFacilitator = facilitator({
  client,
  serverWalletAddress: process.env.THIRDWEB_SERVER_WALLET_ADDRESS!,
});

export async function GET(request: Request) {
  const paymentData = request.headers.get("x-payment");

  const result = await settlePayment({
    resourceUrl: API_ENDPOINTS.ENTERPRISE,
    method: "GET",
    paymentData,
    payTo: process.env.MERCHANT_WALLET_ADDRESS!,
    network: avalancheFuji,
    price: {
      amount: PAYMENT_AMOUNTS.ENTERPRISE.amount,
      asset: {
        address: USDC_FUJI_ADDRESS,
      },
    },
    facilitator: thirdwebFacilitator,
  });

  if (result.status === 200) {
    return Response.json({
      tier: "enterprise",
      data: "Enterprise envelope cleared: AI NISA vault focus unlocked.",
      features: [
        "Priority settlement window",
        "AI NISA vault boost (simulated)",
        "Full Smart Envelope logs",
      ],
      timestamp: new Date().toISOString(),
    });
  } else {
    return Response.json(result.responseBody, {
      status: result.status,
      headers: result.responseHeaders,
    });
  }
}
