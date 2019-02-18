<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-date"></i>库存质检</el-breadcrumb-item>
                <el-breadcrumb-item>编辑库存质检</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='form-box'>
            <el-form ref="formData"  :rules="rules" :model="formData">
                <el-form-item label="质检类型" prop="type" >
                    <el-select v-model="formData.type" placeholder="请选择" disabled  >
                        <el-option v-for="item in typeArr" :key="item.value"  :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="质检方式" prop="way">
                    <el-select v-model="formData.way" placeholder="请选择" >
                        <el-option v-for="item in wayArr" :key="item.value"  :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="质检日期" prop="qualityTime">
                    <el-col :span="10">
                            <el-date-picker type="date" :editable="false" placeholder="选择日期" v-model="formData.qualityTime" style="width: 100%;"></el-date-picker>
                        </el-col>
                </el-form-item>
                <el-form-item label="质检单号" prop="number">
                    <el-col :span="10">
                        <el-input v-model="formData.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联采购订单号" prop="orderId">
                    <el-col :span="10">
                        <el-input v-model="formData.orderId" readonly ></el-input>
                    </el-col>
                </el-form-item>
                   <el-form-item label="关联生产订单号" prop="relatedOrderNumber">
                    <el-col :span="10">
                        <el-input v-model="formData.relatedOrderNumber" readonly ></el-input>
                    </el-col>
                </el-form-item>
                   <el-form-item label="来料单号" prop="incomingMaterialNumber">
                    <el-col :span="10">
                        <el-input v-model="formData.incomingMaterialNumber" readonly ></el-input>
                    </el-col>
                </el-form-item>
                     <el-form-item label="入库批号" prop="batchNumber">
                    <el-col :span="10">
                        <el-input v-model="formData.batchNumber" readonly ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="送检人" prop="inspectors">
                    <el-col :span="10">
                        <el-input v-model="formData.inspectors" readonly ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检人" prop="qualityPeople">
                    <el-col :span="10">
                        <el-input v-model="formData.qualityPeople" readonly @click.native="showZtreeTable(0)"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="供应商" v-if="formData.type == 'purchase'">
                    <el-col :span="10">
                        <el-input readonly v-model="formData.supplierName"></el-input>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item label="备注">
                    <el-col :span="10">
                        <el-input type="textarea" v-model="formData.remark"></el-input>
                    </el-col>
                </el-form-item> -->
            </el-form>
            <user-info-com v-show="userInfoVisible" @user-info="displayPeopleName"></user-info-com>
            <div class="handle-search">
              <el-input v-model.trim="keyWords" placeholder="请输入物料名称或编号或规格" class="handle-input mr10"></el-input>
              <el-button type="primary" icon="search" @click="detailSearch">搜索</el-button>
            </div>
            <el-table ref="qualityMaterialList"  :data="qualityMaterialList" border highlight-current-row style="width: 100%">
                <!-- <el-table-column label="操作" width="100" v-if='!isOtherStorage'>
                    <template scope="scope">
                        <el-icon name="minus" @click.native="deleteProduct(scope.$index,qualityMaterialList)"></el-icon>
                    </template>
                </el-table-column> -->
                <el-table-column property="productName" label="物料名称"></el-table-column>
                <el-table-column property="productNumber" label="物料编号"></el-table-column>
                <el-table-column property="specification" label="规格"></el-table-column>
                <el-table-column property="supplierName" label="供应商" ></el-table-column>
                <el-table-column property="categoryName" label="物料类型" ></el-table-column>
                <el-table-column property="planQuantity" label="计划入库数量"></el-table-column>
                <el-table-column property="inspectionQuantity" label="检验数量"  width="100">
                    <template scope="scope">
                        <el-input-number :disabled="scope.row.disabledState=='has_disabled' && scope.row.productQualityStatus == 'has_quality'" @input="calculationDefectiveRate(scope.$index,qualityMaterialList,1)" :controls="false" size="small" v-model="scope.row.inspectionQuantity" style="width:70px"/>
                    </template>
                </el-table-column>
                <el-table-column property="qualifiedQuantity" label="合格数量"  width="100">
                    <template scope="scope">
                        <el-input-number :disabled="scope.row.disabledState=='has_disabled' && scope.row.productQualityStatus == 'has_quality'" @input="calculationDefectiveRate(scope.$index,qualityMaterialList,2)" :controls="false" size="small" v-model="scope.row.qualifiedQuantity" style="width:70px"/>
                    </template>
                </el-table-column>
                <el-table-column property="unqualifiedQuantity" label="不合格数量" width="100" >
                    <template scope="scope">
                        <el-input-number :disabled="scope.row.disabledState=='has_disabled' && scope.row.productQualityStatus == 'has_quality'" @input="calculationDefectiveRate(scope.$index,qualityMaterialList,3)" :controls="false" size="small" v-model="scope.row.unqualifiedQuantity" style="width:70px"/>
                    </template>
                </el-table-column>
                <el-table-column property="defectiveRate" label="不良率">
                     <template scope="scope">
                        <el-input :controls="false" size="small" :disabled="true" v-model="scope.row.defectiveRate"/>
                    </template>
                </el-table-column>
                <el-table-column property="badReasons" label="不良原因">
                     <template scope="scope">
                        <el-input v-model="scope.row.badReasons" :disabled="scope.row.disabledState=='has_disabled' && scope.row.productQualityStatus == 'has_quality'"/>
                    </template>
                </el-table-column>
                <!-- <el-table-column property="disabledState" label="是否禁用">
                </el-table-column> -->
                <el-table-column property="productQualityStatus" label="质检状态" width="150 ">
                    <template scope="scope">
                        <el-select :disabled="scope.row.disabledState=='has_disabled' && scope.row.productQualityStatus == 'has_quality'" v-model="scope.row.productQualityStatus"  placeholder="请选择质检状态">
                            <el-option 
                                v-for="item in productQualityStatusList" 
                                :key="item.value" 
                                :label="item.name" 
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class='buttons'>
            <el-button @click="goBack">返回</el-button>
            <!-- <el-button type="success" @click.native="onSubmit('formData','not_quality')">保存</el-button> -->
            <el-button type="primary" @click.native="onSubmit('formData','has_quality')">质检</el-button>
        </div>
    </div>
