function tokenize(command) {
  const normalized = command.replace(/\\\r?\n/g, ' ').trim()
  const tokens = []
  let current = ''
  let quote = null
  let escaping = false

  for (const char of normalized) {
    if (escaping) {
      current += char
      escaping = false
      continue
    }

    if (char === '\\' && quote !== "'") {
      escaping = true
      continue
    }

    if (quote) {
      if (char === quote) {
        quote = null
      } else {
        current += char
      }
      continue
    }

    if (char === '"' || char === "'") {
      quote = char
    } else if (/\s/.test(char)) {
      if (current) {
        tokens.push(current)
        current = ''
      }
    } else {
      current += char
    }
  }

  if (escaping) current += '\\'
  if (quote) throw new Error('命令中存在未闭合的引号')
  if (current) tokens.push(current)
  return tokens
}

function pythonString(value) {
  return `'${String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')}'`
}

function pythonDict(entries, indent = '') {
  if (!entries.length) return '{}'
  const body = entries
    .map(([key, value]) => `${indent}    ${pythonString(key)}: ${pythonString(value)},`)
    .join('\n')
  return `{\n${body}\n${indent}}`
}

function pythonValue(value, indent = 0) {
  const padding = ' '.repeat(indent)
  const childPadding = ' '.repeat(indent + 4)

  if (value === null) return 'None'
  if (typeof value === 'boolean') return value ? 'True' : 'False'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return pythonString(value)
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    return `[\n${value.map((item) => `${childPadding}${pythonValue(item, indent + 4)},`).join('\n')}\n${padding}]`
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value)
    if (!entries.length) return '{}'
    return `{\n${entries.map(([key, item]) =>
      `${childPadding}${pythonString(key)}: ${pythonValue(item, indent + 4)},`
    ).join('\n')}\n${padding}}`
  }
  return pythonString(String(value))
}

function splitHeader(value) {
  const index = value.indexOf(':')
  if (index === -1) return [value.trim(), '']
  return [value.slice(0, index).trim(), value.slice(index + 1).trim()]
}

function flagValue(tokens, index, token) {
  const longWithValue = [
    '--request=', '--header=', '--data=', '--data-raw=', '--data-binary=',
    '--data-urlencode=', '--form=', '--user=', '--user-agent=', '--cookie=', '--url=',
    '--referer=', '--proxy='
  ]
  const prefix = longWithValue.find((item) => token.startsWith(item))
  if (prefix) return { value: token.slice(prefix.length), consumed: 0 }

  const shortFlags = ['-X', '-H', '-d', '-F', '-u', '-A', '-b', '-e', '-x']
  const short = shortFlags.find((item) => token.startsWith(item) && token !== item)
  if (short) return { value: token.slice(short.length), consumed: 0 }

  if (index + 1 >= tokens.length) throw new Error(`${token} 缺少参数`)
  return { value: tokens[index + 1], consumed: 1 }
}

