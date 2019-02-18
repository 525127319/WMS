<template>
    <div class="header">
        <!-- <div class="logo"><span class="headerClon inventory2"></span>仓库管理系统(测试)</div> -->
        <div class="logo"><span class="headerClon inventory2"></span>仓库管理系统</div>
        <div class="user-info"> 
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../../static/img/img.jpg"> {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
import { getRealName } from '../../api/axiosapi.js';
export default {
    data() {
        return {
            name: '',
            username: ''
        }
    },
    computed: {
        // username(){
        //     let username = sessionStorage.getItem('access-user');
        //     return username ? username : this.name;
        // }
    },
    created() {
        this.getRealName();
    },
    methods: {
        getRealName() {
            var _this = this;
            getRealName({}).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.username = data.zuulRealName;
                    sessionStorage.setItem('currentLoginUser', data.zuulRealName);
                 }else{
                     _this.$message.warning(MSRangeCollection);
                 }
            });
        },
        // handleCommand(command) {
        //     if (command == 'loginout') {
        //         localStorage.removeItem('ms_username')
        //         this.$router.push('/login');
        //     }
        // },
        handleCommand(command) {
            if(command == 'loginout'){
                if(sessionStorage.getItem("access-type") === 'poto'){
                    sessionStorage.removeItem("access-type");
                    sessionStorage.removeItem("menu");
                    // window.location.href= "http://172.16.4.30:8966/#/index";
                    window.location.href= "http://test.ceway.com.cn:7070/portal/#/index";
                }
                else{
                    sessionStorage.clear();
                    this.$router.push('/login');
                }
            }
        }
    }
}
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fff;
}

.header .logo {
    float: left;
    width: 250px;
    text-align: center;
}

.user-info {
    float: right;
    padding-right: 50px;
    font-size: 16px;
    color: #fff;
}

.user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: 50px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
}

.user-info .user-logo {
    position: absolute;
    left: 0;
    top: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.el-dropdown-menu__item {
    text-align: center;
}
</style>
