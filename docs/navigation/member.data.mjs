import { createContentLoader } from 'vitepress'

const normalizeUrl = (url = '') => {
  const clean = url.split('#')[0].split('?')[0].replace(/\.html$/, '')
  if (clean.endsWith('/index')) return clean.replace(/\/index$/, '/')
  return clean
}

export default createContentLoader('**/*.md', {
  transform(pages) {
    return pages
      .filter((page) => page.frontmatter?.memberOnly === true || page.frontmatter?.memberOnly === 'true')
      .map((page) => normalizeUrl(page.url))
  },
})

