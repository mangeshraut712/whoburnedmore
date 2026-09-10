/** Encode an SVG string as a data URI for live previews. */
export function encodeSvgDataUri(svgMarkup: string): string {
  const encoded = encodeURIComponent(svgMarkup)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}
