<template>
  <div class="user-list-wrap">
    <div class="titles">{{ $t('CUST.translate236') }}</div>
    <div class="displayf">
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
      <!-- <div class="displayf2">
        <el-button
          v-for="item in state.selectTime"
          :key="item.name"
          :class="item.Check ? 'Check1' : 'Check2'"
          @click="Check(item)"
          >{{ item.name }}</el-button
        >
      </div> -->
    </div>
    <div class="warpperTable" v-loading="state.loading">
      <Table
        :data="state.recordList"
        :columns="state.columns"
        :total="state.total"
        :pageSize="state.pageSize"
        :current="state.current"
        :pageUpdate="pageUpdate"
        :sizeUpdate="sizeUpdate"
        :summary-method="getSummaries"
        show-summary
        :sum-text="t('CUST.translate230')"
        maxHeight="calc(100vh - 330px)"
      >
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
import { agentGameTypeStatis } from '@/api/reportForm/reportForm'
import { exportReportTable } from '@/utils/index'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store'
const appStore = useAppStore()

const { t } = useI18n()
const state = reactive({
  recordList: [],
  columns: [
    { prop: 'agentId', label: t('CUST.dlID'), minWidth: 120 },
    { prop: 'gameTypeName', label: t('CUST.translate237'), width: 180 },
    { prop: 'totalBetAmt', label: t('CUST.translate233'), width: 180 },
    { prop: 'totalBetValidAmt', label: t('CUST.translate234'), width: 220 },
    { prop: 'totalProfit', label: t('CUST.translate235'), slot: 'totalProfit', width: 220 },
  ],
  total: 30,
  pageSize: 10,
  current: 1,
  formInline: {
    month: null,
  },
  downloadLoading: false,
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
})
const { checkDia, checkForm, checkFormRef } = toRefs(state)
const resetSearchForm = () => {
  state.formInline = {
    month: null,
  }
  state.current = 1
  query()
}
onMounted(() => {
  agentGameTypeStatisData()
})
const agentGameTypeStatisData = () => {
  state.loading = true
  agentGameTypeStatis({
    ...state.formInline,
    pageNum: state.current,
    pageSize: state.pageSize,
  }).then(item => {
    const result = item.rows || []
    result.map(item => {
      if (appStore.lang === 'zh') {
        item.gameTypeName = item.typeNameZh
      }
      if (appStore.lang === 'vi') {
        item.gameTypeName = item.typeNameVi
      }
      if (appStore.lang === 'jp') {
        item.gameTypeName = item.typeNameJp
      }
      if (appStore.lang === 'th') {
        item.gameTypeName = item.typeNameTh
      }
    })
    state.recordList = item.rows
    state.total = item.total
    state.loading = false
  })
}
// 导出
const handleDownload = async () => {
  state.downloadLoading = true
  await exportReportTable(state.formInline, t('CUST.translate236'), 'agentGameTypeStatis')
  state.downloadLoading = false
}
// 查询
const query = () => {
  agentGameTypeStatisData()
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
//     if (index === 1) {
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
.color1 {
  color: #008000;
}
.color2 {
  color: red;
}
</style>
