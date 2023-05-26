<template>
  <div class="user-list-wrap">
    <div class="titles">{{ $t('CUST.translate241') }}</div>
    <el-form :inline="true" :model="state.formInline" class="demo-form-inline">
      <el-form-item :label="`${t('CUST.translate209')}：`" class="form-items-body">
        <el-input
          clearable
          v-model="state.formInline.agentAccount"
          :placeholder="t('CUST.translate242')"
          class="form-items"
        />
      </el-form-item>

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
        show-summary
        :sum-text="t('CUST.translate230')"
        maxHeight="calc(100vh - 330px)"
      >
        <!-- <template #commissionRatio="{ row }">
          <div v-if="row.commissionRatio !== null && row.commissionRatio !== undefined">
            {{ `${row.commissionRatio}%` }}
          </div>
        </template> -->
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
import { reactive, onMounted } from 'vue'
import Table from '@/components/ProTable/index.vue'
import { memberCommissionStatis } from '@/api/reportForm/reportForm'
import { useI18n } from 'vue-i18n'
import { exportReportTable } from '@/utils/index'
const { t } = useI18n()
const state = reactive({
  recordList: [],
  columns: [
    { prop: 'agentId', label: t('CUST.dlID'), minWidth: 120 },
    { prop: 'month', label: t('CUST.translate231'), width: 120 },
    { prop: 'agentAccount', label: t('CUST.translate209'), width: 180 },
    { prop: 'newValidPerson', label: t('CUST.translate243'), minWidth: 360 },
    { prop: 'totalBetAmt', label: t('CUST.translate244'), width: 200 },
    { prop: 'totalBetValidAmt', label: t('CUST.translate245'), width: 280 },
    { prop: 'totalProfit', label: t('CUST.translate246'), width: 300, slot: 'totalProfit' },
    { prop: 'bonusAmt', label: t('CUST.translate247'), width: 220 },
    { prop: 'platformAmt', label: t('CUST.translate248'), width: 160 },
    { prop: 'netProfitAmt', label: t('CUST.translate249'), width: 210 },
    { prop: 'commissionRatio', label: t('CUST.translate250'), width: 180, slot: 'commissionRatio' },
    { prop: 'memberCommission', label: t('CUST.translate251'), minWidth: 320 },
    // { prop: 'directAgentAmt', label: '本月直属代理佣金' },
  ],
  total: 0,
  pageSize: 10,
  current: 1,
  formInline: {},

  selectTime: [
    {
      name: '今日',
      Check: true,
    },
    {
      name: '昨日',
      Check: false,
    },
    {
      name: '本周',
      Check: false,
    },
    {
      name: '上周',
      Check: false,
    },
    {
      name: '本月',
      Check: false,
    },
    {
      name: '上月',
      Check: false,
    },
  ],
  loading: true,
  downloadLoading: false,
})
const resetSearchForm = () => {
  state.formInline = {
    agentAccount: '',
    month: '',
  }
  state.current = 1
  query()
}
onMounted(() => {
  memberCommissionStatisData()
})
const memberCommissionStatisData = () => {
  state.loading = true
  memberCommissionStatis({
    ...state.formInline,
    pageNum: state.current,
    pageSize: state.pageSize,
  }).then(item => {
    if (item.code === 200) {
      state.recordList = item.rows || []
      state.recordList.map(citem => {
        citem.commissionRatio = citem.commissionRatio ? citem.commissionRatio + '%' : 0
      })
      state.total = item.total
    }
    state.loading = false
    console.log(item)
  })
}

// 查询
const query = () => {
  memberCommissionStatisData()
  console.log(state.formInline)
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

// 底部合计
// const getSummaries = param => {
//   const { columns, data } = param
//   const sums = []
//   columns.forEach((column, index) => {
//     if (index === 0) {
//       sums[index] = '当前页汇总'
//       return
//     }
//     // 不计算项
//     if (index === 1 || index === 9) {
//       sums[index] = '--'
//       return
//     }
//     const values = data.map(item => Number(item[column.property]))
//     if (!values.every(value => Number.isNaN(value))) {
//       sums[index] = `${values.reduce((prev, curr) => {
//         const value = Number(curr)
//         if (!Number.isNaN(value)) {
//           return prev + curr
//         } else {
//           return prev
//         }
//       }, 0)}`
//     } else {
//       sums[index] = '--'
//     }
//   })

//   return sums
// }
// 导出
const handleDownload = async () => {
  state.downloadLoading = true
  await exportReportTable(state.formInline, t('CUST.translate241'), 'memberCommissionStatis')
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
