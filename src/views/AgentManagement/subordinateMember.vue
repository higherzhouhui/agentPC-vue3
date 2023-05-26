<template>
  <div class="user-list-wrap">
    <div class="titles">
      <span class="title">
        <span v-if="userStore.account">{{
          state.routeQueryName ? `${userStore.account}->${state.routeQueryName}` : ''
        }}</span>
        {{ $t('CUST.translate221') }}
      </span>
      <span v-if="route.query.agentId">
        <span @click="backToMyAgent" class="myAgent">{{ $t('AGENT.translate2') }}</span>
        <span class="return" @click="backToLastPage">
          {{ $t('AGENT.translate3') }}
        </span>
      </span>
    </div>
    <el-scrollbar>
      <el-form :inline="true" :model="state.formInline" class="demo-form-inline">
        <el-form-item :label="`${t('CUST.translate222')}：`" class="form-items-body">
          <el-input v-model="state.formInline.uid" :placeholder="t('CUST.translate223')" class="form-items" clearable />
        </el-form-item>
        <!-- <el-form-item label="上级代理:" class="form-items-body">
          <el-input v-model="state.formInline.account12" placeholder="请输入上级代理" class="form-items" clearable />
        </el-form-item> -->
        <!-- <el-form-item label="状态:" class="form-items-body">
          <el-select v-model="state.formInline.status" class="m-2 form-items" placeholder="请选择状态" clearable>
            <el-option value="1" label="全部"></el-option>
            <el-option value="2" label="冻结"></el-option>
            <el-option value="3" label="正常"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="`${t('CUST.translate64')}：`" class="form-items-body">
          <el-date-picker
            v-model="state.rangeTime"
            type="daterange"
            :range-separator="t('CUST.translate192')"
            :start-placeholder="t('CUST.translate193')"
            :end-placeholder="t('CUST.translate194')"
            style="width: 250px"
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
          />
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
        show-summary
        :sum-text="t('CUST.translate230')"
        maxHeight="calc(100vh - 320px)"
      >
        <template #totalWithdrawAmt="{ row }">
          <p>
            <b>{{ t('AGENT.translate25') }}:</b> {{ row.auditWithdrawAmt || '-' }}
          </p>
          <p>
            <b>{{ t('AGENT.translate26') }}:</b> {{ row.X || 0 }}
          </p>
        </template>
        <template #status="{ row }">
          <div v-if="row.status === '2'" class="normal">{{ $t('CUST.translate116') }}</div>
          <div v-if="row.status === '3'" class="frozen">{{ $t('CUST.translate191') }}</div>
        </template>
        <template #uid="{ row }">
          <div class="link_font" @click="routerToDetail(row.uid)">
            {{ row.uid }}
          </div>
        </template>
        <template #nickName="{ row }">
            {{ row.nickName }}
        </template>
        <template #makeMoney="{ row }">
          <div :class="Number(row.netProfitAmt) < 0 ? 'loseColor' : 'winColor'">
            {{ row.netProfitAmt }}
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs, watch } from 'vue'
import Table from '@/components/ProTable/index.vue'
import { getNumberList } from '@/api/agaentaccount'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { exportReportTable } from '@/utils/index'
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const state = reactive({
  recordList: [],
  columns: [
    { prop: 'agentId', label: t('CUST.dlID'), minWidth: 120 },
    { prop: 'uidX', label: t('CUST.translate222'), minWidth: 160, slot: 'uid' },
    { prop: 'nickNameX', label: t('CUST.translate63'), minWidth: 120, slot: 'nickName' },
    { prop: 'firstDepositAmt', label: t('CUST.translate225'), minWidth: 200 },
    { prop: 'lastDepositAmt', label: t('CUST.translate224'), minWidth: 200 },
    { prop: 'totalDepositAmt', label: t('AGENT.translate4'), minWidth: 200 },
    // { prop: 'auditWithdrawAmt', label: t('AGENT.translate25'), minWidth: 110 },
    { prop: 'totalWithdrawAmtX', label: t('AGENT.translate5'), minWidth: 250, slot: 'totalWithdrawAmt' },
    { prop: 'totalGiftAmt', label: t('AGENT.translate6'), minWidth: 200 },
    { prop: 'totalBetAmt', label: t('CUST.translate233'), sortable: true, minWidth: 220 },
    { prop: 'netProfitAmt', label: t('CUST.translate39'), slot: 'makeMoney', sortable: true, minWidth: 200 },
    // { prop: 'status', label: '状态', slot: 'status' },
    { prop: 'createTime', label: t('CUST.translate64'), minWidth: 180 },
    { prop: 'lastLoginTime', label: t('CUST.translate226'), minWidth: 240 },
  ],
  total: 30,
  pageSize: 10,
  current: 1,
  formInline: {
    uid: '',
    endDate: '',
    startDate: '',
  },
  checkDia: false,
  checkFormRef: null,
  checkForm: {
    uid: '',
    endDate: '',
    startDate: '',
  },
  checkDiaType: '',
  rangeTime: [],
  loading: true,
  routeQueryId: '',
  routeQueryName: '',
  downloadLoading: false,
})
const { checkDia, checkForm, checkFormRef } = toRefs(state)
const resetSearchForm = () => {
  state.formInline = {
    uid: '',
    endDate: '',
    startDate: '',
  }
  state.rangeTime = ''
  state.current = 1
  query()
}
const getThisMonthDate = () => {
  if (!state.rangeTime || !state.rangeTime.length) {
    const year = new Date().getFullYear()
    let month = new Date().getMonth() + 1
    const beginDay = '01'
    let endDay = new Date().getDate()
    if (month < 10) {
      month = '0' + month
    }
    if (endDay < 10) {
      endDay = '0' + endDay
    }
    state.rangeTime = [`${year}-${month}-${beginDay}`, `${year}-${month}-${endDay}`]
  }
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
  getThisMonthDate()
  if (state.rangeTime !== null) {
    state.formInline.startDate = state.rangeTime[0]
    state.formInline.endDate = state.rangeTime[1]
  } else {
    state.formInline.startDate = null
    state.formInline.endDate = null
  }
  getNumberListQuery()
}

