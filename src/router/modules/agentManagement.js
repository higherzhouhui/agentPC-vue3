import Layout from '@/layout'
import dl from '@/assets/imgs/sy/dl.png'
import dls from '@/assets/imgs/sy/dls.png'
import { RoleTypeDictory } from '@/utils/index'
import { translateTitle } from '@/locale'
export default {
    path: '/AgentManagement',
    component: Layout,
    name: 'AgentManagement',
    redirect: '/AgentManagement/subordinateMember',
    meta: { title: translateTitle('CUST.translate332'), icon: [dl, dls] },
    children: [
        {
            path: 'subordinateAgent',
            component: () => import('@/views/AgentManagement/subordinateAgent'),
            name: 'subordinateAgent',
            hidden: false,
            meta: { title: translateTitle('CUST.translate333'), noCache: true, roles: [RoleTypeDictory.SuperAdmin, RoleTypeDictory.Total, RoleTypeDictory.Normal]},
        },
        {
            path: 'subordinateMember',
            component: () => import('@/views/AgentManagement/subordinateMember'),
            name: 'subordinateMember',
            hidden: false,
            meta: { title: translateTitle('CUST.translate334'), noCache: true },
        },
        {
            path: 'memberDetail',
            component: () => import('@/views/AgentManagement/memberDetail'),
            name: 'subordinateMemberDetail',
            hidden: true,
            meta: { title: translateTitle('AGENT.translate1'), noCache: true },
        }
    ]
}
