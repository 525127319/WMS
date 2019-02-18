<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/produceEnter'}">
                    <span class="-produce voterIcon" style="margin-right:3px;"></span>生产入库</el-breadcrumb-item>
<el-breadcrumb-item>编辑生产入库</el-breadcrumb-item>
</el-breadcrumb>
</div>
<div class="form-box">
    <!--<el-form ref="formData" :rules="rules" :model="formData">
        <el-form-item label="入库时间">
            <el-col :span="10">
                <el-date-picker :editable="false" type="date" format="yyyy-MM-dd" placeholder="选择入库时间" v-model="formData.inboundTime"></el-date-picker>
            </el-col>
        </el-form-item>
        <el-form-item prop="productionInStorageCode" label="入库单号">
            <el-col :span="10">
                <el-input v-model="formData.productionInStorageCode" readonly></el-input>
            </el-col>
        </el-form-item>
        <el-form-item prop="number" label="关联生产订单号">
            <el-col :span="10">
                <el-input v-model="formData.number" placeholder="请输入关联生产订单号" readonly></el-input>
            </el-col>
        </el-form-item>
        <el-form-item prop="batchNumber" label="生产批号">
            <el-col :span="10">
                <el-input v-model="formData.batchNumber" placeholder="请输入生产批号"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item prop="repertoryId" label="所在仓库">
            <el-select v-model="formData.repertoryId" placeholder="请选择" @change="getRegionListById">
                <el-option v-for="item in repertoryList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="repertoryRegionId" label="所在库位">
            <el-select v-model="formData.repertoryRegionId" placeholder="请选择">
                <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="warehousePeople" label="入库人">
            <el-col :span="10">
                <el-input v-model="formData.warehousePeople" readonly readonly @click.native="showZtreeTable(0)"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="客户名称">
            <el-col :span="10">
                <el-input v-model="formData.customerName" readonly></el-input>
            </el-col>
        </el-form-item>-->



    <el-form ref="formData" :model="formData">
        <el-form-item label="入库时间" required prop="inboundTime">
            <el-col :span="10">
                <el-date-picker type="date" format="yyyy-MM-dd" placeholder="请选择入库时间" v-model="formData.inboundTime" style="width: 100%;"></el-date-picker>
</el-col>
</el-form-item>

<el-form-item label="客户名称">
    <el-col :span="10">
        <el-input v-model="formData.customerName" readonly></el-input>
    </el-col>
</el-form-item>
<el-form-item label="入库单号">
    <el-col :span="10">
        <el-input v-model="formData.productionInStorageCode" readonly></el-input>
    </el-col>
</el-form-item>
<el-form-item label="关联生产订单号">
    <el-col :span="10">
        <el-input v-model="formData.relatedOrderNumber" readonly></el-input>
    </el-col>
</el-form-item>
<el-form-item label="生产批号">
    <el-col :span="10">
        <el-input v-model="formData.batchNumber" readonly></el-input>
    </el-col>
</el-form-item>
<el-form-item label="入库人">
    <el-col :span="10">
        <el-input v-model="formData.warehousePeople" readonly></el-input>
    </el-col>
</el-form-item>

</el-form>
<!--新增-->
<el-dialog title="产品列表" v-model="addProductTableVisible" :close-on-click-modal="false">
    <el-input v-model="select_word" placeholder="请输入产品名称、产品编号搜索" class="handle-input"></el-input>
    <el-button type="primary" icon="search" @click="searchProduct">搜索</el-button>
    <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChangeProduct" style="width: 100%">
<el-table-column property="name" label="产品名称">
</el-table-column>
<el-table-column property="number" label="产品编号">
</el-table-column>
<el-table-column label="是否选中" width="100">
    <template scope="scope">
        <el-icon name="check" v-if="scope.row.isCheck"></el-icon>
    </template>
</el-table-column>
</el-table>
<div class="pagination ">
    <el-pagination @current-change="queryProductByPage" layout="prev, pager, next " :total="total_size ">
    </el-pagination>
</div>
<div class='buttons'>
    <el-button type="primary" @click="addProductTableVisible = false">确定</el-button>
    <!-- <el-button @click="addTableVisible = false">取消</el-button> -->
</div>
</el-dialog>
<!-- <el-button @click.native="showProductDialog" type="primary">新增生产入库产品</el-button> -->
<!-- 待入库产品列表 -->
<!--<el-table ref="productList" :data="productList" border highlight-current-row style="width: 100%">

<el-table-column property="name" label="产品名称"></el-table-column>
<el-table-column property="productNumber" label="产品编号"></el-table-column>
<el-table-column property="planQuantity" label="计划入库数量"></el-table-column>
<el-table-column property="quantity" label="入库数量">
    <template scope="scope">
        <el-input-number :controls="false" size="small" v-model="scope.row.quantity" />
    </template>
