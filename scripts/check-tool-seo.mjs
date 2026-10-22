// Check production SEO hooks with only the seven public tools and artificial HTML.
// No full-site build, article loader, or member body is read.
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import config from '../docs/.vitepress/config.mjs'

const ids = ['curl-requests', 'url', 'base64', 'o10', 'aaencode', 'jjencode', 'imagesplit']
const output = await mkdtemp(join(tmpdir(), 'tool-seo-check-'))
try {
  for (const id of ids) {
    const page = `spider-tools/${id}/index.md`
    const source = await readFile(new URL(`../docs/${page}`, import.meta.url), 'utf8')
    const header = source.match(/^---\n([\s\S]*?)\n---\n/)?.[1]
    assert.ok(header && !/memberOnly:\s*true|会员可见/.test(header))
    const frontmatter = Object.fromEntries([...header.matchAll(/^(\w+): (.+)$/gm)].map(([, key, value]) => [key, value === 'true' ? true : value]))
    // Explicit artificial date prevents a repository-wide Git metadata lookup.
    const pageData = { relativePath: page, frontmatter: { ...frontmatter, date: '2026-10-21' } }
    const head = await config.transformHead({ page, pageData })
    const url = `https://cpython666.github.io/spider-tools/${id}/`
    assert.deepEqual(head.filter(([tag, attrs]) => tag === 'link' && attrs.rel === 'canonical'), [['link', { rel: 'canonical', href: url }]])
    assert.equal(head.find(([, attrs]) => attrs.property === 'og:url')[1].content, url)
    assert.equal(head.find(([, attrs]) => attrs.property === 'og:type')[1].content, 'website')
    assert.equal(head.find(([, attrs]) => attrs.name === 'description')[1].content, frontmatter.description)
    assert.equal(head.find(([, attrs]) => attrs.name === 'twitter:title')[1].content, frontmatter.title)
    assert.ok(!head.some(([, attrs]) => attrs.name === 'robots' && attrs.content.includes('noindex')))
    const schema = JSON.parse(head.find(([tag, attrs]) => tag === 'script' && attrs.type === 'application/ld+json')[2])
    assert.equal(schema['@type'], 'WebApplication')
    assert.equal(schema.name, frontmatter.title)
    assert.equal(schema.url, url)
    await mkdir(join(output, 'spider-tools', id), { recursive: true })
    await writeFile(join(output, 'spider-tools', id, 'index.html'), '<!doctype html><title>Artificial fixture</title>')
  }
  await config.buildEnd({ outDir: output })
  const sitemap = await readFile(join(output, 'sitemap.xml'), 'utf8')
  assert.equal((sitemap.match(/<loc>/g) || []).length, ids.length)
  for (const id of ids) assert.ok(sitemap.includes(`<loc>https://cpython666.github.io/spider-tools/${id}/</loc>`))
  assert.ok(!sitemap.includes('#'), 'sitemap contains page URLs, not fragments')
  console.log('PASS: 7 independent canonical URLs, descriptions, social metadata, WebApplication schemas and sitemap entries (public tools only).')
} finally {
  await rm(output, { recursive: true, force: true })
}
