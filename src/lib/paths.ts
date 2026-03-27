/** Base path for GitHub Pages deployment. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prepend the base path to an internal link. */
export function href(path: string): string {
  if (path === '/') return BASE + '/';
  return BASE + path;
}
