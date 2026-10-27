#!/usr/bin/env node
// 把 cURL 命令转成 Python Requests 代码，与 https://cpython666.github.io/tools/#curl-requests 同一份函数。
// 用法：node scripts/curl-to-requests.mjs "<curl 命令>"，或通过标准输入传入。
import { readFileSync } from 'node:fs'
import { curlToRequests } from './lib/curl-to-requests.mjs'

const command = process.argv.slice(2).join(' ').trim() || (process.stdin.isTTY ? '' : readFileSync(0, 'utf-8'))

if (!command.trim()) {
  console.error('用法：node scripts/curl-to-requests.mjs "<curl 命令>"，或 pbpaste | node scripts/curl-to-requests.mjs')
  process.exit(1)
}

try {
  console.log(curlToRequests(command))
} catch (error) {
  console.error(`转换失败：${error.message}`)
  process.exit(1)
}
