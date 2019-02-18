<template>
    <div>
        <div class="form-box">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{path:'/repertory'}">
                        <i class="el-icon-menu"></i> 仓库管理</el-breadcrumb-item>
                    <el-breadcrumb-item>新增仓库</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item prop="name" label="仓库名称">
                    <el-col :span="14">
                      <el-input v-model="form.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="repertoryNo" label="仓库编号">
                  <el-col :span="14">
                    <el-input v-model="form.repertoryNo" @input="form.repertoryNo=form.repertoryNo.replace(/[^\w\.\/]/ig,'');" ></el-input>
                        <!--  @blur="findCountRepertoryByNo(form.repertoryNo)" -->
                    </el-col>
                </el-form-item>
                <el-form-item prop="dutyPerson" label="仓库负责人">
                  <el-col :span="14">
                    <el-input v-model="form.dutyPerson" readonly @click.native="showDutyPersonTable"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="address" label="仓库地址">
                  <el-col :span="14">
                    <el-input v-model="form.address"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="repertoryTypeId" label="仓库类型">
                  <el-select v-model="form.repertoryTypeId" width="500px;" placeholder="请选择仓库类型">
                      <el-option v-for="item in typeArr" :key="item.id" :label="item.repertoryTypeName" :value="item.id">
                      </el-option>
                  </el-select>
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
                    <el-button @click="toRepertory">返回</el-button>
                </el-form-item> -->
            </el-form>
            <div class='buttons'>
                <el-button @click="goBack">返回</el-button>
                <el-button type="primary" @click="onSubmit('form')">提交</el-button>
            </div>
            <user-info-com v-show="userInfoVisible" @user-info="displayDutyPersonName"></user-info-com>
        </div>
    </div>
</template>
<script>
import { addRepertoryInfo, findRepertoryNo,findCountRepertoryByNo,getCodeBySeqName,getRepertoryType } from "../../api/axiosapi";
import userInfoCom from "../page/start";
export default {
  components: {
    userInfoCom
  },
  data() {
    return {
      form: {
        name: "", //仓库名称
        dutyPerson: sessionStorage.getItem("currentLoginUser"), //仓库负责人
        repertoryNo: "", //仓库编号
        address: "", //仓库地址
        // repertoryArea: '',
        // isDefault: '',
        purpose: "", //用途
        remark: "", //备注
        repertoryTypeId:''
      },
      typeArr:[],
      rules: {
        name: [
          { required: true, message: "请输入仓库名称,如:原料仓,成品仓", trigger: "blur" }
        ],
        dutyPerson: [
          { required: true, message: "请选择仓库负责人", trigger: "change" }
        ],
        repertoryNo: [{ required: true, message: "请输入仓库编号", trigger: "blur" }],
        address: [{ required: true, message: "请输入仓库地址", trigger: "blur" }],
        purpose: [{ required: false, message: "请输入用途", trigger: "blur" }],
        remark: [{ required: false, message: "请输入备注", trigger: "blur" }],
        repertoryTypeId: [{required: true, message: "请选择仓库类型", trigger: "change"}]
      },
      userInfoVisible: false //显示人事ztree弹框
    };
  },
  created() {
    this.initrepertoryTypeInfo();
    this.initRepertoryNumber();
  },
  methods: {
    onSubmit(formName) {
      var _this = this;
      _this.$refs[formName].validate(function(valid) {
        if (valid) {
          var params = { list: _this.form };
          addRepertoryInfo(params).then(res => {
            let { msg, code, data } = res;
            if (code == 200) {
              _this.$message.success("提交成功！");
              _this.$router.push({ name: "repertory" });
            } else if (code == 400) {
              _this.$message.error(msg);
            }else if(code == -404){
              _this.$message.error(msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    goBack() {
      //点击取消 去仓库列表页面
      this.$router.push({ name: "repertory" });
    },
    showDutyPersonTable() {
      //显示仓库负责人选择表
      this.userInfoVisible = !this.userInfoVisible;
    },
    //初始化序列号
    initRepertoryNumber() {
      var _this = this;
      let dataJson = {"seqName":"repertory"};
      getCodeBySeqName(dataJson).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.form.repertoryNo = data.number;
        } else if (code == 500) {
          _this.$message.error("系统异常!");
        }
      });
    },
    displayDutyPersonName(param) {
      //将选中的仓库负责人填充到表单中
      if (param.length == 0) {
        this.form.dutyPerson = "";
      } else {
        this.form.dutyPerson = param[0].realName;
      }
    },
    initrepertoryTypeInfo(){
        getRepertoryType({}).then(res => {
            let {code, msg, data} = res;
            if (code === 200) {
               this.typeArr = data;
            }
        })
    }
    //失去焦点时,进行校验
    // findCountRepertoryByNo(repertoryNo){
    //   let params = {'repertoryNo':repertoryNo};
    //   console.log(repertoryNo);
      
    //   findCountRepertoryByNo(params).then(res =>{
    //     let {code,msg,data} = res ;
    //     if( code == 200){

    //     }
    //   });
    // }
  }
};
</script>
<style scoped>
.el-form-item {
  float: left;
  width: 50%;
  height: 36px;
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