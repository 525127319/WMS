<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/box'}">
                    <i class="el-icon-menu"></i> 箱单管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑箱单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item prop="serialNumber" label="流水号">
                    <el-input v-model="form.serialNumber" readonly></el-input>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker type="date" :editable="false" placeholder="选择日期" v-model="form.boxDate" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item prop="postalOrder" label="P.O.">
                    <el-input v-model="form.postalOrder" readonly></el-input>
                </el-form-item>
                <el-form-item prop="barCode" label="条码">
                    <el-input v-model="form.barCode" readonly></el-input>
                </el-form-item>
                <el-form-item prop="weight" label="重量">
                    <el-input type="number" v-model="form.weight"></el-input>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
                <el-button @click.native="showDialog" type="primary">新增箱单详情</el-button>

                <el-table ref="boxDetailList" border :data="boxDetailList" highlight-current-row style="width: 100%">
                    <el-table-column property="name" label="物料名称">
                    </el-table-column>
                    <el-table-column property="number" label="物料编号">
                    </el-table-column>
                    <el-table-column property="specification" label="规格">
                    </el-table-column>
                    <el-table-column property="quantity" label="数量">
                        <template scope="scope">
                            <el-input-number :controls="false" size="small" placeholder="单位默认千克(kg)" v-model="scope.row.quantity" />
                        </template>
                    </el-table-column>
                    <el-table-column property="unitName" label="单位">
                    </el-table-column>
                </el-table>
                <!-- <el-form-item>
                    <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                    <el-button @click="toBox">取消</el-button>
                </el-form-item> -->
                <el-dialog title="物料列表" size="small" v-model="addTableVisible" :close-on-click-modal="false">
                    <el-col :span="10">
                        <el-input v-model="select_word" placeholder="请输入物料名称或编号" class="handle-input"></el-input>
                    </el-col>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                    <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChange" style="width: 100%">
                        <el-table-column property="name" label="物料名称">
                        </el-table-column>
                        <el-table-column property="number" label="物料编号">
                        </el-table-column>
                        <el-table-column property="specification" label="规格">
                        </el-table-column>
                        <el-table-column property="unitName" label="单位">
                    </el-table-column>
                    </el-table>
                    <div class="pagination ">
                        <el-pagination @current-change="queryByPage" layout="total,prev, pager, next,jumper " :total="total_size ">
                        </el-pagination>
                    </div>
                    <!-- <el-form-item>
                            <el-button type="primary" @click="addTableVisible = false">确定</el-button>
                            <el-button @click="addTableVisible = false">取消</el-button>
                            </el-form-item> -->
                </el-dialog>
            </el-form>
        </div>
        <div class='buttons'>
            <el-button @click="toBox">返回</el-button>
            <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        </div>
    </div>
