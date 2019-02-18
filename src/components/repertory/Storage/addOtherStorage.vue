<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/produceEnter'}">
                    <i class="el-icon-date"></i> 库存</el-breadcrumb-item>
                <el-breadcrumb-item>新增其他入库</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="formData" :rules="rules" :model="formData" label-width="80px">
                <el-form-item label="入库时间">
                    <el-col :span="12">
                        <el-date-picker type="date" :editable="false" format="yyyy-MM-dd" placeholder="选择入库时间" v-model="formData.inboundTime"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item prop="number" label="其他入库单号">
                    <el-col :span="12">
                        <el-input v-model="formData.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item prop="repertoryId" label="所在仓库">
                    <el-col :span="12">
                        <el-select v-model="formData.repertoryId" placeholder="请选择" @change="getRegionListById" style='width:100%'>
                            <el-option v-for="item in repertoryList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item> -->
                <el-form-item prop="batchNumber" label="生产批号">
                    <el-col :span="12">
                        <el-input v-model="formData.batchNumber" readonly></el-input>
                    </el-col>
                </el-form-item>

                <el-form-item prop="warehousePeople" label="入库人">
                    <el-col :span="12">
                        <el-input v-model="formData.warehousePeople" readonly @click.native="showZtreeTable(0)"></el-input>
                    </el-col>
                </el-form-item>

                <el-form-item prop="orderId" label="关联订单号">
                    <el-col :span="12">
                        <el-input v-model="formData.orderId" placeholder="请输入关联订单号" :readonly="formData.qualityId != ''"></el-input>
                    </el-col>
                </el-form-item>

                <el-form-item prop="qualityId" label="质检单号">
                    <el-col :span="12">
                        <el-input v-model="formData.qualityId" :placeholder="placeholderInfo" readonly @click.native="ChoiceInspect(0)"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-col :span="12">
                        <el-input type="textarea" v-model="formData.remark"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>

            <div v-show="isShowADD" class="btn-box">
                <el-button @click.native="showProductDialog" type="primary">新增其他入库</el-button>
            </div>

            <!--模态框 选新增-->
            <el-dialog title="产品列表" v-model="addProductTableVisible">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="新增产品入库" name="first">
                        <el-input v-model="select_word" placeholder="请输入产品名称、产品编号搜索" class="handle-input"></el-input>
                        <el-button type="primary" icon="search" @click="searchPropduct">搜索</el-button>
                        <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChangeProduct" style="width:100%;" >
<el-table-column property="productName" label="产品名称">
</el-table-column>
<el-table-column property="productNumber" label="产品编号">
</el-table-column>
<el-table-column label="是否选中" width="100" property="isCheck">
    <template scope="scope">
        <el-icon name="check" v-if="scope.row.isCheck"></el-icon>
    </template>
</el-table-column>
<!-- <el-table-column type="selection"  width="55"  align="center"></el-table-column> -->
</el-table>
<div class="pagination ">
    <el-pagination @current-change="queryProductByPage" layout="total,prev, pager, next,jumper " :total="total_size ">
    </el-pagination>
</div>
<div class='buttons'>
    <el-button type="primary" @click="addProductTableVisible = false">确定</el-button>
</div>
</el-tab-pane>

<el-tab-pane label="新增物料入库" name="second">
    <el-input v-model="m_select_word" placeholder="请输入物料名称、物料编号搜索" class="handle-input"></el-input>
    <el-button type="primary" icon="search" @click="searchMateriel">搜索</el-button>
    <el-table ref="materielTable" :data="materielTable" highlight-current-row @row-click="handleCurrentChangeMateriel" style="width: 100%">
<el-table-column property="productName" label="物料名称">
</el-table-column>
<el-table-column property="productNumber" label="物料编号">
</el-table-column>
<el-table-column property="specification" label="物料规格">
</el-table-column>
<el-table-column label="是否选中" width="100">
    <template scope="scope">
        <el-icon name="check" v-if="scope.row.isCheck"></el-icon>
    </template>
