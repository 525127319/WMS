<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/produceEnter'}">
                    <i class="el-icon-date"></i> 库存</el-breadcrumb-item>
                <el-breadcrumb-item>编辑其他入库</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="formData" :rules="rules" :model="formData" label-width="80px">
                <el-form-item label="入库时间" >
                    <el-col :span="12">
                        <el-date-picker :editable="false" type="date" format="yyyy-MM-dd" placeholder="选择入库时间" v-model="formData.inboundTime"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item prop="number" label="其他入库单号">
                    <el-col :span="12">
                        <el-input v-model="formData.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                 <!-- <el-form-item prop="repertoryId" label="所在仓库">
                    <el-col :span="12">
                        <el-select disabled v-model="formData.repertoryId" placeholder="请选择" @change="getRegionListById">
                            <el-option v-for="item in repertoryList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item> -->
                <el-form-item prop="batchNumber" label="生产批号">
                    <el-col :span="12">
                        <el-input v-model="formData.batchNumber" placeholder="请输入生产批号"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="warehousePeople" label="入库人">
                    <el-col :span="12">
                        <el-input v-model="formData.warehousePeople"  readonly @click.native="showZtreeTable(0)"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="orderId" label="关联订单号">
                    <el-col :span="12">
                        <el-input v-model="formData.orderId" placeholder="请输入关联订单号" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="qualityId" label="质检单号">
                    <el-col :span="12">
                        <el-input v-model="formData.qualityId" readonly></el-input>
                    </el-col>
                </el-form-item>

                <el-form-item prop="remark" label="备注">
                    <el-col :span="12">
                        <el-input type="textarea" v-model="formData.remark"></el-input>
                    </el-col>
                </el-form-item>
                </el-form>
                <!--模态框 选新增-->
                <el-dialog title="产品列表" v-model="addProductTableVisible">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="新增产品入库" name="first">
                            <el-input v-model="select_word" placeholder="请输入产品名称、产品编号搜索" class="handle-input"></el-input>
                            <el-button type="primary" icon="search" @click="searchPropduct">搜索</el-button>
                            <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChangeProduct" style="width: 100%">
                                <el-table-column property="productName" label="产品名称">
                                </el-table-column>
                                <el-table-column property="productNumber" label="产品编号">
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
                        <el-tab-pane label="新增物料入库" name="second">
                            <el-input v-model="m_select_word" placeholder="请输入物料名称、物料编号搜索" class="handle-input"></el-input>
                            <el-button type="primary" icon="search" @click="searchMateriel">搜索</el-button>
                            <el-table ref="materielTable" :data="materielTable" highlight-current-row @row-click="handleCurrentChangeMateriel" style="width: 100%">
                                <el-table-column property="productName" label="物料名称">
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
                                <el-pagination @current-change="queryMaterielByPage" layout="prev, pager, next " :total="m_total_size">
                                </el-pagination>
                            </div>
                            <div class='buttons'>
                                <el-button type="primary" @click="addProductTableVisible = false">确定</el-button>
                            </div>

                        </el-tab-pane>
                    </el-tabs>
                </el-dialog>

                <div class="btn-box">
                <el-button class="btn-box" @click.native="showProductDialog" type="primary">新增其他入库产品</el-button>
                </div>
                
                <!-- 待入库产品列表 -->
                <el-table ref="productList" :data="productList" border highlight-current-row style="width: 100%">
                    <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-icon name="minus" @click.native="deleteProduct(scope.$index,productList)"></el-icon>
                        </template>
                    </el-table-column>
                    <el-table-column property="productName" label="产品名称"></el-table-column>
                    <el-table-column property="productNumber" label="产品编号"></el-table-column>
                    <el-table-column prop="repertoryId" label="所在仓库" width="200">
                        <template scope="scope">
                            <el-select v-model="scope.row.repertoryId" placeholder="请选择仓库" @change="getRegionListById" style='width:100%'>
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
                    <el-table-column property="repertoryQuantity" label="当前库存数量"></el-table-column>
                    <el-table-column prop="inspectionQuantity" label="质检数量">
                    </el-table-column>
                    <el-table-column prop="unqualifiedQuantity" label="不良数量">
                    </el-table-column>
                    <el-table-column prop="defectiveRate" label="不良率">
                    </el-table-column>
                    <el-table-column prop="statusName" label="质检状态">
                    </el-table-column>
                </el-table>

            
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
        initRepertoryList, //初始化所有仓库下拉列表

        OtherStorageDetailById, //查看列表信息

        getRegionListByRepertoryId, //根据选中仓库id,查看库位

        findOtherInstorageProduct, //查询新增产品列表

        findOtherInstorageMateriel, //查询新增物料列表

        editOtherStorage, //保存编辑

        findInventory // 更改库位  获取库存信息

    } from '../../../api/axiosInventoryQueryApi.js';

    import commonUtil from '../../../common/commonUtil.js';

    import {
        findProductInfo, //查询弹框列表
        findRepertoryNumberByCode, //根据产品编号查询产品库存数量
        queryProduceEnterDetailById, //根据id查看生产入库详情
        editProduceEnter, //确定保存
    } from '../../../api/axiosProduceEnterApi.js';

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
                    inboundTime: '', //入库时间
                    number: '', //入库单号
                    orderId: '', //关联生产订单号
                    batchNumber: '', //生产批号
                    remark: '', //备注
                    repertoryId: '', //所在仓库
                    repertoryRegionId: '', //所在库位
                    regionId: '',
                    warehousePeople: '', //入库人
                    type: "", //入库标记：submit代表提交入库，save代表保存入库单
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
                        message: '请输入关联生产订单号',
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
                userInfoVisible: false, //显示入库人弹框
                selectType: 0,
                amount: 0,
                // 绑定仓库ID
                resRepertoryId: ""
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
                var params = {
                    'id': _this.$route.query.produceEnterId,
                };
                OtherStorageDetailById(params).then(res => {
                    let {
                        code,
                        msg,
                        data
                    } = res;
                    if (code == 200) {
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
            getRegionListById(repertoryId) {
                this.amount++;
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
                    this.resRepertoryId = repertoryId;
                });
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
                        _this.formData.type = type; // 入库标记：
                        if (_this.productList.length == 0) {
                            _this.$message.warning("请选择一种入库产品");
                            return;
                        }
                        for(var i = 0;i<_this.productList.length;i++){
                            var item = _this.productList[i];
                            
                            if(item.regionId == undefined || item.regionId == ''){
                                _this.$message.warning('请选择入库库位!');
                                return;
                            }
                            if (item.quantity <= 0) {
                                _this.$message.warning('产品编号为【' + item.productNumber + '】的入库数量必须大于0!~');
                                return;
                            }

                        }
                        // 这个对象里不需要 这个list
                        delete _this.formData.list;
                        delete _this.formData.regionName;
                        delete _this.formData.repertoryName;
                        
                        var params = {
                            'otherStorage': _this.formData,
                            'productArr': _this.productList
                        };

                        editOtherStorage(params).then(res => {
                            let {
                                code,
                                msg,
                                data
                            } = res;
                            if (code == 200) {
                                _this.$message.success("编辑其他入库成功!");
                                _this.$router.push({
                                    name: 'OtherStorage'
                                });
                            } else if (code == 500) {
                                _this.$message.error("系统异常,编辑其他入库失败!");
                            } else if (code == 400) {
                                _this.$message.warning("参数错误!");
                            }
                        });
                      
                    } else {
                        _this.$message.error('请填写必填项!');
                        return false;
                    }
                });
            },

            //选中的物料
            handleCurrentChangeMateriel(val) {

                val.regionId = "";

                if (val.isCheck) {
                    val.isCheck = false;
                    var index = this.productList.indexOf(val);
                    this.productList.splice(index, 1);
                } else {
                    val.isCheck = true;
                    val.type = 0

                    this.productList.push(val);
                }
            },
            //选中的产品
            handleCurrentChangeProduct(val) {
                val.regionId = "";
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
            // 切换
            handleClick(tab, event) {
                this.addProductTableVisible = true;
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

            //搜索产品信息
            searchPropduct() {
                this.OtherStorageProductList();
            },

            //搜索物料信息
            searchMateriel() {
                this.OtherStorageMaterielList();
            },

            // 请求产品信息
            OtherStorageProductList() {;
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
                                _this.productList.forEach(function (selectedItem, i) {
                                    if (selectedItem.productNumber == item.number) {
                                        item.isCheck = true;
                                    }
                                });
                                item.productNumber = item.number;
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
                                _this.productList.forEach(function (selectedItem, i) {
                                    if (selectedItem.productNumber == item.number) {
                                        item.isCheck = true;
                                    }
                                });
                                item.productNumber = item.number;

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

            //展示弹框
            showProductDialog() {
                // 关键字置空
                this.select_word = "";
                this.m_select_word = "";
                // 请求产品信息
                this.OtherStorageProductList();
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

            ChangeLibraryLocation(resScope) {
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
            //点击取消  返回其他入库列表页面
            toProduceEnterList() {
                this.$router.push({
                    name: 'OtherStorage'
                });
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
            }
        }
    }

</script>
<style scoped>
    .btn-box{
       margin:10px 0px;
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

</style>