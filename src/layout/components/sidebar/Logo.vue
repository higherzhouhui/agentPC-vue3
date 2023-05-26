<template>
  <div class="sidebar-logo-container" :class="{ collapse: props.collapse }">
    <transition name="sidebarLogoFade">
      <!-- <router-link v-if="props.collapse" key="collapse" :title="title" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <span v-else class="sidebar-title">{{ title }} </span>
      </router-link>

      <router-link v-else key="expand" :title="title" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <span class="sidebar-title">{{ title }} </span>
      </router-link> -->

      <router-link key="collapse" :title="$t('CUST.translate183')" class="sidebar-logo-link" to="/">
        <img src="@/assets/imgs/home-title.png" alt="" class="sidebar-logo" />
        <span class="sidebar-title">{{$t('CUST.translate183')}}</span>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
})

defineOptions({
  name: 'SidebarLogo',
})
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  height: 50px;
  line-height: 50px;
  overflow: hidden;
  margin: 16px 0 16px 40px;
  .sidebar-logo-link {
    height: 100%;
    width: 100%;

    .sidebar-logo {
      width: 30px;
      height: 30px;
      vertical-align: middle;
      margin-right: 12px;
      display: inline-block;
    }

    .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #000;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      margin-left: 10px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>
