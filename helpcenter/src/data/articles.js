/**
 * FAQ article content — single source of truth.
 * Used by both the UI and the Algolia indexing script.
 *
 * Each article:
 *   objectID   — unique slug (used as Algolia objectID)
 *   title      — article title
 *   category   — one of the four top-level categories
 *   slug       — URL-safe identifier
 *   excerpt    — one-sentence summary shown in search results
 *   body       — full markdown content
 *   keywords   — search indexing hints
 *   popular    — shown in empty-state suggested articles
 */

export const CATEGORIES = [
  "Wallet & Connections",
  "Transactions",
  "Account & Security",
  "Getting Started",
];

export const articles = [
  // ── Wallet & Connections ──────────────────────────────────────────────────
  {
    objectID: "how-to-connect-your-wallet",
    title: "How to connect your wallet",
    category: "Wallet & Connections",
    slug: "how-to-connect-your-wallet",
    excerpt: "Step-by-step guide to connecting your Stellar wallet to the Aframp platform.",
    popular: true,
    keywords: ["wallet", "connect", "stellar", "metamask", "link", "setup", "help wallet connect"],
    body: `## How to connect your wallet

Connecting your wallet to Aframp takes less than two minutes. Follow the steps below.

### Supported wallets
- **Stellar wallets** — Freighter, Lobstr, xBull
- **Hardware wallets** — Ledger (via Freighter)

### Step-by-step

1. **Open the Aframp app** and navigate to **Settings → Wallet**.
2. Click **Connect Wallet**.
3. Select your wallet provider from the list.
4. Approve the connection request in your wallet extension.
5. Your wallet address will appear in the dashboard once connected.

### Troubleshooting

- **Wallet not detected?** Make sure the browser extension is installed and unlocked.
- **Wrong network?** Aframp runs on the Stellar mainnet. Switch your wallet to mainnet.
- **Connection rejected?** Check that you approved the request in your wallet popup.

If you continue to have issues, [contact support](/support).`,
  },
  {
    objectID: "supported-wallets",
    title: "Which wallets are supported?",
    category: "Wallet & Connections",
    slug: "supported-wallets",
    excerpt: "Full list of wallets compatible with the Aframp platform.",
    popular: false,
    keywords: ["wallet", "supported", "freighter", "lobstr", "xbull", "ledger", "compatible"],
    body: `## Supported wallets

Aframp supports the following Stellar-compatible wallets:

| Wallet | Type | Notes |
|--------|------|-------|
| Freighter | Browser extension | Recommended |
| Lobstr | Mobile + Web | Full support |
| xBull | Browser extension | Full support |
| Ledger | Hardware | Via Freighter |

### Adding a new wallet
If your wallet is not listed, [submit a request](/support) and our team will evaluate integration.`,
  },
  {
    objectID: "disconnect-wallet",
    title: "How to disconnect your wallet",
    category: "Wallet & Connections",
    slug: "disconnect-wallet",
    excerpt: "Learn how to safely disconnect your wallet from Aframp.",
    popular: false,
    keywords: ["wallet", "disconnect", "remove", "unlink", "revoke"],
    body: `## How to disconnect your wallet

1. Go to **Settings → Wallet**.
2. Click the **Disconnect** button next to your wallet address.
3. Confirm the action in the dialog.

Your wallet is now disconnected. Any pending transactions will not be affected.`,
  },

  // ── Transactions ──────────────────────────────────────────────────────────
  {
    objectID: "how-to-send-cngn",
    title: "How to send cNGN",
    category: "Transactions",
    slug: "how-to-send-cngn",
    excerpt: "Send cNGN to any Stellar wallet address in seconds.",
    popular: true,
    keywords: ["send", "transfer", "cngn", "payment", "transaction", "stellar"],
    body: `## How to send cNGN

1. Navigate to **Wallet → Send**.
2. Enter the recipient's Stellar wallet address.
3. Enter the amount in cNGN.
4. Review the transaction details and fee.
5. Click **Confirm** and approve in your wallet.

Transactions typically confirm within 5 seconds on the Stellar network.

### Fees
Aframp charges a flat fee of 0.1% per transaction. Stellar network fees are approximately 0.00001 XLM.`,
  },
  {
    objectID: "transaction-pending",
    title: "Why is my transaction pending?",
    category: "Transactions",
    slug: "transaction-pending",
    excerpt: "Understand why a transaction shows as pending and how to resolve it.",
    popular: true,
    keywords: ["pending", "stuck", "transaction", "delay", "processing", "slow"],
    body: `## Why is my transaction pending?

Most transactions confirm within 5 seconds. If yours is pending longer, here are common causes:

### Common causes
- **Network congestion** — Stellar occasionally experiences brief delays.
- **Insufficient XLM** — Your wallet needs a small XLM balance for fees.
- **Trustline missing** — The recipient may not have a cNGN trustline.

### What to do
1. Wait 60 seconds and refresh the page.
2. Check your XLM balance covers the fee (~0.00001 XLM).
3. Verify the recipient has a cNGN trustline.

If the transaction is still pending after 5 minutes, [contact support](/support).`,
  },
  {
    objectID: "transaction-history",
    title: "How to view transaction history",
    category: "Transactions",
    slug: "transaction-history",
    excerpt: "Access and export your full transaction history.",
    popular: false,
    keywords: ["history", "transactions", "export", "csv", "statement", "records"],
    body: `## How to view transaction history

1. Go to **Wallet → History**.
2. Use the date filter to narrow results.
3. Click any transaction to see full details.

### Export
Click **Export CSV** to download your transaction history for accounting or tax purposes.`,
  },

  // ── Account & Security ────────────────────────────────────────────────────
  {
    objectID: "enable-two-factor-auth",
    title: "How to enable two-factor authentication",
    category: "Account & Security",
    slug: "enable-two-factor-auth",
    excerpt: "Secure your account with 2FA using an authenticator app.",
    popular: true,
    keywords: ["2fa", "two-factor", "authentication", "security", "totp", "authenticator", "otp"],
    body: `## How to enable two-factor authentication (2FA)

We strongly recommend enabling 2FA to protect your account.

### Steps
1. Go to **Settings → Security → Two-Factor Authentication**.
2. Click **Enable 2FA**.
3. Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.).
4. Enter the 6-digit code to confirm.
5. Save your backup codes in a secure location.

### Supported apps
- Google Authenticator
- Authy
- 1Password
- Any TOTP-compatible app`,
  },
  {
    objectID: "reset-password",
    title: "How to reset your password",
    category: "Account & Security",
    slug: "reset-password",
    excerpt: "Reset your Aframp account password via email.",
    popular: false,
    keywords: ["password", "reset", "forgot", "change", "login", "access"],
    body: `## How to reset your password

1. Go to the [login page](/login) and click **Forgot password?**
2. Enter your registered email address.
3. Check your inbox for a reset link (check spam if not received).
4. Click the link and enter your new password.
5. Log in with your new password.

Reset links expire after 30 minutes.`,
  },
  {
    objectID: "kyc-verification",
    title: "How to complete KYC verification",
    category: "Account & Security",
    slug: "kyc-verification",
    excerpt: "Complete identity verification to unlock full platform features.",
    popular: true,
    keywords: ["kyc", "verification", "identity", "id", "document", "tier", "limits"],
    body: `## How to complete KYC verification

KYC (Know Your Customer) verification unlocks higher transaction limits.

### Tiers
| Tier | Limit | Requirements |
|------|-------|-------------|
| Tier 1 | ₦500,000/day | Email + phone |
| Tier 2 | ₦5,000,000/day | Government ID |
| Tier 3 | Unlimited | ID + proof of address |

### Steps
1. Go to **Settings → Verification**.
2. Select your target tier.
3. Upload the required documents.
4. Wait 1–3 business days for review.

You'll receive an email notification when your verification is approved.`,
  },

  // ── Getting Started ───────────────────────────────────────────────────────
  {
    objectID: "what-is-cngn",
    title: "What is cNGN?",
    category: "Getting Started",
    slug: "what-is-cngn",
    excerpt: "Learn about cNGN, the Nigerian Naira-backed stablecoin on Stellar.",
    popular: true,
    keywords: ["cngn", "stablecoin", "ngn", "naira", "stellar", "what is", "introduction"],
    body: `## What is cNGN?

cNGN is a Nigerian Naira-backed stablecoin issued on the Stellar blockchain.

### Key facts
- **1:1 peg** — 1 cNGN = 1 NGN at all times
- **Fully backed** — reserves held across Tier-1 Nigerian banks
- **Instant settlement** — transactions confirm in ~5 seconds
- **Low fees** — fraction of a cent per transaction

### Use cases
- Cross-border remittances
- Business payments
- Savings in NGN without bank account friction

### Proof of Reserves
Aframp publishes a real-time [Proof of Reserves dashboard](/transparency) showing all custodian balances.`,
  },
  {
    objectID: "create-account",
    title: "How to create an account",
    category: "Getting Started",
    slug: "create-account",
    excerpt: "Sign up for Aframp in under 2 minutes.",
    popular: true,
    keywords: ["signup", "register", "create", "account", "new", "onboarding", "start"],
    body: `## How to create an account

1. Visit [aframp.com](https://aframp.com) and click **Get Started**.
2. Enter your email address and create a password.
3. Verify your email via the confirmation link.
4. Complete your profile (name, phone number).
5. Connect your wallet (optional at signup).

You're ready to use Aframp. Complete KYC to unlock higher limits.`,
  },
  {
    objectID: "mint-cngn",
    title: "How to mint cNGN",
    category: "Getting Started",
    slug: "mint-cngn",
    excerpt: "Convert NGN to cNGN by depositing fiat through the Aframp platform.",
    popular: false,
    keywords: ["mint", "buy", "deposit", "fiat", "ngn", "convert", "onramp"],
    body: `## How to mint cNGN

Minting converts your NGN fiat into cNGN on the Stellar blockchain.

### Steps
1. Go to **Wallet → Mint**.
2. Enter the amount of NGN you want to convert.
3. Select your payment method (bank transfer or card).
4. Complete the payment.
5. cNGN will appear in your wallet within 1–5 minutes after payment confirmation.

### Limits
Minting limits depend on your KYC tier. See [KYC verification](/help/kyc-verification) for details.`,
  },
];

/** Articles grouped by category for the landing page. */
export function getArticlesByCategory() {
  return CATEGORIES.map((cat) => ({
    category: cat,
    articles: articles.filter((a) => a.category === cat),
  }));
}

/** Find a single article by slug. */
export function getArticleBySlug(slug) {
  return articles.find((a) => a.slug === slug) ?? null;
}

/** Popular articles for the empty-state suggestion list. */
export function getPopularArticles() {
  return articles.filter((a) => a.popular);
}

/** Related articles: same category, excluding current. */
export function getRelatedArticles(slug, limit = 3) {
  const current = getArticleBySlug(slug);
  if (!current) return [];
  return articles
    .filter((a) => a.category === current.category && a.slug !== slug)
    .slice(0, limit);
}
