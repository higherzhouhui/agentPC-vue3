// see more : https://vue-i18n.intlify.dev/introduction.html
import { createI18n } from 'vue-i18n'
// import { createI18n } from 'vue-i18n/index'
import messages from './getMessage'
import cookies from '@/utils/cookies'

const localeData = {
  legacy: false, // composition API
  locale: cookies.get('lang') === 'zh' ? 'zh' : 'vi',
  globalInjection: true, // 全局模式，可以直接使用 $t
  messages
}

export const i18n = createI18n(localeData)

export function setupI18n(app) {
  app.use(i18n)
}

export function translateTitle(title) {
  const { t, te } = i18n.global
  if (te(`${title}`)) return t(`${title}`)
  return title;
}