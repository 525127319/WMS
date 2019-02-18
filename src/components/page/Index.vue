<template>
    <div class="login-wrap">
        
    </div>
</template>

<script>
    import {requestLogin, getRightMenu} from '../../api/axiosapi';
    import AxiosConfig from '../../common/axiosConfig.js';
    import AppConfig from '../../common/appConfig.js'

    export default {
        data: function(){
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

            var url = window.location.href;
            var index = url.indexOf('?');
            var endIndex = url.indexOf("&");
            var token = url.substring(index+1, endIndex);
            var username = url.substring(endIndex+1);
            if(token != null && token != "")
            {
                sessionStorage.setItem('access-authorization', 'Bearer ' + token);
                sessionStorage.setItem('access-user', username);
                sessionStorage.setItem('access-type', 'poto');
                this.getRightMenu(username);
            }
        },
        methods: {
            getRightMenu (loginName){
                let self = this;
                var params = {loginName : loginName, systemCode: AppConfig.systemCode};
                getRightMenu(params).then(result => {
                    let { msg, code, data } = result;
                    if(code == 200){
                        sessionStorage.setItem('menu', JSON.stringify(data));
                        this.$router.push({ path: '/purchaseOrder' });
                    }
                    if (code !== 200) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                        sessionStorage.clear();
                        return false;
                    }
                });
            }
        }
    }
</script>