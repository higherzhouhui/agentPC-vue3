<template>
  <div v-loading="state.loading">
    <div class="titles">{{ $t('CUST.translate60') }}</div>
    <div class="titles_div">
      <div
        v-for="item in coreLeft"
        :key="item.id"
        :class="`${item.Check ? 'titles_div12' : 'titles_div123'}`"
        @click="coreLeftF(item)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="core_right">
      <div v-if="coreLeftIndex === '1'">
        <!-- <ExtensionDomainName /> -->
        <div class="titles_font">{{ $t('CUST.translate61') }}</div>
        <div style="padding-left: 110px">
          <!-- 头像 -->
          <!-- <el-avatar :size="80" :src="circleUrl" style="margin-left: 100px" :icon="UserFilled" /> -->
          <div class="displ" style="margin-top: 30px">
            <div class="displ_left">{{ $t('CUST.translate62') }}:</div>
            <div>{{ userStore?.account }}</div>
          </div>
          <!-- <div class="displ">
            <div class="displ_left">{{ $t('CUST.translate63') }}:</div>
            <div>{{ userStore?.name }}</div>
          </div> -->
          <div class="displ">
            <div class="displ_left">{{ $t('CUST.translate66') }}:</div>
            <div>{{ userStore?.availableBalance }}</div>
          </div>
          <div class="displ">
            <div class="displ_left">{{ $t('CUST.translate64') }}:</div>
            <div>{{ userStore.createTime }}</div>
          </div>
          <div class="displ">
            <div class="displ_left">{{ $t('CUST.translate65') }}:</div>
            <div>{{ userStore?.rolesType }}</div>
          </div>
          <div class="displ" v-if="userStore.validTime">
            <div class="displ_left">{{ $t('CUST.translate67') }}:</div>
            <div>{{ userStore.validTime }}</div>
          </div>
          <div class="displ">
            <div class="displ_left">{{ $t('CUST.translate68') }}:</div>
            <div>{{ userStore.email || t('CUST.translate69') }}</div>
          </div>
          <div class="displ">
            <div class="displ_left">{{ $t('CUST.translate70') }}:</div>
            <div>
              <el-input v-model="state.qqData" :placeholder="$t('CUST.translate71')"></el-input>
              <!-- <div class="el-form-error" v-if="state.qqData.length > 13 || state.qqData.length < 5">QQ号格式错误</div> -->
            </div>
          </div>
          <div class="displ">
            <div class="displ_left"></div>
            <el-button :loading="state.infoLoading" type="primary" class="but1s" @click="but">{{ $t('CUST.translate72') }}</el-button>
          </div>
        </div>
      </div>
      <div v-if="coreLeftIndex === '2'" style="display: flex; align-items: center; justify-content: center">
        <div class="coreLeft2">
          <div class="coreLeft2_font">
            {{ $t('CUST.translate73') }}
          </div>
          <div class="coreLeft2_div">
            <div class="coreLeft2_div2">
              <img src="../../assets/imgs/sy/slog.png" alt="" />
              <div>
                <div class="coreLeft2_div2_font1">{{ $t('CUST.translate74') }}</div>
                <div>{{ $t('CUST.translate75') }}</div>
                <!-- <span class="hint">如果忘记密码，请联系客服</span> -->
              </div>
            </div>
            <el-button class="coreLeft2_but" @click="modify(1)">{{ $t('CUST.translate76') }}</el-button>
          </div>
          <div class="coreLeft2_div">
            <div class="coreLeft2_div2">
              <img src="../../assets/imgs/sy/email.png" alt="" />
              <div>
                <div class="coreLeft2_div2_font1">{{ userStore.email ? userStore.email : t('CUST.translate68') }}</div>
                <div>
                  {{ userStore.email ? t('CUST.translate76') : t('CUST.translate78') }}{{ $t('CUST.translate77') }}
                </div>
              </div>
            </div>
            <el-button class="coreLeft2_but" @click="modify(2)">{{
              userStore.email ? t('CUST.translate76') : t('CUST.translate78')
            }}</el-button>
          </div>
          <div class="coreLeft2_div">
            <div class="coreLeft2_div2">
              <img src="../../assets/imgs/sy/wallet.png" alt="" />
              <div>
                <div class="coreLeft2_div2_font1">{{ $t('CUST.translate411') }}</div>
                <div>{{ $t('CUST.translate412') }}</div>
              </div>
            </div>
            <el-button class="coreLeft2_but" @click="modify(3)">{{
              userStore?.haveMoneyPwd ? t('CUST.translate76') : t('CUST.translate415')
            }}</el-button>
          </div>
        </div>

        <!-- 弹窗 -->
        <el-dialog
          :before-close="cancelDia"
          v-model="checkDia"
          :title="
            state.radioGroupData === '1'
              ? t('CUST.translate79')
              : userStore.email
              ? t('CUST.translate80')
              : t('CUST.translate81')
          "
          width="580px"
        >
          <div class="elForm" v-if="radioGroupData === '1'">
            <el-form :model="checkForm" ref="checkFormRef11" label-width="140px">
              <el-form-item prop="account" :label="`${t('CUST.translate82')}:`">
                <el-input
                  v-model="checkForm.account"
                  :placeholder="t('CUST.translate83')"
                  class="inputs1"
                  clearable
                  type="password"
                  show-password
                />
              </el-form-item>
              <el-form-item prop="account2" :label="`${t('CUST.translate85')}:`">
                <el-input
                  v-model="checkForm.account2"
                  :placeholder="t('CUST.translate84')"
                  class="inputs1"
                  clearable
                  type="password"
                  show-password
                />
                <div class="el-form-error" v-if="!validePassword()">{{ $t('CUST.translate86') }}</div>
              </el-form-item>
              <el-form-item prop="account3" :label="`${t('CUST.translate87')}:`">
                <el-input
                  v-model="checkForm.account3"
                  :placeholder="t('CUST.translate88')"
                  class="inputs1"
                  clearable
                  type="password"
                  show-password
                />
                <div
                  class="el-form-error"
                  v-if="checkForm.account3.length > 0 && checkForm.account2 !== checkForm.account3"
                >
                  {{ $t('CUST.translate89') }}
                </div>
              </el-form-item>
            </el-form>
          </div>
          <!-- 邮箱 -->
          <div class="elForm" v-if="radioGroupData === '2'">
            <el-form :model="checkForm2" ref="checkFormRef22" label-width="117px">
              <el-form-item
                prop="account"
                :label="`${t('CUST.translate68')}:`"
                v-if="userStore.email && !state.nextStep"
              >
                <el-input
                  :value="userStore.email"
                  :placeholder="t('CUST.translate91')"
                  class="inputs1"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item
                prop="account"
                :label="`${t('CUST.translate68')}:`"
                v-if="state.nextStep || !userStore.email"
              >
                <el-input
                  @input="valideEmail(state.checkForm2.email)"
                  v-model="checkForm2.email"
                  :placeholder="t('CUST.translate91')"
                  class="inputs1"
                  clearable
                />
                <div class="el-form-error" v-if="!valideEmail(state.checkForm2.email) && state.checkForm2.email">
                  {{ $t('CUST.translate86') }}
                </div>
              </el-form-item>
              <el-form-item prop="code" :label="`${t('CUST.translate94')}:`" style="position: relative">
                <el-input
                  v-model="checkForm2.verifyCode"
                  :placeholder="t('CUST.translate7')"
                  class="inputs1"
                  clearable
                  @keyup.enter="addForm"
                />
                <!-- <div class="el-form-error" v-if="!allNumberVerify(state.checkForm2.verifyCode)">格式错误</div> -->
                <div
                  v-if="!state.verificationD"
                  style="font-size: 14px; color: var(--fontColor); position: absolute; top: 5px; right: 10px; cursor: pointer"
                  @click="verification"
                >
                  {{ $t('CUST.translate110') }}
                </div>
                <div v-else style="font-size: 14px; position: absolute; top: 5px; right: 20px">
                  {{ state.numbers }}{{ $t('CUST.translate96') }}
                </div>
              </el-form-item>
            </el-form>
          </div>
          <template #footer>
            <div class="but">
              <el-button @click="cancelDia" class="buts1">{{ $t('CUST.translate97') }}</el-button>
              <el-button
                :loading="state.moneyDialogLoading"
                type="primary"
                size="medium"
                @click="addForm"
                class="buts2"
                >{{
                  state.radioGroupData === '1'
                    ? t('CUST.translate98')
                    : state.nextStep || !userStore.email
                    ? t('CUST.translate98')
                    : t('CUST.translate99')
                }}</el-button
              >
            </div>
          </template>
        </el-dialog>
        <!-- 设置、修改资金密码 -->
        <el-dialog
          :before-close="cancelMoneyDialog"
          v-model="state.moneyDialog"
          :title="userStore?.haveMoneyPwd ? t('CUST.translate413') : t('CUST.translate414')"
          width="620px"
        >
          <el-form ref="moneyRuleForm" label-width="140px">
            <el-form-item prop="account" :label="`${t('CUST.translate68')}:`">
              <el-input :value="userStore.email" class="inputs1" clearable disabled />
            </el-form-item>
            <el-form-item prop="code" :label="`${t('CUST.translate94')}:`" style="position: relative">
              <el-input v-model="checkForm2.verifyCode" :placeholder="t('CUST.translate7')" class="inputs1" />
              <div
                v-if="!state.verificationD"
                style="font-size: 14px; color: var(--fontColor); position: absolute; top: 5px; right: 10px; cursor: pointer"
                @click="verification"
              >
                {{ $t('CUST.translate110') }}
              </div>
              <div v-else style="font-size: 14px; position: absolute; top: 5px; right: 20px">
                {{ state.numbers }}{{ $t('CUST.translate96') }}
              </div>
            </el-form-item>
            <el-form-item prop="account2" :label="`${t('CUST.translate411')}:`">
              <el-input
                v-model="checkForm.account2"
                :placeholder="t('CUST.translate84')"
                class="inputs1"
                clearable
                type="password"
                show-password
              />
              <div class="el-form-error" v-if="!validePassword()">{{ $t('CUST.translate86') }}</div>
            </el-form-item>
            <el-form-item prop="account3" :label="`${t('CUST.translate87')}:`">
              <el-input
                v-model="checkForm.account3"
                :placeholder="t('CUST.translate88')"
                class="inputs1"
                clearable
                type="password"
                show-password
              />
              <div
                class="el-form-error"
                v-if="checkForm.account3.length > 0 && checkForm.account2 !== checkForm.account3"
              >
                {{ $t('CUST.translate89') }}
              </div>
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="but">
              <el-button @click="cancelMoneyDialog" class="buts1">{{ $t('CUST.translate97') }}</el-button>
              <el-button
                :loading="state.moneyDialogLoading"
                type="primary"
                size="medium"
                @click="confirmMoneyUpdate"
                class="buts2"
                >{{ userStore?.haveMoneyPwd ? t('CUST.translate76') : t('CUST.translate415') }}</el-button
              >
            </div>
          </template>
        </el-dialog>
      </div>
      <div v-if="coreLeftIndex === '3'">
        <DrawingAccount :popUpType="route.query.popUpType" />
      </div>
    </div>
    <!-- <img src="../../assets/imgs/sy/sjlog.png" alt="" /> -->
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted, watch } from 'vue'
import DrawingAccount from './components/drawingAccount.vue'
import { useRoute, useRouter } from 'vue-router' 
import { useUserStore } from '@/store'
import { changePwd, sendEmailCode, updateAgentEmail, updateOverviewInfo, updatePayPwd } from '@/api/user'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const staticTime = 60
const state = reactive({
  coreLeft: [
    { id: '1', name: t('CUST.translate100'), Check: true },
    { id: '2', name: t('CUST.translate101'), Check: false },
    { id: '3', name: t('CUST.translate102'), Check: false },
  ],
  checkFormRef: null,

  checkFormRef2: null,

  checkFormRef11: null,
  checkFormRef22: null,
  coreLeftIndex: '1',
  qqData: '',
  infoLoading: false,
  checkForm: {
    account: '',
    account2: '',
    account3: '',
  },
  checkForm2: {
    email: '',
    verifyCode: '',
  },
  radioGroupData: '',
  checkDia: false,

  verificationD: false,
  numbers: staticTime,
  nextStep: false,
  timer: '',
  moneyDialog: false,
  moneyDialogLoading: false,
  loading: true,
})
const { coreLeft, checkDia, checkForm, checkForm2, checkFormRef11, checkFormRef22, radioGroupData, coreLeftIndex } =
  toRefs(state)

