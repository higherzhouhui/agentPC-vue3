<template>
  <div class="wrapper">
    <div class="titles" style="padding: 0 0 16px 0">{{$t('CUST.translate11')}}</div>
    <!-- 展示块信息 -->
    <div class="border">
      <div v-for="data in state.info" :key="data.id" v-loading="state.topAraeLoading">
        <div v-if="data.id === '1'" class="border_div1">
          <div style="height: 55%; width: 100%; border-bottom: 1px solid #e4e4e4">
            <div class="border_div1_font4">
              {{$t('CUST.translate12')}}：{{ data.lastDay }}
            </div>
            <div>
              <div
                style="font-family: PingFangSC-Semibold, PingFang SC; font-weight: 600; color: #333333; font-size: 30px"
              >
                {{ data.remainingDays }}
              </div>
              <div style="display: flex; align-items: center; justify-content: center; margin-top: 10px">
                <img src="../../assets/imgs/sy/time.png" alt="" style="margin-top: 2px" />
                <div class="border_div1_font2">{{$t('CUST.translate13')}}</div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div class="border_div1_font3">
                <div>{{ shiftToReadNumber(data.unTotalAmt) }}</div>
              </div>
              <div class="border_div1_font1" style="margin-bottom: 45px">
                <img :src="data.imgs" alt="" /> {{$t('CUST.translate14')}}
              </div>
            </div>
          </div>
        </div>
        <div v-if="data.id !== '1'" class="border_div2" :class="data.id === '3' && 'border_div3'" style="height: 285px">
          <div style="height: 55%; width: 100%; border-bottom: 1px solid #e4e4e4">
            <div
              v-if="data.id !== '1'"
              class="border_div2_data_font"
              style="margin-top: 15px;
                margin-left: 25;
                margin-bottom: 36px;
                width: calc(100% - 45px);
                padding-left: 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;">
              <div>{{ data.id !== '2' ? '' : data.size5 }}</div>

              <el-popover
                v-if="data.id === '2'"
                placement="bottom"
                :title="$t('CUST.translate15')"
                :width="360"
                trigger="hover"
                content=""
              >
                <template #reference>
                  <el-icon size="20px" style="cursor: help"><QuestionFilled /></el-icon>
                </template>
                <div class="moneyHint">
                  <div class="desc">{{$t('CUST.translate16')}}；</div>
                  <div class="method">{{$t('CUST.translate17')}}；</div>
                  <div class="method">{{$t('CUST.translate18')}}；</div>
                  <div class="method">{{$t('CUST.translate19')}}；</div>
                  <div class="method">{{$t('CUST.translate20')}}；</div>
                </div>
              </el-popover>
            </div>
            <div>
              <div
                style="font-size: 25px;
                  margin-bottom: 10px;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: #333333;">
                {{ shiftToReadNumber(data.predictTotalAmt) }}
              </div>
              <div class="border_div2_data_font3">
                <img src="../../assets/imgs/sy/money.png" alt="" v-if="data.id === '2'" />
                <img src="../../assets/imgs/sy/moneybig.png" alt="" v-if="data.id === '3'" />
                <div style="font-size: 14px; font-family: PingFangSC-Regular, PingFang SC; color: #666666">
                  {{ data.size2 }}
                </div>
              </div>
            </div>
          </div>
          <div class="border_div2_data" style="margin-bottom: 45px">
            <div class="border_div2_data_big">
              <div v-for="(item, index) in data.size3" :key="item.id">
                <div
                  style="font-size: 20px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #333333;"
                >
                  {{ index !== 2 ? shiftToReadNumber(item.money) : item.money }}
                </div>
                <div class="border_div2_data_font4">
                  <img :src="item.img" alt="" width="" />
                  <div :class="item.css">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 表格1 -->
    <div class="tables1">
      <div>
        <div class="title_body titles">
          <div class="title">
            <div>{{$t('CUST.translate21')}}<span class="subTitle">（{{$t('CUST.translate22')}}）</span></div>
          </div>
          <!-- <router-link to="/AgentManagement/subordinate-member" class="more_font">
            更多<el-icon><ArrowRight /></el-icon>
          </router-link> -->
        </div>
        <div class="warpperTable">
          <div class="pages">
            <el-button class="but" @click="pagesLeft1" :disabled="state.pages1 === 1 ? true : false">
              <el-icon>
                <img src="../../assets/imgs/sy/left1.png" alt="" class="imgs2" />
              </el-icon>
            </el-button>
            <el-button class="but" @click="pagesRight1" :disabled="state.pages1 === state.pagesBig1 ? true : false">
              <el-icon>
                <img src="../../assets/imgs/sy/right2.png" alt="" class="imgs2" />
              </el-icon>
            </el-button>
          </div>
          <Table
            :data="state.recordList"
            :columns="state.columns"
            v-loading="state.newLoading.loading1"
            height="200px"
            hidePagination="true"
          >
          </Table>
        </div>
      </div>
      <div>
        <div class="title_body titles">
          <div class="title">
            <div>{{$t('CUST.translate23')}}<span class="subTitle">（{{$t('CUST.translate22')}}）</span></div>
          </div>
        </div>
        <div class="warpperTable">
          <div class="pages">
            <el-button class="but" @click="pagesLeft2" :disabled="state.pages2 === 1 ? true : false">
              <el-icon>
                <img src="../../assets/imgs/sy/left1.png" alt="" class="imgs2" />
              </el-icon>
            </el-button>
            <el-button class="but" @click="pagesRight2" :disabled="state.pages2 === state.pagesBig2 ? true : false">
              <el-icon>
                <img src="../../assets/imgs/sy/right2.png" alt="" class="imgs2" />
              </el-icon>
            </el-button>
          </div>
          <Table
            :data="state.recordList2"
            :columns="state.columns2"
            v-loading="state.newLoading.loading2"
            height="200px"
            hidePagination="true"
          >
          </Table>
        </div>
      </div>
      <div>
        <div class="title_body titles">
          <div class="title">
            <div>{{$t('CUST.translate24')}}<span class="subTitle">（{{$t('CUST.translate22')}}）</span></div>
          </div>
        </div>
        <div class="warpperTable">
          <div class="pages">
            <el-button class="but" @click="pagesLeft3" :disabled="state.pages3 === 1 ? true : false">
              <el-icon>
                <img src="@/assets/imgs/sy/left1.png" alt="" class="imgs2" />
              </el-icon>
            </el-button>
            <el-button class="but" @click="pagesRight3" :disabled="state.pages3 === state.pagesBig3 ? true : false">
              <el-icon>
                <img src="@/assets/imgs/sy/right2.png" alt="" class="imgs2" />
              </el-icon>
            </el-button>
          </div>
          <Table
            :data="state.recordList13"
            :columns="state.columns13"
            v-loading="state.newLoading.loading3"
            height="200px"
            hidePagination="true"
          >
          </Table>
        </div>
      </div>
    </div>
    <!-- 切换表格 -->
    <div>
      <div class="title_body titles">
        <!-- <div class="title" style="margin-right: 25px; position: relative" @click="shiftMonthTab(true)">
          <div :class="state.CheckThisMonth ? 'font_coloe1' : 'font_coloe2'">{{$t('CUST.translate25')}}</div>
          <img
            v-if="state.CheckThisMonth"
            src="../../assets/imgs/sy/titlebg.png"
            alt=""
            style="width: 100%; height: 6px; position: absolute; bottom: -5px; left: 0"
          />
        </div>
        <div class="title" style="margin-right: 25px; position: relative" @click="shiftMonthTab(false)">
          <div :class="!state.CheckThisMonth ? 'font_coloe1' : 'font_coloe2'">{{$t('CUST.translate26')}}</div>
          <img
            v-if="!state.CheckThisMonth"
            src="../../assets/imgs/sy/titlebg.png"
            alt=""
            style="width: 100%; height: 6px; position: absolute; bottom: -5px; left: 0"
          />
        </div> -->
      </div>
      <div class="warpperTable">
        <Table
          class="table_center"
          :data="state.recordList3"
          :columns="state.columns3"
          v-loading="state.makeAreaLoading"
          hidePagination="true"
        >
          <template #totalAmt="{ row }">
            <div class="winColor">
              {{ row.totalAmt }}
            </div>
          </template>
          <template #netProfitAmt="{ row }">
            <div :class="row.netProfitAmt < 0 ? 'loseColor' : 'winColor'">
              {{ shiftToReadNumber(row.netProfitAmt) }}
            </div>
          </template>
          <template #mytype="{ row }">
            <el-button type="primary" link>
              <router-link
                :to="
                  row.mytype === t('CUST.translate58')
                    ? '/ReportFormManagement/drawing-reportForm'
                    : '/ReportFormManagement/drawing-directreportForm'
                "
                class="link_font"
              >
                {{ row.mytype }}
              </router-link>
            </el-button>
          </template>
        </Table>
      </div>
    </div>
    <!-- 团队概览 -->
    <div class="teamContainer">
      <div class="title_body titles">
        <div class="title">
          <div>{{$t('CUST.translate27')}}</div>
        </div>
      </div>
      <div class="bottom_big" v-loading="state.teamAreaLoading">
        <div v-for="(item, index) in state.team" :key="item.id" class="bottom_big_div">
          <div :class="index === 5 || index === 6 ? 'otherColor' : 'noramlColoc'">{{ item.center }}</div>
          <div class="bottom_big_div_font">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, onMounted } from 'vue'
