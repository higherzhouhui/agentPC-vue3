<template>
  <div class="user-list-wrap">
    <div class="titles">{{ $t('CUST.translate255') }}</div>
    <el-form :inline="true" :model="state.formInline" class="demo-form-inline">
      <el-form-item :label="`${t('CUST.translate209')}:`" class="form-items-body">
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
        show-summary
        :sum-text="t('CUST.translate230')"
        maxHeight="calc(100vh - 330px)"
      >
        <template #statusType="{ row }">
          <el-tag size="medium" :type="row.status == 1 ? 'info' : row.status == 2 ? 'success' : 'danger'">{{
            row.status == 1
              ? t('CUST.translate257')
              : row.status == 2
              ? t('CUST.translate258')
              : row.status == 3
              ? t('CUST.translate259')
              : t('CUST.translate259')
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
import { onMounted, reactive, ref, toRefs } from 'vue'
import Table from '@/components/ProTable/index.vue'
import { teamCommissionStatis } from '@/api/reportForm/reportForm'
import { exportReportTable } from '@/utils/index'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const state = reactive({
  recordList: [
    {
      id: 12,
      account: 'fhjdf',
      level: 2,
      name: 'sdfdf',
      mobile: '21334324324',
      email: '23434354@45',
    },
  ],
  columns: [
    { prop: 'agentId', label: t('CUST.dlID') },
    { prop: 'month', label: t('CUST.translate231'), width: 120 },
    { prop: 'agentAccount', label: t('CUST.translate209'), width: 120 },
    { prop: 'totalProfit', label: t('CUST.translate246'), width: 120, slot: 'totalProfit' },
    { prop: 'bonusAmt', label: t('CUST.translate247'), width: 120 },
    { prop: 'platformAmt', label: t('CUST.translate248'), width: 120 },
    { prop: 'netProfitAmt', label: t('CUST.translate249'), width: 120 },
    { prop: 'newValidPerson', label: t('CUST.translate243'), width: 160 },
    { prop: 'commissionRatio', label: t('CUST.translate55'), width: 120 },
    { prop: 'supportAmt', label: t('CUST.translate41'), width: 120 },
    { prop: 'giftAmt', label: t('CUST.translate43'), width: 120 },
    { prop: 'modifyAmt', label: t('CUST.translate42'), width: 120 },
    { prop: 'totalAmt', label: t('CUST.translate256'), width: 120 },
    { prop: 'statusType', label: t('CUST.translate130'), slot: 'statusType' },
  ],
  total: 30,
  pageSize: 10,
  current: 1,
  formInline: {
    agentAccount: '',
    month: '',
  },
  loading: true,
  downloadLoading: false,
})
const resetSearchForm = () => {
  state.formInline = {
    agentAccount: null,
    month: null,
  }
  state.current = 1
  query()
}
// 查询
const query = () => {
  getRequestData()
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

onMounted(() => {
  getRequestData()
})
const getRequestData = () => {
  state.loading = true
  teamCommissionStatis({
    ...state.formInline,
    pageNum: state.current,
    pageSize: state.pageSize,
  }).then(item => {
    if (item.code === 200) {
      const result = item.rows || []
      result.forEach(item => {
        item.commissionRatio = (item.commissionRatio || 0) + '%'
      })
      state.recordList = item.rows
      state.total = item.total
    }
    state.loading = false
    console.log(item)
  })
}
// 导出
const handleDownload = async () => {
  state.downloadLoading = true
  await exportReportTable(state.formInline, t('CUST.translate255'), 'teamCommissionStatis')
  state.downloadLoading = false
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
//     if (index === 1 || index === 7 || index === 8) {
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
