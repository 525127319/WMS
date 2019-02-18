<template>
    <div>
        <div class="form-box">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{path:'/transport'}">
                        <i class="el-icon-menu"></i> 栈板管理</el-breadcrumb-item>
                    <el-breadcrumb-item>新增栈板</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item prop="transportName" label="栈板名称">
                    <el-input v-model="form.transportName"></el-input>
                </el-form-item>
                <el-form-item prop="transportCreater" label="创建者">
                    <el-input v-model="form.transportCreater"></el-input>
                </el-form-item>
                 <el-form-item prop="transportCoding" label="二维码" >
                        <el-input v-model="form.transportCoding"  ></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                    <el-button @click="goBack">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { addTransportInfo , addTransportInfoByCode} from '../../api/axiosapi';

export default {
    data() {
        return {
            form: {
               transportName:'',
               transportCreater:'',
               transportCoding:''
            }, 
            rules: {
                transportName: [{ required: true, message: '请输入栈板名称', trigger: 'blur' }],
                transportCreater: [{ required: true, message: '请输入创建者', trigger: 'blur' }],
                // transportCoding: [{ required: true, message: '请输入二维码', trigger: 'blur' }]
            },
        }
    },
    created(){
        this.initCode();
    },
    methods: {
        //初始二维码
        initCode(){
            var _this =this;
            var params ={'seqName':"transport"}
            addTransportInfoByCode(params).then(res =>{
                let { msg, code, data } = res;
                if(code == 200){
                    _this.form.transportCoding =res.data.number;
                }else{
                    _this.$message.error(msg);
                } 
            });
        },
        //确定新增栈板
        onSubmit: function(formName) {
            var _this = this;
            _this.$refs[formName].validate(function(valid) {
                if (valid) {
                    var params = _this.form ;
                    addTransportInfo(params).then(res => {
                        let { msg, code, data } = res;
                        if (code == 200) {
                            _this.$message.success('提交成功！');
                            _this.$router.push({ name: "transport" });
                        } else{
                            _this.$message.error(msg);
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }

            })
        },
        //取消,去栈板列表页面
        goBack: function() {
            this.$router.push({ name: 'transport' });
        },
       
    }
}
</script>
<style scoped>
 .el-form-item {
  width: 40%;
} 

.form-box {
  width: 100%;
}

.handle-box {
  margin-bottom: 20px;
}
.buttons {
  overflow: hidden;
  padding: 1rem 0;
}
.buttons > * {
  margin-left: 62px;
  float: left;
}
.el-form{
  overflow: hidden;
}
</style>