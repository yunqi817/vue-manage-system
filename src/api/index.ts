import request from '../utils/request';



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

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};

// 新增更新用户数据的 API 请求函数
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