import Table from '@/components/ProTable/index.vue'
import SizeSelect from '../../layout/components/navbar/components/SizeSelect.vue'
import zs from '@/assets/imgs/sy/zs.png'
import dlicon from '@/assets/imgs/sy/dlicon.png'
import tjicon from '@/assets/imgs/sy/tjicon.png'
import qbicon from '@/assets/imgs/sy/qbicon.png'
import { shiftToReadNumber } from '@/utils/index'
import {
  generalInfo,
  getNewAgentList,
  getNewDepositMemberList,
  getNewMemberList,
  getAgentCommissionList,
  getGroupOverviewInfo,
} from '@/api/home'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const state = reactive({
  info: [],
  // 模拟数据
  recordList1s: [],
  recordList: [],
  columns: [
    { prop: 'uid', label: t('ID'), width: 120 },
    { prop: 'memberAccount', label: t('CUST.translate28') },
    { prop: 'date', label: t('CUST.translate30'), width: 160 },
  ],
  tebleData1: [],
  pagesBig1: 1,
  pages1: 1,

  recordList2: [],
  columns2: [
    { prop: 'agentId', label: t('CUST.dlID') },
    { prop: 'agentAccount', label: t('CUST.translate29') },
    { prop: 'createTime', label: t('CUST.translate30'), width: 160 },
  ],
  tebleData2: [],
  pagesBig2: 1,
  pages2: 1,

  recordList13: [],
  columns13: [
    { prop: 'uid', label: t('ID'), width: 120 },
    { prop: 'memberAccount', label: t('CUST.translate31') },
    { prop: 'date', label: t('CUST.translate30'), width: 160 },
  ],
  tebleData13: [],
  pagesBig3: 1,
  pages3: 1,

  recordList3: [],
  columns3: [
    { prop: 'month', label: t('CUST.translate231'), width: 110 },
    { prop: 'newValidPerson', label: t('CUST.translate33'), width: 200 },
    { prop: 'totalBetAmt', label: t('CUST.translate34'), width: 160 },
    { prop: 'totalBetValidAmt', label: t('CUST.translate35'), width: 160 },
    { prop: 'totalProfit', label: t('CUST.translate36'), width: 200 },
    { prop: 'bonusAmt', label: t('CUST.translate37'), width: 140 },
    { prop: 'platformAmt', label: t('CUST.translate38'), width: 110 },
    { prop: 'netProfitAmt', label: t('CUST.translate39'), slot: 'netProfitAmt', width: 130 },
    { prop: 'directMemberAmt', label: t('CUST.zshyyj'), width: 250 },
    { prop: 'directAgentAmt', label: t('CUST.translate54'), width: 130 },
    { prop: 'totalLotteryNum', label: t('CUST.totalLotteryNum'), width: 160 },
    { prop: 'totalLotteryRebate', label: t('CUST.translate1001'), width: 160 },
    { prop: 'supportAmt', label: t('CUST.translate41'), width: 170 },
    { prop: 'modifyAmt', label: t('CUST.translate42'), width: 200 },
    { prop: 'giftAmt', label: t('CUST.translate43'), width: 110 },
    { prop: 'reversalAmt', label: t('CUST.translate290'), width: 235 },
    { prop: 'totalAmt', label: t('CUST.translate44'), slot: 'totalAmt', width: 160 },
  ],
  CheckThisMonth: true, //切换表格

  team: [],
  newLoading: {
    loading1: true,
    loading2: true,
    loading3: true,
  },
  topAraeLoading: true,
  teamAreaLoading: true,
  makeAreaLoading: true,
})

