<template>
  <div>
    <div class="titles">定时任务</div>
    <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch" class="search-from">
      <el-form-item label="" prop="jobName" class="form-items-body">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入任务名称"
          clearable
          class="form-items"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label=" " prop="jobGroup" class="form-items-body">
        <el-select v-model="queryParams.jobGroup" placeholder="请选择任务组名" clearable class="m-2 form-items">
          <el-option label="默认" value="DEFAULT" />
          <el-option label="系统" value="SYSTEM" />
        </el-select>
      </el-form-item>
      <el-form-item label=" " prop="status" class="form-items-body">
        <el-select v-model="queryParams.status" placeholder="请选择任务状态" clearable class="m-2 form-items">
          <el-option label="正常" value="0" />
          <el-option label="暂停" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button icon="Search" type="primary" @click="handleQuery" class="but">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery" style="width: 90px; height: 32px">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="btns">
      <el-button type="primary" icon="Plus" size="mini" @click="handleAdd">新增</el-button>
      <el-button type="success" icon="Edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      <el-button type="danger" icon="Delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      <el-button type="warning" icon="Download" size="mini" @click="handleExport">导出</el-button>
      <el-button type="info" icon="Operation" size="mini" @click="handleJobLog">日志</el-button>
    </el-row>

    <div class="table-main">
      <div class="warpperTable">
        <Table
          v-loading="loading"
          :data="jobList"
          :columns="state.columns"
          :total="total"
          :pageSize="state.queryParams.pageSize"
          :current="state.queryParams.pageNum"
          :pageUpdate="pageUpdate"
          :sizeUpdate="sizeUpdate"
          @selection-change="handleSelectionChange"
        >
          <!-- 任务组名 -->
          <template #dicts="{ row }">
            <div>{{ row.jobGroup === 'DEFAULT' ? '默认' : row.jobGroup === 'SYSTEM' ? '系统' : '' }}</div>
          </template>
          <!-- 状态 -->
          <template #scopes="{ row }">
            <el-switch
              v-model="row.status"
              active-value="0"
              inactive-value="1"
              class="ml-2"
              @change="handleStatusChange(row)"
            />
          </template>
          <!-- 操作 -->
          <template #scope="{ row }">
            <div style="display: flex; align-items: center; justify-content: space-between">
              <el-button type="primary" size="small" plain icon="Edit" @click="handleUpdate(row)">修改</el-button>
              <el-button type="danger" size="small" plain icon="Delete" @click="handleDelete(row)">删除</el-button>
              <el-dropdown size="small" @command="command => handleCommand(command, row)" class="el-dropdown-link">
                <el-button type="primary" size="small" plain icon="DArrowRight">更多</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="handleRun" icon="CaretRight">执行一次</el-dropdown-item>
                    <el-dropdown-item command="handleView" icon="View">任务详细 </el-dropdown-item>
                    <el-dropdown-item command="handleJobLog" icon="Operation"> 调度日志</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </Table>
      </div>
    </div>

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="form.jobName" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组" prop="jobGroup">
              <el-select v-model="form.jobGroup" placeholder="请选择任务分组">
                <el-option label="默认" value="DEFAULT" />
                <el-option label="系统" value="SYSTEM" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="invokeTarget">
              <template #label>
                <span>
                  调用方法
                  <el-tooltip placement="top">
                    <template #content>
                      <div>
                        Bean调用示例：ryTask.ryParams('ry')
                        <br />Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
                        <br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                      </div>
                    </template>
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </span>
              </template>
              <el-input v-model="form.invokeTarget" placeholder="请输入调用目标字符串" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="cron表达式" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder="请输入cron执行表达式">
                <template #append>
                  <el-button type="primary" @click="handleShowCron">
                    生成表达式
                    <el-icon><Clock /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行策略" prop="misfirePolicy">
              <el-radio-group v-model="form.misfirePolicy" size="small">
                <el-radio-button label="1">立即执行</el-radio-button>
                <el-radio-button label="2">执行一次</el-radio-button>
                <el-radio-button label="3">放弃执行</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发" prop="concurrent">
              <el-radio-group v-model="form.concurrent" size="small">
                <el-radio-button label="0">允许</el-radio-button>
                <el-radio-button label="1">禁止</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <!-- <el-radio v-for="dict in dict.type.sys_job_status" :key="dict.value" :label="dict.value"
                  >{{ dict.label }}
                </el-radio> -->
                <el-radio label="0">正常 </el-radio>
                <el-radio label="1">暂停 </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="Cron表达式生成器" v-model="openCron" append-to-body destroy-on-close class="scrollbar">
      <!-- <crontab @hide="openCron = false" @fill="crontabFill" :expression="expression"></crontab> -->
      <Vue3CronCore
        i18n="cn"
        maxHeight="350px"
        @change="changeCron"
        v-model:value="state.expression"
        style="flex: 0.4"
      />
    </el-dialog>

    <!-- 任务日志详细 -->
    <el-dialog title="任务详细" v-model="openView" width="700px" append-to-body>
      <el-form ref="formRef" :model="form" label-width="120px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务编号：">{{ form.jobId }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{
              form.jobGroup === 'DEFAULT' ? '默认' : form.jobGroup === 'SYSTEM' ? '系统' : ''
            }}</el-form-item>
            <el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cron表达式：">{{ form.cronExpression }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次执行时间：">{{ parseTime(form.nextValidTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用目标方法：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态：">
              <div v-if="form.status == 0">正常</div>
              <div v-else-if="form.status == 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发：">
              <div v-if="form.concurrent == 0">允许</div>
              <div v-else-if="form.concurrent == 1">禁止</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行策略：">
              <div v-if="form.misfirePolicy == 0">默认策略</div>
              <div v-else-if="form.misfirePolicy == 1">立即执行</div>
              <div v-else-if="form.misfirePolicy == 2">执行一次</div>
              <div v-else-if="form.misfirePolicy == 3">放弃执行</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="openView = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Crontab from '@/components/Crontab'
import { ref, onBeforeMount, reactive, computed, onMounted, toRefs } from 'vue'
import { useRequest } from 'ahooks-vue'
import { useRouter } from 'vue-router'
import { listJob, getJob, delJob, addJob, updateJob, runJob, changeJobStatus } from '@/api/monitor/job'
import { useUserStore } from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import Table from '@/components/ProTable/index.vue'
import { dictGroup, dictStatus } from '@/utils/index'
import { selectDictLabel, parseTime } from '@/utils/ruoyi'
import { download } from '@/utils/request'
import Vue3CronCore from '@/components/vue3-cron-core/Index.vue'
const router = useRouter()
// dicts: ['sys_job_group', 'sys_job_status'],
const state = reactive({
  // 遮罩层
  loading: true,
  // 选中数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 显示搜索条件
  showSearch: true,
  // 总条数
  total: 0,
  pageSize: 10,
  current: 1,

  // 定时任务表格数据
  jobList: [],
  // 弹出层标题
  title: '',
  // 是否显示弹出层
  open: false,
  // 是否显示详细弹出层
  openView: false,
  // 是否显示Cron表达式弹出层
  openCron: false,
  // 传入的表达式
  expression: '',
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    jobName: undefined,
    jobGroup: undefined,
    status: undefined,
  },
  // 表单参数
  form: {},
  // 表单校验
  rules: {
    jobName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
    invokeTarget: [
      {
        required: true,
        message: '调用目标字符串不能为空',
        trigger: 'blur',
      },
    ],
    cronExpression: [
      {
        required: true,
        message: 'cron执行表达式不能为空',
        trigger: 'blur',
      },
    ],
  },
  formRef: null,
  queryFormRef: null,

  // table头部
  columns: [
    { type: 'selection' },
    { prop: 'jobId', label: '任务编号' },
    { prop: 'jobName', label: '任务名称' },
    { prop: 'jobGroup', label: '任务组名', slot: 'dicts' },
    { prop: 'invokeTarget', label: '调用目标字符串', width: 200 },
    { prop: 'cronExpression', label: 'cron执行表达式', width: 180 },
    { prop: 'status', label: '状态', slot: 'scopes' },
    { prop: 'type', field: 'right', label: '操作', width: 230, slot: 'scope' },
  ],
})

const {
  loading,
  ids,
  single,
  multiple,
  showSearch,
  total,
  jobList,
  title,
  open,
  openView,
  openCron,
  expression,
  queryParams,
  form,
  rules,
  formRef,
  queryFormRef,
} = toRefs(state)

/** 查询定时任务列表 */
const { run: getList, loading: listLoading } = useRequest(() => listJob(state.queryParams), {
  onSuccess(res) {
    console.log('这是', res)
    if (res.code === 200) {
      state.jobList = res.rows
      state.total = res.total
      console.log('这是多少', total)
    }
    state.loading = false
  },
})

// 任务组名字典翻译
const jobGroupFormat = (row, column) => {
  // return selectDictLabel(this.dict.type.sys_job_group, row.jobGroup)
}
// 取消按钮
const cancel = () => {
  state.open = false
  reset()
}
// 表单重置
const reset = () => {
  state.form = {
    jobId: undefined,
    jobName: undefined,
    jobGroup: undefined,
    invokeTarget: undefined,
    cronExpression: undefined,
    misfirePolicy: 1,
    concurrent: 1,
    status: '0',
  }
  formRef.value !== null && formRef.value.resetFields()
}
/** 搜索按钮操作 */
const handleQuery = () => {
  console.log('搜索', state.queryParams)
  state.queryParams.pageNum = 1
  getList(state.queryParams)
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value !== null && queryFormRef.value.resetFields()
  handleQuery()
}
// 多选框选中数据
const handleSelectionChange = selection => {
  let id = []
  // (id = [...id, item.jobId])
  selection.map(item => (id = [...id, item.jobId]))
  state.ids = id
  // console.log('选中', selection, id)
  state.single = selection.length != 1
  state.multiple = !selection.length
}
// 更多操作触发
const handleCommand = (command, row) => {
  switch (command) {
    case 'handleRun':
      handleRun(row)
      break
    case 'handleView':
      handleView(row)
      break
    case 'handleJobLog':
      handleJobLog(row)
      break
    default:
      break
  }
}

// 任务状态修改 接口
const { run: taskModify } = useRequest(changeJobStatus, {
  manual: true,
  onSuccess(res) {
    console.log('这是', res)
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '成功',
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      })
    }
    getList(state.queryParams)
  },
})
// 任务状态修改
const handleStatusChange = row => {
  let text = row.status === '0' ? '启用' : '停用'
  ElMessageBox.confirm(
    '确认要"' + text + '""' + row.jobName + '"任务吗？',
    // 'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      taskModify(row.jobId, row.status)
      // return
    })
    .catch(() => {
      row.status = row.status === '0' ? '1' : '0'
    })
}

