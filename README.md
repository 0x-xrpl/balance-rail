# Balance Rail — AI-Native Prepaid Payment OS

Transforming everyday payments into a source of future value through AI, prepaid balance, and x402 automation.

---

## 1. Overview

Balance Rail is an AI-native prepaid payment operating system that integrates:

- Prepaid balance (JPYC)  
- Gasless settlement through x402 + EIP-3009  
- AI-driven micro-investment (AI NISA Vault)

The system enables a payment experience where users:

- Do not manage gas  
- Do not handle complex wallet operations  
- Can pay repeatedly in small amounts  
- Automatically accumulate future value from residual micro-amounts  

Balance Rail provides a cohesive, intuitive, and globally scalable foundation designed for markets with high-frequency micropayments.

---

## 2. Background & Problem

### 2.1 Market Context

Japan is one of the world’s strongest prepaid-native economies, dominated by:

- Suica / PASMO  
- PayPay  
- Rakuten Pay  
- Point ecosystems (Ponta, T-Point, Rakuten Points)

Japanese users prefer:

- Prepayment over postpayment  
- Predictable spending  
- Small, frequent purchases  
- Frictionless UX without gas or complex approvals  

This behavior aligns perfectly with the OS approach of Balance Rail.

### 2.2 Existing Issues in Web3 Payments

Current on-chain payment systems suffer from:

- Gas costs breaking UX flow  
- Wallet signing friction  
- Poor support for micropayments  
- No automated top-ups  
- No connection between payments → savings → future value  
- Underutilized AI for financial prediction and optimization  

Balance Rail resolves these issues through an integrated, OS-level architecture.

---

## 3. Solution Structure

Balance Rail is built on three foundational layers:

### 3.1 Smart Envelope Layer (x402 Autonomous Events)

Each payment event becomes a Smart Envelope that stores:

- Transaction metadata  
- Verification status  
- Facilitator signature  
- AI evaluation logs  
- Split computation results  

Using x402, the system supports:

- Deterministic execution  
- Automated settlement  
- Post-verification logic  
- Transparent logging  

### 3.2 Prepaid Balance Layer (JPYC-based)

JPYC is chosen because:

- 1:1 JPY peg enables intuitive UX  
- Aligns with Japanese prepaid culture  
- Stable for micropayment-heavy environments  
- Highly compatible with automated, agentic payment flows  

Functions include:

- Top-up  
- Auto-charge via programmable conditions  
- Split logic (user balance / AI vault / fee)  
- Safety controls: daily limits, anomaly freeze, safe mode  

### 3.3 AI NISA (AI-Managed Micro-Investment Vault)

AI NISA is a micro-investment vault, not tied to any local tax scheme.  
It automatically collects:

- Sub-unit residual value from payments  
- “Invisible” financial fragments that are normally lost  

AI then optimizes these micro-values using:

- Low-risk aggregation strategies  
- Data-driven allocation  
- Spending behavior prediction  

It turns Web3 payments into a continuous value-generation process.

---

## 4. Technical Architecture

### 4.1 x402 — Payment Required Flow

Balance Rail implements the modern interpretation of HTTP 402 Payment Required, enabling:

- Per-request charging  
- API-native monetization  
- Sub-cent micropayments  
- Agent-to-agent payments  

Flow:

1. Client → Request  
2. Server → 402 Payment Required  
3. Client → `transferWithAuthorization` (EIP-3009)  
4. Facilitator → Submits on-chain  
5. Server → Returns resource  

This gives users a gasless, accountless payment experience.

<pre>
4.2 EIP-3009 — transferWithAuthorization
This is the core mechanism behind gasless prepaid payments.
What it enables:
* User signs once → no gas required
* Facilitator pays gas on behalf
* Nonce ensures one-time use
* Time-bounded authorization for safety

Signature structure:
transferWithAuthorization(
    address from,
    address to,
    uint256 value,
    uint256 validAfter,
    uint256 validBefore,
    bytes32 nonce,
    uint8 v, bytes32 r, bytes32 s
)

Usage in Balance Rail:
* Merchant-paid gas
* AI-triggered automated payments
* Subscription-like recurring flows
* Micropayment bursts (frequent low-value events)


4.3 ERC-8004 — Automated Payment Modules
ERC-8004 complements x402 by enabling:
* Condition-based automated payments
* Usage-based tariffs (pay-per-use)
* AI-agent mediated transactions
* Multi-step programmable settlement

In Balance Rail, ERC-8004 powers:
* Smart Charge logic
* AI-agent to merchant payments
* Envelope-driven micro-task validation


4.4 Facilitator
A critical infrastructure component.

Responsibilities:
* Submit EIP-3009 signed messages
* Pay gas fees
* Update Envelope verification status
* Enforce proper nonce usage
* Maintain secure settlement

Security:
* Single-use signatures
* Time windows
* Replay protection
* AI anomaly detection


5. System Architecture Layers
Balance Rail Architecture
├─ 1. Presentation Layer (UI / UX)
│    ├─ Dashboard (Balance / AI NISA / Activity)
│    ├─ Top-up & Auto-Charge UI
│    ├─ Payment Request Modal
│    └─ Developer API Console
│
├─ 2. Application Layer
│    ├─ Envelope Controller
│    ├─ Payment Processor (x402 Request Handler)
│    ├─ Auto-Charge Engine
│    └─ AI NISA Allocation Service
│
├─ 3. Domain Layer
│    ├─ Smart Envelope Model
│    ├─ Balance Model
│    ├─ Fee Split & Routing Logic
│    ├─ Risk / Anomaly Detection
│    └─ Rule-Based Spending Policies
│
├─ 4. Infrastructure Layer
│    ├─ x402 Client
│    ├─ EIP-3009 Signer
│    ├─ Facilitator On-Chain Executor
│    ├─ JPYC / USDC.e Token Registry
│    ├─ RPC / Node Provider
│    └─ Storage (Session / Local / IndexedDB)
│
└─ 5. External Integrations
     ├─ AI Models (AI NISA)
     ├─ Merchant Settlement Webhooks
     ├─ API Monetization Modules
     └─ Accounting Export Tools


6. Directory Structure
balance-rail/
├─ app/
│   ├─ layout.tsx
│   ├─ page.tsx
│   └─ (dashboard)/...
│
├─ components/
│   ├─ ui/
│   └─ dashboard/
│
├─ lib/
│   ├─ x402/
│   ├─ jpyc/
│   ├─ envelopes/
│   └─ ai-nisa/
│
├─ docs/
│   ├─ requirements.ja.md
│   └─ requirements.en.md
│
└─ other config files


7. Security & Safety Model (AI-Debit Architecture)
Balance Rail introduces AI-assisted debit-style safety, ensuring automation never becomes uncontrollable.

Core Principles:
* AI never receives direct token spending authority
* All payments require one-time E*

