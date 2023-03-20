import { defineUserConfig } from 'vuepress'
import { backToTopPlugin } from '@vuepress/plugin-back-to-top'
import { defaultTheme } from '@vuepress/theme-default'
import { nprogressPlugin } from '@vuepress/plugin-nprogress'

import {
    navbarEn,
    navbarZh,
    sidebarEn,
    sidebarZh,
} from './configs'

export default defineUserConfig({
    base: '/my-notes/',

    // site-level locales config
    locales: {
        '/': {
            lang: 'zh-CN',
            title: 'Astronaut-X-X',
            description: '个人笔记',
        },
        '/en/': {
            lang: 'en-US',
            title: 'Astronaut-X-X',
            description: 'Personal Notes',
        },
    },

    theme: defaultTheme({
        locales: {

            '/': {
                // navbar
                navbar: navbarZh,
                selectLanguageName: '简体中文',
                selectLanguageText: '选择语言',
                selectLanguageAriaLabel: '选择语言',
                // sidebar
                sidebar: sidebarZh,
                // custom containers
                tip: '提示',
                warning: '注意',
                danger: '警告',
                // 404 page
                notFound: [
                    '这是一个 404 页面',
                ],
                backToHome: '返回首页',
            },

            '/en/': {
                // navbar
                navbar: navbarEn,
                // sidebar
                sidebar: sidebarEn,
                // page meta
                editLinkText: 'Edit this page on GitHub',
                selectLanguageName: 'English',
            },
        },
    }),


    plugins: [
        backToTopPlugin(),
        nprogressPlugin(),
    ],

})
