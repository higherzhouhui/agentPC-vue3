import Layout from '@/layout'
import ba from '../../assets/imgs/sy/ba.png'
import bas from '../../assets/imgs/sy/bas.png'
import { RoleTypeDictory } from '@/utils/index'
import { translateTitle } from '@/locale'
export default {
    path: '/ReportFormManagement',
    component: Layout,
    name: 'ReportFormManagement',
    redirect: '/ReportFormManagement/gameReportForm',
    meta: { title: translateTitle('CUST.translate335'), icon: [ba, bas] },
    children: [
        {
            path: 'gameReportForm',
            component: () => import('@/views/ReportFormManagement/gameReportForm'),
            name: 'gameReportForm',
            hidden: false,
            meta: { title: translateTitle('CUST.translate227'), noCache: true }
        },
        {
            path: 'gameClassification',
            component: () => import('@/views/ReportFormManagement/gameClassification'),
            name: 'gameClassification',
            hidden: false,
            meta: { title: translateTitle('CUST.translate236'), noCache: true }
        },
        {
            path: 'activityReportForm',
            component: () => import('@/views/ReportFormManagement/activityReportForm'),
            name: 'activityReportForm',
            hidden: false,
            meta: { title: translateTitle('CUST.translate238'), noCache: true }
        },
        {
            path: 'drawingReportForm',
            component: () => import('@/views/ReportFormManagement/drawingReportForm'),
            name: 'drawingReportForm',
            hidden: false,
            meta: { title: translateTitle('CUST.translate241'), noCache: true, roles: [RoleTypeDictory.SuperAdmin, RoleTypeDictory.Normal, RoleTypeDictory.Total] }
        },
        {
            path: 'directreportForm',
            component: () => import('@/views/ReportFormManagement/directreportForm'),
            name: 'directreportForm',
            hidden: false,
            meta: { title: translateTitle('CUST.translate252'), noCache: true, roles: [RoleTypeDictory.Total, RoleTypeDictory.Normal, RoleTypeDictory.SuperAdmin] }
        },
        // 新加
        {
            path: 'parterReportForm',
            component: () => import('@/views/ReportFormManagement/parterReportForm'),
            name: 'parterReportForm',
            hidden: false,
            meta: { title: translateTitle('CUST.translate255'), noCache: true, roles: [RoleTypeDictory.Total, RoleTypeDictory.SuperAdmin] }
        },
        {
            path: 'subordinateReportForm',
            component: () => import('@/views/ReportFormManagement/subordinateReportForm'),
            name: 'reportFormwin',
            hidden: false,
            meta: { title: translateTitle('CUST.translate260'), noCache: true, roles: [RoleTypeDictory.Total, RoleTypeDictory.Normal, RoleTypeDictory.SuperAdmin] }
        },
        {
            path: 'anchorReportForm',
            component: () => import('@/views/ReportFormManagement/anchorReportForm'),
            name: 'anchorReportForm',
            hidden: false,
            meta: { title: translateTitle('CUST.translate261'), noCache: true }
        },
        {
            path: 'commissionReportForm',
            component: () => import('@/views/ReportFormManagement/commissionReportForm'),
            name: 'commissionReportForm',
            hidden: false,
            meta: { title: translateTitle('CUST.translate265'), noCache: true, roles: [RoleTypeDictory.Total, RoleTypeDictory.Normal, RoleTypeDictory.SuperAdmin] }
        },
        {
            path: 'commissionDetailed',
            component: () => import('@/views/ReportFormManagement/commissionDetailed'),
            name: 'commissionDetailed',
            hidden: false,
            meta: { title: translateTitle('CUST.translate268'), noCache: true, roles: [RoleTypeDictory.Total, RoleTypeDictory.Normal, RoleTypeDictory.SuperAdmin] }
        },
        {
            path: 'platformReportForm',
            component: () => import('@/views/ReportFormManagement/platformReportForm'),
            name: 'platformReportForm',
            hidden: false,
            meta: { title: translateTitle('CUST.translate295'), noCache: true, roles: [RoleTypeDictory.Total, RoleTypeDictory.Normal, RoleTypeDictory.SuperAdmin] }
        },
        {
            path: 'myCommissionReportForm',
            component: () => import('@/views/ReportFormManagement/myCommissionReportForm'),
            name: 'myCommissionReportForm',
            hidden: false,
            meta: { title: translateTitle('CUST.translate284'), noCache: true, roles: [RoleTypeDictory.Total, RoleTypeDictory.Normal, RoleTypeDictory.SuperAdmin] }
        },
        {
            path: 'myCommissionReceiveReportForm',
            component: () => import('@/views/ReportFormManagement/myCommissionReceiveReportForm'),
            name: 'myCommissionReceiveReportForm',
            hidden: false,
            meta: { title: translateTitle('CUST.translate276'), noCache: true, roles: [RoleTypeDictory.Total, RoleTypeDictory.Normal, RoleTypeDictory.SuperAdmin] }
        },
        {
            path: 'rebateDetailed',
            component: () => import('@/views/ReportFormManagement/rebateDetailed'),
            name: 'rebateDetailed',
            hidden: false,
            meta: { title: translateTitle('CUST.zikaicaifanlimingxi'), noCache: true, roles: [RoleTypeDictory.Total, RoleTypeDictory.Normal, RoleTypeDictory.SuperAdmin] }
        },
    ]
}
