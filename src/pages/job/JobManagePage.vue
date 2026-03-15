<template>
  <div class="job-manager-container">
    <!-- 顶部操作栏 -->
    <a-card :bordered="false" class="mb-4">
      <div class="table-header">
        <div class="header-left">
          <h2 class="page-title">⏱️ Quartz 定时任务管理</h2>
          <a-tag color="blue" class="ml-2">总数：{{ total }}</a-tag>
        </div>
        <div class="header-right">
          <a-space>
            <a-button type="primary" @click="openCreateModal('cron')">
              <template #icon><PlusOutlined /></template>
              新建 Cron 任务
            </a-button>
            <a-button type="default" @click="openCreateModal('simple')">
              <template #icon><ClockCircleOutlined /></template>
              新建间隔任务
            </a-button>
            <a-popconfirm
              title="确定要清除所有任务吗？\n注意：代码自动注册的任务重启后会恢复。"
              ok-text="确认清除"
              cancel-text="取消"
              @confirm="handleClearAll"
            >
              <a-button danger>
                <template #icon><DeleteOutlined /></template>
                清除所有任务
              </a-button>
            </a-popconfirm>
            <a-button @click="fetchJobList">
              <template #icon><ReloadOutlined /></template>
              刷新
            </a-button>
          </a-space>
        </div>
      </div>
    </a-card>

    <!-- 任务列表表格 -->
    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        row-key="jobName"
        :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'jobName'">
            <a-space>
              <span class="font-bold">{{ record.jobName }}</span>
              <a-tag color="grey">{{ record.groupName }}</a-tag>
            </a-space>
          </template>

          <template v-else-if="column.key === 'type'">
            <a-tag :color="record.type === 'CRON' ? 'purple' : 'green'">
              {{ record.type }}
            </a-tag>
            <span v-if="record.expression" class="text-xs text-gray-500 ml-1">
              {{ record.expression }}
            </span>
            <span v-else-if="record.intervalSeconds" class="text-xs text-gray-500 ml-1">
              每 {{ record.intervalSeconds }}s
            </span>
          </template>

          <template v-else-if="column.key === 'triggerState'">
            <a-badge :status="getStateStatus(record.triggerState)" :text="record.triggerState" />
          </template>

          <template v-else-if="column.key === 'nextFireTime'">
            <span :class="{ 'text-red-500': isOverdue(record.nextFireTime) }">
