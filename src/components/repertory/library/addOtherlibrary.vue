<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/produceEnter'}">
                    <i class="el-icon-date"></i> 库存</el-breadcrumb-item>
                <el-breadcrumb-item>新增其他出库</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="formData" :rules="rules" :model="formData" label-width="80px">
                <el-form-item label="出库时间">
                    <el-col :span="12">
                        <el-date-picker type="date" :editable="false" format="yyyy-MM-dd" placeholder="选择出库时间" v-model="formData.outTime"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item prop="number" label="其他出库单号">
                    <el-col :span="12">
                        <el-input v-model="formData.number" readonly></el-input>
                    </el-col>
                </el-form-item>

                <el-form-item prop="orderId" label="关联订单号">
                    <el-col :span="12">
                        <el-input v-model="formData.orderId" placeholder="请输入关联订单号" :disabled="productList.length>0"  ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="storagePeople" label="出库人">
                    <el-col :span="12">
                        <el-input v-model="formData.storagePeople" readonly @click.native="showZtreeTable(0)"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-col :span="12">
                        <el-input type="textarea" v-model="formData.remark"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div>
                <el-button @click.native="showProductDialog" type="primary">新增其他出库</el-button>
            </div>
            <!--模态框 选新增-->
            <el-dialog title="产品列表" v-model="addProductTableVisible">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="新增产品出库" name="first">
                        <el-input v-model="select_word" placeholder="请输入产品名称、产品编号搜索" class="handle-input"></el-input>
                        <el-button type="primary" icon="search" @click="searchPropduct">搜索</el-button>
                        <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChangeProduct" style="width: 100%">
<el-table-column property="relatedOrderNumber" label="关联订单号">
</el-table-column>
<el-table-column property="productName" label="产品名称">
</el-table-column>
<el-table-column property="productNumber" label="产品编号">
</el-table-column>
</el-table-column>
<el-table-column property="barCode" label="二维码">
</el-table-column>
<el-table-column property="repertoryQuantity" label="当前库存">
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
</div>
</el-tab-pane>

<el-tab-pane label="新增物料出库" name="second">
    <el-input v-model="h_select_word" placeholder="请输入物料名称、物料编号搜索" class="handle-input"></el-input>
    <el-button type="primary" icon="search" @click="searchMateriel">搜索</el-button>
    <el-table ref="materielTable" :data="materielTable" highlight-current-row @row-click="handleCurrentChangeMateriel" style="width: 100%">
<el-table-column property="relatedOrderNumber" label="关联订单号">
</el-table-column>
<el-table-column property="productName" label="物料名称">
</el-table-column>
<el-table-column property="productNumber" label="物料编号">
</el-table-column>
</el-table-column>
<el-table-column property="barCode" label="二维码">
</el-table-column>
<el-table-column property="specification" label="物料规格">
</el-table-column>
<el-table-column property="repertoryQuantity" label="当前库存">
</el-table-column>
<el-table-column label="是否选中" width="100">
    <template scope="scope">
        <el-icon name="check" v-if="scope.row.isCheck"></el-icon>
    </template>
</el-table-column>
</el-table>
<div class="pagination ">
    <el-pagination @current-change="queryMaterielByPage" layout="prev, pager, next " :total="m_total_size">
    </el-pagination>
</div>
<div class='buttons'>
    <el-button type="primary" @click="addProductTableVisible = false">确定</el-button>
</div>
</el-tab-pane>




<el-tab-pane label="新增耗材出库" name="three">
    <el-input v-model="m_select_word" placeholder="请输入耗材名称、耗材编号搜索" class="handle-input"></el-input>
    <el-button type="primary" icon="search" @click="searchConsumptive">搜索</el-button>
    <el-table ref="consumptiveTable" :data="consumptiveTable" highlight-current-row @row-click="handleCurrentChangeConsumptive"
        style="width: 100%">
