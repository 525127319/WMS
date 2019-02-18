<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <!-- <el-breadcrumb-item>
                    <i class="el-icon-menu"></i> 库存</el-breadcrumb-item> -->
                <el-breadcrumb-item><span class="inventory ventorImg"></span>库存调拨</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="请输入调拨单号搜索" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="addMove">新增</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
<el-table-column prop="stockOutDate" label="调拨时间">
</el-table-column>
<el-table-column prop="moveNum" label="调拨单号">
</el-table-column>
<!-- <el-table-column prop="postalOrder" label="出库总额">
            </el-table-column> -->
<el-table-column prop="originalRepertoryName" label="调出仓库">
</el-table-column>
<el-table-column prop="consignor" label="调出人">
</el-table-column>
<el-table-column prop="targetRepertoryName" label="调入仓库">
</el-table-column>
<el-table-column prop="consignee" label="收货人">
</el-table-column>
<el-table-column prop="remark" label="备注">
</el-table-column>
<el-table-column label="操作" width="180">
    <template scope="scope">
        <el-button size="small" type="primary" @click="queryDetail(scope.row,'details')">详情</el-button>
        <el-button size="small" type="info" v-show="scope.row.inOutStatus=='out'" @click="queryDetail(scope.row,'out')">调出</el-button>
        <el-button size="small" type="success" v-show="scope.row.inOutStatus=='in'" @click="queryDetail(scope.row,'in')">调入</el-button>
        <el-button type="success" size="mini" v-show="scope.row.inOutStatus=='closed'" @click="queryDetail(scope.row,'completed')">
            <i class="el-icon-circle-check" style="margin-right: 1px"></i>已完成</el-button>
</template>
</el-table-column>
</el-table>
<div class="pagination">
    <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next, jumper" :total="total_size">
    </el-pagination>
</div>
<!-- 查看详情 -->
<el-dialog title="调拨详情" size='large' :visible.sync="dialogTableVisible">
    <el-form ref="formData" :model="formData">
        <el-form-item label="调出时间">
            <el-col :span="5">
                <el-date-picker type="date" readonly placeholder="选择日期" v-model="formData.stockOutDate" style="width: 100%;"></el-date-picker>
</el-col>
</el-form-item>
<el-form-item label="调入时间">
    <el-col :span="5">
        <el-date-picker type="date" readonly placeholder="选择日期" v-model="formData.stockInDate" style="width: 100%;"></el-date-picker>
</el-col>
</el-form-item>
<el-form-item label="调拨单号">
    <el-col :span="5">
        <el-input v-model="formData.moveNum" readonly></el-input>
    </el-col>
</el-form-item>
<el-form-item label="调出仓库">
    <el-col :span="5">
        <el-input v-model="formData.originalRepertoryName" readonly></el-input>
    </el-col>
</el-form-item>
<el-form-item label="调出人">
    <el-col :span="5">
        <el-input v-model="formData.consignor" readonly></el-input>
    </el-col>
</el-form-item>
<el-form-item label="调入仓库">
    <el-col :span="5">
        <el-input v-model="formData.targetRepertoryName"></el-input>
    </el-col>
</el-form-item>
<el-form-item label="收货人">
    <el-col :span="5">
        <el-input v-model="formData.consignee"></el-input>
    </el-col>
</el-form-item>
<el-form-item label="关联订单号">
    <el-col :span="5">
        <el-input v-model="formData.orderNumber"></el-input>
    </el-col>
</el-form-item>
<el-form-item label="备注">
    <el-col :span="5">
        <el-input v-model="formData.remark"></el-input>
    </el-col>