const resetForm = () => {
  checkFormRef.value.resetFields()
}
// 取消
const cancelDia = () => {
  resetForm()
  checkDia.value = false
}

// 保存
const addForm = () => {
  console.log(checkForm.value)
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
  let agentId
  if (state.routeQueryId) {
    agentId = String(state.routeQueryId).split(',').pop() * 1
    if (isNaN(agentId)) {
      agentId = undefined
    }
  }
  getNumberList({
    ...state.formInline,
    pageNum: state.current,
    pageSize: state.pageSize,
    agentId,
  }).then(res => {
    const result = res?.rows || []
    result.map(item => {
      item.X = Math.abs(item.X)
      item.firstDepositAmt = item.firstDepositAmt || '-'
      item.lastDepositAmt = item.lastDepositAmt || '-'
    })
    state.recordList = [...result]
    state.total = res?.total
    state.loading = false
  })
}

// 导出
const handleDownload = async () => {
  if (state.rangeTime !== null) {
    state.formInline.startDate = state.rangeTime[0]
    state.formInline.endDate = state.rangeTime[1]
  } else {
    state.formInline.startDate = null
    state.formInline.endDate = null
  }
  let agentId
  if (state.routeQueryId) {
    agentId = String(state.routeQueryId).split(',').pop() * 1
    if (isNaN(agentId)) {
      agentId = undefined
    }
  }
  state.downloadLoading = true
  await exportReportTable({ ...state.formInline, agentId }, t('CUST.translate221'), '', '/user/directMemberList/export')
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
  width: 200px !important;
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