</el-table-column>
<el-table-column property="unitName" label="单位"></el-table-column>
<el-table-column property="hasStorageQuantity" label="已入库数量"></el-table-column>
<el-table-column property="qualifiedQuantity" label="质检数量"></el-table-column>
<el-table-column property="unqualifiedQuantity" label="不合格数量"></el-table-column>
<el-table-column property="defectiveRate" label="不良率"></el-table-column>
<el-table-column property="productQualityStatus" label="物料质检状态" :formatter="productQualityStatusStr"></el-table-column>
</el-table>-->



<el-table ref="productList" :data="productList" border highlight-current-row style="width: 100%">
<el-table-column property="productName" label="产品名称"></el-table-column>
<el-table-column property="productNumber" label="产品编号"></el-table-column>
<el-table-column property="planQuantity" label="计划入库数量"></el-table-column>
<el-table-column property="hasQuantity" label="入库数量">
    <template scope="scope">
        <el-input-number :controls="false" size="small" v-model="scope.row.hasQuantity" />
    </template>
</el-table-column>
<el-table-column property="unitName" label="单位"></el-table-column>
<el-table-column property="hasStorageQuantity" label="已入库数量"></el-table-column>
<el-table-column property="repertoryName" label="所在仓库"></el-table-column>
<el-table-column property="regionName" label="所在库位"></el-table-column>
<el-table-column property="barCode" label="二维码"></el-table-column>

</el-table>

</el-form>
<user-info-com v-show="userInfoVisible" @user-info="displayPersonName"></user-info-com>
</div>
<div class='buttons'>
    <el-button @click="toProduceEnterList">返回</el-button>
    <el-popover ref="popover1" width="200" trigger="hover" content="保存并提交后不能再编辑!"></el-popover>
    <el-popover ref="popover2" width="200" trigger="hover" content="保存为草稿后可以编辑!"></el-popover>
    <el-button v-popover:popover2 type="success" @click="onSubmit('formData','save')">保存为草稿</el-button>
    <el-button v-popover:popover1 type="primary" @click="onSubmit('formData','submit')">保存并提交</el-button>
