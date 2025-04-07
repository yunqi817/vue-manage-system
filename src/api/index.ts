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

export const fetchCarData = () => {
    return request({
        url: '/api/car/list',
        method: 'get'
    }).catch(error => {
        console.error('获取转线数据失败:', error);
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


//导入接口
export const importExcel = (data: any ) =>{
    return request({
        url: `/api/car/importExcel`,
        method: 'post',
        data
    }).catch(error => {
        console.error('请重新上传，并检查格式:', error);
        throw error;
    });
};
