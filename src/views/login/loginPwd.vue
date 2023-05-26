<template>
  <div class="title">👋{{ $t('CUST.translate3') }}</div>
  <el-form
    ref="ruleForm"
    label-position="top"
    :model="formState"
    :rules="rules"
    label-width="0"
    status-icon
    class="login-ruleForm"
  >
    <el-form-item prop="account" :label="$t('CUST.translate4')">
      <el-input
        ref="account"
        v-model="formState.account"
        name="account"
        :placeholder="$t('CUST.translate9')"
        :clearable="true"
        tabindex="1"
        type="text"
        maxlength="100"
        autocomplete="off"
        style="width: 500px; height: 50px"
        class="inputs"
      />
    </el-form-item>

    <el-form-item prop="password" :label="$t('CUST.translate5')">
      <el-input
        ref="password"
        v-model="formState.password"
        show-password
        name="password"
        :placeholder="$t('CUST.translate8')"
        :clearable="true"
        tabindex="2"
        maxlength="16"
        type="password"
        autocomplete="off"
        @keyup.enter="loginHandle"
        style="width: 500px; height: 50px"
        class="inputs"
      />
    </el-form-item>

    <el-form-item prop="captcha" :label="$t('CUST.translate6')">
      <div class="inputCaptcha">
        <el-input
          ref="captcha"
          v-model="formState.captcha"
          type="text"
          name="captcha"
          :placeholder="$t('CUST.translate7')"
          :clearable="true"
          tabindex="3"
          maxlength="6"
          autocomplete="off"
          @keyup.enter="loginHandle"
          style="width: 370px; height: 50px; margin-right: 20px"
          class="inputs"
          @input="(value) => formState.captcha = value.replace(/[^\d]/g, '')"
        />
        <div class="code" v-loading="captchaloading">
          <img :src="captchaImg" alt="" @click="updateImage" />
        </div>
        <!-- <div class="code" @click="refreshCode">
          <SIdentify :identifyCode="identifyCode" />
        </div> -->
      </div>
    </el-form-item>

    <el-form-item style="margin-bottom: 0">
      <el-button
        :loading="loading"
        :disabled="disabledLogin"
        style="
          width: 500px;
          height: 58px;
          border-radius: 30px;
          background: var(--buttonBackgroundColor);
          border: none;
          margin-top: 30px;
          font-size: 20px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
        "
        @click.prevent="loginHandle"
      >
        {{ $t('CUST.translate10') }}
      </el-button>

      <!-- <el-link
        type="primary"
        :underline="false"
        :loading="loading"
        class=""
        style="width: 100%; margin: 15px"
        @click.prevent="freeLogin"
      >
        免登录
      </el-link> -->
    </el-form-item>
  </el-form>
  <p class="registerBtn" @click="setShowRegister">{{ $t('CUST.translate409') }}</p>
  <div
    style="height: 1px; width: 500px; background: #000000; opacity: 0.1; margin-top: 30px; margin-bottom: 15px"
  ></div>
  <div style="font-size: 15px; width: 500px; font-family: PingFangSC-Regular, PingFang SC; color: var(--background); margin-bottom: 20px">
    {{ $t('CUST.translate423') }}
  </div>
  <div class="bottom_font">
    <div class="bottom_font2" style="margin-right: 20px" @click="copy('live:.cid.6a601d5d2d4134d0')">
      Skype{{ $t('CUST.translate424') }}：<span>live:.cid.6a601d5d2d4134d0</span>
      <img
        src="../../assets/imgs/fz3.png"
        alt=""
        style="width: 15px; height: 15px; margin-left: 5px; margin-top: 3px"
      />
    </div>
    <a class="bottom_font2" href="https://t.me/FBSlive_ad" target="_blank">Telegram{{ $t('CUST.translate424') }}（{{ $t('CUST.translate425') }})</a>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, reactive, computed, onMounted } from 'vue'
