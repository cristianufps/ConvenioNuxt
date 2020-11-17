import axios from 'axios'

export default {
    mode: 'universal',
    /*
     ** Headers of the page
     */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    /*
     ** Customize the progress-bar color
     */
    loading: '~/components/loading.vue',
    /*
     ** Global CSS
     */
    css: [
        'ant-design-vue/dist/antd.css',
        { src: './assets/css/style.css' }
    ],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '@/plugins/antd-ui',
        '@/plugins/vue-axios',
        '@/plugins/axios'
    ],
    /*  
     ** Axios module configuration
     ** https://convenio-273922.uc.r.appspot.com
     ** https://swac-app.rj.r.appspot.com
     ** http://localhost:8080
     */
    axios: {
        baseURL: 'http://localhost:8080'
    },
    /*
     ** Login Configuration 
     */
    auth: {
        // Options
        redirect: {
            login: '/authentication/cover-page',
            logout: '/',
            callback: '/authentication/cover-page',
            home: '/'
        },
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/login',
                        method: 'post',
                        propertyName: 'token'
                    },
                    logout: false,
                    user: { url: '/me', method: 'get', propertyName: 'user' }
                },
                tokenRequired: true,
                tokenType: 'Bearer'
            }
        },
        resetOnError: true
    },

    router: {
        middleware: ['auth']
    },

    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        // Doc: https://github.com/nuxt-community/eslint-module
    ],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/auth'
    ],
    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {}
    }
}