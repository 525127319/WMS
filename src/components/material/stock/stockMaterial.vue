<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><span class="-produce ventorImg" style="margin-right:3px;"></span>备料单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-select v-model="status" @change="getData" placeholder="请选择备料单状态" >
                <el-option
                    v-for="item in typeArr"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="请输入备料单号、备料人姓名搜索" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="number" label="备料单号"></el-table-column>
            <el-table-column prop="orderNumber" label="关联订单单号"></el-table-column>
            <el-table-column prop="workNumber" label="工单号"></el-table-column>
            <!-- <el-table-column prop="produceTime" :formatter="formatterDateTime" label="备料时间"></el-table-column>
            <el-table-column prop="preparesMaterialsPeople" label="备料人"></el-table-column> -->
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="type" label="操作" width="200">
                <template scope="scope">
                    <!-- <el-button size="small" type="success" @click="print(scope.$index, tableData)">打印</el-button> -->
                    <el-button size="small" type="primary" @click="queryDetail(scope.$index, tableData)">详情</el-button>
                    <el-button size="small" v-if="scope.row.type !== 'one'"  @click="handleEdit(scope.$index, tableData)" >备料</el-button>
                    <!-- v-if="tableData[scope.$index].type=== 'two'" -->
                    <!-- <el-button size="small"  @click="handleEdit(scope.$index, tableData)" >备料</el-button> -->
                    <!-- <el-button size="small"  @click="handleEdit(scope.$index, tableData)">编辑</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
            </el-pagination>
        </div>
        <!-- 查看详情 -->
        <el-dialog title="备料单详情" size='large' :visible.sync="dialogTableVisible">
            <el-form v-if="1===2" ref="formData"  :model="formData">
                <el-form-item label="备料时间">
                    <el-col :span="5">
                        <el-date-picker type="date" readonly format="yyyy-MM-dd" placeholder="备料时间" v-model="formData.produceTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="备料单号">
                    <el-col :span="5">
                        <el-input v-model="formData.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联订单单号">
                    <el-col :span="5">
                        <el-input v-model="formData.orderNumber" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备料人">
                    <el-col :span="5">
                        <el-input v-model="formData.preparesMaterialsPeople" readonly></el-input>
                    </el-col>
                </el-form-item>
               <el-form-item  label="工单号">
                    <el-col :span="5">
                        <el-input v-model="formData.workNumber" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-col :span="5">
                        <el-input type="textarea" v-model="formData.remark" readonly></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-table :data="stockMaterialDetailTableData" style="width: 100%">
                <el-table-column prop="productName" label="物料名称">
                </el-table-column>
                <el-table-column prop="productNumber" label="物料编号">
                </el-table-column>
                <!-- <el-table-column prop="specification" label="规格"></el-table-column> -->
                <el-table-column prop="requiredQuantity" label="计划备料数量">
                </el-table-column>
                <el-table-column prop="quantity" label="已备料数量">
                </el-table-column>
                <el-table-column prop="unitName" label="单位">
                </el-table-column>
                
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import {
    findStockMaterialsByPage,//查看备料单列表
    findProducePreparesDetailById,//查看备料详情

} from '../../../api/axiosMaterialStockApi';
import commonUtil from '../../../common/commonUtil';
export default {
    data() {
        return {
            tableData: [],
            cur_page: 1,
            select_word: '',
            total_size: 0,
            dialogTableVisible: false,
            formData: {//订单详情form表单
                produceTime: '',//备料时间
                number: '',//备料单号
                orderNumber:'',                
                remark: '',//备注
                preparesMaterialsPeople: '',//备料人
                verifier: '',//审核人
                workNumber:'',//工单号
            },
            stockMaterialDetailTableData: [],//备料详情数组
            status: '',// one 代表已备料订单 1 代表待备料订单
            typeArr:[
                {
                    name:"全部",
                    value:""
                },
                {
                    name:"已备料订单",
                    value:"one"
                },
                {
                    name:"待备料订单",
                    value:"two"
                }
            ],
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
            let _this = this;
            
            var params = { 'currentPage': _this.cur_page, 'keyWords': _this.select_word, 'type': _this.status};

            findStockMaterialsByPage(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    data.list.forEach(function(item) {
                        item.pickTime = commonUtil.formatDateTime(item.pickTime);
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
        search() {
            this.getData();
        },
        handleEdit(index, data) {
            this.$router.push({
                name: 'editMaterialStock',
                query: {
                    materialStockId: data[index].id,
                }
            });
        },

        //查看详情
        queryDetail(index, data) {
            var _this = this;
            var params = { 'id': data[index].id };
            findProducePreparesDetailById(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                _this.dialogTableVisible = true;    
                    _this.formData = data.producePreparesMaterials;
                    _this.stockMaterialDetailTableData = data.productVoList;
                } else if (code == 500) {
                    _this.$message.error("系统异常!");
                } else if (code == 400) {
                    _this.$message.warning("参数不合法!");
                } else if(code == 14000){
                    _this.$message.warning("无数据!");
                }
            });
        },
        //去新增备料单
        addMaterialStock() {
            this.$router.push({ name: 'addMaterialStock' });
        },
        formatterDateTime(row, column, cellValue) {
            if (row.produceTime == undefined) {
                return "";
            }
            return commonUtil.formatDateTime(row.produceTime);
        },

        formatterText(row, cloumn) {
            if (row.preparesMaterialsSource == undefined || row.preparesMaterialsSource == null) {
                return "";
            } else if (row.preparesMaterialsSource == 2) {
                return "本地";
            } else if (row.preparesMaterialsSource == 3) {
                return "生产计划";
            }
        },
        //打印
        print(index,data){
            let url = 'http://192.168.16.58:8075/WebReport/ReportServer?reportlet=wms_stock_material.cpt&id='+data[index].id;
            window.open(url);
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
.el-form-item__content {
    line-height: 34px;
    position: relative;
    font-size: 14px;
}
</style>