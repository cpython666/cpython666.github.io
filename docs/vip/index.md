---
title: 博客会员
layout: home
sidebar: false

---

<script setup>
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'

let alertifyRef = null
const loadAlertify = async () => {
  if (alertifyRef) return alertifyRef
  if (typeof window === 'undefined') return null
  const mod = await import('alertifyjs')
  alertifyRef = mod.default || mod
  return alertifyRef
}
const toast = async (type, msg) => {
  const al = await loadAlertify()
  if (!al) return
  if (al[type]) al[type](msg)
  else al.success(msg)
}
const showAccount = () => { toast('success', '加微：w021105x 备注：开通vip') }

const plans = ref([
  {
    name: '基础版',
    price: '¥0 / 永久',
    type: 'red',
    color: '#909399',
    buttonText: '免费用户',
    features: [
      { content: '精选广告', status: 1 },
      { content: '受限的功能和频率', status: 1 },
      { content: '全部资源的搜索', status: 1 },
      { content: '部分资源的浏览', status: 1 },
      { content: '阅读免费公开文章', status: 1 },
      { content: '获取项目源码', status: 0 },
      { content: '持续增加中～', status: 1 }
    ]
  },
  {
    name: '专业版',
    price: '¥66 / 永久',
    type: 'blue',
    color: '#409EFF',
    buttonText: '永久会员',
    features: [
      { content: '购买服务一律8折', status: 1 },
      { content: '永久会员标识', status: 1 },
      { content: '全部资源的搜索', status: 1 },
      { content: '全部资源的浏览', status: 1 },
      { content: '阅读VIP专属文章', status: 1 },
      { content: '找资源宝典：资源无界，打破信息壁垒', url: '/breakthrough-notes/resource-treasure-manual', status: 1 },
      { content: '会员专属-微信交流群', status: 1 },
      { content: '持续增加中～', status: 1 }
    ]
  },
  {
    name: '旗舰版',
    price: '¥99 / 永久',
    type: 'purple',
    color: '#8e44ad',
    buttonText: '至尊会员',
    features: [
      { content: '购买服务一律五折', status: 1 },
      { content: '至尊会员标识', status: 1 },
      { content: '专业版全部权益', status: 1 },
      { content: '全部项目源码：代理池和hyperliquid聪明钱追踪完全体最新版源码', status: 1 },
      { content: '技术咨询，路线规划', status: 1 },
      { content: '持续增加中～', status: 1 }
    ]
  }
])

const vipPosts = ref([
  { title: 'Docker笔记', path: '/backend/docker' },
  { title: '找资源宝典：资源无界，打破信息壁垒-说明', path: '/breakthrough-notes/resource-treasure-manual' },
  { title: 'P1-DrissionPage数据采集中间系统【源码及讲解】', path: '/spider/drissionpage-system/p1-system-source-guide' },
  { title: 'P2-自动化采集系统-体验优化', path: '/spider/drissionpage-system/p2-system-ux-optimization' },
  { title: 'P3-自动化采集系统功能丰富-支持截图，接口文档描述完善', path: '/spider/drissionpage-system/p3-screenshot-api-docs' },
  { title: 'P4-自动化采集系统代码优化-实例化浏览器管理类', path: '/spider/drissionpage-system/p4-browser-manager-refactor' },
  { title: 'P5-增加响应状态码-后续系统功能规划【自动化采集系统代码】', path: '/spider/drissionpage-system/p5-response-status-planning' },
  { title: '用Python手搓限流类-支持同步与异步，内存或者redis', path: '/python/libs/rate-limiter' },
  { title: 'P3-【开源自制】字幕提取器-OCR版-1.0，文案提取不再烦恼！', path: '/python/subtitle-extractor/p3-ocr-subtitle-extractor-1' },
  { title: 'P5-字幕提取器-OCR版-2.0，多线程，批量自动化，实现了真正的一步到位', path: '/python/subtitle-extractor/p5-ocr-subtitle-extractor-2' },
  { title: '数据采集系统的通用设计思路', path: '/spider/collection/data-collection-system-design' },
  { title: '通用爬虫介绍和实现思路', path: '/spider/collection/general-crawler-design' },
  { title: '网站数据采集-分析思路/流程', path: '/spider/collection/website-data-collection-analysis' }
])

const VIP_KEY = 'vp_member_unlock:*'
const readVipState = () => typeof window !== 'undefined' && localStorage.getItem(VIP_KEY) === '1'
const isVip = ref(readVipState())
const clearUnlock = () => {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(VIP_KEY); isVip.value = false; toast('success', '已清除会员解锁') } catch (_) {}
}
onMounted(async () => { isVip.value = readVipState(); await loadAlertify() })

const { theme } = useData()
const inputCode = ref('')
const actCfg = theme.value?.vipActivationHashes ?? (typeof __VIP_ACTIVATION_HASHES__ !== 'undefined' ? __VIP_ACTIVATION_HASHES__ : [])
const actList = Array.isArray(actCfg) ? actCfg : (typeof actCfg === 'string' ? [actCfg] : [])
const sha256 = async (s) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}
const activateVip = async () => {
  const v = inputCode.value.trim()
  if (!v) { toast('warning', '请输入激活码'); return }
  const items = actList.map(s => String(s))
  const allHex = items.every(x => /^[0-9a-fA-F]{64}$/.test(x))
  let ok = false
  if (allHex) {
    const h = await sha256(v)
    ok = items.map(s => s.toLowerCase()).includes(h.toLowerCase())
  } else {
    ok = items.includes(v)
  }
  if (ok) {
    localStorage.setItem(VIP_KEY, '1')
    isVip.value = true
    toast('success', '激活成功，VIP 已解锁')
  } else {
    toast('error', '激活码无效')
  }
}
</script>

