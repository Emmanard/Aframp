/**
 * Tests for regional mobile money availability.
 */

import { getMobileMoneyOptions, MOBILE_MONEY_AVAILABILITY } from '../regions'

describe('getMobileMoneyOptions', () => {
  it('returns both M-Pesa and MTN MoMo for Ghana (GH)', () => {
    const options = getMobileMoneyOptions('GH')
    const providers = options.map((o) => o.provider)
    expect(providers).toContain('mpesa')
    expect(providers).toContain('mtn_momo')
    expect(options.length).toBe(2)
  })

  it('returns both M-Pesa and MTN MoMo for Uganda (UG)', () => {
    const options = getMobileMoneyOptions('UG')
    const providers = options.map((o) => o.provider)
    expect(providers).toContain('mpesa')
    expect(providers).toContain('mtn_momo')
    expect(options.length).toBe(2)
  })

  it('returns only M-Pesa for Kenya (KE)', () => {
    const options = getMobileMoneyOptions('KE')
    expect(options.length).toBe(1)
    expect(options[0].provider).toBe('mpesa')
  })

  it('returns only M-Pesa for Tanzania (TZ)', () => {
    const options = getMobileMoneyOptions('TZ')
    expect(options.length).toBe(1)
    expect(options[0].provider).toBe('mpesa')
  })

  it('returns only MTN MoMo for Rwanda (RW)', () => {
    const options = getMobileMoneyOptions('RW')
    expect(options.length).toBe(1)
    expect(options[0].provider).toBe('mtn_momo')
  })

  it('returns an empty array for the US (no mobile money support)', () => {
    const options = getMobileMoneyOptions('US')
    expect(options).toEqual([])
  })

  it('returns an empty array for Nigeria (NG) — not yet supported', () => {
    const options = getMobileMoneyOptions('NG')
    expect(options).toEqual([])
  })

  it('is case-insensitive', () => {
    expect(getMobileMoneyOptions('ke')).toEqual(getMobileMoneyOptions('KE'))
    expect(getMobileMoneyOptions('gh')).toEqual(getMobileMoneyOptions('GH'))
  })

  it('every option has required fields', () => {
    Object.values(MOBILE_MONEY_AVAILABILITY)
      .flat()
      .forEach((option) => {
        expect(option.provider).toBeTruthy()
        expect(option.label).toBeTruthy()
        expect(option.description).toBeTruthy()
        expect(option.dialPrefix).toMatch(/^\+\d+$/)
        expect(option.phonePattern).toBeTruthy()
      })
  })
})