// 初始化
onMounted(async () => {
  state.coreLeftIndex = route.query.id
  state.coreLeft.forEach(item => {
    if (item.id === route.query.id) {
      item.Check = true
    } else {
      item.Check = false
    }
  })
  await userStore.GET_USER_INFO()
  state.loading = false
  state.qqData = userStore.qq
  state.checkForm2.email = userStore.email
})

watch(
  () => route.query.id,
  async (newVal, oldVal) => {
    if (newVal) {
      if (newVal != 3) {
        state.loading = true
        await userStore.GET_USER_INFO()
        state.loading = false
      }
      state.qqData = userStore.qq || ''
      state.checkForm2.email = userStore.email
      state.coreLeftIndex = newVal
      state.coreLeft.forEach(item => {
        if (item.id === newVal) {
          item.Check = true
        } else {
          item.Check = false
        }
      })
    }
  }
)

// 切换
const coreLeftF = item => {
  router.push({ name: 'personalCenter', query: { id: item.id } })
}
// 修改密码 邮箱 资金密码
const modify = data => {
  // 修改资金密码
  if (data === 3) {
    // 邮箱必须先于资金密码设置
    if (!userStore?.email) {
      ElMessage.warning(t('CUST.translate418'))
      return
    }
    state.moneyDialog = true
    return
  }
  state.checkDia = true
  if (data === 1) {
    state.radioGroupData = '1'
  } else {
    state.radioGroupData = '2'
  }
}