// 立即执行一次接口
// 任务状态修改 接口
const { run: runJobs } = useRequest(runJob, {
  manual: true,
  onSuccess(res) {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '执行成功',
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      })
    }
    getList(state.queryParams)
  },
})
/* 立即执行一次 */
const handleRun = row => {
  ElMessageBox.confirm(
    '确认要立即执行一次"' + row.jobName + '"任务吗？',
    // 'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      runJobs(row.jobId, row.jobGroup)
    })
    .catch(() => {})
}

/** 任务详细信息 */
const handleView = row => {
  getJob(row.jobId).then(res => {
    console.log('这是多少', res)
    if (res.code === 200) {
      state.form = res.data
      state.openView = true

      console.log('这是详细', state.form)
    }
  })
}
/** cron表达式按钮操作 */
const handleShowCron = () => {
  console.log(state.form.cronExpression)
  state.expression = state.form.cronExpression
  state.openCron = true
}
/** 确定后回传值 */
const crontabFill = value => {
  state.form.cronExpression = value
}
const changeCron = val => {
  if (typeof val !== 'string') return false
  state.expression = val
  state.form.cronExpression = val
  state.openCron = false
}
/** 任务日志列表查询 */
const handleJobLog = row => {
  const jobId = row.jobId || 0
  // alert('暂时没有此功能')
  router.push({ name: 'monitorJobLog', query: { jobId: jobId } })
  // this.$router.push({
  //   path: '/monitor/job-log/index',
  //   query: { jobId: jobId },
  // })
}
/** 新增按钮操作 */
const handleAdd = () => {
  reset()
  state.open = true
  state.title = '添加任务'
}

