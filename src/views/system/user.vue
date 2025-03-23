<template>
    <div>
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" 
                :delFunc="handleDelete" :page-change="changePage" :editFunc="handleEdit">
                <template #toolbarBtn>
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

<script setup lang="ts" name="system-user">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { User } from '@/types/user';
import { fetchUserData } from '@/api';
import TableCustom from '@/components/table-custom.vue';
import TableEdit from '@/components/table-edit.vue';
import { FormOption, FormOptionList } from '@/types/form-option';

// 查询相关
const query = reactive({
    Staff_name: '',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '员工姓名：', prop: 'Staff_name' }
]);
const handleSearch = () => {
    changePage(1);
};

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'staffId', label: '员工编号' },
    { prop: 'staffName', label: '员工姓名' },
    { prop: 'staffGender', label: '员工性别' },
    { prop: 'staffPosition', label: '员工职位' },
    { prop: 'staffDepartment', label: '员工部门' },
    { prop: 'staffHiredate', label: '入职日期' },
    { prop: 'staffTel', label: '联系方式' },
    { prop: 'staffPermission', label: '员工权限' },
    { prop: 'staffPwd', label: '密码' },
    { prop: 'remark', label: '备注' },
    { prop: 'operator', label: '操作', width: 250 },
]);
const page = reactive({
    index: 1,
    size: 10,
    total: 0,
});
const tableData = ref<User[]>([]);
const getData = async () => {
    const res = await fetchUserData();
    // console.log(res);
    tableData.value = res.data;
    console.log(res.data);
    page.total = res.data.pageTotal;
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
            { type: 'input', label: '员工编号', prop: 'staffId', required: true },
        { type: 'input', label: '员工姓名', prop: 'staffName', required: true },
        { type: 'input', label: '员工性别', prop: 'staffGender', required: true },
        { type: 'input', label: '员工职位', prop: 'staffPosition', required: true },
        { type: 'input', label: '员工部门', prop: 'staffDepartment', required: true },
        { type: 'date-picker', label: '入职日期', prop: 'staffHireDate', required: true },
        { type: 'input', label: '联系方式', prop: 'staffTel', required: true },
        { type: 'input', label: '员工权限', prop: 'staffPermission', required: true },
        { type: 'input', label: '密码', prop: 'staffPwd', required: true },
        { type: 'input', label: '备注', prop: 'remark', required: false },
    ]
});
const visible = ref(false); 
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: User) => {
    console.log('编辑的数据:', row);
    rowData.value = { ...row };
    isEdit.value = true;
    visible.value = true;
};
const updateData = () => {
    closeDialog();
    getData();
};

const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
};

// 删除相关
const handleDelete = (row: User) => {
    ElMessage.success('删除成功');
};
</script>

<style scoped></style>