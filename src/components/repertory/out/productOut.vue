<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><span class="inventory ventorImg"></span> 产品出库</el-breadcrumb-item>
            </el-breadcrumb>
    </div>
        <div class="handle-box">
            <!-- <el-button type="primary" class="handle-del mr10" @click="addBox">新增</el-button> -->
            <span class="delInput" v-show="select_word" @click.stop="select_word=''">x</span>
            <el-input v-model="select_word" placeholder="请输入出库人或出库单号" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
             <el-button type="primary" icon="plus" class="handle-del mr10" @click="addPurchaseOrder">新增</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="stockOutDate" label="出库时间"></el-table-column>
            <el-table-column prop="number" label="出库单号"></el-table-column>
            <el-table-column prop="relationOrderNumber" label="关联订单号"></el-table-column>
            <!-- <el-table-column prop="workNumber" :formatter="formatterWorkNumber" label="工单号"></el-table-column> -->
            <el-table-column prop="outRepertoryPeople" label="出库人"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="queryDetail(scope.$index, tableData)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
            </el-pagination>
        </div>
        <!-- 查看详情 -->
        <el-dialog title="产品出库详情" size='large' :visible.sync="dialogTableVisible">
            <el-form ref="formData" :model="form">
                <el-form-item label="出库时间">
                    <el-col :span="5">
                        <el-date-picker type="date" readonly :editable="false" format="yyyy-MM-dd" placeholder="选择入库时间" v-model="form.stockOutDate"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="出库单号">
                    <el-col :span="5">
                        <el-input v-model="form.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联订单号">
                    <el-col :span="5">
                        <el-input v-model="form.relationOrderNumber" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="出库人">
                    <el-col :span="5">
                        <el-input v-model="form.outRepertoryPeople" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-col :span="5">
                        <el-input v-model="form.remark" readonly></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-table :data="productDetailList" style="width: 100%">
                <el-table-column prop="name" label="产品名称">
                </el-table-column>
                <el-table-column prop="number" label="产品编号">
                </el-table-column>
                <el-table-column prop="quantity" label="出库数量">
                </el-table-column>
                <el-table-column prop="repertoryName" label="出库仓库">
                </el-table-column>
                <el-table-column prop="regionName" label="出库库位">
                </el-table-column>
                <el-table-column prop="barCode" label="二维码编号">
                </el-table-column>
                <el-table-column prop="repertoryQuantity" label="剩余库存数量">
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import {
    productOutList,//产品出库列表
    findProductOutOfRepertoryById,//查看详情
} from '../../../api/axiosProductOutApi';
import commonUtil from '../../../common/commonUtil';
import getCodeBySeqName from "../../../api/axiosapi.js";


export default {
    data() {
        return {
            form: {
                id: '',
                stockOutDate: '',//出库时间
                number: '', //出库单号
                outRepertoryPeople: '', //出库人
                remark: '', //备注
                orderNumber:'',//关联订单号
                // workNumber:'',//工单号
            },
            tableData: [],
            cur_page: 1,
            select_word: '',
            total_size: 0,
            dialogTableVisible: false,
            productDetailList: [],//出库商品详情

        }
    },
    created() {
        this.getData();
    },
    methods: {
         //去新增产品出库
            addPurchaseOrder() {
                this.$router.push({
                    name: 'addproductOut'
                });
            },
        //分页
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        getData() {
            let _this = this;
            var params = { 'currentPage': _this.cur_page, 'keyWords': _this.select_word };
            productOutList(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    data.list.forEach(function(item) {
                        item.stockOutDate = commonUtil.formatDateTime(item.stockOutDate);
                    });
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
        //去箱单新增页面
        addBox() {
            this.$router.push({ name: 'addBox' });
        },
        //去箱单编辑页面
        handleEdit(index, data) {
            this.$router.push({
                name: 'editBox',
                query: {
                    boxId: data[index].id,
                }
            });
        },
        //搜索
        search() {
            this.getData();
        },
        //查看详情
        queryDetail(index, data) {
            var _this = this;
            var params = { 'id': data[index].id };
            // return;
             _this.dialogTableVisible = true;  
            findProductOutOfRepertoryById(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.form = data.productOutOfRepertoryVo;
                    _this.productDetailList = data.list;
                } else if (code == 500) {
                    _this.$message.error("系统异常!");
                } else if (code == 400) {
                    _this.$message.warning("参数不合法!");
                } else if (code == 14000) {
                    _this.boxDetailList = [];
                    _this.productDetailList = false;
                    _this.$message.warning("当前出库单没有详情!");
                }
            });
        },
        formatterWorkNumber(row, column, cellValue){
            if(row.workNumber == '' || row.workNumber == undefined){
                return '无';
            }
            return row.workNumber;
        },
    }
}
</script>
<style scoped>
.el-form-item {
    float: left;
    width: 50%;
}

.el-col-5 {
    width: 340px;
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