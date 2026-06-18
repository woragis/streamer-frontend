import { CANVAS_WIDTH } from '@/constants/canvas'
import {
  CODES_CHAT_H,
  CODES_CONTENT_H,
  CODES_CONTENT_PAD,
  CODES_FOOTER_H,
  CODES_HEADER_H,
  CODES_SIDEBAR_RIGHT_W,
  CODES_WEBCAM_H,
  CODES_WIDGET_GAP,
} from '@/constants/codes-layout'
import {
  CAL_CHAT_H,
  CAL_CONTENT_GAP,
  CAL_CONTENT_H,
  CAL_CONTENT_PAD,
  CAL_FOOTER_H,
  CAL_HEADER_H,
  CAL_PIP_H,
  CAL_PIP_W,
  CAL_SIDEBAR_RIGHT_W,
} from '@/constants/cal-layout'
import type { CalContentLayout } from '@/stores/types'

export type FrameRect = {
  x: number
  y: number
  width: number
  height: number
}

function codesSidebarX(): number {
  return CANVAS_WIDTH - CODES_CONTENT_PAD - CODES_SIDEBAR_RIGHT_W
}

function codesInnerTop(): number {
  return CODES_HEADER_H + CODES_CONTENT_PAD
}

function codesInnerHeight(): number {
  return CODES_CONTENT_H - 2 * CODES_CONTENT_PAD
}

/** Sidebar webcam slot (pinned bottom, above chat). */
export function getCodesWebcamRect(): FrameRect {
  const innerTop = codesInnerTop()
  const innerHeight = codesInnerHeight()
  const chatTop = innerTop + innerHeight - CODES_CHAT_H
  const camTop = chatTop - CODES_WIDGET_GAP - CODES_WEBCAM_H
  return {
    x: codesSidebarX(),
    y: camTop,
    width: CODES_SIDEBAR_RIGHT_W,
    height: CODES_WEBCAM_H,
  }
}

export function getCodesChatRect(): FrameRect {
  const innerTop = codesInnerTop()
  const innerHeight = codesInnerHeight()
  const chatTop = innerTop + innerHeight - CODES_CHAT_H
  return {
    x: codesSidebarX(),
    y: chatTop,
    width: CODES_SIDEBAR_RIGHT_W,
    height: CODES_CHAT_H,
  }
}

function calSidebarX(): number {
  return CANVAS_WIDTH - CAL_CONTENT_PAD - CAL_SIDEBAR_RIGHT_W
}

function calInnerTop(): number {
  return CAL_HEADER_H + CAL_CONTENT_PAD
}

function calInnerHeight(): number {
  return CAL_CONTENT_H - 2 * CAL_CONTENT_PAD
}

export function getCalChatRect(): FrameRect {
  const innerTop = calInnerTop()
  const innerHeight = calInnerHeight()
  const chatTop = innerTop + innerHeight - CAL_CHAT_H
  return {
    x: calSidebarX(),
    y: chatTop,
    width: CAL_SIDEBAR_RIGHT_W,
    height: CAL_CHAT_H,
  }
}

export function getCalContentZoneRect(): FrameRect {
  const innerTop = calInnerTop()
  const innerLeft = CAL_CONTENT_PAD
  const innerHeight = calInnerHeight()
  const contentWidth =
    CANVAS_WIDTH - 2 * CAL_CONTENT_PAD - CAL_CONTENT_GAP - CAL_SIDEBAR_RIGHT_W
  return {
    x: innerLeft,
    y: innerTop,
    width: contentWidth,
    height: innerHeight,
  }
}

export function getCalCameraRect(layout: CalContentLayout): FrameRect {
  const zone = getCalContentZoneRect()
  switch (layout) {
    case 'workout-only':
      return zone
    case 'split': {
      const w = Math.floor((zone.width - CAL_CONTENT_GAP) / 2)
      return { x: zone.x, y: zone.y, width: w, height: zone.height }
    }
    case 'react-primary':
      return {
        x: zone.x + 16,
        y: zone.y + zone.height - CAL_PIP_H - 16,
        width: CAL_PIP_W,
        height: CAL_PIP_H,
      }
    default:
      return zone
  }
}

export function getCalReactPanelRect(layout: CalContentLayout): FrameRect | null {
  const zone = getCalContentZoneRect()
  switch (layout) {
    case 'workout-only':
      return null
    case 'split': {
      const w = Math.floor((zone.width - CAL_CONTENT_GAP) / 2)
      return {
        x: zone.x + w + CAL_CONTENT_GAP,
        y: zone.y,
        width: w,
        height: zone.height,
      }
    }
    case 'react-primary':
      return {
        x: zone.x,
        y: zone.y,
        width: zone.width,
        height: zone.height - CAL_PIP_H - 24,
      }
  }
}

/** Canvas dimensions for frame-only routes. */
export const FRAME_CANVAS = {
  width: CANVAS_WIDTH,
  height: 1080,
  footerH: CODES_FOOTER_H,
  calFooterH: CAL_FOOTER_H,
}