onMounted(() => {
  datas1(0)
  datas2(0)
  datas3(0)
  getBaseInfoData()
  getLastOrThisMonthCommission(state.CheckThisMonth)
  getGroupOverviewInfoInit()
})

const getGroupOverviewInfoInit = () => {
  state.teamAreaLoading = true
  getGroupOverviewInfo().then(res => {
    state.teamAreaLoading = false
    if (res?.code === 200) {
      const { data } = res
      if (!data) {
        return
      }
      state.team = [
        { id: '1', center: data.directAgentNum, name: t('CUST.translate45') },
        { id: '2', center: data.directUserNum, name: t('CUST.translate46') },
        { id: '3', center: data.totalBetPerson, name: t('CUST.translate47') },
        { id: '4', center: data.notBetPerson, name: t('CUST.translate48')},
        { id: '5', center: data.totalValidPerson, name: t('CUST.translate49') },
        { id: '6', center: data.newAgent || 0, name: t('CUST.translate50') },
        { id: '7', center: data.newMember || 0, name: t('CUST.translate51') },
      ]
    }
  })
}

const getBaseInfoData = () => {
  state.topAraeLoading = true
  generalInfo().then(res => {
    state.topAraeLoading = false
    if (res?.code === 200) {
      const { data } = res
      state.info = [
        {
          id: '1',
          lastDay: data.lastDay || 0.0,
          remainingDays: Math.abs(data.remainingDays),
          unTotalAmt: data.unTotalAmt || 0.0,
          size4: 'time.png',
          imgs: qbicon,
        },
        {
          id: '2',
          predictTotalAmt: data.predictTotalAmt || 0.0,
          size2: t('CUST.translate52'),
          size3: [
            {
              id: '1',
              name: t('CUST.translate53'),
              money: data.directlyMemberAmt || 0.0,
              img: zs,
              css: 'zs_color',
            },
            {
              id: '2',
              name: t('CUST.translate54'),
              money: data.directlyAgentAmt || 0.0,
              img: dlicon,
              css: 'dl_color',
            },
            {
              id: '3',
              name: t('CUST.translate55'),
              money: data.currentPredictRatio ? data.currentPredictRatio + '%' : '-',
              img: tjicon,
              css: 'yj_color',
            },
          ],
          size4: t('CUST.translate55'),
          size5: t('CUST.translate56'),
          size6: '../../assets/imgs/sy/money.png',
          size7: 'tj.png',
        },
        {
          id: '3',
          predictTotalAmt: data.lastTotalAmt || 0.0,
          size2: t('CUST.translate57'),
          size3: [
            {
              id: '1',
              name: t('CUST.translate53'),
              money: data.lastMemberAmt || 0.0,
              img: zs,
              css: 'zs_color',
            },
            {
              id: '2',
              name: t('CUST.translate54'),
              money: data.lastAgentAmt || 0.0,
              img: dlicon,
              css: 'dl_color',
            },
            {
              id: '3',
              name: t('CUST.translate55'),
              money: data.lastRatio ? data.lastRatio + '%' : '-',
              img: tjicon,
              css: 'yj_color',
            },
          ],
          size4: t('CUST.translate55'),
        },
      ]
    }
  })
}

