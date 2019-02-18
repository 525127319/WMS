<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><span class="manage ventorImg"></span> 仓库管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="请输入仓库名称、仓库编号、负责人搜索" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="addRepertory">新增</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable"  v-loading="fullscreenLoading" element-loading-text="打印中">
            <el-table-column prop="name" label="仓库名称">
            </el-table-column>
            <el-table-column prop="repertoryTypeName" label="仓库类型">
            </el-table-column>
            <el-table-column prop="repertoryNo" label="仓库编号">
            </el-table-column>
            <el-table-column prop="address" label="仓库地址">
            </el-table-column>
            <el-table-column prop="dutyPerson" label="仓库负责人">
            </el-table-column>
            <el-table-column prop="purpose" label="用途">
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="print(scope.$index,scope.row)" >打印二维码</el-button>
                    <!-- <el-button size="small" type="primary" @click="printQrcode(scope.$index, tableData)" >打印二维码</el-button> -->
                    <el-button size="small" @click="handleEdit(scope.$index, tableData)" icon="edit">编辑</el-button>
                </template>
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
    repertoryList,
    deleteRepertoryInfoById ,
    printRepertoryQrcode,
    printCodeInfo
    } from '../../api/axiosapi';
export default {
    data() {
        return {
            tableData: [],//仓库列表数组
            cur_page: 1,//当前页
            select_word: '',//搜索关键字
            total_size: 0,//总记录数
            fullscreenLoading:false,
            // barCode:'',
            caseNumber:'',
            operator:'',
            originProductNumber:'',
            printDate:'',
            productName:'',
            productNumber:'',
            qualityNumber:'',
            quantity:'',
        }
    },
    created() {
        this.getData();
    },
    methods: {
        //查询列表页面
        getData() {
            let self = this;
            var params = { 'currentPage': self.cur_page, 'keyWords': self.select_word };
            repertoryList(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    self.tableData = data.list;
                    self.total_size = data.page.totalRecord;
                } else if (code == 14000) {
                    self.tableData = [];
                    self.total_size = 0;
                } else if (code == 500) {
                    self.$message.error("系统异常!");
                } else if (code == 400) {
                    self.$message.warning("参数不合法!");
                }
            });
        },
        //上一页下一页
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        //搜索
        search() {
            this.getData();
        },
        //去编辑页面
        handleEdit(index, data) {
            this.$router.push({
                name: 'editRepertory',
                query: {
                    repertoryId: data[index].id,
                }
            });
        },
        //去新增页面
        addRepertory() {
            this.$router.push({ name: 'addRepertory' });
        },
        handleDelete(index, data) {
            var params = { 'id': data[index].id };
            var _this = this;
            _this.$confirm('你确定要删除该条仓库信息吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteRepertoryInfoById(params).then(res => {
                    let { code, msg, data } = res;
                    if (code == 200) {
                        // console.log('删除成功');
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
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
        // printQrcode(index,data){
        //     let jsonParams = {
        //         "barCode":data[index].repertoryNo,
        //         "repertoryId":data[index].id,
        //         "repertoryName":data[index].name
        //     };
        //     let params = {"barCode":JSON.stringify(jsonParams)};
        //     let _this = this;
        //     _this.fullscreenLoading = true;
        //     printRepertoryQrcode(params).then(res =>{
        //         _this.fullscreenLoading = false;
        //         let {code,msg,data} = res;
        //         if(code == 200){
        //             _this.$message.success("打印仓库二维码成功!");
        //         }else{
        //             _this.$message.error("打印仓库二维码异常!");
        //         }
        //     });
        // },
        print(index,row){
            var params ={
            "barCodeList": [
                    {
                      "barCode": row.repertoryNo,
                      "caseNumber": this.caseNumber,
                      "operator": this.operator,
                      "originProductNumber": this.originProductNumber,
                      "printDate": this.printDate,
                      "productName": this.productName,
                      "productNumber": this.productNumber,
                      "qualityNumber": this.qualityNumber,
                      "quantity": this.quantity
                    }
                ],
                "flag": "code"
              } 
            printCodeInfo(params).then(res =>{
                let { code, msg, data, success } = res;
                if(code ==200){
                    this.$message.success('打印成功'); 
                }else{
                    this.$message.warning(msg);
                }
            })

            // let jsonParams = {
            //     "barCode":data[index].repertoryNo
            //     // ,"repertoryId":data[index].id,
            //     // "repertoryName":data[index].name
            // };
            // this.$router.push(
            //     { 
            //         path: '/printBig',
            //         query: {
            //             // barCode: JSON.stringify(jsonParams),
            //             barCode: data[index].repertoryNo,
            //             type:'repertory'
            //         }
            //     }
            // );
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