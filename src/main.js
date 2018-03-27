import Vue from 'vue';
import Vuex from 'vuex';
import iView from 'iview';
import'./res/theme/MyTheme.less';
import VueRouter from 'vue-router';
import Routers from './config/router';
import Util from './libs/util';
import App from './views/app.vue';
import 'iview/dist/styles/iview.css';
import MainHeader from './views/header/header.vue';
import MyFooter from './views/footer/footer.vue';
/* 注册Vue组件 */
Vue.component('MainHeader',MainHeader);
Vue.component('MyFooter',MyFooter);

Vue.use(VueRouter);
Vue.use(iView);
Vue.use(Vuex);
/* 配置vue的http属性为axios,方便全局使用 */
Vue.prototype.$http = Util.ajax;
Vue.prototype.$util = Util;

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);
/* Vuex的store对象*/
const store = new Vuex.Store({
    state: {
        isUserLogin:false,
        token:'',
        user:{}
    },
    mutations: {
        /**
         * mutations用于修改store中的数据,其中的方法必须为同步方法
         */
        /* 用户登录 */
        userLogin(state,userInfo){
            state.isUserLogin = true;
            state.user = userInfo;
        },
        logout(state){
            state.isUserLogin= false;
            state.user={};
        },
        setToken(state,token){
            state.token = token;
        }
    },
    getters:{
        /* 用于获取store中的数据 */
        getToken:state=>{return state.token},
        getLoginStatus:state=>{return state.isUserLogin},
        getUser:state=>{return state.user}
    }
});

/* 页面加载时显示进度条 */
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)&&!store.state.isUserLogin) {
        alert('请先登录！');
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    }else if(store.state.isUserLogin &&(to.path=='/'||to.path=='/login')){
        next({
            path: '/wordsMemory',
            query: { redirect: to.fullPath }
        });
    }else{
        iView.LoadingBar.start();
        Util.title(to.meta.title);
        next();
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
/* 创建vue实例 */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});