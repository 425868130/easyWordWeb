import axios from 'axios';
import md5 from 'md5';

import app from '../../src/main.js'
import env from '../config/env';

let util = {

};
util.title = function(title) {
  title = title ? title + ' - Home' : '简词';
  window.document.title = title;
};

/*****************Util.js工具函数************************/
util.getLocalTime = function(timestamp) {
  Date.prototype.toLocaleString = function() {
    return this.getFullYear() + '年' + (this.getMonth() + 1) + '月' +
        this.getDate() + '日 ' + this.getHours() + '点' + this.getMinutes() +
        '分';
  };
  return new Date(timestamp).toLocaleString();
}


const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:8088' :
    env === 'production' ? 'https://www.url.com' : 'https://debug.url.com';
/* 配置Axios */
util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000,
  responseType: 'json',
  header: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
  /*设置该属性后可以使每次的请求使用相同的SessionID*/
  withCredentials: true
});
util.ajax.interceptors.response.use(
    (response) => {
      let statusCode = response.data.statusCode;
      let msg = response.data.message;
      let userUpdate = response.data.userUpdate;
      // console.log('statusCode:' + statusCode);
      /* 如果用户信息被修改则刷新用户信息 */
      if (userUpdate) {
        app.$store.dispatch('sysUserInfo')
        }
      switch (statusCode) {
        case 1000: {
          return response.data;
        } break;
        case 2000: {
          app.$Modal.warning(
              {title: '用户未登录', content: '用户未登录,请先登录后在操作!'});
          /* 清除本地用户信息 */
          app.$store.commit('logout');
          app.$router.push('/login');
        } break;
        default: { return Promise.reject(response); }
        break;
          }
      return response.data;
    },
    function(error) {
      return Promise.reject(error);
    });
util.md5 = md5;
export default util;