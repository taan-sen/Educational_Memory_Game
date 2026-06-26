export interface Rect {
  left: number
  top: number
  right: number
  bottom: number
}

function area(rect: Rect): number {
  return Math.max(0, rect.right - rect.left) * Math.max(0, rect.bottom - rect.top)
}

function intersection(a: Rect, b: Rect): Rect {
  return {
    left: Math.max(a.left, b.left),
    top: Math.max(a.top, b.top),
    right: Math.min(a.right, b.right),
    bottom: Math.min(a.bottom, b.bottom),
  }
}

export function rectFromDOMRect(dom: DOMRect): Rect {
  return {
    left: dom.left,
    top: dom.top,
    right: dom.right,
    bottom: dom.bottom,
  }
}

export function overlapRatio(a: Rect, b: Rect): number {
  const inter = intersection(a, b)
  const interArea = area(inter)
  const minArea = Math.min(area(a), area(b))
  if (minArea === 0) return 0
  return interArea / minArea
}

export function meetsOverlapThreshold(
  a: Rect,
  b: Rect,
  threshold: number,
): boolean {
  return overlapRatio(a, b) >= threshold
}
