<template>
    <div>
        <!-- 使用 TableSearch 组件进行搜索 -->
        <!-- <TableSearch :query="query" :options="searchOpt" :search="handleSearch" /> -->
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" 
                :delFunc="handleDelete" :page-change="changePage" :editFunc="handleEdit">
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="handleAdd">新增</el-button>
                </template>
            </TableCustom>
        </div>
        <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
            :close-on-click-modal="false" @close="closeDialog">
    <TableEdit :form-data="rowData" :options="isEdit ? options : options1" :edit="isEdit" :update="updateData" />
</el-dialog>
    </div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { User } from '@/types/user';
import { fetchjobData, updateJobData, saveJob ,DeleteJobInfo} from '@/api';
import TableCustom from '@/components/table-custom.vue';
import TableEdit from '@/components/table-edit.vue';
import { FormOption, FormOptionList } from '@/types/form-option';
import { DeleteUserInfo } from '@/api';
import { ElMessageBox } from 'element-plus';

// 查询相关
const query = reactive({
    opreate_person: '',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '操作人名称：', prop: 'opreate_person' }
]);




// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'jobDate', label: '工作时间' },
    { prop: 'dayPerson', label: '早班人员' },
    { prop: 'midPerson', label: '中班人员'},
    { prop: 'nightPerson', label: '晚班人员' },
    { prop: "operator", label: "操作", width: 250 },
]);
const page = reactive({
    index: 1,
    size: 10,
    total: 0,
});
const tableData = ref([]);
const getData = async () => {
    try {
        const res = await fetchjobData();
        tableData.value = res.data;
        console.log(res.data)
        page.total = res.data.length;
        // console.log("111111111111222222222",res.data.length)
    } catch (error) {
        ElMessage.error('获取用户数据失败');
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
        { type: 'date-picker', label: '工作时间', prop: 'jobDate', required:false,disabled:true },
        { type: 'input', label: '早班人员', prop: 'dayPerson', required: false },
        { type: 'input', label: '中班人员', prop: 'midPerson', required: false },
        { type: 'input', label: '晚班人员', prop: 'nightPerson', required: false },
    ]
});
let options1 = ref<FormOption>({
    labelWidth: '100px',
    span: 12,
    list: [
        { type: 'date-picker', label: '工作时间', prop: 'jobDate', required:false  },
        { type: 'input', label: '早班人员', prop: 'dayPerson', required: false },
        { type: 'input', label: '中班人员', prop: 'midPerson', required: false },
        { type: 'input', label: '晚班人员', prop: 'nightPerson', required: false },
    ]
});
const visible = ref(false); 
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: User) => {
    rowData.value = { ...row };
    isEdit.value = true;
    visible.value = true;
};

// 新增按钮点击事件处理函数
const handleAdd = () => {
    rowData.value = {}; // 清空 rowData
    isEdit.value = false;
    visible.value = true;
};

const updateData = async () => {
    try {
        if (isEdit.value) {
            await updateJobData(rowData.value);
            ElMessage.success('更新值班数据成功');
        } else {
            await saveJob(rowData.value);
            ElMessage.success('新增值班数据成功');
        }
        closeDialog();
        getData();
    } catch (error) {
        if (isEdit.value) {
            ElMessage.error('更新值班数据成功');
        } else {
            ElMessage.error('新增值班数据成功');
        }
    }
};

const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
};

// 删除相关
const handleDelete = async (row: any) => {
    try {

        // 调用删除 API 
        await DeleteJobInfo(row);
        
        ElMessage.success('日志删除成功');
        
        // 重新获取数据
        await getData();
    } catch (error) {
        if (error !== 'cancel') { // 过滤用户取消操作
            ElMessage.error('日志删除失败');
            console.error('删除失败:', error);
        }
    }
};
</script>

<style scoped></style>