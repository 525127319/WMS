<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'purchaseOrder'}">
                    <span class="purchase voterIcon"></span>采购订单入库</el-breadcrumb-item>
                <el-breadcrumb-item>编辑采购订单入库</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='form-box'>
            <el-form ref="formData" :rules="rules" :model="formData">
                <!--<el-form-item label="入库时间" prop="stockInDate">
                <el-col :span="10">
                    <el-date-picker type="date" :editable="false" format="yyyy-MM-dd" placeholder="选择入库时间" v-model="formData.stockInDate"></el-date-picker>
                </el-col>
            </el-form-item>-->
                <el-form-item label="单据来源" prop="number">
                    <el-select v-model="formData.chooseType" :disabled="true" placeholder="请选择单据来源">
                        <el-option v-for="item in typeArr" :key="item.value" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入库单号" prop="number">
                    <el-col :span="10">
                        <el-input v-model="formData.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                <!--<el-form-item label="入库仓库" prop="repertoryId">
                 <el-col :span="10">
                    <el-input v-model="formData.repertoryName" readonly></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="入库库位" prop="repertoryRegionId">
                 <el-col :span="10">
                    <el-input v-model="formData.regionName" readonly></el-input>
                </el-col>
            </el-form-item>-->
                <div v-if="isCustomerProvide">
                    <el-form-item label="关联采购订单号" prop="orderNumber">
                        <el-col :span="10">
                            <el-input v-model="formData.orderNumber" readonly></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="关联生产订单号">
                        <el-col :span="10">
                            <el-input v-model="formData.relatedOrderNumber" readonly></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="供应商名称">
                        <el-col :span="10">
                            <el-input v-model="formData.name" readonly></el-input>
                        </el-col>
                    </el-form-item>
                </div>
                <div v-else>
                    <el-form-item label="客供单号">
                        <el-col :span="10">
                            <el-input v-model="formData.customerNumber" placeholder='请输入客供单号'></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="质检单号">
                        <el-col :span="10">
                            <el-input v-model="formData.qualityId" readonly></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="客户名称">
                        <el-col :span="10">
                            <el-input v-model="formData.customerName" placeholder='请选择客户'></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="客户地址">
                        <el-col :span="10">
                            <el-input v-model="formData.customerAddress"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="关联生产订单号">
                        <el-col :span="10">
                            <el-input v-model="formData.relatedOrderNumber"></el-input>
                        </el-col>
                    </el-form-item>
                </div>


                <el-form-item label="入库人" prop="verifier">
                    <el-col :span="10">
                        <el-input v-model="formData.verifier" readonly @click.native="showEnterPersonTable"></el-input>
                        <!-- <el-input v-model="formData.verifier"></el-input> -->
                    </el-col>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-col :span="10">
                        <el-input type="textarea" v-model="formData.remark"></el-input>
                    </el-col>
                </el-form-item>
                <!--新增-->
                <el-dialog title="采购订单列表" v-model="addTableVisible" :close-on-click-modal="false">
                    <el-input v-model="select_word" placeholder="请输入单据号搜索" class="handle-input"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                    <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChange" style="width: 100%">
                        <el-table-column property="planCode" label="单据号">
                        </el-table-column>
                        <el-table-column property="createId" label="申请人">
                        </el-table-column>
                        <el-table-column prop="ventor.ventorName" label="供应商">
                        </el-table-column>
                    </el-table>
                    <div class="pagination ">
                        <el-pagination layout="prev, pager, next " :total="total_size ">
                        </el-pagination>
                    </div>
                    <el-form-item>
                        <el-button type="primary" @click="addTableVisible = false">确定</el-button>
                        <el-button @click="addTableVisible = false">取消</el-button>
                    </el-form-item>
                </el-dialog>
                <el-table ref="productList" border :data="productList" highlight-current-row style="width: 100%">
                    <el-table-column label="入库时间" prop="storageTime" :formatter="formatterStockInDate">
                        <el-col :span="10">
                            <el-date-picker type="date" :editable="false" format="yyyy-MM-dd" placeholder="选择入库时间" v-model="formData.stockInDate"></el-date-picker>
                        </el-col>
                    </el-table-column>
                    <el-table-column property="productName" label="物料名称">
                    </el-table-column>
                    <el-table-column property="productNumber" label="物料编号">
                    </el-table-column>
                    <el-table-column property="barCode" label="二维码">
                    </el-table-column>
                    <el-table-column property="specification" label="物料规格">
                    </el-table-column>
                    <el-table-column property="planQuantity" label="计划采购数量">
                    </el-table-column>
                    <el-table-column property="arrivalQuantity" label="入库数量">
                        <template scope="scope">
                            <el-input-number :controls="false" size="small" v-model="scope.row.arrivalQuantity" />
                        </template>
                    </el-table-column>
                    <el-table-column property="unitName" label="单位">
                    </el-table-column>
                    <el-table-column property="repertoryQuantity" label="已入库数量">
                    </el-table-column>


                    <el-table-column property="repertoryId" label="入库仓库">
                        <template scope="scope">
                            <el-select v-model="scope.row.repertoryId" placeholder="请选择仓库" @change="getRegionListById">
                                <el-option v-for="item in repertoryList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column property="regionId" label="入库库位">
                        <template scope="scope">
                            <el-select v-model="scope.row.regionId" placeholder="请选择库位">
                                <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>


                    <!--<el-table-column label="入库仓库" prop="repertoryId">
                   
                        <el-col :span="10">
                            <el-input v-model="productList.repertoryName" readonly></el-input>
                        </el-col>
                    </el-table-column>
                    <el-table-column label="入库库位" prop="regionId">
                        <el-col :span="10">
                            <el-input v-model="productList.regionName" readonly></el-input>
                        </el-col>
                    </el-table-column>-->
                    <!--<el-table-column property="verifier" label="入库人">
                </el-table-column>-->

                    <el-table-column property="inspectionQuantity" label="质检数量">
                    </el-table-column>
                    <el-table-column property="unqualifiedQuantity" label="不合格数量">
                    </el-table-column>
                    <el-table-column property="defectiveRate" label="不良率">
                    </el-table-column>
                    <el-table-column property="productQualityStatus" :formatter="productQualityStatusStr" label="物料质检状态">
                    </el-table-column>
                </el-table>

            </el-form>
            <user-info-com v-show="userInfoVisible" @user-info="displayEnterPersonName"></user-info-com>
        </div>
        <div class='buttons'>
            <el-button @click="goBack">返回</el-button>
            <el-button type="success" @click="onSubmit('formData','save')">保存为草稿</el-button>
            <el-button type="primary" @click="onSubmit('formData','submit')">保存并提交</el-button>
        </div>
    </div>
