<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><span class="manage ventorImg"></span> 库位管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="请输入所在仓库、库位编号、负责人搜索" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="addRepertoryRegion">新增</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable" v-loading="fullscreenLoading" element-loading-text="打印中">
            <el-table-column prop="regionNo" label="库位编号">
            </el-table-column>
            <el-table-column prop="repertoryName" label="所在仓库">
            </el-table-column>
            <el-table-column prop="dutyPerson" label="库位负责人">
            </el-table-column>
            <el-table-column prop="name" label="库位区域">
            </el-table-column>
            <el-table-column :formatter="formatterPurpose" prop="purpose" label="用途">
            </el-table-column>
            <el-table-column :formatter="formatterRemark" prop="remark" label="备注">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="printQrcode(scope.$index, scope.row)" >打印二维码</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index,tableData)" icon="edit">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination ">
            <el-pagination @current-change="handleCurrentChange " layout="total,prev, pager, next,jumper " :total="total_size ">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { repertoryRegionList,
         deleteRegionInfoById,
         printRegionQrcode,//打印箱单二维码
         printCodeInfo
} from '../../api/axiosapi';

export default {
    data() {
        return {
            fullscreenLoading: false,//
            tableData: [],
            select_word: '',
            cur_page: 1,
            total_size: 0,
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
        //库位列表
        getData() {
            
            let _this = this;
            var params = { 'currentPage': _this.cur_page, 'keyWords': _this.select_word };
            repertoryRegionList(params).then(res => {
                console.log(res);
                let { code, data, msg } = res;
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
            this.getData();
        },
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        //去编辑页面
        handleEdit(index, data) {
            this.$router.push({
                name: 'editRegion',
                query: {
                    regionId: data[index].id,
                }
            });
        },
        //删除
        handleDelete(index, data) {

            var params = { id: data[index].id };
            var _this = this;
            _this.$confirm('你确定要删除该条仓库信息吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteRegionInfoById(params).then(res => {
                    let { code, msg, data } = res;
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
        //去新增页面
        addRepertoryRegion() {
            this.$router.push({ name: 'addRegion' });
        },
        formatterPurpose(row,column){
            if(row.purpose == ''){
                return '无';
            }
            return row.purpose;
        },
        formatterRemark(row,column){
            if(row.remark == ''){
                return '无';
            }
            return row.remark;
        },
        printQrcode(index,row){
            var params ={
                "barCodeList": [
                        {
                        "barCode": row.regionNo,
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
            //     "regionNo":data[index].regionNo
            //     // ,"barCode":data[index].regionNo,
            //     // "repertoryId":data[index].repertoryId,
            //     // "repertoryName":data[index].repertoryName,
            //     // "regionId":data[index].id,
            //     // "regionName":data[index].name
            // };
            // let params = {'barCode':JSON.stringify(jsonParams)};
            // let _this = this;
            // // _this.fullscreenLoading = true;
            // // printRegionQrcode(params).then(res =>{
            // //     let {code,msg,data} = res;
            // //     _this.fullscreenLoading = false;
            // //     if(code == 200){
            // //         _this.$message.success("打印库位二维码成功!");
            // //     }else{
            // //         _this.$message.error("打印库位二维码异常!");
            // //     }
            // // });
            // this.$router.push(
            //     { 
            //         path: '/printBig',
            //         query: {
            //             // barCode: JSON.stringify(jsonParams),
            //             barCode: data[index].regionNo,
            //             type:'region'
            //         }
            //     }
            // );



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

.handle-input {
    width: 300px;
    display: inline-block;
}
</style>