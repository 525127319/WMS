<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/move'}">
                    <i class="el-icon-date"></i>库存调拨</el-breadcrumb-item>
                <el-breadcrumb-item v-if="allocationType=='out'">库存调出</el-breadcrumb-item>
                <el-breadcrumb-item v-if="allocationType=='in'">库存调入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='form-box'>
            <el-form ref="formData" :rules="rules" :model="formData" label-width="80px">
                <el-form-item label="调出时间" prop="stockOutDate">
                    <el-col :span="10">
                        <el-date-picker type="date" placeholder="调出时间" v-model="formData.stockOutDate"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="调入时间" prop="stockInDate">
                    <el-col :span="10">
                        <el-date-picker type="date" placeholder="调入时间" v-model="formData.stockInDate"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="调出人" prop="consignor">
                    <el-col :span="10">
                        <el-input v-model="formData.consignor" readonly @click.native="showEnterPersonTable('1')"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="收货人" prop="consignee">
                    <el-col :span="10">
                        <el-input v-model="formData.consignee" readonly @click.native="showEnterPersonTable('2')"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="调拨单号" prop="moveNum">
                    <el-col :span="10">
                        <el-input v-model="formData.moveNum" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="调出仓库" prop="originalRepertoryName">
                    <el-col :span="10">
                        <el-input v-model="formData.originalRepertoryName" readonly></el-input>
                    </el-col>
                </el-form-item>

                <el-form-item label="调入仓库" prop="targetRepertoryName">
                    <el-col :span="10">
                        <el-input v-model="formData.targetRepertoryName" readonly></el-input>
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
            <div style="clear:both;">
<el-button v-if="allocationType=='out'" type="primary" style="margin:14px 0 12px 0;">调出信息列表</el-button>
<el-button v-if="allocationType=='in'" type="primary" style="margin:14px 0 12px 0;">调入信息列表</el-button>
</div>




<el-table :data="moveDetailList" style="width: 100%" >
<el-table-column prop="productName" label="产品名称">
</el-table-column>
<el-table-column prop="number" label="产品编号">
</el-table-column>
<el-table-column prop="specification" label="规格" min-width='200'>
</el-table-column>
<el-table-column prop="moveQuantity" label="计划调拨数量"></el-table-column>
<el-table-column prop="unitName" label="单位"></el-table-column>
<el-table-column property="targetRegionId" label="操作">
    <template scope="scope">
        <el-button v-if="allocationType=='out'" size="small" type="primary" @click="queryDetail(scope.row)">调出</el-button>
        <el-button v-if="allocationType=='in'" size="small" type="primary" @click="queryDetail(scope.row)">调入</el-button>
        <el-button type="primary" icon="edit" size="mini" v-show="!scope.row.checked"></el-button>
    </template>
</el-table-column>
</el-table>


<div class='buttons'>
    <el-button @click="goBack">返回</el-button>
    <el-button type="primary" v-show="isShowBtn" @click="onSubmit('formData')">保存</el-button>
</div>
</div>
<user-info-com v-show="userInfoVisible" @user-info="displayEnterPersonName"></user-info-com>


<!--调出明细-->
<el-dialog title="备料明细" size="large" v-model="isShowDetailed" :close-on-click-modal="false">
    <span>计划调拨数量:{{planallocationQuantity}}</span>

    <el-table ref="allocationDetailedList" :data="allocationDetailedList" highlight-current-row style="width: 100%">

<el-table-column property="categoryName" label="类型">
</el-table-column>
<el-table-column property="productName" label="名称">
</el-table-column>
<el-table-column property="regionName" label="调出库位">
</el-table-column>
<el-table-column property="barCode" label="出库二维码">
</el-table-column>
<el-table-column property="barCodeQuantity" label="剩余库存">
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
<!--调入明细-->
<el-dialog title="备料明细" size="large" v-model="isShowMoveIn" :close-on-click-modal="false">
    <span>计划调拨数量:{{planallocationQuantity}}</span>
    <el-table ref="allocationMoveInList" :data="allocationMoveInList" highlight-current-row style="width: 100%">

<el-table-column property="categoryName" label="类型">
</el-table-column>
<el-table-column property="productName" label="名称">
</el-table-column>
<el-table-column property="regionName" label="调入库位">
    <template scope="scope">
        <el-select size='small' v-model="scope.row.regionId" placeholder="请选择库位" style='width:100%'>
<el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
</el-select>
</template>
</el-table-column>
<el-table-column property="barCode" label="入库二维码">
    <template scope="scope">
        <el-input v-model="scope.row.barCode" @focus="setinputInfo('',scope.$index)" @change="setinputInfo($event,scope.$index)"
        />
        <ul class="response" v-show="(barCodeList.length>0 && isShowList) && isThis==scope.$index">
            <li v-for="(item,index) in barCodeList" :key="index" v-text="item" v-on:click="setbarCode(item,scope.row,isShowList=false)"></li>
        </ul>
    </template>