</template>
<script>
    import {
        initRepertoryList,
        getRegionListByRepertoryId,
        editPurchaseOrder,
        initPurchaseOrderNumber,
        findPurchaseOrderDetailById,
        getPurchaseOrderProductByCode
    } from '../../../api/axiosPurchaseOrderApi';
    import commonUtil from '../../../common/commonUtil.js';
    import userInfoCom from '../../page/start';
    export default {
        components: {
            userInfoCom
        },
        data: function () {
            return {
                formData: { //订单详情form表单
                    stockInDate: '', //入库日期
                    number: '', //入库单号
                    orderNumber: '', //关联采购订单号
                    relatedOrderNumber: '', //关联生产订单号
                    supplierId: '', //供应商id
                    name: '', //供应商名称
                    repertoryId: '', //仓库名称
                    repertoryName: '',
                    repertoryRegionId: '', //库位名称
                    regionName: '',
                    verifier: '', //入库人
                    remark: '', //备注
                    statusName: '',
                    wayName: '',
                    customerNumber: "", //客供单号
                    chooseType: 'customer_provide', //订单来源(客户提供、采购订单)
                    qualityId: "", //客供质检单号
                },
                rules: {

                    number: [{
                        required: true,
                        message: '请输入入库单号',
                        trigger: 'blur'
                    }],
                    orderNumber: [{
                        required: true,
                        message: '请选择关联采购订单号',
                        trigger: 'blur'
                    }],

                    repertoryId: [{
                        required: true,
                        message: '请选择所在仓库',
                        trigger: 'blur'
                    }],
                    repertoryRegionId: [{
                        required: true,
                        message: '请选择所在库位',
                        trigger: 'blur'
                    }],
                    verifier: [{
                        required: true,
                        message: '请选择入库人',
                        trigger: 'blur'
                    }],
                    remark: [{
                        required: false,
                        message: '请输入备注',
                        trigger: 'blur'
                    }]
                },
                total_size: 10,
                addTableVisible: false,
                productList: [], //选中后的产品列表
                purchaseOrderList: [], //采购订单列表
                productTable: [], //调用接口 
                repertoryList: [], //所有仓库
                regionList: [], //库位
                select_word: '',
                cur_page: 1,
                userInfoVisible: false, //显示入库人弹框
                typeArr: [{
                        name: "客户提供",
                        value: "customer_provide"
                    },
                    {
                        name: "采购系统",
                        value: "purchase"
                    }
                ],
                isCustomerProvide: true,
            }
        },
        created() {
            this.initRepertoryList();
            this.initPurchaseOrder();
        },
        methods: {
            //确定保存
            onSubmit(formName, type) {
                var _this = this;
                _this.$refs[formName].validate(function (valid) {
                    if (valid) {
                      
                        _this.formData.stockInDate = commonUtil.formatDateTime(_this.formData.stockInDate);
                        _this.formData.type = type;
                        var params = {
                            'purchaseOrder': _this.formData,
                            'productArr': _this.productList
                        };
                        console.log(JSON.stringify(params));
                        if (_this.productList.length == 0) {
                            if (_this.formData.chooseType == 'purchase') {
                                _this.$message.warning("物料明细不能为空,请选择关联采购订单号!");
                                return false;
                            } else if (_this.formData.chooseType == 'customer_provide') {
                                _this.$message.warning("物料明细不能为空,请新增bom清单");
                                return false;
                            }
                        }
                        if (_this.formData.chooseType == 'customer_provide') {
                            for (var i = 0; i < _this.productList.length; i++) {
                                var item = _this.productList[i];
                                if (item.arrivalQuantity <= 0) {
                                    _this.$message.warning('入库数量不能小于等于0');
                                    return;
                                }
                            }
                        } else if (_this.formData.chooseType == 'purchase') {
                            for (var i = 0; i < _this.productList.length; i++) {
                                var item = _this.productList[i];
                                if (item.arrivalQuantity < 0) {
                                    _this.$message.warning('入库数量不能小于0');
                                    return;
                                }
                            }
                        }
                        editPurchaseOrder(params).then(res => {
                            let {
                                code,
                                msg,
                                data
                            } = res;
                            if (code == 200) {
                                _this.$message.success("编辑采购订单成功!");
                                _this.$router.push({
                                    name: 'purchaseOrder',
                                    params: {
                                        chooseType: _this.formData.chooseType
                                    }
                                });
                            } else if (code == 400) {
                                _this.$message.error("非法参数");
                            } else if (code == 500) {
                                _this.$message.error("系统异常");
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //点击取消去采购订单列表页
            goBack() {
                let _this = this;
                this.$router.push({
                    name: 'purchaseOrder',
                    params: {
                        chooseType: _this.formData.chooseType
                    }
                });
            },
            handleCurrentChange(val) {
                var _this = this;
                _this.addTableVisible = false;
                _this.formData.orderNumber = val.planCode;
                _this.formData.name = val.ventor.ventorName;
                if (_this.formData.orderNumber != undefined || _this.formData.orderNumber != "") {
                    var params = {
                        'purchaseOrderCode': _this.formData.orderNumber
                    };
                    getPurchaseOrderProductByCode(params).then(res => {
                        let {
                            code,
                            msg,
                            data
                        } = res;
                        if (code == 200) {
                            _this.productList = data;
                        } else if (code == 500) {
                            _this.$message.error("系统异常!");
                        }
                    });
                }
            },
            dateChange() {
                console.log('create' + this.formData.createDate);
                console.log('delivery' + this.formData.deliveryDate);
            },
            showDialog() {
                this.addTableVisible = true;
                this.initPurchaseOrderNumber();
            },
            deleteProduct(index, row) {
                row.isCheck = false;
                this.productList.splice(index, 1);
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
                        this.getRegionListById(data[0].id)
                    } else if (code == 500) {
                        _this.$message.error("系统异常");
                    } else if (code == 14000) {
                        _this.repertoryList = [];
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
                    let {
                        code,
                        msg,
                        data
                    } = res;

                    if (code == 200) {
                        _this.regionList = data;
                        _this.formData.repertoryRegionId = _this.regionList[0].id;
                    } else if (code == 500) {
                        _this.$message.error("系统异常");
                    } else if (code == 14000) {
                        _this.regionList = [];
                    }

                });

            },
            //初始化所有采购订单列表
            initPurchaseOrderNumber() {
                var _this = this;
                var params = {
                    'currentPage': _this.cur_page,
                    'keyWords': _this.select_word
                };
                initPurchaseOrderNumber(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        _this.purchaseOrderList = data.purchaseOrderList;
                    } else if (code == 14000) {
                        _this.total_size = 0;
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    }
                });
            },
            showEnterPersonTable() {
                //显示入库人选择表
                this.userInfoVisible = !this.userInfoVisible;
            },
            displayEnterPersonName(param) {
                if (param.length == 0) {
                    this.formData.verifier = '';
                } else {
                    this.formData.verifier = param[0].realName;
                }
            },
            //搜索产品
            search() {
                this.initPurchaseOrderNumber();
            },
            //编辑时 回显订单以及产品
            initPurchaseOrder() {
                var _this = this;
                if (_this.$route.query.chooseType == 'customer_provide') {
                    _this.isCustomerProvide = false;
                } else if (_this.$route.query.chooseType == 'purchase') {
                    _this.isCustomerProvide = true;
                }
                var params = {
                    'id': _this.$route.query.purchaseOrderId
                };

                findPurchaseOrderDetailById(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        console.log(JSON.stringify(data.purchaseEnterVo))
                        _this.formData = data.purchaseEnterVo;
                        _this.formData.name = data.purchaseEnterVo.supplierName;
                        _this.productList = data.productVoList;
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    }
                });

            },
            productQualityStatusStr(row, column, cellValue) {
                if (row.productQualityStatus == 'not_quality') {
                    return '未质检';
                } else if (row.productQualityStatus == 'has_quality') {
                    return '已质检';
                } else if (row.productQualityStatus == 'part_quality') {
                    return '部分质检';
                }
            },
            //格式化日期
            formatterStockInDate(row, column, cellValue) {
                if (row.storageTime == undefined) {
                    return "";
                }
                return commonUtil.formatDateTime(row.storageTime);
            },
        }
    }

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
