<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <span class="purchase ventorImg"></span>采购订单入库</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                <el-tab-pane label="采购入库" name="purchase">
                    <div class="handle-box">
                        <el-select v-model="status" @change="getData('purchase')" placeholder="请选择采购订单状态">
                            <el-option v-for="item in typeArr" :key="item.value" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input v-model="select_word" placeholder="请输入入库单号或关联采购订单号搜索" class="handle-input"></el-input>
                        <el-button type="primary" icon="search" @click="search('purchase')">搜索</el-button>
                        <el-button type="primary" icon="plus" class="handle-del mr10" @click="addPurchaseOrder">新增</el-button>
                    </div>
                    <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                        <!--<el-table-column prop="stockInDate" :formatter="formatterStockInDate" label="入库时间">
                        </el-table-column>-->
                        <el-table-column prop="number" label="入库单号">
                        </el-table-column>
                        <el-table-column prop="orderNumber" label="关联采购订单号">
                        </el-table-column>
                        <el-table-column prop="relatedOrderNumber" :formatter="formatterRelatedOrderNumber" label="关联生产订单号">
                        </el-table-column>
                        <!--<el-table-column prop="supplierName" label="供应商名称">
                        </el-table-column>
                        <el-table-column prop="repertoryName" label="所在仓库">
                        </el-table-column>
                        <el-table-column prop="regionName" label="所在库位">-->
                        <!-- </el-table-column> -->
                        <el-table-column prop="verifier" label="入库人">
                        </el-table-column>
                        <el-table-column prop="remark" label="备注">
                        </el-table-column>
                        <el-table-column label="操作" width="180">
                            <template scope="scope">
                                <el-button size="small" type="primary" @click="queryDetail(scope.$index, tableData)">详情</el-button>
                                <el-button size="small" @click="handleEdit(scope.$index, tableData)" v-if="tableData[scope.$index].type =='save'" icon="edit">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="客供入库" name="customer_provide">
                    <div class="handle-box">
                        <el-select v-model="status1" @change="getData('customer_provide')" placeholder="请选择客供订单状态">
                            <el-option v-for="item in typeArr1" :key="item.value" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input v-model="select_word" placeholder="请输入入库单号搜索" class="handle-input"></el-input>
                        <el-button type="primary" icon="search" @click="search('customer_provide')">搜索</el-button>
                        <el-button type="primary" icon="plus" class="handle-del mr10" v-if="1===2" @click="addPurchaseOrder">新增</el-button>
                    </div>
                    <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                        <el-table-column prop="id" v-if="1===2" label="id">
                        </el-table-column>
                        <el-table-column prop="stockInDate" v-if="1===2" :formatter="formatterStockInDate" label="入库时间">
                        </el-table-column>
                        <el-table-column prop="number" label="入库单号">
                        </el-table-column>
                        <el-table-column prop="customerNumber" v-if="1===2" label="客供单号">
                        </el-table-column>
                        <el-table-column prop="qualityNumber" :formatter="formatterQualityId" label="质检单号">
                        </el-table-column>
                        <el-table-column prop="relatedOrderNumber" label="关联订单号">
                        </el-table-column>
                        <el-table-column prop="incomingMaterialNumber" label="来料单号">
                        </el-table-column>
                        <el-table-column prop="batchNumber" label="入库批次号">
                        </el-table-column>
                        <el-table-column prop="repertoryName" v-if="1===2" label="所在仓库">
                        </el-table-column>
                        <el-table-column prop="regionName" v-if="1===2" label="所在库位">
                        </el-table-column>
                        <el-table-column prop="verifier" v-if="1===2" label="入库人">
                        </el-table-column>
                        <el-table-column prop="remark" label="备注">
                        </el-table-column>
                        <el-table-column label="操作" width="180">
                            <template scope="scope">
                                <el-button size="small" type="primary" @click="queryDetail(scope.$index, tableData)">详情</el-button>
                                <el-button size="small" @click="handleEdit(scope.$index, tableData)" v-if="tableData[scope.$index].type =='save'" icon="edit">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="质检入库" name="quality_enter">
                    <div class="handle-box">
                        <el-select v-model="status2" @change="getData('quality_enter')" placeholder="请选择采购订单状态">
                            <el-option v-for="item in typeArr2" :key="item.value" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input v-model="select_word" placeholder="请输入入库单号或关联采购订单号搜索" class="handle-input"></el-input>
                        <el-button type="primary" icon="search" @click="search('quality_enter')">搜索</el-button>
                        <el-button type="primary" icon="plus" class="handle-del mr10" @click="addPurchaseOrder">新增</el-button>
                    </div>
                    <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                        <el-table-column prop="id" v-if="1===2" label="id">
                        </el-table-column>
                        <el-table-column prop="stockInDate" v-if="1===2" :formatter="formatterStockInDate" label="入库时间">
                        </el-table-column>
                        <el-table-column prop="number" label="入库单号">
                        </el-table-column>
                        <el-table-column prop="customerNumber" v-if="1===2" label="客供单号">
                        </el-table-column>
                        <el-table-column prop="qualityNumber" :formatter="formatterQualityId" label="质检单号">
                        </el-table-column>
                        <el-table-column prop="relatedOrderNumber" label="关联订单号">
                        </el-table-column>
                        <el-table-column prop="incomingMaterialNumber" label="来料单号">
                        </el-table-column>
                        <el-table-column prop="batchNumber" label="入库批次号">
                        </el-table-column>
                        <el-table-column prop="repertoryName" v-if="1===2" label="所在仓库">
                        </el-table-column>
                        <el-table-column prop="regionName" v-if="1===2" label="所在库位">
                        </el-table-column>
                        <el-table-column prop="verifier" v-if="1===2" label="入库人">
                        </el-table-column>
                        <el-table-column prop="remark" label="备注">
                        </el-table-column>
                        <el-table-column label="操作" width="180">
                            <template scope="scope">
                                <el-button size="small" type="primary" @click="queryDetail(scope.$index, tableData)">详情</el-button>
                                <el-button size="small" @click="handleEdit(scope.$index, tableData)" v-if="tableData[scope.$index].type =='save'" icon="edit">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 查看详情 -->
        <el-dialog title="采购订单入库详情" size='large' :visible.sync="dialogTableVisible">
            <!--<el-form v-if="1===2" ref="formData" :model="formData">
                <el-form-item label="入库时间">
                    <el-col :span="5">
                        <el-date-picker type="date" readonly format="yyyy-MM-dd" placeholder="选择入库日期" v-model="formData.stockInDate" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="入库单号">
                    <el-col :span="5">
                        <el-input v-model="formData.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="入库仓库">
                    <el-col :span="5">
                        <el-input v-model="formData.repertoryName" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="入库库位">
                    <el-col :span="5">
                        <el-input v-model="formData.regionName" readonly> </el-input>
                    </el-col>
                </el-form-item>
                <div v-if="isCustomerProvide">
                    <el-form-item label="关联采购订单号">
                        <el-col :span="5">
                            <el-input v-model="formData.orderNumber" readonly></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="关联生产订单单号">
                    <el-col :span="10">
                        <el-input v-model="formData.relatedOrderNumber" readonly></el-input>
                    </el-col>
                </el-form-item>
                    <el-form-item label="供应商名称">
                        <el-col :span="5">
                            <el-input v-model="formData.supplierName" readonly></el-input>
                        </el-col>
                    </el-form-item>
                </div>
                <div v-else>
                    <el-form-item label="客供单号">
                        <el-col :span="5">
                            <el-input v-model="formData.customerNumber" readonly></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="质检单号">
                        <el-col :span="5">
                            <el-input v-model="formData.qualityId" readonly></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="客户名称">
                        <el-col :span="5">
                            <el-input v-model="formData.customerName" readonly></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="客户地址">
                        <el-col :span="5">
                            <el-input v-model="formData.customerAddress" readonly></el-input>
                        </el-col>
                    </el-form-item>
                        <el-form-item label="关联生产订单号">
                        <el-col :span="5">
                            <el-input v-model="formData.relatedOrderNumber" readonly></el-input>
                        </el-col>
                    </el-form-item>
                </div>
                
                <el-form-item label="入库人">
                    <el-col :span="5">
                        <el-input v-model="formData.verifier" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-col :span="5">
                        <el-input type="textarea" v-model="formData.remark" readonly></el-input>
                    </el-col>
                </el-form-item>
            </el-form>-->

            <el-table :data="orderDetailTableData" style="width: 100%">
                <el-table-column prop="productNumber" label="物料编号">
                </el-table-column>
                <el-table-column prop="repertoryName" label="仓库名称">
                </el-table-column>
                <el-table-column prop="regionName" label="库位名称">
                </el-table-column>
                <el-table-column prop="barCode" label="二维码">
                </el-table-column>
                <el-table-column prop="planQuantity" label="计划采购数量">
                </el-table-column>
                <el-table-column prop="storageTime"  :formatter="formatterStockInDate"  label="入库时间">
                </el-table-column>

                <!--:formatter="storageTime"-->


                <!--
                <el-table-column prop="name" label="物料名称">
                </el-table-column>-->

                <el-table-column prop="specification" label="物料规格">
                </el-table-column>

                <el-table-column prop="arrivalQuantity" label="入库数量">
                </el-table-column>
                <!--<el-table-column prop="unitName" label="单位">
                </el-table-column>-->
                <el-table-column prop="repertoryQuantity" label="已入库数量">
                </el-table-column>
                <el-table-column property="inspectionQuantity" label="质检数量">
                </el-table-column>
                <el-table-column property="unqualifiedQuantity" label="不合格数量">
                </el-table-column>
                <el-table-column property="defectiveRate" label="不良率">
                </el-table-column>
                <el-table-column property="productQualityStatus" :formatter="productQualityStatusStr" label="物料质检状态">
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
    import {
        purchaseOrderList,
        deletePurchaseOrderById,
        findPurchaseOrderDetailById
    } from '../../../api/axiosPurchaseOrderApi';
    import commonUtil from '../../../common/commonUtil';
    export default {
        data() {
            return {
                tableData: [],
                select_word: '',
                cur_page: 1,
                total_size: 0,
                loading: true,
                dialogTableVisible: false,
                formData: { //订单详情form表单
                    stockInDate: '', //入库日期
                    number: '', //入库编号
                    orderNumber: '', //订单编号
                    relatedOrderNumber: '', //关联生产计划单号
                    regionName: '', //库位名称
                    remark: '', //备注
                    repertoryName: '', //仓库名称
                    supplierName: '', //供应商名称
                    totalAmountIncludingTax: '', //总额
                    verifier: '', //审核人
                    statusName: '',
                    wayName: '',
                    customerName: '', //客户名称
                    customerAddress: '', //客户地址
                },
                orderDetailTableData: [], //订单详情产品
                status: '',
                status1: '',
                status2:'',
                typeArr: [{
                        name: "全部",
                        value: ""
                    },
                    {
                        name: "已入库采购订单",
                        value: "submit"
                    },
                    {
                        name: "待入库采购订单",
                        value: "save"
                    }
                ],
                typeArr1: [{
                        name: "全部",
                        value: ""
                    },
                    {
                        name: "已入库客供订单",
                        value: "submit"
                    },
                    {
                        name: "待入库客供订单",
                        value: "save"
                    }
                ],
                typeArr2: [{
                        name: "全部",
                        value: ""
                    },
                    {
                        name: "已入库客供订单",
                        value: "submit"
                    },
                    {
                        name: "待入库客供订单",
                        value: "save"
                    }
                ],
                activeName2: 'purchase',
                isCustomerProvide: true, //查看详情时是客供入库，还是采购入库  默认为采购入库

            }
        },
        created() {
            let _this = this;
            if (_this.$route.params.chooseType == '' ||  _this.$route.params.chooseType == undefined) {
                 console.log(_this.$route.params.chooseType,1111);
                _this.getData('purchase');
            } else {
                _this.activeName2 = _this.$route.params.chooseType;
                _this.getData(_this.activeName2);
            }
        },
        methods: {
            handleClick(tab, event) {
                this.activeName2 = tab.name;
                this.getData(this.activeName2);
            },
            //采购订单列表
            getData(chooseType) {
                console.log(chooseType,'选择');
                let _this = this;
                var a = '';
                if (chooseType == 'purchase') {
                    a = _this.status;
                    console.log(a,11);
                } else if (chooseType == 'customer_provide') {
                    a = _this.status1;
                    console.log(a,22);
                }else if(chooseType == 'quality_enter'){
                     a = _this.status2;
                     console.log(a,33);                    
                }
                var params = {
                    'currentPage': _this.cur_page,
                    'keyWords': _this.select_word,
                    'type': a,
                    'chooseType': chooseType
                };
                purchaseOrderList(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        _this.tableData = data.list;
                        _this.total_size = data.page.totalRecord;
                    } else if (code == 14000) {
                        _this.tableData = [];
                        _this.total_size = 0;
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    }
                });
            },
            //搜索
            search(chooseType) {
                this.getData(chooseType);
            },
            //去新增采购订单
            addPurchaseOrder() {
                this.$router.push({
                    name: 'addPurchaseOrder'
                });
            },
            //编辑
            handleEdit(index, data) {
                this.$router.push({
                    name: 'editPurchaseOrder',
                    query: {
                        purchaseOrderId: data[index].id,
                        chooseType: data[index].chooseType
                    }
                });

            },
            //查看详情
            queryDetail(index, data) {
                var _this = this;
                _this.dialogTableVisible = true;
                //如果为 客供则显示客供单号
                if (data[index].chooseType == 'customer_provide') {
                    _this.isCustomerProvide = false;
                }
                var params = {
                    'id': data[index].id
                };

                findPurchaseOrderDetailById(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        _this.formData = data;
                        console.log(_this.formData)
                        _this.orderDetailTableData = data.productVoList;
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    } else if (code == 14000) {
                        _this.$message.warning("无数据!");
                    }

                });
            },
            //删除
            handleDelete(index, data) {
                var params = {
                    'id': data[index].id
                };
                var _this = this;
                _this.$confirm('你确定要删除该条订单吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePurchaseOrderById(params).then(res => {
                        let {
                            code,
                            msg,
                            data
                        } = res;
                        if (code == 200) {
                            _this.$message.success('删除成功');
                            _this.getData();
                        } else if (code == 500) {
                            _this.$message.error("系统异常!");
                        } else if (code == 400) {
                            _this.$message.warning("参数不合法!");
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleCurrentChange(val) {
                this.cur_page = val;
                if (this.activeName2 == 'purchase') {
                    this.getData('purchase');
                } else if (this.activeName2 == 'customer_provide') {
                    this.getData('customer_provide');
                }else if(this.activeName2 == 'quality_enter'){
                     this.getData('quality_enter');
                }
            },
            //格式化日期
            formatterStockInDate(row, column, cellValue) {
                if (row.storageTime == undefined) {
                    return "";
                }
                return commonUtil.formatDateTime(row.storageTime);
            },
            //处理金钱
            handleMoney(row, column, cellValue) {
                return "￥" + row.totalAmountIncludingTax;
            },
            formatterText(row, column, cellValue) {
                if (row.outAnInvoice == 1) {
                    return '是';
                } else if (row.outAnInvoice == 0) {
                    return '否';
                }

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
            formatterQualityId(row, column, cellValue) {
                if (row.qualityId == '' || row.qualityId == undefined) {
                    return '无';
                }
                return row.qualityId;
            },
            formatterRelatedOrderNumber(row, column, cellValue) {
                if (row.relatedOrderNumber == '' || row.relatedOrderNumber == undefined) {
                    return '无';
                }
                return row.relatedOrderNumber;
            }

        }
    }

</script>
<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .el-form-item {
        float: left;
        width: 50%;
    }

    .el-col-5 {
        width: 340px;
    }

    .el-table .cell,
    .el-table th>div {
        padding: 0 !important;
        text-align: center;
        box-sizing: border-box;
        text-overflow: ellipsis;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

</style>
