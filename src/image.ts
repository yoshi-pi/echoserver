import { createCanvas } from 'canvas'
interface Rect {
  width: number;
  height: number;
}
export const createRectangle = (
  { width, height }: Rect = { width: 200, height: 200 }
) => {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#00b894'
  ctx.fillRect(0, 0, width, height)
  return canvas.toBuffer()
}
