"use client";

import { useState, useEffect } from "react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveWallet, useActiveAccount } from "thirdweb/react";
import { wrapFetchWithPayment } from "thirdweb/x402";
import { PaymentCard } from "@/components/payment-card";
import { ContentDisplay } from "@/components/content-display";
import { TransactionLog, LogEntry } from "@/components/transaction-log";
import { SmartEnvelopeList, SmartEnvelope, SmartEnvelopeStatus } from "@/components/smart-envelope-list";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createNormalizedFetch } from "@/lib/payment";
import { balanceRailAgent } from "@/lib/agentConfig";
import { AVALANCHE_FUJI_CHAIN_ID, PAYMENT_AMOUNTS, API_ENDPOINTS, TOKEN_DISPLAY_NAME } from "@/lib/constants";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

interface ContentData {
  tier: string;
  data: string;
  features?: string[];
  timestamp: string;
}

type TierKey = "basic" | "premium" | "enterprise";

const VAULT_ALLOCATION_RATE = 0.015; // 1.5% simulated allocation to AI NISA vault

const TIER_CONFIG: Record<
  TierKey,
  {
    label: string;
    description: string;
    priceDisplay: string;
    amountSmallestUnit: bigint;
    api: string;
    badge?: string;
  }
> = {
  basic: {
    label: "Basic",
    description: "Daily spend (coffee / transit-level)",
    priceDisplay: "0.01",
    amountSmallestUnit: PAYMENT_AMOUNTS.BASIC.bigInt,
    api: API_ENDPOINTS.BASIC,
    badge: "Daily",
  },
  premium: {
    label: "Premium",
    description: "Subscription bundle",
    priceDisplay: "0.15",
    amountSmallestUnit: PAYMENT_AMOUNTS.PREMIUM.bigInt,
    api: API_ENDPOINTS.PREMIUM,
    badge: "Recurring",
  },
  enterprise: {
    label: "Enterprise",
    description: "AI NISA vault focus",
    priceDisplay: "0.50",
    amountSmallestUnit: PAYMENT_AMOUNTS.ENTERPRISE.bigInt,
    api: API_ENDPOINTS.ENTERPRISE,
    badge: "AI NISA",
  },
};

const smallestToUnit = (amount: bigint) => Number(amount) / 1_000_000;

