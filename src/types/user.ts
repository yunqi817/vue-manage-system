// src/types/user.ts
export interface User {
    staffId: number;
    staffName: string;
    staffGender: number;
    staffPosition: number;
    staffDepartment: number;
    // 注意：JavaScript 没有直接对应的 Date 类型，通常后端返回的日期是字符串格式
    staffHiredate: string; 
    staffTel: string;
    staffPermission: number;
    staffPwd: string;
    remark: string;
}