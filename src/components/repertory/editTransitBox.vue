<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/box'}">
                    <i class="el-icon-menu"></i> 中转箱二维码管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑中转箱</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px" style="width:1000px;">
                <el-form-item prop="serialNumber" label="流水号">
                    <el-input v-model="form.serialNumber" readonly></el-input>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker type="date" :editable="false" placeholder="选择日期" v-model="form.boxDate" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item prop="barCode" label="条码">
                    <el-input v-model="form.barCode" readonly></el-input>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class='buttons'>
            <el-button @click="toBox">返回</el-button>
            <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        </div>
    </div>
</template>
<script>
import {
    findProductInfo,//弹窗商品列表
    editBoxInfo,//确定保存箱单
    findBoxDetailById,//编辑时回显数据
    getTransitBoxInfoById
} from '../../api/axiosapi';
import commonUtil from '../../common/commonUtil';
export default {
    data() {
        return {
            form: {
                id: '',
                serialNumber: '',//流水号
                boxDate: '', //箱单日期
                barCode: '', //条形码
                remark: '' //备注
            },
            rules: {
                serialNumber: [{ required: true, message: '请输入流水号', trigger: 'blur' }],
               // boxDate: [{ required: true, message: '请选择箱单日期', trigger: 'change' }],
                barCode: [{ required: true, message: '请输入条码', trigger: 'blur' }],
                remark: [{ required: false, message: '请输入备注', trigger: 'blur' }]
            },
            total_size: 0,
            cur_page: 1,
        }
    },
    created() {
        this.initBoxInfoAndProductInfo();
    },
    methods: {
        onSubmit(formName) {
            var _this = this;

            _this.$refs[formName].validate(function(valid) {
                if (valid) {
                    var boxListInfo = new Object();
                    boxListInfo.id = _this.form.id;
                    boxListInfo.serialNumber = _this.form.serialNumber;
                    boxListInfo.barCode = _this.form.barCode;
                    if (_this.form.boxDate == undefined || _this.form.boxDate == null) {
                        _this.$message.warning("请选择日期!");
                        return;
                    }
                    boxListInfo.boxDate = commonUtil.formatDateTime(_this.form.boxDate);
                    boxListInfo.remark = _this.form.remark;
                    var params = { 'boxListInfo': boxListInfo };
                    editBoxInfo(params).then(res => {
                        let { code, msg, data } = res;
                        if (code == 200) {
                            _this.$message.success("修改二维码信息成功!");
                            _this.$router.push({ name: 'transitBox' });
                        } else if (code == 500) {
                            _this.$message.error("系统异常,修改二维码信息失败!");
                        } else if (code == 400) {
                            _this.$message.warning("参数错误!");
                        }

                    });
                } else {
                    _this.$message.error('提交失败!');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //回显箱单信息 
        initBoxInfoAndProductInfo() {
            var _this = this;
            var params = { 'id': _this.$route.query.boxId };

            getTransitBoxInfoById(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.form = data.boxListInfoVo;
                } else if (code == 500) {
                    _this.$message.error("系统异常!");
                } else if (code == 400) {
                    _this.$message.warning("参数不合法!");
                } else if (code == 14000) {
                    _this.$message.warning("无数据!");
                    _this.$router.push({ name: 'transitBox' });
                }
            });

        },
        //点击取消去箱单列表页面
        toBox() {
            this.$router.push({ name: 'transitBox' });
        }
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

.table-border {
    width: 100%;
    border-collapse: collapse;
}

td,
th {
    border: 1px solid #bfcbd9;
    color: #48576a;
    text-align: center;
    padding: 8px;
}
.buttons{
    overflow: hidden;
    padding: 1rem 0 ;
}
.buttons>*{
    margin-left:32px;
    float: right;
}
</style>