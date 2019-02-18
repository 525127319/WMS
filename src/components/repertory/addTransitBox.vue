<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/box'}">
                    <i class="el-icon-menu"></i>中转箱二维码管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增中转箱</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px" style="width:1000px;">
                <el-form-item prop="id" v-if="1===2" label="ID">
                    <el-input v-model="form.id" readonly></el-input>
                </el-form-item>
                <el-form-item prop="serialNumber" label="流水号">
                    <el-input v-model="form.serialNumber" readonly></el-input>
                </el-form-item>

                <el-form-item prop="barCode" label="条码">
                    <el-input v-model="form.barCode" readonly></el-input>
                </el-form-item>
                <el-form-item prop="boxDate" label="日期">
                    <el-date-picker type="date" :editable="false" placeholder="选择日期" v-model="form.boxDate" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item prop="disposable" label="是否一次性">
                    <el-select v-model="form.disposable" placeholder="请选择是否为一次性">
                        <el-option v-for="item in posableList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
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
        findCode, //条码
        findSerialNumber, //流水号
        findProductInfo, //弹窗商品列表
        addBoxInfo, //确定保存箱单
        addTransitBoxInfo,
        getBarCode,
        getCodeBySeqName
    } from '../../api/axiosapi';
    import commonUtil from '../../common/commonUtil';
    export default {
        data() {
            return {
                form: {
                    id: '',
                    serialNumber: '', //流水号
                    boxDate: new Date(), //箱单日期
                    barCode: '', //条形码
                    remark: '', //备注
                    disposable: ''
                },
                posableList: [{
                        'name': '是',
                        'id': 'yes'
                    },
                    {
                        'name': '否',
                        'id': 'no'
                    }
                ],
                rules: {
                    // serialNumber: [{ required: true, message: '请输入流水号', trigger: 'blur' }],
                    boxDate: [{
                        type: 'date',
                        required: true,
                        message: '请选择日期',
                        trigger: 'blur'
                    }],
                    disposable: [{
                        required: true,
                        message: '选择二维码是否为一次性',
                        trigger: 'blur'
                    }],
                    // remark: [{ required: false, message: '请输入备注', trigger: 'blur' }]
                },
                cur_page: 1,
            }
        },
        created() {
            this.initSerialNumber();
        },
        methods: {
            onSubmit(formName) {
                var _this = this;
                // _this.formData.stockInDate = commonUtil.formatDateTime(_this.formData.stockInDate);
                _this.$refs[formName].validate(function (valid) {
                    if (valid) {
                        var boxListInfo = new Object();
                        boxListInfo.id = _this.form.id;
                        boxListInfo.serialNumber = _this.form.serialNumber;
                        boxListInfo.barCode = _this.form.barCode;
                        boxListInfo.disposable = _this.form.disposable;
                        if (_this.form.boxDate == undefined || _this.form.boxDate == null) {
                            _this.$message.warning("请选择日期!");
                            return;
                        }
                        boxListInfo.boxDate = commonUtil.formatDateTime(_this.form.boxDate);
                        boxListInfo.remark = _this.form.remark;
                        var params = {
                            'boxListInfo': boxListInfo
                        };
                        console.log(params)
                        addTransitBoxInfo(params).then(res => {
                            let {
                                code,
                                msg,
                                data
                            } = res;
                            if (code == 200) {
                                _this.$message.success("新增二维码信息成功!");
                                _this.$router.push({
                                    name: 'transitBox'
                                });
                            } else if (code == 500) {
                                _this.$message.error("系统异常,新增二维码信息失败!");
                            } else if (code == 400) {
                                _this.$message.warning("参数错误!");
                            }
                        });
                    } else {
                        _this.$message.error('请填写必填项!');
                        return false;
                    }

                })
            },
            //点击取消去箱单列表页面
            toBox() {
                this.$router.push({
                    name: 'transitBox'
                });
            },
            //从物料明细表中删除物料明细
            deleteProduct(index, row) {
                row.isCheck = false;
            },
            //初始化流水号
            //初始化序列号
            initSerialNumber() {
                var _this = this;
                let dataJson = {
                    "seqName": "transit_box"
                };
                getCodeBySeqName(dataJson).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        _this.form.id = data.id;
                        _this.form.serialNumber = data.number;
                    }
                });

                dataJson = {
                    "seqName": "bar_code"
                };
                getCodeBySeqName(dataJson).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        _this.form.barCode = data.number;
                    }
                })
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

    .buttons {
        overflow: hidden;
        padding: 1rem 0;
    }

    .buttons>* {
        margin-left: 32px;
        float: right;
    }

</style>