<el-table-column property="relatedOrderNumber" label="关联订单号">
</el-table-column>
<el-table-column property="productName" label="耗材名称">
</el-table-column>
<el-table-column property="productNumber" label="耗材编号">
</el-table-column>
<el-table-column property="barCode" label="二维码">
</el-table-column>
</el-table-column>
<el-table-column property="specification" label="耗材规格">
</el-table-column>
<el-table-column property="repertoryQuantity" label="当前库存">
</el-table-column>
<el-table-column label="是否选中" width="100">
    <template scope="scope">
        <el-icon name="check" v-if="scope.row.isCheck"></el-icon>
    </template>
</el-table-column>
</el-table>
<div class="pagination ">
    <el-pagination @current-change="queryMaterielByPage" layout="prev, pager, next " :total="h_total_size">
    </el-pagination>
</div>
<div class='buttons'>
    <el-button type="primary" @click="addProductTableVisible = false">确定</el-button>
</div>
</el-tab-pane>

</el-tabs>


</el-dialog>


<!-- 待出库产品列表 -->
<el-table ref="productList" :data="productList" border highlight-current-row style="width: 100%">
<el-table-column label="操作" width="100">
    <template scope="scope">
        <el-icon name="minus" @click.native="deleteProduct(scope.$index,productList)"></el-icon>
    </template>
</el-table-column>
<el-table-column property="repertoryName" label="所在仓库"></el-table-column>
<el-table-column property="regionName" label="所在库位"></el-table-column>
<el-table-column property="productName" label="名称"></el-table-column>
<el-table-column property='specification' label="规格"></el-table-column>
<el-table-column property="productNumber" label="编号"></el-table-column>
<el-table-column property="barCode" label="二维码"></el-table-column>
<el-table-column property="quantity" label="出库数量">
    <template scope="scope">
        <el-input-number :controls="false" size="small" v-model="scope.row.quantity" />
    </template>
</el-table-column>
<el-table-column property="unitName" label="单位"></el-table-column>
<el-table-column property="repertoryQuantity" label="当前库存"></el-table-column>
</el-table>
<user-info-com v-show="userInfoVisible" @user-info="displayPersonName"></user-info-com>
</div>

<div class='buttons'>
    <el-button @click="toOtherStorageList">返回</el-button>
    <el-popover ref="popover1" width="200" trigger="hover" content="保存并提交后不能再编辑!"></el-popover>
    <el-popover ref="popover2" width="200" trigger="hover" content="保存为草稿后可以编辑!"></el-popover>
    <el-button v-popover:popover2 type="success" @click="onSubmit('formData','save')">保存为草稿</el-button>
    <el-button v-popover:popover1 type="primary" @click="onSubmit('formData','submit')">保存并提交</el-button>
