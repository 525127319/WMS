<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/materialReturn'}">
                    <i class="el-icon-date"></i>退料单</el-breadcrumb-item>
                <el-breadcrumb-item>新增退料单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='form-box'>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="退料时间" prop="pickTime">
                    <el-col :span="10">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.pickTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="退料单号" required>
                    <el-col :span="10">
                        <el-input v-model="form.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联订单号" prop="orderId">
                    <el-col :span="10">
                        <el-input v-model="form.orderId" placeholder="请输入关联订单号"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="工单号">
                    <el-col :span="10">
                        <el-input v-model="form.workNumber" placeholder="请输入工单号"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="退料人" prop="returnee">
                    <el-col :span="10">
                        <el-input v-model="form.returnee" readonly @click.native="showZtreeTable(0)"></el-input>
                    </el-col>
                </el-form-item>
                <!-- 显示人事ztree弹框 -->
                <user-info-com v-show="userInfoVisible" @user-info="displayPeopleName"></user-info-com>
                <el-form-item label="收入仓库" prop="repertoryId">
                    <el-col :span="10">
                        <el-select style="width: 100%" v-model="form.repertoryId" placeholder="请选择仓库" @change="getRegionListById">
                            <el-option :span="10" v-for="item in repertoryList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-col :span="10">
                        <el-input type="textarea" v-model="form.remark"></el-input>
                    </el-col>
                </el-form-item>
             </el-form>
                    <el-form-item>
                        <el-button @click.native="showDialog" type="primary">新增退料物料明细</el-button>
                    </el-form-item>

                <el-table ref="returnMaterialList" :data="returnMaterialList" border highlight-current-row style="width: 100%">
                    <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-icon name="minus" @click.native="deleteProduct(scope.$index,returnMaterialList)"></el-icon>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column property="name" label="物料名称"></el-table-column> -->
                    <el-table-column property="productName" label="料名称"></el-table-column>
                    <!-- <el-table-column property="number" label="物料编号"></el-table-column> -->
                    <el-table-column property="productNumber" label="物料编号"></el-table-column>
                    <el-table-column property="specification" label="规格"></el-table-column>
                    <el-table-column property="quantity" label="退料数量" width="150">
                        <template scope="scope">
                            <el-input-number :controls="false" size="small" v-model="scope.row.quantity" />
                        </template>
                    </el-table-column>
                    <el-table-column property="unitName" label="单位"></el-table-column>
                    <el-table-column property="regionId" label="退料库位" width="150">
                        <template scope="scope">
                            <el-select v-model="scope.row.regionId" clearable placeholder="请选择库位">
                                <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="物料列表" size="large" v-model="addTableVisible" :close-on-click-modal="false">
                    <el-col :span="10">
                        <el-input v-model="select_word" placeholder="请输入物料名称或编号" class="handle-input"></el-input>
                    </el-col>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                    <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChange" style="width: 100%">
                        <el-table-column property="name" label="物料名称">
                        </el-table-column>
                        <el-table-column property="number" label="物料编号">
                        </el-table-column>
                        <el-table-column property="specification" label="规格">
                        </el-table-column>
                        <el-table-column property="unitName" label="单位">
                        </el-table-column>
                        <el-table-column property="isCheck" label="是否选中">
                            <template scope="scope">
                                <el-icon name="check" v-if="scope.row.isCheck"></el-icon>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination ">
                        <el-pagination @current-change="queryByPage" layout="total, prev, pager, next,jumper " :total="total_size ">
                        </el-pagination>
                    </div>
                    <div class='buttons'>
                        <el-button type="primary" @click="addTableVisible = false">确定</el-button>
                    </div>
                </el-dialog>
           
        </div>
        <div class="buttons">
            <el-button @click="goBack();">返回</el-button>
            <el-button type="success" @click="onSubmit('form','save')">保存</el-button>
            <el-button type="primary" @click="onSubmit('form','submit')">退料</el-button>
        </div>
    </div>
