<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <span class="-produce ventorImg" style="margin-right:3px;"></span>生产入库</el-breadcrumb-item>
<!-- <el-breadcrumb-item>生产入库</el-breadcrumb-item> -->
</el-breadcrumb>
</div>
<div class="handle-box">
    <el-select v-model="status" @change="getData" clearable placeholder="请选择领料单状态">
        <el-option v-for="item in typeArr" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
    </el-select>
    <el-input v-model="select_word" placeholder="请输入入库单号、关联生产订单号搜索" class="handle-input mr10"></el-input>
    <el-button type="primary" icon="search" @click="search">搜索</el-button>
    <el-button type="primary" icon="plus" class="handle-del mr10" @click="addProduceEnter">新增</el-button>
</div>
<el-table :data="tableData" border style="width: 100%" ref="multipleTable">
<el-table-column prop="customerName" label="客户名称"></el-table-column>
<el-table-column prop="productionInStorageCode" label="入库单号"></el-table-column>
<el-table-column prop="relatedOrderNumber" label="关联生产订单号"></el-table-column>
<el-table-column prop="batchNumber" label="生产批号"></el-table-column>
<!--<el-table-column prop="warehousePeople" label="入库人"></el-table-column>-->
<el-table-column label="操作" width="150">
    <template scope="scope">
        <el-button size="small" type="primary" @click="queryDetail(scope.$index, tableData)">详情</el-button>
        <el-button size="small" v-if="tableData[scope.$index].type == 'save'" @click="handleEdit(scope.$index, tableData)">编辑</el-button>
    </template>
</el-table-column>
</el-table>
<div class="pagination">
    <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
    </el-pagination>
</div>
<!-- 查看详情 -->
<el-dialog title="生产入库详情" size='large' :visible.sync="dialogTableVisible">
    <el-form ref="formData" :model="formData">
        <el-form-item label="入库时间">
            <el-col :span="10">
                <el-date-picker type="date" readonly format="yyyy-MM-dd" placeholder="入库时间" v-model="formData.inboundTime" style="width: 100%;"></el-date-picker>
</el-col>
</el-form-item>

<el-form-item label="客户名称">
    <el-col :span="10">
        <el-input v-model="formData.customerName" readonly></el-input>
    </el-col>
</el-form-item>
<el-form-item label="入库单号">
    <el-col :span="10">
        <el-input v-model="formData.productionInStorageCode" readonly></el-input>
    </el-col>
</el-form-item>
<el-form-item label="关联生产订单号">
    <el-col :span="10">
        <el-input v-model="formData.relatedOrderNumber" readonly></el-input>
    </el-col>
</el-form-item>
<el-form-item label="生产批号">
    <el-col :span="10">
        <el-input v-model="formData.batchNumber" readonly></el-input>
    </el-col>
</el-form-item>
<el-form-item label="入库人">
    <el-col :span="10">
        <el-input v-model="formData.warehousePeople" readonly></el-input>
    </el-col>
</el-form-item>

<!-- <el-form-item label="备注">
                    <el-col :span="10">
                        <el-input type="textarea" v-model="formData.remark" readonly></el-input>
                    </el-col>
                </el-form-item> -->
</el-form>
<el-table :data="produceEnterDetailTableData" style="width: 100%">
<el-table-column property="productName" label="产品名称"></el-table-column>
<el-table-column property="productNumber" label="产品编号"></el-table-column>
<el-table-column property="planQuantity" label="计划入库数量"></el-table-column>
<el-table-column property="hasQuantity" label="入库数量"></el-table-column>
<el-table-column property="unitName" label="单位"></el-table-column>
<el-table-column property="hasStorageQuantity" label="已入库数量"></el-table-column>
<el-table-column property="repertoryName" label="所在仓库"></el-table-column>
<el-table-column property="regionName" label="所在库位"></el-table-column>
<el-table-column property="barCode" label="二维码"></el-table-column>

</el-table>
</el-dialog>
</div>
</template>
<script>
    import {
        produceEnterList,//生产入库列表
        queryProduceEnterDetailById,//根据id查看生产入库详情
    } from '../../../api/axiosProduceEnterApi';
    import commonUtil from '../../../common/commonUtil';

    export default {
        data() {
            return {
                tableData: [],
                cur_page: 1,
                select_word: '',
                total_size: 0,
                page_size: 5,
                dialogTableVisible: false,
                formData: {
                    //生产入库信息
                    id: '',//ID
                    inboundTime: '',//入库时间
                    productionInStorageCode: '',//入库单号
                    number: '',//关联生产订单号
                    batchNumber: '',//生产批号
                    repertoryRegionId: '',//库位ID
                    repertoryRegionName: '',//库位名称
                    repertoryId: '',//仓库ID
                    repertoryName: '',//仓库名称
                    warehousePeople: '',//入库人
                    statusName: '',//
                    wayName: '',//
                    // workNumber:'',//工单号
                },
                produceEnterDetailTableData: [],//生产入库产品详情数据
                status: '',// 0 代表已提交生产入库  1代表待提交生产入库 根据类型查看列表
                typeArr: [
                    {
                        name: "全部",
                        value: ""
                    },
                    {
                        name: "已提交生产入库单",
                        value: "0"
                    },
                    {
                        name: "待提交生产入库单",
                        value: "1"
                    }
                ],

            }
        },
        created() {
            this.getData(this.status);
        },
        methods: {
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData(this.status);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.page_size = val;
                this.getData(this.status);
            },
            getData(status) {
                let _this = this;
                if (status == undefined) {
                    status = 0;
                }
                _this.status = status;

                var params = { 'currentPage': _this.cur_page, 'limit': _this.page_size, 'keyWords': _this.select_word, 'type': _this.status };
                produceEnterList(params).then(res => {
                    let { code, msg, data } = res;
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
                this.getData(this.status);
            },
            queryDetail(index, data) {
                var _this = this;
                var params = { 'id': data[index].id, 'batchNumber': data[index].batchNumber };
                // _this.dialogTableVisible = true;
                // return;
                queryProduceEnterDetailById(params).then(res => {
                    let { code, msg, data } = res;
                    if (code == 200) {
                        _this.dialogTableVisible = true;
                        _this.formData = data;
                        _this.produceEnterDetailTableData = data.list;

                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    } else if (code == 14000) {
                        _this.$message.warning("无数据!");
                    }
                });
            },
            handleEdit(index, data) {
                this.$router.push({
                    name: 'editProduceEnter',
                    query: {
                        //生产入库id
                        produceEnterId: data[index].id,
                        //生产批号
                        batchNumber: data[index].batchNumber
                    }
                });
            },
            //去新增生产入库页面
            addProduceEnter() {
                this.$router.push({ name: 'addProduceEnter' });
            },
            //格式化日期
            formatterInboundTime(row, column, cellValue) {
                if (row.inboundTime == undefined) {
                    return "";
                }
                return commonUtil.formatDateTime(row.inboundTime);
            },
            formatterWorkNumber(row, column, cellValue) {
                if (row.workNumber == '' || row.workNumber == undefined) {
                    return '无';
                }
                return row.workNumber;
            },
            productQualityStatusStr(row, column, cellValue) {
                if (row.productQualityStatus == 'not_quality') {
                    return '未质检';
                } else if (row.productQualityStatus == 'has_quality') {
                    return '已质检';
                } else if (row.productQualityStatus == 'part_quality') {
                    return '部分质检';
                }
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