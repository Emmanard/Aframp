'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface DashboardPageClientProps {
  initialWallet?: string
  initialAddress?: string
}

export function DashboardPageClient({ initialWallet, initialAddress }: DashboardPageClientProps) {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [walletName, setWalletName] = useState<string>('')
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Prefer URL params passed from the server, then fall back to sessionStorage
    const wallet = initialWallet || walletSession.getName()
    const address = initialAddress || walletSession.getAddress()

    if (wallet && address) {
      Promise.resolve().then(() => {
        setWalletName(wallet)
        setWalletAddress(address)
        setConnected(true)

        // Ensure persistence within the session
        walletSession.setName(wallet)
        walletSession.setAddress(address)
      })
    } else {
      router.push('/')
    }
  }, [initialWallet, initialAddress, router])

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout walletAddress={walletAddress}>
      <DashboardContent walletName={walletName} walletAddress={walletAddress} />
    </DashboardLayout>
  )
}
