<template>
  <div v-if="!props.item.hidden">
    <el-menu>
      <template
        v-if="
          hasOneShowingChild(props.item.children, props.item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !props.item.alwaysShow
        "
      >
        <AppLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
          <el-menu-item :class="{ 'submenu-title-noDropdown': !props.isNest }" class="menu-item">
            <!-- <svg-icon
              class-name="menu-icons"
              v-if="onlyOneChild.meta.icon || (props.item.meta && props.item.meta.icon)"
              :icon-class="onlyOneChild.meta.icon || (props.item.meta && props.item.meta.icon)"
            /> -->
            <!-- <img
              class="menu-icons"
              :src="onlyOneChild.meta.icon || (props.item.meta && props.item.meta.icon)"
              alt=""
              v-if="onlyOneChild.meta.icon || (props.item.meta && props.item.meta.icon)"
            /> -->

            <img
              class="menu-icons"
              :src="
                props.item.Check
                  ? onlyOneChild?.meta?.icon
                    ? onlyOneChild?.meta?.icon[1]
                    : dls
                  : onlyOneChild?.meta?.icon
                  ? onlyOneChild?.meta?.icon[0]
                  : dl
              "
              alt=""
              v-if="onlyOneChild.meta.icon !== undefined || (props.item.meta && props.item.meta.icon)"
            />
            <template #title>
              <span> {{ onlyOneChild.meta.title }}</span>
            </template>
          </el-menu-item>
        </AppLink>
      </template>
      <el-sub-menu v-else ref="subMenu" popper-class="sub-menu-test">
        <template #title>
          <!-- <svg-icon
            class-name="menu-icons"
            v-if="props.item.meta && props.item.meta.icon"
            :icon-class="props.item.meta && props.item.meta.icon"
          /> -->
          <img
            class="menu-icons"
            :src="props.item.meta && props.item.Check ? props.item.meta?.icon[1] : props.item.meta?.icon[0]"
            v-if="props.item.meta && props.item.meta.icon"
          />
          <span> {{ props.item.meta.title }}</span>
        </template>
        <SidebarItem
          v-for="child in props.item.children"
          :key="child.path"
          :is-nest="true"
          :item="child"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import path from 'path-browserify'
import { isExternal } from '@/utils/validate'
import AppLink from './Link.vue'
import dl from '@/assets/imgs/sy/dl.png'
import dls from '@/assets/imgs/sy/dls.png'
// eslint-disable-next-line no-undef
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: '',
  },
})

const onlyOneChild = ref(null)
const subMenu = ref(null)
function hasOneShowingChild(children = [], parent) {
  const showingChildren = children.filter(item => {
    if (item.hidden) {
      return false
    } else {
      onlyOneChild.value = item
      return true
    }
  })
  if (showingChildren.length === 1) {
    return true
  }
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }
  return false
}

const resolvePath = routePath => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  return path.resolve(props.basePath, routePath)
}

defineOptions({
  name: 'SidebarItem',
})
</script>
<style lang="scss" scoped>
// .menu-item {
//   background: #fff;
// }
::v-deep .router-link-active.router-link-exact-active li {
  background: #fff;
}
#app .sidebar-container .el-sub-menu .router-link-active.router-link-exact-active li::before {
  // background: none !important;
  background: url('../../../assets/imgs/sy/xzleft.png') !important;
  background-size: 100% !important;
  width: 8px !important;
  height: 9px !important;
  opacity: 1;
}

#app .sidebar-container .el-sub-menu .el-menu-item::after {
  background: none !important;
}
#app .sidebar-container .el-sub-menu .router-link-active.router-link-exact-active li {
  background: #fff !important;
}
::v-deep .el-menu-item-group__title {
  padding: 0 !important;
}
.el-menu a:not(.router-link-active) .el-menu-item.is-active {
  color: inherit;
}
#app .sidebar-container .router-link-active.router-link-exact-active li {
  background: #fff;
}
</style>
