'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  generateReferralCode,
  getAppliedReferralCode,
  isReferralDiscountConsumed,
  setAppliedReferralCode,
  REFERRAL_DISCOUNT_PCT,
  type ReferralRecord,
} from '@/lib/referral'

export interface UseReferralReturn {
  /** This user's own referral code */
  myCode: string
  /** Stats for the referrer (referees count, rebates earned) */
  record: ReferralRecord | null
  /** Code the current user applied (for their own discount) */
  appliedCode: string | null
  /** Whether the 10% first-ramp discount is active */
  discountActive: boolean
  /** Apply a referral code — returns error string or null on success */
  applyCode: (code: string) => Promise<string | null>
  loading: boolean
}

export function useReferral(walletAddress: string): UseReferralReturn {
  const myCode = walletAddress ? generateReferralCode(walletAddress) : ''
  const [record, setRecord] = useState<ReferralRecord | null>(null)
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Load applied code + fetch referrer stats
  useEffect(() => {
    if (!walletAddress) return
    setAppliedCode(getAppliedReferralCode())

    setLoading(true)
    fetch(`/api/referral?wallet=${encodeURIComponent(walletAddress)}`)
      .then((r) => r.json())
      .then((data: ReferralRecord) => setRecord(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [walletAddress])

  const applyCode = useCallback(
    async (code: string): Promise<string | null> => {
      if (!walletAddress) return 'Connect your wallet first'
      if (!code.trim()) return 'Enter a referral code'
      if (isReferralDiscountConsumed()) return 'You have already used a referral code'

      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase(), refereeWallet: walletAddress }),
      })
      const data = await res.json()
      if (!res.ok) return data.error ?? 'Invalid code'

      setAppliedReferralCode(code.trim().toUpperCase())
      setAppliedCode(code.trim().toUpperCase())
      return null
    },
    [walletAddress]
  )

  const discountActive =
    !!appliedCode && !isReferralDiscountConsumed()

  return { myCode, record, appliedCode, discountActive, applyCode, loading }
}

export { REFERRAL_DISCOUNT_PCT }
