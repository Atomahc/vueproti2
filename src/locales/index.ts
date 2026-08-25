import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'
import ru from './ru'
import kk from './kk'

// 默认语言配置变量
export const defaultLanguage = 'zh'

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: defaultLanguage,
  fallbackLocale: 'zh',
  messages: {
    zh,
    en,
    ru,
    kk
  }
})

export default i18n
