# Balance Rail

Balance Rail is a prepaid-friendly, automated micropayment system where each payment contributes to future value. It runs on Avalanche Fuji using x402 for programmable payments. In production the prepaid asset would be **JPYC (ERC-20 JPY stablecoin)**; in this demo we use **USDC.e on Fuji as a stand-in**.

## Core Pillars
- **Smart Envelope** — structured payment events with metadata, status, and optional micro-task validation.
- **Prepaid Balance** — user-friendly balance layer with top-up, auto-charge logic, and split processing.
- **AI NISA (AI-managed micro-investment vault)** — tiny residuals from payments accumulate into a low-risk, AI-managed vault.

## What’s in this prototype
- Avalanche Fuji + x402 payment flow (TransferWithAuthorization) still intact.
- Three tiers aligned to use cases: daily spend (Basic), subscription bundle (Premium), AI NISA vault focus (Enterprise).
- Activity / Smart Envelope feed showing status transitions per payment attempt.
- Simulated AI NISA vault balance that grows by a small percentage of successful payments.
- ERC-8004 agent metadata surfaced in the UI to indicate agent-governed split logic.

## Stack
- Next.js 16 (Turbopack), TypeScript, Tailwind, shadcn/ui
- Thirdweb SDK v5 + x402

## Quickstart
```bash
npm install
npm run dev
# open http://localhost:3000
```
`.env.local` should already be configured locally. Do **not** commit secrets. Existing env vars: `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`, `THIRDWEB_SECRET_KEY`, `THIRDWEB_SERVER_WALLET_ADDRESS` (ERC4337 facilitator), `MERCHANT_WALLET_ADDRESS`, `NEXT_PUBLIC_API_BASE_URL` (optional).

## Notes for Evaluators
- Payments are denominated in **USDC.e (JPYC demo)**; contract address remains unchanged for Fuji.
- Each payment attempt emits a Smart Envelope entry with state (INITIATED → AUTHORIZED → COMPLETED/FAILED).
- A small percent of each successful payment is routed to the simulated **AI NISA Vault** in the UI only.
- ERC-8004 agent metadata is exposed to highlight the governance layer for balance splits.

## Further Reading
- Requirements: `docs/requirements.en.md`
- Repo URL: https://github.com/0x-xrpl/balance-rail
