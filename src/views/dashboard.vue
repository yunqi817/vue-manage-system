<template>
    <div>
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" 
                 :page-change="changePage" :editFunc="handleEdit">
                <template #toolbarBtn>
                    <!-- 添加表头并设置居中样式 -->                 
                    <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
                </template>
            </TableCustom>
        </div>
        <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
            :close-on-click-modal="false" @close="closeDialog">
            <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData" />
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { fetchCarData } from '@/api'; // 引入获取车辆数据的方法
import TableCustom from '@/components/table-custom.vue';
import TableEdit from '@/components/table-edit.vue';
import { FormOption, FormOptionList } from '@/types/form-option';

// 查询相关
const query = reactive({
    trainNumber: '',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '车次：', prop: 'trainNumber' }
]);
const handleSearch = () => {
    changePage(1);
};

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'carId', label: '车次' },
    { prop: 'carNo', label: '车型号' },
    { prop: 'carNum', label: '辆数' },
    { prop: 'arrTime', label: '到达时间' },
    { prop: 'direction', label: '方向' },
    { prop: 'arrTrack', label: '到达股道' },
    { prop: 'opreate', label: '所内工作流程' },
    { prop: 'outTrack', label: '出发股道' },
    { prop: 'backupId', label: '备开车次' },
    { prop: 'line', label: '线别' },
    { prop: 'outTime', label: '出发时间' },
    { prop: 'ornum', label: '序号' },
    { prop: 'remark2', label: '备注' },
    { prop: 'operator', label: '操作', width: 250 },
]);
const page = reactive({
    index: 1,
    size: 10,
    total: 0,
});
const tableData = ref([]);
const getData = async () => {
    try {
        const res = await fetchCarData();
        console.log('获取车辆数据成功:', res.data);
        // 遍历 res.data 中的每一项
        res.data.forEach(item => {
            if (Array.isArray(item.opreate)) {
                // 将 opreate 数组中的每个实例的 opreation 字段拼接成字符串
                item.opreate.forEach(op => {
                    console.log('opration 字段值:', op.opration);
                });
                const operationString = item.opreate.map(op => op.opration).join(' -> ');
                console.log('opreate 字段拼接后的字符串:', operationString);
                item.opreate = operationString;
            } else {
                console.log('opreate 不是数组:', item.opreate);
            }
        });
        console.log('转换后的数据:', res.data);
        tableData.value = res.data;
        page.total = res.data.pageTotal;
    } catch (error) {
        console.error('获取车辆数据失败:', error);
        ElMessage.error('获取车辆数据失败');
    }
};
getData();

const changePage = (val: number) => {
    page.index = val;
    getData();
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
    labelWidth: '100px',
    span: 12,
    list: [
        { type: 'input', label: '车次', prop: 'carId', required: false },
        { type: 'input', label: '车型号', prop: 'carNo', required: false },
        { type: 'input', label: '辆数', prop: 'carNum', required: false },
        { type: 'input', label: '到达时间', prop: 'arrTime', required: false },
        { type: 'input', label: '方向', prop: 'direction', required: false },
        { type: 'input', label: '到达股道', prop: 'arrTrack', required: false },
        { type: 'input', label: '所内工作流程', prop: 'opreate', required: false },
        { type: 'input', label: '出发股道', prop: 'outTrack', required: false },
        { type: 'input', label: '备开车次', prop: 'backupId', required: false },
        { type: 'input', label: '线别', prop: 'line', required: false },
        { type: 'input', label: '出发时间', prop: 'outTime', required: false },
        { type: 'input', label: '序号', prop: 'ornum', required: false },
        { type: 'input', label: '备注', prop: 'remark2', required: false },
    ]
});
const visible = ref(false); 
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row) => {
    console.log('编辑的数据:', row);
    rowData.value = { ...row };
    isEdit.value = true;
    visible.value = true;
};

const updateCarData = async (data) => {
    // 实际中需要根据后端 API 进行修改
    // 示例：return await request({ url: '/api/car/update', method: 'post', data });
    console.log('更新车辆数据:', data);
    return Promise.resolve();
};

const updateData = async () => {
    try {
        await updateCarData(rowData.value);
        ElMessage.success('更新数据成功');
        closeDialog();
        getData();
    } catch (error) {
        ElMessage.error('更新数据失败');
    }
};

const closeDialog = () => {
    visible.value = false;
};
</script>

<style scoped>
/* 可以在这里添加表格样式 */
.container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
}
</style>