# 赞助
> OKX 钱包 账户6
> 
> 赞助本博客，可以获取UP的好友位，加好友备注赞助交易截图  
> wx: w021105x

  <CopyButton label="Ethereum" text="0x730bc48d0d110d31be8e08ddc6451e7a22b0341a" />

  <CopyButton label="Solana" text="5CAqxFDpiN7rFPBE2N2bExwUJypHV7j9PW1qGusFg1WL" />

  <CopyButton label="Tron" text="TPELa5u5Gf2tWCtfPVeWvWZDbWD5mXPiue" />

  <CopyButton label="Aptos" text="0x6bb78127ef609ec4a3e0727c0a710b44d97528bdb5bf4d3e26dfbdce686c4996" />

  <CopyButton label="Arbitrum One" text="0x730bc48d0d110d31be8e08ddc6451e7a22b0341a" />

  <CopyButton label="Base" text="0x730bc48d0d110d31be8e08ddc6451e7a22b0341a" />
  <CopyButton label="BNB Chain" text="0x730bc48d0d110d31be8e08ddc6451e7a22b0341a" />

<script setup>
import CopyButton from '../../components/CopyButton.vue';

const copy_text = (text = '') => {
  try {
    return navigator.clipboard
      .writeText(text)
      .then(() => {
        return Promise.resolve()
      })
      .catch((err) => {
        console.error('复制失败：', err)
        return Promise.reject(err)
      })
  } catch (e) {
    // console.log('navigator.clipboard', e)
    let input = document.createElement('input')
    input.style.position = 'fixed'
    input.style.top = '-10000px'
    input.style.zIndex = '-999'
    document.body.appendChild(input)
    console.log('input', input)
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
      return Promise.reject('当前浏览器不支持复制功能，请检查更新或更换其他浏览器操作')
    }
  }
}
</script>
