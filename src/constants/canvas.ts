/** Native stream overlay design size (16:9) */
export const CANVAS_WIDTH = 1920
export const CANVAS_HEIGHT = 1080

export const CANVAS_ASPECT = CANVAS_WIDTH / CANVAS_HEIGHT

export function computeObsScale(viewportWidth: number, viewportHeight: number): number {
  if (viewportWidth <= 0 || viewportHeight <= 0) return 1
  return Math.min(viewportWidth / CANVAS_WIDTH, viewportHeight / CANVAS_HEIGHT)
}
