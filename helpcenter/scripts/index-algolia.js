#!/usr/bin/env node
/**
 * Algolia indexing script — indexes all FAQ articles.
 *
 * Usage:
 *   ALGOLIA_APP_ID=xxx ALGOLIA_ADMIN_KEY=yyy node scripts/index-algolia.js
 *
 * Index structure per article:
 *   objectID  — article slug
 *   title     — article title
 *   category  — category name
 *   excerpt   — one-sentence summary
 *   body      — full markdown body
 *   keywords  — search hint array
 */

// Node-compatible import of articles (ESM → CJS shim)
const { createRequire } = require("module");
const path = require("path");

// Inline the articles data to avoid ESM/CJS issues in the script
const articles = [
  {
    objectID: "how-to-connect-your-wallet",
    title: "How to connect your wallet",
    category: "Wallet & Connections",
    slug: "how-to-connect-your-wallet",
    excerpt: "Step-by-step guide to connecting your Stellar wallet to the Aframp platform.",
    keywords: ["wallet", "connect", "stellar", "metamask", "link", "setup", "help wallet connect"],
    body: "How to connect your wallet — Connecting your wallet to Aframp takes less than two minutes.",
  },
  {
    objectID: "supported-wallets",
    title: "Which wallets are supported?",
    category: "Wallet & Connections",
    slug: "supported-wallets",
    excerpt: "Full list of wallets compatible with the Aframp platform.",
    keywords: ["wallet", "supported", "freighter", "lobstr", "xbull", "ledger"],
    body: "Supported wallets — Freighter, Lobstr, xBull, Ledger.",
  },
  {
    objectID: "disconnect-wallet",
    title: "How to disconnect your wallet",
    category: "Wallet & Connections",
    slug: "disconnect-wallet",
    excerpt: "Learn how to safely disconnect your wallet from Aframp.",
    keywords: ["wallet", "disconnect", "remove", "unlink"],
    body: "How to disconnect your wallet — Go to Settings → Wallet and click Disconnect.",
  },
  {
    objectID: "how-to-send-cngn",
    title: "How to send cNGN",
    category: "Transactions",
    slug: "how-to-send-cngn",
    excerpt: "Send cNGN to any Stellar wallet address in seconds.",
    keywords: ["send", "transfer", "cngn", "payment", "transaction"],
    body: "How to send cNGN — Navigate to Wallet → Send and enter the recipient address.",
  },
  {
    objectID: "transaction-pending",
    title: "Why is my transaction pending?",
    category: "Transactions",
    slug: "transaction-pending",
    excerpt: "Understand why a transaction shows as pending and how to resolve it.",
    keywords: ["pending", "stuck", "transaction", "delay"],
    body: "Why is my transaction pending — Most transactions confirm within 5 seconds.",
  },
  {
    objectID: "transaction-history",
    title: "How to view transaction history",
    category: "Transactions",
    slug: "transaction-history",
    excerpt: "Access and export your full transaction history.",
    keywords: ["history", "transactions", "export", "csv"],
    body: "How to view transaction history — Go to Wallet → History.",
  },
  {
    objectID: "enable-two-factor-auth",
    title: "How to enable two-factor authentication",
    category: "Account & Security",
    slug: "enable-two-factor-auth",
    excerpt: "Secure your account with 2FA using an authenticator app.",
    keywords: ["2fa", "two-factor", "authentication", "security", "totp"],
    body: "How to enable 2FA — Go to Settings → Security → Two-Factor Authentication.",
  },
  {
    objectID: "reset-password",
    title: "How to reset your password",
    category: "Account & Security",
    slug: "reset-password",
    excerpt: "Reset your Aframp account password via email.",
    keywords: ["password", "reset", "forgot", "change"],
    body: "How to reset your password — Click Forgot password on the login page.",
  },
  {
    objectID: "kyc-verification",
    title: "How to complete KYC verification",
    category: "Account & Security",
    slug: "kyc-verification",
    excerpt: "Complete identity verification to unlock full platform features.",
    keywords: ["kyc", "verification", "identity", "id", "document"],
    body: "How to complete KYC — Go to Settings → Verification and upload your documents.",
  },
  {
    objectID: "what-is-cngn",
    title: "What is cNGN?",
    category: "Getting Started",
    slug: "what-is-cngn",
    excerpt: "Learn about cNGN, the Nigerian Naira-backed stablecoin on Stellar.",
    keywords: ["cngn", "stablecoin", "ngn", "naira", "stellar", "what is"],
    body: "What is cNGN — A Nigerian Naira-backed stablecoin on the Stellar blockchain.",
  },
  {
    objectID: "create-account",
    title: "How to create an account",
    category: "Getting Started",
    slug: "create-account",
    excerpt: "Sign up for Aframp in under 2 minutes.",
    keywords: ["signup", "register", "create", "account", "new"],
    body: "How to create an account — Visit aframp.com and click Get Started.",
  },
  {
    objectID: "mint-cngn",
    title: "How to mint cNGN",
    category: "Getting Started",
    slug: "mint-cngn",
    excerpt: "Convert NGN to cNGN by depositing fiat through the Aframp platform.",
    keywords: ["mint", "buy", "deposit", "fiat", "ngn", "convert"],
    body: "How to mint cNGN — Go to Wallet → Mint and enter the amount.",
  },
];

async function main() {
  const appId = process.env.ALGOLIA_APP_ID;
  const adminKey = process.env.ALGOLIA_ADMIN_KEY;

  if (!appId || !adminKey) {
    console.error("❌ Missing ALGOLIA_APP_ID or ALGOLIA_ADMIN_KEY environment variables.");
    console.error("   Usage: ALGOLIA_APP_ID=xxx ALGOLIA_ADMIN_KEY=yyy node scripts/index-algolia.js");
    process.exit(1);
  }

  let algoliasearch;
  try {
    algoliasearch = require("algoliasearch");
  } catch {
    console.error("❌ algoliasearch not installed. Run: npm install algoliasearch");
    process.exit(1);
  }

  const client = algoliasearch(appId, adminKey);
  const index = client.initIndex("aframp_helpcenter");

  // Configure index settings for optimal search
  await index.setSettings({
    searchableAttributes: ["title", "keywords", "excerpt", "category", "body"],
    attributesForFaceting: ["category"],
    customRanking: ["desc(popular)"],
    highlightPreTag: "<mark>",
    highlightPostTag: "</mark>",
  });

  console.log(`📤 Indexing ${articles.length} articles to Algolia…`);

  const { objectIDs } = await index.saveObjects(articles);

  console.log(`✅ Indexed ${objectIDs.length} articles:`);
  objectIDs.forEach((id) => console.log(`   • ${id}`));
}

main().catch((e) => {
  console.error("❌ Indexing failed:", e.message);
  process.exit(1);
});
