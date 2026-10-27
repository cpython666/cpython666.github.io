// 由 scripts/build-skill.mjs 从 docs/tools/utils/o10.js 复制，请修改源文件后重新生成
// 兼容 Python-Project/O10加解密/O10encode.py 的 Unicode 码点编码。
export function o10Encode(text, pro = false) {
  const encoded = Array.from(text, char => char.codePointAt(0).toString(2)).join('O')
  return pro ? encoded.replace(/[10O]/g, char => ({ '1': 'I', '0': 'l', O: '1' })[char]) : encoded
}

export function o10Decode(text, pro = false) {
  if (!text) return ''
  const pattern = pro ? /^[Il]+(?:1[Il]+)*$/ : /^[01]+(?:O[01]+)*$/
  if (!pattern.test(text)) {
    throw new Error(pro
      ? 'Pro 编码只能包含大写 I、小写 l 和分隔符数字 1，不能有空分段。'
      : 'O10 编码只能包含数字 0、1 和分隔符大写 O，不能有空分段。')
  }
  const binary = pro ? text.replace(/[Il1]/g, char => ({ I: '1', l: '0', '1': 'O' })[char]) : text
  return binary.split('O').map(part => {
    const point = Number.parseInt(part, 2)
    if (point > 0x10ffff) throw new Error('编码中存在超出 Unicode 范围的字符。')
    return String.fromCodePoint(point)
  }).join('')
}
