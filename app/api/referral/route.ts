import { NextResponse } from 'next/server'
import { generateReferralCode, type ReferralRecord } from '@/lib/referral'

/**
 * In-memory store — replace with DB in production.
 * Key: referral code, Value: ReferralRecord
 */
const store = new Map<string, ReferralRecord>()

function getOrCreate(walletAddress: string): ReferralRecord {
  const code = generateReferralCode(walletAddress)
  if (!store.has(code)) {
    store.set(code, {
      code,
      ownerAddress: walletAddress,
      referees: [],
      totalRebatesEarned: 0,
      createdAt: Date.now(),
    })
  }
  return store.get(code)!
}

/** GET /api/referral?wallet=G... — fetch or create referral record */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')
  if (!wallet) return NextResponse.json({ error: 'wallet required' }, { status: 400 })

  const record = getOrCreate(wallet)
  return NextResponse.json(record)
}

/** POST /api/referral — apply a referral code for a new user */
export async function POST(request: Request) {
  const body = (await request.json()) as { code: string; refereeWallet: string }
  const { code, refereeWallet } = body

  if (!code || !refereeWallet) {
    return NextResponse.json({ error: 'code and refereeWallet required' }, { status: 400 })
  }

  const record = store.get(code.toUpperCase())
  if (!record) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
  }

  if (record.ownerAddress === refereeWallet) {
    return NextResponse.json({ error: 'Cannot use your own referral code' }, { status: 400 })
  }

  if (record.referees.includes(refereeWallet)) {
    return NextResponse.json({ error: 'Code already used by this wallet' }, { status: 409 })
  }

  record.referees.push(refereeWallet)
  return NextResponse.json({ success: true, discountPct: 10 })
}