</template>
<script>
import {
    findProductInfo,//弹窗商品列表
    editBoxInfo,//确定保存箱单
    findBoxDetailById,//编辑时回显数据
} from '../../api/axiosapi';
import commonUtil from '../../common/commonUtil';
export default {
    data() {
        return {
            form: {
                id: '',
                serialNumber: '',//流水号
                postalOrder: '', //箱单P.O.
                boxDate: '', //箱单日期
                barCode: '', //条形码
                weight: 0,  //重量
                unitId: '',//重量单位id
                remark: '', //备注
                detailId: '',//箱单详情id
                verifier: '',//审核人
            },
            rules: {
                serialNumber: [{ required: true, message: '请输入流水号', trigger: 'blur' }],
                postalOrder: [{ required: true, message: '请输入P.O.', trigger: 'blur' }],
               // boxDate: [{ required: true, message: '请选择箱单日期', trigger: 'change' }],
                barCode: [{ required: true, message: '请输入条码', trigger: 'blur' }],
               // weight: [{ required: false, message: '请输入重量,只能为数字', trigger: 'blur' }],
                remark: [{ required: false, message: '请输入备注', trigger: 'blur' }]
            },
            addTableVisible: false,//是否显示弹框
            select_word: '',//关键字
            total_size: 0,
            cur_page: 1,
            productTable: [],//弹框中列表
            boxDetailList: [],//存储从弹框中选中的物料明细
        }
    },
    created() {
        this.initBoxInfoAndProductInfo();
    },
    methods: {
        onSubmit(formName) {
            var _this = this;

            _this.$refs[formName].validate(function(valid) {
                if (valid) {
                    var boxListInfo = new Object();
                    boxListInfo.id = _this.form.id;
                    boxListInfo.detailId = _this.form.detailId;
                    boxListInfo.verifier = _this.form.verifier;//审核人
                    boxListInfo.postalOrder = _this.form.postalOrder;
                    boxListInfo.serialNumber = _this.form.serialNumber;
                    boxListInfo.barCode = _this.form.barCode;
                    boxListInfo.weight = _this.form.weight;
                    boxListInfo.unitId = _this.form.unitId;//箱单重量单位id
                    if (_this.form.boxDate == undefined || _this.form.boxDate == null) {
                        _this.$message.warning("请选择日期!");
                        return;
                    }
                    boxListInfo.boxDate = commonUtil.formatDateTime(_this.form.boxDate);
                    boxListInfo.remark = _this.form.remark;
                    boxListInfo.productId = _this.boxDetailList[0].id;
                    boxListInfo.number = _this.boxDetailList[0].number;
                    boxListInfo.name = _this.boxDetailList[0].name;
                    boxListInfo.specification = _this.boxDetailList[0].specification;
                    boxListInfo.productUnitName = _this.boxDetailList[0].unitName;
                    boxListInfo.type = _this.boxDetailList[0].type;
                    if (_this.boxDetailList[0].quantity <= 0) {
                        _this.$message.error("数量必须大于0");
                        return;
                    }
                    boxListInfo.quantity = _this.boxDetailList[0].quantity;
                    var params = { 'boxListInfo': boxListInfo };
                    editBoxInfo(params).then(res => {
                        let { code, msg, data } = res;
                        if (code == 200) {
                            _this.$message.success("修改箱单信息成功!");
                            _this.$router.push({ name: 'box' });
                        } else if (code == 500) {
                            _this.$message.error("系统异常,修改箱单信息失败!");
                        } else if (code == 400) {
                            _this.$message.warning("参数错误!");
                        }

                    });
                } else {
                    _this.$message.error('提交失败!');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //回显箱单信息 和箱单详情
        initBoxInfoAndProductInfo() {
            var _this = this;
            var params = { 'id': _this.$route.query.boxId };

            findBoxDetailById(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.form = data.boxListInfoVo;
                    var productInfo = new Object();
                    productInfo.name = data.boxListInfoVo.name;
                    productInfo.number = data.boxListInfoVo.number;
                    productInfo.specification = data.boxListInfoVo.specification;
                    productInfo.quantity = data.boxListInfoVo.quantity;
                    productInfo.unitName = data.boxListInfoVo.productUnitName;
                    productInfo.type = data.boxListInfoVo.type;
                    _this.boxDetailList = [];
                    _this.boxDetailList.push(productInfo);
                } else if (code == 500) {
                    _this.$message.error("系统异常!");
                } else if (code == 400) {
                    _this.$message.warning("参数不合法!");
                } else if (code == 14000) {
                    _this.$message.warning("无数据!");
                    _this.$router.push({ name: 'box' });
                }
            });

        },
        //点击取消去箱单列表页面
        toBox() {
            this.$router.push({ name: 'box' });
        },
        //显示弹窗
        showDialog() {
            this.addTableVisible = true;
            this.select_word = '';
            this.queryProductList();
        },
        queryProductList() {
            var _this = this;

            var params = { 'currentPage': this.cur_page, 'keyWords': this.select_word };

            findProductInfo(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
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
            });
        },
        search() {
            this.queryProductList();
        },
        //当某一行被点击时会触发该事件	
        handleCurrentChange(val) {
            this.addTableVisible = false;
            this.boxDetailList = [];
            this.boxDetailList.push(val);
        },
        //上一页下一页
        queryByPage(val) {
            this.cur_page = val;
            this.queryProductList();
        },
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
.buttons{
    overflow: hidden;
    padding: 1rem 0 ;
}
.buttons>*{
    margin-left:32px;
    float: right;
}
</style>