</el-table-column>
<el-table-column property="moveQuantity" label="调拨数量">
    <template scope="scope">
        <el-input-number :controls="false" size="small" v-model="scope.row.moveQuantity" />
    </template>
</el-table-column>
</el-table>
<div class='buttons'>
    <el-button type="primary" @click="confirmMoveIn">确定</el-button>
    <el-button @click="isShowMoveIn=false">取消</el-button>
</div>
</el-dialog>

</div>
</template>
<script>
    import commonUtil from "../../../common/commonUtil.js";
    import userInfoCom from "../../page/start";
    import {
        findMoveInfoById,//根据ID查看详情
        findMoveDetailsInfo,//明细 信息列表
        editMoveBoxInfo,//保存调拨
        getRegionListByRepertoryId,//查询仓库下的所有库位信息
        findBarCode, //查看二维码
        checkIfNeedInint, //查寻二维码是否需要初始化
        InitializationBarCode,//初始化二维码
    } from "../../../api/axiosRepertoryMoveApi";

    export default {
        components: {
            userInfoCom
        },
        data() {
            return {
                formData: {},
                moveDetailList: [],
                rules: {
                    stockOutDate: [{ type: 'date', required: true, message: "请选择调出时间", trigger: "blur" }],
                    stockInDate: [{ type: 'date', required: true, message: "请选择调入时间", trigger: "blur" }],
                    consignor: [{ required: true, message: "请选择调出人", trigger: "change" }],
                    consignee: [{ required: true, message: "请选择收货人", trigger: "change" }],
                },
                userInfoVisible: false,
                isShowDetailed: false,
                isShowMoveIn: false,
                isShowBtn: false,
                isShowList: false,
                selectType: '',//
                planallocationQuantity: 0,//计划调出数量
                allocationDetailedList: [],//调拨明细 调出
                allocationMoveInList: [],//调拨明细 调入
                SelectedInfo: '',//选中的信息
                allocationInfo: [],//调拨选中的信息列表
                allocationType: '',//
                regionList: [],//库位列表信息
                isThis: 0, //记录点击的
                barCodeList: [],//二维码集合
                AlreadyGetbarCodeList: [],//缓存二维码
            };
        },
        created() {
            this.allocationType = this.$route.query.type;
            this.queryMoveOut()//请求调出信息
        },
        methods: {
            //请求调出信息
            queryMoveOut() {
                const _this = this;
                // 请求参数
                let params = {
                    id: this.$route.query.id
                };
                findMoveInfoById(params).then(res => {
                    let { code, msg, data } = res;
                    if (code == 200) {
                        _this.formData = data.move;
                        _this.moveDetailList = data.list;
                        _this.getRegionList()//库区下的库位信息
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    } else if (code == 14000) {
                        _this.$message.warning("当前箱单没有详情!");
                    } else {
                        _this.$message.error(msg);
                    }
                });

            },
            // 返回到调拨列表页
            goBack() {
                this.$router.push({ 'name': 'move' });
            },
            // 选择人员
            showEnterPersonTable(selectType) {
                this.selectType = selectType;
                //显示入库人选择表
                this.userInfoVisible = !this.userInfoVisible;
            },
            // 绑定选择的人
            displayEnterPersonName(param) {
                // 收货人
                if (this.selectType == '2') {
                    if (param.length == 0) {
                        this.formData.consignee = "";
                    } else {
                        this.formData.consignee = param[0].realName;
                    }
                } else if (this.selectType == '1') {
                    // 调出人
                    if (param.length == 0) {
                        this.formData.consignor = "";
                    } else {
                        this.formData.consignor = param[0].realName;
                    }
                }
            },
            // 查询详情
            queryDetail(resData) {
                this.AlreadyGetbarCodeList = [];//缓存二维码集合初始化
                this.SelectedInfo = resData;//保存选中的数据
                this.planallocationQuantity = resData.moveQuantity;
                let params = {
                    originalRepertroyId: this.formData.originalRepertoryId,
                    productId: resData.productId,
                    orderNumber: this.formData.orderNumber || '无',
                    status: this.$route.query.type,
                    mvId: this.formData.id,
                    mvdId: resData.id
                }
                findMoveDetailsInfo(params).then(res => {
                    let {code, data, msg, success} = res;
                    if (code == 200) {
                        if (this.allocationType === 'out') {
                            this.isShowDetailed = true;
                            this.allocationDetailedList = data.list;
                        } else if (this.allocationType === 'in') {
                            this.isShowMoveIn = true;
                            this.allocationMoveInList = data.list;
                        }
                    } else {
                        this.allocationDetailedList = [];
                        this.$message.warning(msg);
                    }
                })
            },
            //调出 确定
            quantitativeVerification() {
                let Total = 0;
                for (let item of this.allocationDetailedList) {
                    Total += item.moveQuantity
                    // 去重
                    let index = this.allocationInfo.findIndex(data => data.productId === item.productId)
                    if (index != -1) {
                        this.allocationInfo.splice(index, 1)
                    }

                }
                if (Total > this.planallocationQuantity) {
                    this.$message.warning('调拨数量超过计划数量,请核对!');
                    return;
                } if (Total < this.planallocationQuantity) {
                    this.$message.warning('调拨数量总和小于计划数量,请核对!');
                    return;
                } if (Total == this.planallocationQuantity) {
                    this.SelectedInfo.checked = true;
                    this.isShowDetailed = false;
                    this.allocationInfo.push(...this.allocationDetailedList)
                }
                for (let info of this.moveDetailList) {
                    if (info.checked) {
                        this.isShowBtn = true;
                    } else {
                        this.isShowBtn = false;
                    }
                }
            },
            // 调入确认
            confirmMoveIn() {
                let Total = 0;
                for (let item of this.allocationMoveInList) {
                    if (!item.regionId) {
                        this.$message.warning('你有调入库位没有选择!');
                        return;
                    }
                    if (!item.barCode) {
                        this.$message.warning('请输入入库二维码!');
                        return;
                    }
                    Total += item.moveQuantity
                    // 去重
                    let index = this.allocationInfo.findIndex(data => data.productId === item.productId)
                    if (index != -1) {
                        this.allocationInfo.splice(index, 1)
                    }
                }
                if (Total > this.planallocationQuantity) {
                    this.$message.warning('调拨数量超过计划数量,请核对!');
                    return;
                } if (Total < this.planallocationQuantity) {
                    this.$message.warning('调拨数量总和小于计划数量,请核对!');
                    return;
                } if (Total == this.planallocationQuantity) {
                    this.SelectedInfo.checked = true;
                    this.isShowMoveIn = false;
                    this.allocationInfo.push(...this.allocationMoveInList)
                }
                for (let info of this.moveDetailList) {
                    if (info.checked) {
                        this.isShowBtn = true;
                    } else {
                        this.isShowBtn = false;
                    }
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
                const _this = this;
                if (!this.formData.stockOutDate) {
                    this.$message.warning('请选择调出时间!');
                    return
                }
                if (!this.formData.stockInDate) {
                    this.$message.warning('请选择调入时间!');
                    return
                }
                if (!this.formData.consignor) {
                    this.$message.warning('请选择调出人!');
                    return
                }
                if (!this.formData.consignee) {
                    this.$message.warning('请选择收货人!');
                    return
                }
                // 深复制
                let result = JSON.parse(JSON.stringify(_this.formData))
                result.stockOutDate = commonUtil.formatDateTime(result.stockOutDate);
                result.stockInDate = commonUtil.formatDateTime(result.stockInDate);
                let params = { 'move': result, 'list': _this.allocationInfo };
                editMoveBoxInfo(params).then(res => {
                    let {code, msg, data } = res;
                    if (code == 200) {
                        this.$message.success('保存成功');
                        this.$router.push({
                            name: 'move'
                        })
                    } else {
                        this.$message.warning(msg);
                    }
                });

            },
            // 获取库位
            getRegionList() {
                const _this = this;
                let params = {
                    id: this.formData.targetRepertoryId
                };
                getRegionListByRepertoryId(params).then(res => {
                    let { code, msg, data } = res;
                    if (code == 200) {
                        _this.regionList = data;
                    } else {
                        _this.regionList = [];
                        _this.$message.error(msg);
                    }
                });
            },
            // 触发二维码输入框
            setinputInfo(resevent, resIndex) {
                this.barCodeList = [];
                this.isShowList = false;
                this.isThis = resIndex;
                let params = {
                    "keyWords": resevent
                }
                findBarCode(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        this.barCodeList = data.list;
                        this.isShowList = true;
                    } else {
                        this.barCodeList = [];
                        this.isShowList = false;
                        this.$message.warning(msg);
                    }
                })
            },
            // 选择二维码
            setbarCode(resBarCode, item) {
                if (this.AlreadyGetbarCodeList.includes(resBarCode)) {
                    this.$message.warning('此二维码已经被选择,请更换另一个!');
                    return;
                } else {
                    item.barCode = resBarCode
                }
                this.AlreadyGetbarCodeList.push(resBarCode)
                const _this = this;

                let params = {
                    "barCode": resBarCode
                }
                // 查询是否需要初始化
                checkIfNeedInint(params).then(res => {
                    let {
                        code,
                        msg,
                        data,
                        success
                    } = res;
                    if (success && data.flag) {

                        this.$confirm('是否初始化此二维码以便后续使用, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {

                            let params = {
                                list: []
                            }
                            params.list.push(resBarCode)
                            console.log(params)
                            InitializationBarCode(params).then(res => {
                                if (res.success) {
                                    _this.$message({
                                        type: 'success',
                                        message: '初始化成功!'
                                    });
                                }
                            })

                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            });
                        });

                    }
                })
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
   .response {
        position: absolute;
        z-index: 100;
        background-color: white;
        box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.2);
    }

    .response li {
        position: relative;
        height: 32px;
        line-height: 32px;
        padding: 0 8px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        white-space: nowrap;
    }

    .response li:hover {
        background-color: rgba(32, 160, 255, 0.72);
        color: white;
    }

    li {
        list-style: none;
    }
</style>