</el-table-column>
</el-table>
<div class="pagination ">
    <el-pagination @current-change="queryMaterielByPage" layout="total,prev, pager, next,jumper " :total="m_total_size">
    </el-pagination>
</div>
<div class='buttons'>
    <el-button type="primary" @click="addProductTableVisible = false">确定</el-button>
</div>
</el-tab-pane>
</el-tabs>
</el-dialog>

<!--模态框 质检单号-->
<el-dialog title="质检单号列表" :visible.sync="centerDialogVisible" width="80%" center>
    <el-table ref="qualitytestingList" :data="qualitytestingList" highlight-current-row @row-click="handleQualitytesting" style="width: 100%">
<el-table-column property="qualityTime" :formatter="formatterInboundTime" label="质检时间">
</el-table-column>
<el-table-column property="number" label="质检编号">
</el-table-column>
<el-table-column property="orderId" label="关联订单号">
</el-table-column>
<el-table-column property="qualityPeople" label="质检人">
</el-table-column>
<el-table-column property="statusName" label="质检状态">
</el-table-column>
<!-- <el-table-column label="是否选中" width="100">
                        <template scope="scope">
                            <el-icon name="check" v-if="scope.row.isCheck"></el-icon>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否选中" type="selection" width="55">
                    </el-table-column> -->
</el-table>
<div class="pagination ">
    <el-pagination @current-change="queryProductByPage" layout="total,prev, pager, next,jumper " :total="total_size ">
    </el-pagination>
</div>
<!-- <div class='buttons'>
                    <el-button type="primary" @click="centerDialogVisible = false">确定</el-button>
                </div> -->
</el-dialog>
<!-- 有质检单号  显示模式-->
<el-table ref="productList" :data="productList" border highlight-current-row style="width: 100%">
<!-- <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-icon name="minus" @click.native="deleteProduct(scope.$index,productList)"></el-icon>
                        </template>
                    </el-table-column> -->
<!-- <el-table-column property="batchNumber" label="生产批号"></el-table-column> -->
<!--<el-table-column property="planQuantity" label="计划入库数量"></el-table-column>-->
<el-table-column property="productName" label="产品名称"></el-table-column>
<el-table-column property="productNumber" label="产品编号"></el-table-column>
<el-table-column prop="repertoryId" label="所在仓库" width="200">
    <template scope="scope">
        <el-select v-model="scope.row.repertoryId" placeholder="请选择仓库" @change="getRegionListById(scope.row.repertoryId,scope.row)"
            style='width:100%'>
            <el-option v-for="item in repertoryList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
        </el-select>
    </template>
</el-table-column>

<el-table-column prop="regionId" label="所在库位" width="200">
    <template scope="scope">
        <el-select v-model="scope.row.regionId" placeholder="请选择库位" style='width:100%'>
<el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id">
</el-option>
</el-select>
</template>
</el-table-column>

<el-table-column property="quantity" label="入库数量" width="160">
    <template scope="scope">
        <el-input-number :controls="false" size="small" v-model="scope.row.quantity" />
    </template>
</el-table-column>
<el-table-column property="unitName" label="单位"></el-table-column>
<!--<el-table-column property="repertoryQuantity" label="已入库数量"></el-table-column>-->
<el-table-column property="barCode" label="二维码">
    <template scope="scope">
        <el-input v-model="scope.row.barCode" @focus="setinputInfo('',scope.$index)" @change="setinputInfo($event,scope.$index)"
        />
        <ul class="response" v-show="barCodeList.length>0 && isShowList && isThis==scope.$index">
            <li v-for="(item,index) in barCodeList" :key="index" v-text="item" v-on:click="setbarCode(item,scope.row,isShowList=false)"></li>
        </ul>

    </template>
