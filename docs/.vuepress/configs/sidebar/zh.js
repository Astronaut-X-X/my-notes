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
        text: '其他',
        children: [
            {
                text: '模板',
                link: '/template',
            }
        ]
    }
]