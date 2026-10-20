import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../docs/spider-tools/utils/o10.js', import.meta.url), 'utf8')
const { o10Encode, o10Decode } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)

// 固定样例来自 Python-Project 的 O10encode.py，防止 JS 的 UTF-16 遍历改变编码。
for (const [text, standard, pro] of [
  ['AB', '1000001O1000010', 'IlllllI1IllllIl'],
  ['中', '100111000101101', 'IllIIIlllIlIIlI'],
  ['😀', '11111011000000000', 'IIIIIlIIlllllllll'],
  ['\n', '1010', 'IlIl'],
  ['\0', '0', 'l'],
]) {
  for (const [mode, expected] of [[false, standard], [true, pro]]) {
    assert.equal(o10Encode(text, mode), expected)
    assert.equal(o10Decode(expected, mode), text)
  }
}

for (const text of ['', '你好，世界😄', 'O01 Il1', 'a b\t\r\n', 'e\u0301 👨‍👩‍👧‍👦', '\uFEFF', String.fromCodePoint(0x10ffff)]) {
  for (const pro of [false, true]) assert.equal(o10Decode(o10Encode(text, pro), pro), text)
}
for (const invalid of ['2', '10abc', 'O1', '1O', '1OO0', '10 01', '1'.repeat(22)]) {
  assert.throws(() => o10Decode(invalid), Error)
}
for (const invalid of ['O', '0', 'I11l', '1I', 'I1', 'I l', 'I'.repeat(22)]) {
  assert.throws(() => o10Decode(invalid, true), Error)
}
console.log('PASS: O10 / Pro Python samples, Unicode round-trips, empty input and invalid encoding checks.')