</template>
<script>
import {detailSearchInfo} from "../../../api/axiosapi";//详情搜索
import commonUtil from '../../../common/commonUtil';
import userInfoCom from "../../page/start";
import {
    updateRepertoryQuality,//确定编辑质检单
    findRepertoryQualityById,//
} from '../../../api/axiosRepertoryQualityApi';
import {
    findApsAllPlanIdByApsApi,//点击关联生产订单号
    findPlanProductByStockByApi
} from '../../../api/axiosProduceEnterApi';
export default {
    components: {
        userInfoCom
    },
    created(){
        this.findRepertoryQualityById();
    },
    data(){
        return {
            keyWords:'',
            formData:{
                id:'',
                qualityTime:new Date(),//质检日期
                number:'',//质检单号
                type:'purchase',//质检类型
                way:'all_inspection',//质检方式
                inspectors:'',//送检人
                qualityPeople:'',//质检人
                orderId:'',//关联采购订单ID
                relatedOrderNumber:'',//关联生产订单号
                incomingMaterialNumber:'',//来料单号
                batchNumber:'',//入库批号
                supplierId:'',//供应商ID
                supplierName:'',//供应商名称
                remark:'',//备注
                status:''
            },
            rules:{
                qualityTime:[{type: 'date',required: true, message: "请选择质检日期", trigger: "blur"}],
                orderId:[{required: false,message:"请输入关联订单号",trigger:"change"}],
                number:[{required: true,message:"请输入质检单号",trigger:"blur"}],
                qualityPeople:[{required:true,message:"请选择质检人",trigger:"change"}],
                type:[{required:true,message:"请选择质检类型",trigger:"change"}],
                way:[{required:true,message:"请选择质检方式",trigger:"change"}],
            },
            wayArr:[
                {
                    name:"全检",
                    value:"all_inspection"
                },
                {
                    name:"抽检",
                    value:"spot_check"
                }
            ],
            productQualityStatusList:[
                {
                    name:"未质检",
                    value:"not_quality"
                },
                {
                    name:"已质检",
                    value:"has_quality"
                },
                {
                    name:"部分质检",
                    value:"part_quality"
                }
                
            ],
            typeArr:[
                {
                    name:"采购入库质检",
                    value:"purchase"
                },
                {
                    name:"其他入库质检",
                    value:"other_storage"
                },
                {
                    name:"生产入库质检",
                    value:"production_storage"
                },
                {
                    name:"客供质检",
                    value:"customer_storage"
                }
            ],
            userInfoVisible:false,//人事弹框
            purchaseOrderVisible:false,//采购质检弹框
            purchaseOrderList:[],//采购订单弹框列表
            productionStorageVisible:false,//生产入库质检弹框
            produceEnterOrderList:[],//生产入库订单弹框
            qualityMaterialList:[],
            select_word:'',
            total_size:0,
            cur_page:1
        }
    },
    computed:{
        isOtherStorage:function(){
            return this.formData.type != 'other_storage';
        }
    },
    methods:{
        //详情搜索
        detailSearch(){
        let self =this;
        let params={
            id:self.formData.id,
            keyWords:self.keyWords
        }
            detailSearchInfo(params).then(res =>{
                let { code, data, msg } = res;
                if (code == 200) {
                self.qualityMaterialList=data.repertoryQualityVO.list;
                self.keyWords="";
                } else {
                self.$message.error(msg);
                }
            })
        },
        calculationDefectiveRate(index,data,type){// type =1说明是检验数量, type = 2说明是合格数量, type =3说明是不合格数量
           if(data[index].unqualifiedQuantity > data[index].inspectionQuantity){//不合格数量不能超过质检数量
                this.$message.warning("不合格数量不能超过质检数量");
                data[index].unqualifiedQuantity = 0;
                return;
            }else if(data[index].qualifiedQuantity > data[index].inspectionQuantity){//合格数量不能超过质检数量
                this.$message.warning("合格数量不能超过质检数量");
                data[index].qualifiedQuantity = 0;
                return;
            }else if(data[index].planQuantity != 0 && data[index].inspectionQuantity > data[index].planQuantity){
                //计划数量不为0  并且检验数量大于计划入库数量
                this.$message.warning("质检数量不能超过计划入库数量");
                data[index].inspectionQuantity = data[index].planQuantity;
                return;
            }
            if(data[index].inspectionQuantity == 0){
                this.$message.warning("请输入检验质检数量");
                return;
            }
            data[index].defectiveRate =((data[index].unqualifiedQuantity/data[index].inspectionQuantity)*100).toFixed(2)+"%";
            if(type == 1){
                if(data[index].unqualifiedQuantity == 0 ){
                   data[index].qualifiedQuantity = data[index].inspectionQuantity -data[index].unqualifiedQuantity; 
                }else if (data[index].qualifiedQuantity ==0){
                   data[index].unqualifiedQuantity = data[index].inspectionQuantity - data[index].qualifiedQuantity; 
                }  
            }else if(type == 2){
                data[index].unqualifiedQuantity = data[index].inspectionQuantity - data[index].qualifiedQuantity;
            }else if(type == 3){
               data[index].qualifiedQuantity = data[index].inspectionQuantity -data[index].unqualifiedQuantity ;
            }
        },
        onSubmit(formName,status){
            var _this = this;
            _this.$refs[formName].validate(valid => {
                if(valid){
                    _this.formData.status = status;
                    var longTime = _this.formData.qualityTime.getTime();

                    if(_this.qualityMaterialList.length == 0 ){
                        _this.$message.warning('请新增质检物料明细!');
                        _this.formData.qualityTime=new Date(longTime);
                        return;
                    }else{
                        var length =  _this.qualityMaterialList.length;
                        for(var i = 0;i < length; i++){
                            var item = _this.qualityMaterialList[i];
                            console.log(item,8888888888888);
                            if(item.unqualifiedQuantity < 0){
                                _this.$message.warning("物料名称为【"+item.productName+"】不合格数量不能小于零!");
                                return;
                            }
                            if(item.qualifiedQuantity < 0){
                                _this.$message.warning("物料名称为【"+item.productName+"】合格数量不能小于零!");
                                return;
                            }
                            if( item.productQualityStatus == "has_quality" && item.inspectionQuantity <= 0 || item.productQualityStatus == "not_quality" && item.inspectionQuantity <= 0 || item.productQualityStatus == "part_quality" && item.inspectionQuantity <= 0){
                                _this.$message.warning("请对物料名称为【" + item.productName + "】的物料输入检验数量!");
                                return;
                            }
                            if(_this.formData.status == 'has_quality' && item.productQualityStatus == 'has_quality'){
                                item.disabledState = 'has_disabled';
                            }else{
                                item.disabledState = 'not_disabled';
                            }
                            //item.defectiveRate =((item.unqualifiedQuantity/item.inspectionQuantity)*100).toFixed(2)+"%";
                        }
                    }
                    _this.formData.qualityTime = commonUtil.formatDateTime(_this.formData.qualityTime);
                    delete _this.formData.list;
                    var params = {'repertoryQuality':_this.formData,'list':_this.qualityMaterialList};
                    updateRepertoryQuality(params).then(res =>{
                        let {code ,msg , data } = res ;
                        if(code == 200){
                            _this.$message.success("编辑成功!");
                            this.$router.push({ name: 'quality' });
                        }else if(code == 400){
                            _this.$message.warning("非法参数!");
                        }else if(code == 500){
                            _this.$message.error("系统异常!");
                        }
                    });
                }else{
                    _this.$message.error("请输入必填项!");
                    return;
                }
            });
        },
        //返回列表页面
        goBack(){
            this.$router.push({ name: 'quality' });
        },
        //回显质检人姓名
        displayPeopleName(param) {
            if (param.length == 0) {
                this.formData.qualityPeople = "";
            } else {
                this.formData.qualityPeople = param[0].realName;
            }
        },
        //展示人事组织树结构
        showZtreeTable() {
            this.userInfoVisible = !this.userInfoVisible;
        },

        findRepertoryQualityById(){
            var _this = this;
            var params = {'id':_this.$route.query.qualityId};
            findRepertoryQualityById(params).then(res =>{
                let {code,msg,data} = res;
                if(code == 200){
                    _this.dialogTableVisible = true;
                    _this.formData = data.repertoryQualityVO;
                    _this.formData.qualityTime = new Date(_this.formData.qualityTime);
                    _this.qualityMaterialList = data.repertoryQualityVO.list;
                }else if (code == 500) {
                    _this.$message.error('系统异常');
                } else if (code == 400) {
                    _this.$message.error('非法参数');
                }
            });
        },
        deleteProduct(index,row){
            row.isCheck = false;
            this.qualityMaterialList.splice(index, 1);
        }
    }

  
}
</script>

<style scoped>
.handle-search{
    float: right;
    margin-bottom: 20px;
}
 .form-box {
  width: 100%;
}
.el-form-item {
  float: left;
  width: 50%;
}
.table-border {
  width: 100%;
  border-collapse: collapse;        
}
.handle-input {
    width: 300px;
    display: inline-block;
}

td,
th {
  border: 1px solid #bfcbd9;
  color: #48576a;
  text-align: center;
  padding: 8px;
}
.buttons {
  overflow: hidden;
  padding: 1rem 0;
}
.buttons > * {
  margin-left: 32px;
  float: right;
}
</style>