</div>
</div>
</template>
<script>
    import {
        initRepertoryList,//初始化所有仓库下拉列表
        getRegionListByRepertoryId,//根据选中仓库id,查看库位
    } from '../../../api/axiosPurchaseOrderApi';
    import commonUtil from '../../../common/commonUtil.js';
    import {
        findProductInfo,//查询弹框列表
        findRepertoryNumberByCode,//根据产品编号查询产品库存数量
        queryProduceEnterDetailById,//根据id查看生产入库详情
        editProduceEnter,//确定保存
    } from '../../../api/axiosProduceEnterApi';
    import userInfoCom from '../../page/start';
    export default {
        components: {
            userInfoCom
        },
        data: function () {
            return {
                formData: {
                    id: '',
                    detailId: '',//详情id
                    inboundTime: '',//入库时间
                    productionInStorageCode: '',//入库单号
                    relatedOrderNumber: '',//关联生产订单号
                    batchNumber: '',//生产批号
                    remark: '',//备注
                    repertoryId: '',//所在仓库
                    repertoryRegionId: '',//所在库位
                    regionId: '',
                    warehousePeople: '',//入库人
                    type: 1,//入库标记：0代表提交入库，1代表保存入库单
                    statusName: '',
                    wayName: '',
                    customerName: '',//客户名称
                    // workNumber:'',//工单号
                },
                rules: {
                    inboundTime: [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                },
                //labelPosition: 'top',//对齐方式
                total_size: 0,
                addProductTableVisible: false,
                productList: [],//选中后的产品列表
                productTable: [//调用接口
                ],
                repertoryList: [], //所有仓库
                regionList: [], //库位
                cur_page: 1,
                select_word: '',
                userInfoVisible: false, //显示入库人弹框
                selectType: 0,
            }
        },
        created() {
            this.initRepertoryList();
            this.initProduceEnter();
        },
        methods: {

            //确定提交
            onSubmit(formName, type) {
                var _this = this;
                _this.$refs[formName].validate(function (valid) {
                    if (valid) {
                        if (_this.formData.inboundTime == undefined || _this.formData.inboundTime == '') {
                            _this.$message.warning('请选择入库时间!');
                            return;
                        }
                        //productionInStorage.inboundTime = commonUtil.formatDateTime(_this.formData.inboundTime);//入库时间
                        _this.formData.type = type;// 入库标记：0代表提交入库，1代表保存入库单
                        _this.formData.regionId = _this.formData.repertoryRegionId;
                        if (_this.productList.length == 0) {
                            _this.$message.warning("请选择一种入库产品");
                            return;
                        }
                        var productParamsList = new Array();
                        var flag = false;

                        for (let item of _this.productList) {
                            if (item.hasQuantity == 0) {
                                _this.$message.warning('产品编号为【' + item.productNumber + '】的入库数量必须大于0!~');
                                flag = true;
                                return;
                            } else if (item.hasQuantity > item.planQuantity - item.hasStorageQuantity) {
                                _this.$message.warning('产品编号为【' + item.productNumber + '】的总入库数量大于了计划入库数量!~');
                                flag = true;
                                return;
                            }

                        };


                        if (!flag) {
                            var params = { 'productionInStorageInfo': _this.formData, 'list': _this.productList };
                            _this.editProduceEnter(params);
                            // if (type == 0) {
                            //     for (var i = 0; i < _this.productList.length; i++) {
                            //         var item = _this.productList[i];
                            //         if (item.productQualityStatus == 'not_quality') {
                            //             _this.$confirm('该订单有未质检的产品,是否确认入库?', '提示', {
                            //                 cancelButtonText: '取消',
                            //                 confirmButtonText: '确定',
                            //                 type: 'warning'
                            //             }).then(() => {
                            //                 _this.editProduceEnter(params);
                            //             }).catch(() => {
                            //                 _this.$message.info('已取消');
                            //             });
                            //             return;
                            //         }
                            //     }
                            //     _this.editProduceEnter(params);
                            // } else if (type == 1) {
                            //     console.log(JSON.stringify(params));
                            //     _this.editProduceEnter(params);
                            // }
                        }
                    } else {
                        _this.$message.error('请填写必填项!');
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            editProduceEnter(params) {
                var _this = this;
                editProduceEnter(params).then(res => {
                    let { code, msg, data } = res;
                    if (code == 200) {
                        _this.$message.success("编辑生产入库成功!");
                        _this.$router.push({ name: 'produceEnter' });
                    } else if (code == 500) {
                        _this.$message.error("系统异常,编辑生产入库失败!");
                    } else if (code == 400) {
                        _this.$message.warning("参数错误!");
                    }
                });
            },
            queryProductByPage(val) {
                this.cur_page = val;
                this.queryProductList();
            },
            searchProduct() {
                this.queryProductList();
            },
            //初始化生产入库数据
            initProduceEnter() {
                var _this = this;
                var params = { 'id': _this.$route.query.produceEnterId, 'batchNumber': _this.$route.query.batchNumber };
                queryProduceEnterDetailById(params).then(res => {
                    let { code, msg, data } = res;
                    if (code == 200) {
                        _this.dialogTableVisible = true;
                        _this.formData = data;
                        _this.productList = data.list;
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    } else if (code == 14000) {
                        _this.$message.warning("无数据!");
                    }
                });
            },
            //查询产品列表弹框
            queryProductList() {
                var _this = this;
                var params = { 'currentPage': _this.cur_page, 'keyWords': _this.select_word };
                findProductInfo(params).then(res => {
                    let { code, msg, data } = res;
                    if (code == 200) {
                        if (_this.productList != null) {
                            data.list.forEach(function (item, index) {
                                _this.productList.forEach(function (selectedItem, i) {
                                    if (selectedItem.number == item.number) {
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
            //展示弹框
            showProductDialog() {
                this.addProductTableVisible = true;
                this.queryProductList();
            },
            handleCurrentChangeProduct(val) {
                if (val.isCheck) {
                    val.isCheck = false;
                    var index = this.productList.indexOf(val);
                    this.productList.splice(index, 1);
                } else {
                    val.isCheck = true;
                    this.productList.push(val);
                }
            },
            deleteProduct(index, row) {
                row.isCheck = false;
                this.productList.splice(index, 1);
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
                        _this.formData.repertoryRegionId = _this.regionList[0].id;
                    } else if (code == 14000) {
                        _this.regionList = [];
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    }
                });
            },
            //点击取消 去生产入库列表页面
            toProduceEnterList() {
                this.$router.push({ name: 'produceEnter' });
            },
            showZtreeTable(selectType) {
                this.selectType = selectType;
                this.userInfoVisible = !this.userInfoVisible;
            },
            displayPersonName(param) {
                if (this.selectType == 0) {
                    if (param.length == 0) {
                        this.formData.warehousePeople = '';
                    } else {
                        this.formData.warehousePeople = param[0].realName;
                    }
                }
            },
            productQualityStatusStr(row, column, cellValue) {
                if (row.productQualityStatus == 'not_quality') {
                    return '未质检';
                } else if (row.productQualityStatus == 'has_quality') {
                    return '已质检';
                } else if (row.productQualityStatus == 'part_quality') {
                    return '部分质检';
                }
            }
        }
    }
</script>
<style scoped>
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

td,
th {
    border: 1px solid #bfcbd9;
    color: #48576a;
    text-align: center;
    padding: 8px;
}
.buttons{
    overflow: hidden;
    padding: 1rem 0 ;
}
.buttons>*{
    margin-left:32px;
    float: right;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
</style>