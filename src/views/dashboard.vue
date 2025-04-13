<template>
    <div>
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
        <div class="container">
            <TableCustom :columns="columns" :delFunc="handleDelete" :tableData="tableData" :total="page.total" :page-change="changePage"
                :editFunc="handleEdit" :opreateFunc="opreateFunc" :opreateFunc1="opreateFunc1">
                <template #toolbarBtn>
                    <!-- 添加表头并设置居中样式 -->
                    <el-upload action="#" :limit="1" accept=".xlsx, .xls" :show-file-list="false"
                   :http-request="handleUpload">
           
            <el-button class="import" type="warning" :icon="CirclePlusFilled">导入</el-button>
            
                    </el-upload>
                </template>
                <template #info>
                    <div style="">
                        <el-date-picker  v-model="selectedDate" type="date" placeholder="选择日期" @change="onDateChange"  value-format="YYYY-MM-DD"></el-date-picker>
                        <!-- 添加表头并设置居中样式 -->
                        <el-row
                            style="padding:5px;border-top: 1px solid rgb(245 247 250);border-left: 1px solid rgb(245 247 250);border-right: 1px solid rgb(245 247 250);border-bottom: 1px solid rgb(245 247 250);">
                            <el-col :span="24" style="font-size: 24px;text-align: center;">
                                动车所转线计划表(变更计划)
                            </el-col>
                        </el-row>
                        <el-row
                            style="padding:5px;border-bottom: 1px solid rgb(245 247 250);border-left: 1px solid rgb(245 247 250);border-right: 1px solid rgb(245 247 250);">
                            <el-col :span="12" style="text-align: left;">
                                <text class="underline">杭州</text>动车所转线作业计划
                            </el-col>
                            <el-col :span="12" style="text-align: right;">
                                编制人:
                                <text class="underline"> {{ tableData1 && tableData1[0] && tableData1[0].compiler ?
                                    tableData1[0].compiler :
                                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                                }}</text>
                                &nbsp;&nbsp;动车所调度:
                                <!-- <text class="underline"></text> -->
                                <text class="underline">{{
                                    tableData1 && tableData1[0] && tableData1[0] ? tableData1[0].carDoperson :
                                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                                }}</text>

                            </el-col>
                        </el-row>
                        <el-row
                            style="padding:5px;border-left: 1px solid rgb(245 247 250);border-right: 1px solid rgb(245 247 250);border-bottom: 1px solid rgb(245 247 250);">
                            <el-col :span="12" style="text-align: left;">
                                中班姓名:
                                <text class="underline">{{ tableData1 && tableData1[0] && tableData1[0].midPerson ?
                                    tableData1[0].midPerson :
                                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                                    }}</text>
                                &nbsp;&nbsp;夜班姓名:
                                <text class="underline">{{ tableData1 && tableData1[0] && tableData1[0].nightPerson ? 
                                tableData1[0].nightPerson :
                                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                                }}</text>
                                &nbsp;&nbsp;日班姓名:
                                <text class="underline">
                                    {{ tableData1 && tableData1[0] && tableData1[0].dayPerson ? tableData1[0].dayPerson
                                        :
                                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                                    }}
                                </text>

                            </el-col>
                            <el-col :span="12" style="text-align: right;">
                                <!-- 2024年7月9日至2024年7月10日 -->
                                <text class="underline">
                                    {{ tableData1 && tableData1[0] && tableData1[0] ? tableData1[0].jobDate  :
                                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                                    }}
                                </text>

                            </el-col>
                        </el-row>
                    </div>
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
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import { fetchCarData, updateCarOpreateData,savelog } from "@/api"; // 引入获取车辆数据和更新车辆信息的方法
import TableCustom from "@/components/table-custom.vue";
import TableEdit from "@/components/table-edit.vue";
import { FormOption, FormOptionList } from "@/types/form-option";
import { DeleteCarInfo, importExcel, getCarInfo,getjobbydate} from "@/api";
import * as XLSX from 'xlsx';
import VueOfficeExcel from 'vue-office';

// 查询相关
const query = reactive({
    trainNumber: "",
});
const searchOpt = ref<FormOptionList[]>([
    { type: "input", label: "车次：", prop: "trainNumber" },
]);
const handleSearch = async () => {
    try {
        let res;
        // console.log("111111",query.trainNumber);
        if (query.trainNumber) {
            res = await getCarInfo(query.trainNumber);
        } else {
            res = await fetchCarData("2025-03-25T16:00:00.000Z");
        } 
        tableData.value = res.data;
        page.total = res.data.length;
    } catch (error) {
        ElMessage.error('信息获取失败');
    }
};

