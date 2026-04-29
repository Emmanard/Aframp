'use client'

import { useCallback, useEffect, useState } from 'react'
import { isValidStellarAddress } from '@/lib/onramp/validation'
import { useWallet } from '@/hooks/useWallet'

const STORAGE_ADDRESS = 'walletAddress'
const STORAGE_WALLET_LIST = 'walletAddresses'

export function useWalletConnection() {
  const { isConnected: walletStoreConnected, publicKey, disconnect: disconnectWallet } = useWallet()
  const [storedAddress, setStoredAddress] = useState<string>('')
  const [storedAddresses, setStoredAddresses] = useState<string[]>([])
  const [storedConnected, setStoredConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedAddress = localStorage.getItem(STORAGE_ADDRESS) || ''
    const storedList = localStorage.getItem(STORAGE_WALLET_LIST)
    const parsedList = storedList ? (JSON.parse(storedList) as string[]) : []
    const normalizedList = parsedList.filter(Boolean)

    if (storedAddress && !normalizedList.includes(storedAddress)) {
      normalizedList.unshift(storedAddress)
    }

    Promise.resolve().then(() => {
      setStoredAddresses(normalizedList)
      setStoredAddress(storedAddress)
      setStoredConnected(isValidStellarAddress(storedAddress))
      setLoading(false)
    })
  }, [])

  // Keep local storage in sync with global wallet store without triggering cascaded local state writes.
  useEffect(() => {
    const globalAddress = publicKey || ''
    const isGlobalValid = walletStoreConnected && isValidStellarAddress(globalAddress)

    if (isGlobalValid) {
      localStorage.setItem(STORAGE_ADDRESS, globalAddress)
      const storedList = localStorage.getItem(STORAGE_WALLET_LIST)
      const parsedList = storedList ? (JSON.parse(storedList) as string[]) : []
      const normalizedList = parsedList.filter(Boolean)
      if (!normalizedList.includes(globalAddress)) {
        localStorage.setItem(STORAGE_WALLET_LIST, JSON.stringify([globalAddress, ...normalizedList]))
      }
    }
  }, [walletStoreConnected, publicKey])

  const globalAddress = walletStoreConnected && isValidStellarAddress(publicKey || '') ? publicKey || '' : ''
  const address = globalAddress || storedAddress
  const connected = Boolean(globalAddress) || storedConnected
  const addresses = globalAddress
    ? [globalAddress, ...storedAddresses.filter((item) => item !== globalAddress)]
    : storedAddresses

  const updateAddress = useCallback((nextAddress: string) => {
    if (!isValidStellarAddress(nextAddress)) return false

    setStoredAddress(nextAddress)
    setStoredConnected(true)
    localStorage.setItem(STORAGE_ADDRESS, nextAddress)

    setStoredAddresses((prev) => {
      const next = [nextAddress, ...prev.filter((item) => item !== nextAddress)]
      localStorage.setItem(STORAGE_WALLET_LIST, JSON.stringify(next))
      return next
    })

    return true
  }, [])

  const setDefaultAddress = useCallback((nextAddress: string) => {
    if (!isValidStellarAddress(nextAddress)) return false

    setStoredAddress(nextAddress)
    setStoredConnected(true)
    localStorage.setItem(STORAGE_ADDRESS, nextAddress)

    setStoredAddresses((prev) => {
      const next = [nextAddress, ...prev.filter((item) => item !== nextAddress)]
      localStorage.setItem(STORAGE_WALLET_LIST, JSON.stringify(next))
      return next
    })

    return true
  }, [])

  const removeAddress = useCallback(
    (targetAddress: string) => {
      if (!isValidStellarAddress(targetAddress)) return false

      setStoredAddresses((prev) => {
        const next = prev.filter((item) => item !== targetAddress)
        localStorage.setItem(STORAGE_WALLET_LIST, JSON.stringify(next))
        return next
      })

      const activeAddress = publicKey || storedAddress
      if (activeAddress === targetAddress) {
        const storedList = localStorage.getItem(STORAGE_WALLET_LIST)
        const parsedList = storedList ? (JSON.parse(storedList) as string[]) : []
        const nextDefault = parsedList.find(Boolean) || ''
        localStorage.setItem(STORAGE_ADDRESS, nextDefault)
        setStoredAddress(nextDefault)
        setStoredConnected(Boolean(nextDefault))
      }

      return true
    },
    [publicKey, storedAddress]
  )

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_ADDRESS)
    localStorage.removeItem('walletName')
    disconnectWallet()
    setStoredAddress('')
    setStoredConnected(false)
  }, [disconnectWallet])

  return {
    address,
    addresses,
    connected,
    loading,
    updateAddress,
    setDefaultAddress,
    removeAddress,
    disconnect,
  }
}
