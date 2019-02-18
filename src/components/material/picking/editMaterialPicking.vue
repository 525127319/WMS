<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item  :to="{path:'/materialPicking'}">
                    <i class="el-icon-date"></i> 领料单</el-breadcrumb-item>
                <el-breadcrumb-item>编辑领料单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="领料时间">
                    <el-col :span="10">
                        <el-date-picker :editable="false" type="date" placeholder="选择日期" v-model="form.pickTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item prop="number" label="领料单号">
                    <el-col :span="10">
                        <el-input v-model="form.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                
                <el-form-item prop="pickingPeople" label="领料人">
                    <el-col :span="10">
                        <el-input v-model="form.pickingPeople" readonly @click.native="showZtreeTable(0)"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联订单号">
                    <el-col :span="10">
                        <el-input v-model="form.orderNumber" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="工单号">
                    <el-col :span="10">
                        <el-input v-model="form.workNumber" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="purpose" label="用途">
                    <el-col :span="10">
                        <el-input v-model="form.purpose"></el-input>
                    </el-col>
                </el-form-item>
               
                <el-form-item hidden label="关联备料单号">
                    <el-col :span="10">
                        <el-input v-model="form.preparesNumber"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-col :span="10">
                        <el-input type="textarea" v-model="form.remark"></el-input>
                    </el-col>
                </el-form-item>
                 <!-- 显示人事ztree弹框 -->
                <user-info-com v-show="userInfoVisible" @user-info="displayPickingPeopleName"></user-info-com>
            </el-form>
                <el-dialog title="物料列表" size="large" v-model="addTableVisible" :close-on-click-modal="false">
                    <el-col :span="10">
                        <el-input v-model="select_word" placeholder="请输入物料名称、物料编号搜索" class="handle-input"></el-input>
                    </el-col>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                    <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChange" style="width: 100%">
                        <el-table-column property="productName" label="物料名称">
                        </el-table-column>
                        <el-table-column property="productNumber" label="物料编号">
                        </el-table-column>
                        <el-table-column property="specification" label="规格">
                        </el-table-column>
                        <el-table-column property="repertoryName" label="所在仓库">
                        </el-table-column>
                        <el-table-column property="regionName" label="所在库位">
                        </el-table-column>
                        <el-table-column property="repertoryDetailQuantity" label="剩余库存">
                        </el-table-column>
                        <el-table-column property="unitName" label="单位">
                        </el-table-column>
                        <el-table-column property="purpose" label="用途">
                        </el-table-column>
                        <el-table-column label="是否选中" width="100">
                            <template scope="scope">
                                <el-icon name="check" v-if="scope.row.isCheck"></el-icon>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination ">
                        <el-pagination @current-change="queryByPage" layout="total,prev, pager, next,jumper " :total="total_size ">
                        </el-pagination>
                    </div>
                    <div class='buttons'>
                        <el-button type="primary" @click="addTableVisible = false">确定</el-button>
                    </div>
                </el-dialog>
           
            <el-button @click.native="showDialog" type="primary" style="margin-bottom:12px;">新增领料物料明细</el-button>
                <el-table ref="materialDetailList" :data="materialDetailList" border highlight-current-row style="width: 100%">
                    <!-- <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-icon name="minus" @click.native="deleteProduct(scope.$index,materialDetailList)"></el-icon>
                        </template>
                    </el-table-column> -->
                    <el-table-column property="productName" label="物料名称"></el-table-column>
                    <el-table-column property="productNumber" label="物料编号"></el-table-column>
                    <el-table-column property="specification" label="规格"></el-table-column>
                    <el-table-column property="planQuantity" label="计划领用数量"></el-table-column>
                    <el-table-column property="quantity" label="领用数量">
                        <template scope="scope">
                            <!-- 如果已领用数量大于计划领用数量,就不能输入数量了 -->
                            <el-input-number :disabled="scope.row.hasQuantity == scope.row.planQuantity && scope.row.planQuantity != 0" :controls="false" size="small" v-model="scope.row.quantity" />
                            <!-- <el-input-number :controls="false" size="small" v-model="scope.row.quantity" /> -->
                        </template>
                        <!-- <template scope="scope">
                            <el-input-number :controls="false" size="small" v-model="scope.row.quantity" />
                        </template> -->
                    </el-table-column>
                    <!--<el-table-column property="hasQuantity" label="已领用数量"></el-table-column>-->
                    <el-table-column property="unitName" label="单位"></el-table-column>
                    <el-table-column property="repertoryName" label="所在仓库"></el-table-column>
                    <el-table-column property="regionName" label="所在库位"></el-table-column>
                    <el-table-column property="barCode" label="二维码编号"></el-table-column>
                    <el-table-column property="repertoryDetailQuantity" label="剩余库存"></el-table-column>
                    <el-table-column property="purpose" label="用途"></el-table-column>
                </el-table>
        </div>
        <div class='buttons'>
            <el-button @click="toMaterialPickingList">返回</el-button>
            <!--<el-popover ref="popover2" width="200" trigger="hover" content="保存为草稿后可以编辑!"></el-popover>
            <el-button type="success" @click="onSubmit('form',1)">保存</el-button>-->
            <el-popover ref="popover1" width="200" trigger="hover" content="保存并提交后不能再编辑!"></el-popover>
            <el-button type="primary" @click="onSubmit('form',0)">领料</el-button>
        </div>
    </div>
