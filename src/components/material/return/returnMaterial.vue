<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <span class="-produce ventorImg" style="margin-right:3px;"></span>退料单</el-breadcrumb-item>
                <!-- <el-breadcrumb-item>退料单</el-breadcrumb-item> -->
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-select v-model="typeStatus" @change="getData" placeholder="请选择状态" >
                <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="请输入退料单号、关联订单号搜索" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="addReturnMaterial">新增</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="pickTime" label="退料时间"></el-table-column>
            <el-table-column prop="number" label="退料单号"></el-table-column>
            <el-table-column prop="orderId" :formatter="formatterOrderId" label="关联订单号"></el-table-column>
            <el-table-column prop="workNumber" :formatter="formatterWorkNumber" label="工单号"></el-table-column>
            <el-table-column prop="repertoryName" label="退料仓库"></el-table-column>
            <el-table-column prop="returnee" label="退料人"></el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column :formatter="formatterStatus" prop="type" label="状态">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="queryDetail(scope.$index, tableData)">详情</el-button>
                    <el-button size="small" v-if="tableData[scope.$index].type=='save'" @click="handleEdit(scope.$index, tableData)" icon="edit">退料</el-button>
                    <!-- <el-button size="small" :disabled="tableData[scope.$index].type=='submit'" @click="handleEdit(scope.$index, tableData)" icon="edit">编辑</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="total, prev, pager, next,jumper" :total="total_size">
            </el-pagination>
        </div>
        <el-dialog title="退料单详情" size='large' :visible.sync="dialogTableVisible">
            <el-form ref="form"  :model="form">
                <el-form-item label="退料时间">
                    <el-col :span="5">
                        <el-date-picker type="date" readonly format="yyyy-MM-dd" placeholder="退料时间" v-model="form.pickTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="退料单号">
                    <el-col :span="5">
                        <el-input v-model="form.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联订单号">
                    <el-col :span="5">
                        <el-input v-model="form.orderId" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="工单号">
                    <el-col :span="5">
                        <el-input v-model="form.workNumber" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="退料人">
                    <el-col :span="5">
                        <el-input v-model="form.returnee" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="存放仓库">
                    <el-col :span="5">
                        <el-input v-model="form.repertoryName" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-col :span="5">
                        <el-input v-model="form.remark" readonly></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-table :data="returnMaterialDetailTableData" style="width: 100%">
                <el-table-column prop="productName" label="物料名称"></el-table-column>
                <el-table-column prop="productNumber" label="物料编号"></el-table-column>
                <el-table-column prop="specification" label="规格"></el-table-column>
                <el-table-column prop="quantity" label="退料数量"></el-table-column>
                <el-table-column prop="unitName" label="单位"></el-table-column>
                <el-table-column prop="regionName" label="退料存放库位"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import {
    findReturnMaterialsByPage,//查看退料列表
    findReturnMaterialsById//根据退料ID查看详情
    } from '../../../api/axiosMaterialReturnApi';
import commonUtil from '../../../common/commonUtil';
export default {
    data() {
        return {
            tableData: [],
            cur_page: 1,
            select_word: '',
            total_size: 0,
            typeStatus:'',
            statusOptions:[
                {
                    name:"全部",
                    value:""
                },
                {
                    name:"待退料",
                    value:"save"
                },
                {
                    name:"已退料",
                    value:"submit"
                }
            ],
            dialogTableVisible:false,
            form: {
                id:"",
                pickTime: new Date(),//退料时间
                orderId:"",//关联订单号
                repertoryId:"",//仓库ID
                number: "",//退料单号
                returnee: "",//退料人
                remark:"",//备注
                type:"",
                workNumber:"",//工单号
            },
            returnMaterialDetailTableData:[],
        }
    },
    created() {
        this.getData();
    },
    methods: {
        //获取列表数据
        getData() {
            let _this = this;
            var params = { 'currentPage': _this.cur_page, 'keyWords': _this.select_word,'type':_this.typeStatus };
            findReturnMaterialsByPage(params).then(res => {
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
        //搜索
        search() {
            this.getData();
        },
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        handleEdit(index, data) {
            this.$router.push({
                name: 'editMaterialReturn',
                query: {
                    materialReturnId: data[index].id,
                }
            });
        },
        handleDelete() {

        },
        //查看详情
        queryDetail(index, data) {
            var _this = this;
            var params = { 'id': data[index].id };
            findReturnMaterialsById(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.dialogTableVisible = true;
                    _this.form = data.returnMaterialsInfoVO;
                    _this.returnMaterialDetailTableData = data.returnMaterialsInfoVO.list;
                } else if (code == 500) {
                    _this.$message.error("系统异常!");
                } else if (code == 400) {
                    _this.$message.warning("参数不合法!");
                } else if (code == 14000) {
                    _this.$message.warning("该退料单无详情!");
                }
                
            });

        },
        //新增退料单
        addReturnMaterial() {
            this.$router.push({ name: 'addMaterialReturn' });
        },
        formatterStatus(row, column, cellValue){
            if(row.type == 'submit'){
                return '已退料';
            }else if(row.type == 'save'){
                return '待退料';
            }
        },
        formatterOrderId(row, column, cellValue){
            if(row.orderId == ''){
                return '无';
            }
            return row.orderId;
        },
        formatterWorkNumber(row, column, cellValue){
            if(row.workNumber == '' || row.workNumber == undefined){
                return '无';
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
    width: 300px;
    display: inline-block;
} 
</style>