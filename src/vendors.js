
import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import iView from 'iview';

var Ajx = axios.create({
    baseURL: 'http://127.0.0.1:8080',
    timeout: 30000,
    responseType: 'json',
    header: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
    /*设置该属性后可以使每次的请求使用相同的SessionID*/
    withCredentials: true
  });
  
Vue.prototype.$http=Ajx;