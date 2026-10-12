import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

// Waline 服务端地址（部署在 Vercel），留空时不渲染 Waline 评论区。
export const walineServerURL = 'https://cpython666-waline.vercel.app'

const commentHiddenPrefixes = [
  '/backup/',
  '/nav/',
  '/navigation/',
  '/projects/',
  '/spider-tools/',
  '/vip/',
  '/web-intro/',
  '/index/',
]

// giscus 与 Waline 共用的评论区显示规则。
export const useCommentEnabled = () => {
  const { frontmatter } = useData()
  const route = useRoute()
  return computed(() => route.path !== '/'
    && frontmatter.value.layout !== 'home'
    && frontmatter.value.comment !== false
    && !commentHiddenPrefixes.some((prefix) => route.path.startsWith(prefix)))
}
