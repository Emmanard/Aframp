import React from 'react'

export function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded bg-primary/10 animate-pulse ${className ?? ''}`} />
}
