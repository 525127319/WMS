<template>
    <div class="login-wrap">
        <div class="ms-title">仓库管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
import { getRightMenu, requestLogin } from '../../api/axiosapi';

import AxiosConfig from '../../common/axiosConfig.js';
import AppConfig from '../../common/appConfig.js'

export default {
    data: function() {
        return {
            logining: false,
            ruleForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        if(document.getElementsByClassName('el-message-box__wrapper')[0] != null ){
            document.getElementsByClassName('el-message-box__wrapper')[0].style.display ='none';
            document.getElementsByClassName('v-modal')[0].style.display ='none';
            window.location.reload();
        }
    },
    methods: {
        getRightMenu(loginName){
            let dataJson = {loginName : loginName , systemCode : AppConfig.systemCode};
            getRightMenu(dataJson).then(result => {
                // 获取权限树
                let { msg, code, data, success } = result;
                if (code == 200) {
                    sessionStorage.setItem("menu", JSON.stringify(data));
                    this.$router.push({ path: '/quality' });
                    console.log(data)
                }
                if (code != 200)
                {
                    sessionStorage.clear();
                    this.$message({
                        message: msg,
                        type: 'error'
                    });
                    return false;
                }
            });
        },
        formatDateTime (inputTime) {
            if (inputTime == undefined) {
                return "";
            }
            var date = new Date(inputTime);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d +' ' + h +':' + minute + ':' +second;
        },
        submitForm(formName) {
            const self = this;
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    self.logining = true;

                    // console.log( self.ruleForm.username)
                    // console.log(  self.ruleForm.password)
                    var loginParams = { loginName: self.ruleForm.username, password: self.ruleForm.password, appId: AppConfig.appId, appSecret: AppConfig.appSecret };
                    requestLogin(loginParams).then(result => {
                        self.logining = false;

                        let { msg, code, data } = result;
                        if (code !== 200) {
                            this.$message({
                               message: msg,
                                type: 'error'
                            });
                            return false;
                        } else {
                            sessionStorage.setItem('access-user', self.ruleForm.username);
                            sessionStorage.setItem('access-authorization', 'Bearer ' + data);
                            console.log(data);
                            //self.$axiosConfig.headers.Authorization = 'Bearer ' + data;
                            //self.$router.push({ path: '/readme' });
                            self.getRightMenu(self.ruleForm.username);
                        }
                    });


                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
}

.ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    margin: -150px 0 0 -146px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
}
</style>