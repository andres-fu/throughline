export interface ExportPreset {
  label: string
  width: number
  height: number
}

export const EXPORT_PRESETS: ExportPreset[] = [
  { label: 'LinkedIn Featured (1584×396)', width: 1584, height: 396 },
  { label: 'LinkedIn Post (1200×627)',      width: 1200, height: 627 },
]

export function exportSvgToPng(
  svgEl: SVGSVGElement,
  preset: ExportPreset,
  filename = 'throughline.png',
): Promise<void> {
  return new Promise((resolve, reject) => {
    const svgW = svgEl.viewBox.baseVal.width  || svgEl.clientWidth
    const svgH = svgEl.viewBox.baseVal.height || svgEl.clientHeight

    const scaleX = preset.width  / svgW
    const scaleY = preset.height / svgH
    const scale  = Math.min(scaleX, scaleY)

    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svgEl)
    const blob   = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    const url    = URL.createObjectURL(blob)

    const img = new Image()
    img.onload = () => {
      const canvas  = document.createElement('canvas')
      canvas.width  = preset.width
      canvas.height = preset.height

      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, preset.width, preset.height)
      ctx.drawImage(img, 0, 0, svgW * scale, svgH * scale)

      URL.revokeObjectURL(url)
      canvas.toBlob(pngBlob => {
        if (!pngBlob) { reject(new Error('canvas.toBlob failed')); return }
        const a = document.createElement('a')
        a.href = URL.createObjectURL(pngBlob)
        a.download = filename
        a.click()
        URL.revokeObjectURL(a.href)
        resolve()
      }, 'image/png')
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG image load failed')) }
    img.src = url
  })
}
