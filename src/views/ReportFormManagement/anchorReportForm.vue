<template>
  <div class="user-list-wrap">
    <div class="titles">{{ $t('CUST.translate261') }}</div>
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
        show-summary
        :sum-text="t('CUST.translate230')"
        maxHeight="calc(100vh - 330px)"
      >
        <template #commissionRatio="{ row }">
          {{ row.commissionRatio + '%' }}
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import Table from '@/components/ProTable/index.vue'
import { giftCommissionStatis } from '@/api/reportForm/reportForm'
import { exportReportTable } from '@/utils/index'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const state = reactive({
  recordList: [],
  columns: [
    { prop: 'agentId', label: t('CUST.dlID') },
    { prop: 'month', label: t('CUST.translate231') },
    { prop: 'giftAmt', label: t('CUST.translate262') },
    { prop: 'Ratio', label: t('CUST.translate263'), slot: 'commissionRatio' },
    { prop: 'commissionAmt', label: t('CUST.translate264') },
  ],
  total: 0,
  pageSize: 10,
  current: 1,
  formInline: {
    month: null,
  },
  loading: true,
  downloadLoading: false,
})

const resetSearchForm = () => {
  state.formInline = {
    month: '',
  }
  state.current = 1
  query()
}

onMounted(() => {
  giftCommissionStatisData()
})
const giftCommissionStatisData = () => {
  state.loading = true
  giftCommissionStatis({
    ...state.formInline,
    pageNum: state.current,
    pageSize: state.pageSize,
  }).then(item => {
    if (item.code === 200) {
      state.recordList = item.rows
      state.total = item.total
    }
    state.loading = false
    console.log(item)
  })
}

// 查询
const query = () => {
  giftCommissionStatisData()
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

//底部合计
// const getSummaries = param => {
//   const { columns, data } = param
//   const sums = []
//   columns.forEach((column, index) => {
//     if (index === 0) {
//       sums[index] = '当前页汇总'
//       return
//     }
//     // 不计算项
//     if (index === 2) {
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
  await exportReportTable(state.formInline, t('CUST.translate261'), 'giftCommissionStatis')
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
</style>