export function parseCurl(command) {
  const tokens = tokenize(command)
  if (!tokens.length) throw new Error('请先输入 cURL 命令')

  const curlIndex = tokens.findIndex((token) => token === 'curl')
  if (curlIndex === -1) throw new Error('命令需要以 curl 开始')

  const result = {
    url: '',
    method: '',
    headers: [],
    data: [],
    forms: [],
    auth: null,
    get: false,
    verify: true,
    proxy: '',
  }

  for (let i = curlIndex + 1; i < tokens.length; i += 1) {
    const token = tokens[i]
    let item

    if (token === '-X' || token === '--request' || token.startsWith('--request=') || (/^-X.+/.test(token))) {
      item = flagValue(tokens, i, token)
      result.method = item.value.toUpperCase()
    } else if (token === '-H' || token === '--header' || token.startsWith('--header=') || (/^-H.+/.test(token))) {
      item = flagValue(tokens, i, token)
      result.headers.push(splitHeader(item.value))
    } else if (
      ['-d', '--data', '--data-raw', '--data-binary', '--data-urlencode', '--json'].includes(token)
      || /^-d.+/.test(token)
      || /^--(?:data|data-raw|data-binary|data-urlencode)=/.test(token)
    ) {
      item = flagValue(tokens, i, token)
      result.data.push(item.value)
      if (token === '--json' && !result.headers.some(([key]) => key.toLowerCase() === 'content-type')) {
        result.headers.push(['Content-Type', 'application/json'])
        result.headers.push(['Accept', 'application/json'])
      }
    } else if (token === '-F' || token === '--form' || token.startsWith('--form=') || (/^-F.+/.test(token))) {
      item = flagValue(tokens, i, token)
      result.forms.push(item.value)
    } else if (token === '-u' || token === '--user' || token.startsWith('--user=') || (/^-u.+/.test(token))) {
      item = flagValue(tokens, i, token)
      const separator = item.value.indexOf(':')
      result.auth = separator === -1
        ? [item.value, '']
        : [item.value.slice(0, separator), item.value.slice(separator + 1)]
    } else if (token === '-A' || token === '--user-agent' || token.startsWith('--user-agent=') || (/^-A.+/.test(token))) {
      item = flagValue(tokens, i, token)
      result.headers.push(['User-Agent', item.value])
    } else if (token === '-b' || token === '--cookie' || token.startsWith('--cookie=') || (/^-b.+/.test(token))) {
      item = flagValue(tokens, i, token)
      result.headers.push(['Cookie', item.value])
    } else if (token === '-e' || token === '--referer' || token.startsWith('--referer=') || (/^-e.+/.test(token))) {
      item = flagValue(tokens, i, token)
      result.headers.push(['Referer', item.value])
    } else if (token === '-x' || token === '--proxy' || token.startsWith('--proxy=') || (/^-x.+/.test(token))) {
      item = flagValue(tokens, i, token)
      result.proxy = item.value
    } else if (token === '--url' || token.startsWith('--url=')) {
      item = flagValue(tokens, i, token)
      result.url = item.value
    } else if (token === '-G' || token === '--get') {
      result.get = true
    } else if (token === '-I' || token === '--head') {
      result.method = 'HEAD'
    } else if (token === '-k' || token === '--insecure') {
      result.verify = false
    } else if (!token.startsWith('-') && !result.url) {
      result.url = token
    }

    if (item) i += item.consumed
  }

  if (!result.url) throw new Error('没有找到请求 URL')
  if (!result.method) {
    result.method = result.get ? 'GET' : (result.data.length || result.forms.length ? 'POST' : 'GET')
  }
  return result
}

function formEntries(forms) {
  return forms.map((form) => {
    const index = form.indexOf('=')
    return index === -1 ? [form, ''] : [form.slice(0, index), form.slice(index + 1)]
  })
}

export function curlToRequests(command) {
  const parsed = parseCurl(command)
  const lines = ['import requests', '', `url = ${pythonString(parsed.url)}`]
  const args = ['url']
  const contentType = parsed.headers.find(([key]) => key.toLowerCase() === 'content-type')?.[1]?.toLowerCase() || ''

  if (parsed.headers.length) {
    lines.push(`headers = ${pythonDict(parsed.headers)}`)
    args.push('headers=headers')
  }

  if (parsed.auth) {
    lines.push(`auth = (${pythonString(parsed.auth[0])}, ${pythonString(parsed.auth[1])})`)
    args.push('auth=auth')
  }

  if (parsed.forms.length) {
    const forms = formEntries(parsed.forms)
    const files = forms.filter(([, value]) => value.startsWith('@'))
    const fields = forms.filter(([, value]) => !value.startsWith('@'))
    if (fields.length) {
      lines.push(`data = ${pythonDict(fields)}`)
      args.push('data=data')
    }
    if (files.length) {
      const fileLines = files.map(([key, value]) =>
        `    ${pythonString(key)}: open(${pythonString(value.slice(1))}, 'rb'),`
      )
      lines.push(`files = {\n${fileLines.join('\n')}\n}`)
      args.push('files=files')
    }
  } else if (parsed.data.length) {
    const rawData = parsed.data.join('&')
    if (parsed.get) {
      lines.push(`params = ${pythonString(rawData)}`)
      args.push('params=params')
    } else if (contentType.includes('application/json')) {
      try {
        const json = JSON.parse(rawData)
        lines.push(`json_data = ${pythonValue(json)}`)
        args.push('json=json_data')
      } catch {
        lines.push(`data = ${pythonString(rawData)}`)
        args.push('data=data')
      }
    } else {
      lines.push(`data = ${pythonString(rawData)}`)
      args.push('data=data')
    }
  }

  if (parsed.proxy) {
    lines.push(`proxies = {'http': ${pythonString(parsed.proxy)}, 'https': ${pythonString(parsed.proxy)}}`)
    args.push('proxies=proxies')
  }
  if (!parsed.verify) args.push('verify=False')

  const method = parsed.method.toLowerCase()
  const call = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(method)
    ? `requests.${method}`
    : 'requests.request'
  if (call === 'requests.request') args.unshift(pythonString(parsed.method))

  lines.push('', `response = ${call}(`)
  args.forEach((arg) => lines.push(`    ${arg},`))
  lines.push(')', '', 'print(response.status_code)', 'print(response.text)')
  return lines.join('\n')
}
