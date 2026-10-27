// Check production SEO hooks with public tool/redirect pages and artificial HTML.
// No full-site build, article loader, or member body is read.
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, open, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runInNewContext } from 'node:vm'
import config from '../docs/.vitepress/config.mjs'

async function readFrontmatter(file) {
  const byte = Buffer.alloc(1)
  const lines = []
  let line = []
  for (let offset = 0; offset < 65536; offset++) {
    const { bytesRead } = await file.read(byte, 0, 1, null)
    assert.ok(bytesRead, 'frontmatter must have a closing delimiter')
    if (byte[0] !== 10) { line.push(byte[0]); continue }
    const value = Buffer.from(line).toString('utf8').replace(/\r$/, '')
    line = []
    if (!lines.length) assert.equal(value, '---', 'page has frontmatter')
    else if (value === '---') return lines.slice(1).join('\n')
    lines.push(value)
  }
  throw new Error('frontmatter exceeds safety limit')
}
// Prove the guard cannot pre-read a protected body, for either line ending.
for (const newline of ['\n', '\r\n']) {
  const header = ['---', 'memberOnly: true', '---', ''].join(newline)
  const data = Buffer.from(header + 'BODY MUST NOT BE READ')
  let offset = 0
  assert.equal(await readFrontmatter({ read: async buffer => {
    assert.ok(offset < Buffer.byteLength(header))
    buffer[0] = data[offset++]
    return { bytesRead: 1 }
  } }), 'memberOnly: true')
  assert.equal(offset, Buffer.byteLength(header))
}

const ids = ['curl-requests', 'url', 'base64', 'o10', 'aaencode', 'jjencode', 'imagesplit']
const output = await mkdtemp(join(tmpdir(), 'tool-seo-check-'))
const origin = 'https://cpython666.github.io'
try {
  for (const folder of ['tools', 'spider-tools']) {
    for (const id of ['', ...ids]) {
      const suffix = id ? `${id}/` : ''
      const page = `${folder}/${suffix}index.md`
      const path = new URL(`../docs/${page}`, import.meta.url)
      const file = await open(path, 'r')
      let header
      try { header = await readFrontmatter(file) } finally { await file.close() }
      assert.ok(!/memberOnly:\s*['"]?true|privacy:[^\n]*会员可见/.test(header), `${page} is public`)
      const source = await readFile(path, 'utf8')
      assert.ok(source.includes('<SpiderTools') || source.includes('<LegacyToolRedirect'), 'the public page has its expected component')
      const frontmatter = Object.fromEntries([...header.matchAll(/^(\w+):\s*(.+)$/gm)].map(([, key, value]) => [key, value === 'true' ? true : value.replace(/^(["'])(.*)\1$/, '$2')]))
      // Explicit artificial date prevents a repository-wide Git metadata lookup.
      const pageData = { relativePath: page, frontmatter: { ...frontmatter, date: '2026-10-27' } }
      const head = await config.transformHead({ page, pageData })
      const url = `${origin}/tools/${suffix}`
      assert.deepEqual(head.filter(([tag, attrs]) => tag === 'link' && attrs.rel === 'canonical'), [['link', { rel: 'canonical', href: url }]])
      assert.ok(!head.some(([, attrs]) => attrs.name === 'robots' && attrs.content.includes('noindex')), 'both new pages and redirect aliases remain crawlable')
      if (folder === 'tools') {
        assert.equal(head.find(([, attrs]) => attrs.property === 'og:url')[1].content, url)
        assert.equal(head.find(([, attrs]) => attrs.name === 'description')[1].content, frontmatter.description)
        assert.equal(head.find(([, attrs]) => attrs.name === 'twitter:title')[1].content, frontmatter.title)
        assert.ok(!head.some(([, attrs]) => attrs['http-equiv']?.toLowerCase() === 'refresh'))
        if (id) {
          assert.equal(head.find(([, attrs]) => attrs.property === 'og:type')[1].content, 'website')
          const schema = JSON.parse(head.find(([tag, attrs]) => tag === 'script' && attrs.type === 'application/ld+json')[2])
          assert.equal(schema['@type'], 'WebApplication')
          assert.equal(schema.name, frontmatter.title)
          assert.equal(schema.url, url)
        }
      } else {
        const target = `/tools/${suffix}`
        assert.equal(frontmatter.redirect, target)
        const refresh = head.find(([tag, attrs]) => tag === 'meta' && attrs['http-equiv']?.toLowerCase() === 'refresh')
        assert.ok(refresh && new RegExp(`^0;\\s*url=${target}$`, 'i').test(refresh[1].content), 'a zero-delay refresh supports crawlers and no-JS browsers')
        const script = head.find(([tag, attrs, body]) => tag === 'script' && attrs.type !== 'application/ld+json' && typeof body === 'string')
        assert.ok(script && !script[1].async && !script[1].defer, 'redirect runs synchronously in head')
        const cases = [
          [`/spider-tools/${suffix}?source=legacy#guide`, `${target}?source=legacy#guide`],
          [`/spider-tools/${suffix}index.html?source=alias#guide`, `${target}?source=alias#guide`],
        ]
        if (!id) cases.push(
          ['/spider-tools/?source=hash#o10', '/tools/o10/?source=hash'],
          ['/spider-tools/index.html?source=alias#url', '/tools/url/?source=alias'],
          ['/spider-tools/#unknown-tool', '/tools/#unknown-tool'],
        )
        for (const [from, expected] of cases) {
          const input = new URL(from, origin)
          let replaced
          const location = { href: input.href, pathname: input.pathname, search: input.search, hash: input.hash, origin, replace: value => { replaced = value } }
          runInNewContext(script[2], { location, window: { location }, URL })
          assert.equal(new URL(replaced, origin).href, origin + expected, 'head redirect preserves the intended path/query/hash')
        }
      }
      await mkdir(join(output, folder, id), { recursive: true })
      await writeFile(join(output, folder, id, 'index.html'), '<!doctype html><title>Artificial fixture</title>')
    }
  }
  await config.buildEnd({ outDir: output })
  const sitemap = await readFile(join(output, 'sitemap.xml'), 'utf8')
  assert.equal((sitemap.match(/<loc>/g) || []).length, ids.length + 1)
  for (const id of ['', ...ids]) assert.ok(sitemap.includes(`<loc>${origin}/tools/${id ? id + '/' : ''}</loc>`))
  assert.ok(!sitemap.includes('/spider-tools/'), 'legacy redirect pages never enter sitemap')
  assert.ok(!sitemap.includes('#'), 'sitemap contains page URLs, not fragments')
  console.log('PASS: new tool canonical/social/schema/sitemap; 8 legacy synchronous redirects, query/hash/index aliases and no-JS refresh; frontmatter guards stop before protected bodies.')
} finally {
  await rm(output, { recursive: true, force: true })
}
