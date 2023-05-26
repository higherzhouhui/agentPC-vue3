<template>
  <div class="user-list-wrap">
    <div class="titles">{{ $t('CUST.translate276') }}</div>
    <div class="radio-group">
      <div
        :class="state.radioGroupData === 1 ? 'radio-group1' : 'radio-group12'"
        style="margin-right: 10px"
        @click="state.radioGroupData = 1"
      >
        {{ $t('CUST.translate111') }}
      </div>
      <div :class="state.radioGroupData === 2 ? 'radio-group1' : 'radio-group12'" @click="state.radioGroupData = 2">
        {{ $t('CUST.translate113') }}
      </div>
    </div>
    <el-form :inline="true" :model="state.formInline" class="demo-form-inline">
      <el-form-item :label="`${t('CUST.translate228')}：`" class="form-items-body">
        <el-date-picker
          v-model="state.formInline.month"
          type="month"
          :placeholder="t('CUST.translate229')"
           
          format="YYYY/MM"
          value-format="YYYY-MM"
          height="calc(100vh - 410px)"
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
        <template #order="{ row }">
          <span>{{row.orderId}}</span>
        </template>
        <template #status="{ row }">
          <el-tag :type="row.status === 0 ? 'danger' : row.status === 2 || row.status === 1 ? 'info' : 'success'">{{
            row.status === 0
              ? t('CUST.translate277')
              : row.status === 2 || row.status === 1
              ? t('CUST.translate278')
              : t('CUST.translate279')
          }}</el-tag>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, onMounted, watch } from 'vue'
import Table from '@/components/ProTable/index.vue'
import { getWithdrawList } from '@/api/reportForm/reportForm'
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
    { prop: 'agentId', label: t('CUST.dlID'), minWidth: 120 },
    { prop: 'orderIdX', label: t('CUST.translate280'), slot: 'order', width: 200 },
    { prop: 'moneyInfo', label: t('CUST.translate281'), width: 260 },
    { prop: 'amount', label: t('CUST.translate282'), width: 240 },
    { prop: 'statusX', label: t('CUST.translate130'), slot: 'status', width: 200 },
    { prop: 'createTime', label: t('CUST.translate283'), width: 220 },
  ],
  total: 30,
  pageSize: 10,
  current: 1,
  formInline: {
    month: '',
  },
  loading: true,
  radioGroupData: 1,
  downloadLoading: false,
})
onMounted(() => {
  getWithdrawListData(state.radioGroupData)
})

watch(
  () => state.radioGroupData,
  newval => {
    getWithdrawListData(newval)
  }
)

const getWithdrawListData = type => {
  state.loading = true
  getWithdrawList({
    ...state.formInline,
    pageNum: state.current,
    pageSize: state.pageSize,
    withdrawType: type * 1,
  }).then(item => {
    if (item.code === 200) {
      const result = item.rows || []
      result.forEach(item => {
        if (type === 1) {
          item.moneyInfo = `${item.bankName}-${item.bankAddress}:${item.cardNo}`
        } else {
          item.moneyInfo = `${item.walletName}-${item.walletProtocol}:${item.walletAddress}`
        }
      })
      state.recordList = item.rows
      state.total = item.total
    }
    state.loading = false
    console.log(item)
  })
}
const resetSearchForm = () => {
  state.formInline = {
    month: '',
  }
  state.current = 1
  state.radioGroupData = 1
  query()
}
// 查询
const query = () => {
  getWithdrawListData(state.radioGroupData)
}
// 导出
const handleDownload = async () => {
  state.downloadLoading = true
  await exportReportTable(state.formInline, t('CUST.translate276'), '', '/withdraw/getWithdrawList/export')
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

.radio-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.radio-group1 {
  padding: 0px 20px;
  height: 32px;
  border-radius: 5px;
  border: 1px solid var(--buttonBackgroundColor);
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: var(--buttonBackgroundColor);
  text-align: center;
  line-height: 32px;
  cursor: pointer;
  &:hover {
    color: var(--fontColor);
  }
}
.radio-group12 {
  padding: 0px 20px;
  height: 32px;
  border-radius: 5px;
  border: 1px solid #f2f2f2;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #333333;
  text-align: center;
  line-height: 32px;
  cursor: pointer;
  &:hover {
    color: #4268a9;
  }
}
</style>
