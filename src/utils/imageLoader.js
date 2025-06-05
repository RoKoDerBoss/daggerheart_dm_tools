// Custom image loader for static export
export default function imageLoader({ src, width, quality }) {
  // For static export, we just return the original src
  // This ensures images work correctly on static hosting
  return src
} 