</template>

<script>
import {
    initRepertoryList,
    getRegionListByRepertoryId
} from '../../../api/axiosPurchaseOrderApi';
import {
    findPickMaterialsDetailsByOrderId,
    findAddMaterialsInfoByMaterialswebApi,
    updateMaterialPicking
} from '../../../api/axiosMaterialPickingApi';
import commonUtil from '../../../common/commonUtil';
import userInfoCom from '../../page/start';//人事ztree组件
export default {
    components: {
        userInfoCom
    },
    computed:{
        //领用数量是否禁止输入
        isDisabled(){
            //有关联备料单号的话 就可以编辑领用数量
            if(this.$route.query.preparesNumber == ''){
                return false;
            }
            return true;
        }
    },
    data: function() {
        return {
            form: {
                number: '',//领料单号
                orderNumber:'',//关联订单号
                pickTime: '',//领料时间
                workNumber:'',//工单号
                purpose: '',//用途
                pickingPeople: '',//领料人
                preparesNumber:'',
                remark: '',//备注
                type: 1,//'领料标记：0代表提交领料，1代表保存领料草稿,',
            },
            rules: {
                number: [{ required: true, message: '请输入领料单号', trigger: 'blur' }],
                purpose: [{ required: false, message: '请输入用途', trigger: 'blur' }],
                pickingPeople: [{ required: true, message: '请选择领料人', trigger: 'change' }],
                remark: [{ required: false, message: '请输入备注', trigger: 'blur' }],
            },
            repertoryList: [],
            regionList: [],
            materialDetailList: [],//选中后的物料明细数组
            productTable: [],//调用接口
            select_word: '',
            total_size: 1,
            cur_page: 1,
            userInfoVisible: false, //领料人弹框标记
            addTableVisible: false,//物料列表弹框
            selectType: 0,// 0表示点击领料人 , 1表示点击审核人
        }
    },
    created() {
        this.initMaterialPickingAndMaterialDetail();
    },
    methods: {
        onSubmit(formName, type) {
            var _this = this;
            _this.$refs[formName].validate(valid=> {
                if (valid) {
                    if (_this.form.pickTime == undefined || _this.form.pickTime == '') {
                        _this.$message.warning('请选择领料时间!');
                        return;
                    }
                    
                    if (_this.materialDetailList.length == 0) {
                        _this.$message.warning('请选择物料');
                        return;
                    }
                    var flag = false;
                    _this.materialDetailList.forEach((value, index) =>{
                        console.log(JSON.stringify(value)+"============");
                        if (value.planQuantity != 0 && value.quantity + value.hasQuantity > value.planQuantity) {
                            _this.$message.warning('物料名称为【'+value.productName+'】领用数量与已领用数量不能超过计划领用数量');
                            //return;
                            flag = true;
                        } else if (value.quantity > value.repertoryDetailQuantity) {
                            _this.$message.warning('物料名称为【'+value.productName+'】领用数量不能超过库存数量');
                            flag = true;
                        }
                    });
                    if (!flag) {
                        _this.form.pickTime = commonUtil.formatDateTime(_this.form.pickTime);
                        _this.form.type = type;
                        var params = { 'pickMaterials': _this.form, 'list': _this.materialDetailList };
                        updateMaterialPicking(params).then(res => {
                            let { code, msg, data } = res;
                            if (code == 200) {
                                _this.$message.success('领料成功!');
                                _this.$router.push({ name: 'materialPicking' })
                            } else if (code == 14001) {
                                _this.$message.error('领料失败!');
                            } else if (code == 500) {
                                _this.$message.error('系统错误,领料失败!');
                            }else {
                                _this.$message.warning(msg);
                            }
                        })
                    }
                } else {
                    _this.$message.error("请输入必填项!");
                    return;
                }
            });
        },
        //回显领料单 以及 领料材料明细 信息
        initMaterialPickingAndMaterialDetail() {
            var _this = this;
            var params = { 'id': _this.$route.query.materialPickingId };

            findPickMaterialsDetailsByOrderId(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.form = data.pickMaterials;
                    _this.materialDetailList = data.list;
                    _this.materialDetailList.forEach((item,index)=>{
                        // console.log(item.hasQuantity);
                        if(item.planQuantity != 0){
                            item.quantity = item.planQuantity - item.hasQuantity;
                        }
                    });
                } else if (code == 500) {
                    _this.$message.error("系统异常!");
                } else if (code == 400) {
                    _this.$message.warning("参数不合法!");
                }
            });
        },
        //初始化仓库下拉列表
        initRepertoryList() {
            var _this = this;
            initRepertoryList({}).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.repertoryList = data;
                } else if (code == 500) {
                    _this.$message.error('系统异常');
                } else if (code == 14000) {
                    _this.repertoryList = [];
                }
            });
        },
        //下拉框的值改变时触发,获取所有库位信息
        getRegionListById(repertoryId) {
            var params = { 'id': repertoryId };
            var _this = this;
            getRegionListByRepertoryId(params).then(res => {
                let { code, msg, data } = res;

                if (code == 200) {
                    _this.regionList = data;
                }else {
                    _this.$message.warning(msg);
                }

            });
        },
        deleteProduct(index, row) {
            row.isCheck = false;
            this.materialDetailList.splice(index, 1);
        },

        handleCurrentChange(val, event, column) {
            if (val.isCheck) {
                val.isCheck = false;
                var index = this.materialDetailList.indexOf(val);
                this.materialDetailList.splice(index, 1);
            } else {
                val.isCheck = true;
                this.materialDetailList.unshift(val);
            }
        },
        //搜索物料
        search() {
            this.queryMaterialList();
        },
        //上一页下一页
        queryByPage(val) {
            this.cur_page = val;
            this.queryMaterialList();
        },
        //查询物料列表
        queryMaterialList() {
            var _this = this;
            var params = { 'currentPage': this.cur_page, 'keyWords': this.select_word };
            //查询物料列表 调用接口
            findAddMaterialsInfoByMaterialswebApi(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    if (_this.materialDetailList != null) {
                        data.list.forEach(function(item, index) {
                            item.isCheck = false;
                            _this.materialDetailList.forEach(function(selectedItem, i) {
                                if (selectedItem.number == item.number &&
                                    selectedItem.repertoryId == item.repertoryId &&
                                    selectedItem.regionId == item.regionId) {

                                    item.isCheck = true;
                                }
                            });
                        });
                    }
                    _this.productTable = data.list;
                    _this.total_size = data.page.totalRecord;
                } else if (code == 500) {
                    _this.$message.error('系统异常');
                } else if (code == 400) {
                    _this.$message.error('非法参数');
                } else if (code == 14000) {
                    _this.productTable = [];
                    _this.total_size = 0;
                }
            })

        },
        //显示物料列表弹框
        showDialog() {
            this.addTableVisible = true;
            this.queryMaterialList();
        },
        //去领料单列表
        toMaterialPickingList() {
            this.$router.push({ name: 'materialPicking' });
        },
        displayPickingPeopleName(param) {
            if (this.selectType == 0) {
                if (param.length == 0) {
                    this.form.pickingPeople = '';
                } else {
                    this.form.pickingPeople = param[0].realName;
                }
            }
        },
        //显示人事ztree
        showZtreeTable(selectType) {
            this.selectType = selectType;
            this.userInfoVisible = !this.userInfoVisible;
        }
    }
}
</script>
<style scoped>
.el-form-item {
    float: left;
    width: 50%;
}

.form-box {
    width: 100%;
}

.table-border {
    width: 100%;
    border-collapse: collapse;
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
.el-form{
  overflow: hidden;
}
</style>

