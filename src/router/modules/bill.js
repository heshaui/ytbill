import Layout from '@/layout'

export default {
    path: '/bill',
    component: Layout,
    redirect: '/bill/billList',
    name: 'bill',
    meta: {
        title: '账单',
        icon: 'sidebar-formManage'
    },
    children: [
        {
            path: 'billList',
            component: () => import('@/views/bill/billList.vue'),
            name: 'billList',
            meta: {
                sidebar: false,
                breadcrumb: false,
                activeMenu: '/bill'
            }
        }
    ]
}
