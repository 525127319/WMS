<template>
    <div class="table">

        <div class="crumbs">
            <el-breadcrumb >
                <el-breadcrumb-item><span class="manage ventorImg"></span>中转箱二维码管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="请输入流水号或二维码" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="addBox">新增</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable" v-loading="fullscreenLoading" element-loading-text="打印中">
            <el-table-column prop="id" v-if="1===2" label="ID">
            </el-table-column>
            <el-table-column prop="serialNumber" label="流水号">
            </el-table-column>
            <el-table-column prop="boxDate" label="日期">
            </el-table-column>
            <el-table-column prop="barCode" label="二维码">
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column label="操作" width="260">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="print(scope.$index, scope.row)" >打印二维码</el-button>
                    <!-- <el-button size="small" type="primary" @click="printQrcode(scope.$index, tableData)" >打印二维码</el-button> -->
                    <el-button size="small" v-if="1===2" @click="handleEdit(scope.$index, tableData)" icon="edit">编辑</el-button>
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
    findBoxListByPage,//查询箱单列表
    findBoxDetailById,//根据箱单id查看详情
    printBoxQrcode,//打印箱单二维码
    getTransitBoxList,
    printCodeInfo
} from '../../api/axiosapi';
import commonUtil from '../../common/commonUtil';


export default {
    data() {
        return {
            form: {
                id: '',
                serialNumber: '',//流水号
                boxDate: '', //箱单日期
                barCode: '', //二维码
                weight: '',  //重量
                remark: '' //备注
            },
            tableData: [],
            cur_page: 1,
            select_word: '',
            total_size: 0,
            fullscreenLoading:false,
            qrcodeContent:'testets5354',//二维码内容
            barCode:'',
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
        //分页
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        getData() {
            let _this = this;
            var params = { 'currentPage': _this.cur_page, 'keyWords': _this.select_word };
            getTransitBoxList(params).then(res => {
                let { code, msg, data } = res;
                console.log(res);
                if (code == 200) {
                    data.list.forEach(item=> {
                        item.boxDate = commonUtil.formatDateTime(item.boxDate);
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
        //去箱单新增页面增页面
        addBox() {
            this.$router.push({ name: 'addTransitBox' });
        },
        //去箱单编辑页面
        handleEdit(index, data) {
            this.$router.push({
                name: 'editTransitBox',
                query: {
                    boxId: data[index].id,
                }
            });
        },
        //搜索
        search() {
            this.getData();
        },
        //拼接重量单位
        formatterWeightUnit(row, column, cellValue) {
            if(row.unitName == undefined || row.unitName ==''){
                return row.weight + " kg";
            }
            return row.weight + " " + row.unitName;
        },
        // printQrcode(index,data){
        //     let params = {'barCode':data[index].barCode};
        //     let _this = this;
        //     _this.fullscreenLoading = true;
        //     printBoxQrcode(params).then(res =>{
        //         let {code,msg,data} = res;
        //         _this.fullscreenLoading = false;
        //         if(code == 200){
        //             _this.$message.success("打印箱单二维码成功!");
        //         }else{
        //             _this.$message.error("打印箱单二维码异常!");
        //         }
        //     });
        // },
        print(index,row){
            var params ={
            "barCodeList": [
                    {
                      "barCode": row.barCode,
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
            // let params = {'barCode':data[index].barCode};
            // this.$router.push(
            //     { 
            //         path: '/print', 
            //         query: {
            //             barCode: data[index].barCode,
            //             type:'transitBox',
            //         }
            //     }
            // );
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
    width: 300px;
    display: inline-block;
}
</style>