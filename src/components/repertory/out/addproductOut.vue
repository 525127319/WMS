<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/purchaseOrder'}">
                    <span class="purchase voterIcon"></span>产品出库</el-breadcrumb-item>
                <el-breadcrumb-item>新增产品出库</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='form-box'>
            <el-form ref="formData" :rules="rules" :model="formData">
                <el-form-item label="出库时间">
                    <el-col :span="10">
                        <el-date-picker :editable="false" type="date" format="yyyy-MM-dd" placeholder="选择出库时间" v-model="formData.outgoingTime"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="出库单号" prop="outNumber">
                    <el-col :span="10">
                        <el-input v-model="formData.outNumber" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="出库人" prop="outgoingPeople">
                    <el-col :span="10">
                        <el-input v-model="formData.outgoingPeople" readonly @click.native="showEnterPersonTable"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联生产订单号" prop="relationOrderNumber">
                    <el-col :span="10">
                        <el-input v-model="formData.relationOrderNumber" @click.native="showDialog"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="客户名称" prop="customerName" v-show="formData.relationOrderNumber">
                    <el-col :span="10">
                        <el-input v-model="formData.customerName" :disabled="true"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="workOrderNumber" label="工单" v-show="formData.relationOrderNumber">
                    <el-col :span="12">
                        <el-select v-model="formData.workOrderNumber" placeholder="请选择工单" style='width:100%'>
                            <el-option v-for="(item,index) in WorkOrderList" :key="index" :label="item.workOrderNum" :value="item.workOrderNum">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
            </el-form>
            <!--新增-->
            <el-dialog title="关联生产订单列表" v-model="addTableVisible">
                <el-input v-model="select_word" placeholder="请输入订单编号" class="handle-input"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-table ref="planOrderTable" :data="planOrderTable" highlight-current-row @row-click="handleCurrentChange" style="width: 100%;margin-top:20px;">
                    <el-table-column property="orderId" label="生产订单编号"></el-table-column>
                    <el-table-column property="orderDate" label="订单日期"></el-table-column>
                    <el-table-column property="customerName" label="客户名称"></el-table-column>
                    <el-table-column property="remark" label="备注"></el-table-column>
                    <el-table-column label="是否选中" width="100">
                    <template scope="scope">
                        <el-icon name="check" v-if="scope.row.isCheck"></el-icon>
                    </template>
                    </el-table-column>
                </el-table>
                <div class="pagination ">
                    <el-pagination @current-change="queryByPage" layout="total,prev, pager, next,jumper " :total="total_size">
                    </el-pagination>
                </div>
            </el-dialog>

            <el-table ref="productList" border :data="productList" highlight-current-row style="width: 100%">
                <el-table-column property="repertoryName" label="出库仓库">
                </el-table-column>
                <el-table-column property="regionName" label="出库库位">
                </el-table-column>
                <el-table-column property="productName" label="物料名称">
                </el-table-column>
                <el-table-column property="quantity" label="库存数量">
                </el-table-column>
                <el-table-column property="outgoingQuantity" label="出库数量">
                    <template scope="scope">
                        <el-input-number v-model="scope.row.outgoingQuantity" :controls="false" size="small" />
                    </template>
                </el-table-column>
                <el-table-column property="totalOutGoingQuantity" label="已出库数量">
                </el-table-column>
                <el-table-column property="barCode" label="二维码">
                </el-table-column>
            </el-table>
        </div>
        <div class='buttons'>
            <el-button @click="goBack();">返回</el-button>
            <el-button type="primary" @click="onSubmit('formData','submit')">保存并提交</el-button>
        </div>
        <user-info-com v-show="userInfoVisible" @user-info="displayEnterPersonName"></user-info-com>
    </div>
</template>

