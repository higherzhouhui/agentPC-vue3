<template>
  <div class="title">{{ $t('CUST.translate402') }}</div>
  <el-form
    ref="ruleForm"
    label-position="top"
    :model="formState"
    :rules="rules"
    label-width="0"
    status-icon
    class="login-ruleForm"
  >
    <!-- <el-form-item prop="agentName" :label="t('CUST.translate63')">
        <el-input
          ref="agentName"
          v-model="formState.agentName"
          name="agentName"
          :placeholder="$t('CUST.translate208')"
          clearable
          tabindex="1"
          type="text"
          maxlength="100"
          autocomplete="off"
          class="inputs"
        />
      </el-form-item> -->
    <el-form-item prop="agentAccount" :label="$t('CUST.translate4')">
      <el-input
        ref="agentAccount"
        v-model="formState.agentAccount"
        name="agentAccount"
        :placeholder="$t('CUST.translate210')"
        clearable
        tabindex="1"
        type="text"
        maxlength="100"
        autocomplete="off"
        class="inputs"
      />
    </el-form-item>

    <el-form-item prop="password" :label="$t('CUST.translate5')">
      <el-input
        ref="password"
        v-model="formState.password"
        show-password
        name="password"
        :placeholder="$t('CUST.translate84')"
        clearable
        tabindex="2"
        maxlength="16"
        type="password"
        autocomplete="off"
        @keyup.enter="registerHandle"
        class="inputs"
      />
    </el-form-item>
    <el-form-item prop="email" :label="`${t('CUST.translate68')}:`">
      <el-input v-model="formState.email" :placeholder="t('CUST.translate91')" class="inputs" clearable />
    </el-form-item>
    <el-form-item prop="verifyCode" :label="`${t('CUST.translate94')}:`" style="position: relative">
      <el-input
        v-model="formState.verifyCode"
        :placeholder="t('CUST.translate7')"
        class="inputs"
        @keyup.enter="registerHandle"
      />
      <div v-if="!state.isVerified" class="sendCode" @click="verification">
        {{ $t('CUST.translate110') }}
      </div>
      <div v-else class="timeCount">{{ state.numbers }}{{ $t('CUST.translate96') }}</div>
    </el-form-item>
    <el-form-item>
      <el-button
        :loading="loading"
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
        @click.prevent="registerHandle"
      >
        {{ $t('CUST.translate408') }}
      </el-button>
    </el-form-item>
  </el-form>
  <p class="registerBtn">
    {{ $t('CUST.translate404') }}，<span @click="setShowRegister">{{ $t('CUST.translate403') }}</span>
  </p>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { sendEmailCode, agentRegister } from '@/api/user'
const { t } = useI18n()
const ruleForm = ref()
const trigger = ['blur', 'change']
const formState = reactive({
  // agentName: '',
  agentAccount: '',
  password: '',
  email: '',
  verifyCode: '',
})
const state = reactive({
  numbers: 120,
  isVerified: false,
  timer: '',
})
const emit = defineEmits(['showRegister'])
const setShowRegister = () => {
  if (formState.agentAccount && (formState.password || formState.email)) {
    ElMessageBox.confirm(t('CUST.translate405'))
      .then(async () => {
        emit('showRegister', false)
      })
      .catch(() => {
        // catch error
      })
  } else {
    emit('showRegister', false)
  }
}
// 6-16字符
const validateAgentName = (rule, value, callback) => {
  if (value) {
    if (value.length < 6 || value.length > 16) {
      callback(new Error(t('CUST.translate86')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
const validateEmail = (rule, value, callback) => {
  if (value) {
    const reg = new RegExp(/@/)
    if (!reg.test(value)) {
      callback(new Error(t('CUST.translate86')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
// 6-16为英文和数字
const validateAgentAccount = (rule, value, callback) => {
  if (value) {
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
    const re = new RegExp(reg)
    if (!re.test(value)) {
      callback(new Error(t('CUST.translate86')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
const validatePass = (rule, value, callback) => {
  if (value) {
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
    const re = new RegExp(reg)
    if (!re.test(value)) {
      callback(new Error(t('CUST.translate86')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
const rules = {
  // agentName: [{ required: true, message: t('CUST.translate220'), trigger },
  //             { validator: validateAgentName, trigger }],
  agentAccount: [
    { required: true, message: t('CUST.translate9'), trigger },
    { validator: validateAgentAccount, trigger: 'change' },
  ],
  password: [
    { required: true, message: t('CUST.translate8'), trigger },
    { validator: validatePass, trigger: 'change' },
  ],
  email: [
    { required: true, message: t('CUST.translate400'), trigger },
    { validator: validateEmail, trigger },
  ],
  verifyCode: [{ required: true, message: t('CUST.translate7'), trigger }],
}
const loading = ref(false)

function registerHandle() {
  ruleForm.value.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        agentRegister(formState).then(res => {
          loading.value = false
          if (res?.code === 200) {
            ElNotification({
              title: t('CUST.translate406'),
              message: t('CUST.translate407'),
              duration: 5000,
            })
            setTimeout(() => {
              emit('showRegister', false)
            }, 1000)
          } else {
            ElMessage.error(res?.msg)
          }
        })
      } catch (e) {
      } finally {
      }
    }
  })
}
const verification = () => {
  const reg = new RegExp(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/)
  if (!reg.test(formState.email)) {
    ElMessage.warning(t('CUST.translate400'))
    return
  }
  // 无论是否发送成功，都要倒计时，避免过度请求，攻击服务器
  sendEmailCode({ email: formState.email })
  state.isVerified = true
  state.timer = setInterval(() => {
    state.numbers = state.numbers - 1
    if (state.numbers === 0) {
      clearInterval(state.timer)
      state.isVerified = false
      state.numbers = 120
    }
  }, 1000)
}
defineOptions({
  name: 'Register',
})
</script>

<style lang="scss" scoped>
.title {
  font-size: 40px;
  color: #333333;
  margin-bottom: 42px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #333333;
  line-height: 40px;
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
.inputs {
  width: 500px;
  height: 50px;
}
.sendCode {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translate(0, -50%);
  font-size: 14px;
  color: var(--background);
  cursor: pointer;
}

.timeCount {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translate(0, -50%);
  font-size: 14px;
  color: #666;
}
.registerBtn {
  height: 20px;
  font-size: 20px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  line-height: 20px;
  text-align: center;
  margin-top: 30px;
  color: #333;
  width: 500px;
  span {
    color: var(--background);
    cursor: pointer;
  }
}
</style>
