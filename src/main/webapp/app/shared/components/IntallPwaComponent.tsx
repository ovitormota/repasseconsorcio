import { Button } from '@mui/material'
import React from 'react'
import { useEffect, useState } from 'react'

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 */
interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: Array<string>

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<void>
}

function useAddToHomescreenPrompt(): [BeforeInstallPromptEvent | null, () => void] {
  const [prompt, setState] = useState<BeforeInstallPromptEvent | null>(null)

  const promptToInstall = () => {
    if (prompt) {
      return prompt.prompt()
    }
    return Promise.reject(new Error('Tried installing before browser sent "beforeinstallprompt" event'))
  }

  useEffect(() => {
    const ready = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setState(e)
    }

    window.addEventListener('beforeinstallprompt', ready as any)

    return () => {
      window.removeEventListener('beforeinstallprompt', ready as any)
    }
  }, [])

  return [prompt, promptToInstall]
}

export const IntallPwaComponent = () => {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [isPromptVisible, setIsPromptVisible] = useState(false)

  useEffect(() => {
    console.log('prompt', prompt)
    if (prompt) {
      setIsPromptVisible(true)
    }
  }, [prompt])

  return isPromptVisible && <Button onClick={promptToInstall}>Install</Button>
}
