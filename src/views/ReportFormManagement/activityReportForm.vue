<template>
  <div class="user-list-wrap">
    <div class="titles">{{ $t('CUST.translate238') }}</div>
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
          <el-button class="but" @click="query" type="primary" icon="Search">{{ $t('CUST.translate195') }}</el-button>
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
        maxHeight="calc(100vh - 330px)"
        show-summary
        :sum-text="t('CUST.translate230')"
      >
      </Table>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, onMounted } from 'vue'
import Table from '@/components/ProTable/index.vue'
import { activityBonusStatis } from '@/api/reportForm/reportForm'
import { exportReportTable } from '@/utils/index'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const state = reactive({
  recordList: [],
  columns: [
    { prop: 'agentId', label: t('CUST.dlID'), minWidth: 120 },
    { prop: 'month', label: t('CUST.translate231'), width: 120 },
    { prop: 'joinPerson', label: t('CUST.translate239'), width: 230 },
    { prop: 'bonusAmt', label: t('CUST.translate240'), width: 320 },
    { prop: 'otherBonusAmt', label: t('CUST.qitahongli'), width: 150 },
    { prop: 'totalBonusAmt', label: t('CUST.huodongpafazonghongli'), width: 280 },
  ],
  downloadLoading: false,
  total: 30,
  pageSize: 10,
  current: 1,
  formInline: {
    month: null,
  },

  // selectTime: [
  //   {
  //     name: '今日',
  //     Check: true,
  //   },
  //   {
  //     name: '昨日',
  //     Check: false,
  //   },
  //   {
  //     name: '本周',
  //     Check: false,
  //   },
  //   {
  //     name: '上周',
  //     Check: false,
  //   },
  //   {
  //     name: '本月',
  //     Check: false,
  //   },
  //   {
  //     name: '上月',
  //     Check: false,
  //   },
  // ],
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
  activityBonusStatisData()
})
const activityBonusStatisData = () => {
  state.loading = true
  activityBonusStatis({
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
// 导出
const handleDownload = async () => {
  state.downloadLoading = true
  await exportReportTable(state.formInline, t('CUST.translate238'), 'activityBonusStatis')
  state.downloadLoading = false
}

// 查询
const query = () => {
  activityBonusStatisData()
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
</style>
