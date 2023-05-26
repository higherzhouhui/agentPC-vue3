<template>
  <div class="user-list-wrap">
    <div style="margin-bottom: 10px" class="top_displ">
      <div class="radio-group">
        <div
          :class="radioGroupData === '1' ? 'radio-group1' : 'radio-group12'"
          style="margin-right: 10px"
          @click="radioGroupData = '1'"
        >
          {{$t('CUST.translate111')}}
        </div>
        <div :class="radioGroupData === '2' ? 'radio-group1' : 'radio-group12'" @click="radioGroupData = '2'">
          {{$t('CUST.translate113')}}
        </div>
      </div>
      <el-button @click="popAddDialog" type="primary" icon="plus" class="buts">{{$t('CUST.translate112')}}</el-button>
    </div>
    <Table
      v-if="radioGroupData === '1'"
      :data="state.recordList"
      :columns="state.columns"
      :total="state.total"
      :pageSize="state.pageSize"
      :current="state.current"
      :pageUpdate="pageUpdate"
      :sizeUpdate="sizeUpdate"
      v-loading="state.loading"
      maxHeight="calc(100vh - 430px)"
    >
      <template #realName="{ row }">
        <div v-clipboard:copy="row.realName"
             v-clipboard:success="clipboardSuccess"
             class="pointerCopy">
            {{row.realName}}
      </div>
      </template>
      <template #bankNo="{ row }">
        <div v-clipboard:copy="row.bankNo"
             v-clipboard:success="clipboardSuccess"
             class="pointerCopy">
            {{row.bankNo}}
      </div>
      </template>
      <!-- <template #bankAddress="{ row }">
        <div v-clipboard:copy="row.bankAddress"
             v-clipboard:success="clipboardSuccess"
             class="pointerCopy">
            {{row.bankAddress}}
      </div>
      </template> -->
      <template #bankName="{ row }">
        <div v-clipboard:copy="row.bankName"
             v-clipboard:success="clipboardSuccess"
             class="pointerCopy">
            {{row.bankName}}
      </div>
      </template>
      <template #bindStatus="{ row }">
        <span :class="row.bindStatus === 0 ? 'danger' : 'success'">
          {{row.bindStatus === 0 ? t('CUST.translate115') : t('CUST.translate116')}}
        </span>
      </template>
      <template #action="{ row }">
        <el-button type="success" size="small" plain icon="Document" @click="showDia(row)"> {{$t('CUST.translate117')}} </el-button>
        <el-button type="primary" size="small" plain icon="Edit" @click="changeStatusAddress(row)"> {{row.bindStatus === 0 ? ThisStatus[1] : ThisStatus[0]}} </el-button>
        <el-button type="danger" size="small" plain icon="Remove" @click="deleteAddress(row)"> {{ t('CUST.delete') }} </el-button>
      </template>
    </Table>

    <Table
      v-if="radioGroupData === '2'"
      :data="state.recordList2"
      :columns="state.columns2"
      :total="state.total2"
      :pageSize="state.pageSize2"
      :current="state.current2"
      :pageUpdate="pageUpdate2"
      :sizeUpdate="sizeUpdate2"
      v-loading="state.loading"
      maxHeight="calc(100vh - 430px)"
    >
      <template #walletAddress="{ row }">
        <div v-clipboard:copy="row.walletAddress"
             v-clipboard:success="clipboardSuccess"
             class="pointerCopy">
            {{row.walletAddress}}
      </div>
      </template>
      <template #bindStatus="{ row }">
        <span :class="row.bindStatus === 0 ? 'danger' : 'success'">
          {{row.bindStatus === 0 ? t('CUST.translate114') : t('CUST.translate116')}}
        </span>
      </template>
      <template #action="{ row }">
        <el-button type="success" size="small" plain icon="Document" @click="showDia(row)"> {{$t('CUST.translate117')}} </el-button>
        <el-button type="primary" size="small" plain icon="Edit" @click="changeStatusAddress(row)"> {{row.bindStatus === 0 ? ThisStatus[1] : ThisStatus[0]}} </el-button>
        <el-button type="danger" size="small" plain icon="Remove" @click="deleteAddress(row)"> {{ t('CUST.delete') }} </el-button>
      </template>
    </Table>
    <!-- 弹窗 -->
    <el-dialog
      :before-close="cancelDia"
      v-model="checkDia"
      :title="state.checkDiaType === '1' ? t('CUST.translate112') : t('CUST.translate117')"
      width="600px"
    >
      <div class="elForm" v-if="radioGroupData === '1'">
        <el-form :model="checkForm" ref="checkFormRef" label-width="160px">
          <el-form-item prop="realName" :label="`${t('CUST.translate118')}：`">
            <el-input v-model="checkForm.realName" :placeholder="t('CUST.translate119')" class="inputs1" clearable @input="allChinese(state.checkForm.realName)"/>
            <div class="el-form-error" v-if="!state.checkForm.realName && state.trySubStatus">{{$t('CUST.translate120')}}</div>
          </el-form-item>
          <el-form-item prop="bankName" :label="`${t('bankName')}：`">
            <el-select v-model="checkForm.bankName" size="large" style="width: 100%" :placeholder="t('bankName_placeHolder')">
              <el-option v-for="(item, index) in state.bankList" :key="index" :label="item.bankName" :value="item.bankName" />
            </el-select>
            <!-- <el-input v-model="checkForm.bankName" :placeholder="t('CUST.translate122')" class="inputs1" clearable /> -->
            <div class="el-form-error" v-if="!state.checkForm.bankName && state.trySubStatus">{{$t('bankName_placeHolder')}}</div>
          </el-form-item>
          <el-form-item prop="bankNo" :label="`${t('CUST.translate124')}：`">
            <el-input v-model="checkForm.bankNo" :placeholder="t('CUST.translate125')" class="inputs1" clearable @input="allNumber(state.checkForm.bankNo)"/>
            <div class="el-form-error" v-if="!state.checkForm.bankNo && state.trySubStatus">{{$t('CUST.translate126')}}</div>
          </el-form-item>
          <!-- <el-form-item prop="bankAddress" :label="`${t('CUST.translate127')}：`">
            <el-input v-model="checkForm.bankAddress" :placeholder="t('CUST.translate128')" class="inputs1" clearable />
            <div class="el-form-error" v-if="!state.checkForm.bankAddress && state.trySubStatus">{{$t('CUST.translate129')}}</div>
          </el-form-item> -->
          <el-form-item prop="bindStatus" :label="`${t('CUST.translate130')}：`">
            <el-radio-group v-model="checkForm.bindStatus" class="ml-4 inputs1">
              <el-radio :label="1" size="small">{{$t('CUST.translate131')}}</el-radio>
              <el-radio :label="0" size="small">{{$t('CUST.translate132')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <!-- 虚拟币 -->
      <div class="elForm" v-if="radioGroupData === '2'">
        <el-form :model="checkForm2" ref="checkFormRef2" label-width="150px">
          <el-form-item prop="walletName" :label="`${t('CUST.translate133')}：`">
            <el-input v-model="checkForm2.walletName" :placeholder="t('CUST.translate134')" class="inputs1" clearable />
            <div class="el-form-error" v-if="!state.checkForm2.walletName && state.trySubStatus">{{$t('CUST.translate135')}}</div>
          </el-form-item>
          <el-form-item prop="walletProtocol" :label="`${t('CUST.translate136')}：`">
            <el-select
              v-model="checkForm2.walletProtocol"
              :placeholder="t('CUST.translate137')"
              style="width: 100%"
              size="large"
              clearable
            >
              <el-option label="USDT-TRC20" value="USDT-TRC20" />
              <el-option label="USDT-ERC20" value="USDT-ERC20" />
              <el-option label="BTC-TRC20" value="BTC-TRC20" />
              <el-option label="BTC-ERC20" value="BTC-ERC20" />
            </el-select>
            <div class="el-form-error" v-if="!state.checkForm2.walletProtocol && state.trySubStatus">{{$t('CUST.translate138')}}</div>
          </el-form-item>
          <el-form-item prop="walletAddress" :label="`${t('CUST.translate139')}：`">
            <el-input v-model="checkForm2.walletAddress" :placeholder="t('CUST.translate140')" class="inputs1" clearable />
            <div class="el-form-error" v-if="!state.checkForm2.walletAddress && state.trySubStatus">{{$t('CUST.translate141')}}</div>
          </el-form-item>
          <el-form-item prop="bindStatus" :label="`${t('CUST.translate130')}：`">
            <el-radio-group v-model="checkForm2.bindStatus" class="ml-4">
              <el-radio :label="1" size="small">{{$t('CUST.translate131')}}</el-radio>
              <el-radio :label="0" size="small">{{$t('CUST.translate132')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="but">
          <el-button @click="cancelDia" class="buts1">{{$t('CUST.translate97')}}</el-button>
          <el-button type="primary" size="medium" @click="addForm" class="buts2" :loading="state.loading">{{$t('CUST.translate98')}}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted, ref, watch } from 'vue';
import { getWalletList, getBankList, addmyBank, addmyWallet, bankmyUpdate, walletmyUpdate } from '@/api/user';
import Table from '@/components/ProTable/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store'
import { getConfigDataInfo } from '@/api/config'

const appstore = useAppStore()
const { t } = useI18n()
const props = defineProps( {
  popUpType: {
    type: String,
    default: '',
  }
})
const state = reactive({
  recordList: [],
  columns: [
    { prop: 'realName', label: t('CUST.translate118'), slot: 'realName' },
    { prop: 'bankName', label: t('bankName'), slot: 'bankName' },
    { prop: 'bankNo', label: t('CUST.translate124'), slot: 'bankNo' },
    // { prop: 'bankAddress', label: t('CUST.translate127'), slot: 'bankAddress' },
    { prop: 'bindStatus', label: t('CUST.translate130'), slot: 'bindStatus' },
    { prop: 'createTime', label: t('CUST.translate142') },
    { label: t('CUST.translate143'), field: 'right', slot: 'action', width: 330 },
  ],
  recordList2: [],
  columns2: [
    { prop: 'walletName', label: t('CUST.translate133') },
    { prop: 'walletAddress', label: t('CUST.translate139'), slot: 'walletAddress' },
    { prop: 'walletProtocol', label: t('CUST.translate136'), slot: 'walletProtocol' },
    { prop: 'bindStatus', label: t('CUST.translate130'), slot: 'bindStatus' },
    { prop: 'createTime', label: t('CUST.translate142') },
    { label: t('CUST.translate143'), field: 'right', slot: 'action', width: 380 },
  ],

  total: 30,
  pageSize: 10,
  current: 1,

  total2: 30,
  pageSize2: 10,
  current2: 1,

  checkDia: false,
  checkFormRef: null,
  checkForm: {},
  checkFormRef2: null,
  checkForm2: {
  },

  checkDiaType: '',

  firstFlag: true,
  canvasImageUrl: '',

  radioGroupData: '1',
  loading: false,
  trySubStatus: false,
  bankList: [],
})
const { checkDia, checkForm, checkFormRef, checkForm2, checkFormRef2, radioGroupData } = toRefs(state)

const tabPosition = ref('1')

const popAddDialog = (type) => {
  state.checkDia = true;
  state.checkForm = {
    realName: '',
    bankName: '',
    bankNo: '',
    bankAddress:'',
    bindStatus: 1,
  };
  state.checkForm2 = {
    walletName: '',
    walletAddress: '',
    walletProtocol: '',
    bindStatus: 1,
  };
  if (type === 'bank') {
    state.radioGroupData = '1';
  }
  if (type === 'usdt') {
    state.radioGroupData = '2';
  }
  state.checkDiaType = '1';
}

const allNumber = (value) => {
  value = value.replace(/[^\d]/g,""); //只能输入数字
  state.checkForm.bankNo = value;
}
const allChinese = (value) => {
  // value = value.replace(/[0-9A-Za-z]/g,""); //只能输入数字
  state.checkForm.realName = value;
}
// 初始化
onMounted(() => {
  if (props.popUpType) {
    popAddDialog(props.popUpType);
  } else {
    getBankListReuquest();
  }
  getConfigDataInfo().then(res => {
    state.bankList = res?.data.currencyRateVO?.configUserBankListVOS || []
  })
})
const ThisStatus = [t('CUST.translate132'), t('CUST.translate131')];
const getBankListReuquest = async() => {
  state.loading = true;
  const res = await getBankList({
    pageNum: state.current,
    pageSize: state.pageSize,
  });
  const result = res?.rows || [];

  state.recordList = result;
  state.total = res?.total || 0;
  state.loading = false;
}

const getWalletListReuquest = async() => {
  state.loading = true;
  const res = await getWalletList({
    pageNum: state.current2,
    pageSize: state.pageSize2,
  });
  const result = res?.rows || [];
  state.recordList2 = result;
  state.total2 = res?.total || 0;
  state.loading = false;
}

watch(() => state.radioGroupData, (newVal, oldVal) => {
  if (newVal === '1') {
    getBankListReuquest();
  } else {
    getWalletListReuquest();
  }
})

watch(() => props.popUpType, (newVal) => {
  if (newVal) {
    popAddDialog(newVal);
  }
})

const clipboardSuccess = () => {
  ElMessage.success(`${t('CUST.translate144')}！`)
}

// 编辑
const showDia = data => {
  console.log(data);
  state.checkForm = data;
  state.checkForm2 = data;
  // console.log('当前数据', data)
  state.checkDia = true;
  state.checkDiaType = '2'
}
// 禁用/启用
const changeStatusAddress = data => {
  ElMessageBox.confirm(`${t('CUST.translate145')}？`)
    .then(async () => {
      state.loading = true;
      confirmTrue();
    })
    .catch(() => {
      // catch error
    })
  const confirmTrue = () => {
    const cstatus = data.bindStatus === 0 ? 1 : 0;
    if (state.radioGroupData === '1') {
      bankmyUpdate({
        ...data,
        bindStatus: cstatus
      }).then(res => {
          if (res?.code === 200) {
            ElMessage.success(ThisStatus[cstatus] + t('CUST.translate146') +'!');
            getBankListReuquest();
          } else {
            state.loading = false
            ElMessage.error(res?.msg);
          }
      })
    } else {
      walletmyUpdate({
        ...data,
        bindStatus: cstatus,
      }).then(res => {
          if (res?.code === 200) {
            ElMessage.success(ThisStatus[cstatus] + t('CUST.translate146') +'!');
            getWalletListReuquest();
          } else {
            state.loading = false
            ElMessage.error(res?.msg);
          }
      })
    }
  }
}

// 删除
const deleteAddress = data => {
  ElMessageBox.confirm(`${t('CUST.translate145')}？`)
    .then(async () => {
      state.loading = true;
      confirmTrue();
    })
    .catch(() => {
      // catch error
    })
  const confirmTrue = () => {
    if (state.radioGroupData === '1') {
      bankmyUpdate({
        ...data,
        delFlag: 1
      }).then(res => {
          if (res?.code === 200) {
            ElMessage.success(t('CUST.delete') + t('CUST.translate146') +'!');
            getBankListReuquest();
          } else {
            ElMessage.error(res?.msg);
          }
      })
    } else {
      walletmyUpdate({
        ...data,
        delFlag: 1
      }).then(res => {
          if (res?.code === 200) {
            ElMessage.success(t('CUST.delete') + t('CUST.translate146') +'!');
            getWalletListReuquest();
          } else {
            ElMessage.error(res?.msg);
          }
      })
    }
  }
}
// 取消
const cancelDia = () => {
  checkDia.value = false
  state.trySubStatus = false;
}
// 确定
const addForm = () => {
  if (state.radioGroupData === '1') {
    if (!state.checkForm.realName || !state.checkForm.bankNo || !state.checkForm.bankName) {
      state.trySubStatus = true;
      return;
    }
    state.loading = true;
    // 编辑
    if (state.checkDiaType === '2') {
      bankmyUpdate(state.checkForm).then(res => {
          state.loading = false;
          if (res?.code === 200) {
            checkDia.value = false;
            ElMessage.success(`${t('CUST.translate147')}!`);
            getBankListReuquest();
          } else {
            ElMessage.error(res?.msg);
          }
        })
    } else {
      addmyBank(state.checkForm).then(res => {
        state.loading = false;
        if (res?.code === 200) {
          checkDia.value = false;
          ElMessage.success(`${t('CUST.translate148')}!`);
          getBankListReuquest();
        } else {
          ElMessage.error(res?.msg);
        }
      })
    }
  }
  if (state.radioGroupData === '2') {
    if (!state.checkForm2.walletAddress || !state.checkForm2.walletName || !state.checkForm2.walletProtocol) {
      state.trySubStatus = true;
      return;
    }
    state.loading = true;
    if (state.checkDiaType === '2') {
      walletmyUpdate(state.checkForm2).then(res => {
          state.loading = false;
          if (res?.code === 200) {
            checkDia.value = false;
            ElMessage.success(`${t('CUST.translate147')}!`);
            getWalletListReuquest();
          } else {
            ElMessage.error(res?.msg);
          }
        })
    } else {
      addmyWallet(state.checkForm2).then((res) => {
        state.loading = false;
        if (res?.code === 200) {
            checkDia.value = false;
            ElMessage.success(`${t('CUST.translate148')}!`);
            getWalletListReuquest();
          } else {
            ElMessage.error(res?.msg);
          }
        })
    }

  }
}

// 翻页
const pageUpdate = data => {
  state.current = data;
  getBankListReuquest();
}
const sizeUpdate = data => {
  state.pageSize = data;
  getBankListReuquest();
}
// 虚拟币翻页
const pageUpdate2 = data => {
  state.current2 = data;
  getWalletListReuquest();
}
const sizeUpdate2 = data => {
  state.pageSize2 = data;
  getWalletListReuquest();
}

</script>

<style lang="scss" scoped>
.user-list-wrap {
  padding: 10px;
}
.top_displ {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.but {
  display: flex;
  justify-content: flex-end;
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
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}

.buts {
  padding: 0 10px;
  height: 32px;
  border-radius: 5px;
  border: none;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #ffffff;
}
.radio-group {
  display: flex;
  align-items: center;
}
.radio-group1 {
  padding: 0 20px;
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
  padding: 0 20px;
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
    color: var(--fontColor);
  }
}
.inputs1 {
  height: 42px;
}
.danger {
  color: red;
}
.success {
  color: green;
}
.pointerCopy {
  cursor: copy;
}
</style>
