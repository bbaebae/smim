const PROTECTED_PREFIXES = ['/dashboard', '/review', '/contents', '/library', '/plan']

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  )
}
