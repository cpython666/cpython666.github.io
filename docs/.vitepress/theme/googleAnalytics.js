import { onMounted, watch, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'

let initialized = false
let previousPage = ''

export function useGoogleAnalytics() {
  const { theme, title } = useData()
  const route = useRoute()

  function trackPage() {
    const id = theme.value.googleAnalyticsId
    if (!import.meta.env.PROD || typeof window === 'undefined'
      || location.origin !== 'https://cpython666.github.io' || !/^G-[A-Z0-9]+$/.test(id || '')) return

    // Only page metadata is sent; query strings, hashes and page content stay local.
    const pageLocation = location.origin + location.pathname
    if (pageLocation === previousPage) return
    let referrer = previousPage
    if (!referrer && document.referrer) {
      try { referrer = new URL(document.referrer).origin } catch { /* No valid referring origin. */ }
    }
    const page = { page_title: title.value, page_location: pageLocation, page_referrer: referrer }
    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments) }
    window.gtag('set', page)
    if (!initialized) {
      window.gtag('js', new Date())
      window.gtag('config', id, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      })
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
      document.head.appendChild(script)
      initialized = true
    }
    window.gtag('event', 'page_view', { ...page, send_to: id })
    previousPage = pageLocation
  }

  onMounted(trackPage)
  watch(() => route.path, () => nextTick(trackPage))
}
