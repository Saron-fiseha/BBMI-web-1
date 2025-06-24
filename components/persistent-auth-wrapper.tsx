"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useEffect, useState } from "react"

interface PersistentAuthWrapperProps {
  children: React.ReactNode
}

export function PersistentAuthWrapper({ children }: PersistentAuthWrapperProps) {
  const { loading, checkAuth } = useAuth()
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth()
      setInitialLoad(false)
    }

    if (initialLoad) {
      initAuth()
    }
  }, [checkAuth, initialLoad])

  // Show loading spinner only on initial page load
  if (initialLoad && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-charcoal/60">Loading BBMI...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
