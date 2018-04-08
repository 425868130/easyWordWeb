import axios from 'axios';
import env from '../config/env';
import md5 from 'md5';
let util = {

};
util.title = function(title) {
    title = title ? title + ' - Home' : '简词';
    window.document.title = title;
};

/*****************Util.js工具函数************************/
util.getLocalTime = function(timestamp) {
    Date.prototype.toLocaleString = function () {
        return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 " + this.getHours() + "点" + this.getMinutes() + "分";
    };
    return new Date(timestamp).toLocaleString();
}


const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:8088' :
    env === 'production' ?
    'https://www.url.com' :
    'https://debug.url.com';
/* 配置Axios */
util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000,
    responseType: 'json',
    header: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
    /*设置该属性后可以使每次的请求使用相同的SessionID*/
    withCredentials: true
});
util.md5 = md5;
export default util;