<template>
  <div v-if="isCLuo" class="login-index">
    <div class="content">
      <img src="@/assets/imgs/login-logo.png" class="logo" />
      <h1>FBSLIVE {{ $t('CUST.translate337') }}</h1>
      <h2>{{ $t('CUST.translate422') }}</h2>
      <div class="btnGroup">
        <div class="btn registerBtn" @click="handleIndexRegister">{{ $t('CUST.translate408') }}</div>
        <div class="btn loginBtn" @click="handleIndexLogin">{{ $t('CUST.translate10') }}</div>
      </div>
    </div>
  </div>
  <div class="login-container" v-else>
    <div class="login-container-div1 login-bj2">
      <div class="login-title-left" @click="backToCluo">
        <img src="../../assets/imgs/login-title.png" alt="" />
        <span>FBS Live</span>
      </div>
      <div class="login-title-left2">
        <div>{{ $t('CUST.translate1') }}</div>
        <div class="login-title-left2-font">{{ $t('CUST.translate2') }}</div>
      </div>
    </div>
    <div class="login-container-div1 login-bj">
      <LangSelect class="right-menu-qh" />
      <div>
        <LoginPwd v-if="!isShowRegister" @showRegister="setShowRegister" />
        <Register v-else @showRegister="setShowRegister" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted } from 'vue'
import { isMobile } from '@/utils/device'
import { debounce } from 'lodash-unified'
// import WeChatLogin from './components/weChatLogin'
import LoginPwd from './loginPwd.vue'
import Register from './register.vue'
import LangSelect from '../../layout/components/navbar/components/LangSelect.vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const isShowRegister = ref(false)
const isShowWX = ref(true)
const isCLuo = ref(true)

const resizeCb = debounce(() => {
  isShowWX.value = !isMobile()
}, 50)

const handleIndexRegister = () => {
  isCLuo.value = false
  isShowRegister.value = true
  router.push({ name: 'Login', query: { status: 'register' } })
}

const handleIndexLogin = () => {
  isCLuo.value = false
  isShowRegister.value = false
  router.push({ name: 'Login', query: { status: 'login' } })
}

const backToCluo = () => {
  isCLuo.value = true
  router.push({ name: 'Login' })
}

onMounted(() => {
  const status = route.query.status
  if (status === 'register') {
    isCLuo.value = false
    isShowRegister.value = true
  }
  if (status === 'login') {
    isCLuo.value = false
  }
})

const setShowRegister = flag => {
  isShowRegister.value = flag
  if (flag) {
    router.push({ name: 'Login', query: { status: 'register' } })
  } else {
    router.push({ name: 'Login', query: { status: 'login' } })
  }
}
onBeforeMount(() => {
  isShowWX.value = !isMobile()
})

onMounted(() => {
  window.addEventListener('resize', resizeCb)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCb)
})
defineOptions({
  name: 'Login',
})
</script>

<style lang="scss" scoped>
.login-index {
  position: absolute;
  width: 100vw;
  height: 100vh;
  position: relative;
  background: url('../../assets/imgs/login-indexbg.png') no-repeat;
  background-size: cover;
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    left: 10%;
    top: 10%;
    .logo {
      width: 157px;
      height: 157px;
      @media (max-width: 1440px) {
        width: 120px;
        height: 120px;
      }
    }
    h1 {
      margin-top: 45px;
      font-size: 75px;
      font-weight: 600;
      color: var(--fontColor);
      @media (max-width: 1440px) {
        margin-top: 30px;
        font-size: 55px;
      }
    }
    h2 {
      margin-top: 30px;
      font-size: 36px;
      font-weight: 600;
      color: var(--fontColor);
      @media (max-width: 1440px) {
        margin-top: 20px;
        font-size: 28px;
      }
    }
    .btnGroup {
      margin-top: 58px;
      display: flex;
      @media (max-width: 1440px) {
        margin-top: 40px;
      }
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 90px;
      height: 65px;
      border-radius: 38px;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 400;
      cursor: pointer;
      @media (max-width: 1440px) {
        padding: 0 70px;
        height: 50px;
        border-radius: 28px;
        font-size: 20px;
      }
    }
    .registerBtn {
      background: rgba(255, 255, 255, 0.32);
      border: 2px solid var(--fontColor);
      color: var(--fontColor);
      margin-right: 47px;
    }
    .loginBtn {
      background: var(--buttonBackgroundColor);
      color: #ffffff;
    }
  }
}
.login-container {
  width: 100%;
  height: 100vh;
  min-height: 750px;
  overflow: auto;
  box-sizing: border-box;
  display: flex;
  background: url('../../assets/imgs/lgoin-bj.png');
  background-size: 100% 100%;
  .login-container-div1 {
    flex: 1;
    height: 100%;
    position: relative;
  }
  .login-bj2 {
    background: url('../../assets/imgs/login-bj2.png');
    background-size: 100% 100%;
  }
  .login-bj {
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    .title {
      font-size: 40px;
      font-family: AppleColorEmoji;
      color: #333333;
      margin-bottom: 42px;
    }
  }
}
.login-title-left {
  font-size: 50px;
  font-family: DINCond-Bold, DINCond;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  position: absolute;
  top: 50px;
  left: 50px;
  img {
    width: 55px;
    height: 55px;
    margin-right: 20px;
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.login-title-left2 {
  position: absolute;
  top: 30%;
  left: 40%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  font-size: 50px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  .login-title-left2-font {
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    margin-top: 28px;
  }
}

.right-menu-qh {
  position: absolute;
  top: 5%;
  right: 5%;
}
</style>
