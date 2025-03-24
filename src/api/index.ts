import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

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
    console.log('updateUserData', data);
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
        console.error('获取用户信息失败:', error);
        throw error;
    });
};