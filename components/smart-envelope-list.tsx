import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type SmartEnvelopeStatus = "INITIATED" | "AUTHORIZED" | "COMPLETED" | "FAILED";

export type SmartEnvelope = {
  id: string;
  tier: string;
  amount: number;
  timestamp: Date;
  status: SmartEnvelopeStatus;
};

interface SmartEnvelopeListProps {
  envelopes: SmartEnvelope[];
  currencyLabel?: string;
}

const statusStyles: Record<SmartEnvelopeStatus, string> = {
  INITIATED: "bg-blue-50 text-blue-700 border-blue-200",
  AUTHORIZED: "bg-amber-50 text-amber-700 border-amber-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
};

export function SmartEnvelopeList({ envelopes, currencyLabel = "USDC.e" }: SmartEnvelopeListProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Smart Envelopes</CardTitle>
        <CardDescription>Recent payment intents and their statuses</CardDescription>
      </CardHeader>
      <CardContent>
        {envelopes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No envelopes yet. Trigger a payment to see activity.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {envelopes
              .slice()
              .reverse()
              .map((envelope) => (
                <div
                  key={envelope.id}
                  className="grid grid-cols-2 md:grid-cols-5 items-center gap-2 rounded-lg border p-3"
                >
                  <div className="text-sm font-medium">{envelope.tier}</div>
                  <div className="text-sm text-muted-foreground">#{envelope.id}</div>
                  <div className="text-sm">
                    {envelope.amount.toFixed(2)} {currencyLabel}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {envelope.timestamp.toLocaleString()}
                  </div>
                  <div className="flex justify-start md:justify-end">
                    <Badge variant="outline" className={statusStyles[envelope.status]}>
                      {envelope.status}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
