<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/move'}">
                    <i class="el-icon-date"></i>库存盘点</el-breadcrumb-item>
                <el-breadcrumb-item>新增库存盘点</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='form-box'>
            <el-form ref="formData"  :rules="rules" :model="formData">
                <el-form-item label="盘点日期" prop="checkDate">
                    <el-col :span="10">
                        <el-date-picker :editable="false" type="date" format="yyyy-MM-dd" placeholder="请选择调拨时间" v-model="formData.checkDate"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="盘点单号" prop="checkNum">
                    <el-col :span="10">
                        <el-input v-model="formData.checkNum" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="盘点类型" prop="type">
                    <el-select v-model="formData.type" placeholder="请选择" @change="resetProductList">
                        <el-option v-for="item in checkType" :key="item.value"  :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="盘点仓库" prop="repertoryId">
                    <el-select v-model="formData.repertoryId" placeholder="请选择" @change="resetProductList">
                        <el-option v-for="item in repertoryList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="盘点人" prop="inventoryPeople">
                    <el-col :span="10">
                        <el-input v-model="formData.inventoryPeople" readonly @click.native="showZtreeTable"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联订单号">
                    <el-col :span="10">
                        <el-input v-model="formData.orderNumber"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-col :span="10">
                        <el-input type="textarea" v-model="formData.remark"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div>
                <!--新增-->
                <el-button @click.native="showDialog" type="primary" style="margin-bottom:12px;">新增盘点明细</el-button>  
            </div>
            <!-- 待入库产品列表 -->
            <div v-if="formData.type == 0">
                <el-table ref="productList" border :data="productList" highlight-current-row style="width: 100%">
                    <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-icon name="minus" @click.native="deleteProduct(scope.$index,productList)"></el-icon>
                        </template>
                    </el-table-column>
                    <el-table-column property="productName" label="物料名称">
                    </el-table-column>
                    <el-table-column property="number" label="物料编号">
                    </el-table-column>
                    <el-table-column property="specification" label="规格">
                    </el-table-column>
                    <el-table-column property="quantity" label="库存数量">
                    </el-table-column>
                    <el-table-column property="checkQuantity" label="盘点数量">
                        <template scope="scope">
                            <el-input-number @input="changeStatus(scope.$index,productList)" :controls="false" size="small" v-model="scope.row.checkQuantity" />
                        </template>
                    </el-table-column>
                    <el-table-column property="badQuantity" label="损坏数量">
                        <template scope="scope">
                            <el-input-number :controls="false" size="small" v-model="scope.row.badQuantity" />
                        </template>
                    </el-table-column>
                    <el-table-column property="regionName" label="库位" width="150"></el-table-column>
                    <el-table-column property="state" label="状态" width="150">
                        <template scope="scope">
                            <el-select v-model="scope.row.state" :disabled="true" placeholder="请选择状态">
                                <el-option 
                                    v-for="item in stateList" 
                                    :key="item.value" 
                                    :label="item.name" 
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="盘点明细列表"   size='large' v-model="addTableVisible">
                    <el-input v-model="select_word" placeholder="请输入名称或编号" class="handle-input"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                    <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChange" style="width: 100%">
                        <el-table-column property="productName" label="物料名称">
                        </el-table-column>
                        <el-table-column property="number" label="物料编号">
                        </el-table-column>
                        <el-table-column property="specification" label="规格">
                        </el-table-column>
                        <el-table-column property="regionName" label="所在库位">
                        </el-table-column>
                        <el-table-column property="quantity" label="剩余库存">
                        </el-table-column>
                        <el-table-column label="是否选中" width="100">
                            <template scope="scope">
                                <el-icon name="check" v-if="scope.row.isChecked"></el-icon>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination ">
                        <el-pagination @current-change="queryByPage" layout="total,prev, pager, next,jumper" :total="total_size">
                        </el-pagination>
                    </div>
                    <div class='buttons'>
                        <el-button type="primary" @click="addTableVisible = false">确定</el-button>
                    </div>
                </el-dialog>
            </div>
            <div v-if="formData.type == 1">
                <el-table ref="productList" border :data="productList" highlight-current-row style="width: 100%">
                    <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-icon name="minus" @click.native="deleteProduct(scope.$index,productList)"></el-icon>
                        </template>
                    </el-table-column>
                    <el-table-column property="productName" label="产品名称">
                    </el-table-column>
                    <el-table-column property="number" label="产品编号">
                    </el-table-column>
                    <el-table-column property="specification" label="规格">
                    </el-table-column>
                    <el-table-column property="quantity" label="库存数量">
                    </el-table-column>
                    <el-table-column property="checkQuantity" label="盘点数量">
                        <template scope="scope">
                            <el-input-number @input="changeStatus(scope.$index,productList)" :controls="false" size="small" v-model="scope.row.checkQuantity" />
                        </template>
                    </el-table-column>
                    <el-table-column property="badQuantity" label="损坏数量">
                        <template scope="scope">
                            <el-input-number :controls="false" size="small" v-model="scope.row.badQuantity" />
                        </template>
                    </el-table-column>
                    <el-table-column property="regionName" label="库位" width="150"></el-table-column>
                    <el-table-column property="state" label="状态" width="150">
                        <template scope="scope">
                            <el-select v-model="scope.row.state" :disabled="true" placeholder="请选择状态">
                                <el-option 
                                    v-for="item in stateList" 
                                    :key="item.value" 
                                    :label="item.name" 
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="盘点明细列表"   size='large' v-model="addTableVisible">
                    <el-input v-model="select_word" placeholder="请输入名称或编号" class="handle-input"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                    <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChange" style="width: 100%">
                        <el-table-column property="productName" label="产品名称">
                        </el-table-column>
                        <el-table-column property="number" label="产品编号">
                        </el-table-column>
                        <el-table-column property="specification" label="规格">
                        </el-table-column>
                        <el-table-column property="regionName" label="所在库位">
                        </el-table-column>
                        <el-table-column property="quantity" label="剩余库存">
                        </el-table-column>
                        <el-table-column label="是否选中" width="100">
                            <template scope="scope">
                                <el-icon name="check" v-if="scope.row.isChecked"></el-icon>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination ">
                        <el-pagination @current-change="queryByPage" layout="total,prev, pager, next,jumper" :total="total_size">
                        </el-pagination>
                    </div>
                    <div class='buttons'>
                        <el-button type="primary" @click="addTableVisible = false">确定</el-button>
                    </div>
                </el-dialog>
            </div>
            <user-info-com v-show="userInfoVisible" @user-info="displayPeopleName"></user-info-com>
            
        </div>
        <div class='buttons'>
            <el-button @click="toCheckList">返回</el-button>
            <el-button type="primary" @click.native="onSubmit('formData')">提交</el-button>
        </div>
    </div>