<script>
    import {
        getCodeBySeqName,
        findOrderForProduction, //关系生产订单号
        findWorkOrderInfo, //查询工单列表
        initRepertoryList,
        getRegionListByRepertoryId,
        getInitiateRequest, //查询列表
        getAddPurchaseOrder,
        // initPurchaseOrderNumber,
        // getPurchaseOrderProductByCode,
        // initNumber,
        // findRepertoryQuality, //查询质检单列表
        // findRepertoryQualityDetail, //查询质检单物料质检状态
        // findProductInfo, //查询所有产品
        // findMaterialByProductCode, //根据产品编号查询产品下的物料信息
        // findCustomerInfo, //查看所有客户列表
        // findBarCode, //查看二维码
        // checkIfNeedInint, //查寻二维码是否需要初始化
        // InitializationBarCode //初始化二维码
    } from "../../../api/axiosProductOutApi";
    import commonUtil from "../../../common/commonUtil.js";
    import userInfoCom from "../../page/start";
    //import getCodeBySeqName from "../../../api/axiosapi.js";
    export default {
        components: {
            userInfoCom
        },
        data: function () {
            return {
                formData: {
                    outgoingTime: new Date(), //出库时间
                    outNumber: "", //出库单号
                    customerName: "", //客户名称
                    outgoingPeople: sessionStorage.getItem("currentLoginUser"), //出库人
                    workOrderNumber:'',
                },
                rules: {
                    outNumber: [{
                        required: true,
                        message: "请输出出库单号",
                        trigger: "blur"
                    }],
                    relationOrderNumber: [{
                        required: true,
                        message: "请选择关联采购订单号",
                        trigger: "change"
                    }],
                    outgoingPeople: [{
                        required: true,
                        message: "请选择出库人",
                        trigger: "change"
                    }],
                    workOrderNumber: [{
                        required: true,
                        message: "请选择工单",
                        trigger: "blur"
                    }],
                },
                productList: [],
                addTableVisible: false,
                cur_page: 1,
                select_word: "",
                WorkOrderList: [], //工单列表
                repertoryList: [],
                regionList: [],
                planOrderTable: [],
                total_size: 0,
                userInfoVisible: false, //显示入库人弹框
                repertoryId: '',
                resarr: [] //
            };
        },
        created() {
            this.initNumber();
            // 初始化所有的仓库   
            this.initRepertoryList();
        },
        methods: {
            // 返回
            goBack() {
                this.$router.push({
                    name: 'productOut'
                });
            },
            //初始化序列号
            initNumber() {
                var _this = this;
                let dataJson = '';
                if (_this.chooseType == undefined) {
                    dataJson = {
                        "seqName": 'purchase'
                    };
                } else {
                    dataJson = {
                        "seqName": _this.chooseType
                    };
                }
                getCodeBySeqName(dataJson).then(res => {
                    let {code,msg,data} = res;
                    if (code == 200) {
                        _this.formData.outNumber = data.number;
                    }
                });
            },
            //展示弹框
            showDialog() {
                this.addTableVisible = true;
                this.findApsAllPlanIdByApsApi();
            },
            //查询关联生产订单列表弹框
            findApsAllPlanIdByApsApi() {
                var _this = this;
                var params = {
                    'cur_page': _this.cur_page,
                    'keyWords': _this.select_word
                };
                findOrderForProduction(params).then(res => {
                    let {code,msg,data} = res;
                    if (code == 200) {
                        for (let item of data) {
                            if (_this.formData.relationOrderNumber == item.orderId) {
                                item.isCheck = true;
                            } else {
                                item.isCheck = false;
                            }
                        }
                        _this.planOrderTable = data
                        _this.formData.workOrderNumber ="";
                        // _this.planOrderTable = data.list;
                        // _this.total_size = data.totalsize;
                    } else {
                        _this.planOrderTable = [];
                        _this.total_size = 0;
                        _this.$message.warning(msg);
                    }
                })
            },
            // 搜索
            search() {
                this.findApsAllPlanIdByApsApi();
            },
            //搜索订单
            queryByPage(val) {
                this.cur_page = val;
                this.findApsAllPlanIdByApsApi();
            },
            //点击选中
            handleCurrentChange(val) {
                if (val.isCheck) {
                    val.isCheck = false;
                    this.formData.relationOrderNumber = '';
                    var index = this.productList.indexOf(val);
                    this.productList.splice(index, 1);
                } else {
                    val.isCheck = true;
                    this.formData.relationOrderNumber = val.orderId;
                    this.formData.customerName = val.customerName;
                    this.addTableVisible = false;
                    // 发起请求工单列表
                    this.getFindWorkOrderInfo(val)
                }
            },

            // 发起请求工单列表
            getFindWorkOrderInfo(val) {
                let params = {
                    'orderNum': val.orderId
                };
                findWorkOrderInfo(params).then(res => {
                    let {code,msg,data,success} = res;
                    if (success) {
                        this.WorkOrderList = data.workOrderList;
                    } else {
                        this.$message.error(msg);
                    }
                })
            },
            //初始化所有仓库下拉框
            initRepertoryList() {
                var _this = this;
                initRepertoryList({}).then(res => {
                    let {code,msg,data} = res;
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
                    'id': repertoryId
                };
                var _this = this;
                getRegionListByRepertoryId(params).then(res => {
                    let {code,msg,data} = res;
                    if (code == 200) {
                        _this.regionList = data;
                    } else if (code == 14000) {
                        _this.regionList = [];
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    }
                });
            },

            //显示入库人选择表
            showEnterPersonTable() {
                this.userInfoVisible = !this.userInfoVisible;
            },

            displayEnterPersonName(param) {
                if (param.length == 0) {
                    this.formData.outgoingPeople = "";
                } else {
                    this.formData.outgoingPeople = param[0].realName;
                }
            },
            //确定保存
            onSubmit(formName, type) {
                var _this = this;
                _this.$refs[formName].validate(function (valid) {
                    if (valid) {
                        if (_this.formData.outgoingTime == undefined || _this.formData.outgoingTime == "") {
                            _this.$message.warning("请选择出库时间!");
                            return;
                        }
                        _this.formData.outgoingTime = commonUtil.formatDateTime(_this.formData.outgoingTime);
                        _this.formData.type = type;
                        var params = {
                            'productionInStorageInfo': _this.formData,
                            'stockByOrderAndWorkOrderList': _this.productList
                        };

                        if (_this.productList == null || _this.productList.length == 0) {
                            if (_this.formData.chooseType == 'purchase') {
                                _this.$message.warning("物料明细不能为空,请选择关联采购订单号!");
                                return false;
                            } else if (_this.formData.chooseType == 'customer_provide') {
                                _this.$message.warning("物料明细不能为空,请新增bom清单");
                                return false;
                            }
                        }
                        for (var item of _this.productList) {
                            // _this.resarr.push(item.barCode)
                            // if (_this.resarr.length > Array.from(new Set(_this.resarr)).length) {
                            //     _this.$message.warning('有重复的二维码,请核对并从新选择');
                            //     return;
                            // }
                            if ( item.outgoingQuantity<=0 ) {
                                _this.$message.warning('出库数量必须大于0');
                                return;
                            } else if  (item.outgoingPeople>item.quantity) {
                                _this.$message.warning('出库数量不能大于库存数量');
                                return;
                            }
                        }
                        for (var i = 0; i < _this.productList.length; i++) {
                            var item = _this.productList[i];
                            if (item.productQualityStatus == 'not_quality') {
                                _this.$confirm('该采购订单有未质检的物料,是否确认出库?', '提示', {
                                    cancelButtonText: '取消',
                                    confirmButtonText: '确定',
                                    type: 'warning'
                                }).then(() => {
                                    _this.addPurchaseOrder(params);
                                }).catch(() => {
                                    _this.$message.info('已取消');
                                });
                                return;
                            }
                        }
                        _this.addPurchaseOrder(params);

                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            addPurchaseOrder(params) {
                var _this = this;
                getAddPurchaseOrder(params).then(res => {
                    let {code,msg,data} = res;
                    if (code == 200) {
                        _this.$message.success("新增成功!");
                        _this.$router.push({
                            name: "productOut",
                        });
                    } else if (code == 400) {
                        _this.$message.error("非法参数");
                    } else if (code == 500) {
                        _this.$message.error("系统异常");
                    } else {
                        this.$message.error(msg);
                    }
                });
            },
            InitiateRequest() {
                let params = {
                    // 订单号relationOrderNumber 工单号workOrderNumber
                    // 订单号relatedOrderNumber 工单号workOrderNumber
                    relatedOrderNumber: this.formData.relationOrderNumber,
                    workOrderNumber: this.formData.workOrderNumber
                }
                var _this = this;
                getInitiateRequest(params).then(res => {
                    let {code,msg,data} = res;
                    if (code == 200) {
                        _this.productList = data;
                        // _this.formData.customerName = data[0].customerName;
                    } else {
                        _this.$message.error(msg);
                    }
                });
            }

        },
        watch: {
            "formData.workOrderNumber": {
            handler: function(val, oldVal) {
                if (val) {
                    this.InitiateRequest();
                }
            },
            deep:true
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

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .response {
        position: absolute;
        z-index: 100;
        background-color: white;
        box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.2);
    }

    .response li {
        position: relative;
        height: 32px;
        line-height: 32px;
        padding: 0 8px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        white-space: nowrap;
    }

    .response li:hover {
        background-color: rgba(32, 160, 255, 0.72);
        color: white;
    }

    li {
        list-style: none;
    }

</style>