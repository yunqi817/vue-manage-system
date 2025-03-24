<template>
    <el-form ref="formRef" :model="form" :rules="rules" :label-width="options.labelWidth">
        <!-- 表单输入项 -->
        <el-row>
            <el-col :span="options.span" v-for="item in options.list" :key="item.prop">
                <el-form-item :label="item.label" :prop="item.prop">
                    <el-input v-if="item.type === 'input'" v-model="form[item.prop]" :disabled="item.disabled" :placeholder="item.placeholder" clearable></el-input>
                    <el-date-picker 
                        v-if="item.type === 'date-picker'" 
                        v-model="form[item.prop]" 
                        :disabled="item.disabled" 
                        :placeholder="item.placeholder" 
                        type="date" 
                        format="YYYY-MM-DD" 
                        value-format="YYYY-MM-DD"
                    ></el-date-picker>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item>
            <el-button type="primary" @click="saveEdit(formRef)">保 存</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus';
import { PropType, ref } from 'vue';
import { FormOption } from '@/types/form-option';

const { options, formData, edit, update } = defineProps({
    options: {
        type: Object as PropType<FormOption>,
        required: true
    },
    formData: {
        type: Object,
        required: true
    },
    edit: {
        type: Boolean,
        required: false
    },
    update: {
        type: Function,
        required: true
    }
});

const form = ref({ ...formData });

const rules: FormRules = options.list.map(item => {
    if (item.required) {
        return { [item.prop]: [{ required: true, message: `${item.label}不能为空`, trigger: 'blur' }] };
    }
    return {};
}).reduce((acc, cur) => ({ ...acc, ...cur }), {});

const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            // 将修改后的数据更新到 formData
            Object.assign(formData, form.value);
            // 调用父组件的 update 方法
            update();
        } else {
            console.log('表单验证失败');
        }
    });
};


</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
}
</style>