<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <span class="-produce ventorImg" style="margin-right:3px;"></span>领料单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-select v-model="status" @change="getData" placeholder="请选择领料单状态" >
                <el-option
                    v-for="item in typeArr"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="请输入领料单号、领料人搜索" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <!--<el-button type="primary" icon="plus" class="handle-del mr10" @click="addMaterialPicking">新增</el-button>-->
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="number" label="领料单号"></el-table-column>
            <el-table-column prop="preparesNumber" :formatter="formatterPreparesNumber" label="关联已备料单号"></el-table-column>
            <el-table-column prop="orderNumber" :formatter="formatterOrderNumber" label="关联订单号"></el-table-column>
            <el-table-column prop="workNumber" :formatter="formatterWorkNumber" label="工单号"></el-table-column>
            <!--<el-table-column prop="pickTime" label="领料时间"></el-table-column>
            <el-table-column prop="pickingPeople"  label="领料人"></el-table-column>
            <el-table-column prop="purpose" label="用途"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>-->
            <el-table-column prop="type" :formatter="formatterText" label="是否领取"></el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <!-- <el-button size="small" type="success" @click="print(scope.$index, tableData)">打印</el-button> -->
                    <el-button size="small" type="primary" @click="queryDetail(scope.$index, tableData)">详情</el-button>
                    <el-button size="small" v-if="tableData[scope.$index].type ==1" @click="handleEdit(scope.$index, tableData)">领料</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
            </el-pagination>
        </div>
        <!-- 查看详情 -->
        <el-dialog title="领料单详情" size='large' :visible.sync="dialogTableVisible">
            <el-form v-if="1===2" ref="formData" :model="formData">
                <el-form-item label="领料时间">
                    <el-col :span="5">
                        <el-date-picker type="date" readonly format="yyyy-MM-dd" placeholder="领料时间" v-model="formData.pickTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="领料单号">
                    <el-col :span="5">
                        <el-input v-model="formData.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联订单号">
                    <el-col :span="5">
                        <el-input v-model="formData.orderNumber"></el-input>
                    </el-col>
                </el-form-item>
                
                <el-form-item label="领料人">
                    <el-col :span="5">
                        <el-input v-model="formData.pickingPeople" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="工单号">
                    <el-col :span="5">
                        <el-input v-model="formData.workNumber"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="用途">
                    <el-col :span="5">
                        <el-input v-model="formData.purpose" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-col :span="5">
                        <el-input type="textarea" v-model="formData.remark" readonly></el-input>
                    </el-col>
                </el-form-item>
                
            </el-form>
            <el-table :data="pickMaterialDetailTableData" style="width: 100%">
                <el-table-column prop="productName" label="物料名称">
                </el-table-column>
                <el-table-column prop="productNumber" label="物料编号">
                </el-table-column>
                <el-table-column prop="specification" label="规格">
                </el-table-column>
                <el-table-column prop="planQuantity" label="计划领用数量">
                </el-table-column>
                <el-table-column prop="quantity" label="领用数量">
                </el-table-column>
                <!--<el-table-column prop="hasQuantity" label="已领用数量">
                </el-table-column>-->
                <el-table-column prop="unitName" label="单位">
                </el-table-column>
                <el-table-column prop="repertoryName" label="所在仓库">
                </el-table-column>
                <el-table-column prop="regionName" label="所在库位">
                </el-table-column>
                <el-table-column prop="repertoryDetailQuantity" label="剩余库存">
                </el-table-column>
                <el-table-column prop="purpose" label="用途">
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import {
    findPickMaterialsByPage,
    deleteMaterialPickingById,
    findPickMaterialsDetailsByOrderId
} from '../../../api/axiosMaterialPickingApi';
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
                pickTime: '',//领料时间
                number: '',//领料单号
                purpose: '',//用途
                remark: '',//备注
                pickingPeople: '',//领料人
                verifier: '',//审核人
                orderNumber:'',//关联订单号
                workNumber:'',//工单号
            },
            pickMaterialDetailTableData: [],//领料详情数组
            status:'',
            typeArr:[
                {
                    name:"全部",
                    value:""
                },
                {
                    name:"已领料订单",
                    value:"0"
                },
                {
                    name:"待领料订单",
                    value:"1"
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
            var params = { 'currentPage': _this.cur_page, 'keyWords': _this.select_word,'type':_this.status };
            findPickMaterialsByPage(params).then(res => {
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
                name: 'editMaterialPicking',
                query: {
                    materialPickingId: data[index].id,
                    preparesNumber: data[index].preparesNumber
                }
            });
        },
        
        //查看详情
        queryDetail(index, data) {
            var _this = this;
            _this.dialogTableVisible = true;
            var params = { 'id': data[index].id };

            findPickMaterialsDetailsByOrderId(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    //_this.formData = data.pickMaterials;
                    _this.pickMaterialDetailTableData = data.list;
                } else if (code == 500) {
                    _this.$message.error("系统异常!");
                } else if (code == 400) {
                    _this.$message.warning("参数不合法!");
                }
            });

        },
        //去新增领料单
        addMaterialPicking() {
            this.$router.push({ name: 'addMaterialPicking' });
        },
        formatterText(row,column){
            if(row.type== undefined || row.type==''){
                return '';
            }else if(row.type == 0){
                return '已领料';
            }else if(row.type == 1){
                return '待领料';
            }
        },
        formatterPreparesNumber(row,column){
            if(row.preparesNumber==''){
                return '无';
            }
            return row.preparesNumber;
        },
        formatterOrderNumber(row,column){
            if(row.orderNumber=='' || row.orderNumber == undefined){
                return '无';
            }
            return row.orderNumber;
        },
        formatterWorkNumber(row,column){
            if(row.workNumber=='' || row.workNumber == undefined){
                return '无';
            }
            return row.workNumber;
        },
        print(index,data){
            let url = '172.16.3.6:8075/WebReport/ReportServer?reportlet=wms_pick_material.cpt&id='+data[index].id;
            window.open(url);
        }
    }
}
</script>

<style scoped>
.el-form-item__content {
    /* line-height: 36px; */
    position: relative;
    font-size: 14px;
}
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