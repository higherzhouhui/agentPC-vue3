<template>
  <div class="user-list-wrap">
    <div class="titles">{{ $t('CUST.translate295') }}</div>
    <el-form :inline="true" :model="state.formInline" class="demo-form-inline">
      <el-form-item :label="`${t('CUST.translate209')}：`" class="form-items-body">
        <el-input clearable v-model="state.formInline.agentAccount" :placeholder="t('CUST.translate242')"
          class="form-items" />
      </el-form-item>
      <!-- <el-form-item label="上级账号:" class="form-items-body">
        <el-input clearable v-model="state.formInline.parentAgent" placeholder="请输入上级账号" class="form-items" />
      </el-form-item> -->
      <el-form-item :label="`${t('CUST.translate228')}：`" class="form-items-body">
        <el-date-picker v-model="state.formInline.month" type="month" :placeholder="t('CUST.translate229')"
            format="YYYY/MM" value-format="YYYY-MM" />
      </el-form-item>
      <el-form-item>
        <el-button @click="query" class="but" type="primary" icon="Search">{{ $t('CUST.translate195') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetSearchForm" class="resetButton">{{ $t('CUST.translate196') }}</el-button>
      </el-form-item>
      <el-form-item>
        <!-- 导出 -->
        <el-button class="exportButton" :loading="state.downloadLoading" type="success" icon="Document"
          @click="handleDownload">
          {{ t('exportReport') }}
        </el-button>
      </el-form-item>
    </el-form>
    <div class="warpperTable" v-loading="state.loading">
      <!-- <Table
        :data="state.recordList"
        :columns="state.columns"
        :total="state.total"
        :pageSize="state.pageSize"
        :current="state.current"
        :pageUpdate="pageUpdate"
        :sizeUpdate="sizeUpdate"
      >
      </Table> -->
      <el-table :data="state.recordList">
        <el-table-column prop="agentId" :label="t('CUST.dlID')" width="150" align="center" />
        <el-table-column prop="agentAccount" :label="t('CUST.translate209')" width="150" align="center" />
        <el-table-column prop="month" :label="t('CUST.translate296')" width="150" align="center" />
        <el-table-column prop="demo1" :label="t('CUST.translate297')" min-width="150" align="center">
          <el-table-column :prop="item.prop" :label="item.label" min-width="150" align="center" v-for="(item, index) in state.gamesTypeList.profit" :key="index" />
          <el-table-column prop="totalProfit" :label="t('CUST.translate304')" />
        </el-table-column>
        <el-table-column prop="demo2" :label="t('CUST.translate305')" min-width="150" align="center">
          <el-table-column :prop="item.prop" :label="item.label" min-width="150" align="center" v-for="(item, index) in state.gamesTypeList.ratio" :key="index" />
        </el-table-column>
        <el-table-column prop="demo3" :label="t('CUST.translate38')" min-width="150" align="center">
          <el-table-column :prop="item.prop" :label="item.label" min-width="150" align="center" v-for="(item, index) in state.gamesTypeList.amt" :key="index" />
          <el-table-column prop="totalAmt" :label="t('CUST.translate304')" />
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { gamePlatformStatis } from '@/api/reportForm/reportForm'
import { exportReportTable } from '@/utils/index'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store'
const appStore = useAppStore()
const { t } = useI18n()
const state = reactive({
  recordList: [],
  total: 30,
  pageSize: 10,
  current: 1,
  formInline: {
    agentAccount: null,
    parentAgent: null,
    month: null,
  },
  gamesTypeList: {},
  loading: true,
  downloadLoading: false,
})
const resetSearchForm = () => {
  state.formInline = {
    agentAccount: null,
    parentAgent: null,
    month: null,
  }
  state.current = 1
  query()
}
onMounted(() => {
  gamePlatformStatisData()
})
const gamePlatformStatisData = () => {
  state.loading = true
  gamePlatformStatis({
    ...state.formInline,
    pageNum: state.current,
    pageSize: state.pageSize,
  }).then(res => {
    const data = res.rows || []
    if (res.code === 200) {
      data.forEach(item => {
        let totalProfit = 0
        let totalAmt = 0
        if (item.gamePlatformVOList.length) {
          const profit = []
          const amt = []
          const ratio = []
          // 动态生成游戏,游戏会有增加，不写死
          item.gamePlatformVOList.forEach(cplat => {
            item[cplat.gameTypeName + 'Profit'] = cplat.totalProfit
            item[cplat.gameTypeName + 'Amt'] = cplat.platformAmt
            item[cplat.gameTypeName + 'Ratio'] = cplat.platformRatio + '%'
            totalProfit += cplat.totalProfit * 1
            totalAmt += cplat.platformAmt * 1
            if (!state.gamesTypeList.Profit) {
              profit.push({ label: appStore.lang === 'zh' ? cplat.gameTypeName : (cplat.gameTypeNameVi || cplat.gameTypeNameEn), prop: cplat.gameTypeName + 'Profit' })
              amt.push({ label: appStore.lang === 'zh' ? cplat.gameTypeName : (cplat.gameTypeNameVi || cplat.gameTypeNameEn), prop: cplat.gameTypeName + 'Amt' })
              ratio.push({ label: appStore.lang === 'zh' ? cplat.gameTypeName : (cplat.gameTypeNameVi || cplat.gameTypeNameEn), prop: cplat.gameTypeName + 'Ratio' })
              state.gamesTypeList = {
                profit,
                amt,
                ratio
              }
            }
          })
          item.totalProfit = Math.round(totalProfit * 100) / 100
          item.totalAmt = Math.round(totalAmt * 100) / 100
        }
      })
      state.recordList = data
      state.loading = false
    }
  })
}
// 导出
const handleDownload = async () => {
  state.downloadLoading = true
  await exportReportTable(state.formInline, t('CUST.translate295'), 'gamePlatformStatis')
  state.downloadLoading = false
}
// 查询
const query = () => {
  gamePlatformStatisData()
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

.form-items {
  width: 200px !important;
}

.color1 {
  color: red;
}

.color2 {
  color: #008000;
}
</style>
