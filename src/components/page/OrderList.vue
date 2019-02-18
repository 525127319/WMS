<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-menu"></i> 表格</el-breadcrumb-item>
                <el-breadcrumb-item>基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="筛选订单号" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" @click.native="addOrder()" >添加订单</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">

            <el-table-column prop="orderId" label="订单编号" width="180">
            </el-table-column>
            <el-table-column prop="orderDate" label="订单日期">
            </el-table-column>
            <el-table-column prop="customerName" label="客户名称">
            </el-table-column>
            <el-table-column prop="saleName" label="销售员名称">
            </el-table-column>
            <el-table-column prop="totalMoney" label="总金额">
            </el-table-column>
            <el-table-column prop="stockRemovalMoney" label="已出库金额">
            </el-table-column>
            <el-table-column prop="paymentMoney" label="已收款金额">
            </el-table-column>
            <el-table-column prop="noPaymentMoney" label="未支付金额">
            </el-table-column>
            <el-table-column prop="stockRemovalStatus" label="出库状态">
            </el-table-column>
            <el-table-column prop="paymentStatus" label="付款情况">
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="total_size">
            </el-pagination>
        </div>
    </div>
</template>


<script>

import { requestGetOrderInfo } from '../../api/axiosapi';

import { requestDeleteInfo } from '../../api/axiosapi';

export default {
    data() {
        return {
            tableData: [],
            cur_page: 1,
            multipleSelection: [],
            select_cate: '',
            select_word: '',
            del_list: [],
            is_search: false,
            total_size: 0
        }

    },
    created() {
        this.getData();
    },
    methods: {
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        getData() {
            let self = this;
            let dataJson = { "orderId": self.select_word, "cur_page": self.cur_page };
            requestGetOrderInfo(dataJson).then(result => {
                let { msg, code, data } = result;
                if (code !== 200) {
                    this.$message({
                        message: msg,
                        type: 'error'
                    });
                } else {
                    self.tableData = data.list;
                    self.total_size = data.totalsize;
                }

            });
        },
        search() {
            this.getData();
        },
        addOrder(){
            this.$router.push({path:'/addorder'})
        },
        formatter(row, column) {
            return row.address;
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        handleEdit(index, row) {
            this.$message('编辑第' + (index + 1) + '行');
        },
        handleDelete(index, row) {
            this.$confirm('是否删除该条订单记录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let dataJson = { "orderId": row.orderId };
                requestDeleteInfo(dataJson).then(result => {
                    let { msg, code, data } = result;
                    if (code !== 200) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        this.tableData.splice(index, 1);
                        this.getData();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }
                });
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
    }
}
</script>

<style scoped>
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