// 验证
const verification = () => {
  // 修复绑定密码后立即修改密码，没有给checkForm2.email重新赋值的问题
  if (!state.nextStep && !state.checkForm2.email) {
    state.checkForm2.email = userStore?.email
  }
  if (!valideEmail(state.checkForm2.email)) {
    ElMessage.warning(t('CUST.translate400'))
    return
  }
  // 无论是否发送成功，都要倒计时，避免过度请求，攻击服务器
  sendEmailCode({
    email: state.checkForm2.email,
  })
  state.verificationD = true
  state.timer = setInterval(() => {
    state.numbers = state.numbers - 1
    if (state.numbers === 0) {
      clearInterval(state.timer)
      state.verificationD = false
      state.numbers = staticTime
    }
  }, 1000)
}

// 取消
const cancelDia = () => {
  if (state.radioGroupData === '1') {
    // checkFormRef11.value.resetFields()
    state.checkForm = {
      account: '',
      account2: '',
      account3: '',
    }
  }
  if (state.radioGroupData === '2') {
    // checkFormRef22.value.resetFields()
    state.checkForm2.verifyCode = ''
    state.checkForm2.email = ''
  }
  state.nextStep = false
  checkDia.value = false
}
// 确定
const addForm = () => {
  if (state.radioGroupData === '1') {
    if (
      state.checkForm.account2 !== state.checkForm.account3 ||
      !state.checkForm.account.length ||
      !state.checkForm.account2.length
    ) {
      return
    }
    state.infoLoading = true
    changePwd(state.checkForm).then(res => {
      state.infoLoading = false
      if (res?.code === 200) {
        ElMessage.success(`${t('CUST.translate106')}！`)
        checkDia.value = false
        state.checkForm.account = ''
        state.checkForm.account2 = ''
        state.checkForm.account3 = ''
      } else {
        ElMessage.error(res?.msg || t('CUST.translate107'))
      }
    })
  }
  if (state.radioGroupData === '2') {
    // 修改/第一次绑定邮箱
    if (state.nextStep || !userStore.email) {
      if (!valideEmail(state.checkForm2.email) || !state.checkForm2.verifyCode) {
        ElMessage.warning(t('CUST.translate401'))
        return
      }
      state.infoLoading = true
      updateAgentEmail(state.checkForm2).then(async res => {
        state.infoLoading = false
        if (res?.code === 200) {
          ElMessage.success(
            `${userStore.email ? t('CUST.translate76') : t('CUST.translate78')}${t('CUST.translate108')}！`
          )
          state.loading = true
          await userStore.GET_USER_INFO()
          state.loading = false
          state.checkForm2.verifyCode = ''
          checkDia.value = false
          state.nextStep = false
        } else {
          ElMessage.error(res?.msg || `${t('CUST.translate109')}！`)
        }
      })
    } else {
      // 解绑原来的邮箱
      if (!valideEmail(state.checkForm2.email) || !state.checkForm2.verifyCode) {
        ElMessage.warning(t('CUST.translate401'))
        return
      }
      state.infoLoading = true
      updateAgentEmail(state.checkForm2).then(res => {
        state.infoLoading = false
        if (res?.code === 200) {
          state.checkForm2.verifyCode = ''
          state.checkForm2.email = ''
          state.nextStep = true
          clearInterval(state.timer)
          state.verificationD = false
          state.numbers = staticTime
        } else {
          ElMessage.error(res?.msg || `${t('CUST.translate109')}！`)
        }
      })
    }
  }
}
// 修改
const but = () => {
  state.infoLoading = true
  updateOverviewInfo({ qq: state.qqData }).then(res => {
    state.infoLoading = false
    if (res?.code === 200) {
      ElMessage.success(`${t('CUST.translate106')}！`)
    } else {
      ElMessage.success(res?.msg)
    }
  })
}

