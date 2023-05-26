import { validPhone } from './validate'
import { translateTitle } from '@/locale'
import http from '@/utils/request'

// 单词首字母转大写
export function toUpperCaseWord(val) {
  if (!val) return ''
  return val.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase())
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        // eslint-disable-next-line prefer-regex-literals
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  const date = new Date(time)

  const formatObj = {
    y: date.getFullYear(),
    m: (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1),
    d: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
    h: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
    i: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
    s: date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(),
    a: date.getDay()
  }
  return `${formatObj.y}-${formatObj.m}-${formatObj.d} ${formatObj.h}:${formatObj.m}:${formatObj.s}`
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function encryptionPhone(val) {
  if (!validPhone(val)) {
    return ''
  }
  const reg = /^(\d{3})\d{4}(\d{4})$/
  return val.replace(reg, '$1****$2')
}

export const dictGroup = [
  {
    createBy: "admin",
    createTime: "2022-04-24 14:02:08",
    cssClass: "",
    default: true,
    dictCode: 10,
    dictLabel: "默认",
    dictSort: 1,
    dictType: "sys_job_group",
    dictValue: "DEFAULT",
    isDefault: "Y",
    listClass: "",
    params: {},
    remark: "默认分组",
    searchValue: null,
    status: "0",
    updateBy: null,
    updateTime: null,
  },
  {
    createBy: "admin",
    createTime: "2022-04-24 14:02:08",
    cssClass:"",
    default:false,
    dictCode:11,
    dictLabel:"系统",
    dictSort:2,
    dictType:"sys_job_group",
    dictValue:"SYSTEM",
    isDefault:"N",
    listClass:"",
    params:{},
    remark:"系统分组",
    searchValue:null,
    status:"0",
    updateBy:null,
    updateTime:null,
  }
];
export const dictStatus = [
  {
    searchValue:null,
    createBy:"admin",
    createTime:"2022-04-24 14:02:08",
    updateBy:null,
    updateTime:null,
    remark:"正常状态",
    params:{},
    dictCode:8,
    dictSort:1,
    dictLabel:"正常",
    dictValue:"0",
    dictType:"sys_job_status",
    cssClass:"",
    listClass:"primary",
    isDefault:"Y",
    status:"0",
    default:true
  },
  {
    searchValue:null,
    createBy:"admin",
    createTime:"2022-04-24 14:02:08",
    updateBy:null,
    updateTime:null,
    remark:"停用状态",
    params:{},
    dictCode:9,
    dictSort:2,
    dictLabel:"暂停",
    dictValue:1,
    dictType:"sys_job_status",
    cssClass:"",
    listClass:"danger",
    isDefault:"N",
    status:0,
    default:false
  }
]

export const agentTypeDic = [
  translateTitle('CUST.translate175'),translateTitle('CUST.translate198'),
  translateTitle('CUST.translate199'),translateTitle('CUST.translate200'),translateTitle('CUST.translate201')
];

export const RoleTypeDictory = {
  SuperAdmin: 'SuperAdmin',
  Total: 'Total',
  Normal: 'Normal',
  Direct: 'Direct',
}

export function shiftToReadNumber(number) {
  try {
    if (number) {
      if (!isNaN(number * 1)) {
        const wholeStr = Number(number).toFixed(2);
        const houZhui = wholeStr.slice(wholeStr.lastIndexOf('.'), wholeStr.length);
        const zhuti = wholeStr.slice(0, wholeStr.lastIndexOf('.'))
        const result =  String(zhuti).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + houZhui
        return result
      } else {
        return number
      }
    } else {
      return '0.00'
    }
  } catch {
    return '0.00'
  }
}

/**
 *  params:data-查询参数,title:报表名称,type:唯一标识,specialUrl:非常规url
 *  export
 */
export const exportReportTable = async(data, title, url, specialUrl) => {
  try {
    const result = await http.request({
      url: url ?  `/api/commission-server/agent/${url}/export` : `/api/agent-server/agent/${specialUrl}`,
      method: 'post',
      data,
      responseType: 'blob'
    })
      const link = document.createElement('a') // 创建a标签
      const blob = new Blob([result], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }) // 设置文件流
      link.style.display = 'none'
      // 设置连接
      link.href = URL.createObjectURL(blob) // 将文件流转化为blob地址
      link.download = title
      document.body.appendChild(link)
      // 模拟点击事件
      link.click() // 设置点击事件
  } catch {
    console.error('export error')
  }
}