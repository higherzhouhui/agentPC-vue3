<template>
  <div class="user-list-wrap">
    <Table
      :data="state.recordList"
      :columns="state.columns"
      :total="state.total"
      :pageSize="state.pageSize"
      :current="state.current"
      :pageUpdate="pageUpdate"
      :sizeUpdate="sizeUpdate"
    >
      <template #action="{ row }">
        <el-button type="success" size="small" plain icon="Document" @click="showDia(row)"> 绑定域名 </el-button>
        <el-button type="danger" size="small" plain icon="Document" @click="deleteAddress(row)"> 禁用 </el-button>
        <el-button type="warning" size="small" plain icon="Document" @click="share(row)"> 分享二维码 </el-button>
        <el-button type="primary" size="small" plain @click="copy(row.id)">复制</el-button>
      </template>
    </Table>
    <!-- 弹窗 -->
    <el-dialog
      v-model="checkDia"
      width="550px"
      :before-close="cancelDia"
      :title="state.checkDiaType === '1' ? '域名绑定' : '分享二维码'"
    >
      <div v-if="state.checkDiaType === '1'">
        <el-scrollbar max-height="300px">
          <el-form
            :model="checkForm"
            ref="checkFormRef"
            label-width="150px"
            label-position="left"
            style="height: 300px"
          >
            <el-form-item prop="account" label="网关IP/cname域名">
              <div class="private">
                <el-input v-model="checkForm.account" placeholder="请输入网关IP/cname域名" clearable class="inputs" />
              </div>
            </el-form-item>
            <el-form-item prop="account2" label="绑定私有域名">
              <div class="private">
                <el-input v-model="checkForm.account2" placeholder="请输入私有域名" clearable class="inputs" />
                <el-button @click="addRules" style="margin-left: 25px; border: none; background: none"
                  ><el-icon> <img src="../../../assets/imgs/sy/jia.png" alt="" class="inputs_img" /> </el-icon
                ></el-button>
              </div>
            </el-form-item>

            <el-form-item prop="account2" label="绑定私有域名" v-for="(item, index) in checkForm.rules" :key="item.id">
              <div class="private">
                <el-input
                  v-model="checkForm.rules[index].rules"
                  placeholder="请输入私有域名"
                  clearable
                  class="inputs"
                />
                <el-button @click="addMinus(item, index)" style="margin-left: 25px; border: none; background: none"
                  ><el-icon> <img src="../../../assets/imgs/sy/jian.png" alt="" class="inputs_img" /> </el-icon
                ></el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      <!-- 分享 -->
      <div v-if="state.checkDiaType === '2'" class="share">
        <div class="share_div">
          <div class="share_div2">
            <qrcode-vue :value="'私有推广链接二维码'" id="captureId" style="width: 120px; height: 120px"></qrcode-vue>
            <div>私有推广链接二维码</div>
          </div>
          <el-button round @click="createPicture('captureId')" class="share_div_but">保存</el-button>
        </div>
        <div class="share_div">
          <div class="share_div2">
            <qrcode-vue :value="'通用推广链接二维码'" id="captureId2" style="width: 120px; height: 120px"></qrcode-vue>
            <div>通用推广链接二维码</div>
          </div>
          <el-button round @click="createPicture('captureId2')" class="share_div_but">保存</el-button>
        </div>
      </div>
      <template #footer v-if="state.checkDiaType === '1'">
        <div class="but">
          <el-button size="medium" @click="cancelDia" class="buts">取消</el-button>
          <el-button type="primary" size="medium" @click="addForm" class="buts2">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import Table from '@/components/ProTable/index.vue'
import QrcodeVue from 'qrcode.vue'
import html2canvas from 'html2canvas'
import { ElMessage } from 'element-plus'
const state = reactive({
  recordList: [
    {
      id: 12,
      account: 'fhjdf',
      level: 2,
      name: 'sdfdf',
      mobile: '21334324324',
      email: '23434354@45',
      nick: 'aaa',
      type: '普通用户',
    },
    {
      id: 121,
      account: 'fhjdf',
      level: 2,
      name: 'sdfdf',
      mobile: '21334324324',
      email: '23434354@45',
      nick: 'aaa',
      type: '普通用户',
    },
  ],
  columns: [
    { prop: 'account', label: '代理账号' },
    { prop: 'level', label: '代理级别' },
    { prop: 'name', label: '上级代理' },
    { prop: 'mobile', label: '通用推广链接', width: 140 },
    { prop: 'email', label: '绑定网关IP/cname域名', width: 200 },
    { prop: 'nick', label: '私有推广链接', width: 180 },
    { prop: 'type', label: '状态' },
    { label: '操作', field: 'right', slot: 'action', width: 400 },
  ],
  total: 30,
  pageSize: 10,
  current: 1,
  checkDia: false,
  checkFormRef: null,
  checkForm: {
    account: '',
    account2: '',
    user: '',
    rules: [],
  },
  checkDiaType: '',

  firstFlag: true,
  canvasImageUrl: '',
})
const { checkDia, checkForm, checkFormRef } = toRefs(state)

// 绑定域名
const showDia = data => {
  console.log('绑定域名', data)
  state.checkDia = true
  state.checkDiaType = '1'
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
// 复制
const copy = e => {
  const textarea = document.createElement('textarea')
  textarea.setAttribute('readonly', 'readonly')
  textarea.value = e
  document.body.appendChild(textarea)
  textarea.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    ElMessage({
      message: '复制成功',
      type: 'success',
    })
  }
  document.body.removeChild(textarea)
}

// 添加私有域名
const addRules = () => {
  state.checkForm.rules = [...state.checkForm.rules, { id: state.checkForm.rules.length + 1, rules: '' }]
}
// 减私有域名
const addMinus = (data, index) => {
  console.log(data, index)
  state.checkForm.rules.forEach(item => {
    if (item.id === data.id) {
      state.checkForm.rules.splice(index, 1)
    }
  })
}
const resetForm = () => {
  checkFormRef.value !== null && checkFormRef.value.resetFields()
}
// 取消
const cancelDia = () => {
  resetForm()
  checkDia.value = false
  state.checkForm.rules = []
}

// 保存
const addForm = () => {
  console.log(checkForm.value)
}
function pageUpdate(val) {}
function sizeUpdate(val) {}

function submitForm() {
  checkFormRef.value.validate(valid => {
    console.log(valid)
  })
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
.private {
  display: flex;
  align-items: center;
  .inputs {
    width: 250px;
    height: 42px;
  }
}
.share {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 254px;
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
.buts {
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
.inputs_img {
  width: 32px;
  height: 32px;
}
</style>
