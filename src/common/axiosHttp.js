"use strict";

import axios from "axios";
import qs from "qs";
import Vue from "vue";
import router from "router";
// import store from '../store'
import axiosConfig from "./axiosConfig";

axios.defaults.timeout = 15000; //响应时间

//配置请求头
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//  axios.defaults.baseURL = 'http://172.16.3.5:9001';//宣志
//  axios.defaults.baseURL = 'http://172.16.4.54:9001';//叶东风
axios.defaults.baseURL = 'http://172.16.4.54:9063';//叶东风2
    //  axios.defaults.baseURL = 'http://172.16.4.58:9061';//钱云倩
//  axios.defaults.baseURL = 'http://172.16.3.7:9001';//陈都
//  axios.defaults.baseURL = 'http://172.16.3.6:9001';//柳腾
//  axios.defaults.baseURL = "http://172.16.3.12:9001"; //邹龙
//  axios.defaults.baseURL = 'http://iacloud.ceway.com.cn/gatewaytest'; //网关配置接口地址 测试环境  
//  axios.defaults.baseURL = 'http://iacloud.ceway.com.cn/gateway/'; //网关配置接口地址 产品环境   
//  axios.defaults.baseURL = 'http://imcloud.ceway.com.cn:8080/gateway/'; //网关配置接口地址 产品环境   
  //  axios.defaults.baseURL = 'http://47.106.121.218/gateway/'; //基迈斯 
  // axios.defaults.baseURL = 'http://172.16.1.11/gateway/';//正集源  
// axios.defaults.baseURL = 'http://119.23.105.72/gateway/'; //网关配置接口地址 demo环境   

// axios.defaults.baseURL = 'http://120.78.81.134:9001'; //盖茨正式环境地址 
//  axios.defaults.baseURL = 'http://192.168.1.18:9001'; //正集源正式环境地址 

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use( 
  config => {
    if (config.data instanceof FormData) {
      // 如果是FormData类型，表示为上传图片
      return config;
    }
    if (config.headers.UseFormData == false) {
      return config;
    }
    var dataParams = {
      encData: "", // 加密后的参数
      encKey: "" // 加密的Key
    };
    // 对请求参数进行统一处理
    if (config.data) {
        (dataParams.encData = JSON.stringify(config.data)),
        (dataParams.encKey = "");
        config.data = dataParams;
    }
    //处理不同的请求类型
    config.headers["Authorization"] = sessionStorage.getItem("access-authorization");
    if (config.method === "post") {
      // config.headers["Content-Type"] ="application/x-www-form-urlencoded;charset=UTF-8";
      config.data = qs.stringify(config.data);
    }
    if (config.method === "get") {
      // config.headers["Content-Type"] ="application/x-www-form-urlencoded;charset=UTF-8";
      if (config.data) {
        config.url += "?" + qs.stringify(config.data);
      }
    }
    return config;
  },
  error => {
    // _.toast("错误的传参", 'fail');
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.resolve(error.response);
  }
);

function checkStatus(response) {
  var vm = new Vue({ router });
  // var newRouter = new router();
  if (response && (response.status === 200 || response.status === 304 ||response.status === 400) ) {
    if (response == null || response == undefined) {
      return;
    }
    var resultData = response.data;
    if (resultData.code == 10002) {
      vm.$alert("您的账号在其它的地方登入，请重新登入!", "警告", {
        confirmButtonText: "确定",
        callback: action => {
          if(sessionStorage.getItem("access-type") === 'poto')
          {
              sessionStorage.clear();
              // window.location.href= "http://172.16.4.30:8966/#/login";
              window.location.href= "http://test.ceway.com.cn:7070/portal/#/login";
          }
          else{
              vm.$router.push('/login');
          }
        }
      });
      return response.data;
    } else if (resultData.code == 10005) {
      vm.$alert("您的账号在其它的地方登入，请重新登入!", "警告", {
        confirmButtonText: "确定",
        callback: action => {
          if(sessionStorage.getItem("access-type") === 'poto')
          {
              sessionStorage.clear();
              // window.location.href= "http://172.16.4.30:8966/#/login";
              window.location.href= "http://test.ceway.com.cn:7070/portal/#/login";
          }
          else{
              vm.$router.push('/login');
          }
        }
      });
      return response.data;
    }
    return response.data;
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  
  // 异常状态下，把错误信息返回去
  // store.dispatch('errStatus', true);
  return {
    code: -404,
    msg: "系统异常，请稍后再试",
    data: null
  };
}

function checkCode(res) {
  // store.dispatch('setLoadingStatus', false);
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === 500) {
    alert(res.msg);
  }
  if (res.data && !res.data.success) {
    alert(res.data.error_msg);
  }
  return res;
}

export default {
  //返回一个Promise(发送post请求)
  axiosPost(url, params) {
    return new Promise((resolve, reject) => {
      // store.dispatch('setLoadingStatus', true);
      axios.post(url, params, axiosConfig).then(
        response => {
          resolve(checkStatus(response));
        },
        err => {
          reject(checkCode(err));
        }).catch(error => {
          reject(checkCode(error));
        });
    });
  },
  //返回一个Promise(发送post请求)
  axiosPostNoHeader(url, params) {
    return new Promise((resolve, reject) => {
      // store.dispatch('setLoadingStatus', true);
      axios.post(url, params).then(
        response => {
          resolve(checkStatus(response));
        },
        err => {
          reject(checkCode(err));
        }).catch(error => {
          reject(checkCode(error));
        });
    });
  },
  //返回一个Promise(发送get请求)
  axiosGet(url, params) {
    return new Promise((resolve, reject) => {
      // store.dispatch('setLoadingStatus', true);
      axiosConfig.data = params;
      axios.get(url, axiosConfig).then(
        response => {
          resolve(response.data);
          // store.dispatch('setLoadingStatus', false);
        },
        err => {
          reject(err);
          // store.dispatch('setLoadingStatus', false);
        }).catch(error => {
          reject(error);
          // store.dispatch('setLoadingStatus', false);
        });
    });
  },
  //返回一个Promise(发送上传文件请求)
  axiosUpload(url, params) {
    return new Promise((resolve, reject) => {
      // store.dispatch('setLoadingStatus', true);
      axios({
        method: "post",
        url: url,
        data: params,
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': sessionStorage.getItem("access-authorization")
        }
      }).then(
        response => {
          resolve(checkStatus(response));
        },
        err => {
          reject(checkCode(err));
        }).catch(error => {
          reject(checkCode(error));
        });
    });
  },

  // 特殊
  //返回一个Promise(发送post请求)
  axiosPosts(url, params) {
    return new Promise((resolve, reject) => {
      // store.dispatch('setLoadingStatus', true);
      axios({
        method: "post",
        url: url,
        data: params,
        headers: {
          UseFormData: false,
          // "Content-Type": "application/json; charset=utf-8",
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          'Authorization': sessionStorage.getItem("access-authorization")
        }
      }).then(
        response => {
          resolve(checkStatus(response));
        },
        err => {
          reject(checkCode(err));
        }).catch(error => {
          reject(checkCode(error));
        });
    });
  }
};
