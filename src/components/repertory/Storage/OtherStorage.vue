<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <!-- <el-breadcrumb-item>
                    <i class="el-icon-menu"></i>库存</el-breadcrumb-item> -->
                <el-breadcrumb-item><span class="inventory ventorImg"></span>其他入库</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-select v-model="status" @change="getData" placeholder="请选择备料单状态" >
                <el-option
                    v-for="item in typeArr"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="请输入入库单号、关联生产订单号搜索" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="goAddOtherStorage">新增</el-button>
            <!-- <el-button type="info" class="handle-del mr10" @click="getData('submit')">查看已提交其他入库</el-button>
            <el-button type="warning" class="handle-del mr10" @click="getData('save')">查看待提交其他入库</el-button> -->
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="inboundTime" :formatter="formatterInboundTime" label="入库时间">
            </el-table-column>
            <el-table-column prop="number" label="入库单号">
            </el-table-column>
            <el-table-column :formatter="formatterOrderId" prop="orderId" label="关联生产订单号">
            </el-table-column>
            <el-table-column prop="batchNumber" label="生产批号">
            </el-table-column>
            <!-- <el-table-column prop="repertoryName" label="所在仓库">
            </el-table-column> -->
            <!--<el-table-column prop="statusName" label="质检状态">
            </el-table-column>-->
            <el-table-column prop="warehousePeople" label="入库人">
            </el-table-column>

            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="OtherStorageDetail(scope.$index, tableData)">详情</el-button>
                    <el-button size="small" icon='edit' v-if="tableData[scope.$index].type == 'save'" @click="handleEdit(scope.$index, tableData)">编辑</el-button>
                    <!--<el-button size="small" v-if="tableData[scope.$index].type == 1" @click="handleEdit(scope.$index, tableData)">编辑</el-button>-->
                    <!-- <el-button size="small" :disabled="tableData[scope.$index].type == 0" @click="handleEdit(scope.$index, tableData)" icon="edit">编辑</el-button> -->

                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
            </el-pagination>
        </div>
        <!-- 查看详情 -->
        <el-dialog title="其他入库详情" size='large' :visible.sync="dialogTableVisible">
            <el-form ref="formData" :model="formData">
                <el-form-item label="入库时间">
                    <el-col :span="10">
                        <el-date-picker type="date" readonly format="yyyy-MM-dd" placeholder="入库时间" v-model="formData.inboundTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="入库单号">
                    <el-col :span="10">
                        <el-input v-model="formData.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联生产订单号">
                    <el-col :span="10">
                        <el-input v-model="formData.orderId" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="生产批号">
                    <el-col :span="10">
                        <el-input v-model="formData.batchNumber" readonly></el-input>
                    </el-col>
                </el-form-item>

                <!-- <el-form-item label="所在仓库">
                    <el-col :span="10">
                        <el-input v-model="formData.repertoryName" readonly></el-input>
                    </el-col>
                </el-form-item> -->
                <!--<el-form-item label="质检状态">
                    <el-col :span="10">
                        <el-input v-model="formData.statusName" readonly></el-input>
                    </el-col>
                </el-form-item>-->
                <el-form-item label="入库人">
                    <el-col :span="10">
                        <el-input v-model="formData.warehousePeople" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-col :span="10">
                        <el-input type="textarea" v-model="formData.remark" readonly></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-table :data="produceEnterDetailTableData" style="width: 100%">
                <el-table-column prop="productName" label="产品名称">
                </el-table-column>
                <el-table-column prop="productNumber" label="产品编号">
                </el-table-column>
                <el-table-column property="repertoryName" label="所在仓库">    
                </el-table-column>
                <el-table-column prop="regionName" label="所在库位">
                </el-table-column>
                <el-table-column prop="quantity" label="入库数量">
                </el-table-column>
                <el-table-column prop="unitName" label="单位">
                </el-table-column>
                <el-table-column prop="repertoryQuantity" label="当前库存数量">
                </el-table-column>
                <el-table-column prop="inspectionQuantity" label="质检数量">
                </el-table-column>
                <el-table-column prop="unqualifiedQuantity" label="不良数量">
                </el-table-column>
                <el-table-column prop="defectiveRate" label="不良率">
                </el-table-column>

                <el-table-column prop="statusName" label="质检状态">
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
    import {
        OtherStorageList, //其他入库列表
        OtherStorageDetailById, //根据id查看其他入库详情
    } from '../../../api/axiosInventoryQueryApi.js';
    import commonUtil from '../../../common/commonUtil';

    export default {
        data() {
            return {
                tableData: [],
                currentPage: "1", //默认第一页
                keyWords: " ",
                dialogTableVisible: false,
                //其他入库 单个库存的详情
                formData: {},
                //其他入库产品详情数据
                produceEnterDetailTableData: [],
                // 搜索关键字
                select_word: '',
                cur_page: 1,
                total_size: 0,
                status: '', //
                typeArr:[
                    {
                        name:"全部",
                        value:""
                    },
                    {
                        name:"已提交其他入库订单",
                        value:"submit"
                    },
                    {
                        name:"待提交其他入库订单",
                        value:"save"
                    }
                ],
            }
        },
        created() {
            this.getData(this.status);
        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();

                // this.getData(this.status);
            },
            getData(resStatus) {

                this.status = resStatus || this.status;
                var params = {
                    "currentPage": this.currentPage,
                    "keyWords": this.select_word,
                    "type": this.status
                };

                const _this = this;

                OtherStorageList(params).then(res => {
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

            search() {
                //为空  不发送请求
                // if (this.select_word == "") return;
                this.getData(this.status);
            },
            OtherStorageDetail(index, data) {
                const _this = this;
                // 获取库存id
                var params = {
                    'id': data[index].id,
                };
                _this.dialogTableVisible = true;
                OtherStorageDetailById(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        _this.dialogTableVisible = true;
                        _this.formData = data;
                        _this.produceEnterDetailTableData = data.list;

                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    } else if (code == 14005) {
                        _this.$message.warning("该入库单无详情信息!");
                    }
                });
            },
            // 进入编辑
            handleEdit(index, data) {
                this.$router.push({
                    name: 'editOtherStorage',
                    query: {
                        //生产入库id
                        produceEnterId: data[index].id,
                    }
                });
            },
            //去新增其他入库页面
            goAddOtherStorage() {
                this.$router.push({
                    name: 'addOtherStorage'
                });
            },
            //格式化日期
            formatterInboundTime(row, column, cellValue) {
                if (row.inboundTime == undefined) {
                    return "";
                }
                return commonUtil.formatDateTime(row.inboundTime);
            },
            formatterOrderId(row, column, cellValue){
                 if (row.orderId == '') {
                    return "无";
                }
                return row.orderId;
            }
        }
    }

</script>

<style scoped>
    .el-form-item {
        float: left;
        width: 50%;
    }

    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

</style>
