// .vitepress/theme/utils/copy.js
const copy_text = (text = '') => {

  try {
    return navigator.clipboard
      .writeText(text)
      .then(() => Promise.resolve())
      .catch((err) => {
        console.error('复制失败：', err)
        return Promise.reject(err)
      })
  } catch (e) {
    let input = document.createElement('input')
    input.style.position = 'fixed'
    input.style.top = '-10000px'
    input.style.zIndex = '-999'
    document.body.appendChild(input)
    input.value = text
    input.focus()
    input.select()
    try {
      let result = document.execCommand('copy')
      document.body.removeChild(input)
      if (!result || result === 'unsuccessful') {
        return Promise.reject('复制失败')
      } else {
        return Promise.resolve()
      }
    } catch (e) {
      document.body.removeChild(input)
      return Promise.reject('当前浏览器不支持复制功能')
    }
  }
}
