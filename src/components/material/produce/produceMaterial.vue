<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-menu"></i> 生产</el-breadcrumb-item>
                <el-breadcrumb-item>补料单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-col :span="10">
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            </el-col>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" class="handle-del mr10" @click="addProducePicking">新增</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="number" label="补料单号">
            </el-table-column>
            <el-table-column prop="pickTime" label="补料时间">
            </el-table-column>
            <el-table-column prop="repertoryName" label="所在仓库">
            </el-table-column>
            <el-table-column prop="repertoryRegionName" label="所在库位">
            </el-table-column>
            <el-table-column prop="repertoryRegionName" label="成品名称">
            </el-table-column>
            <el-table-column prop="repertoryRegionName" label="规格">
            </el-table-column>
            <el-table-column prop="repertoryRegionName" label="补料数量">
            </el-table-column>
            <el-table-column prop="repertoryRegionName" label="领料人">
            </el-table-column>
            <el-table-column prop="repertoryRegionName" label="审核人">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, tableData)">编辑</el-button>
                    <!-- <el-button size="small" type="danger" @click="handleDelete(scope.$index, tableData)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="total_size">
            </el-pagination>
        </div>
    </div>
</template>
<<script>
export default {
    data(){
        return {
            tableData: [],
            cur_page: 1,
            select_word: '',
            total_size: 0
        }
    },
    created() {
        this.getData();
    },
    methods:{
        getData() {
            let _this = this;

            // var params = { 'currentPage': _this.cur_page, 'keyWords': _this.select_word };
            // materialPickingList(params).then(res => {
            //     let { code, msg, data } = res;
            //     if (code == 200) {
            //         data.list.forEach(function(item) {
            //             item.pickTime = commonUtil.formatDateTime(item.pickTime);
            //         });
            //         _this.tableData = data.list;
            //         _this.total_size = data.page.totalRecord;
                    
            //     } else if (code == 14000) {
            //         _this.tableData = [];
            //         _this.total_size = 0;
            //     } else if (code == 500) {
            //         _this.$message.error("系统异常!");
            //     } else if (code == 400) {
            //         _this.$message.warning("参数不合法!");
            //     }
            // });
        },
        //搜索
        search() {
            this.getData();
        },
        //编辑
        handleEdit(index, data) {
            //this.$message('编辑第' + (index + 1) + '行');

            this.$router.push({
                name: 'editRegion',
                params: {
                    regionId: data[index].id,
                }
            });
        },
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        //新增
        addProducePicking(){},
    }   

}
</script>
