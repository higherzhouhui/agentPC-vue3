<template>
  <div class="user-list-wrap">
    <div class="titles">
      <span class="title">
        <span v-if="userStore.account">{{
          state.routeQueryName ? `${userStore.account}->${state.routeQueryName}` : ''
        }}</span>
        {{ t('CUST.zikaicaifanlimingxi') }}
      </span>
    </div>
    <el-scrollbar>
      <el-form :inline="true" :model="state.formInline" class="demo-form-inline">
        <el-form-item :label="`${t('CUST.dlID')}：`" class="form-items-body">
          <el-input
            v-model="state.formInline.agentId"
            :placeholder="t('CUST.qingshurudailiID')"
            class="form-items"
            clearable
          />
        </el-form-item>
        <el-form-item :label="`${t('CUST.translate203')}:`" class="form-items-body">
          <el-input
            v-model="state.formInline.parentAgent"
            :placeholder="t('CUST.qingshurushangjizhanghao')"
            class="form-items"
            clearable
          />
        </el-form-item>
        <el-form-item :label="`${t('CUST.translate231')}：`" class="form-items-body">
          <el-date-picker
            v-model="state.formInline.date"
            type="date"
            style="width: 250px"
            :placeholder="t('CUST.translate229')"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item :label="`${t('CUST.translate130')}:`" class="form-items-body">
          <el-select
            v-model="state.formInline.status"
            class="m-2 form-items"
            :placeholder="`${t('CUST.translate189')}`"
            clearable
          >
            <el-option value="2" :label="t('CUST.translate258')"></el-option>
            <el-option value="3" :label="t('CUST.translate259')"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="query" class="searchButton" type="primary" icon="Search" style="margin-left: 10px; margin-right: 10px">{{
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
            style="margin-right: 10px"
          >
            {{ t('exportReport') }}
          </el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button class="resetButton" type="success" @click="Onekeygrant">
            {{ t('CUST.yijianfafang') }}
          </el-button>
        </el-form-item> -->
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
        show-summary
        :sum-text="t('CUST.translate230')"
        maxHeight="calc(100vh - 320px)"
      >
      
        <template #agentIdX="{ row }">
          {{ row.agentId }}
        </template>
        <template #agentType="{ row }">
          <div v-if="row.agentType === 0">{{ $t('CUST.translate197') }}</div>
          <div v-if="row.agentType === 1">{{ $t('CUST.translate198') }}</div>
          <div v-if="row.agentType === 2">{{ $t('CUST.translate199') }}</div>
          <div v-if="row.agentType === 3">{{ $t('CUST.translate200') }}</div>
          <div v-if="row.agentType === 4">{{ $t('CUST.translate201') }}</div>
        </template>
        <template #status="{ row }">
          <el-tag :type="row.status == 2 ? 'info' : 'success'">
            {{ `${row.status == 2 ? t('CUST.translate258') : t('CUST.translate259')}` }}
          </el-tag>
        </template>
        <template #rebateRatio="{ row }">
          {{ `${row.rebateRatio}%` }}
        </template>
        <template #buts="{ row }">
          <el-button type="" v-if="row.status == 2" @click="grant(row)">{{ t('CUST.fanlifafang') }}</el-button>
        </template>
      </Table>
    </div>

    <el-dialog
      v-model="dialogCreateVisible"
      :before-close="cancelDia"
      :title="t('CUST.fafangshijianliexing')"
      :width="userStore.lang == 'zh' ? 600 : 600"
    >
      <div v-loading="state.actionLoading">
        <el-scrollbar max-height="400px">
          <el-form
            :model="checkForm"
            ref="checkFormRef"
            :label-width="userStore.lang == 'zh' ? '150px' : '100px'"
            label-position="right"
            style="min-height: 200px"
          >
            <el-form-item prop="bindStatus" :label="`${t('CUST.fafangmethod')}：`">
              <el-radio-group v-model="checkForm.type" class="ml-4 inputs1">
                <el-radio :label="1" size="small">{{ $t('CUST.anyuefafang') }}</el-radio>
                <el-radio :label="2" size="small">{{ $t('CUST.anriqifafang') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <div style="display: flex; align-items: center">
              <el-form-item v-if="checkForm.type == 1" prop="month" :label="t('CUST.anyuefafang')">
                <el-date-picker
                  v-model="state.checkForm.month"
                  type="date"
                  clearable
                  :placeholder="t('CUST.xuanzefafangyuefeng')"
                  @change="state.checkForm.date = null"
                  style="width: 150px"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
              <el-form-item v-else prop="date" :label="t('CUST.anriqifafang')">
                <el-date-picker
                  v-model="state.checkForm.date"
                  @change="state.checkForm.month = null"
                  type="date"
                  clearable
                  :placeholder="t('CUST.xuanzefafangriqi')"
                  style="width: 150px"
                  value-format="x"
                />
              </el-form-item>
            </div>
          </el-form>
        </el-scrollbar>
      </div>
      <template #footer>
        <div class="but2">
          <el-button size="medium" @click="cancelDia" class="buts1">{{ $t('CUST.translate97') }}</el-button>
          <el-button type="primary" size="medium" @click="addForm" :loading="state.actionLoading" class="buts2">{{
            // $t('CUST.translate98')
            t('CUST.fafang')
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs, watch } from 'vue'
import Table from '@/components/ProTable/index.vue'
import { agentLotteryRebateRecord, giveAllLotteryRebate, giveLotteryRebateById } from '@/api/reportForm/reportForm'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { exportReportTable } from '@/utils/index'
import { ElMessage } from 'element-plus'
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const state = reactive({
  recordList: [],
  columns: [
    { prop: 'rebateDate', label: t('CUST.translate231'), minWidth: 130 },
    { prop: 'agentIdX', label: t('CUST.dlID'), minWidth: 100, slot: 'agentIdX' },
    { prop: 'agentAccount', label: t('CUST.translate209'), width: 200 },
    { prop: 'agentTypeX', label: t('CUST.translate65'), slot: 'agentType', width: 200 },
    { prop: 'lotteryAmt', label: t('CUST.zikaicailiushuizonge'), minWidth: 130 },
    { prop: 'lotteryNum', label: t('CUST.translate232'), minWidth: 200 },
    { prop: 'rebateRatioX', label: t('CUST.fanshuidianwei'), slot: 'rebateRatio', width: 180 },
    { prop: 'rebateAmt', label: t('CUST.fanshuijine'), width: 180 },
    { prop: 'statusX', label: t('CUST.translate130'), slot: 'status', width: 180 },
  ],
  total: 30,
  pageSize: 10,
  current: 1,
  formInline: {
    agentId: '',
    parentAgent: '',
    date: null,
    status: '',
  },
  checkDia: false,
  checkFormRef: null,
  checkForm: {
    month: null,
    date: null,
    type: 1,
  },
  checkDiaType: '',
  rangeTime: [],
  loading: true,
  routeQueryId: '',
  routeQueryName: '',
  downloadLoading: false,

  dialogCreateVisible: false,
  actionLoading: false,
})
const { checkDia, checkForm, checkFormRef, actionLoading, dialogCreateVisible } = toRefs(state)
const resetSearchForm = () => {
  state.formInline = {
    agentId: '',
    parentAgent: '',
    date: null,
    status: '',
  }
  state.rangeTime = ''
  state.current = 1
  query()
}

onMounted(async () => {
  state.routeQueryId = route.query.agentId
  state.routeQueryName = route.query.agentAcccount
  query()
})

// 监听路由的变化
watch(
  () => route.query.agentId,
  newVal => {
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
  router.push({ name: 'subordinateMember' })
}

const routerToDetail = uid => {
  if (state.routeQueryId) {
    router.push({
      name: 'subordinateMemberDetail',
      query: { agentId: state.routeQueryId, agentAcccount: state.routeQueryName, detailId: uid },
    })
  } else {
    router.push({ name: 'subordinateMemberDetail', query: { detailId: uid } })
  }
}
// 查询
const query = () => {
  state.loading = true
  getNumberListQuery()
}

const resetForm = () => {
  checkFormRef.value.resetFields()
}
// 取消
const cancelDia = () => {
  resetForm()
  dialogCreateVisible.value = false
}

// 一键发放
const Onekeygrant = () => {
  dialogCreateVisible.value = true
}
// 单行返利发放
const grant = row => {
  giveLotteryRebateById({
    operator: JSON.parse(sessionStorage.getItem('userInfo')).agentAccount,
    id: row.id,
  }).then(item => {
    query()
    ElMessage({
      message: t('CUST.fafangchenggong'),
      type: 'success',
    })
  })
}

// 保存
const addForm = () => {
  const { month, date, type } = checkForm.value
  actionLoading.value = true
  giveAllLotteryRebate({
    operator: JSON.parse(sessionStorage.getItem('userInfo')).agentAccount,
    date: type == 2 ? date : undefined,
    month: type == 1 ? month : undefined,
  })
    .then(item => {
      query()
      actionLoading.value = false
      dialogCreateVisible.value = false
      resetForm()
      ElMessage({
        title: t('CUST.translate15'),
        message: t('CUST.fafangchenggong'),
        type: 'success',
      })
    })
    .catch(err => {
      actionLoading.value = false
      ElMessage.error(err)
    })
}

function pageUpdate(val) {
  state.current = val
  query()
}
function sizeUpdate(val) {
  state.pageSize = val
  query()
}

function submitForm() {
  checkFormRef.value.validate(valid => {
    console.log(valid)
  })
}

const getNumberListQuery = () => {
  //   let agentId
  //   if (state.routeQueryId) {
  //     agentId = String(state.routeQueryId).split(',').pop() * 1
  //     if (isNaN(agentId)) {
  //       agentId = undefined
  //     }
  //   }
  agentLotteryRebateRecord({
    ...state.formInline,
  }).then(res => {
    // console.log('查询数据', res)
    const result = res?.rows || []
    state.recordList = [...result]
    state.total = res?.total
    state.loading = false
  })
}

// 导出
const handleDownload = async () => {
  state.downloadLoading = true
  await exportReportTable({ ...state.formInline }, t('CUST.zikaicaifanlimingxi'), '/agentLotteryRebateRecord')
  state.downloadLoading = false
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
  margin-right: 0;
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
  height: 32px;
  color: #fff;
}

.but2 {
  display: flex;
  justify-content: flex-end;
}
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

.normal {
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
.form-items {
  width: 260px!important;
}
.form-items-body {
  margin-left: 20px;
  margin-right: 20px;
}
.link_font {
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: var(--fontColor);
  // text-decoration: underline;
  position: relative;
  cursor: pointer;
  width: fit-content;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 3px;
    background: var(--fontColor);
  }
  &:hover {
    color: var(--backgroundHover);
  }
}
</style>