</div>
</div>
</template>
<script>
    import {
        findOtherlibraryCode, //自动生成出库单号

        initRepertoryList, //初始化所有仓库下拉列表

        findOtherOutlibraryList, //新增 库存获取列表

        saveOtherOutRepertory, //保存新增产品

    } from '../../../api/axiosProductOutApi.js';




    import {


        findOtherStorageCode, //新增生产出库时 自动生成id 与 出库单号


        getRegionListByRepertoryId, //根据选中仓库id,查看库位

        findOtherInstorageMateriel, //查询新增物料列表

        findOtherInstorageProduct, //查询新增产品列表


        saveOtherInstorageProduct, //保存新增产品

        getCodeBySeqName
    } from '../../../api/axiosInventoryQueryApi';
    import commonUtil from '../../../common/commonUtil.js';
    import userInfoCom from '../../page/start';



    export default {
        components: {
            userInfoCom
        },
        data: function () {
            return {
                formData: {
                    id: '',
                    number: '', //出库单号
                    outTime: new Date(), //出库时间
                    orderId: '', //关联生产订单号
                    remark: '', //备注
                    repertoryId: '', //所在仓库
                    regionId: '', //所在库位
                    storagePeople: sessionStorage.getItem("currentLoginUser"), //出库人
                    // batchNumber: '', //生产批号
                    type: 1, //出库标记：0代表提交出库，1代表保存出库单
                },
                rules: {
                    number: [{
                        required: true,
                        message: '请输入出库单号',
                        trigger: 'blur'
                    }],
                    batchNumber: [{
                        required: true,
                        message: '请输入生产批号',
                        trigger: 'blur'
                    }],
                    orderId: [{
                        required: false,
                        message: '请输入关联生产订单号',
                        trigger: 'change'
                    }],
                    storagePeople: [{
                        required: true,
                        message: '请选择出库人',
                        trigger: 'change'
                    }],
                    remark: [{
                        required: false,
                        message: '请输入备注',
                        trigger: 'blur'
                    }],
                    regionId: [{
                        required: true,
                        message: "请选择所在库位",
                        trigger: "change"
                    }],
                },

                // 默认
                activeName: 'first',
                productList: [], //选中后的产品列表
                productTable: [], //产品列表
                materielTable: [], //物料列表
                consumptiveTable: [], //耗材列表
                select_word: '', //搜索产品关键字
                m_select_word: '', //搜索物料关键字
                h_select_word: '', //搜索物料关键字
                cur_page: 1, //产品的分页
                m_cur_page: 1, //物料的分页
                h_cur_page: 1, //物料的分页
                total_size: 10,
                m_total_size: 10,
                h_total_size: 10,
                addProductTableVisible: false,
                repertoryList: [], //所有仓库
                regionList: [], //库位
                userInfoVisible: false, //显示出库人弹框
                selectType: 0,

                resRepertoryId: ""

                //labelPosition: 'top',//对齐方式
                // planOrderTable: [ //调用接口
                // ],
            }
        },
        created() {
            //初始化所有仓库下拉框
            this.initRepertoryList();
            // 自动生成出库编号
            this.initOtherlibraryCode();
        },
        methods: {
            //自动生成出库单号
            //初始化序列号
            initOtherlibraryCode() {
                let _this = this;
                let dataJson = { "seqName": "other_out" };
                getCodeBySeqName(dataJson).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        _this.formData.number = data.number; //出库编号
                        // _this.formData.batchNumber = data.batchNumber;
                    } else if (code == 500) {
                        _this.$message.error('系统异常!');
                    }
                });
            },
            //初始化所有仓库下拉框
            initRepertoryList() {
                let _this = this;
                initRepertoryList({}).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
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
                let params = {
                    'id': repertoryId
                };
                let _this = this;
                getRegionListByRepertoryId(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        _this.regionList = data;
                        if (_this.productList != null && _this.productList.length > 0) {
                            for (let i = 0; i < _this.productList.length; i++) {
                                let item = _this.productList[i];
                                item.regionId = _this.regionList[0].id;
                            }
                        }
                        // _this.formData.regionId = _this.regionList[0].id;
                    } else if (code == 14000) {
                        _this.regionList = [];
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    }
                });
                //   绑定仓库ID
                this.resRepertoryId = repertoryId;
            },
            // 切换
            handleClick(tab, event) {
                this.addProductTableVisible = true;
            },
            // 点击 弹出模态框
            showProductDialog() {
                this.addProductTableVisible = true;
                if (this.productTable.length > 0) return;

                // 关键字置空
                this.select_word = "";
                this.m_select_word = "";
                // 请求产品信息
                this.findOtherOutlibraryList();
                // 请求物料信息
                this.OtherStorageMaterielList();
                // 请求耗材信息
                this.consumptiveMateriallList();
            },
            // 请求产品信息
            findOtherOutlibraryList() {
                let _this = this;
                let params = {
                    'currentPage': _this.cur_page,
                    'keyWords': _this.select_word,
                    "type": '成品',
                    "orderNumber": _this.formData.orderId
                };
                findOtherOutlibraryList(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    console.log(res)

                    if (code == 200) {
                        if (_this.productList != null) {
                            data.list.forEach(function (item, index) {
                                _this.productList.forEach(function (selectedItem, i) {
                                    if (selectedItem.productNumber == item.productNumber) {
                                        item.isCheck = true;
                                    }
                                });
                            });
                        }
                        _this.productTable = data.list;
                        _this.total_size = data.page.totalRecord;
                    } else if (code == 402) {
                        _this.productTable = [];
                        _this.total_size = 1;
                    } else {
                        _this.$message.error(msg);
                        _this.productTable = [];
                        _this.total_size = 1;

                    }
                })
            },
            // 请求物料信息
            OtherStorageMaterielList() {
                let _this = this;
                let params = {
                    'currentPage': _this.m_cur_page,
                    'keyWords': _this.m_select_word,
                    "type": '标准件',
                    "orderNumber": _this.formData.orderId
                };
                findOtherOutlibraryList(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    console.log(res)
                    if (code == 200) {
                        if (_this.productList != null) {
                            data.list.forEach(function (item, index) {
                                _this.productList.forEach(function (selectedItem, i) {
                                    if (selectedItem.productNumber == item.productNumber) {
                                        item.isCheck = true;
                                    }
                                });
                            });
                        }
                        _this.materielTable = data.list;
                        _this.m_total_size = data.page.totalRecord;
                    } else if (code == 402) {
                        _this.materielTable = [];
                        _this.m_total_size = 1;
                    } else {
                        _this.$message.error(msg);
                        _this.materielTable = [];
                        _this.m_total_size = 1;
                    }
                })
            },
            // 请求耗材信息 
            consumptiveMateriallList() {
                let _this = this;
                let params = {
                    'currentPage': _this.h_cur_page,
                    'keyWords': _this.h_select_word,
                    "type": '耗材',
                    "orderNumber": _this.formData.orderId
                };
                findOtherOutlibraryList(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    console.log(res)
                    if (code == 200) {
                        if (_this.productList != null) {
                            data.list.forEach(function (item, index) {
                                _this.productList.forEach(function (selectedItem, i) {
                                    if (selectedItem.productNumber == item.productNumber) {
                                        item.isCheck = true;
                                    }
                                });
                            });
                        }
                        _this.consumptiveTable = data.list;
                        _this.h_total_size = data.page.totalRecord;
                    } else if (code == 402) {
                        _this.consumptiveTable = [];
                        _this.h_total_size = 1;
                    } else {
                        _this.$message.error(msg);
                        _this.consumptiveTable = [];
                        _this.h_total_size = 1;
                    }
                })
            },
            //搜索产品信息
            searchPropduct() {
                this.findOtherOutlibraryList();
            },

            //搜索物料信息
            searchMateriel() {
                this.OtherStorageMaterielList();
            },
            //搜索耗材信息
            searchConsumptive() {
                this.consumptiveMateriallList();
            },
            // 产品分页信息
            queryProductByPage(val) {
                this.cur_page = val;
                this.findOtherOutlibraryList();
            },
            // 产品分页信息
            queryMaterielByPage(val) {
                this.m_cur_page = val;
                this.OtherStorageMaterielList();
            },
            //选中的产品
            handleCurrentChangeProduct(val) {
                if (val.isCheck) {
                    val.isCheck = false;
                    let index = this.productList.indexOf(val);
                    this.productList.splice(index, 1);

                } else {
                    val.isCheck = true;
                    val.type = '成品';
                    this.productList.push(val);
                }
            },
            //选中的物料
            handleCurrentChangeMateriel(val) {
                if (val.isCheck) {
                    val.isCheck = false;
                    let index = this.productList.indexOf(val);
                    this.productList.splice(index, 1);
                } else {
                    val.isCheck = true;
                    val.type = '标准件';
                    this.productList.push(val);
                }
            },
            //选中的耗材
            handleCurrentChangeConsumptive(val) {
                if (val.isCheck) {
                    val.isCheck = false;
                    let index = this.productList.indexOf(val);
                    this.productList.splice(index, 1);
                } else {
                    val.isCheck = true;
                    val.type = '耗材';
                    this.productList.push(val);
                }
            },


            deleteProduct(index, row) {
                row.isCheck = false;
                this.productList.splice(index, 1);
            },

            //点击取消 返回其他出库列表页面
            toOtherStorageList() {
                this.$router.push({
                    name: 'Otherlibrary'
                });
            },
            //
            showZtreeTable(selectType) {
                this.selectType = selectType;
                this.userInfoVisible = !this.userInfoVisible;
            },
            displayPersonName(param) {
                if (this.selectType == 0) {
                    if (param.length == 0) {
                        this.formData.storagePeople = '';
                    } else {
                        this.formData.storagePeople = param[0].realName;
                    }
                }
            },


            //确定提交
            onSubmit(formName, type) {
                let _this = this;
                _this.$refs[formName].validate(function (valid) {
                    if (valid) {

                        if (_this.formData.outTime == undefined || _this.formData.outTime == '') {
                            _this.$message.warning('请选择出库时间!');
                            return;
                        }
                        _this.formData.type = type; // 出库标记：0代表提交出库，1代表保存出库单
                        if (_this.productList.length == 0) {
                            _this.$message.warning("请选择一种出库产品");
                            return;
                        }
                        let productParamsList = new Array();
                        let flag = false;
                        _this.productList.forEach(function (item, index) {
                            if (item.quantity <= 0) {
                                _this.$message.warning('产品编号为【' + item.productNumber + '】的出库数量必须大于0!~');
                                flag = true;
                                return;
                            } else if (item.quantity > item.repertoryQuantity) {
                                _this.$message.warning('产品编号为【' + item.productNumber + '】的出库数量不得大于库存!~');
                                flag = true;
                                return;
                            }
                            let product = new Object();
                            product = item;
                            productParamsList.push(product);
                        });

                        if (!flag) {
                            delete _this.formData.regionId;
                            let params = {
                                'OtherOutRepertory': _this.formData,
                                'productArr': productParamsList
                            };
                            saveOtherOutRepertory(params).then(res => {
                                let {
                                    code,
                                    msg,
                                    data
                                } = res;
                                if (code == 200) {
                                    _this.$message.success("新增其他出库成功!");
                                    _this.$router.push({
                                        name: 'Otherlibrary'
                                    });
                                } else if (code == 500) {
                                    _this.$message.error("系统异常,新增其他出库失败!");
                                } else if (code == 400) {
                                    _this.$message.warning("参数错误!");
                                }
                            });
                        }
                    } else {
                        _this.$message.error('请填写必填项!');
                        // console.log('error submit!!');
                        return false;
                    }
                });
            },










            // handleCurrentChange(val) {
            //     this.addTableVisible = false;
            //     this.formData.number = val.orderId;
            //     let params = {
            //         'orderId': val.orderId
            //     };
            //     let _this = this;
            //     findPlanProductByStockByApi(params).then(res => {
            //         let {
            //             code,
            //             msg,
            //             data
            //         } = res;
            //         if (code == 200) {
            //             _this.productList = data.list;
            //         } else {
            //             _this.$message.warning(msg);
            //         }
            //     });
            // },
            //无订单生产出库 ,自动生成关联生产订单号
            // generationOrderNumber() {
            //     this.formData.number = new Date().getTime() + '';
            //     this.addTableVisible = false;
            // },
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

    .buttons {
        overflow: hidden;
        padding: 1rem 0;
    }

    .buttons>* {
        margin-left: 32px;
        float: right;
    }

    .el-form-item__label {
        width: 120px;
    }

    .el-form-item__content {
        margin-left: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

</style>