import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './config/router';
import Util from './libs/util';
import App from './views/app.vue';
import store from './store/store.js';
import MyFooter from './views/footer/footer.vue';
import MainHeader from './views/header/header.vue';
import wordCard from './views/wordsResult/wordCard.vue';
import backTop from './views/components/backTop.vue';
import practiceCard from './views/components/practiceCard.vue';
import './res/theme/MyTheme.less';
import 'iview/dist/styles/iview.css';
 
/* 注册Vue组件 */
Vue.component('MainHeader', MainHeader);
Vue.component('MyFooter', MyFooter);
Vue.component('WordCard',wordCard);
Vue.component('back-top',backTop);
Vue.component('practiceCard',practiceCard);

Vue.use(VueRouter);
Vue.use(iView);
/* 配置vue的http属性为axios,方便全局使用 */
Vue.prototype.$http = Util.ajax;
Vue.prototype.$util = Util;

// 路由配置
const RouterConfig = {
  mode: 'history',
  routes: Routers
};
const router = new VueRouter(RouterConfig);

function loginCheck() {
  //先从state里面获取用户登录信息
  let userInfo = store.state.user;
  //如果 state 里面获取不到，那么从localStorage里面获取
  if (userInfo == null) {
    userInfo = JSON.parse(localStorage.getItem('userInfo') || null)
    }
  if (userInfo == null) {
    store.state.isUserLogin = false;
    return false;
  } else {
    store.state.isUserLogin = true;
    store.state.user = userInfo;
    return true;
  }
}

/* 页面加载时显示进度条 */
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !loginCheck()) {
    new Vue().$Modal.warning(
        {title: '用户未登录', content: '请先完成登录再进行相关操作!'});
    next({path: '/login', query: {redirect: to.fullPath}});
  } else if (loginCheck() && (to.path == '/' || to.path == '/login')) {
    next({path: '/wordsMemory', query: {redirect: to.fullPath}});
  } else {
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
var myApp = new Vue({el: '#app', router, store, render: h => h(App)});

export default myApp;