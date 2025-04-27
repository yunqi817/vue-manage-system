import request from '../utils/request';




//获取数据
export const fetchUserData = () => {
    return request({
        url: '/api/user/list',
        method: 'get'
    }).catch(error => {
        console.error('获取用户数据失败:', error);
        throw error;
    });
};

export const fetchCarData = (date : String) => {
    return request({
        url: '/api/car/list',
        method: 'post',
        params:{
            date
        }
    }).catch(error => {
        console.error('获取转线数据失败:', error);
        throw error;
    });
};

export const fetchLogData = () => {
    return request({
        url: '/api/opreateLog/list',
        method: 'get'
    }).catch(error => {
        console.error('获取日志数据失败:', error);
        throw error;
    });
};

export const fetchjobData = () => {
    return request({
        url: '/api/jobperson/list',
        method: 'get'
    }).catch(error => {
        console.error('获取值班数据失败:', error);
        throw error;
    });
};

export const fetchimportData = () => {
    return request({
        url: '/api/file/list',
        method: 'get'
    }).catch(error => {
        console.error('获取值班数据失败:', error);
        throw error;
    });
};

//更新接口        
    
    // 更新用户数据
export const updateUserData = (data: any) => {
    return request({
        url: '/api/user/update',
        method: 'post', 
        data
    }).catch(error => {
        console.error('更新用户数据失败:', error);
        throw error;
    });
};

    //修改用户密码
    export const sendExampleRequest = (userId: number, formOld: string, formNew: string) => {
        return request({
            url: '/api/user/updatePwd',
            method: 'post',
            params: {
                userId,
                formOld,
                formNew
            }
        }).catch(error => {
            console.error('修改密码出错:', error);
            throw error;
        });
    };
       

    //修改车辆信息
export const updateCarOpreateData = (data: any) => {
    return request({
        url: '/api/car/updateCar',
        method: 'post', 
        data
    }).catch(error => {
        console.error('更新车辆信息数据失败:', error);
        throw error;
    });
};

export const updateJobData = (data: any) => {
    return request({
        url: '/api/jobperson/updatejob',
        method: 'post', 
        data
    }).catch(error => {
        console.error('更新值班数据失败:', error);
        throw error;
    });
};


//搜索接口

    // 根据 staffId 获取用户信息
export const getUserInfo = (staffId: string) => {
    return request({
        url: `/api/user/${staffId}`,
        method: 'get'
    }).catch(error => {
        console.error('没有该用户:', error);
        throw error;
    });
};

export const getCarInfo = (carId: string) => {
    return request({
        url: `/api/car/getCarId`,
        method: 'get',
        params: {
            carId
        }
    }).catch(error => {
        console.error('查询错误:', error);
        throw error;
    });
};

export const getLogbyid = (date: string) => {
    return request({
        url: `/api/opreateLog/searchLog/${date}`,
        method: 'post',
        params: {
            date
        }
    }).catch(error => {
        console.error('查询错误:', error);
        throw error;
    });
};

export const getjobbydate = (date: string) => {
    return request({
        url: `/api/jobperson/searchJob`,
        method: 'post',
        params: {
            date
        }
    }).catch(error => {
        console.error('查询错误:', error);
        throw error;
    });
};


//删除接口

    //根据id删除车系信息以及对应操作信息
export const DeleteCarInfo = (Id: string) => {
    return request({
        url: `/api/car/${Id}`,
        method: 'delete'
    }).catch(error => {
        console.error('没有该用户:', error);
        throw error;
    });
};

export const DeleteLogInfo = (Id: string) => {
    return request({
        url: `/api/opreateLog/${Id}`,
        method: 'delete'
    }).catch(error => {
        console.error('没有该用户:', error);
        throw error;
    });
};


    //根据id删除用户
export const DeleteUserInfo = (staffId: string) => {
    return request({
        url: `/api/user/${staffId}`,
        method: 'delete'
    }).catch(error => {
        console.error('没有该用户:', error);
        throw error;
    });
};
export const DeleteJobInfo = (data: any) => {
    return request({
        url: `/api/jobperson/delete`,
        method: 'post',
        data
    }).catch(error => {
        console.error('没有信息:', error);
        throw error;
    });
};

export const DeletePicExcelInfo = (fileName: string) => {
    return request({
        url: `/api/file/delete`,
        method: 'post',
        params: {
            fileName
        }
    }).catch(error => {
        console.error('没有信息:', error);
        throw error;
    });
};



//新增接口

    //添加用户
export const ADDUserData = (data: any) => {
    return request({
        url: '/api/user/addUser',
        method: 'post', 
        data
    }).catch(error => {
        console.error('添加用户数据失败:', error);
        throw error;
    });
};


    //添加车系信息
export const saveCarOpreate = (data: any) => {
    return request({
        url: '/api/car/saveCarOpreate',
        method: 'post', 
        data
    }).catch(error => {
        console.error('更新车辆信息数据失败:', error);
        throw error;
    });
};

export const savelog = (data: any) => {
    return request({
        url: '/api/opreateLog/saveLog',
        method: 'post', 
        data
    }).catch(error => {
        console.error('保存日志数据失败:', error);
        throw error;
    });
};

export const saveJob = (data: any) => {
    return request({
        url: '/api/jobperson/savejob',
        method: 'post', 
        data
    }).catch(error => {
        console.error('保存日志数据失败:', error);
        throw error;
    });
};



//导入接口
export const importExcel = (file: File,plandate: string ) =>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('plandate', plandate);
    return request({
        url: `/api/car/importExcel`,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).catch(error => {
        console.error('请重新上传，并检查格式:', error);
        throw error;
    });
};


export const recognize = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request({
        url: `/api/file/upload`,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).catch(error => {
        console.error('请重新上传，并检查格式:', error);
        throw error;
    });
};  
