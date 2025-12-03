'use client'

import { useEffect } from 'react'
import Clarity from '@microsoft/clarity'

const ClarityAnalytics = () => {
  useEffect(() => {
    // Initialize Clarity with your project ID
    const projectId = 'ivoh94xolo'
    Clarity.init(projectId)
  }, [])

  return null
}

export default ClarityAnalytics