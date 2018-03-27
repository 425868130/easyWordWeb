/**
 * 2018-3-12 16:21:35
 * @author xujw
 * 页面路由定义
 */
import index from '../views/index.vue';
import notFound from '../views/notFound/notFound.vue';
import wordsMemory from '../views/wordsMemory/wordsMemory.vue';
import wordsResult from '../views/wordsResult/wordsResult.vue';
import listeningPractice from '../views/listeningPractice/listeningPractice.vue';
import resDownload from '../views/resDownload/resDownload.vue';
import newsPage from '../views/newsPage/newsPage.vue';
import login from '../views/lginRegister/login.vue';
import register from '../views/lginRegister/register.vue';
import newsDetail from '../views/newsPage/newsDetail.vue';
import userZone from '../views/userZone/userZone.vue';
import wordsBook from '../views/wordsBook/wordsBook.vue';
import authentication from '../views/authentication/authentication.vue';
/**
 * 子主页路由,负责index.vue页面的路由配置
 */
const childrenRouter=[
    {
        path:'/',
        meta:{title:'用户登录'},
        component:login
    },
    {
        path:'search/:keywords*',
        meta:{title:'单词查询',requiresAuth: true},
        component:wordsResult
    },
    {
        path:'wordsMemory',
        meta:{title:'单词记忆',requiresAuth: true},
        component:wordsMemory
    },
    {
        path:'listeningPractice',
        meta:{title:'听力训练',requiresAuth: true},
        component:listeningPractice
    },
    {
        path:'newsPage',
        meta:{title:'新闻资讯'},
        component:newsPage
    },
    {
        path:'/newsDetail/:newsId',
        meta:{title:'新闻详情'},
        component:newsDetail
    },
    {
        path:'resDownload',
        meta:{title:'资料下载',requiresAuth: true},
        component:resDownload
    },
    {
        path:'login',
        meta:{title:'用户登录'},
        component:login
    },
    {
        path:'register',
        meta:{title:'用户注册'},
        component:register
    },
    {
        path:'userZone/:userAccount',
        meta:{title:'个人中心'},
        component:userZone
    },
    {
        path:'wordsBook/:userAccount',
        meta:{title:'单词本',requiresAuth: true},
        component:wordsBook
    }
];

/**
 * 根页面路由,负责app.vue中的路由
 */
const routers = 
    [
        {
            path: '/',
            meta: {
                title: '简词'
            },
            component: index,
            children:childrenRouter
        },
        {
            path:'/authentication',
            meta:{title:'账号认证'},
            component:authentication
        },
        {
            path: '*', component: notFound
        }
    ];
export default routers;