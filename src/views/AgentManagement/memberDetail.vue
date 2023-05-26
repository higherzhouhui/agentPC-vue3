<template>
  <div class="user-list-wrap">
    <div class="titles">
      <span class="title">
      <span v-if="route.query.detailId">{{ route.query.detailId }}</span>
      {{ $t('AGENT.translate1') }}
      </span>
      <span v-if="route.query.detailId">
        <span class="return" @click="backToLastPage">
          {{$t('AGENT.translate3')}}
        </span>
      </span>
    </div>
    <el-scrollbar>
      <div class="searchTabWrapper">
      <el-form :inline="true" :model="state.formInline" class="demo-form-inline">
        <!-- <el-form-item :label="`${t('CUST.translate222')}：`" class="form-items-body">
          <el-input v-model="state.formInline.uid" :placeholder="t('CUST.translate223')" class="form-items" clearable />
        </el-form-item> -->
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
        <!-- <el-form-item :label="`${t('CUST.translate64')}：`" class="form-items-body">
          <el-date-picker
            v-model="state.rangeTime"
            type="daterange"
            :range-separator="t('CUST.translate192')"
            :start-placeholder="t('CUST.translate193')"
            :end-placeholder="t('CUST.translate194')"
            style="width: 250px"
            value-format="YYYY-MM-DD"
          />
        </el-form-item> -->
        <el-form-item :label="`${t('CUST.translate228')}：`" class="form-items-body">
          <el-date-picker
            v-model="state.formInline.month"
            type="month"
            :placeholder="t('CUST.translate229')"
             
            format="YYYY/MM"
            value-format="YYYY-MM"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="query" class="but" icon="Search" type="primary" style="margin-left: 10px; margin-right: 10px"
            >{{$t('CUST.translate195')}}</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetSearchForm" class="resetButton">{{$t('CUST.translate196')}}</el-button>
        </el-form-item>
      </el-form>
      <div class="tabsList">
        <div :class="`tab ${state.currentType === item.type ? 'active' : ''}`" 
          v-for="(item, index) in tabList" 
          :key="index"
          @click="shiftTab(item.type)">
          {{item.label}}
        </div>
      </div>
    </div>
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
        <template #status="{ row }">
          <el-tag :type="statusType[row.status || 0].class">
            {{ statusType[row.status || 0].label }}
          </el-tag>
        </template>
        <template #makeMoney="{ row }">
          <div :class="Number(row.winLoseAmt) < 0 ? 'loseColor' : 'winColor'">
            {{ Math.abs(row.winLoseAmt) }}
          </div>
        </template>
        <template #uid="{ row }">
          <div>
            {{ state.routeQueryDetailId }}
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import Table from '@/components/ProTable/index.vue'
import { queryMemberGameData, queryMemberDepositData, 
        queryMemberWithdrawData, queryMemberBonusData, queryMemberGiftData } from '@/api/agaentaccount'
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router'
import { useUserStore, useAppStore } from '@/store'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const statusType = [
  { label: t('CUST.translate278'), class: 'info', value: 0  },
  { label: t('CUST.translate259'), class: 'success', value: 1 },
  { label: t('CUST.translate277'), class: 'danger', value: 2 },
  { label: t('CUST.lock'), class: 'default', value: 3 },
  { label: t('CUST.unlock'), class: 'default', value: 4 },
  { label: t('CUST.daifu'), class: 'info', value: 5 }, 
  { label: t('CUST.rengongjdf'), class: 'default', value: 6 },
  { label: t('CUST.daifuing'), class: 'info', value: 7 }
]
const state = reactive({
  recordList: [],
  columns: [],
  total: 30,
  pageSize: 10,
  current: 1,
  formInline: {
    month: ''
  },
  loading: true,
  routeQueryId: '',
  routeQueryName: '',
  routeQueryDetailId: '',
  currentType: '',
})
const tabList =  [
    {label: t('AGENT.translate9'), type: 'gameWin'},
    {label: t('AGENT.translate10'), type: 'saveDetail'},
    {label: t('AGENT.translate11'), type: 'useDetail'},
    {label: t('AGENT.translate12'), type: 'sendDetail'},
    {label: t('AGENT.translate13'), type: 'giftDetail'},
  ]
const resetSearchForm = () => {
  state.formInline = {
    month: ''
  }
  state.current = 1
  query()
}

onMounted(async () => {
  state.routeQueryId = route.query.agentId
  state.routeQueryName = route.query.agentAcccount
  state.routeQueryDetailId = route.query.detailId
  state.currentType = route.query.type || 'gameWin'
  query()
})

// 监听路由的变化
watch(() => route.query.type, (newVal) => {
  state.currentType = newVal
  // 页面重置
  state.current = 1
  query()
})

