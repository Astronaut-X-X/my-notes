import { defineUserConfig } from 'vuepress'
import { backToTopPlugin } from '@vuepress/plugin-back-to-top'
import { defaultTheme } from '@vuepress/theme-default'

import {
    navbarEn,
    navbarZh,
    sidebarEn,
    sidebarZh,
} from './configs'

export default defineUserConfig({
    base: '/',

    // site-level locales config
    locales: {
        '/': {
            lang: 'en-US',
            title: 'Astronaut-X-X',
            description: 'Personal Notes',
        },
        '/zh/': {
            lang: 'zh-CN',
            title: 'Astronaut-X-X',
            description: '个人笔记',
        },
    },

    theme: defaultTheme({
        locales: {
            /**
             * English locale config
             *
             * As the default locale of @vuepress/theme-default is English,
             * we don't need to set all of the locale fields
             */
            '/': {
                // navbar
                navbar: navbarEn,
                // sidebar
                sidebar: sidebarEn,
                // page meta
                editLinkText: 'Edit this page on GitHub',
                home: '/zh/'
            },

            /**
             * Chinese locale config
             */
            '/zh/': {
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
                    '这里什么都没有',
                    '我们怎么到这来了？',
                    '这是一个 404 页面',
                    '看起来我们进入了错误的链接',
                ],
                backToHome: '返回首页',
            },
        },
    }),

    
    plugins: [
        backToTopPlugin(),
    ],

})
