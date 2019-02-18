<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item>
                    <span class="inventory ventorImg"></span> 库存明细</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="请输入仓库编号、仓库名称、产品名称、产品编号" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search(1)">搜索</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="orderNumber" label="订单号">
            </el-table-column>
            <el-table-column prop="workNumber" :formatter="formatterWorkNumber" label="工单号">
            </el-table-column>
            <el-table-column prop="repertoryNumber" label="仓库编号">
            </el-table-column>
            <el-table-column prop="repertoryName" label="仓库名称">
            </el-table-column>
            <el-table-column prop="regionNumber" label="库位编号">
            </el-table-column>
            <el-table-column prop="regionName" label="库位名称">
            </el-table-column>
            <el-table-column prop="productName" label="产品名称">
            </el-table-column>
            <el-table-column prop="productNumber" label="产品编号">
            </el-table-column>
            <el-table-column :formatter="formatterSpecification" prop="specification" label="规格">
            </el-table-column>
            <el-table-column prop="arrivalQuantity" label="库存数量">
            </el-table-column>
            <el-table-column prop="unitName" label="单位">
            </el-table-column>
            
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {
    findRepertoryDetailByWorkNumber,//工单库存查询列表

} from '../../../api/axiosInventoryQueryApi';
import commonUtil from '../../../common/commonUtil';

export default {
    data() {
        return {
            tableData: [],
            cur_page: 1,
            select_word: '',
            total_size: 0,
        }
    },
    created() {
        this.getData();
    },
    methods: {
        //分页
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        getData() {
            let _this = this;
            var params = { 'currentPage': _this.cur_page, 'keyWords': _this.select_word };
            findRepertoryDetailByWorkNumber(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.tableData = data.list;
                    _this.total_size = data.page.totalRecord;
                } else if (code == 14000) {
                    // _this.$message.warning('无数据');
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
        search() {
            this.getData();
        },
        formatterSpecification(row,column){
            if(row.specification == undefined || row.specification == '' ){
                return "无";
            }
            return row.specification;
        },
        formatterWorkNumber(row,column){
             if(row.workNumber == undefined || row.workNumber == '' ){
                return "无";
            }
            return row.workNumber;
        }
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
    width: 400px;
    display: inline-block;
}
</style>