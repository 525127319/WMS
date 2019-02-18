<template>
    <div>
        <div class="form-box">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{path:'/region'}">
                        <i class="el-icon-menu"></i> 库位管理</el-breadcrumb-item>
                    <el-breadcrumb-item>新增库位</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item prop="regionNo" label="库位编号">
                    <el-col :span="14">
                        <el-input v-model="form.regionNo" @input="form.regionNo=form.regionNo.replace(/[^\w\.\/]/ig,'');"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="repertoryId" label="所在仓库">
                    <el-select v-model="form.repertoryId" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" label="库位区域">
                    <el-col :span="14">

                    <el-input v-model="form.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="dutyPerson" label="库位负责人">
                    <el-col :span="14">
                    <el-input v-model="form.dutyPerson" readonly @click.native="showDutyPersonTable"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="purpose" label="用途">
                    <el-col :span="14">

                    <el-input v-model="form.purpose"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-col :span="14">
                        <el-input v-model="form.remark"></el-input>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                    <el-button @click="toRegion">返回</el-button>
                </el-form-item> -->
            </el-form>
            <user-info-com v-show="userInfoVisible" @user-info="displayDutyPersonName"></user-info-com>
            <div class="buttons">
                <el-button @click="goBack">返回</el-button>
                <el-button type="primary" @click="onSubmit('form')">提交</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { addRegionInfo, selectRepertoryIdAndName, findRegionNo,getCodeBySeqName } from '../../api/axiosapi';
import userInfoCom from '../page/start';
export default {
    components: {
        userInfoCom
    },
    data() {
        return {
            form: {
                regionNo: '',//库位编号
                name: '',//库位区域
                repertoryId: '',//仓库id
                dutyPerson: sessionStorage.getItem("currentLoginUser"),//负责人
                purpose: '',//用途
                remark: ''//备注
            },
            rules: {
                regionNo: [{ required: true, message: '请输入库位编号', trigger: 'blur' }],
                name: [{ required: true, message: '请输入库位区域', trigger: 'blur' }],
                dutyPerson: [{ required: true, message: '请输入责任人姓名', trigger: 'change' }],
                repertoryId: [{ required: true, message: '请选择仓库地址', trigger: 'change' }]
            },
            options: [],
            userInfoVisible: false //库位负责人
        }
    },
    created() {
        this.initSelect();
        this.initRegionNumber();
    },
    methods: {
        //确定新增库位
        onSubmit: function(formName) {
            var _this = this;
            _this.$refs[formName].validate(function(valid) {
                if (valid) {
                    var params = { 'list': _this.form };
                    addRegionInfo(params).then(res => {
                        console.log(res);
                        let { msg, code, data } = res;
                        if (code == 200) {
                            _this.$message.success('提交成功！');
                            _this.$router.push({ name: "region" });
                        } else if (code == 500) {
                            _this.$message.error('系统异常!');
                        }else if(code == -404){
                            _this.$message.error(msg);
                        }else {
                            _this.$message.error(msg);
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }

            })
        },
        //取消,去库位列表页面
        goBack: function() {
            this.$router.push({ name: 'region' });
        },
        //初始化所属仓库下拉框
        initSelect() {
            var _this = this;
            selectRepertoryIdAndName({}).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.options = data;
                    _this.form.repertoryId = data[0].id;
                } else if (code == 500) {
                    _this.$message.error('系统异常!');
                }
            })
        },
        //初始化库位编号
        //初始化序列号
        initRegionNumber() {
            var _this = this;
            let dataJson = {"seqName":"region"};
            getCodeBySeqName(dataJson).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.form.regionNo = data.number;
                } else if (code == 500) {
                    _this.$message.error('系统异常!');
                }
            })
        },
        showDutyPersonTable() {
            //显示仓库负责人选择表
            this.userInfoVisible = !this.userInfoVisible;
        },
        displayDutyPersonName(param) {
            //将选中的仓库负责人填充到表单中
            if (param.length == 0) {
                this.form.dutyPerson = '';
            } else {
                this.form.dutyPerson = param[0].realName;
            }
        },
    }
}
</script>
<style scoped>
.el-form-item {
  float: left;
  width: 50%;
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
  margin-left: 32px;
  float: right;
}
.el-form{
  overflow: hidden;
}
</style>