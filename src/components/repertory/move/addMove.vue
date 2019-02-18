<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/move'}">
                    <i class="el-icon-date"></i>库存调拨</el-breadcrumb-item>
                <el-breadcrumb-item>新增库存调拨</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='form-box'>
            <el-form ref="formData" :rules="rules" :model="formData" label-width="80px">
                <el-form-item label="调出时间" prop="stockOutDate">
                    <el-col :span="10">
                        <el-date-picker :editable="false" type="date" format="yyyy-MM-dd" placeholder="调出时间" v-model="formData.stockOutDate"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="调入时间" prop="stockInDate">
                    <el-col :span="10">
                        <el-date-picker :editable="false" type="date" format="yyyy-MM-dd" placeholder="调入时间" v-model="formData.stockInDate"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="调拨单号" prop="moveNum">
                    <el-col :span="10">
                        <el-input v-model="formData.moveNum" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="调出人" prop="consignor">
                    <el-col :span="10">
                        <el-input v-model="formData.consignor" readonly @click.native="showEnterPersonTable(1)"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="调出仓库" prop="originalRepertoryId">
                    <el-select v-model="formData.originalRepertoryId" placeholder="请选择">
                        <el-option v-for="item in repertoryList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="调入仓库" prop="targetRepertoryId">
                    <el-select v-model="formData.targetRepertoryId" placeholder="请选择" @change="getRegionListById">
                        <el-option v-for="item in repertoryList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收货人" prop="consignee">
                    <el-col :span="10">
                        <el-input v-model="formData.consignee" readonly @click.native="showEnterPersonTable(0)"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联订单号">
                    <el-col :span="10">
                        <el-input v-model="formData.orderNumber" :readonly="productList.length > 0"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注">
                    <el-col :span="10">
                        <el-input type="textarea" v-model="formData.remark"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div style="clear:both;">
<el-button @click.native="showDialog" type="primary" style="margin-bottom:12px;">查看库存</el-button>
</div>

<!-- 待调拨信息列表 -->
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
<el-table-column property="stockQuantity" label="库存数量">
</el-table-column>
<el-table-column property="moveQuantity" label="计划调拨数量">
    <template scope="scope">
        <el-input-number :controls="false" size="small" v-model="scope.row.moveQuantity" />
    </template>
</el-table-column>
<!--<el-table-column property="targetRegionId" label="操作">
    <template scope="scope">
        <el-button size="small" type="primary" @click="queryDetail(scope.row)">调出</el-button>
    </template>
</el-table-column>-->
</el-table>
<user-info-com v-show="userInfoVisible" @user-info="displayEnterPersonName"></user-info-com>

<!--新增-->
<el-dialog title="调拨物料/产品列表" v-model="addTableVisible" size="large" :close-on-click-modal="false">
    <el-select v-model="typeStatus" @change="findAddMoveInfo" placeholder="请选择产品或物料">
        <el-option v-for="item in typeArr" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
    </el-select>
    <el-input v-model="select_word" placeholder="请输入产品名称或编号" class="handle-input"></el-input>
    <el-button type="primary" icon="search" @click="search">搜索</el-button>
    <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChange" style="width: 100%">
<el-table-column property="type" label="类别"></el-table-column>
<el-table-column property="productName" label="名称"></el-table-column>
<el-table-column property="number" label="编号"></el-table-column>
<el-table-column property="specification" label="规格"></el-table-column>
<el-table-column property="stockQuantity" label="库存数量"></el-table-column>
<el-table-column property="checked" label="是否选中">
    <template scope="scope">
        <el-icon name="check" v-if="scope.row.checked"></el-icon>
    </template>
</el-table-column>
</el-table>
<div class="pagination ">
    <el-pagination layout="total,prev, pager, next,jumper " :total="total_size">
    </el-pagination>
</div>
<div class='buttons'>
    <el-button type="primary" @click="addTableVisible = false">确定</el-button>
</div>
</el-dialog>

<!--明细-->
<el-dialog title="备料明细" size="large" v-model="isShowDetailed" :close-on-click-modal="false">
    <span>计划调拨数量:{{planallocationQuantity}}</span>

    <el-table ref="allocationDetailedList" :data="allocationDetailedList" highlight-current-row style="width: 100%">

<el-table-column property="type" label="类型">
</el-table-column>
<el-table-column property="stockQuantity" label="剩余库存">
</el-table-column>
<el-table-column property="originalRegionName" label="调出库位">
</el-table-column>
<el-table-column property="originalBarCode" label="出库二维码">
</el-table-column>
<el-table-column property="productName" label="名称">
</el-table-column>
<el-table-column property="number" label="编号">
</el-table-column>
<el-table-column property="unitName" label="单位">
</el-table-column>
<el-table-column property="targetBarCode" label="入库二维码">
</el-table-column>
<el-table-column property="moveQuantity" label="调拨数量">
    <template scope="scope">
        <el-input-number :controls="false" size="small" v-model="scope.row.moveQuantity" />
    </template>
