export function cloudinaryImage(
  url: string | undefined,
  width: number,
  height: number = width
): string {
  if (!url || !url.includes('/image/upload/')) {
    return url || '';
  }

  const marker = '/image/upload/';
  const index = url.indexOf(marker);
  const prefix = url.slice(0, index + marker.length);
  const remainder = url.slice(index + marker.length);

  return `${prefix}c_fill,w_${width},h_${height},q_auto,f_auto/${remainder}`;
}
