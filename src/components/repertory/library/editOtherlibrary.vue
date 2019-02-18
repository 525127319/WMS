<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/produceEnter'}">
                    <i class="el-icon-date"></i> 库存</el-breadcrumb-item>
                <el-breadcrumb-item>编辑其他出库</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="formData" :rules="rules" :model="formData">
                <el-form-item label="出库时间">
                    <el-col :span="10">
                        <el-date-picker :editable="false" type="date" format="yyyy-MM-dd" placeholder="选择出库时间" v-model="formData.outTime"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item prop="number" label="其他出库单号">
                    <el-col :span="10">
                        <el-input v-model="formData.number" readonly></el-input>
                    </el-col>
                </el-form-item>
    
                <!--<el-form-item prop="repertoryId" label="所在仓库">
                    <el-col :span="10">
                    <el-select disabled v-model="formData.repertoryId" placeholder="请选择" @change="getRegionListById">
                        <el-option v-for="item in repertoryList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    </el-col>
                </el-form-item>-->
                <el-form-item prop="orderId" label="关联订单号">
                    <el-col :span="10">
                        <el-input v-model="formData.orderId" placeholder="请输入关联生产订单号" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="storagePeople" label="出库人">
                    <el-col :span="10">
                        <el-input v-model="formData.storagePeople" readonly readonly @click.native="showZtreeTable(0)"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-col :span="10">
                        <el-input type="textarea" v-model="formData.remark"></el-input>
                    </el-col>
                </el-form-item>

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
                            <el-input v-model="m_select_word" placeholder="请输入物料名称、物料编号搜索" class="handle-input"></el-input>
                            <el-button type="primary" icon="search" @click="searchMateriel">搜索</el-button>
                            <el-table ref="materielTable" :data="materielTable" highlight-current-row @row-click="handleCurrentChangeMateriel" style="width: 100%">
                                <el-table-column property="relatedOrderNumber" label="关联订单号">
                                </el-table-column>
                                <el-table-column property="productName" label="物料名称">
                                </el-table-column>
                                <el-table-column property="productNumber" label="物料编号">
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
                    </el-tabs>
                </el-dialog>

                <!--<el-button @click.native="showProductDialog" type="primary">新增其他出库产品</el-button>-->
                <!-- 待出库产品列表 -->
                <el-table ref="productList" :data="productList" border highlight-current-row style="width: 100%">
                    <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-icon name="minus" @click.native="deleteProduct(scope.$index,productList)"></el-icon>
                        </template>
                    </el-table-column>
                    <el-table-column property="productName" label="产品名称"></el-table-column>
                    <el-table-column property="productNumber" label="产品编号"></el-table-column>
                    <el-table-column property="barCode" label="二维码"></el-table-column>
                    <el-table-column property="repertoryName" label="所在仓库"></el-table-column>
                     <el-table-column property="regionName" label="所在库位"></el-table-column>
                    <!--<el-table-column prop="regionId" label="所在库位">
                        <template scope="scope">
                            <el-select v-model="scope.row.regionId" placeholder="请选择库位" @change="ChangeLibraryLocation(productList[scope.$index])">
                                <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>-->

                    <el-table-column property="quantity" label="出库数量">
                        <template scope="scope">
                            <el-input-number :controls="false" size="small" v-model="scope.row.quantity" />
                        </template>
                    </el-table-column>
                    <el-table-column property="unitName" label="单位"></el-table-column>
                    <el-table-column property="repertoryQuantity" label="当前库存数量"></el-table-column>
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
        findOtherOutRepertoryVoById, //根据id查看其他出库详情
        getRegionListByRepertoryId, //根据选中仓库id,查看库位
        initRepertoryList, //初始化所有仓库下拉列表
        editOtherlibrary, //保存编辑
        findOtherOutlibraryList, //新增 库存获取列表
        findInventory // 更改库位  获取库存信息
    } from '../../../api/axiosProductOutApi.js';
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
                    detailId: '', //详情id
                    inboundTime: '', //出库时间
                    number: '', //出库单号
                    orderId: '', //关联生产订单号
                    batchNumber: '', //生产批号
                    remark: '', //备注
                    repertoryId: '',
                    repertoryName: '', //所在仓库
                    repertoryRegionId: '', //所在库位
                    regionId: '',
                    storagePeople: '', //出库人
                    type: "", //入库标记：submit代表提交入库，save代表保存入库单
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
                        trigger: 'blur'
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
                    repertoryName: [{
                        required: true,
                        message: "请选择所在仓库",
                        trigger: "change"
                    }],
                    repertoryRegionId: [{
                        required: true,
                        message: "请选择所在库位",
                        trigger: "change"
                    }],
                },
                //labelPosition: 'top',//对齐方式

                // 默认
                activeName: 'first',
                productList: [], //选中后的产品列表
                productTable: [], //产品列表
                materielTable: [], //物料列表
                select_word: '', //搜索产品关键字
                m_select_word: '', //搜索物料关键字
                cur_page: 1, //产品的分页
                m_cur_page: 1, //物料的分页
                total_size: 10,
                m_total_size: 10,
                addProductTableVisible: false,
                repertoryList: [], //所有仓库
                regionList: [], //库位


                userInfoVisible: false, //显示出库人弹框
                selectType: 0,

                resRepertoryId: "", //仓库ID
                amount: 0
            }
        },
        created() {
            // 获取列表数据
            this.initProduceEnter();

            // 获取库存列表
            this.initRepertoryList();
        },
        methods: {
            //根据ID  获取列表页信息
            initProduceEnter() {
                var _this = this;
                console.log(this.$route.query)
                var params = {
                    'id': _this.$route.query.produceEnterId,
                };
                findOtherOutRepertoryVoById(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    console.log(res)
                    if (code == 200) {
                        _this.formData = data;
                        _this.productList = data.list;

                        console.log("_this.productList" + JSON.stringify(_this.productList))
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    } else if (code == 14000) {
                        _this.$message.warning("无数据!");
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
            // 切换
            handleClick(tab, event) {
                this.addProductTableVisible = true;
            },
            //搜索产品信息
            searchPropduct() {
                this.OtherStorageProductList();
            },
              //搜索物料信息
            searchMateriel() {
                this.OtherStorageMaterielList();
            },
            //下拉框的值改变时触发,获取所有库位信息
            getRegionListById(repertoryName) {
                this.amount++;
                console.log(repertoryName)
                var params = {
                    'id': repertoryName
                };
                var _this = this;
                getRegionListByRepertoryId(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    console.log(res)

                    if (code == 200) {
                        _this.regionList = data;
                        if (_this.productList != null && _this.productList.length > 0) {
                            for (var i = 0; i < _this.productList.length; i++) {
                                var item = _this.productList[i];
                                if (this.amount > 1) {
                                    item.regionId = _this.regionList[0].id;
                                }
                            }
                        }
                    } else if (code == 14000) {
                        _this.regionList = [];
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    }

                    //   绑定仓库ID
                    this.resRepertoryId = repertoryName;
                });
            },




            //确定提交
            onSubmit(formName, type) {

                var _this = this;
                _this.$refs[formName].validate(function (valid) {
                    if (valid) {
                        if (_this.formData.outTime == undefined || _this.formData.outTime == '') {
                            _this.$message.warning('请选择出库时间!');
                            return;
                        }
                        //productionInStorage.inboundTime = commonUtil.formatDateTime(_this.formData.inboundTime);//出库时间
                        _this.formData.type = type; // 出库标记：0代表提交出库，1代表保存出库单
                        _this.formData.regionId = _this.formData.repertoryRegionId;
                        if (_this.productList.length == 0) {
                            _this.$message.warning("请选择一种出库产品");
                            return;
                        }
                        // 这个对象里不需要 这个list
                        delete _this.formData.list;
                        delete _this.formData.regionName;
                        delete _this.formData.repertoryName;

                        var productParamsList = new Array();
                        var flag = false;

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
                            var product = new Object();
                            product = item;
                            // product.productNumber = item.number;
                            productParamsList.push(product);
                        });
                        if (!flag) {

                            delete _this.formData.regionId;
                            var params = {
                                'OtherOutRepertory': _this.formData,
                                'productArr': productParamsList
                            };
                            console.log(params)
                            editOtherlibrary(params).then(res => {
                                let {
                                    code,
                                    msg,
                                    data
                                } = res;
                                console.log(res)
                                if (code == 200) {
                                    _this.$message.success("编辑其他出库成功!");
                                    _this.$router.push({
                                        name: 'Otherlibrary'
                                    });
                                } else if (code == 500) {
                                    _this.$message.error("系统异常,编辑生产出库失败!");
                                } else if (code == 400) {
                                    _this.$message.warning("参数错误!");
                                }
                            });
                        }
                    } else {
                        _this.$message.error('请填写必填项!');
                        return false;
                    }
                });
            },

        

            // 产品分页信息
            queryProductByPage(val) {
                this.cur_page = val;
                this.OtherStorageProductList();
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
                    var index = this.productList.indexOf(val);
                    this.productList.splice(index, 1);

                } else {
                    val.isCheck = true;
                    val.type = 0;
                    this.productList.push(val);
                }
            },
            //选中的物料
            handleCurrentChangeMateriel(val) {
                if (val.isCheck) {
                    val.isCheck = false;
                    var index = this.productList.indexOf(val);
                    this.productList.splice(index, 1);
                } else {
                    val.isCheck = true;
                    val.type = 1;
                    this.productList.push(val);
                }
            },
            // 请求产品信息
            findOtherOutlibraryList() {;
                var _this = this;
                var params = {
                    'currentPage': _this.cur_page,
                    'keyWords': _this.select_word,
                    "type": 1,
                    "repertoryId": _this.resRepertoryId,
                     "orderNumber":_this.formData.orderId
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
                    'keyWords': _this.select_word,
                    "type": 0,
                    "repertoryId": _this.resRepertoryId,
                     "orderNumber":_this.formData.orderId
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
            ChangeLibraryLocation(resScope) {
                console.log(resScope)
                var _this = this;
                var params = {
                    "repertoryId": this.resRepertoryId,
                    "regionId": resScope.regionId,
                    "productId": resScope.productId,
                    "orderNumber":this.formData.orderId
                }

                //repertoryId仓库id
                // regionId库区ID
                // productId产品id
                findInventory(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    console.log(res)
                    if (code == 200) {
                        resScope.repertoryQuantity = data
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

            //展示弹框
            showProductDialog() {
                // 关键字置空
                this.select_word = "";
                this.m_select_word = "";
                // 请求产品信息
                this.findOtherOutlibraryList();
                // 请求物料信息
                this.OtherStorageMaterielList();
                this.addProductTableVisible = true;
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


            //点击取消  返回其他出库列表页面
            toProduceEnterList() {
                this.$router.push({
                    name: 'Otherlibrary'
                });
            },
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

    .buttons {
        overflow: hidden;
        padding: 1rem 0;
    }

    .buttons>* {
        margin-left: 32px;
        float: right;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

</style>