export default function Home() {
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const [content, setContent] = useState<ContentData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaying, setIsPaying] = useState(false);
  const [envelopes, setEnvelopes] = useState<SmartEnvelope[]>([]);
  const [vaultBalance, setVaultBalance] = useState(0);

  useEffect(() => {
    setLogs([]);
    setContent(null);
    setEnvelopes([]);
    setVaultBalance(0);
  }, [wallet, account?.address]);

  const addLog = (message: string, type: LogEntry["type"]) => {
    setLogs((prev) => [...prev, { message, type, timestamp: new Date() }]);
  };

  const updateLogStatus = (messagePattern: string, newType: LogEntry["type"]) => {
    setLogs((prev) =>
      prev.map((log) =>
        log.message.includes(messagePattern) ? { ...log, type: newType } : log
      )
    );
  };

  const addEnvelope = (tier: TierKey, amount: number) => {
    const newEnvelope: SmartEnvelope = {
      id: `${tier}-${Date.now()}`,
      tier: TIER_CONFIG[tier].label,
      amount,
      timestamp: new Date(),
      status: "INITIATED",
    };
    setEnvelopes((prev) => [...prev, newEnvelope]);
    return newEnvelope.id;
  };

  const updateEnvelopeStatus = (id: string, status: SmartEnvelopeStatus) => {
    setEnvelopes((prev) => prev.map((env) => (env.id === id ? { ...env, status } : env)));
  };

  const handlePayment = async (tier: TierKey) => {
    if (!wallet) return;

    setIsPaying(true);
    setContent(null);
    setLogs([]);

    const tierConfig = TIER_CONFIG[tier];
    const amountInUnits = smallestToUnit(tierConfig.amountSmallestUnit);
    const envelopeId = addEnvelope(tier, amountInUnits);

    try {
      addLog(`Initiating ${tierConfig.label} payment...`, "info");

      const normalizedFetch = createNormalizedFetch(AVALANCHE_FUJI_CHAIN_ID);
      const fetchWithPay = wrapFetchWithPayment(
        normalizedFetch,
        client,
        wallet,
        tierConfig.amountSmallestUnit
      );

      addLog("Requesting payment authorization...", "info");
      updateEnvelopeStatus(envelopeId, "AUTHORIZED");
      const response = await fetchWithPay(tierConfig.api);
      const responseData = await response.json();

      if (response.status === 200) {
        updateLogStatus("Initiating", "success");
        updateLogStatus("Requesting payment authorization", "success");
        addLog("Payment successful!", "success");
        addLog("Content received", "success");
        setContent(responseData);
        updateEnvelopeStatus(envelopeId, "COMPLETED");

        const vaultDelta = amountInUnits * VAULT_ALLOCATION_RATE;
        setVaultBalance((prev) => prev + vaultDelta);
      } else {
        updateLogStatus("Initiating", "error");
        updateLogStatus("Requesting payment authorization", "error");
        const errorMsg = responseData.error || "Unknown error";
        addLog(`Payment failed: ${errorMsg}`, "error");
        updateEnvelopeStatus(envelopeId, "FAILED");
      }
    } catch (error) {
      updateLogStatus("Initiating", "error");
      updateLogStatus("Requesting payment authorization", "error");
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      addLog(`Error: ${errorMsg}`, "error");
      updateEnvelopeStatus(envelopeId, "FAILED");
    } finally {
      setIsPaying(false);
    }
  };

  if (!wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-6 p-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Balance Rail</h1>
            <p className="text-muted-foreground">Prepaid-friendly x402 payments on Avalanche Fuji</p>
            <p className="text-sm text-muted-foreground mt-1">Every payment contributes to AI NISA future value.</p>
          </div>
          <ConnectButton client={client} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Balance Rail</h1>
          <p className="text-muted-foreground">
            Prepaid automation + Smart Envelopes on Avalanche Fuji — every payment grows future value.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <ConnectButton client={client} />
          </div>
        </div>

        <Separator />

        <div className="flex flex-wrap justify-between gap-6 max-w-5xl mx-auto">
          <PaymentCard
            tier={TIER_CONFIG.basic.label}
            price={TIER_CONFIG.basic.priceDisplay}
            description={TIER_CONFIG.basic.description}
            onPayClick={() => handlePayment("basic")}
            isPaying={isPaying}
            currencyLabel={TOKEN_DISPLAY_NAME}
            badgeLabel={TIER_CONFIG.basic.badge}
          />
          <PaymentCard
            tier={TIER_CONFIG.premium.label}
            price={TIER_CONFIG.premium.priceDisplay}
            description={TIER_CONFIG.premium.description}
            onPayClick={() => handlePayment("premium")}
            isPaying={isPaying}
            currencyLabel={TOKEN_DISPLAY_NAME}
            badgeLabel={TIER_CONFIG.premium.badge}
          />
          <PaymentCard
            tier={TIER_CONFIG.enterprise.label}
            price={TIER_CONFIG.enterprise.priceDisplay}
            description={TIER_CONFIG.enterprise.description}
            onPayClick={() => handlePayment("enterprise")}
            isPaying={isPaying}
            currencyLabel={TOKEN_DISPLAY_NAME}
            badgeLabel={TIER_CONFIG.enterprise.badge}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <SmartEnvelopeList envelopes={envelopes} currencyLabel={TOKEN_DISPLAY_NAME} />

            {content && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ContentDisplay
                  tier={content.tier}
                  data={content.data}
                  features={content.features}
                  timestamp={content.timestamp}
                />
              </div>
            )}

            {logs.length > 0 && (
              <div className="animate-in fade-in-from-bottom-4 duration-700">
                <TransactionLog logs={logs} />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI NISA Vault (simulated)</CardTitle>
                <CardDescription>1–2% of successful payments accumulate here.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">
                  {vaultBalance.toFixed(4)} {TOKEN_DISPLAY_NAME}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Managed by ERC-8004 Agent</CardTitle>
                <CardDescription>Agent coordinates prepaid budget and AI NISA splits.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">ID:</span> {balanceRailAgent.id}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Role:</span> {balanceRailAgent.role}
                </p>
                <p className="text-xs text-muted-foreground">
                  Chains: {balanceRailAgent.chains.join(", ")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Token for demo</CardTitle>
                <CardDescription>Production would use JPYC; Fuji demo uses USDC.e.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Payments stay on Avalanche Fuji with the existing USDC.e contract.</p>
                <p>UI label: {TOKEN_DISPLAY_NAME}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