// 取消-资金设置
const cancelMoneyDialog = () => {
  state.moneyDialog = false
  state.checkForm.account2 = ''
  state.checkForm.account3 = ''
  state.checkForm2.verifyCode = ''
}

// 确认-资金设置
const confirmMoneyUpdate = () => {
  if (!state.checkForm2.verifyCode) {
    ElMessage.warning(t('CUST.translate7'))
    return
  }

  if (!state.checkForm.account2 || state.checkForm.account2 !== state.checkForm.account3 || !validePassword()) {
    ElMessage.warning(t('CUST.translate416'))
    return
  }
  state.moneyDialogLoading = true
  updatePayPwd({
    payPwd: state.checkForm.account2,
    verifyCode: state.checkForm2.verifyCode,
  }).then(async res => {
    state.moneyDialogLoading = false
    if (res?.code === 200) {
      ElMessage.success(userStore?.haveMoneyPwd ? t('CUST.translate106') + '！' : t('CUST.translate417'))
      state.loading = true
      await userStore.GET_USER_INFO()
      state.loading = false
      cancelMoneyDialog()
    } else {
      ElMessage.error(res?.msg)
    }
  })
}
const allNumber = value => {
  value = value.replace(/[^\d]/g, '').substr(0, 13) //只能输入数字
  state.qqData = value
}

