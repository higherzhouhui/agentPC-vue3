<template>
  <div>
    <div class="titles">调度日志</div>
    <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch" class="search-from">
      <el-form-item label="" prop="jobName" class="form-items-body">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter="handleQuery"
          class="form-items"
        />
      </el-form-item>
      <el-form-item label=" " prop="jobGroup" class="form-items-body">
        <el-select v-model="queryParams.jobGroup" placeholder="请选择任务组名" clearable class="form-items">
          <el-option label="默认" value="DEFAULT" />
          <el-option label="系统" value="SYSTEM" />
        </el-select>
      </el-form-item>
      <el-form-item label=" " prop="status" class="form-items-body">
        <el-select v-model="queryParams.status" placeholder="请选择执行状态" clearable class="form-items">
          <el-option label="正常" value="0" />
          <el-option label="失败" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label=" " class="form-items-body">
        <el-date-picker
          v-model="dateRange"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-button icon="Search" type="primary" @click="handleQuery" class="but">搜索</el-button>
      <el-button icon="Refresh" @click="resetQuery" style="width: 90px; height: 32px">重置</el-button>
    </el-form>
    <el-row class="mb16">
      <el-button type="danger" icon="Delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      <el-button type="danger" icon="Delete" size="mini" @click="handleClean">清空</el-button>
      <el-button type="warning" icon="Download" size="mini" @click="handleExport">导出</el-button>
      <el-button type="warning" icon="Close" size="mini" @click="handleClose">关闭</el-button>
    </el-row>
    <div class="table-main" style="margin-top: 10px">
      <div class="warpperTable">
        <Table
          v-loading="loading"
          :data="jobLogList"
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
            <div v-if="row.status === '0'">正常</div>
            <div v-if="row.status === '1'">失败</div>
          </template>
          <!-- 操作 -->
          <template #scope="{ row }">
            <el-button size="mini" type="text" icon="View" @click="handleView(row)">详细</el-button>
          </template>
        </Table>
      </div>

      <!-- <el-table
        v-loading="loading"
        :data="jobLogList"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 313px)"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="日志编号" width="80" align="center" prop="jobLogId" />
        <el-table-column label="任务名称" align="center" prop="jobName" :show-overflow-tooltip="true" />
        <el-table-column label="任务组名" align="center" prop="jobGroup" :show-overflow-tooltip="true">
          <template #scope>
            <dict-tag :options="dict.type.sys_job_group" :value="scope.row.jobGroup" />
          </template>
        </el-table-column>
        <el-table-column label="调用目标字符串" align="center" prop="invokeTarget" :show-overflow-tooltip="true" />
        <el-table-column label="日志信息" align="center" prop="jobMessage" :show-overflow-tooltip="true" />
        <el-table-column label="执行状态" align="center" prop="status">
          <template #scope>
            <dict-tag :options="dict.type.sys_common_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="执行时间" align="center" prop="createTime" width="180">
          <template #scope>
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #scope>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleView(scope.row)"
              v-hasPermi="['monitor:job:query']"
              >详细</el-button
            >
          </template>
        </el-table-column>
      </el-table> -->
    </div>

    <!-- 调度日志详细 -->
    <el-dialog title="调度日志详细" v-model="open" width="700px" append-to-body>
      <el-form ref="formRef" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志序号：">{{ form.jobLogId }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ form.jobGroup }}</el-form-item>
            <el-form-item label="执行时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用方法：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日志信息：">{{ form.jobMessage }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行状态：">
              <div v-if="form.status == 0">正常</div>
              <div v-else-if="form.status == 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status == 1">{{ form.exceptionInfo }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="open = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getJob } from '@/api/monitor/job'
import { listJobLog, delJobLog, cleanJobLog } from '@/api/monitor/jobLog'
import { ref, onBeforeMount, reactive, computed, onMounted, toRefs } from 'vue'
import { useRequest } from 'ahooks-vue'
import { useRoute, useRouter } from 'vue-router'
import { selectDictLabel, parseTime, addDateRange } from '@/utils/ruoyi'
import { download } from '@/utils/request'
import Table from '@/components/ProTable/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()
const route = useRoute()
const state = reactive({
  // 遮罩层
  loading: true,
  // 选中数组
  ids: [],
  // 非多个禁用
  multiple: true,
  // 显示搜索条件
  showSearch: true,
  // 总条数
  total: 0,
  // 调度日志表格数据
  jobLogList: [],
  // 是否显示弹出层
  open: false,
  // 日期范围
  dateRange: [],
  // 表单参数
  form: {},
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    jobName: undefined,
    jobGroup: undefined,
    status: undefined,
  },
  queryFormRef: null,
  formRef: null,
  // table头部
  columns: [
    { type: 'selection' },
    { prop: 'jobLogId', label: '日志编号' },
    { prop: 'jobName', label: '任务名称' },
    { prop: 'jobGroup', label: '任务组名', slot: 'dicts' },
    { prop: 'invokeTarget', label: '调用目标字符串', width: 200 },
    { prop: 'jobMessage', label: '日志信息', width: 180 },
    { prop: 'status', label: '执行状态', slot: 'scopes' },
    { prop: 'createTime', label: '执行时间', width: 180 },
    { prop: 'type', field: 'right', label: '操作', width: 100, slot: 'scope' },
  ],
})
const {
  queryFormRef,
  formRef,
  loading,
  ids,
  multiple,
  showSearch,
  total,
  jobLogList,
  open,
  dateRange,
  form,
  queryParams,
} = toRefs(state)

// created
onMounted(() => {
  const jobId = route.query.jobId
  console.log(jobId)
  if (jobId !== undefined && jobId != 0) {
    getJob(jobId).then(response => {
      state.queryParams.jobName = response.data.jobName
      state.queryParams.jobGroup = response.data.jobGroup
      getList()
    })
  } else {
    getList()
  }
})
/** 查询调度日志列表 */
const getList = () => {
  state.loading = true
  // state.dateRange[0]
  console.log()

  listJobLog({ ...state.queryParams }).then(response => {
    state.jobLogList = response.rows
    state.total = response.total
    state.loading = false
  })
}
// 返回按钮
const handleClose = () => {
  // const obj = { path: '/monitors/monitorJobLog' }
  // this.$tab.closeOpenPage(obj)
  router.push('/monitor/monitorJob')
}
/** 搜索按钮操作 */
const handleQuery = () => {
  state.queryParams.pageNum = 1
  getList()
  console.log('这是多少123', state.queryParams)
}
/** 重置按钮操作 */
const resetQuery = () => {
  state.dateRange = []
  queryFormRef.value !== null && queryFormRef.value.resetFields()
  handleQuery()
}
// 多选框选中数据
const handleSelectionChange = selection => {
  state.ids = selection.map(item => item.jobLogId)
  state.multiple = !selection.length
}
/** 详细按钮操作 */
const handleView = row => {
  state.open = true
  state.form = Object.assign({}, row)
}

// 删除接口
const { run: delJobLogs } = useRequest(delJobLog, {
  manual: true,
  onSuccess(res) {
    console.log('这是', res)
    if (res.code === 200) {
      getList()
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
    getList()
  },
})

/** 删除按钮操作 */
const handleDelete = row => {
  const jobLogIds = state.ids

  ElMessageBox.confirm(
    '是否确认删除调度日志编号为"' + jobLogIds + '"的数据项？',
    // 'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delJobLogs(jobLogIds)
    })
    .catch(() => {})
}

// 清空接口
// 删除接口
const { run: cleanJobLogs } = useRequest(cleanJobLog, {
  manual: true,
  onSuccess(res) {
    if (res.code === 200) {
      getList()
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
    getList()
  },
})
/** 清空按钮操作 */
const handleClean = () => {
  ElMessageBox.confirm(
    '是否确认清空所有调度日志数据项？',
    // 'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      cleanJobLogs()
    })
    .catch(() => {})
}
/** 导出按钮操作 */
const handleExport = () => {
  download(
    '/api/agent-job/job/log/export',
    {
      ...state.queryParams,
    },
    `log_${new Date().getTime()}.xlsx`
  )
}

// 翻页
const pageUpdate = a => {
  console.log(a, 'aa1')
  state.queryParams.pageNum = a
  getList()
}
const sizeUpdate = a => {
  console.log(a, 'aa2')
  state.queryParams.pageSize = a
  getList()
}
</script>
<style lang="scss" scoped>
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
.but {
  background: var(--buttonBackgroundColor);
  border-radius: 5px;
  border: none;
  width: 90px;
  height: 32px;
  color: #fff;
}

.form-items {
  width: 180px !important;
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
