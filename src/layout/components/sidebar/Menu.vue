<template>
  <!--   :collapse="set.isCollapse && set.layoutMod === 'vertical'" -->
  <el-menu
    active-text-color="#5F2AE0"
    background-color="#F5F7FE"
    text-color="#666666"
    :default-active="set.activeMenu"
    :unique-opened="true"
    :collapse-transition="false"
    :mode="set.layoutMod"
    class="sidebar-menus"
    @open="handleOpen"
  >
    <SidebarItem v-for="item in set.routerLists" :key="item.path" :item="item" :base-path="item.path" />
  </el-menu>
</template>

<script setup>
import { computed, reactive } from 'vue'
import variables from '@/styles/variables.module.scss'
import SidebarItem from './SidebarItem'

import { useRoute } from 'vue-router'
import { useAppStore, useSettingsStore, usePermissionStore } from '@/store'

const route = useRoute()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()

const set = reactive({
  layoutMod: computed(() => {
    return settingsStore.layoutMod
  }),
  isCollapse: computed(() => {
    return !appStore.sidebar.opened
  }),
  activeMenu: computed(() => {
    const { meta, path } = route
    if (meta.activeMenu) {
      return meta.activeMenu
    }
    return path
  }),
  routerLists: computed(() => {
    return permissionStore.routes
  }),
})

// 替换图标
const handleOpen = log => {
  let data = [...permissionStore.routes]
  data.forEach(value => {
    if (value.redirect !== undefined && value.redirect.indexOf(log) !== -1) {
      value.Check = true
    } else {
      value.Check = false
    }
  })
  permissionStore.routes = data
}
</script>

<style scoped lang="scss">
.horizontal-logo {
  width: 210px;
  display: flex;
}
.scrollbar-wrapper {
  /*width: calc(  );*/
}
</style>