<!--              {{ formatTime(record.nextFireTime) }}-->
              {{ dayjs(record.nextFireTime).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
          </template>

          <template v-else-if="column.key === 'action'">
            <a-space wrap>
              <a-button type="link" size="small" @click="showDetail(record)">详情</a-button>

              <template v-if="record.triggerState === 'NORMAL'">
                <a-button type="link" size="small" danger @click="handlePause(record)">暂停</a-button>
              </template>
              <template v-else-if="record.triggerState === 'PAUSED'">
                <a-button type="link" size="small" @click="handleResume(record)">恢复</a-button>
              </template>

              <a-button type="link" size="small" @click="handleTriggerNow(record)">
                <ThunderboltOutlined /> 执行一次
              </a-button>

              <a-popconfirm
                title="确定删除该任务吗？"
                ok-text="删除"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新建/编辑 模态框 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalType === 'cron' ? '新建 Cron 任务' : '新建间隔任务'"
      @ok="handleSubmit"
      @cancel="modalVisible = false"
      :confirm-loading="submitting"
      width="600px"
    >
      <a-form :model="formState" layout="vertical" :rules="rules" ref="formRef">
        <a-form-item label="Job 类全限定名" name="jobClass">
          <a-input v-model:value="formState.jobClass" placeholder="例如：com.ninja.wangjia_backend.jobs.DailyAfternoonJob" />
          <a-alert type="info" show-icon message="必须是项目中存在的 Class 全名" style="margin-top: 5px;" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="任务名称" name="jobName">
              <a-input v-model:value="formState.jobName" placeholder="唯一标识" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="任务组名" name="groupName">
              <a-input v-model:value="formState.groupName" placeholder="默认 DEFAULT_GROUP" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item v-if="modalType === 'cron'" label="Cron 表达式" name="cronExpression">
          <a-input v-model:value="formState.cronExpression" placeholder="0 30 14 * * ?" />
          <a-alert type="success" show-icon message="示例：每天 14:30 -> 0 30 14 * * ?" style="margin-top: 5px;" />
        </a-form-item>

        <template v-if="modalType === 'simple'">
          <a-form-item label="间隔秒数" name="intervalSeconds">
            <a-input-number v-model:value="formState.intervalSeconds" :min="1" style="width: 100%" placeholder="例如：60 (每 60 秒)" />
          </a-form-item>
          <a-form-item label="重复次数" name="repeatCount">
            <a-input-number v-model:value="formState.repeatCount" :min="-1" style="width: 100%" placeholder="-1 表示永久重复，0 表示只执行一次" />
            <a-alert type="warning" show-icon message="设置为 0 可实现'1 小时后执行一次'的效果" style="margin-top: 5px;" />
          </a-form-item>
        </template>

        <a-form-item label="额外参数 (JSON)" name="paramsJson">
          <a-textarea v-model:value="formState.paramsJson" :rows="3" placeholder='{"key": "value"}' />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 详情模态框 -->
    <a-modal v-model:open="detailVisible" title="任务详情" footer=null width="1400px">
      <a-descriptions bordered :column="1" v-if="currentDetail">
        <a-descriptions-item label="任务名称">{{ currentDetail.jobName }}</a-descriptions-item>
        <a-descriptions-item label="组名">{{ currentDetail.groupName }}</a-descriptions-item>
        <a-descriptions-item label="Job 类">{{ currentDetail.jobClass }}</a-descriptions-item>
        <a-descriptions-item label="持久化">{{ currentDetail.durability ? '是' : '否' }}</a-descriptions-item>
        <a-descriptions-item label="触发器信息">
          <a-table :columns="detailColumns" :data-source="currentDetail.triggers || []" :pagination="false" size="small" />
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import {
  PlusOutlined, ClockCircleOutlined, DeleteOutlined, ReloadOutlined, ThunderboltOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

// 引入你生成的 API 文件 (请根据实际路径调整)
import {
  listJobsUsingGet,
  createCronJobUsingPost,
  createSimpleJobUsingPost,
  pauseJobUsingPost,
  resumeJobUsingPost,
  triggerNowUsingPost,
  deleteJobUsingDelete,
  clearAllJobsUsingPost,
  getJobDetailUsingGet
} from '@/service/api/jobController.ts';

// --- 状态定义 ---
const loading = ref(false);
const total = ref(0);
const dataSource = ref<any[]>([]);
const modalVisible = ref(false);
const detailVisible = ref(false);
const submitting = ref(false);
const modalType = ref<'cron' | 'simple'>('cron');
const formRef = ref<any>(null);
const currentDetail = ref<any>(null);

// 表单数据
const formState = reactive({
  jobClass: '',
  jobName: '',
  groupName: 'DEFAULT_GROUP',
  cronExpression: '',
  intervalSeconds: null as number | null,
  repeatCount: -1,
  paramsJson: '{}'
});

// 表单校验规则
const rules = {
  jobClass: [{ required: true, message: '请输入 Job 类全限定名', trigger: 'blur' }],
  jobName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  cronExpression: [{ required: true, message: '请输入 Cron 表达式', trigger: 'blur' }],
  intervalSeconds: [{ required: true, message: '请输入间隔秒数', trigger: 'change' }],
};

// 表格列定义
const columns = [
  { title: '任务名称', dataIndex: 'jobName', key: 'jobName', width: 200 },
  { title: '类型/表达式', dataIndex: 'type', key: 'type', width: 220 },
  { title: '状态', dataIndex: 'triggerState', key: 'triggerState', width: 120 },
  { title: '下次执行时间', dataIndex: 'nextFireTime', key: 'nextFireTime', width: 180 },
  { title: '操作', key: 'action', fixed: 'right' as const, width: 320 },
];

// 详情表格列
const detailColumns = [
  { title: '触发器名称', dataIndex: 'triggerName', key: 'triggerName' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '状态', dataIndex: 'state', key: 'state' },
  {
    title: 'Cron/间隔',
    key: 'schedule',
    customRender: ({ record }: any) => record.cronExpression || `${record.intervalSeconds}s`
  },
  { title: '上次执行', dataIndex: 'previousFireTime', key: 'previousFireTime' },
  { title: '下次执行', dataIndex: 'nextFireTime', key: 'nextFireTime' },
];

// --- 方法实现 (已修正 res.data 访问) ---

// 获取任务列表
const fetchJobList = async () => {
  loading.value = true;
  try {
    const res = await listJobsUsingGet();
    // ✅ 修正：访问 res.data
    if (res.data?.success) {
      dataSource.value = res.data.data || [];
      total.value = res.data.count || 0;
    } else {
      message.error(res.data?.message || '获取列表失败');
    }
  } catch (error: any) {
    console.error(error);
    message.error(error.message || '网络请求失败');
  } finally {
    loading.value = false;
  }
};

// 打开创建模态框
const openCreateModal = (type: 'cron' | 'simple') => {
  modalType.value = type;
  modalVisible.value = true;
  Object.assign(formState, {
    jobClass: '',
    jobName: '',
    groupName: 'DEFAULT_GROUP',
    cronExpression: type === 'cron' ? '0 0 * * * ?' : '',
    intervalSeconds: type === 'simple' ? 60 : null,
    repeatCount: -1,
    paramsJson: '{}'
  });
  if (formRef.value) formRef.value.clearValidate();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitting.value = true;

    let params = {};
    try {
      params = JSON.parse(formState.paramsJson || '{}');
    } catch (e) {
      message.error('参数必须是合法的 JSON 格式');
      return;
    }

    const payload: any = {
      jobClass: formState.jobClass,
      jobName: formState.jobName,
      groupName: formState.groupName,
      params: params
    };

    let apiCall;
    if (modalType.value === 'cron') {
      payload.cronExpression = formState.cronExpression;
      apiCall = createCronJobUsingPost(payload);
    } else {
      payload.intervalSeconds = formState.intervalSeconds;
      payload.repeatCount = formState.repeatCount;
      apiCall = createSimpleJobUsingPost(payload);
    }

    const res = await apiCall;

    // ✅ 修正：访问 res.data
    if (res.data?.success) {
      message.success(res.data.message);
      modalVisible.value = false;
      fetchJobList();
    } else {
      message.error(res.data?.message || '操作失败');
    }
  } catch (error: any) {
    if (error.message !== 'Validation Failed') {
      message.error(error.message || '提交失败');
    }
  } finally {
    submitting.value = false;
  }
};

// 通用动作执行器 (已修正 res.data 访问)
const executeAction = async (
  apiFunc: Function,
  record: any,
  successMsg: string
) => {
  try {
    const params = {
      jobName: record.jobName,
      groupName: record.groupName || 'DEFAULT_GROUP'
    };

    const res = await apiFunc(params);

    // ✅ 修正：访问 res.data
    if (res.data?.success) {
      message.success(successMsg);
      fetchJobList();
    } else {
      message.error(res.data?.message || '操作失败');
    }
  } catch (error: any) {
    message.error(error.message || '操作失败');
  }
};

const handlePause = (record: any) =>
  executeAction(pauseJobUsingPost, record, '任务已暂停');

const handleResume = (record: any) =>
  executeAction(resumeJobUsingPost, record, '任务已恢复');

const handleTriggerNow = (record: any) =>
  executeAction(triggerNowUsingPost, record, '任务已触发，请查看后台日志');

const handleDelete = (record: any) =>
  executeAction(deleteJobUsingDelete, record, '任务已删除');

// 清除所有 (已修正 res.data 访问)
const handleClearAll = async () => {
  try {
    const res = await clearAllJobsUsingPost();

    // ✅ 修正：访问 res.data
    if (res.data?.success) {
      message.success(`已清除 ${res.data.deletedCount} 个任务`);
      fetchJobList();
    } else {
      message.error(res.data?.message || '清除失败');
    }
  } catch (error: any) {
    message.error(error.message || '清除失败');
  }
};

// 查看详情 (已修正 res.data 访问)
const showDetail = async (record: any) => {
  try {
    const params = {
      jobName: record.jobName,
      groupName: record.groupName || 'DEFAULT_GROUP'
    };
    const res = await getJobDetailUsingGet(params);

    // ✅ 修正：访问 res.data
    if (res.data?.success) {
      currentDetail.value = res.data.data;
      detailVisible.value = true;
    } else {
      message.error(res.data?.message || '获取详情失败');
    }
  } catch (error: any) {
    message.error(error.message || '获取详情失败');
  }
};

// --- 辅助函数 ---
const getStateStatus = (state: string) => {
  const map: Record<string, any> = {
    'NORMAL': 'success',
    'PAUSED': 'warning',
    'BLOCKED': 'error',
    'ERROR': 'error',
    'NONE': 'default'
  };
  return map[state] || 'default';
};

const formatTime = (timeStr: string) => {
  if (!timeStr || timeStr === '无') return '--';
  return dayjs(timeStr).format('YYYY-MM-DD HH:mm:ss');
};

const isOverdue = (timeStr: string) => {
  if (!timeStr || timeStr === '无') return false;
  return dayjs(timeStr).isBefore(dayjs());
};

onMounted(() => {
  fetchJobList();
});
</script>

<style scoped>
.job-manager-container {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: 100vh;
}
.mb-4 { margin-bottom: 16px; }
.ml-2 { margin-left: 8px; }
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.header-left { display: flex; align-items: center; }
.page-title { margin: 0; font-size: 20px; font-weight: 600; color: #1f1f1f; }
.font-bold { font-weight: 600; }
.text-xs { font-size: 12px; }
.text-gray-500 { color: #8c8c8c; }
.text-red-500 { color: #ff4d4f; }
</style>