</el-table-column>
<el-table-column property="inspectionQuantity" label="质检数量"></el-table-column>
<el-table-column property="unqualifiedQuantity" label="不合格数量"></el-table-column>
<el-table-column property="defectiveRate" label="不良率"></el-table-column>
<el-table-column property="statusName" label="质检状态"></el-table-column>
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
        findOtherStorageCode, //新增生产入库时 自动生成id 与 入库单号

        initRepertoryList, //初始化所有仓库下拉列表

        getRegionListByRepertoryId, //根据选中仓库id,查看库位

        findOtherInstorageMateriel, //查询新增物料列表

        findOtherInstorageProduct, //查询新增产品列表

        saveOtherInstorageProduct, //保存新增产品

        findRpertoryQuality, //查询质检单号列表信息, 

        findfindRpertoryQualityDetail, //查询质检单号详细信息

        getCodeBySeqName,

    } from '../../../api/axiosInventoryQueryApi';

    import {
        findBarCode, //查看二维码
        checkIfNeedInint, //查寻二维码是否需要初始化
        InitializationBarCode,//初始化二维码
    } from '../../../api/axiosProduceEnterApi';

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
                    number: '', //入库单号
                    inboundTime: new Date(), //入库时间
                    qualityId: '', //质检单号
                    remark: '', //备注
                    repertoryId: '', //所在仓库
                    regionId: '', //所在库位
                    warehousePeople: sessionStorage.getItem("currentLoginUser"), //入库人
                    batchNumber: '', //生产批号
                    type: 1, //入库标记：0代表提交入库，1代表保存入库单
                    orderId: "" //关联订单号
                },
                rules: {
                    number: [{
                        required: true,
                        message: '请输入入库单号',
                        trigger: 'blur'
                    }],
                    batchNumber: [{
                        required: true,
                        message: '请输入生产批号',
                        trigger: 'blur'
                    }],

                    orderId: [{
                        required: false,
                        message: '请输入关联订单号',
                        trigger: 'blur'
                    }],
                    warehousePeople: [{
                        required: true,
                        message: '请选择入库人',
                        trigger: 'change'
                    }],
                    remark: [{
                        required: false,
                        message: '请输入备注',
                        trigger: 'blur'
                    }],
                    repertoryId: [{
                        required: true,
                        message: "请选择所在仓库",
                        trigger: "change"
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
                select_word: '', //搜索产品关键字
                m_select_word: '', //搜索物料关键字
                cur_page: 1, //产品的分页
                m_cur_page: 1, //物料的分页
                total_size: 0,
                m_total_size: 0,
                addProductTableVisible: false,
                isShowList: false,
                repertoryList: [], //所有仓库
                regionList: [], //库位
                userInfoVisible: false, //显示入库人弹框
                selectType: 0,

                qualitytestingList: [], //质检单号列表
                isShowADD: true, //是否显示增加
                placeholderInfo: "选择质检单号", //显示信息
                centerDialogVisible: false, //质检单号模态框
                qualitytestingTable: [], //质检详细信息
                //labelPosition: 'top',//对齐方式
                // planOrderTable: [ //调用接口
                // ],
                barCodeList: [],//二维码集合
                AlreadyGetbarCodeList: []//缓存二维码
            }
        },
        created() {
            this.initRepertoryList();
            this.initProductionInStorageCode();
            // this.setinputInfo();
        },
        methods: {
            // 触发二维码输入框
            setinputInfo(resevent, resIndex) {
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
                    }
                })
            },
            // 选择
            setbarCode(resBarCode, item) {
                if (this.AlreadyGetbarCodeList.includes(resBarCode)) {
                    this.$message.warning('此二维码已经被选择,请更换另一个!');
                    return;
                } else {
                    item.barCode = resBarCode;
                }
                console.log(item)
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
                            // 初始化此二维码
                            let params = {
                                list: []
                            }
                            params.list.push(resBarCode)
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
            //自动生成入库单号
            //初始化序列号
            initProductionInStorageCode() {
                var _this = this;
                let dataJson = { "seqName": "other" };
                getCodeBySeqName(dataJson).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        _this.formData.number = data.number; //入库单号
                    } else if (code == 500) {
                        _this.$message.error('系统异常!');
                    }
                });

                dataJson = { "seqName": "other_batch" };
                getCodeBySeqName(dataJson).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        _this.formData.batchNumber = data.number;  //批次
                    } else if (code == 500) {
                        _this.$message.error('系统异常!');
                    }
                });

            },
            //初始化所有仓库下拉框
            initRepertoryList() {
                var _this = this;
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
            getRegionListById(repertoryId, resdata) {
                console.log(repertoryId,888);
                console.log(resdata,999);
                var params = {
                    'id': repertoryId
                };
                var _this = this;
                getRegionListByRepertoryId(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        resdata.regionId = data[0].id;
                        _this.regionList = data;
                    } else {
                        _this.regionList = [];
                        _this.$message.warning(msg);
                    }
                });
            },
            // 切换
            handleClick(tab, event) {
                this.addProductTableVisible = true;
            },
            // 点击 弹出模态框
            showProductDialog() {

                this.addProductTableVisible = true;
                if (this.productTable.length > 0) return

                // 关键字置空
                this.select_word = "";
                this.m_select_word = "";
                // 请求产品信息
                this.OtherStorageProductList();
                // 请求物料信息
                this.OtherStorageMaterielList();
            },
            // 请求产品信息
            OtherStorageProductList() {
                ;
                var _this = this;
                var params = {
                    'currentPage': _this.cur_page,
                    'keyWords': _this.select_word
                };
                findOtherInstorageProduct(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        if (_this.productList != null) {
                            data.list.forEach(function (item, index) {
                                item.isCheck = false;
                                item.repertoryId = '';
                                _this.productList.forEach(function (selectedItem, i) {
                                    if (selectedItem.productNumber == item.productNumber) {
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
            // 请求物料信息
            OtherStorageMaterielList() {
                var _this = this;
                var params = {
                    'currentPage': _this.m_cur_page,
                    'keyWords': _this.m_select_word
                };
                findOtherInstorageMateriel(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        if (_this.productList != null) {
                            data.list.forEach(function (item, index) {
                                item.isCheck = false;
                                item.repertoryId = '';
                                _this.productList.forEach(function (selectedItem, i) {
                                    if (selectedItem.productNumber == item.productNumber) {
                                        item.isCheck = true;
                                    }
                                });
                            });
                        }
                        _this.materielTable = data.list;
                        _this.m_total_size = data.page.totalRecord;
                    } else if (code == 500) {
                        _this.$message.error('系统异常');
                    } else if (code == 400) {
                        _this.$message.error('非法参数');
                    } else if (code == 14000) {
                        _this.materielTable = [];
                        _this.m_total_size = 0;
                    }
                })
            },


            //搜索产品信息
            searchPropduct() {
                this.OtherStorageProductList();
            },

            //搜索物料信息
            searchMateriel() {
                this.OtherStorageMaterielList();
            },
            // 产品分页信息
            queryProductByPage(val) {
                this.cur_page = val;
                this.OtherStorageProductList();
            },
            // 物料分页信息
            queryMaterielByPage(val) {
                this.m_cur_page = val;
                this.OtherStorageMaterielList();
            },

            // 
            handleQualitytesting(val) {
                // 质检单号

                this.formData.qualityId = val.number;
                if (val.orderId != '' || val.orderId != undefined) {
                    this.formData.orderId = val.orderId;
                }
                const _this = this;
                var params = {
                    'number': val.number
                };
                findfindRpertoryQualityDetail(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
                        if (_this.productList != null) {
                            data.forEach(function (item, index) {
                                item.regionId = '';
                            });
                        }
                        _this.productList = data; //入库单号
                        console.log( _this.productList,999);
                        this.isShowADD = false;
                        _this.centerDialogVisible = false;
                    } else if (code == 500) {
                        _this.$message.error('系统异常!');
                    }
                });
            },
            //选中的物料
            handleCurrentChangeMateriel(val) {
                if (val.isCheck) {
                    val.isCheck = false;
                    var index = this.productList.indexOf(val);
                    this.productList.splice(index, 1);
                } else {
                    val.isCheck = true;
                    val.barCode = '';
                    val.type = 0;
                    this.productList.push(val);
                }
            },
            //选中的产品
            handleCurrentChangeProduct(val) {
                if (val.isCheck) {
                    val.isCheck = false;
                    var index = this.productList.indexOf(val);
                    this.productList.splice(index, 1);
                } else {
                    val.isCheck = true;
                    val.barCode = '';
                    val.type = 1;
                    this.productList.push(val);
                }
            },
            deleteProduct(index, row) {
                row.isCheck = false;
                this.productList.splice(index, 1);
            },

            //点击取消 返回其他入库列表页面
            toOtherStorageList() {
                this.$router.push({
                    name: 'OtherStorage'
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
                        this.formData.warehousePeople = '';
                    } else {
                        this.formData.warehousePeople = param[0].realName;
                    }
                }
            },
            // 选择质检
            ChoiceInspect() {
                findRpertoryQuality().then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;

                    // this.qualitytestingList = [];
                    // this.isShowADD = true;
                    // this.placeholderInfo = "无质检单号";
                    if (code == 14005) {
                        this.qualitytestingList = [];
                        this.isShowADD = true;
                        this.placeholderInfo = "无质检单号";
                    } else if (code == 200) {
                        this.qualitytestingList = data;
                        this.total_size = data.length;
                        this.centerDialogVisible = true;
                    } else if (code == 400) {
                        _this.$message.error('非法参数');
                    }
                })
            },

            //确定提交
            onSubmit(formName, type) {
                var _this = this;
                _this.$refs[formName].validate(function (valid) {
                    if (valid) {
                        if (_this.formData.inboundTime == undefined || _this.formData.inboundTime == '') {
                            _this.$message.warning('请选择入库时间!');
                            return;
                        }

                        if (_this.productList.length == 0) {
                            _this.$message.warning("请选择一种入库产品");
                            return;
                        }
                        for (var i = 0; i < _this.productList.length; i++) {
                            var item = _this.productList[i];

                            if (item.regionId == undefined || item.regionId == '') {
                                _this.$message.warning('请选择入库库位!');
                                return;
                            }
                            if (item.quantity <= 0) {
                                _this.$message.warning('产品编号为【' + item.productNumber + '】的入库数量必须大于0!~');
                                return;
                            }

                        }
                        delete _this.formData.regionId;
                        _this.formData.type = type; // 入库标记：0代表提交入库，1代表保存入库单
                        let params = {
                            'otherStorage': _this.formData,
                            'productArr': _this.productList
                        };
                        console.log(params)
                        saveOtherInstorageProduct(params).then(res => {
                            let {
                                code,
                                msg,
                                data
                            } = res;
                            if (code == 200) {
                                _this.$message.success("新增其他入库成功!");
                                _this.$router.push({
                                    name: 'OtherStorage'
                                });
                            } else if (code == 500) {
                                _this.$message.error("系统异常,新增其他入库失败!");
                            } else if (code == 400) {
                                _this.$message.warning("参数错误!");
                            } else {
                                _this.$message.warning(msg);
                            }
                        });
                    } else {
                        _this.$message.error('请填写必填项!');
                        return false;
                    }
                });
            },
            //格式化日期
            formatterInboundTime(row, column, cellValue) {
                if (row.qualityTime == undefined) {
                    return "";
                }
                return commonUtil.formatDateTime(row.qualityTime);
            },
        }
    }

</script>
<style scoped>
    .header-box{
        padding-bottom: 20px;
    }
    .btn-box{
        margin:20px 0px;
    }
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