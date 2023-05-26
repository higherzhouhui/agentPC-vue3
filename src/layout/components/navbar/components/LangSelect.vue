<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div :class='`disp ${className}`'>
      <img :src="icon" alt="country" class="imgs" />
      <div class="showText">{{ language }}</div>
      <el-icon><ArrowDown /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in staticLangulages" :disabled="language === item.language" :command="item">{{item.lable}}</el-dropdown-item> 
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppStore } from '@/store'
import { useI18n } from 'vue-i18n'
import cookies from '@/utils/cookies'
import ICON_ZH from '@/assets/imgs/zh.png'
import ICON_VI from '@/assets/imgs/vi.png'
const appStore = useAppStore()
const { t } = useI18n()

const staticLangulages = [
  {language: 'vi', icon: ICON_VI, lable: t('CUST.translate331'), acceptLang: 'vi-VN'},
  {language: 'zh', icon: ICON_ZH, lable: t('CUST.translate330'), acceptLang: 'zh-CN'},
];

const language = computed(() => {
  return appStore.lang
})

const icon = computed(() => {
  let icon = staticLangulages[0].icon
  staticLangulages.map(item => {
    if (item.language === appStore.lang) {
      icon =  item.icon
    }
  })
  return icon
})

const handleSetLanguage = (item) => {
  ElMessageBox.confirm(`${t('CUST.translate328')}${item.lable}？`)
  .then(async () => {
    cookies.set('lang', item.language)
    cookies.set('acceptLang', item.acceptLang)
    ElMessage({
      message: t('CUST.translate329'),
      type: 'info',
      duration: '3000',
    })
    setTimeout(() => {
      //必须重载页面，获取对应语言的返回数据
      window.location.reload()
    }, 200);
  })
  .catch(() => {
    // catch error
  })
  // appStore.SET_LANG(val)
  // locale.value = val


}

defineProps({
  className: {
    type: String,
    default: ''
  }
})

defineOptions({
  name: 'LangSelect',
})
</script>

<style lang="scss" scoped>
.disp {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.imgs {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  margin-right: 10px;
}
.showText {
  opacity: 0.9;
  font-size: 16px;
  cursor: pointer;
}
.el-icon {
  font-size: 12px;
  margin-left: 4px;
}

.langBecomeWhite {
  .showText {
    color: #fff;
  }
  .el-icon {
    color: #fff !important;
  }
}
</style>
