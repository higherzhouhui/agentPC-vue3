import http from '@/utils/request'

// {
//   "agentAccount": "",
//   "agentName": "",
//   "agentType": 0,
//   "commissionRatio": 0,
//   "gameRateConfigList": [
//     {
//       "gameType": 0,
//       "id": 0,
//       "platformRatio": 0,
//       "typeNameEn": "",
//       "typeNameZh": ""
//     }
//   ],
//   "groupId": 0,
//   "loginPwd": "",
//   "operator": ""
// }

// 添加总代理账号
export function addTopAgaentRequest(data) {
  return http.request({
    url: '/api/agent-server/api/agent/addTopAgent',
    method: 'post',
    data: data,
  })
}


export function login(data) {
  return http.request({
    url: '/api/agent-server/agent/user/login',
    method: 'post',
    data,
  })
}

export function getCaptcha() {
  return http.request({
    url: '/api/code',
    method: 'get',
  })
}

// export function login(data) {
//   return http.request({
//     method: 'post',
//     url: '/agent-server/agent/user/login',
//     data
//   })
// }
// export function login(data) {
//   return http.request({
//     method: 'post',
//     url: '/api/roulette/activity',
//     data:{
//       orderId: "2208291359438330000",
//       os: 1,
//       language: "CN",
//       sign: "74C9B87EE16DEBB8F8204BD521AF67D3",
//       timestamp: new Date().getTime(),
//       udid: "f20d64c5-f8e1-4f27-8624-f65668b05e80",
//       uid: "2034512179",
//     }
//   })
// }


export function getInfo() {
  return http.request({
    method: 'get',
    url: '/api/agent-server/agent/user/getUserOverviewInfo',
  })
}

export function logout() {
  return http.request({
    url: '/logOut',
    method: 'get'
  })
}

export function loginHistory() {
  return http.request({
    url: '/login/history',
    method: 'get'
  })
}


export function testRequest() {
  return http.request({
    url: '/test',
    method: 'get'
  })
}

export function changePwd(data) {
  return http.request({
    url: '/api/agent-server/agent/user/updatePassword',
    method: 'post',
    data: {
      loginPwd: data?.account,
      newPassword: data?.account2,
    }
  })
}

// 绑定手机:发送手机短信
export function sendPhoneSms(data) {
  return http.request({
    url: '/api/agent-server/agent/user/sendSms',
    method: 'post',
    data,
  })
}

// 绑定手机
export function bindPhoneConfirm(data) {
  return http.request({
    url: '/api/agent-server/agent/user/bindPhoneConfirm',
    method: 'post',
    data,
  })
}

export function updateOverviewInfo(data) {
  return http.request({
    url: '/api/agent-server/agent/user/updateOverviewInfo',
    method: 'post',
    data,
  })
}



export function getBankList(data) {
  return http.request({
    url: '/api/agent-server/agent/cardBind/getBankList',
    method: 'post',
    data,
  })
}

export function getWalletList(data) {
  return http.request({
    url: '/api/agent-server/agent/cardBind/getWalletList',
    method: 'post',
    data,
  })
}

export function addmyBank(data) {
  return http.request({
    url: '/api/agent-server/agent/cardBind/addBank',
    method: 'post',
    data,
  })
}

export function addmyWallet(data) {
  return http.request({
    url: '/api/agent-server/agent/cardBind/addWallet',
    method: 'post',
    data,
  })
}

export function bankmyUpdate(data) {
  return http.request({
    url: '/api/agent-server/agent/cardBind/bankUpdate',
    method: 'post',
    data,
  })
}

export function walletmyUpdate(data) {
  return http.request({
    url: '/api/agent-server/agent/cardBind/updateWallet',
    method: 'post',
    data,
  })
}
// 发送邮箱验证码
export function sendEmailCode(data) {
  return http.request({
    url: '/api/agent-server/agent/user/sendEmailCode',
    method: 'post', 
    data,
  })
}
// 更新邮箱
export function updateAgentEmail(data) {
  return http.request({
    url: '/api/agent-server/agent/user/updateAgentEmail',
    method: 'post',
    data,
  })
}
//注册代理
export function agentRegister(data) {
  return http.request({
    url: '/api/agent-server/agent/user/register',
    method: 'post',
    data,
  })
}

//更改资金密码
export function updatePayPwd(data) {
  return http.request({
    url: '/api/agent-server/agent/user/updatePayPwd',
    method: 'post',
    data,
  })
}