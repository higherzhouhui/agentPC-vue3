<template>
  <div class="user-list-wrap">
    <div class="titles">{{ $t('CUST.translate308') }}</div>
    <el-form :inline="true" :model="state.formInline" class="demo-form-inline">
      <!-- <el-form-item label="登录名:" class="form-items-body">
        <el-input v-model="state.formInline.account" placeholder="请输入登录名" class="form-items" clearable />
      </el-form-item> -->
      <el-form-item :label="`${t('CUST.translate209')}：`" class="form-items-body">
        <el-input
          v-model="state.formInline.agentAccount"
          :placeholder="t('CUST.translate242')"
          class="form-items"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item label="代理级别:" class="form-items-body">
        <el-input v-model="state.formInline.agentLevel" placeholder="请输入代理级别" class="form-items" clearable />
      </el-form-item> -->
      <el-form-item>
        <el-button class="buts" @click="query">{{ $t('CUST.translate195') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetSearchForm" class="resetButton">{{ $t('CUST.translate196') }}</el-button>
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
        <template #agentLevel="{ row }">
          {{ !isNaN(row.agentLevel * 1) ? state.levelList[row.agentLevel].label : row.agentLevel }}
        </template>
        <template #parentAccount="{ row }">
          {{
            row.parentAccount !== null && row.parentAccount !== undefined ? row.parentAccount : t('CUST.translate309')
          }}
        </template>
        <template #copyLink="{ row }">
          <div
            v-clipboard:copy="item.replace('website:', '').replace('download:', '')"
            v-clipboard:success="clipboardSuccess"
            style="cursor: copy; margin-bottom: 5px"
            v-for="(item, index) in (row.otherDomain || '').split('|')"
            :key="index"
          >
            {{ item }}
          </div>
        </template>
        <template #cname="{ row }">
          <div
            v-clipboard:copy="item.replace('website:', '').replace('download:', '')"
            v-clipboard:success="clipboardSuccess"
            style="cursor: copy"
            v-for="(item, index) in (row.otherCname || '').split('|')"
            :key="index"
          >
            {{ item }}
          </div>
        </template>
        <template #privateDomainList="{ row }">
          <div>
            <!-- <div style="color: #ff0000">{{ row.defaultAgentName }}(平台)</div> -->
            <p v-for="(item, index) in row.privateDomainList" 
              :key="index" 
              class="cname"
              v-clipboard:copy="item"
              v-clipboard:success="clipboardSuccess"
              style="cursor: copy; margin-bottom: 5px">
              {{item}}
            </p>
          </div>
        </template>
        <template #action="{ row }">
          <el-button type="success" size="small" plain @click="showDia(row)">
            {{ $t('CUST.translate311') }}
          </el-button>
          <!-- <el-button type="danger" size="small" plain icon="Document" @click="deleteAddress(row)"> 禁用 </el-button> -->
          <!-- <el-button type="warning" size="small" plain icon="Document" @click="share(row)"> 分享二维码 </el-button> -->
        </template>
      </Table>
    </div>
    <el-dialog
      v-model="checkDia"
      :before-close="cancelDia"
      :title="state.checkDiaType === '1' ? t('CUST.translate312') : t('CUST.translate313')"
      :width="appStore.lang === 'zh' ? 600 : 600"
    >
      <div v-if="state.checkDiaType === '1'" v-loading="state.actionLoading">
        <el-scrollbar max-height="400px">
          <el-form
            :model="checkForm"
            ref="checkFormRef"
            :label-width="appStore.lang === 'zh' ? '150px' : '180px'"
            label-position="right"
            style="min-height: 200px"
          >
            <el-form-item prop="cnameId" :label="`${t('CUST.translate314')}：`">
              <el-select 
              v-model="state.cnameId" 
              class="selectStyle" 
              :placeholder="t('CUST.translate420')" 
              size="large"
              @change ="handleChangeSelect">
                <el-option
                  v-for="item in state.canmeOptions"
                  :key="item.cnameId"
                  :value="item.cnameId"
                  :label="item.cname"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="account1"
              :label="`${t('CUST.translate316')}：`"
              v-for="(item, index) in state.privatesObj[state.cnameId]"
              :key="index"
            >
              <div class="private">
                <el-input v-model="item.privateDomain" :placeholder="t('CUST.translate317')" clearable class="inputs" />
                <el-button @click="addRules" style="margin-left: 15px; border: none; background: none"
                  ><el-icon> <img src="../../assets/imgs/sy/jia.png" alt="" class="inputs_img" /> </el-icon
                ></el-button>
                <el-button
                  v-if="state.privatesObj[state.cnameId].length > 1"
                  @click="addMinus(index)"
                  style="margin-left: 10px; border: none; background: none"
                  ><el-icon> <img src="../../assets/imgs/sy/jian.png" alt="" class="inputs_img" /> </el-icon
                ></el-button>
              </div>
            </el-form-item>

            <!-- <el-form-item label="绑定私有域名" v-for="(item, index) in checkForm.rules" :key="item.id">
              <div class="private">
                <el-input
                  v-model="checkForm.rules[index].rules"
                  placeholder="请输入私有域名"
                  clearable
                  class="inputs"
                />
                <el-button @click="addMinus(item, index)" style="margin-left: 25px; border: none; background: none"
                  ><el-icon> <img src="../../assets/imgs/sy/jian.png" alt="" class="inputs_img" /> </el-icon
                ></el-button>
              </div>
            </el-form-item> -->
          </el-form>
        </el-scrollbar>
      </div>
      <!-- 分享 -->
      <div v-if="state.checkDiaType === '2'" class="share">
        <div class="share_div">
          <div class="share_div2">
            <qrcode-vue :value="t('CUST.translate318')" id="captureId" style="width: 120px; height: 120px"></qrcode-vue>
            <div>{{ $t('CUST.translate318') }}</div>
          </div>
          <el-button round @click="createPicture('captureId')" class="share_div_but">{{
            $t('CUST.translate72')
          }}</el-button>
        </div>
        <div class="share_div">
          <div class="share_div2">
            <qrcode-vue
              :value="t('CUST.translate319')"
              id="captureId2"
              style="width: 120px; height: 120px"
            ></qrcode-vue>
            <div>{{ $t('CUST.translate319') }}</div>
          </div>
          <el-button round @click="createPicture('captureId2')" class="share_div_but">{{
            $t('CUST.translate72')
          }}</el-button>
        </div>
      </div>
      <template #footer v-if="state.checkDiaType === '1'">
        <div class="but">
          <el-button size="medium" @click="cancelDia" class="buts1">{{ $t('CUST.translate97') }}</el-button>
          <el-button type="primary" size="medium" @click="addForm" :loading="state.actionLoading" class="buts2">{{
            $t('CUST.translate98')
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import Table from '@/components/ProTable/index.vue'
import QrcodeVue from 'qrcode.vue'
import html2canvas from 'html2canvas'
import { list, bind, getCnameAndIds, getPrivateDomainByCname } from '@/api/extension/extension'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store'
const { t } = useI18n()
const appStore = useAppStore()
const state = reactive({
  recordList: [],
  columns: [
    { prop: 'agentId', label: t('CUST.dlID'), minWidth: 120 },
    { prop: 'agentAccount', label: t('CUST.translate209'), width: 180 },
    { prop: 'agentLevel', label: t('CUST.translate320'), slot: 'agentLevel', width: 180 },
    { prop: 'parentAccount', label: t('CUST.translate203'), slot: 'parentAccount', width: 180 },
    { prop: 'promoteDomain', label: t('CUST.translate321'), slot: 'copyLink', minWidth: 250 },
    { prop: 'defaultCname', label: t('CUST.translate322'), width: 200, slot: 'cname' },
    { prop: 'privateDomainList', label: t('CUST.translate316'), minWidth: 250, slot: 'privateDomainList' },
    { label: t('CUST.translate143'), fixed: 'right', slot: 'action', width: 155 },
  ],
  levelList: [
    { label: t('CUST.translate190'), value: '' },
    { label: t('CUST.translate197'), value: 0 },
    { label: t('CUST.translate323'), value: 1 },
    { label: t('CUST.translate324'), value: 2 },
    { label: t('CUST.translate325'), value: 3 },
    { label: t('CUST.translate326'), value: 4 },
    { label: t('CUST.translate326'), value: 5 },
    { label: t('CUST.translate326'), value: 6 },
    { label: t('CUST.translate326'), value: 7 },
    { label: t('CUST.translate326'), value: 8 },
  ],
  total: 0,
  pageSize: 10,
  current: 1,
  formInline: {},
  checkDia: false,
  checkFormRef: null,
  checkForm: {
    cnameId: '',
    account1: '',
    rules: [],
  },
  checkDiaType: '',
  agentId: '',
  domainId: '',
  cnameId: null,
  promoteDomain: '',
  promoteDomains: '',
  datas1: {},
  privates: [],
  canmeOptions: [],
  loading: true,
  actionLoading: true,
  privatesObj: {},
})
const { checkDia, checkForm, checkFormRef, recordList } = toRefs(state)

onMounted(() => {
  listData()
})
const listData = () => {
  // state.formInline
  state.loading = true
  list(state.formInline).then(item => {
    state.loading = false
    if (item.code === 200) {
      const result = item.rows || []
      let total = item.total
      result.map((ritem) => {
        ritem.privateDomainList = [];
        if (ritem.privateDomains) {
          (ritem.privateDomains || '').split('|').map(pitem => {
            if (pitem && ritem.bindCname) {
              ritem['privateDomainList'].push(`${pitem}(${ritem.bindCname})`)
            }
          })
        }
      })
      // 将相同agentId数据合并
      let newResult = []
      let idsArray = []
      for (let i = 0; i < result.length; i++) {
        const idx = idsArray.indexOf(result[i].agentId)
        if (idx === -1) {
          idsArray.push(result[i].agentId)
          newResult.push(result[i])
        } else {
          newResult[idx].privateDomainList = newResult[idx].privateDomainList.concat(result[i].privateDomainList)
          total = total - 1
        }
      }
      state.recordList = newResult
      state.total = total
    }
  })
}

const handleCopyLink = link => {
  alert(link)
}

const resetSearchForm = () => {
  state.formInline = {
    agentAccount: '',
  }
  query()
}

// 查询
const query = () => {
  listData()
  console.log(state.formInline)
}

// 绑定域名
const showDia = data => {
  state.actionLoading = true
  state.checkDia = true
  state.checkDiaType = '1'
  state.agentId = data.agentId
  state.canmeOptions = []
  state.privatesObj = {}
  getCnameAndIds({ groupId: data.groupId }).then(res => {
    state.actionLoading = false
    if (res.data) {
      state.canmeOptions = res.data || []
      if (state.canmeOptions.length) {
          state.cnameId = state.canmeOptions[0].cnameId
          state.privatesObj[state.cnameId] = [{ cnameId: state.cnameId, privateDomain: '' }]
          state.actionLoading = true
          getPrivateDomainByCname({agentId: data.agentId, cnameId: state.canmeOptions[0].cnameId}).then(cres => {
            state.actionLoading = false
            if (cres?.data.length) {
              state.privatesObj[state.canmeOptions[0].cnameId] = cres?.data
            }
          }).catch(() => {
            state.actionLoading = false
          })
      }
    }
  }).catch(() => {
    state.actionLoading = false
  })
}
// 切换CNAME
const handleChangeSelect = async(cnameId) => {
  let isExistence = false
  Object.keys(state.privatesObj).map(key => {
    if (key == cnameId) {
      isExistence = true
    }
  })
  if (!isExistence) {
    state.actionLoading = true
    state.privatesObj[cnameId] = [{ canme: state.cname, cnameId: cnameId, privateDomain: '' }]
    getPrivateDomainByCname({agentId: state.agentId, cnameId: cnameId}).then(cres => {
      state.actionLoading = false
      if (cres?.length) {
        state.privatesObj[cnameId] = cres?.data
      }
      if (cres?.data && cres?.data.length) {
        state.privatesObj[cnameId] = cres?.data
      }
    })
  }
}
// 禁用
const deleteAddress = data => {
  console.log('禁用', data)
}

// 分享
const share = data => {
  console.log('分享', data)
  state.checkDia = true
  state.checkDiaType = '2'
}
// 保存二维码
const createPicture = ids => {
  html2canvas(document.querySelector(`#${ids}`)).then(res => {
    let imgUrl = res.toDataURL('image/png')
    // console.log('图片临时地址',imgUrl)
    let aLink = document.createElement('a')
    aLink.href = imgUrl
    aLink.download = new Date().toLocaleString() + '.png' //导出文件名，这里以时间命名
    document.body.appendChild(aLink)
    // 模拟a标签点击事件
    aLink.click()
    // 事件已经执行，删除本次操作创建的a标签对象
    document.body.removeChild(aLink)
  })
}

// 添加私有域名
const addRules = () => {
  state.privatesObj[state.cnameId] = [...state.privatesObj[state.cnameId], { cnameId: state.cnameId, privateDomain: '' }]
}
// 减私有域名
const addMinus = cindex => {
  //为防止空全删除了，按照下标删除
  const newContent = state.privatesObj[state.cnameId].filter((_item, index) => {
    return index !== cindex
  })
  state.privatesObj[state.cnameId] = newContent
}

const resetForm = () => {
  console.log(checkFormRef.value)
  checkFormRef.value.resetFields()
}
// 取消
const cancelDia = () => {
  checkFormRef.value !== null && checkFormRef.value.resetFields()
  checkDia.value = false
  state.checkForm.rules = []
}

// 保存
const addForm = async() => {
  let privateDomainArray = []
  state.actionLoading = true
  // Object.keys(state.privatesObj).map(key => {
  //   const list = state.privatesObj[key]
  //   list.map(item => {
  //     const data = {
  //       privateDomain: item.privateDomain,
  //       cnameId: item.cnameId,
  //       agentId: state.agentId,
  //       operator: JSON.parse(sessionStorage.getItem('userInfo')).agentAccount,
  //     }
  //     privateDomainArray.push(data)
  //   })
  // })
  Object.keys(state.privatesObj).map((key) => {
    const list = state.privatesObj[key]
    const havePrivateArray = list.filter(item => {
      return item.privateDomain !== ''
    })
    if (havePrivateArray.length > 0) {
      privateDomainArray = privateDomainArray.concat(havePrivateArray)
    } else {
      privateDomainArray.push(list[0])
    }
  })
  privateDomainArray.map(item => {
    item.operator = JSON.parse(sessionStorage.getItem('userInfo')).agentAccount
    item.agentId = state.agentId
  })
  bind(privateDomainArray).then(item => {
    //切换一次存一次数据，这是最方便且逻辑最清晰的处理方式，只是会多次调用接口，造成服务器压力
    state.actionLoading = false
    if (item.code === 200) {
      cancelDia()
      listData() //刷新
      ElMessage.success(t('CUST.translate146'))
    } else {
      ElMessage.error(item.msg)
    }
  })
}
function pageUpdate(val) {}
function sizeUpdate(val) {}

function submitForm() {
  checkFormRef.value.validate(valid => {
    console.log(valid)
  })
}

const clipboardSuccess = () => {
  ElMessage.success(`${t('CUST.translate144')}！`)
}
</script>

<style lang="scss" scoped>
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.but {
  display: flex;
  justify-content: flex-end;
}
.buts1 {
  width: 103px;
  height: 42px;
  background: #f5f7fe;
  border-radius: 29px;
  border: none;
}
.buts2 {
  width: 103px;
  height: 42px;
  background: var(--buttonBackgroundColor);
  border-radius: 29px;
  border: none;
}
.private {
  display: flex;
  align-items: center;
}
.inputs {
  width: 250px;
  height: 42px;
}
.selectStyle {
  width: 250px;
}
.elForm {
  padding-right: 10px;
  max-height: 200px;
  overflow: hidden;
  margin-bottom: 10px;
}
.elForm:hover {
  padding-right: 10px;
  max-height: 200px;
  overflow-y: scroll;
  margin-bottom: 10px;
}
.elForm::-webkit-scrollbar {
  width: 8px;
  border-radius: 10px;
}
.elForm::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.elForm::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}

.share {
  display: flex;
  align-items: center;
  justify-content: space-around;
  .share_div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 244px;
    width: 206px;

    .share_div2 {
      width: 206px;
      height: 206px;
      border-radius: 10px 10px 0px 0px;
      background: #fafafa;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-around;
      div {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #333333;
      }
    }
    .share_div_but {
      width: 100%;
      height: 38px;
      background: #efe9fb;
      border-radius: 0px 0px 10px 10px;
      border: none;

      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: var(--fontColor);
    }
  }
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
.buts {
  background: var(--buttonBackgroundColor);
  border-radius: 5px;
  border: none;
  width: 90px;
  height: 32px;
  color: #fff;
}
.form-items {
  width: 260px !important;
}
.form-items-body {
  margin-left: 20px;
  margin-right: 20px;
}
.inputs_img {
  width: 36px;
  height: 36px;
}
.cname {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