<style scoped>
.vip-page { max-width: 1120px; margin: 16px auto; padding: 0 12px; }
.plans { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-top: 18px; align-items: stretch; }
.plan-card { position: relative; display: flex; flex-direction: column; min-height: 410px; padding: 24px 22px 20px; text-align: center; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 14px; box-shadow: var(--vp-shadow-1); transition: transform .2s, box-shadow .2s; }
.plan-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0, 0, 0, .1); }
.plan-card.is-featured { border: 2px solid #8e44ad; box-shadow: 0 10px 28px rgba(142, 68, 173, .18); }
.plan-card.is-featured::before { content: '推荐'; position: absolute; top: 14px; right: 14px; padding: 3px 9px; color: #fff; font-size: 12px; background: #8e44ad; border-radius: 999px; }
.plan-card h3 { margin: 0 0 6px; font-size: 24px; }
.plan-price { margin-bottom: 20px; color: var(--vp-c-text-2); font-size: 20px; }
.feature-list { flex: 1; list-style: none; padding: 0; margin: 0 0 18px; }
.feature-item { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; align-items: start; padding: 9px 0; text-align: left; line-height: 1.5; }
.feature-icon { padding-top: 2px; font-size: 14px; }
.feature-item.is-source { padding: 12px 10px; margin: 4px -10px; background: rgba(142, 68, 173, .08); border-radius: 8px; }
.vip-section { margin-top: 24px; }
.vip-tools { display: flex; gap: 8px; align-items: center; margin: 12px 0; }
.vip-activate { display: grid; grid-template-columns: 1fr auto; gap: 8px; max-width: 420px; }
.vip-alert { padding: 10px 12px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 8px; }
.vip-alert.is-ok { border-color: #67c23a; }
.vip-alert.is-warn { border-color: #e6a23c; }
.vip-input { box-sizing: border-box; width: 100%; padding: 8px 10px; color: var(--vp-c-text-1); background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 6px; }
.vip-button { padding: 8px 12px; color: #fff; cursor: pointer; background: var(--vp-c-brand-1); border: 0; border-radius: 6px; }
.vip-button.danger { background: #c45656; }
.vip-link { color: var(--vp-c-brand-1); text-decoration: none; }
.vip-table { width: 100%; margin-top: 12px; border-collapse: collapse; }
.vip-table th, .vip-table td { padding: 8px; text-align: left; border: 1px solid var(--vp-c-divider); }
@media (max-width: 760px) {
  .plans { grid-template-columns: 1fr; }
  .vip-tools, .vip-activate { display: flex; flex-direction: column; align-items: stretch; }
}
</style>

<div class="vip-page">
  <h1>博客会员</h1>
  <p>目前的开通方式是加我微信并备注开通 VIP，我会手动开通。【之前网站购买过vip的无需再次开通，找我要激活码即可】</p>
  <div class="vip-tools">
    <div class="vip-alert" :class="isVip ? 'is-ok' : 'is-warn'">会员状态：{{ isVip ? '已解锁' : '未解锁' }}</div>
    <button class="vip-button danger" type="button" @click="clearUnlock">清除会员解锁</button>
  </div>
  <div class="vip-activate">
    <input v-model="inputCode" class="vip-input" placeholder="输入激活码">
    <button class="vip-button" type="button" @click="activateVip">激活VIP</button>
  </div>
  <div class="plans">
    <section v-for="(plan, index) in plans" :key="index" class="plan-card" :class="{ 'is-featured': plan.name === '旗舰版' }">
      <h3>{{ plan.name }}</h3>
      <div class="plan-price">{{ plan.price }}</div>
      <ul class="feature-list">
        <li v-for="(feature, idx) in plan.features" :key="idx" class="feature-item" :class="{ 'is-source': feature.content.startsWith('全部项目源码') }">
          <span class="feature-icon" :style="{ color: feature.status ? '#67C23A' : '#F56C6C' }">{{ feature.status ? '✔︎' : '✘' }}</span>
          <a v-if="feature.url" class="vip-link" :href="feature.url" target="_blank">{{ feature.content }}</a>
          <template v-else>{{ feature.content }}</template>
        </li>
      </ul>
      <VipBtn :type="plan.type" :label="plan.buttonText" :color="'#fff'" @click="showAccount" />
    </section>
  </div>

  <div class="vip-section">
    <div class="vip-alert">友情提示：不是购买 VIP 不要添加联系方式。已经开源的代码都在 GitHub 和博客中，找不到的就是 VIP 专属，开通 VIP 我发给你。工作加班很忙，望理解！</div>
  </div>
  <div class="vip-section">
    <div class="vip-alert">友情提示：目前定价均为计划，并不代表最终上线的价格，我们的服务与盈利方式还在探索中，这可能是早鸟价，也可能永远是个计划，取决于开发进度。</div>
  </div>
  <div class="vip-section">
    <div class="vip-alert">友情提示：目前开通 VIP 支付方式是加我微信然后转账，我手动开通。</div>
  </div>

  <h2 class="vip-section">VIP 文章</h2>
  <table class="vip-table">
    <thead>
      <tr><th>标题</th><th>链接</th></tr>
    </thead>
    <tbody>
      <tr v-for="post in vipPosts" :key="post.path">
        <td>{{ post.title }}</td>
        <td><a class="vip-link" :href="post.path">{{ post.path }}</a></td>
      </tr>
    </tbody>
  </table>
</div>
