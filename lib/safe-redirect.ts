/**
 * Returns a same-origin path to redirect to. Rejects absolute URLs, protocol-relative
 * paths ("//evil.com"), backslash tricks and control characters (open-redirect defence).
 */
export function safeReturnPath(candidate: unknown, referer: string | null, origin: string): string {
  if (typeof candidate === "string" && isSafePath(candidate)) return candidate;
  if (referer) {
    try {
      const url = new URL(referer);
      if (url.origin === origin && isSafePath(url.pathname)) return url.pathname + url.search;
    } catch {
      /* ignore malformed referer */
    }
  }
  return "/";
}

export function isSafePath(path: string): boolean {
  return (
    path.length > 0 &&
    path.length <= 2048 &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("\\") &&
    !/[\u0000-\u001f\u007f]/.test(path)
  );
}
