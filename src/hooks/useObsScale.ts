import { useLayoutEffect, useState } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH, computeObsScale } from '@/constants/canvas'

export function useObsScale(enabled: boolean) {
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    if (!enabled) {
      setScale(1)
      return
    }

    const update = () => {
      setScale(computeObsScale(window.innerWidth, window.innerHeight))
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [enabled])

  useLayoutEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('obs-viewport')
      return
    }
    document.documentElement.classList.add('obs-viewport')
    return () => document.documentElement.classList.remove('obs-viewport')
  }, [enabled])

  return { scale, width: CANVAS_WIDTH, height: CANVAS_HEIGHT }
}
