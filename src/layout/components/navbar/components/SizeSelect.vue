<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div class="disp">
      <img src="../../../../assets/imgs/zh.png" alt="" class="imgs" />
      <div>{{ size }}</div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :disabled="size === item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { reactive, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useAppStore, useTagsViewStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'

const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()
const route = useRoute()
const router = useRouter()
const sizeOptions = reactive([
  { label: 'Default', value: 'default' },
  { label: 'Large ', value: 'large ' },
  { label: 'Small', value: 'small' },
])

const size = computed(() => {
  return appStore.size
})

const handleSetSize = val => {
  appStore.SET_SIZE(val)
  refreshView()
  ElMessage({
    message: '切换成功',
    type: 'success',
    duration: '1500',
  })
}
// TODO
const refreshView = () => {
  tagsViewStore.DEL_ALL_VISITED_VIEWS(route)
  const { fullPath } = route
  nextTick(() => {
    router.replace({
      path: '/redirect' + fullPath,
    })
  })
}

defineOptions({
  name: 'SizeSelect',
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
</style>
