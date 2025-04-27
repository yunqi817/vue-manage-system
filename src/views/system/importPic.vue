<template>
    <div>
        <!-- 使用 TableSearch 组件进行搜索 -->
        <div class="container">
            <TableCustom 
                :columns="columns" 
                :tableData="paginatedTableData" 
                :total="page.total" 
                :has-pagination="true" 
                :current-page="page.index" 
                :page-size="page.size" 
                :changePage="changePage" 
                :delFunc="handleDelete" 
                :editFunc="handleEdit"
            >
                <template #toolbarBtn>
                    <el-upload action="#"  accept=".png, .jpg" :show-file-list="false"
                   :http-request="handleUploadPic">
           
                        <el-button class="import" type="warning" :icon="CirclePlusFilled">图片导入</el-button>
            
                    </el-upload>                    <!-- <el-button type="warning" :icon="CirclePlusFilled" @click="handleAdd">新增</el-button> -->
                </template>
            </TableCustom>
        </div>
        <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
            :close-on-click-modal="false" @close="closeDialog">
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="system-importPic">
import { ref, reactive,computed } from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { User } from '@/types/user';
import { fetchimportData, recognize, DeletePicExcelInfo ,DeleteLogInfo} from '@/api';
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
    { prop: 'key', label: '导入的图片' },
    { prop: 'value', label: 'excel' },
    { prop: "operator2", label: "操作", width: 450 },
]);
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
const page = reactive({
    index: 1,
    size: 10,
    total: 0,
});
const tableData = ref([]);

const paginatedTableData = computed(() => {
    // console.log("paginatedTableData",tableData.value.length)
    const start = (page.index - 1) * page.size;
    const end = start + page.size;
    return tableData.value.slice(start, end);
});

const getData = async () => {
    try {
        const response = await fetchimportData();
        // 从响应中提取数据
        const resData = response.data; 

        // 假设 resData 是一个对象，将其转换为包含 key 和 value 字段的对象数组
        const newTableData = Object.entries(resData).map(([key, value]) => ({ key, value }));
        tableData.value = newTableData;
        page.total = newTableData.length;
    } catch (error) {
        ElMessage.error('获取用户数据失败'); 
    }
};
getData();

const changePage = (val: number) => {
    console.log("changePage",val)
    page.index = val;
};


const visible = ref(false); 
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: User) => {
    rowData.value = { ...row };
    isEdit.value = true;
    visible.value = true;
};



const handleUploadPic = async (params: { file: File }) => {
    const file = params.file;
    const response = await recognize(file);
    ElMessage.success("导入成功");
    getData();
}

const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
};

// 删除相关
const handleDelete = async (row: any) => {
    try {
       const response = await DeletePicExcelInfo(row.key);
       ElMessage.success('文件删除成功');
       getData();
    } catch (error) {
        if (error !== 'cancel') { 
            ElMessage.error('文件删除失败');
            console.error('删除失败:', error);
        }
    }
};
</script>

<style scoped></style>