// 新增：存储选择的日期
const selectedDate = ref();
const onDateChange = (date) => {
  // 调用 handleDateChange 函数
  handleDateChange(date);
  // 调用 getjob 函数
  getjobData(date);
};
// 新增：处理日期选择变化的方法
const handleDateChange = async (date) => {
    try {
        // console.log("选择的日期:", date);
        const res = await fetchCarData(date);
        tableData.value = res.data;
        page.total = res.data.length;
    } catch (error) {
        console.error("获取车辆数据失败:", error);
        ElMessage.error("获取车辆数据失败");
    }
};

// 表格相关
let columns = ref([
    { type: "index", label: "序号", width: 55, align: "center" },
    { prop: "carId", label: "车次" },
    { prop: "carNo", label: "车型号" },
    { prop: "carNum", label: "辆数" },
    { prop: "arrTime", label: "到达时间" },
    { prop: "direction", label: "方向" },
    { prop: "arrTrack", label: "到达股道" },
    { prop: "opreate", label: "所内工作流程" ,width: 450},
    { prop: "outTrack", label: "出发股道" },
    { prop: "backupId", label: "备开车次" },
    { prop: "line", label: "线别" },
    { prop: "outTime", label: "出发时间" },
    { prop: "ornum", label: "序号" },
    { prop: "remark2", label: "备注" },
    { prop: "operator", label: "操作", width: 250 },
]);
const page = reactive({
    index: 1,
    size: 10,
    total: 0,
});
const tableData = ref([]);
const tableData1 = ref([]);

const getjobData = async (date) => {
    try {
        if (date === null) {
            date = "2025-03-25";
        }
        console.log("选择的日期:", date);
        const res = await getjobbydate(date); 
         tableData1.value = res.data; 
         console.log("222",res.data)
    } catch (error) {
        console.error("获取数据失败:", error);
        ElMessage.error("获取数据失败"); 
    } 
}
getjobData("2025-03-25"); 

const getData = async () => {
    try {
        const res = await fetchCarData("2025-03-25T16:00:00.000Z");
        tableData.value = res.data;
        page.total = res.data.length;
    } catch (error) {
        console.error("获取车辆数据失败:", error);
        ElMessage.error("获取车辆数据失败");
    }
};
getData();

const changePage = (val: number) => {
    page.index = val;
    getData();
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
    labelWidth: "100px",
    span: 12,
    list: [
        { type: "input", label: "车次", prop: "carId", required: false },
        { type: "input", label: "车型号", prop: "carNo", required: false },
        { type: "input", label: "辆数", prop: "carNum", required: false },
        { type: "date-picker", label: "到达时间", prop: "arrTime", required: false },
        { type: "input", label: "方向", prop: "direction", required: false },
        { type: "input", label: "到达股道", prop: "arrTrack", required: false },
        { type: "input", label: "出发股道", prop: "outTrack", required: false },
        { type: "input", label: "备开车次", prop: "backupId", required: false },
        { type: "input", label: "线别", prop: "line", required: false },
        { type: "date-picker", label: "出发时间", prop: "outTime", required: false },
        { type: "input", label: "序号", prop: "ornum", required: false },
        { type: "input", label: "备注", prop: "remark2", required: false },
    ],
});
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row) => {
    console.log("编辑的数据:", row);
    rowData.value = { ...row };
    isEdit.value = true;
    visible.value = true;
};

//updateCarData && updateData修改车的信息
const updateCarData = async (data) => {
    // console.log("更新车辆信息数据:", data);
    try {
        const response = await updateCarOpreateData(data);
        return response;
    } catch (error) {
        console.error("更新车辆信息数据失败:", error);
        throw error;
    }
};

const updateData = async () => {
    try {
        await updateCarData(rowData.value);
        ElMessage.success("更新数据成功");
        closeDialog();
        getData();
    } catch (error) {
        ElMessage.error("更新数据失败");
    }
};

