<template>
    <div>
        <div class="table-toolbar" v-if="hasToolbar">
            <div class="table-toolbar-left">
                <slot name="toolbarBtn"></slot>
            </div>
            
            <div class="table-toolbar-right flex-center">
                <template v-if="multipleSelection.length > 0">
                    <el-tooltip effect="dark" content="删除选中" placement="top">
                        <el-icon class="columns-setting-icon" @click="delSelection(multipleSelection)">
                            <Delete />
                        </el-icon>
                    </el-tooltip>
                    <el-divider direction="vertical" />
                </template>
                <el-tooltip effect="dark" content="刷新" placement="top">
                    <el-icon class="columns-setting-icon" @click="refresh">
                        <Refresh />
                    </el-icon>
                </el-tooltip>
                <el-divider direction="vertical" />
                <el-tooltip effect="dark" content="列设置" placement="top">
                    <el-dropdown :hide-on-click="false" size="small" trigger="click">
                        <el-icon class="columns-setting-icon">
                            <Setting />
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="c in columns">
                                    <el-checkbox v-model="c.visible" :label="c.label" />
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-tooltip>
            </div>
        </div>
        <div class="table-toolbar-left">
                <slot name="info"></slot>
            </div>
        <el-table class="mgb20" :style="{ width: '100%' }" border :data="tableData" :row-key="rowKey"
            @selection-change="handleSelectionChange" table-layout="auto" :row-style="getRowStyle">
            <template v-for="item in columns" :key="item.prop">
                <el-table-column v-if="item.visible" :prop="item.prop" :label="item.label" :width="item.width"
                    :type="item.type" :align="item.align || 'center'">

                    <template #default="{ row, column, $index }" v-if="item.type === 'index'">
                        {{ getIndex($index) }}
                    </template>
                    <template #default="{ row, column, $index }" v-if="!item.type">
                        <slot :name="item.prop" :rows="row" :index="$index">
                        
                            <template v-if="item.prop == 'operator'">
                                <el-button type="primary" size="small" :icon="Edit" @click="editFunc(row)">
                                    编辑
                                </el-button>
                                <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row)">
                                    删除
                                </el-button>
                            </template>
                            <template v-if="item.prop === 'operator2'">
                                <el-button type="primary" size="small" :icon="UploadFilled" @click="downloadExcel(row)">
                                    导出excel
                                </el-button>
                                <el-button type="success" size="small" :icon="Share" @click="previewExcel(row)">
                                    excel预览
                                </el-button>
                                <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row)">
                                    删除
                                </el-button>
                            </template>
                            <template v-if="item.prop === 'operator3'">
                                <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row)">
                                    删除
                                </el-button>
                                    </template>
                            <span v-else-if="item.formatter">
                                {{ item.formatter(row[item.prop]) }}
                            </span>
                            <template v-else-if="item.prop == 'opreate'">
                                <template v-for="opreate in row.opreate" :key="opreate.opration">➫
                                    <el-button 
                                    style="margin-left: 5px;margin-right: 5px;" 
                                    :type="opreate.isOk === 0 ? 'danger' 
                                    : opreate.isOk === 1 ? 'success' 
                                    : opreate.isOk === 2 ? 'primary' 
                                    : opreate.isOk === 3 ? 'warning' 
                                    : 'info'" 
                                    size="small"
                                    @click="handleOpreate({row,opreate,})">
                                        {{ opreate.opration }}
                                    </el-button>
                                    
                                </template>
                            </template>
                            <span v-else>
                                {{ row[item.prop] }}
                            </span>
                        </slot>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <el-pagination v-if="hasPagination"  :background="true"
            :layout="layout" :total="total" @current-change="handleCurrentChange" />
            <el-dialog v-model="previewVisible" title="导入预览" width="80%" @close="closePreview">
            <div>
                <el-table :data="previewData" border style="width: 100%">
                    <el-table-column v-for="(column, index) in previewColumns" :key="index" :prop="column.prop" :label="column.label" />
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { toRefs, PropType, ref } from 'vue'
import { Delete, Edit, View, Refresh, Share, UploadFilled } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useRoute } from 'vue-router';

const props = defineProps({
    // 表格相关
    tableData: {
        type: Array,
        default: []
    },
    columns: {
        type: Array as PropType<any[]>,
        default: []
    },
    rowKey: {
        type: String,
        default: 'id'
    },
    hasToolbar: {
        type: Boolean,
        default: true
    },
    //  分页相关
    hasPagination: {
        type: Boolean,
        default: true
    },
    total: {
        type: Number,
        default: 0
    },
    currentPage: {
        type: Number,
        default: 1
    },
    pageSize: {
        type: Number,
        default: 10
    },

    layout: {
        type: String,
        default: 'total, prev, pager, next'
    },
    delFunc: {
        type: Function,
        default: () => { }
    },
    viewFunc: {
        type: Function,
        default: () => { }
    },
    editFunc: {
        type: Function,
        default: () => { }
    },
    delSelection: {
        type: Function,
        default: () => { }
    },
    refresh: {
        type: Function,
        default: () => { }
    },
    changePage: {
        type: Function,
        default: () => { }
    },
    opreateFunc: {
        type: Function,
        default: () => { }
    }, 
    opreateFunc1: {
        type: Function,
        default: () => { }
    },
})