</el-form-item>
</el-form>
<!--已完成-->
<el-table :data="boxDetaillist" style="width: 100%" v-if="typeName=='completed'" >
<el-table-column prop="categoryName" label="类型">
</el-table-column>
<el-table-column prop="productName" label="产品名称">
</el-table-column>
<el-table-column prop="barCode" label="二维码">
</el-table-column>
<el-table-column prop="barCodeQuantity" label="箱单库存数量">
</el-table-column>
<el-table-column prop="moveQuantity" label="调拨数量">
</el-table-column>
<el-table-column prop="status" label="调拨状态">
</el-table-column>
</el-table>
<!--其他状态下的详情-->
<el-table :data="moveDetailList" style="width: 100%" v-else >
<el-table-column prop="productName" label="产品名称">
</el-table-column>
<el-table-column prop="number" label="产品编号">
</el-table-column>
<el-table-column prop="specification" align='center' min-width='240' label="规格">
</el-table-column>
<el-table-column prop="moveQuantity" label="计划调拨数量" align='center'></el-table-column>
<el-table-column prop="unitName" label="单位" align='center'></el-table-column>

</el-table>
</el-dialog>

</div>
</template>
<script>
    import {
        findMoveInfoByPage,//查询调拨列表
        findMoveInfoById,//根据ID查看详情
        submitEditMoveInfo,//保存 提交调拨信息
    } from '../../../api/axiosRepertoryMoveApi';
    import commonUtil from '../../../common/commonUtil';

    export default {
        data() {
            return {
                formData: {},//详情
                submitFormData: {},//保存提交
                tableData: [],
                cur_page: 1,
                select_word: '',
                total_size: 0,
                dialogTableVisible: false,
                submitDialogTableVisible: false,
                moveDetailList: [],//调拨详情list
                boxDetaillist: [],//已完成状态下的调拨详情list
                submitMoveDetailList: [],//提交调拨信息list
                repertoryList: [],//库位list
                regionList: [],//库区list
                barCodeList: [],//二维码集合
                AlreadyGetbarCodeList: [],//缓存二维码
                isThis: 0, //记录点击的
                isShowList: false,
                typeName: ''
            }
        },
        created() {
            this.getData();
        },
        methods: {
            //分页
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getData() {
                let _this = this;
                var params = { 'cur_page': _this.cur_page, 'moveNum': _this.select_word };
                findMoveInfoByPage(params).then(res => {
                    let { code, msg, data } = res;
                    if (code == 200) {
                        data.data.forEach(function (item) {
                            item.stockOutDate = commonUtil.formatDateTime(item.stockOutDate);
                        });
                        _this.tableData = data.data;
                        _this.total_size = data.totalSize;
                    } else if (code == 14000) {
                        _this.tableData = [];
                        _this.total_size = 0;
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    }
                });
            },
            //去箱单新增页面
            addMove() {
                this.$router.push({ name: 'addMove' });
            },
            //搜索
            search() {
                this.getData();
            },

            //查看详情
            queryDetail(data, type) {

                if (type == 'out') {
                    this.$router.push({
                        name: 'moveOut',
                        query: {
                            id: data.id,
                            type: 'out'
                        }
                    })
                    return;
                } else if (type == 'in') {
                    this.$router.push({
                        name: 'moveOut',
                        query: {
                            id: data.id,
                            type: 'in'
                        }
                    })
                    return;
                }

                const _this = this;
                let params = { 'id': data.id };
                this.typeName = type;
                findMoveInfoById(params).then(res => {
                    let { code, msg, data } = res;
                    if (code == 200) {
                        if (type === 'completed') {
                            _this.dialogTableVisible = true;
                            _this.formData = data.move;
                            for (let item of data.boxDetaillist) {
                                item.status = item.status == 'in' ? '调入' : '调出';
                            };
                            _this.boxDetaillist = data.boxDetaillist;
                        } else {
                            _this.dialogTableVisible = true;
                            _this.formData = data.move;
                            _this.moveDetailList = data.list;
                        }
                    }  else {
                         _this.boxDetailList = [];
                        _this.moveDetailList = [];
                        _this.$message.error(msg);
                    }
                });

            },

        }
    }
</script>
<style scoped>
.el-form-item {
    float: left;
    width: 50%;
}

.el-col-5 {
    width: 340px;
}

.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.buttons {
  overflow: hidden;
  padding: 1rem 0;
}
.buttons > * {
  margin-left: 32px;
  float: right;
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