#!/usr/bin/env node
// O10 编码解码，与 https://cpython666.github.io/tools/#o10 同一份函数。
// 用法：node scripts/o10.mjs encode|decode [--pro] <文本>，文本也可从标准输入传入。
import { readFileSync } from 'node:fs'
import { o10Decode, o10Encode } from './lib/o10.mjs'

const args = process.argv.slice(2)
const pro = args.includes('--pro')
const [mode, ...rest] = args.filter((arg) => arg !== '--pro')
const text = rest.join(' ') || (process.stdin.isTTY ? '' : readFileSync(0, 'utf-8').replace(/\r?\n$/, ''))

if (!['encode', 'decode'].includes(mode) || !text) {
  console.error('用法：node scripts/o10.mjs encode|decode [--pro] <文本>')
  process.exit(1)
}

try {
  console.log(mode === 'encode' ? o10Encode(text, pro) : o10Decode(text.trim(), pro))
} catch (error) {
  console.error(`处理失败：${error.message}`)
  process.exit(1)
}