// 修改按钮获取数据
const { run: getJobs } = useRequest(getJob, {
  manual: true,
  onSuccess(res) {
    if (res.code === 200) {
      state.form = res.data
      state.open = true
      state.title = '修改任务'
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      })
    }
  },
})
/** 修改按钮操作 */
const handleUpdate = row => {
  reset()
  const jobId = row.jobId || state.ids
  getJobs(jobId)
}

// 提交按钮接口
const { run: addJobs } = useRequest(addJob, {
  manual: true,
  onSuccess(res) {
    console.log('这是', res)

    if (res.code === 200) {
      state.open = false
      getList(state.queryParams)
      ElMessage({
        type: 'success',
        message: '新增成功',
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      })
    }
  },
})
// 修改
const { run: updateJobs } = useRequest(updateJob, {
  manual: true,
  onSuccess(res) {
    console.log('修改任务', res)
    if (res.code === 200) {
      state.open = false
      getList(state.queryParams)
      ElMessage({
        type: 'success',
        message: '修改成功',
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      })
    }
  },
})
/** 提交按钮 */
const submitForm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      console.log('新增修改数据', valid, state.form)

      if (state.form.jobId !== undefined) {
        updateJobs(state.form)
      } else {
        addJobs(state.form)
      }
    }
  })
}
// 删除按钮接口
const { run: delJobFut } = useRequest(delJob, {
  manual: true,
  onSuccess(res) {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '成功',
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      })
    }
    getList(state.queryParams)
  },
})
/** 删除按钮操作 */
const handleDelete = row => {
  const jobIds = row.jobId || state.ids

  ElMessageBox.confirm(
    '是否确认删除定时任务编号为"' + jobIds + '"的数据项？',
    // 'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delJobFut(jobIds)
    })
    .catch(() => {})
}
/** 导出按钮操作 */
const handleExport = () => {
  download(
    '/api/agent-job/job/export',
    {
      ...state.queryParams,
    },
    `job_${new Date().getTime()}.xlsx`
  )
}

// 翻页
const pageUpdate = a => {
  console.log(a, 'aa1')
  state.queryParams.pageNum = a
  getList(state.queryParams)
}
const sizeUpdate = a => {
  console.log(a, 'aa2')
  state.queryParams.pageSize = a
  getList(state.queryParams)
}
</script>
<style lang="scss" scoped>
.main {
  padding: 12px 17px;
  background: #fff;
  border-radius: 10px;
}
.search-from {
  display: flex;
  .search-btn {
    margin-left: auto;
    .el-form-item__content {
      text-align: right;
    }
  }
  .el-date-editor {
    width: 220px !important;
  }
  .el-form-item {
    margin-bottom: 12px !important;
  }
}
.btns {
  margin-bottom: 12px;
}
/** 表格更多操作下拉样式 */
.el-table .el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin-left: 10px;
}

.but {
  background: var(--buttonBackgroundColor);
  border-radius: 5px;
  border: none;
  width: 90px;
  height: 32px;
  color: #fff;
}
.form-items-body {
  margin-left: 20px;
  margin-right: 20px;
}
.form-items {
  width: 200px !important;
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