const allNumberVerify = value => {
  value = value.replace(/[^\d]/g, '').substr(0, 8) //验证码
  state.checkForm2.verifyCode = value
  if (value) {
    if (value.length < 3) {
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}
const valideEmail = value => {
  // const reg = new RegExp(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/)
  // return reg.test(value)
  return true
}

const validePassword = () => {
  if (state.checkForm.account2) {
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
    const re = new RegExp(reg)
    return re.test(state.checkForm.account2)
  } else {
    return true
  }
}
</script>

<style lang="scss" scoped>
.core_left_div {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
  &:hover {
    color: var(--fontColor);
  }
}
.core_left_div1 {
  background: #f2f2f2;
  color: #666666;
}
.core_left_div12 {
  background: #e9f2fc;
  color: var(--fontColor);
}
.el-main {
  margin-left: 10px;
}
.checkForm1 {
  width: 500px;
  padding-top: 20px;
}
.titles {
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #333333;
  padding: 16px 0;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 15px;
}
.titles_div {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 15px;
  cursor: pointer;

  div {
    padding: 9px 17px;
    background: #f5f7fe;
    border-radius: 5px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: var(--fontColor);
    margin-right: 10px;

    &:hover {
      background: var(--backgroundHover);
      color: #fff;
    }
  }
}
.titles_div12 {
  background: var(--buttonBackgroundColor) !important;
  color: #fff !important;
}

.inputs {
  width: 500px;
  height: 50px;
  border-radius: 10px;
}
.buts {
  width: 150px;
  height: 58px;
  background: var(--buttonBackgroundColor);
  border-radius: 29px;
  border: none;
  font-size: 20px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;

  margin-top: 30px;
}
.titles_font {
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #333333;
  margin-bottom: 40px;
}
.displ {
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #333333;
  .displ_left {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #999999;
    margin-right: 60px;
    width: 152px;
    text-align: end;
  }
}
.but1s {
  width: 131px;
  height: 36px;
  background: var(--buttonBackgroundColor);
  border-radius: 5px;
  border: none;

  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
}
.coreLeft2 {
  width: 824px;
  .coreLeft2_font {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: var(--fontColor);
    margin-bottom: 48px;
  }
  .coreLeft2_div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 85px 0 61px;
    height: 187px;
    background: #fafafa;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  .coreLeft2_div2 {
    display: flex;
    align-items: center;

    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #666666;
    img {
      width: 32px;
      height: 32px;
      margin-right: 40px;
    }
    .coreLeft2_div2_font1 {
      font-size: 24px;
      font-weight: 600;
      color: #333333;
    }
    .hint {
      font-size: 12px;
      font-weight: 500;
      opacity: 0.8;
    }
  }
}
.coreLeft2_but {
  padding: 0 10px;
  height: 36px;
  background: #ebe5f7;
  border-radius: 4px;
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: var(--fontColor);
  border: none;
  &:hover {
    background: var(--backgroundHover);
    color: #fff;
  }
}

.but {
  display: flex;
  justify-content: flex-end;
  .buts1 {
    width: 103px;
    height: 42px;
    background: #f5f7fe;
    border-radius: 29px;
    border: none;
  }
  .buts2 {
    width: 103px;
    height: 42px;
    background: var(--buttonBackgroundColor);
    border-radius: 29px;
    border: none;
  }
}
.inputs1 {
  height: 42px;
}
</style>
