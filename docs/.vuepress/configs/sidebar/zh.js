/**
 * 
 * 侧边栏目录
 * 
 * SidebarItem:
 *  {
 *      text: '名称'
 *      link: '路由'
 *      children: [SidebarItem,...]
 *  }
 * 
 */
export const sidebarZh = [
    {
        text: '笔记',
        children: [
            {
                text: '首页',
                link: '/',
                children: []
            },
        ],
    },
    {
        text: '微服务',
        children: [
            {
                text: '基础知识',
                link: '/microserver/basic-knowledge.md',
            },
            {
                text: 'Go-kit 1',
                link: '/microserver/go-kit_1.md',
            },
            {
                text: 'Go-kit 2',
                link: '/microserver/go-kit_2.md',
            },
            {
                text: 'Go-kit 3',
                link: '/microserver/go-kit_3.md',
            },
        ]
    },
    {
        text: 'Golang',
        children: [
            {
                text: 'Slice',
                link: '/golang/slice.md',
            },
        ]
    },
    {
        text: '网络',
        children: [
            {
                text: 'TCP',
                link: '/network/tcp.md',
            },
        ]
    },
    {
        text: '其他',
        children: [
            {
                text: 'Makefile',
                link: '/other/makefile.md',
            },
        ]
    }
]