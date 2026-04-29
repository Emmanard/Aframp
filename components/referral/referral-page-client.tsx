'use client'

import Link from 'next/link'
import { ReferralCard } from '@/components/referral/referral-card'
import { useWallet } from '@/hooks/useWallet'
import { useWalletConnection } from '@/hooks/use-wallet-connection'

export function ReferralPageClient() {
  const { publicKey } = useWallet()
  const { address } = useWalletConnection()
  const walletAddress = address || publicKey || ''

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-lg space-y-6">
        <header>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Dashboard
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-foreground">Referral Program</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Invite friends to Aframp. They get 10% off their first ramp — you earn fee rebates.
          </p>
        </header>

        {walletAddress ? (
          <ReferralCard walletAddress={walletAddress} />
        ) : (
          <div className="rounded-3xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Connect your wallet to access your referral code.
          </div>
        )}

        <div className="rounded-3xl border border-border bg-muted/20 p-6 space-y-3 text-sm text-muted-foreground">
          <h3 className="font-semibold text-foreground">How it works</h3>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Share your unique referral code or link</li>
            <li>Your friend applies it before their first ramp</li>
            <li>They get <strong className="text-foreground">10% off</strong> their first ramp fees</li>
            <li>You earn a <strong className="text-foreground">5% fee rebate</strong> on their transaction</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
