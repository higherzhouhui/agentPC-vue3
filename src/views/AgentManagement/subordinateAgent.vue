<template>
  <div class="user-list-wrap">
    <div class="titles">
      <span class="title">
        <span v-if="userStore.account">{{
          state.routeQueryName ? `${userStore.account}->${state.routeQueryName}` : ''
        }}</span>
        {{ $t('CUST.translate185') }}
      </span>
      <span v-if="route.query.agentId">
        <span @click="backToMyAgent" class="myAgent">{{ $t('AGENT.translate7') }}</span>
        <span class="return" @click="backToLastPage">
          {{ $t('AGENT.translate8') }}
        </span>
      </span>
    </div>
    <el-scrollbar>
      <el-form :model="state.formInline" class="demo-form-inline">
        <el-form-item>
          <el-button @click="showDialog" class="searchButton" type="primary" icon="Plus">{{ $t('CUST.translate186') }}</el-button>
        </el-form-item>
        <el-form-item :label="`${t('CUST.translate187')}：`" class="form-items-body">
          <el-input
            clearable
            v-model="state.formInline.agentAccount"
            :placeholder="t('CUST.translate188')"
            class="form-items"
            style="width: 290px"
          />
        </el-form-item>
        <el-form-item :label="`${t('CUST.translate130')}:`" class="form-items-body">
          <el-select
            clearable
            v-model="state.formInline.agentStatus"
            class="m-2 form-itemsstatus"
            style="width: 110px"
            :placeholder="t('CUST.translate189')"
          >
            <el-option value="" :label="t('CUST.translate190')"></el-option>
            <el-option :value="2" :label="t('CUST.translate191')"></el-option>
            <el-option :value="1" :label="t('CUST.translate116')"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${t('CUST.translate64')}：`" class="form-items-body">
          <el-date-picker
            v-model="state.timeRange"
            type="daterange"
            :range-separator="t('CUST.translate192')"
            :start-placeholder="t('CUST.translate193')"
            :end-placeholder="t('CUST.translate194')"
            style="max-width: 250px"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="query" class="searchButton" type="primary"  icon="Search" style="margin-right: 10px">{{
            $t('CUST.translate195')
          }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetSearchForm" class="resetButton" style="margin-right: 10px">{{
            $t('CUST.translate196')
          }}</el-button>
        </el-form-item>
        <el-form-item>
          <!-- 导出 -->
          <el-button
            class="exportButton"
            :loading="state.downloadLoading"
            type="success"
            icon="Document"
            @click="handleDownload"
          >
            {{ t('exportReport') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="warpperTable" v-loading="state.loading">
      <Table
        :data="state.recordList"
        :columns="state.columns"
        :total="state.total"
        :pageSize="state.pageSize"
        :current="state.current"
        :pageUpdate="pageUpdate"
        :sizeUpdate="sizeUpdate"
        maxHeight="calc(100vh - 320px)"
      >
        <template #agentStatus="{ row }">
          <div v-if="row.agentStatus === 1" class="normal">{{ $t('CUST.translate116') }}</div>
          <div v-if="row.agentStatus === 2" class="frozen">{{ $t('CUST.translate191') }}</div>
        </template>
        <template #agentType="{ row }">
          <div v-if="row.agentType === 0">{{ $t('CUST.translate197') }}</div>
          <div v-if="row.agentType === 1">{{ $t('CUST.translate198') }}</div>
          <div v-if="row.agentType === 2">{{ $t('CUST.translate199') }}</div>
          <div v-if="row.agentType === 3">{{ $t('CUST.translate200') }}</div>
          <div v-if="row.agentType === 4">{{ $t('CUST.translate201') }}</div>
        </template>
        <template #directAgentNum="{ row }">
          <div @click="handleClickDirectAgentNum(row)" class="searchAgentId">{{ row.directAgentNum }}</div>
        </template>
        <template #directUserNum="{ row }">
          <div @click="handleClickdirectUserNum(row)" class="searchAgentId">{{ row.directUserNum }}</div>
        </template>
      </Table>
    </div>
    <el-dialog v-model="checkDia" :before-close="cancelDia" :title="t('CUST.translate202')" top="5vh" width="900px">
      <el-form :model="checkForm" ref="ruleFormRef" :label-width="appStore.lang === 'zh' ? '110px' : '200px'" :rules="rules">
        <el-form-item :label="`${t('CUST.translate203')}：`">
          <el-input :value="state.currentAgaentName" placeholder="" class="inputs" disabled />
        </el-form-item>
        <el-form-item prop="agentType" :label="`${t('CUST.translate65')}：`">
          <el-select
            v-model="checkForm.agentType"
            class="m-2"
            style="width: 100%"
            size="large"
            :placeholder="t('CUST.translate204')"
            clearable 
            disabled
          >
            <el-option :label="item.label" :value="item.value" v-for="item in agaentTypeDic" :key="item.value" />
          </el-select>
        </el-form-item>
        <!-- 隐藏自定义配置 -->
        <div class="fuchiWrapper" v-if="checkForm.agentType === 2222">
          <el-form-item prop="agentType" :label="t('AGENT.translate29')">
            <el-radio-group v-model="checkForm.supportRatioConfig">
              <el-radio :label="1">{{$t('AGENT.translate30')}}</el-radio>
              <el-radio :label="2">{{$t('AGENT.translate31')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div
              v-for="item in checkForm.supportRatioConfig === 1 ? state.supportPlanList : checkForm.supportPlanList"
              :key="item.id"
              class="support"
            >
              <div style="margin-bottom: 6px">
                <span v-if="appStore.lang === 'zh'">
                  扶持第（{{ item.supportMonth }}）个月
                </span>
                <span v-else>
                  （{{ item.supportMonth }}ヶ月目）サポート
                </span>                
              </div>
              <div>
                {{t('AGENT.translate27')}}:<el-input
                  v-model="item.newValidPerson"
                  class="support_center"
                  type="number"
                  min="1"
                  size="small"
                  :disabled="checkForm.supportRatioConfig === 1"
                />
              </div>
              <div>
                {{t('AGENT.translate28')}}:<el-input
                  v-model="item.attachRatio"
                  class="support_center"
                  type="number"
                  min="1"
                  size="small"
                  :disabled="checkForm.supportRatioConfig === 1"
                >
                  <template #append>%</template>
                </el-input>
              </div>
          </div>
        </div>
        <el-form-item prop="commissionRatio" :label="`${t('CUST.translate205')}：`" v-if="checkForm.agentType === 3">
          <el-input
            v-model="checkForm.commissionRatio"
            :placeholder="t('CUST.translate206')"
            clearable
            class="inputs"
            maxLength="3"
            @input="(value) => state.checkForm.commissionRatio = value.replace(/[^\d]/g, '')"
          >
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item prop="agentName" :label="`${t('CUST.translate207')}：`">
          <el-input
            v-model="checkForm.agentName"
            :placeholder="t('CUST.translate208')"
            clearable
            class="inputs"
          />
        </el-form-item> -->
        <el-form-item prop="agentAccount" :label="`${t('CUST.translate209')}：`">
          <el-input 
          v-model="checkForm.agentAccount" 
          :placeholder="t('CUST.translate210')" 
          clearable class="inputs" 
          maxLength="16"
          />
        </el-form-item>
        <el-form-item prop="loginPwd" :label="`${t('CUST.translate211')}：`">
          <el-input
            v-model="checkForm.loginPwd"
            :placeholder="t('CUST.translate84')"
            clearable
            class="inputs"
            type="password"
            maxLength="16"
            show-password
          />
        </el-form-item>
        <el-form-item prop="reloginPwd" :label="`${t('CUST.translate87')}：`">
          <el-input
            v-model="checkForm.reloginPwd"
            :placeholder="t('CUST.translate212')"
            clearable
            class="inputs"
            type="password"
            maxLength="16"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="buts">
          <el-button @click="resetForm(ruleFormRef)" class="buts1">{{ $t('CUST.translate97') }}</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="submitForm(ruleFormRef)"
            class="buts2"
            :loading="state.loading"
            >{{ $t('CUST.translate98') }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted, ref, watch } from 'vue'
import { getAgaentList, addChildAgent, getSysSupportPlan } from '@/api/agaentaccount'
import { useRoute, useRouter } from 'vue-router'
import Table from '@/components/ProTable/index.vue'
import { exportReportTable } from '@/utils/index'
import { useUserStore, useAppStore } from '@/store'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
const appStore = useAppStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
let staticConfig = []
const agaentTypeDic = [
  { label: t('CUST.translate198'), value: 1 },
  { label: t('CUST.translate198'), value: 1 },
  { label: t('CUST.translate199'), value: 2 },
  { label: t('CUST.translate200'), value: 3 },
  { label: t('CUST.translate201'), value: 4 },
  { label: t('CUST.translate201'), value: 4 },
]
const userStore = useUserStore()
const ruleFormRef = ref()
const state = reactive({
  recordList: [],
  columns: [
    { prop: 'agentId', label: t('CUST.dlID'), width: 120 },
    { prop: 'agentAccount', label: t('CUST.translate209'), width: 140 },
    { prop: 'agentType', label: t('CUST.translate65'), width: 140, slot: 'agentType' },
    { prop: 'agentStatus', label: t('CUST.translate130'), width: 160, slot: 'agentStatus' },
    { prop: 'directAgentNum', label: t('CUST.translate213'), width: 180, slot: 'directAgentNum' },
    { prop: 'thisMonthDirectAgentNum', label: t('CUST.translate214'), width: 280 },
    { prop: 'directUserNum', label: t('CUST.translate215'), slot: 'directUserNum', width: 200 },
    { prop: 'thisMonthDirectUserNum', label: t('CUST.translate216'), width: 380 },
    { prop: 'thisMonthDepositUserNum', label: t('AGENT.translate23'), width: 320 },
    { prop: 'thisMonthValidUserNum', label: t('AGENT.translate24'), width: 280 },
    { prop: 'registerTime', label: t('CUST.translate64'), width: 180 },
  ],
  total: 30,
  pageSize: 10,
  current: 1,
  timeRange: [],
  formInline: {
    agentAccount: '',
    agentStatus: '',
    endDate: '',
    startDate: '',
  },
  checkDia: false,
  checkFormRef: null,
  checkForm: {
    agentAccount: '',
    // agentName: '',
    agentPid: '',
    commissionRatio: '',
    loginPwd: '',
    agentType: 3,
    reloginPwd: '',
  },
  checkDiaType: '',
  currentAgaentName: '',
  loading: true,
  routeQueryId: '',
  routeQueryName: '',
  downloadLoading: false,
  supportPlanList: [],
})
const { checkDia, checkForm } = toRefs(state)
const resetSearchForm = () => {
  state.formInline = {
    agentAccount: '',
    agentStatus: '',
    endDate: '',
    startDate: '',
  }
  state.timeRange = ''
  state.current = 1
  query()
}
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(t('CUST.translate217')))
  } else {
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
}
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(t('CUST.translate88')))
  } else if (value !== state.checkForm.loginPwd) {
    callback(new Error(t('CUST.translate89')))
  } else {
    callback()
  }
}
const showDialog = () => {
  state.checkDia = true
}
// 6-16中英文数字
const validateAgentName = (rule, value, callback) => {
  if (value) {
    // 中文是个大坑，不能匹配中文，否则国际化得根据对于的国家来写不同的正则
    // const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[\u4e00-\u9fa5_0-9A-Za-z]{6,16}$/
    // const re = new RegExp(reg)
    // if (!re.test(value)) {
    //   callback(new Error(t('CUST.translate86')))
    // } else {
    //   callback()
    // }
    if (value.length < 6 || value.length > 16) {
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
    callback(new Error(t('CUST.translate220')))
  } 
}

const validatecommissionRatio = (rule, value, callback) => {
  if (value) {
    callback()
  } else {
    callback(new Error(t('CUST.translate206')))
  }
}

const rules = reactive({
  // agentPid: [{ required: true, message: '', trigger: 'blur' }],
  // agentType: [{ required: true, message: '请输入上级代理', trigger: 'blur' }],
  commissionRatio: [
    // { required: true, message: t('CUST.translate206'), trigger: 'change' },
    { validator: validatecommissionRatio, trigger: 'change' },
  ],
  agentAccount: [
    // { required: true, message: t('CUST.translate219'), trigger: ['change'] },
    { validator: validateAgentAccount, trigger: 'change' },
  ],
  // agentName: [
  //   { required: true, message: t('CUST.translate220'), trigger: 'change' },
  //   { validator: validateAgentName, trigger: 'change' },
  // ],
  loginPwd: [{ validator: validatePass, trigger: 'change' }],
  reloginPwd: [{ validator: validatePass2, trigger: 'change' }],
})
const deepClone2 = (obj) => {
  let _obj = JSON.stringify(obj)
  return JSON.parse(_obj);
}
onMounted(async () => {
  // state.formInline.parentAgent =  userStore.uid
  state.routeQueryId = route.query.agentId
  state.routeQueryName = route.query.agentAcccount
  console.log('mouted', route.query.agentId)
  state.checkForm.agentPid = userStore.userInfo.agentId
  state.currentAgaentName = userStore.userInfo.agentAccount
  state.checkForm.agentType = userStore.userInfo.agentType
  getSysSupportPlan().then(res => {
    state.checkForm.supportPlanList = deepClone2(res.data.records)
    state.supportPlanList = deepClone2(res.data.records)
  })
  state.checkForm.supportRatioConfig = 1
  query()
})

// 监听路由的变化
watch(
  () => route.query.agentId,
  newVal => {
    console.log('watch', newVal)
    state.routeQueryId = newVal
    query()
  }
)
watch(
  () => route.query.agentAcccount,
  newVal => {
    state.routeQueryName = newVal
  }
)

const handleClickDirectAgentNum = row => {
  if (row.directAgentNum > 0) {
    const id = row.agentId
    const name = row.agentAccount
    router.push({
      name: 'subordinateAgent',
      query: {
        agentId: `${state.routeQueryId ? `${state.routeQueryId},` : ''}${id}`,
        agentAcccount: `${state.routeQueryName ? `${state.routeQueryName}->` : ''}${name}`,
      },
    })
  }
}
const handleClickdirectUserNum = row => {
  if (row.directUserNum > 0) {
    const id = row.agentId
    const name = row.agentAccount
    router.push({
      name: 'subordinateMember',
      query: {
        agentId: `${state.routeQueryId ? `${state.routeQueryId},` : ''}${id}`,
        agentAcccount: `${state.routeQueryName ? `${state.routeQueryName}->` : ''}${name}`,
      },
    })
  }
}

const backToLastPage = () => {
  const idsArray = String(state.routeQueryId).split(',')
  const namesArray = String(state.routeQueryName).split('->')
  idsArray.pop()
  namesArray.pop()
  const ids = idsArray.join(',')
  const names = namesArray.join('->')
  if (ids) {
    router.push({ name: 'subordinateAgent', query: { agentId: ids, agentAcccount: names } })
  } else {
    router.push({ name: 'subordinateAgent' })
  }
}

const backToMyAgent = () => {
  router.push({ name: 'subordinateAgent' })
}
// 查询
const query = () => {
  let agentPid
  if (state.routeQueryId) {
    agentPid = String(state.routeQueryId).split(',').pop() * 1
    if (isNaN(agentPid)) {
      agentPid = undefined
    }
  }
  state.loading = true
  if (state.timeRange !== null) {
    state.formInline.startDate = state.timeRange[0]
    state.formInline.endDate = state.timeRange[1]
  } else {
    state.formInline.startDate = null
    state.formInline.endDate = null
  }
  getAgaentList({
    ...state.formInline,
    pageNum: state.current,
    pageSize: state.pageSize,
    agentStatus: state.formInline.agentStatus ? state.formInline.agentStatus * 1 : '',
    agentPid,
  }).then(res => {
    state.loading = false
    const result = res?.rows || []
    state.recordList = result
    state.total = res?.total
  })
}

const resetForm = formEl => {
  checkDia.value = false
  if (!formEl) return
  formEl.resetFields()
}
// 取消
const cancelDia = () => {
  checkDia.value = false
}

const submitForm = async formEl => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      addForm()
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 保存
const addForm = () => {
  state.loading = true
  addChildAgent({ ...state.checkForm, agentPid: state.checkForm.agentPid }).then(res => {
    state.loading = false
    if (res?.code === 200) {
      ElMessage.success(`${t('CUST.translate148')}！`)
      checkDia.value = false
      query()
    } else {
      ElMessage.error(res?.msg)
    }
  })
}
// 导出
const handleDownload = async () => {
  if (state.timeRange !== null) {
    state.formInline.startDate = state.timeRange[0]
    state.formInline.endDate = state.timeRange[1]
  } else {
    state.formInline.startDate = null
    state.formInline.endDate = null
  }
  let agentPid
  if (state.routeQueryId) {
    agentPid = String(state.routeQueryId).split(',').pop() * 1
    if (isNaN(agentPid)) {
      agentPid = undefined
    }
  }
  state.downloadLoading = true
  await exportReportTable({ ...state.formInline, agentPid }, t('CUST.translate185'), '', '/user/pageList/export')
  state.downloadLoading = false
}
function pageUpdate(val) {
  state.current = val
  query()
}
function sizeUpdate(val) {
  state.pageSize = val
  query()
}
</script>

<style lang="scss" scoped>
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.titles {
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #333333;
  padding: 6px 0 16px 0;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .return {
    padding: 5px 10px;
    background: var(--fontColor);
    color: #fff;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    min-width: fit-content;
  }
  .myAgent {
    min-width: fit-content;
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 15px;
  }
}

::v-deep .el-form--inline .el-form-item {
  margin-right: 20px;
}
.demo-form-inline {
  display: flex;
  align-items: center;
  // justify-content: space-between;
}
.but {
  background: var(--buttonBackgroundColor);
  border-radius: 5px;
  border: none;
  width: 90px;
  height: 32px;
  color: #fff;
}
.normal {
  display: inline-block;
  padding: 0 10px;
  height: 22px;
  background: rgba(6, 176, 80, 0.2);
  border-radius: 3px;
  border: 1px solid #06b050;
  text-align: center;
  line-height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #06b050;
}
.frozen {
  padding: 0 10px;
  display: inline-block;
  height: 22px;
  background: rgba(215, 49, 49, 0.2);
  border-radius: 3px;
  border: 1px solid #d73131;
  text-align: center;
  line-height: 22px;

  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #d73131;
}

.form-items-body {
  margin-left: 10px;
  margin-right: 10px;
}
.buts {
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
.inputs {
  height: 42px;
}
.searchAgentId {
  color: var(--fontColor);
  text-decoration: underline;
  cursor: pointer;
  min-width: 50px;
}
.fuchiWrapper {
  width: 90%;
  margin: 5px auto;
  border: 1px solid #eee;
  padding: 10px;
}
.support {
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  margin-bottom: 8px;
}
.support_center {
  width: 120px;
  height: 28px;
  margin-left: 10px;
}
</style>
