<template>
    <div class="table">

        <div class="crumbs">
            <el-breadcrumb >
                <span class="manage ventorImg"></span> 箱单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="请输入流水号或条码" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="addBox">新增</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable" v-loading="fullscreenLoading" element-loading-text="打印中">
            <el-table-column prop="serialNumber" label="流水号">
            </el-table-column>
            <el-table-column prop="boxDate" label="日期">
            </el-table-column>
            <el-table-column prop="postalOrder" label="P.O.">
            </el-table-column>
            <el-table-column prop="barCode" label="条码">
            </el-table-column>
            <el-table-column prop="weight" :formatter="formatterWeightUnit" label="重量">
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column label="操作" width="260">
                <template scope="scope">
                    
                    <el-button size="small" type="primary" @click="print(scope.$index, tableData)" >打印二维码</el-button>
                    <!-- <el-button size="small" type="primary" @click="printQrcode(scope.$index, tableData)" >打印二维码</el-button> -->
                    <el-button size="small" type="primary" @click="queryDetail(scope.$index, tableData)" >详情</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, tableData)" icon="edit">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
            </el-pagination>
        </div>
          
        <!-- 查看详情 -->
        <el-dialog title="箱单详情" size='large' :visible.sync="dialogTableVisible">
            <el-form ref="formData" :model="form">
                <el-form-item label="流水号">
                    <el-col :span="5">
                        <el-input v-model="form.serialNumber" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="日期">
                    <el-col :span="5">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.boxDate" style="width: 100%;" readonly></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="P.O.">
                    <el-col :span="5">
                        <el-input v-model="form.postalOrder" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="条码">
                    <el-col :span="5">
                        <el-input v-model="form.barCode" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="重量">
                    <el-col :span="5">
                        <el-input v-model="form.weight" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-col :span="5">
                        <el-input v-model="form.remark" readonly></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-table :data="boxDetailList" style="width: 100%">
                <el-table-column prop="name" label="物料名称">
                </el-table-column>
                <el-table-column prop="number" label="物料编号">
                </el-table-column>
                <el-table-column prop="specification" label="规格">
                </el-table-column>
                <el-table-column prop="quantity" label="数量">
                </el-table-column>
                <el-table-column prop="unitName" label="单位">
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import {
    findBoxListByPage,//查询箱单列表
    findBoxDetailById,//根据箱单id查看详情
    printBoxQrcode,//打印箱单二维码
} from '../../api/axiosapi';
import commonUtil from '../../common/commonUtil';


export default {
    data() {
        return {
            form: {
                id: '',
                serialNumber: '',//流水号
                postalOrder: '', //箱单P.O.
                boxDate: '', //箱单日期
                barCode: '', //条形码
                weight: '',  //重量
                remark: '' //备注
            },
            tableData: [],
            cur_page: 1,
            select_word: '',
            total_size: 0,
            dialogTableVisible: false,
            boxDetailList: [],//箱单详情
            fullscreenLoading:false,
            qrcodeContent:'testets5354',//二维码内容
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
            findBoxListByPage(params).then(res => {
                let { code, msg, data } = res;
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
        //拼接重量单位
        formatterWeightUnit(row, column, cellValue) {
            if(row.unitName == undefined || row.unitName ==''){
                return row.weight + " kg";
            }
            return row.weight + " " + row.unitName;
        },
        //查看详情
        queryDetail(index, data) {
            var _this = this;

            var params = { 'id': data[index].id };

            findBoxDetailById(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.dialogTableVisible = true;
                    _this.form = data.boxListInfoVo;
                    var productInfo = new Object();
                    productInfo.name = data.boxListInfoVo.name;
                    productInfo.number = data.boxListInfoVo.number;
                    productInfo.specification = data.boxListInfoVo.specification;
                    productInfo.quantity = data.boxListInfoVo.quantity;
                    productInfo.unitName = data.boxListInfoVo.productUnitName;
                    _this.boxDetailList = [];
                    _this.boxDetailList.push(productInfo);
                } else if (code == 500) {
                    _this.$message.error("系统异常!");
                } else if (code == 400) {
                    _this.$message.warning("参数不合法!");
                } else if (code == 14000) {
                    _this.boxDetailList = [];
                    _this.dialogTableVisible = false;
                    _this.$message.warning("当前箱单没有详情!");
                }
            });
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
        print(index,data){
            let params = {'barCode':data[index].barCode};
            this.$router.push(
                { 
                    path: '/print',
                    query: {
                        barCode: data[index].barCode,
                        type:'box',
                    }
                }
            );
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