const operationLog = ref({
  opreation: '',
  planTime: null,
  carId: '',
  opreatePerson: '',
  isOk: '',
  opreateTime: null
});
//opreateFunc确认 && opreateFunc1取消
const opreateFunc = async (data) => {
    try {
        data.opreate.isOk = 1
        if(tableData1.value[0].midPerson === localStorage.getItem('vuems_id')){
                data.opreate.isOk = 2
            }else if(tableData1.value[0].dayPerson === localStorage.getItem('vuems_id')){
                data.opreate.isOk = 1
            }else if(tableData1.value[0].nightPerson === localStorage.getItem('vuems_id')){
                data.opreate.isOk = 3
            }else if(localStorage.getItem('vuems_id') === "admin"){
                data.opreate.isOk = 4
            }else{
                data.opreate.isOk = 5
            }
            if(data.opreate.isOk === 5){
                ElMessage.error('您不是该班次的操作人员，无法确认！');
                operationLog.value.carId = data.row.carId
                    operationLog.value.opreatePerson = localStorage.getItem('vuems_id')
                    operationLog.value.opreation = data.opreate.opration
                    operationLog.value.planTime = data.row.planTime
                    operationLog.value.opreateTime = new Date()
                    operationLog.value.isOk = "非班次人员尝试确认操作"
                    await savelog(operationLog.value)
            }else{
                data.row.opreate = [data.opreate]

                    // console.log("操作记录",)
                    operationLog.value.carId = data.row.carId
                    operationLog.value.opreatePerson = localStorage.getItem('vuems_id')
                    operationLog.value.opreation = data.opreate.opration
                    operationLog.value.planTime = data.row.planTime
                    operationLog.value.opreateTime = new Date()
                    operationLog.value.isOk = "确认操作"
                    await savelog(operationLog.value)
                    // console.log("更新车辆信息数据:", data.row);
                await updateCarOpreateData(data.row);
                    // saveCarOpreate
                ElMessage.success("更新数据成功");
            }
        
        closeDialog();
        getData();
    } catch (error) {
        ElMessage.error("更新数据失败");
    }
};
const opreateFunc1 = async (data) => {
    try {
        if(tableData1.value[0].midPerson === localStorage.getItem('vuems_id') ||
        tableData1.value[0].dayPerson === localStorage.getItem('vuems_id') ||
        tableData1.value[0].nightPerson === localStorage.getItem('vuems_id') ||
            localStorage.getItem('vuems_id') === "admin")
            {
                data.opreate.isOk = 0
                data.row.opreate = [data.opreate]
                // console.log("更新车辆信息数据:", data.row);
                operationLog.value.carId = data.row.carId
                    operationLog.value.opreatePerson = localStorage.getItem('vuems_id')
                    operationLog.value.opreation = data.opreate.opration
                    operationLog.value.planTime = data.row.planTime
                    operationLog.value.opreateTime = new Date()
                    operationLog.value.isOk = "取消操作"
                    await savelog(operationLog.value)
                await updateCarOpreateData(data.row);
        // saveCarOpreate
                ElMessage.success("更新数据成功");
            }else{
                operationLog.value.carId = data.row.carId
                    operationLog.value.opreatePerson = localStorage.getItem('vuems_id')
                    operationLog.value.opreation = data.opreate.opration
                    operationLog.value.planTime = data.row.planTime
                    operationLog.value.opreateTime = new Date()
                    operationLog.value.isOk = "非班次人员尝试取消取消"
                    await savelog(operationLog.value)
                ElMessage.error('您不是该班次的操作人员，无法修改！');
                }
        closeDialog();
        getData();
    } catch (error) {
        ElMessage.error("更新数据失败");
    }
};

const closeDialog = () => {
    visible.value = false;
};


// 删除相关
const handleDelete = async (row) => {
    try {

        // 调用删除 API        
        const Id = String(row.id);
        await DeleteCarInfo(Id);
        ElMessage.success('删除成功');
        
        // 重新获取数据
        await getData();
    } catch (error) {
        if (error !== 'cancel') { // 过滤用户取消操作
            ElMessage.error('删除失败');
            console.error('删除失败:', error);
        }
    }
};


const handleUpload = async (params: { file: File }) => {
    try {
        const response = await importExcel(params.file); 
        ElMessage.success('导入成功');
        // 调用后端接口方法并传递 FormData
        console.log('导入成功', response);
        // 可以在这里添加导入成功后的操作，比如刷新表格数据等
    } catch (error) {
        ElMessage.success('导入成功');
        console.error('导入失败', error);
    }
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

.underline {
    text-decoration: underline;
    width: 150px;
}
.import {
    float: left;
     /* 可根据需要调整日期选择器与导入按钮的间距 */
}
</style>
