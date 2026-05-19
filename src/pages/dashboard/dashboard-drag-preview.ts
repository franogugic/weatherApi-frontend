import type { DragEvent } from "react"

export function setDashboardDragPreview(
  event: DragEvent<HTMLElement>,
  sourceElement: HTMLElement,
  options?: {
    width?: number
    height?: number
    offsetX?: number
    offsetY?: number
  },
) {
  const preview = sourceElement.cloneNode(true) as HTMLElement
  const sourceRect = sourceElement.getBoundingClientRect()
  const width = options?.width ?? sourceRect.width
  const height = options?.height ?? sourceRect.height

  preview.style.position = "fixed"
  preview.style.top = "-10000px"
  preview.style.left = "-10000px"
  preview.style.width = `${width}px`
  preview.style.height = `${height}px`
  preview.style.pointerEvents = "none"
  preview.style.opacity = "0.92"
  preview.style.transform = "translateZ(0)"

  document.body.appendChild(preview)
  event.dataTransfer.setDragImage(
    preview,
    options?.offsetX ?? Math.min(sourceRect.width / 2, 260),
    options?.offsetY ?? Math.min(sourceRect.height / 2, 180),
  )

  window.setTimeout(() => {
    preview.remove()
  }, 0)
}

export function createDashboardPaletteDragPreview(label: string) {
  const preview = document.createElement("div")
  preview.textContent = label
  preview.style.position = "fixed"
  preview.style.top = "-10000px"
  preview.style.left = "-10000px"
  preview.style.maxWidth = "180px"
  preview.style.padding = "10px 14px"
  preview.style.borderRadius = "999px"
  preview.style.border = "1px solid rgba(255,255,255,0.16)"
  preview.style.background = "rgba(31,32,38,0.96)"
  preview.style.boxShadow = "0 16px 36px rgba(0,0,0,0.35)"
  preview.style.color = "white"
  preview.style.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  preview.style.pointerEvents = "none"
  preview.style.whiteSpace = "nowrap"

  return preview
}
