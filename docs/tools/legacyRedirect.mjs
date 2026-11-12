// Also serialized into the old page's head, before the zero-delay refresh.
export function redirectLegacyTool(target) {
  let hash = window.location.hash
  const ids = ['curl-requests', 'url', 'base64', 'o10', 'aaencode', 'jjencode', 'imagesplit']
  if (target === '/tools/' && ids.includes(hash.slice(1))) {
    target += hash.slice(1) + '/'
    hash = ''
  }
  window.location.replace(target + window.location.search + hash)
}
