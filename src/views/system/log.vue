<template>
    <div>
        <!-- 使用 TableSearch 组件进行搜索 -->
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" 
                :delFunc="handleDelete" :page-change="changePage" :editFunc="handleEdit">
                <template #toolbarBtn>
                    <!-- <el-button type="warning" :icon="CirclePlusFilled" @click="handleAdd">新增</el-button> -->
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
import { fetchLogData, getLogbyid, updateUserData, ADDUserData ,DeleteLogInfo} from '@/api';
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

// 处理搜索的方法
const handleSearch = async () => {
    try {
        let res;
        if (query.opreate_person) {
            res = await getLogbyid(query.opreate_person);
        } else {
            res = await fetchLogData();
        } 
    
        tableData.value = res.data;
        page.total = res.data.length;
    } catch (error) {
        console.error('搜索日志数据时出错:', error);
        ElMessage.error('搜索日志数据时出错');
    }
};

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'opreatePerson', label: '操作人' },
    { prop: 'isOk', label: '确认/取消' },
    { prop: 'opreation', label: '操作'},
    { prop: 'carId', label: '车次' },
    { prop: 'planTime', label: '计划时间' },
    { prop: 'opreateTime', label: '操作时间' },
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
        const res = await fetchLogData();
        tableData.value = res.data;
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
        { type: 'input', label: '员工编号', prop: 'staffId', required:false , disabled: true },
        { type: 'input', label: '员工姓名', prop: 'staffName', required: false },
        { type: 'input', label: '员工性别', prop: 'staffGender', required: false },
        { type: 'input', label: '员工职位', prop: 'staffPosition', required: false },
        { type: 'input', label: '员工部门', prop: 'staffDepartment', required: false },
        { type: 'date-picker', label: '入职日期', prop: 'staffHiredate', required: false },
        { type: 'input', label: '联系方式', prop: 'staffTel', required: false },
        { type: 'input', label: '员工权限', prop: 'staffPermission', required: false },
        { type: 'input', label: '密码', prop: 'staffPwd', required: false },
        { type: 'input', label: '备注', prop: 'remark', required: false },
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
            await updateUserData(rowData.value);
            ElMessage.success('更新用户数据成功');
        } else {
            await ADDUserData(rowData.value);
            ElMessage.success('新增用户数据成功');
        }
        closeDialog();
        getData();
    } catch (error) {
        if (isEdit.value) {
            ElMessage.error('更新用户数据失败');
        } else {
            ElMessage.error('新增用户数据失败');
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
        const person = String(row.id);
        await DeleteLogInfo(person);
        
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