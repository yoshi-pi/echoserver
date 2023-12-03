import { createCanvas } from 'canvas';
export interface Rect {
  width: number;
  height: number;
}
export const createRectangle = (
  { width, height }: Rect = { width: 200, height: 200 },
  mimeType?: string
): Buffer => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, width, height);
  switch (mimeType?.toLowerCase()) {
    case 'image/png':
      return canvas.toBuffer('image/png');
    case 'image/jpeg':
      return canvas.toBuffer('image/jpeg');
    case 'application/pdf':
      return canvas.toBuffer('application/pdf');
    case 'raw':
      return canvas.toBuffer('raw');
    default:
      return canvas.toBuffer();
  }
};
