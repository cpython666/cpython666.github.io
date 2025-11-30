---
title: 博客会员
layout: home
sidebar: false

---

<script setup>
import { ref, onMounted } from 'vue'
import alertify from 'alertifyjs'
import { useData } from 'vitepress'

const showAccount = () => {
  alertify.success('加微：w021105x 备注：购买博客VIP')
}

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
      { content: '全部项目源码', status: 1 },
      { content: '找资源宝典：资源无界，打破信息壁垒', url: '/blog/bNExJ', status: 1 },
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
      { content: '技术咨询，路线规划', status: 1 },
      { content: '持续增加中～', status: 1 }
    ]
  }
])

const vipPosts = ref([
  { title: 'Docker笔记', path: '/backend/docker' }
])

const VIP_KEY = 'vp_member_unlock:*'
const isVip = ref(localStorage.getItem(VIP_KEY) === '1')
const clearUnlock = () => {
  try { localStorage.removeItem(VIP_KEY); isVip.value = false; alertify.success('已清除会员解锁') } catch (_) {}
}
onMounted(() => { isVip.value = localStorage.getItem(VIP_KEY) === '1' })

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
  if (!v) { alertify.warning('请输入激活码'); return }
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
    alertify.success('激活成功，VIP 已解锁')
  } else {
    alertify.error('激活码无效')
  }
}
</script>

<style scoped>
.vip-page { max-width: 1120px; margin: 16px auto; padding: 0 12px; }
.plan-card { text-align: center; }
.feature-list { list-style: none; padding: 0; margin: 0; }
.feature-item { display: grid; grid-template-columns: 24px auto; gap: 8px; align-items: center; padding: 6px 0; }
.feature-icon { font-size: 14px; }
.vip-section { margin-top: 24px; }
.vip-tools { display: flex; gap: 8px; align-items: center; margin: 12px 0; }
.vip-activate { display: grid; grid-template-columns: 1fr auto; gap: 8px; max-width: 420px; }
</style>

<div class="vip-page">
  <h1>博客会员</h1>
  <p>目前的开通方式是加我微信并备注开通 VIP，我会手动开通。【之前网站购买过vip的无需再次开通，找我要激活码即可】</p>
  <div class="vip-tools">
    <el-alert :title="'会员状态：' + (isVip ? '已解锁' : '未解锁')" :type="isVip ? 'success' : 'warning'" show-icon />
    <el-button size="small" type="danger" plain @click="clearUnlock">清除会员解锁</el-button>
  </div>
  <div class="vip-activate">
    <el-input v-model="inputCode" placeholder="输入激活码"></el-input>
    <el-button type="primary" @click="activateVip">激活VIP</el-button>
  </div>
  <el-row :gutter="16">
    <el-col v-for="(plan, index) in plans" :key="index" :xs="24" :sm="12" :md="8">
      <el-card class="plan-card" shadow="hover">
        <h3>{{ plan.name }}</h3>
        <div>{{ plan.price }}</div>
        <ul class="feature-list">
          <li v-for="(feature, idx) in plan.features" :key="idx" class="feature-item">
            <span class="feature-icon" :style="{ color: feature.status ? '#67C23A' : '#F56C6C' }">{{ feature.status ? '✔︎' : '✘' }}</span>
            <template v-if="feature.url">
              <el-link :href="feature.url" target="_blank">{{ feature.content }}</el-link>
            </template>
            <template v-else>{{ feature.content }}</template>
          </li>
        </ul>
        <VipBtn :type="plan.type" :label="plan.buttonText" :color="'#fff'" @click="showAccount" />
      </el-card>
    </el-col>
  </el-row>

  <div class="vip-section">
    <el-alert title="友情提示" type="info" description="不是购买 VIP 不要添加联系方式。已经开源的代码都在 GitHub 和博客中，找不到的就是 VIP 专属，开通 VIP 我发给你。工作加班很忙，望理解！" show-icon/>
  </div>
  <div class="vip-section">
    <el-alert title="友情提示" type="info" description="目前定价均为计划，并不代表最终上线的价格，我们的服务与盈利方式还在探索中，这可能是早鸟价，也可能永远是个计划，取决于开发进度。" show-icon/>
  </div>
  <div class="vip-section">
    <el-alert title="友情提示" type="info" description="目前开通 VIP 支付方式是加我微信然后转账，我手动开通。" show-icon/>
  </div>

  <h2 class="vip-section">VIP 文章</h2>
  <el-table :data="vipPosts" size="small" style="width: 100%">
    <el-table-column prop="title" label="标题"/>
    <el-table-column label="链接">
      <template #default="scope">
        <el-link :href="scope.row.path">{{ scope.row.path }}</el-link>
      </template>
    </el-table-column>
  </el-table>
</div>