</el-table-column>
</el-table>
<div class='buttons'>
    <el-button type="primary" @click="quantitativeVerification">确定</el-button>
    <el-button @click="cancel">取消</el-button>
</div>
</el-dialog>



</div>
<div class='buttons'>
    <el-button @click="goBack">返回</el-button>
    <el-button type="primary" v-show="productList.length>0" @click="onSubmit('formData')">保存</el-button>
</div>
</div>
</template>
<script>
    import commonUtil from "../../../common/commonUtil.js";
    import userInfoCom from "../../page/start";
    import {
        initRepertoryList,
        getRegionListByRepertoryId,
        getCodeBySeqName
    } from "../../../api/axiosPurchaseOrderApi";
    import {
        findMoveNum,
        findAddMoveInfo,
        addMoveInfo,
        findMoveDetailsInfo
    } from "../../../api/axiosRepertoryMoveApi";

    export default {
        components: {
            userInfoCom
        },
        data() {
            return {
                formData: {
                    moveNum: '',//调拨单号
                    stockOutDate: new Date(),//调出时间
                    stockInDate: new Date(),//调入时间
                    originalRepertoryId: '',//调出仓库
                    targetRepertoryId: '',//调入仓库
                    consignor: sessionStorage.getItem("currentLoginUser"),//发货人
                    consignee: sessionStorage.getItem("currentLoginUser"),//收货人
                    remark: '',
                    orderNumber: '',//关联订单号
                    type: 'save',
                },
                rules: {
                    stockOutDate: [{ type: 'date', required: true, message: "请选择调出时间", trigger: "blur" }],
                    stockInDate: [{ type: 'date', required: true, message: "请选择调入时间", trigger: "blur" }],
                    moveNum: [{ required: true, message: "请输入调拨单号", trigger: "blur" }],
                    originalRepertoryId: [{ required: true, message: "请选择调出仓库", trigger: "change" }],
                    targetRepertoryId: [{ required: true, message: "请选择调入仓库", trigger: "change" }],
                    consignor: [{ required: true, message: "请选择调出人", trigger: "change" }],
                    consignee: [{ required: true, message: "请选择收货人", trigger: "change" }],
                },
                repertoryList: [],//所有仓库下拉列表
                regionList: [],
                addTableVisible: false,
                isShowBtn: false,
                cur_page: 1,
                select_word: '',
                total_size: 0,
                productTable: [],
                productList: [],
                userInfoVisible: false,
                isShowDetailed: false,
                selectType: 0,//0 表示收货人 1表示调出人
                typeStatus: '标准件',//绑定是物料 还是产品
                typeArr: [
                    {
                        name: "物料",
                        value: "标准件"
                    },
                    {
                        name: "产品",
                        value: "成品"
                    }
                ],
                allocationDetailedList: [],//调拨明细
                planallocationQuantity: 0,//计划调出数量
            };
        },
        created() {
            this.initRepertoryList();
            this.findMoveNum();
        },
        methods: {
            // 请求调拨明细
            queryDetail(resData) {
                if (resData.moveQuantity <= 0) {
                    this.$message.warning('请输入计划调拨数量!');
                    return;
                }
                this.planallocationQuantity = resData.moveQuantity;

                let params = {
                    originalRepertroyId: this.formData.originalRepertoryId,
                    productId: resData.productId,
                    orderNumber: this.formData.orderNumber || '无'
                }
                findMoveDetailsInfo(params).then(res => {
                    let {code, data, msg, success} = res;
                    if (code == 200) {
                        this.isShowDetailed = true;
                        this.allocationDetailedList = data.list;
                    } else {
                        this.allocationDetailedList = [];
                        this.$message.warning(msg);
                    }
                })
            },
            // 确定
            quantitativeVerification() {
                let Total = 0;
                for (let item of this.allocationDetailedList) {
                    Total += item.moveQuantity
                }
                if (Total > this.planallocationQuantity) {
                    this.$message.warning('调拨数量超过计划数量,请核对!');
                    return;
                } else {
                    this.isShowDetailed = false;
                    this.isShowBtn = true;
                }
            },
            // 取消选择
            cancel() {
                this.isShowDetailed = false;
                for (let item of this.allocationDetailedList) {
                    item.moveQuantity = 0
                }
            },
            // 保存提交
            onSubmit(formName) {
                var _this = this;
                _this.$refs[formName].validate(valid => {
                    if (valid) {
                        for (let item of this.productList) {
                            if (item.moveQuantity > item.stockQuantity) {
                                this.$message.warning('产品编号:' + item.number + '的计划调拨数量不能超过库存数量!');
                                return;
                            } else if (item.moveQuantity <= 0) {
                                this.$message.warning('请输入产品编号:' + item.number + '的计划调拨数量!');
                                return;
                            }
                        }
                        // 深复制
                        let result = JSON.parse(JSON.stringify(_this.formData))
                        result.stockOutDate = commonUtil.formatDateTime(result.stockOutDate);
                        result.stockInDate = commonUtil.formatDateTime(result.stockInDate);
                        let params = { 'move': result, 'list': _this.productList };
                        addMoveInfo(params).then(res => {
                            let {code, msg, data } = res;
                            if (code == 200) {
                                _this.$message.success('新增调拨记录成功!');
                                _this.$router.push({ 'name': 'move' });
                            } else if (code == 500) {
                                _this.$message.error('系统异常!');
                            } else if (code == 400) {
                                _this.$message.warning('非法参数!');
                            } else {
                                _this.$message.warning(msg);
                            }
                        });
                    } else {
                        _this.$message.error("请输入必填项!");
                        return;
                    }
                });
            },
            //删除调拨明细中的产品
            deleteProduct(index, row) {
                row.checked = false;
                this.productList.splice(index, 1);
            },
            //点击弹框中的物料
            handleCurrentChange(val) {
                // debugger
                if (val.checked) {
                    val.checked = false;
                    var index = this.productList.indexOf(val);
                    this.productList.splice(index, 1);
                } else {
                    val.checked = true;
                    this.productList.push(val);
                }
            },

            //初始化所有仓库下拉框
            initRepertoryList() {
                var _this = this;
                initRepertoryList({}).then(res => {
                    let { code, msg, data } = res;
                    if (code == 200) {
                        _this.repertoryList = data;
                    } else if (code == 14000) {
                        _this.repertoryList = [];
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    } else {
                        _this.repertoryList = [];
                        _this.$message.warning(msg);

                    }
                });
            },
            search() {
                this.findAddMoveInfo();
            },
            //查询调拨物料、产品列表
            findAddMoveInfo() {
                var _this = this;
                if (_this.formData.originalRepertoryId == '' || _this.formData.originalRepertoryId == undefined) {
                    _this.$message.warning('请选择调出仓库');
                    return;
                }
                var params = {
                    'cur_page': _this.cur_page,
                    'keyWords': _this.select_word,
                    'type': _this.typeStatus,
                    'repertoryId': _this.formData.originalRepertoryId,
                    'orderNumber': _this.formData.orderNumber == '' ? '无' : _this.formData.orderNumber
                };
                findAddMoveInfo(params).then(res => {
                    let { code, msg, data } = res;
                    _this.addTableVisible = true;
                    if (code == 200) {

                        if (_this.productList != null) {
                            data.list.forEach(function (item, index) {
                                _this.productList.forEach(function (selectedItem, i) {
                                    if (selectedItem.number == item.number
                                        && selectedItem.originalRegionId == item.originalRegionId) {
                                        item.checked = true;
                                    }
                                });
                            });
                        }
                        _this.productTable = data.list;
                        _this.total_size = data.totalSize;
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 14000) {
                        _this.productTable = [];
                        _this.total_size = 1;
                        if (_this.typeStatus == '成品') {
                            _this.$message.warning('该仓库中暂时没有产品');
                        } else if (_this.typeStatus == '标准件') {
                            _this.$message.warning('该仓库中暂时没有物料');
                        }
                    } else {
                        _this.$message.error(msg);
                    }

                });
            },
            //自动生成调拨单号
            //初始化序列号
            findMoveNum() {
                var _this = this;
                let dataJson = { "seqName": "move" };
                getCodeBySeqName(dataJson).then(res => {
                    let {code, msg, data} = res;
                    if (code == 200) {
                        _this.formData.moveNum = data.number;
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
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
            displayEnterPersonName(param) {
                if (this.selectType == 0) {
                    if (param.length == 0) {
                        this.formData.consignee = "";
                    } else {
                        this.formData.consignee = param[0].realName;
                    }
                } else if (this.selectType == 1) {
                    if (param.length == 0) {
                        this.formData.consignor = "";
                    } else {
                        this.formData.consignor = param[0].realName;
                    }
                }
            },
            goBack() {
                this.$router.push({ 'name': 'move' });
            },
            showEnterPersonTable(selectType) {
                this.selectType = selectType;
                //显示入库人选择表
                this.userInfoVisible = !this.userInfoVisible;
            },
            showDialog() {

                this.findAddMoveInfo();
            },
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