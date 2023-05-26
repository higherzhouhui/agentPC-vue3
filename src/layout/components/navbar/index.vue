<template>
  <div class="navbar" :class="set.layoutMod + '-nav-section'">
    <!-- <div v-if="set.layoutMod === 'horizontal'" class="horizontal-sidebar-container">
      <Logo :class="set.layoutMod + '-logo'" :collapse="set.isCollapse" />
      <MenuBar />
    </div> -->

    <!-- <HamBurger
      v-if="set.layoutMod === 'vertical'"
      id="hamburger-container"
      :is-active="set.sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    /> -->
    <div class="displ">
      <div class="displ-left">FBS Live</div>
      <div class="desCurrent">{{ $t('CUST.translate59') }}：</div>
      <BreadCrumb v-if="set.layoutMod === 'vertical'" id="breadcrumb-container" class="breadcrumb-container" />
    </div>

    <div class="right-menu" :class="{ mobile: set.device === 'mobile' }">
      <!-- <div class="right-menu-qh">
        <img src="../../../assets/imgs/zh.png" alt="" />
        <span>ZH</span>
        <el-icon class="right-menu-qh2">
          <ArrowDown />
        </el-icon>
      </div> -->
      <!-- 国际化 -->
      <!-- <SizeSelect class="right-menu-qh"></SizeSelect> -->
      <!-- 组件国际化 -->
      <LangSelect class="right-menu-qh" className="langBecomeWhite" />

      <el-dropdown class="p8 avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper hover-effect">
          <!-- <img :src="set.avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" /> -->
          <!-- <el-avatar :icon="UserFilled" :size="32" /> -->

          <div class="username">
            <div class="username_font">
              <div class="username_font2">{{ set.userName }}</div>
              <div class="username_font3">{{ set.agentTypeName }}</div>
            </div>
            <el-icon class="arrow">
              <img src="@/assets/imgs/xl.png" />
            </el-icon>
          </div>
        </div>

        <template #dropdown>
          <el-dropdown-menu style="padding: 5px">
            <!-- <router-link to="/user/index">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link> -->
            <!-- <router-link to="/">
              <el-dropdown-item>首 页</el-dropdown-item>
            </router-link> -->
            <el-dropdown-item divided @click="personal">{{ $t('CUST.translate60') }}</el-dropdown-item>
            <el-dropdown-item divided @click="modify">{{ $t('CUST.translate149') }}</el-dropdown-item>
            <!-- <a
              target="_blank"
              href="https://github.com/mvpyb"
            >
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <a
              target="_blank"
              href="https://gitee.com/simmon_page"
            >
              <el-dropdown-item>码 云</el-dropdown-item>
            </a> -->
            <el-dropdown-item divided @click="logout">
              <span style="display: block">{{ $t('CUST.translate150') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- <div
        class="p8 el-icon-setting hover-effect"
        @click="openSettings"
      >
        <el-icon class="setting">
          <Setting />
        </el-icon>
      </div> -->
    </div>

    <!-- 申请取款 -->
    <el-dialog :before-close="cancelDia" v-model="set.checkDia" :title="t('CUST.translate149')" width="560px">
      <div class="moneys">
        <div style="font-size: 14px; font-family: PingFangSC-Regular, PingFang SC">{{ $t('CUST.translate151') }}</div>
        <div class="displayMoney">
          {{ userStore?.availableBalance.toFixed(2) }}
        </div>
      </div>
      <el-form :model="checkForm" ref="checkFormRef11" label-width="140px">
        <el-form-item prop="account" :label="`${t('CUST.translate152')}:`">
          <el-input disabled class="inputs1" :value="checkForm.account" />
        </el-form-item>
        <el-form-item prop="withdrawType" :label="`${t('CUST.translate153')}:`">
          <el-select
            v-model="checkForm.withdrawType"
            :placeholder="t('CUST.translate154')"
            style="width: 100%"
            size="large"
            clearable
            @change="checkForm.typeRecordId = ''"
          >
            <el-option :label="t('CUST.translate155')" value="1" />
            <el-option :label="t('CUST.translate156')" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="amount" :label="`${t('CUST.translate157')}:`">
          <el-input
            v-model="checkForm.amount"
            :placeholder="t('CUST.translate158')"
            class="inputs1"
            clearable
            @input="allNumber(set.checkForm.amount)"
          />
          <div class="amlostMoney" v-if="set.checkForm.amount > 0 && checkForm.withdrawType === '1'">
            {{ $t('CUST.translate159') }}：{{ Math.max((set.checkForm.amount * set.config.baseRate).toFixed(2), 0.01) }}
          </div>
          <div class="amlostMoney" v-if="set.checkForm.amount > 0 && checkForm.withdrawType === '2'">
            {{ $t('CUST.translate160') }}：{{
              Math.max((set.checkForm.amount * set.config.baseRate / set.config.usedtRate).toFixed(4) || 0.0001)
            }}
          </div>
        </el-form-item>
        <el-form-item prop="typeRecordId" :label="`${t('CUST.translate161')}:`" v-if="checkForm.withdrawType === '1'">
          <el-select
            v-if="set.optionData1Canuse.length > 0"
            v-model="checkForm.typeRecordId"
            :placeholder="t('CUST.translate162')"
            style="width: 100%"
            size="large"
            clearable
          >
            <el-option :label="item.bankName" :value="item.id" v-for="item in set.optionData1Canuse" :key="item.id" />
          </el-select>
          <div
            v-else
            style="color: #178aff; cursor: pointer"
            @click="clicks1(set.optionData1.length > 0 ? '' : 'bank')"
          >
            {{ set.optionData1.length > 0 ? t('CUST.translate165') : t('CUST.translate166') }}
          </div>
        </el-form-item>
        <el-form-item prop="typeRecordId" :label="`${t('CUST.translate163')}:`" v-if="checkForm.withdrawType === '2'">
          <el-select
            v-if="set.optionData2Canuse.length > 0"
            v-model="checkForm.typeRecordId"
            :placeholder="t('CUST.translate164')"
            style="width: 100%"
            size="large"
            clearable
          >
            <el-option :label="item.walletName" :value="item.id" v-for="item in set.optionData2Canuse" :key="item.id" />
          </el-select>
          <div
            v-else
            style="color: #178aff; cursor: pointer"
            @click="clicks1(set.optionData2.length > 0 ? '' : 'usdt')"
          >
            {{ set.optionData2.length > 0 ? t('CUST.translate167') : t('CUST.translate168') }}
          </div>
        </el-form-item>
        <el-form-item prop="payPwd" :label="`${t('CUST.translate411')}:`">
          <el-input v-model="checkForm.payPwd" class="inputs1" clearable type="password" show-password />
          <!-- <div class="el-form-error" v-if="!allNumberPhone(set.checkForm.phone)">格式不正确</div> -->
        </el-form-item>
        <!-- <el-form-item prop="verifyCode" :label="`${t('CUST.translate6')}:`" style="position: relative">
          <el-input
            v-model="checkForm.verifyCode"
            :placeholder="t('CUST.translate7')"
            class="inputs1"
            clearable
            maxlength="10"
          >
            <template #suffix>
              <div
                v-if="!set.verificationD"
                style="font-size: 14px; color: #5f2ae0; cursor: pointer"
                @click="verification"
              >
                {{$t('CUST.translate110')}}
              </div>
              <div v-else style="font-size: 14px">
                {{ set.numbers }}{{$t('CUST.translate172')}}
              </div>
            </template>
          </el-input>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="but">
          <el-button @click="cancelDia" class="buts1">{{ $t('CUST.translate97') }}</el-button>
          <el-button type="primary" size="medium" @click="addForm" class="buts2">{{
            $t('CUST.translate173')
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, computed, toRefs, onMounted } from 'vue'
import { useAppStore, useUserStore, useSettingsStore } from '@/store'
import { useRouter } from 'vue-router'
import BreadCrumb from './components/BreadCrumb'
import LangSelect from './components/LangSelect'
import { ElMessage, ElMessageBox } from 'element-plus'
import { confirm } from '@/api/drawing/drawing'
import { sendEmailCode } from '@/api/user'
import { getBankList, getWalletList } from '@/api/user'
import { getConfigDataInfo } from '@/api/config'
import { agentTypeDic } from '@/utils/index'
import { useI18n } from 'vue-i18n'
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const { t } = useI18n()
const toggleSideBar = () => {
  appStore.TOGGLE_SIDEBAR()
}
const set = reactive({
  showLogo: computed(() => {
    return settingsStore.sidebarLogo
  }),
  layoutMod: computed(() => {
    return settingsStore.layoutMod
  }),
  sidebar: computed(() => {
    return appStore.sidebar
  }),
  avatar: computed(() => {
    return userStore?.userInfo?.user?.avatar
  }),
  userName: computed(() => {
    const agentAccount = userStore?.userInfo?.agentAccount
    //1-技术专用,为空为代理账号
    return agentAccount
  }),
  device: computed(() => {
    return appStore.device
  }),
  agentTypeName: computed(() => {
    const type = userStore?.userInfo?.agentType
    let agentType = agentTypeDic[type]
    if (userStore?.userInfo?.accountType) {
      agentType = t('CUST.translate175')
    }
    return agentType
  }),
  checkFormRef11: null,
  checkDia: false,
  checkForm: {
    account: '',
    amount: '',
    withdrawType: '',
    typeRecordId: '',
    payPwd: '',
  },
  moneysData: 0,
  verificationD: false,
  numbers: 120,
  agentAccount: '',

  optionData1: [],
  optionData1Canuse: [],
  optionData2: [],
  optionData2Canuse: [],
  config: {
    baseRate: 1000,
    usedtRate: 23000,
  },
})
const { checkForm, checkDia, checkFormRef11 } = toRefs(set)
const personal = () => {
  router.push({ name: 'personalCenter', query: { id: '1' } })
  // router.push('personalCenter')
}

// 跳转绑定卡
const clicks1 = type => {
  cancelDia()
  router.push({ name: 'personalCenter', query: { id: '3', popUpType: type } })
}

const allNumber = value => {
  value = value.replace(/[^\d]/g, '') //只能输入数字
  if (value > userStore.availableBalance) {
    value = userStore.availableBalance
  }
  set.checkForm.amount = value
}

const allNumberPhone = value => {
  value = value.replace(/[^\d]/g, '').substr(0, 11) //验证手机号
  const reg = new RegExp(/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/)
  set.checkForm.phone = value
  if (value) {
    return reg.test(value)
  } else {
    return true
  }
}

onMounted(() => {
  userStore.GET_USER_INFO()
})

// const getBalanceInfos = () => {
//   // 获取余额
//   getBalanceInfo().then(item => {
//     if (item.code === 200) {
//       set.moneysData = item.data.availableBalance
//     }
//   })
// }

const modify = async () => {
  getConfigDataInfo().then(res => {
    if (res?.code === 200) {
      set.config = res?.data?.currencyRateVO
    } else {
      console.log(res?.msg)
    }
  })
  set.checkForm.account = userStore?.account
  if (!userStore?.haveMoneyPwd) {
    ElMessageBox.confirm(t('CUST.translate410'))
      .then(async () => {
        router.push({ name: 'personalCenter', query: { id: '2' } })
      })
      .catch(() => {
        // catch error
      })
    return
  }
  // 银行卡
  getBankList({
    pageNum: 1,
    pageSize: 30,
  }).then(item => {
    if (item.code === 200) {
      set.optionData1 = item.rows || []
      set.optionData1Canuse = []
      set.optionData1.forEach(item => {
        if (item.bindStatus) {
          set.optionData1Canuse.push(item)
        }
      })
    }
  })
  // 获取虚拟币
  getWalletList({
    pageNum: 1,
    pageSize: 30,
  }).then(item => {
    set.optionData2 = item.rows || []
    set.optionData2Canuse = []
    set.optionData2.forEach(item => {
      if (item.bindStatus) {
        set.optionData2Canuse.push(item)
      }
    })
  })
  set.checkDia = true
}
// 取消
const cancelDia = () => {
  checkFormRef11.value.resetFields()
  checkDia.value = false
}
// 确定
const addForm = () => {
  if (!userStore.availableBalance) {
    ElMessage.warning(t('CUST.translate174'))
    return
  }
  if (!set.checkForm.withdrawType) {
    ElMessage.warning(t('CUST.translate177'))
    return
  }
  if (!set.checkForm.amount) {
    ElMessage.warning(t('CUST.translate178'))
    return
  }
  if (!set.checkForm.typeRecordId) {
    ElMessage.warning(t('CUST.translate179'))
    return
  }
  if (!set.checkForm.payPwd) {
    ElMessage.warning(t('CUST.translate419'))
    return
  }

  confirm(set.checkForm).then(item => {
    if (item.code === 200) {
      ElMessage.success(t('CUST.translate181'))
      cancelDia()
    } else {
      ElMessage.error(item.msg)
    }
  })
}
// 验证
const verification = () => {
  // 86
  // set.checkForm.countryCode
  if (!userStore?.email) {
    return
  }
  try {
    sendEmailCode({
      email: userStore?.email,
    })
    set.verificationD = true
    var time
    time = setInterval(() => {
      set.numbers = set.numbers - 1
      if (set.numbers === 0) {
        clearInterval(time)
        set.verificationD = false
        set.numbers = 120
      }
    }, 1000)
  } catch (error) {
    ElMessage.error(error)
  }
}

// 退出登录
const logout = async () => {
  ElMessageBox.confirm(`${t('CUST.translate182')}？`)
    .then(async () => {
      const res = await userStore.LOGIN_OUT()
      router.push('/login')
      window.location.reload()
    })
    .catch(() => {
      // catch error
    })
}

// const openSettings = () => {
//   emitter.emit('openSettings')
// }

defineOptions({
  name: 'NavBar',
})
</script>

<style lang="scss" scoped>
.navbar {
  padding: 0 30px;
  height: 80px;
  overflow: hidden;
  position: relative;
  background: var(--background);
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;

  .displ {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .displ-left {
      font-size: 30px;
      font-family: DINCond-Bold, DINCond;
      font-weight: bold;
      color: #fff;
      letter-spacing: 2px;
      margin-right: 100px;
    }
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    height: 100%;
    display: flex;
    min-width: 280px;
    align-items: center;
    color: #000000d9;
    justify-content: flex-end;
    // padding-right: 10px;

    .icons {
      height: 100%;
      line-height: 50px;
      display: inline-block;
    }

    &:focus {
      outline: none;
    }

    // .hover-effect {
    //   cursor: pointer;
    //   transition: background 0.3s;

    //   &:hover {
    //     background: rgb(82, 41, 187);
    //   }
    // }

    .p8 {
      padding: 0 8px;
    }

    .right-menu-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
    }

    .avatar-container {
      .avatar-wrapper {
        cursor: pointer;
        vertical-align: middle;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 8px;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          vertical-align: middle;
          display: inline-block;
        }

        .username {
          margin-left: 12px;
          vertical-align: middle;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          position: relative;
          .username_font {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #333333;
          }
          .username_font2 {
            margin-top: 3px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #fff;
          }
          .username_font3 {
            margin-top: 3px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #fff;
            opacity: 0.9;
          }
        }

        .arrow {
          // cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 0;
          margin-left: 16px;
          img {
            width: 12px;
            height: 7px;
          }
        }
      }
    }

    .el-icon-setting {
      font-size: 16px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .setting {
        color: #000;
      }
    }
  }

  &.horizontal-nav-section {
    height: 50px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    .hamburger-container {
      display: none;
    }

    .horizontal-sidebar-container {
      flex: 1 1;
      min-width: 0;
      height: 50px;
      background: rgba(0, 0, 0, 0.2);
      position: relative !important;
      align-items: center;
      .horizontal-logo {
        float: left;
        width: 210px;
      }
      .sidebar-menus {
        float: left;
        width: calc(100% - 210px) !important;
      }
      ::v-deep(.el-menu) {
        .el-menu-item,
        .submenu-title-noDropdown,
        .el-sub-menu__title {
          height: 50px;
          line-height: 50px;
        }
      }
    }

    .right-menu {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      /*min-width: 690px;*/
      color: #fff;
      ::v-deep(.header-search) {
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
      ::v-deep(.svg-icon) {
        color: #fff;
      }
      .icons {
        color: #fff;
      }

      .hover-effect {
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
      .right-menu-item {
        color: #fff;
      }
      .el-icon-setting {
        .setting {
          color: #fff;
        }
      }
    }
  }
}
.desCurrent {
  font-size: 14px;
  line-height: 14px;
  opacity: 0.9;
}
.right-menu-qh {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  margin-right: 20px;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
    border-radius: 100%;
  }
  span {
    margin-left: 8px;
    margin-right: 3px;
  }
  .right-menu-qh2 {
    font-size: 14px;
  }
}
.inputs1 {
  height: 42px;
}
.but {
  display: flex;
  justify-content: flex-end;
  .buts1 {
    height: 42px;
    background: #f5f7fe;
    border-radius: 29px;
    border: none;
  }
  .buts2 {
    height: 42px;
    background: var(--buttonBackgroundColor);
    border-radius: 29px;
    border: none;
  }
}
.moneys {
  margin: auto;
  height: 50px;
  background: var(--buttonBackgroundColor);
  border-radius: 10px;
  color: #fff;
  padding: 10px;
  margin-bottom: 10px;
}
.displayMoney {
  margin-top: 4px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}
.amlostMoney {
  color: rgb(227, 101, 23);
  font-size: 14px;
  line-height: 26px;
}
</style>
