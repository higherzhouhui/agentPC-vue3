<template>
  <div class="user-list-wrap">
    <div class="titles">{{ $t('CUST.translate284') }}</div>
    <el-form :inline="true" :model="state.formInline" class="demo-form-inline">
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
        <el-button @click="query" class="but" type="primary" icon="Search">{{ $t('CUST.translate195') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetSearchForm" class="resetButton">{{ $t('CUST.translate196') }}</el-button>
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
    <div class="warpperTable" v-loading="state.loading">
      <Table
        :data="state.recordList"
        :columns="state.columns"
        :total="state.total"
        :pageSize="state.pageSize"
        :current="state.current"
        :pageUpdate="pageUpdate"
        :sizeUpdate="sizeUpdate"
        maxHeight="calc(100vh - 330px)"
        show-summary
        :sum-text="t('CUST.translate230')"
      >
        <template #status="{ row }">
          <el-tag :type="row.status === 1 ? 'info' : row.status === 2 ? '' : 'success'">{{
            row.status === 1
              ? t('CUST.translate257')
              : row.status === 2
              ? t('CUST.translate258')
              : t('CUST.translate285')
          }}</el-tag>
        </template>

        <template #totalProfit="{ row }">
          <div :class="Number(row.totalProfit) < 0 ? 'loseColor' : 'winColor'">
            {{ row.totalProfit }}
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, onMounted } from 'vue'
import Table from '@/components/ProTable/index.vue'
import { myCommissionSettleRecord } from '@/api/reportForm/reportForm'
import { exportReportTable } from '@/utils/index'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const state = reactive({
  recordList: [],
  columns: [
    { prop: 'agentId', label: t('CUST.dlID'), minWidth: 120 },
    { prop: 'month', label: t('CUST.translate231'), width: 120 },
    { prop: 'totalBetAmt', label: t('CUST.translate286'), width: 170 },
    { prop: 'totalProfit', label: t('CUST.translate246'), width: 320, slot: 'totalProfit' },
    { prop: 'bonusAmt', label: t('CUST.translate247'), width: 240 },
    { prop: 'totalLotteryRebate', label: t('CUST.zbcpfanshui'), width: 220 },
    { prop: 'directMemberAmt', label: t('CUST.translate287'), width: 310 },
    { prop: 'directAgentAmt', label: t('CUST.translate288'), width: 280 },
    { prop: 'supportAmt', label: t('CUST.translate289'), width: 280 },
    { prop: 'giftAmt', label: t('CUST.translate293'), minWidth: 280 },
    { prop: 'modifyAmt', label: t('CUST.translate294'), minWidth: 280 },
    { prop: 'reversalAmt', label: t('CUST.translate290'), minWidth: 280 },
    { prop: 'totalAmt', label: t('CUST.translate291'), width: 280 },
    { prop: 'remark', label: t('CUST.translate292'), minWidth: 200 },
    { prop: 'statusType', label: t('CUST.translate130'), slot: 'status', width: 180 },
  ],
  total: 30,
  pageSize: 10,
  current: 1,
  formInline: {
    month: '',
  },
  loading: true,
  downloadLoading: false,
})

onMounted(() => {
  myCommissionSettleRecordData()
})
//statu: 1、未结算；2、待发放；3、已发放

const myCommissionSettleRecordData = () => {
  state.loading = true
  myCommissionSettleRecord({
    ...state.formInline,
    pageNum: state.current,
    pageSize: state.pageSize,
  }).then(item => {
    state.loading = false
    const result = item?.rows || []
    state.recordList = result
    state.total = item?.total
  })
}
const resetSearchForm = () => {
  state.formInline = {
    month: '',
  }
  state.current = 1
  query()
}
// 查询
const query = () => {
  myCommissionSettleRecordData()
  console.log(state.formInline)
}
// 导出
const handleDownload = async () => {
  state.downloadLoading = true
  await exportReportTable(state.formInline, t('CUST.translate284'), 'myCommissionSettleRecord')
  state.downloadLoading = false
}
// 点击切换
const Check = data => {
  console.log('这是什么数据', data)
  state.selectTime.forEach(item => {
    if (item.name === data.name) {
      item.Check = true
    } else {
      item.Check = false
    }
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
</script>

<style lang="scss" scoped>
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.displayf {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.displayf2 {
  display: flex;
  align-items: center;
}
.Check1 {
  width: 60px;
  height: 32px;
  background: var(--buttonBackgroundColor);
  border-radius: 5px;
  border: none;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #fff;
}
.Check2 {
  width: 60px;
  height: 32px;
  background: #f5f7fe;
  border-radius: 5px;
  border: none;

  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #333333;
  &:hover {
    background: #d3d4da;
    color: #514b4b;
  }
}
.but {
  background: var(--buttonBackgroundColor);
  border-radius: 5px;
  border: none;
  height: 32px;
  color: #fff;
}
.form-items-body {
  margin-left: 20px;
  margin-right: 20px;
}
.titles {
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #333333;
  padding: 0 0 16px 0;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 15px;
}
.form-items {
  width: 200px !important;
}
.color1 {
  color: #008000;
}
.color2 {
  color: red;
}
</style>