// 获取最新存款会员
const datas1 = () => {
  state.newLoading.loading1 = true
  getNewDepositMemberList({
    pageNum: state.pages1,
    pageSize: 4,
  }).then(res => {
    const { total } = res
    state.pagesBig1 = Math.min(Math.ceil(total / 4) || 1, 5)
    state.recordList = res?.rows || []
    state.newLoading.loading1 = false
  })
}
// 最新代理
const datas2 = () => {
  state.newLoading.loading2 = true
  getNewAgentList({
    pageNum: state.pages2,
    pageSize: 4,
  }).then(res => {
    const { total } = res
    state.pagesBig2 = Math.min(Math.ceil(total / 4) || 1, 5)
    state.recordList2 = res?.rows || []
    state.newLoading.loading2 = false
  })
}
// 最新加入会员
const datas3 = () => {
  state.newLoading.loading3 = true
  getNewMemberList({
    pageNum: state.pages3,
    pageSize: 4,
  }).then(res => {
    const { total } = res
    state.pagesBig3 = Math.min(Math.ceil(total / 4) || 1, 5)
    state.recordList13 = res?.rows || []
    state.newLoading.loading3 = false
  })
}
// 移入
const mouseOver = () => {
  console.log(2)
}
// 移出
const mouseLeave = () => {
  console.log(1)
}