</template>
<script>
    import {
        initRepertoryList,
        getRegionListByRepertoryId,
        getCodeBySeqName
    } from "../../../api/axiosPurchaseOrderApi";
    import {
        findAddMaterialsNumber,
        addMaterials
    } from "../../../api/axiosMaterialReturnApi";
    import commonUtil from "../../../common/commonUtil.js";
    import userInfoCom from "../../page/start";
    import {
        findProductInfo,
    } from "../../../api/axiosapi";

    export default {
        components: {
            userInfoCom
        },
        data() {
            return {
                form: {
                    pickTime: new Date(), //退料时间
                    repertoryId: "", //仓库ID
                    orderId: "", //关联订单号
                    number: "", //退料单号
                    returnee: sessionStorage.getItem("currentLoginUser"), //退料人
                    remark: "", //备注
                    type: "", // save表示保存 submit表示提交
                    workNumber: "", //工单号
                },
                rules: {
                    pickTime: [{
                        type: 'date',
                        required: true,
                        message: "请选择退料时间",
                        trigger: "blur"
                    }],
                    orderId: [{
                        required: false,
                        message: "请输入关联订单号",
                        trigger: "blur"
                    }],
                    returnee: [{
                        required: true,
                        message: "请选择退货人",
                        trigger: "change"
                    }],
                    repertoryId: [{
                        required: true,
                        message: "请选择仓库",
                        trigger: "change"
                    }],
                },
                repertoryList: [], //仓库下拉列表
                regionList: [], //库位下拉列表
                returnMaterialList: [], //退料物料列表
                userInfoVisible: false,
                select_word: '',
                cur_page: '',
                total_size: 0,
                addTableVisible: false,
                productTable: [], //物料弹框列表

            };
        },
        created() {
            this.initRepertoryList();
            this.findAddMaterialsNumber();
        },
        methods: {
            onSubmit(formName, type) {
                var _this = this;
                _this.$refs[formName].validate(valid => {
                    if (valid) {
                        _this.form.type = type;
                        var longTime = _this.form.pickTime.getTime();
                        _this.form.pickTime = commonUtil.formatDateTime(_this.form.pickTime);
                        if (_this.returnMaterialList.length == 0) {
                            _this.$message.warning('请选择退料物料明细');
                            _this.form.pickTime = new Date(longTime);
                            return;
                        }
                        for (var i = 0; i < _this.returnMaterialList.length; i++) {
                            var item = _this.returnMaterialList[i];
                            if (item.regionId == '' || item.regionId == null) {
                                _this.$message.warning('请对物料名称为【' + item.name + '】的物料选择库位');
                                _this.form.pickTime = new Date(longTime);
                                return;
                            }
                            if (item.quantity <= 0) {
                                _this.$message.warning('物料名称为【' + item.name + '】的退料数量需要大于零');
                                _this.form.pickTime = new Date(longTime);
                                return;
                            }
                        }
                        var params = {
                            'returnMaterial': _this.form,
                            'list': _this.returnMaterialList
                        };
                        console.log(JSON.stringify(params));
                        addMaterials(params).then(res => {
                            let {
                                code,
                                msg,
                                data
                            } = res;
                            if (code == 200) {
                                _this.$message.success('新增退料单成功');
                                _this.$router.push({
                                    name: 'materialReturn'
                                });
                            } else if (code == 500) {
                                _this.form.pickTime = new Date(longTime);
                                _this.$message.error('系统异常！');
                            } else if (code == 400) {
                                _this.form.pickTime = new Date(longTime);
                                _this.$message.warning('非法参数!');
                            }
                        });
                    } else {
                        _this.$message.error("请输入必填项!");
                        return;
                    }

                });
            },
            //自动生成退料单号
            //初始化序列号
            findAddMaterialsNumber() {
                var _this = this;
                let dataJson = {"seqName":"return_materials"};
                getCodeBySeqName(dataJson).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        _this.form.number = data.number;
                    } else if (code == 500) {
                        _this.$message.error('系统异常!');
                    }

                });
            },
            //返回 去退料列表
            goBack() {
                this.$router.push({
                    name: 'materialReturn'
                });
            },
            //初始化所有仓库下拉框
            initRepertoryList() {
                var _this = this;
                initRepertoryList({}).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        _this.repertoryList = data;
                    } else if (code == 14000) {
                        _this.repertoryList = [];
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    }
                });
            },
            //下拉框的值改变时触发,获取所有库位信息
            getRegionListById(repertoryId) {
                var params = {
                    id: repertoryId
                };
                var _this = this;
                getRegionListByRepertoryId(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        _this.regionList = data;
                        if (_this.returnMaterialList != null && _this.returnMaterialList.length > 0) {
                            for (var i = 0; i < _this.returnMaterialList.length; i++) {
                                var item = _this.returnMaterialList[i];
                                item.regionId = _this.regionList[0].id;
                            }
                        }
                    } else if (code == 14000) {
                        _this.regionList = [];
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    }
                });
            },
            //显示弹窗
            showDialog() {
                this.addTableVisible = true;
                this.select_word = '';
                this.queryProductList();
            },
            search() {
                this.queryProductList();
            },
            queryProductList() {
                var _this = this;

                var params = {
                    'currentPage': _this.cur_page,
                    'keyWords': _this.select_word
                };

                findProductInfo(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        //if (_this.returnMaterialList != null && _this.returnMaterialList.length >0) {
                        data.list.forEach(function (item, index) {
                            _this.returnMaterialList.forEach(function (selectedItem, i) {
                                if (selectedItem.number == item.number) {
                                    item.isCheck = true;
                                }
                            });
                            item.regionId = '';
                            item.productName = item.name;
                            item.productNumber = item.number;
                        });
                        //}
                        _this.productTable = data.list;
                        _this.total_size = data.page.totalRecord;
                    } else if (code == 500) {
                        _this.$message.error('系统异常');
                    } else if (code == 400) {
                        _this.$message.error('非法参数');
                    } else if (code == 14000) {
                        _this.productTable = [];
                        _this.total_size = 0;
                    }
                });
            },
            //当某一行被点击时会触发该事件	
            handleCurrentChange(val) {
                if (val.isCheck) {
                    val.isCheck = false;
                    var index = this.returnMaterialList.indexOf(val);
                    this.returnMaterialList.splice(index, 1);
                } else {
                    val.isCheck = true;
                    this.returnMaterialList.push(val);
                }

            },
            deleteProduct(index, row) {
                row.isCheck = false;
                this.returnMaterialList.splice(index, 1);
            },
            //上一页下一页
            queryByPage(val) {
                this.cur_page = val;
                this.queryProductList();
            },
            displayPeopleName(param) {
                if (param.length == 0) {
                    this.form.returnee = "";
                } else {
                    this.form.returnee = param[0].realName;
                }
            },
            showZtreeTable() {
                this.userInfoVisible = !this.userInfoVisible;
            }
        }
    };

</script>
<style scoped>
    .form-box {
        width: 100%;
    }

    .el-form-item {
        float: left;
        width: 50%;
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