const backToLastPage = () => {
  if (state.routeQueryId) {
    router.push({ name: 'subordinateMember', query: { agentId: state.routeQueryId, agentAcccount: state.routeQueryName }})
  } else {
    router.push({ name: 'subordinateMember' })
  }
}

const shiftTab = (type) => {
  const agentId = state.routeQueryId
  const agentAcccount = state.routeQueryName
  const detailId = state.routeQueryDetailId
  const query = {
    agentId,
    agentAcccount,
    detailId,
    type,
  }
  router.push({ name: 'subordinateMemberDetail', query })
}


function pageUpdate(val) {
  state.current = val
  query()
}
function sizeUpdate(val) {
  state.pageSize = val
  query()
}

// 查询
const query = () => {
  const queryData = {
    ...state.formInline,
    pageNum: state.current,
    pageSize: state.pageSize,
    uid: state.routeQueryDetailId
  }
  state.loading = true
  switch(state.currentType) {
    case tabList[0].type: 
      state.columns = [
        { prop: 'gameName', label: t('AGENT.translate14') },
        { prop: 'betAmt', label: t('CUST.translate34') },
        { prop: 'payoutAmt', label: t('AGENT.translate15') },
        { prop: 'validBetAmt', label: t('AGENT.translate16') },
        { prop: 'winLoseAmt', label: t('CUST.translate297'), slot: 'makeMoney' },
      ]
      queryMemberGameData(queryData).then(res =>  {
        const result = res?.rows || []
        state.recordList = result
        state.total = res?.total
        state.loading = false
      })
    break;
      case tabList[1].type: 
      state.columns = [
        { prop: 'orderNo', label: t('CUST.translate280') },
        { prop: 'uid', label: t('AGENT.translate17'), slot: 'uid' },
        { prop: 'depositAmt', label: t('AGENT.translate18') },
        { prop: 'orderTime', label: t('CUST.translate283') },
        // { prop: 'status', label: t('CUST.translate130'), slot: 'status' },
      ]
      queryMemberDepositData(queryData).then(res =>  {
        const result = res?.rows || []
        state.recordList = result
        state.total = res?.total
        state.loading = false
      })
    break;
      case tabList[2].type: 
      state.columns = [
        { prop: 'orderNo', label: t('CUST.translate280') },
        { prop: 'uid', label: t('AGENT.translate17'), slot: 'uid' },
        { prop: 'withdrawAmt', label: t('AGENT.translate19') },
        { prop: 'orderTime', label: t('CUST.translate283') },
        { prop: 'statusType', label: t('CUST.translate130'), slot: 'status' },
      ]
      queryMemberWithdrawData(queryData).then(res =>  {
        const result = res?.rows || []
        state.recordList = result
        state.total = res?.total
        state.loading = false
      })
      break;
    case tabList[3].type: 
      state.columns = [
        { prop: 'orderNo', label: t('CUST.translate280') },
        { prop: 'uid', label: t('AGENT.translate17'), slot: 'uid' },
        { prop: 'typeName', label: t('AGENT.translate20') },
        { prop: 'bonusAmt', label: t('AGENT.translate21') },
        { prop: 'orderTime', label: t('CUST.translate283') },
        // { prop: 'status', label: t('CUST.translate130'), slot: 'status' },
      ]
      queryMemberBonusData(queryData).then(res =>  {
        const result = res?.rows || []
        result.map(item => {
          if (appStore.lang === 'zh') {
            item.typeName = item.typeNameZh
          }
          if (appStore.lang === 'vi') {
            item.typeName = item.typeNameVi
          }
          if (appStore.lang === 'jp') {
            item.typeName = item.typeNameJp
          }
          if (appStore.lang === 'th') {
            item.typeName = item.typeNameTh
          } 
        })
        state.recordList = result
        state.total = res?.total
        state.loading = false
      })
      break;
    case tabList[4].type: 
      state.columns = [
        { prop: 'rewardTime', label: t('CUST.translate231') },
        { prop: 'giftAmt', label: t('AGENT.translate22') },
      ]
      queryMemberGiftData(queryData).then(res =>  {
        const result = res?.rows || []
        state.recordList = result
        state.total = res?.total
        state.loading = false
      })
      break;
  }
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
    background: var(--background);
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
.searchTabWrapper {
  display: flex;
  justify-content: space-between;
}
.tabsList {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  .tab {
    padding: 0px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    background: #fff;
    color: var(--background);
    border: 1px solid var(--background);
    border-radius: 5px;
    cursor: pointer;
    margin-left: 12px;
    min-width: fit-content;
  }
  .active {
    border: none;
    color: #fff;
    background: var(--buttonBackgroundColor);
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
    color: #4506e5;
  }
}
</style>
