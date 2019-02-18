<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-menu"></i> 生产</el-breadcrumb-item>
                <el-breadcrumb-item>退料单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-col :span="10">
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            </el-col>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" class="handle-del mr10" @click="addReturnMaterial">新增</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="pick_time" label="出库时间">
            </el-table-column>
            <el-table-column prop="number" label="出库单号">
            </el-table-column>
            <el-table-column prop="totalMoney" label="产品名称">
            </el-table-column>
            <el-table-column prop="repertoryName" label="规格">
            </el-table-column>
            <el-table-column prop="regionName" label="数量">
            </el-table-column>
            <el-table-column prop="returnMaterialPerson" label="含税总额">
            </el-table-column>
            <el-table-column prop="returnMaterialPerson" label="客户">
            </el-table-column>
            <el-table-column prop="returnMaterialPerson" label="发货人">
            </el-table-column>
         
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, tableData)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, tableData)">删除</el-button>
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
export default {
    data() {
        return {
            tableData: [
                { pick_time: '2017-08-09', number: '20170809030060', totalMoney: '1000元', repertoryName: '半成品仓库', regionName: 'A区', returnMaterialPerson: '李明波', remark: '备注信息' },
                { pick_time: '2017-12-09', number: '20170809030200', totalMoney: '10001元', repertoryName: '半成品仓库11', regionName: 'A区11', returnMaterialPerson: '李明波11', remark: '备注信息' }
            ],
            cur_page: 1,
            select_word: '',
            total_size: 0
        }
    },
    created() {
        this.getData();
    },
    computed: {

    },
    methods: {
        //新增领料单
        addReturnMaterial() {
            this.$router.push({ name: 'addMaterialReturn' });
        },
        //获取列表数据
        getData() {

        },
        //搜索
        search() {

        },
        handleCurrentChange() {

        },
        handleEdit() {

        },
        handleDelete() {

        },

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
</style>