// 获取翻页数据
const pageUpdate = val => {
  console.log(val)
}
const sizeUpdate = val => {
  console.log(val)
}
// 翻页
const pagesLeft1 = () => {
  state.pages1--
  datas1(state.pages1)
}
const pagesRight1 = () => {
  state.pages1++
  datas1(state.pages1)
}

const pagesLeft2 = () => {
  state.pages2--
  datas2(state.pages2)
}
const pagesRight2 = () => {
  state.pages2++
  datas2(state.pages2)
}

const pagesLeft3 = () => {
  state.pages3--
  datas3(state.pages3)
}
const pagesRight3 = () => {
  state.pages3++
  datas3(state.pages3)
}

const getLastOrThisMonthCommission = async thisMonth => {
  state.makeAreaLoading = true
  const res = await getAgentCommissionList()
  state.makeAreaLoading = false
  const record = res.data?.records || []
  const whiteList = ['month', 'netProfitAmt', 'newValidPerson']
  record.map(item => {
    Object.keys(item).map(ckey => {
      // 拦截不做处理的key
      if (!whiteList.includes(ckey)) {
        item[ckey] = shiftToReadNumber(item[ckey])
      }
    })
  })
  state.recordList3 = record
}
const shiftMonthTab = type => {
  state.CheckThisMonth = type
  getLastOrThisMonthCommission(type)
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  const change2Column = [10, 11, 12, 13, 14]
  if (change2Column.includes(columnIndex)) {
    if (rowIndex % 2 === 0) {
      return {
        rowspan: 2,
        colspan: 1,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: 1000px;
}
.border {
  display: grid;
  grid-template-columns: 3fr 6fr 5fr;
  grid-gap: 10px;
  text-align: center;
  .border_div1 {
    border-radius: 10px;
    height: 285px;
    background: #fafafa;
    display: flex;
    // align-items: flex-start;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    &:hover {
      background: #fff;
      box-shadow: 0px 10px 24px 0px rgba(0, 0, 0, 0.06);
    }
    img {
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }
    .border_div1_font1 {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: var(--fontColor);

      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    .border_div1_font2 {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      color: #666666;
    }
    .border_div1_font3 {
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      margin-bottom: 10px;
    }
    .border_div1_font4 {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #555;
      margin-top: 15px; 
      margin-bottom: 30px;
    }
  }
  .border_div3 {
    background: #fafafa;
    &:hover {
      background: #fff;
      box-shadow: 0px 10px 24px 0px rgba(0, 0, 0, 0.06);
    }
  }
  .border_div2 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // align-items: center;
    border-radius: 10px;
    height: 174px;
    background: #fafafa;
    position: relative;
    &:hover {
      background: #fff;
      box-shadow: 0px 10px 24px 0px rgba(0, 0, 0, 0.06);
    }
    .border_div2_data_font {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: var(--fontColor);
      // margin-bottom: 20px;
      height: 13px;
      text-align: start;
      width: 100%;
    }
    .border_div2_data {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-content: center;
      justify-content: center;

      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
    .border_div2_data_big {
      width: 100%;
      display: flex;
      align-content: center;
      justify-content: space-around;
    }
    .border_div2_data_font3 {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #666666;

      display: flex;
      align-items: center;
      justify-content: center;

      // margin-top: 15px;
      img {
        width: 14px;
        height: 14px;
        margin-right: 5px;
      }
    }
    .border_div2_data_font4 {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #666666;

      display: flex;
      align-items: center;
      justify-content: center;

      margin-top: 13px;
      img {
        width: 14px;
        height: 14px;
        margin-right: 5px;
      }
    }
    .border_div2_data_bottom {
      width: calc(100% - 20px);
      height: 2px;
      background: var(--fontColor);
      border-radius: 10px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.title_body {
  margin: 10px;
  display: flex;
  align-items: center;

  .more_font {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #cccccc;

    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      color: #9c9797;
    }
  }
  .title {
    display: flex;
    align-items: center;
  }
  .subTitle {
    font-size: 12px; 
    font-weight: 400; 
    opacity: 0.7;
  }
}

.tables1 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 350px;
  @media screen and (max-width: 1500px) {
    grid-template-columns: repeat(2, 1fr);
    height: 700px;
  }
  grid-gap: 20px;
  // align-items: center;
  justify-content: space-between;
}
.table_center {
  text-align: center !important;
}
.titles {
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #333333;
  padding: 16px 0;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 15px;
}
.pages {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
  .but {
    border: none;
    background: none;
    width: 25px;
    height: 25px;
  }
}
.imgs2 {
  width: 25px;
  height: 25px;
}
.zs_color {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #ff5a5a;
}
.dl_color {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #03c034;
}
.yj_color {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #e99431;
}
.font_coloe1 {
  cursor: pointer;
  font-size: 18px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: var(--fontColor) !important;
  &:hover {
    color: #541be5 !important;
  }
}
.font_coloe2 {
  cursor: pointer;
  font-size: 18px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #999999 !important;
  &:hover {
    color: #767171 !important;
  }
}
.link_font {
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: var(--fontColor);
  // text-decoration: underline;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 100%;
    height: 3px;
    background: var(--fontColor);
  }
  &:hover {
    color: #4506e5;
  }
}
.bottom_big {
  display: grid;
  grid-template-columns: repeat(7, auto);
  grid-gap: 20px;
  height: 120px;
  .bottom_big_div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background: #fafafa;
    border-radius: 10px;

    font-size: 25px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    .bottom_big_div_font {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #666666;
      margin-top: 24px;
      text-align: center;
    }
  }
  .otherColor {
    color: rgb(190, 38, 38);
  }
}
.moneyHint {
  .desc {
    font-size: 15px;
    font-weight: 500;
    line-height: 20px;
    color: rgb(148, 74, 74);
  }
  .method {
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    opacity: 0.9;
  }
}
.teamContainer {
  padding-bottom: 20px;
}
</style>