</template>
<script>
import {
    initRepertoryList,
    getRegionListByRepertoryId,
   getCodeBySeqName
} from "../../../api/axiosPurchaseOrderApi";
import{
    findCheckNum,
    findAddCheckInfo,
    findAddCheckMaterieInfo,
    addCheckInfo,
} from "../../../api/axiosRepertoryCheckApi";
import commonUtil from "../../../common/commonUtil.js";
import userInfoCom from "../../page/start";
export default {
    components: {
        userInfoCom
    },
    created(){
        this.initRepertoryList();
        this.findCheckNum();
    },
    data(){
        return{
            formData:{
                checkDate:new Date(),//盘点日期
                checkNum:'',//盘点单号
                type:'0',//盘点类型
                repertoryId:'',//盘点仓库
                inventoryPeople:sessionStorage.getItem("currentLoginUser"),//盘点人
                state:'normal',//状态
                remark:'',//备注
                orderNumber:'',//关联订单号
            },
            rules:{
                checkDate:[{type: 'date',required: true, message: "请选择盘点时间", trigger: "change"}],
                checkNum:[{required: true,message:"请输入盘点单号",trigger:"blur"}],
                type:[{required: true,message:"请选择盘点类型",trigger:"change"}],
                inventoryPeople:[{required:true,message:"请选择盘点人",trigger:"change"}],
                repertoryId:[{required:true,message:"请选择仓库",trigger:"change"}],
            },
            repertoryList:[],//仓库下拉框列表
            regionList:[],//库位下拉列表
            userInfoVisible:false,
            checkType:[//盘点类型
                {
                    name:"物料",
                    value:"0"
                },
                {
                    name:"产品",
                    value:"1"
                }
            ],
            stateList:[//盘点类型
                {
                    name:"正常",
                    value:"normal"
                },
                {
                    name:"异常",
                    value:"abnormal"
                }
            ],
            addTableVisible:false,
            select_word:'',
            total_size:0,
            cur_page:1,
            productTable:[],
            productList:[],
        }
    },
    methods:{
        onSubmit(formName){
            var _this = this;
            _this.$refs[formName].validate(valid => {
                if(valid){
                    var longTime = _this.formData.checkDate.getTime();
                    _this.formData.checkDate = commonUtil.formatDateTime(_this.formData.checkDate);

                    if(_this.productList == undefined || _this.productList.length == 0){
                        _this.formData.checkDate = new Date(longTime);
                        _this.$message.warning('请新增盘点明细!');
                        return;
                    }

                    for(var i = 0;i< _this.productList.length;i++){
                        var item = _this.productList[i];
                        item.productId = item.id;
                        if(item.state == ''){
                            _this.formData.checkDate = new Date(longTime);
                            _this.$message.warning('请对物料名称为【'+item.productName+'】选择状态!');
                            return;
                        }
                        if(item.state == 'abnormal'){
                            _this.formData.state = 'abnormal';
                        }
                    }

                    var params = {'check':_this.formData,'list':_this.productList};
                    console.log(JSON.stringify(params));
                    addCheckInfo(params).then(res =>{
                        let {code ,msg,data } = res ;
                        if(code == 200){
                            _this.$message.success('新增库存盘点成功');
                            _this.$router.push({
                                name:'check'
                            });
                        }else if(code == 500){
                            _this.formData.checkDate = new Date(longTime);
                            _this.$message.error('系统异常！');
                        }else if(code == 400){
                            _this.formData.checkDate = new Date(longTime);
                            _this.$message.warning('非法参数!');
                        }

                    });

                }else{
                    _this.$message.error("请输入必填项!");
                    return;
                }
            });
        },
        handleCurrentChange(val){
            
            if (val.isChecked) {
                val.isChecked = false;
                var index = this.productList.indexOf(val);
                this.productList.splice(index, 1);
            } else {
                val.isChecked = true;
                this.productList.push(val);
            }
        },
        deleteProduct(index, row) {
            row.isChecked = false;
            this.productList.splice(index, 1);
        },
        search(){
            this.findAddCheckInfo();
        },
        //盘点类型改变 或者 盘点仓库改变 清空盘点明细数组
        resetProductList(){
            this.productList = [];
        },
        queryByPage(val){
            this.cur_page = val;
            this.findAddCheckInfo();
        },
        //查找产品
        findAddCheckInfo(){
            var _this = this;
            
            if(_this.formData.type == '' || _this.formData.type==undefined){
                _this.$message.warning("请选择盘点类型!");
                return;
            }

            if(_this.formData.repertoryId == '' || _this.formData.repertoryId==undefined){
                _this.$message.warning("请先选择仓库!");
                return;
            }
            var params = {"repertoryId":_this.formData.repertoryId,"type":_this.formData.type,"cur_page":_this.cur_page,"keyWords":_this.select_word,'orderNumber':_this.formData.orderNumber};
            findAddCheckInfo(params).then(res =>{
                let {code,msg,data} = res ;
                if(code == 200){
                    if(_this.productList.length> 0){                    
                        data.list.forEach((item, index)=> {
                            _this.productList.forEach((selectedItem, i)=> {
                                if (selectedItem.number == item.number && selectedItem.regionId==item.regionId) {
                                    item.isChecked = true;
                                }
                            });
                        });
                    }
                    _this.productTable = data.list;
                    _this.total_size = data.totalSize;
                }else if(code == 500){
                    _this.$message.error("系统异常!");
                }else if(code == 400){
                    _this.$message.warning("非法参数!");
                }else if(code == 14000){
                    _this.$message.warning("查询无数据!");
                }
            });
        },
        showDialog(){
            var _this = this;
            if(_this.formData.type == '' || _this.formData.type==undefined){
                _this.$message.warning("请选择盘点类型!");
                return;
            }
            if(this.formData.repertoryId == '' || this.formData.repertoryId == undefined){
                this.$message.warning("请先选择仓库!");
                return;
            }
            this.addTableVisible = true;
            this.findAddCheckInfo();
        },
        //自动生成盘点单号
        //初始化序列号
        findCheckNum(){
            var _this = this;
            let dataJson = {"seqName":"check"}; 
            getCodeBySeqName(dataJson).then(res =>{
                let {code,msg,data} =res;
                if (code == 200) {
                    _this.formData.checkNum = data.number;
                } else if (code == 500) {
                    _this.$message.error("系统异常!");
                }
            });
        },
        //初始化所有仓库下拉框
        initRepertoryList() {
            var _this = this;
            initRepertoryList({}).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.repertoryList = data;
                    _this.formData.repertoryId =_this.repertoryList[0].id;
                } else if (code == 14000) {
                    _this.repertoryList = [];
                } else if (code == 500) {
                    _this.$message.error("系统异常!");
                } else if (code == 400) {
                    _this.$message.warning("参数不合法!");
                }
            });
        },
        //下拉框的值改变时触发,获取所有库位信息
        getRegionListById(repertoryId) {
            var params = { id: repertoryId };
            var _this = this;
            getRegionListByRepertoryId(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.regionList = data;

                } else if (code == 14000) {
                    _this.regionList = [];
                } else if (code == 500) {
                    _this.$message.error("系统异常!");
                } else if (code == 400) {
                    _this.$message.warning("参数不合法!");
                }
            });
        },
        displayPeopleName(param) {
            
            if (param.length == 0) {
                this.formData.inventoryPeople = "";
            } else {
                this.formData.inventoryPeople = param[0].realName;
            }
        },
        showZtreeTable() {
            this.userInfoVisible = !this.userInfoVisible;
        },
        toCheckList(){
            this.$router.push({'name':'check'});
        },
        changeStatus(index,data){
            if(data[index].checkQuantity != data[index].quantity){
                data[index].state = 'abnormal';
            }else {
                data[index].state = 'normal';
            }
        }
    }
    
};
</script>
<style scoped>
.form-box {
  width: 100%;
}
.el-form-item {
  float: left;
  width: 50%;
}
.buttons {
  overflow: hidden;
  padding: 1rem 0;
}
.buttons > * {
  margin-left: 32px;
  float: right;
}
.handle-input {
    width: 300px;
    display: inline-block;
}
</style>
