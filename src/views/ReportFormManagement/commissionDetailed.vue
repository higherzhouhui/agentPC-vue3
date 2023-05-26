<template>
  <div class="user-list-wrap">
    <div class="titles">{{ $t('CUST.translate268') }}</div>
    <el-form :inline="true" :model="state.formInline" class="demo-form-inline">
      <el-form-item :label="`${t('CUST.translate209')}：`" class="form-items-body">
        <el-input
          clearable
          v-model="state.formInline.agentAccount"
          :placeholder="t('CUST.translate242')"
          class="form-items"
        />
      </el-form-item>

      <el-form-item :label="`${t('CUST.translate269')}：`" class="form-items-body">
        <el-select
          v-model="state.formInline.modifyType"
          class="m-2 form-items"
          clearable
          :placeholder="t('CUST.translate270')"
        >
          <el-option :label="t('CUST.translate271')" :value="1" />
          <el-option :label="t('CUST.translate272')" :value="2" />
          <el-option :label="t('CUST.translate273')" :value="3" />
        </el-select>
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
      >
        <template #reason="{ row }">
          <div>
            {{
              row.modifyType === 1
                ? t('CUST.translate271')
                : row.modifyType === 2
                ? t('CUST.translate272')
                : row.modifyType === 3
                ? t('CUST.translate273')
                : t('CUST.translate273')
            }}
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import Table from '@/components/ProTable/index.vue'
import { commissionModifyRecord } from '@/api/reportForm/reportForm'
import { exportReportTable } from '@/utils/index'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const state = reactive({
  recordList: [],
  columns: [
    { prop: 'agentId', label: t('CUST.dlID'), minWidth: 120 },
    { prop: 'month', label: t('CUST.translate231'), width: 120 },
    { prop: 'agentAccount', label: t('CUST.translate209'), width: 160 },
    { prop: 'modifyAmt', label: t('CUST.translate274'), width: 180 },
    { prop: 'modifyUserNum', label: t('CUST.modifyUserNum'), width: 240 },
    { prop: 'reason', label: t('CUST.translate269'), slot: 'reason', width: 240 },
    { prop: 'modifyMonth', label: t('CUST.translate275'), width: 220 },
    { prop: 'updateTime', label: t('CUST.translate142'), width: 200 },
  ],
  total: 0,
  pageSize: 10,
  current: 1,
  formInline: {},
  downloadLoading: false,
})

onMounted(() => {
  commissionModifyRecordData()
})
const commissionModifyRecordData = () => {
  state.loading = true
  commissionModifyRecord({
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

const resetSearchForm = () => {
  state.formInline = {}
  state.current = 1
  query()
}

// 查询
const query = () => {
  commissionModifyRecordData()
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
// 导出
const handleDownload = async () => {
  state.downloadLoading = true
  await exportReportTable(state.formInline, t('CUST.translate268'), 'commissionModifyRecord')
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
//     if (index === 1 || index === 3 || index === 4) {
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
</style>
