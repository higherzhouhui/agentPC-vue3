<template>
  <!-- home-title.png -->
  <div :class="{ 'has-logo': set.showLogo }" style="height: calc(100vh - 40px)">
    <Logo :class="set.layoutMod + '-logo'" v-if="set.showLogo" :collapse="set.isCollapse" />
    <el-scrollbar>
      <Menu />
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useAppStore, useSettingsStore } from '@/store'
import Logo from './Logo'
import Menu from './Menu'

const appStore = useAppStore()
const settingsStore = useSettingsStore()

const set = reactive({
  showLogo: computed(() => {
    return settingsStore.sidebarLogo
  }),
  layoutMod: computed(() => {
    return settingsStore.layoutMod
  }),
  isCollapse: computed(() => {
    return !appStore.sidebar.opened
  }),
})

console.log(set.showLogo)
</script>

<style scoped lang="scss">
.horizontal-logo {
  width: 210px;
  display: flex;
}
</style>
