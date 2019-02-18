<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><span class="inventory ventorImg"></span>库存盘点</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-select v-model="typeStatus" @change="getData()" placeholder="请选择盘点类型" >
                <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="请输入盘点单号" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="addCheck">新增</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="checkDate" label="盘点日期">
            </el-table-column>
            <el-table-column prop="type" :formatter="formatterText" label="盘点类型">
            </el-table-column>
            <el-table-column prop="checkNum" label="盘点单号">
            </el-table-column>
            <el-table-column prop="repertoryName" label="盘点仓库">
            </el-table-column>
            <el-table-column prop="state" label="状态">
            </el-table-column>
            <el-table-column prop="inventoryPeople" label="盘点人">
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="queryDetail(scope.$index, tableData)">详情</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, tableData)" icon='edit'>编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
            </el-pagination>
        </div>
        <!-- 查看详情 -->
        <el-dialog title="盘点详情单" size='large' :visible.sync="dialogTableVisible">
            <el-form ref="form" :model="form">
                <el-form-item label="盘点日期">
                    <el-col :span="5">
                        <el-date-picker type="date" readonly placeholder="选择盘点日期" v-model="form.checkDate" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="盘点单号">
                    <el-col :span="5">
                        <el-input v-model="form.checkNum" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="盘点类型">
                    <el-col :span="5">
                        <el-input v-model="form.type" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="盘点仓库">
                    <el-col :span="5">
                        <el-input v-model="form.repertoryName" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="盘点人">
                    <el-col :span="5">
                        <el-input v-model="form.inventoryPeople" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-col :span="5">
                        <el-input type="textarea" v-model="form.remark" readonly></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-table :data="checkDetailList" style="width: 100%">
                <el-table-column prop="productName" label="物料名称">
                </el-table-column>
                <el-table-column prop="number" label="物料编号">
                </el-table-column>
                <el-table-column prop="specification" label="规格">
                </el-table-column>
                <el-table-column prop="quantity" label="库存数量">
                </el-table-column>
                <el-table-column prop="checkQuantity" label="盘点数量">
                </el-table-column>
                <el-table-column prop="badQuantity" label="损坏数量">
                </el-table-column>
                <el-table-column prop="regionName" label="库位">
                </el-table-column>
                <el-table-column prop="state" label="状态">
                </el-table-column>
                
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import {
    findBoxListByPage,//查询箱单列表
    findBoxDetailById,//根据箱单id查看详情
} from '../../../api/axiosapi';
import{
    findCheckInfoByPage,//查看盘点列表
    findCheckDetailById//根据ID查看盘点详情
} from '../../../api/axiosRepertoryCheckApi';
import commonUtil from '../../../common/commonUtil';

export default {
    data() {
        return {
            form: {
                id: '',
                checkDate: '',//盘点日期
                checkNum: '', //盘点单号
                type: '', //盘点类型
                repertoryName: '', //盘点仓库
                repertoryPeople: '',  //盘点人
                remark: '' //备注
            },
            tableData: [],
            cur_page: 1,
            select_word: '',
            total_size: 0,
            dialogTableVisible: false,
            checkDetailList: [],//盘点详情
            typeStatus:'-1',
            statusOptions:[
                {
                    name:"全部",
                    value:"-1"
                },
                {
                    name:"产品",
                    value:"1"
                },
                {
                    name:"物料",
                    value:"0"
                }
            ]

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
            var params = { 'cur_page': _this.cur_page, 'checkNum': _this.select_word,'type':_this.typeStatus };
            findCheckInfoByPage(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    data.data.forEach(function(item) {
                        item.checkDate = commonUtil.formatDateTime(item.checkDate);
                    });
                    _this.tableData = data.data;
                    _this.total_size = data.totalSize;
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
        //去盘点新增页面
        addCheck() {
            this.$router.push({ name: 'addCheck' });
        },
        //去盘点编辑页面
        handleEdit(index, data) {
    
            this.$router.push({
                name: 'editCheck',
                query: {
                    checkId: data[index].id,
                }
            });
        },
        //搜索
        search() {
            this.getData();
        },
        //查看详情
        queryDetail(index, data) {
            var _this = this;

            var params = { 'checkId': data[index].id };
            findCheckDetailById(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.dialogTableVisible = true;
                    
                    _this.form = data.check;
                    if(data.check.type == '0'){
                        _this.form.type = '物料';
                    }else if(data.check.type == '1'){
                        _this.form.type = '产品';
                    }
                    _this.checkDetailList = data.list;
                } else if (code == 500) {
                    _this.$message.error("系统异常!");
                } else if (code == 400) {
                    _this.$message.warning("参数不合法!");
                } else if (code == 14000) {
                    _this.checkDetailList = [];
                    _this.dialogTableVisible = false;
                }
            });

        },
        formatterText(row, column, cellValue){
            if(row.type == 0){
                return "物料";
            }else if(row.type == 1){
                return "产品"
            }
            return "物料";
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