let {
    tableData,
    columns,
    rowKey,
    hasToolbar,
    hasPagination,
    total,
    currentPage,
    pageSize,
    layout,
} = toRefs(props)

columns.value.forEach((item) => {
    if (item.visible === undefined) {
        item.visible = true
    }
})

// 当选择项发生变化时会触发该事件
const multipleSelection = ref([])
const handleSelectionChange = (selection: any[]) => {
    multipleSelection.value = selection
}

// 当前页码变化的事件
const handleCurrentChange = (val: number) => {
    // console.log('handleCurrentChange 方法被调用，新的页码：', val);
    const changePageFunc = props.changePage;
    if (typeof changePageFunc === 'function') {
        changePageFunc(val);
    } else {
        console.error('changePage 不是一个函数');
    }
};

const downloadExcel = (row) => {
    if(row.value === "无对应文件"){
        ElMessageBox.alert('无对应文件,不可下载', '提示', {
            type: 'warning'
        })
            .then(() => { })
    }else{
        const url = 'https://pic-excel.oss-cn-hangzhou.aliyuncs.com/excel/'+row.value;
    console.log(url);
    window.open(url);  
}
     
};
const handleDelete = (row) => {
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    })
        .then(async () => {
            props.delFunc(row);
        })
        .catch(() => { });
};
const handleOpreate = (data) => {
    if(data.opreate && data.opreate.isOk == 0){
    ElMessageBox.confirm('确定完成'+data.opreate.opration+'操作吗？', '提示', {
        type: 'warning'
    })
        .then(async () => {
            props.opreateFunc(data);
        })
        .catch(() => { });
    }else if(data.opreate || data.opreate.isOk == 1 ||data.opreate.isOk == 2 ||data.opreate.isOk == 3){
        ElMessageBox.confirm('确定要取消'+data.opreate.opration+'操作吗？', '提示', {
            type: 'warning'
        })
            .then(async () => {
                props.opreateFunc1(data);
            })
            .catch(() => { });
}
};

const getIndex = (index: number) => {
    return index + 1 + (currentPage.value - 1) * pageSize.value
}

const previewVisible = ref(false);
const previewData = ref([]);
const previewColumns = ref([]);

const previewExcel = async (row: any) => {
    if (row.value === "无对应文件") {
        ElMessage.error("没有文件可以预览");
        return;
    }
    const fileUrl = `https://pic-excel.oss-cn-hangzhou.aliyuncs.com/excel/${row.value}`;
    try {
        console.log('开始执行预览操作');
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        console.log('成功获取文件响应', response);
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: "array" });
        if (!workbook.SheetNames.length) throw new Error("无有效工作表");
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const headerData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];
        const headers = headerData[0] || [];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
        previewData.value = jsonData;
        previewColumns.value = headers.map((header: string) => ({
            prop: header,
            label: header,
        }));
        previewVisible.value = true;
        console.log('预览窗口应已打开');
    } catch (error) {
        console.error("预览错误：", error);
        ElMessage.error("预览失败，请检查文件格式（仅支持.xlsx/.xls）或网络连接");
        previewVisible.value = false;
    }
};

const route = useRoute();
const getRowStyle = ({ row, rowIndex }) => {
    // 假设目标页面的路由路径是 /target-page
    if (route.path === '/dashboard') {
        const currentTime = new Date("2025-03-26 17:20:00");
        // const currentTime = new Date();
       const arrtime = new Date(row.arrTime)
       const outtime = new Date(row.outTime)
       const timeDifference = (arrtime.getTime() - currentTime.getTime()) / (1000 * 60); 
       const timeDifference1 = (outtime.getTime() - currentTime.getTime()) / (1000 * 60); 
       console.log(timeDifference1)
       if (timeDifference < 0) {
        return { backgroundColor: 'gray' };
    } else if (timeDifference <= 30) {
        return { backgroundColor: 'lawnGreen' };
    } 
    else if (timeDifference1 <= 30) {
        return { backgroundColor: 'red' };
    }else {
        return {  };
    }
        // if (row.arrTime === "2025-03-26 17:38:00") {
        //     return { backgroundColor: 'gray' };
        // } else {
        //     return { backgroundColor: '#ffffff' };
        // }
    }
    return {};
};

const closePreview = () => {
    previewVisible.value = false;
    previewData.value = [];
    previewColumns.value = [];
};
</script>

<style scoped>
.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
}

.columns-setting-icon {
    display: block;
    font-size: 18px;
    cursor: pointer;
    color: #676767;
}
</style>
<style>
.table-header .cell {
    color: #333;
}
</style>