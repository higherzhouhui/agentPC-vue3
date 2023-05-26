import http from '@/utils/request';

// 添加子代理
export function addChildAgent(data) {
    return http.request({
        url: '/api/agent-server/agent/user/addChildAgent',
        method: 'post',
        data: data,
    })
}


// 下级代理列表
export function getAgaentList(data) {
    return http.request({ 
        url: '/api/agent-server/agent/user/pageList',
        method: 'post',
        data: data,
    })
}

// 下级会员列表
export function getNumberList(data) {
    return http.request({
        url: '/api/agent-server/agent/user/directMemberList',
        method: 'post',
        data: {
            ...data,
            timeType: 1
        },
    })
}

// 查询会员红利数据
/*
{
    "month": "",
    "uid": 0
}
*/
export function queryMemberBonusData(data) {
    return http.request({
        url: '/api/agent-server/agent/member/queryMemberBonusData',
        method: 'post',
        data: data,
    })
}

// 查询会员存款
/*
{
    "month": "",
    "uid": 0
}
*/
export function queryMemberDepositData(data) {
    return http.request({
        url: '/api/agent-server/agent/member/queryMemberDepositData',
        method: 'post',
        data: data,
    })
}

// 查询会员游戏数据
/*
{
    "month": "",
    "uid": 0
}
*/
export function queryMemberGameData(data) {
    return http.request({
        url: '/api/agent-server/agent/member/queryMemberGameData',
        method: 'post',
        data: data,
    })
}

// 查询会员打赏数据
/*
{
    "month": "",
    "uid": 0
}
*/
export function queryMemberGiftData(data) {
    return http.request({
        url: '/api/agent-server/agent/member/queryMemberGiftData',
        method: 'post',
        data: data,
    })
}

// 查询会员提款数据
/*
{
    "month": "",
    "uid": 0
}
*/
export function queryMemberWithdrawData(data) {
    return http.request({
        url: '/api/agent-server/agent/member/queryMemberWithdrawData',
        method: 'post',
        data: data,
    })
}

// 获取扶持代理扶持方案
/*
{
    "month": "",
    "uid": 0
}
*/
export function getSysSupportPlan() {
    return http.request({
        url: '/api/agent-server/agent/user/getSysSupportPlan',
        method: 'get',
    })
}