import { useRequest } from 'ahooks-vue'
import { login, getCaptcha } from '@/api/user'
import { useUserStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const emit = defineEmits(['showRegister'])

const ruleForm = ref()
const trigger = ['blur', 'change']
const setShowRegister = () => {
  emit('showRegister', true)
}
const formState = reactive({
  country: '+86',
  captcha: '',
  account: 'admin',
  password: '123456',
  uuid: '',
})
const rules = {
  account: [{ required: true, message: t('CUST.translate9'), trigger }],
  password: [{ required: true, message: t('CUST.translate8'), trigger }],
  captcha: [{ required: true, message: t('CUST.translate7'), trigger }],
}
const bindToken = ref('')
const showCaptcha = ref(false)
const captchaImg = ref('')
const captchaId = ref('')
const loading = ref(false)
const captchaloading = ref(true)

const disabledLogin = computed(() => {
  const { captcha, account, password } = formState
  if (showCaptcha.value) {
    return !captcha || !account || !password
  } else {
    return !account || !password
  }
})

onBeforeMount(() => {
  getQueryParams()
})

function getQueryParams() {
  const query = route.query
  // 微信 登录
  bindToken.value = query.bindToken || ''
}

// 图片验证码
async function updateImage() {
  try {
    captchaloading.value = true
    const { code, img, uuid } = await getCaptcha()
    if (code == 200) {
      captchaImg.value = 'data:image/gif;base64,' + img
      captchaId.value = uuid
      captchaloading.value = false
    }
  } catch (e) {
    captchaImg.value = ''
    captchaId.value = ''
  }
}
updateImage()
async function freeLogin() {
  loading.value = true
  try {
    const token = 'token'
    userStore.SET_TOKEN(token)
    router.push('/')
  } catch (e) {
  } finally {
    loading.value = false
  }
}
// 复制
const copy = e => {
  const textarea = document.createElement('textarea')
  textarea.setAttribute('readonly', 'readonly')
  textarea.value = e
  document.body.appendChild(textarea)
  textarea.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    ElMessage.success(t('CUST.translate144'))
  }
  document.body.removeChild(textarea)
}

const { run: logRun } = useRequest(login, {
  manual: true,
  onSuccess(res) {
    console.log(res)
    const { token } = res.data
    userStore.SET_TOKEN(token)
    router.push('/')
  },
})
function loginHandle() {
  // const { captcha } = formState
  // if (captcha !== identifyCode.value) {
  //   ElMessage({
  //     message: '验证码错误',
  //     type: 'warning',
  //   })
  //   return
  // }
  ruleForm.value.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        const params = {
          // username: formState.account,
          // password: formState.password,
          agentAccount: formState.account,
          password: formState.password,
          uuid: captchaId.value,
          code: formState.captcha * 1,
        }
        if (showCaptcha.value) {
          params.captchaId = captchaId.value
          params.captchaValue = formState.captcha * 1
        }
        const isError = await userStore.LOGIN(params)
        if (isError) {
          await updateImage()
          formState.captcha = ''
        }
        // logRun(params)
      } catch (e) {
      } finally {
        loading.value = false
        if (showCaptcha.value) {
          await updateImage()
        }
      }
    }
  })
}

// 图形验证码
let identifyCodes = '1234567890'
let identifyCode = ref('3212')

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const makeCode = (o, l) => {
  for (let i = 0; i < l; i++) {
    identifyCode.value += o[randomNum(0, o.length)]
  }
}

const refreshCode = () => {
  identifyCode.value = ''
  makeCode(identifyCodes, 4)
}

onMounted(() => {
  identifyCode.value = ''
  makeCode(identifyCodes, 4)
})

defineOptions({
  name: 'LoginPwd',
})
</script>

<style lang="scss" scoped>
.title {
  font-size: 40px;
  font-family: AppleColorEmoji;
  color: #333333;
  margin-bottom: 42px;
  font-weight: 600;
}
.inputCaptcha {
  display: flex;
}
.code-inp {
  // width: calc(100% - 125px);
  display: inline-block;
  vertical-align: middle;
  margin-right: 15px;
}
.code {
  display: inline-block;
  height: 50px;
  width: 110px;
  cursor: pointer;
  vertical-align: middle;
  img {
    display: inline-block;
    width: 100%;
    height: 100%;
    /* border-radius: 4px; */
  }
  /* &:hover {
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  } */
}
.registerBtn {
  height: 20px;
  font-size: 20px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: var(--background);
  line-height: 20px;
  text-align: center;
  margin-top: 30px;
  cursor: pointer;
  width: 500px;
}
.bottom_font {
  display: flex;
  flex-direction: column;
  width: 500px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
}
.bottom_font2 {
  cursor: pointer;
  color: #999999;
  margin-bottom: 5px;
  &:hover {
    color: #706c6c;
  }
}
</style>
