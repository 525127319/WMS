<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/materialStock'}">
                    <i class="el-icon-date"></i> 备料单</el-breadcrumb-item>
                <el-breadcrumb-item>编辑备料单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="备料时间">
                    <el-col :span="10">
                        <el-date-picker :editable="false" type="date" placeholder="选择日期" v-model="form.produceTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item prop="number" label="备料单号">
                    <el-col :span="10">
                        <el-input v-model="form.number" readonly></el-input>
                    </el-col>
                </el-form-item>

                <el-form-item prop="preparesMaterialsPeople" label="备料人">
                    <el-col :span="10">
                        <!-- selectType='领料人'; -->
                        <el-input v-model="form.preparesMaterialsPeople" readonly @click.native="showZtreeTable(0)"></el-input>
                    </el-col>
                </el-form-item>
                <!-- 显示人事ztree弹框 -->
                <user-info-com v-show="userInfoVisible" @user-info="displayPeopleName"></user-info-com>

                <el-form-item prop="remark" label="备注">
                    <el-col :span="10">
                        <el-input type="textarea" v-model="form.remark"></el-input>
                    </el-col>
                </el-form-item>
                <el-button @click.native="showDialog" type="primary">新增备料材料明细</el-button>
                
                <el-table ref="materialDetailList" :data="materialDetailList" border highlight-current-row style="width: 100%">
                    <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-icon name="minus" @click.native="deleteProduct(scope.$index,materialDetailList)"></el-icon>
                        </template>
                    </el-table-column>
                    <el-table-column property="name" label="材料名称"></el-table-column>
                    <el-table-column property="number" label="材料编号"></el-table-column>
                    <el-table-column property="specification" label="规格"></el-table-column>
                    <el-table-column property="requiredQuantity" label="计划备料数量"></el-table-column>

                    <el-table-column property="quantity" label="备料数量">
                        <template scope="scope">
                            <el-input-number :controls="false" size="small" v-model="scope.row.quantity" />
                        </template>
                    </el-table-column>
                    <el-table-column property="unitName" label="单位"></el-table-column>
                    <el-table-column property="repertoryName" label="所在仓库"></el-table-column>
                    <el-table-column property="regionName" label="所在库位"></el-table-column>
                    <el-table-column property="repertoryQuantity" label="剩余库存"></el-table-column>
                    <el-table-column property="purpose" label="用途"></el-table-column>
                </el-table>
                <!-- <el-form-item>
                    <el-popover ref="popover1" width="200" trigger="hover" content="如果提交后,此领料单不可编辑!请谨慎">
                    </el-popover>
                    <el-button v-popover:popover1 type="primary" @click="onSubmit('form',0)">保存并提交</el-button>
                    <el-popover ref="popover2" width="200" trigger="hover" content="此保存按钮为保存数据使用,可编辑!如果确认无误后,请点击提交按钮">
                    </el-popover>
                    <el-button v-popover:popover2 type="success" @click="onSubmit('form',1)">保存为草稿</el-button>
                    <el-button @click="toMaterialStockList">取消</el-button>
                </el-form-item> -->

                <el-dialog title="物料列表" size="large" v-model="addTableVisible" :close-on-click-modal="false">
                    <el-col :span="10">
                        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input"></el-input>
                    </el-col>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                    <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChange" style="width: 100%">
                        <el-table-column property="name" label="材料名称">
                        </el-table-column>
                        <el-table-column property="number" label="材料编号">
                        </el-table-column>
                        <!-- add start -->
                        <el-table-column property="specification" label="规格">
                        </el-table-column>
                        <!-- <el-table-column property="unitPriceExcludingTax" label="成本单价">
                                            </el-table-column> -->
                        <el-table-column property="repertoryName" label="所在仓库">
                        </el-table-column>
                        <el-table-column property="regionName" label="所在库位">
                        </el-table-column>
                        <el-table-column property="repertoryQuantity" label="剩余库存">
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
                        <el-pagination @current-change="queryByPage" layout="prev, pager, next " :total="total_size ">
                        </el-pagination>
                    </div>
                    <!-- <el-form-item> -->
                    <div class='buttons'>
                        <el-button type="primary" @click="addTableVisible = false">确定</el-button>
                        <el-button @click="addTableVisible = false">取消</el-button>
                    </div>
                    <!-- </el-form-item> -->
                </el-dialog>
            </el-form>
        </div>
        <div class='buttons'>
            <el-popover ref="popover1" width="200" trigger="hover" content="如果提交后,此领料单不可编辑!请谨慎"></el-popover>
            <el-button v-popover:popover1 type="primary" @click="onSubmit('form',0)">保存并提交</el-button>
            <el-popover ref="popover2" width="200" trigger="hover" content="此保存按钮为保存数据使用,可编辑!如果确认无误后,请点击提交按钮"></el-popover>
            <el-button v-popover:popover2 type="success" @click="onSubmit('form',1)">保存为草稿</el-button>
            <el-button @click="toMaterialStockList">取消</el-button>
        </div>
    </div>
</template>

<script>
import commonUtil from '../../../common/commonUtil.js';
import userInfoCom from '../../page/start';
import {
    findAddMaterialsInfoByMaterialswebApi,
} from '../../../api/axiosMaterialPickingApi';
import {
    editMaterialStock,//编辑备料单
    findProducePreparesDetailById,//编辑回显
} from '../../../api/axiosMaterialStockApi';

export default {
    components: {
        userInfoCom
    },
    data: function() {
        return {
            form: {
                id: '',//备料单id
                produceTime: '',//备料时间
                number: '11',//备料单号
                preparesMaterialsPeople: '',//备料人
                produceResion: '备料原因即用途',//用途
                verifier: '审核人暂不用',//审核人
                remark: '',//备注
                type: 0,//备料类型:0-已生产备料，1-待备料备料
                preparesMaterialsSource: 2,//备料单来源:2-本地web生产备料单，3-生产计划生产备料单
            },
            rules: {
                number: [{ required: true, message: '请输入备料单号', trigger: 'blur' }],
                preparesMaterialsPeople: [{ required: true, message: '请选择备料人', trigger: 'change' }],
                remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
            },
            userInfoVisible: false, //领料人弹框标记
            addTableVisible: false,//物料列表弹框
            repertoryList: [],//仓库id 仓库名称下拉框
            regionList: [],//库位id 库位名称下拉框
            materialDetailList: [],//选中后的物料明细数组
            productTable: [],//物料列表
            select_word: '',//关键字
            total_size: 0,//总记录数
            cur_page: 1,//当前页码
            count: 0,
            selectType: 0,
        }
    },
    created() {
        this.findProducePreparesDetailById();
    },
    methods: {
        //确定保存
        onSubmit(formName, type) {
            var _this = this;
            _this.$refs[formName].validate(function(valid) {
                if (valid) {
                    if (_this.form.produceTime == undefined || _this.form.produceTime == '') {
                        _this.$message.warning('请选择备料时间!');
                        return;
                    }
                    _this.form.produceTime = commonUtil.formatDateTime(_this.form.produceTime);
                    _this.form.type = type;
                    delete _this.form.createTime;
                    delete _this.form.creator;
                    delete _this.form.delFlag;
                    delete _this.form.updateTime;
                    delete _this.form.updator;
                    var params = { 'producePreparesMaterials': _this.form, 'productArr': _this.materialDetailList };

                    console.log(JSON.stringify(params));
                    if (_this.materialDetailList.length == 0) {
                        _this.$message.warning('请选择备料材料!');
                        return;
                    }
                    var flag = false;
                    _this.materialDetailList.forEach(function(value, index) {
                        if (value.quantity <= 0) {
                            _this.$message.warning('备料数量必须大于0!');
                            //return;
                            flag = true;
                        }
                    });

                    if (!flag) {
                        editMaterialStock(params).then(res => {
                            let { code, msg, data } = res;
                            if (code == 200) {
                                _this.$message.success('编辑备料单信息成功!');
                                _this.$router.push({ name: 'materialStock' })
                            } else if (code == 14001) {
                                _this.$message.error('编辑备料单信息失败!');
                            } else if (code == 500) {
                                _this.$message.error('系统错误,编辑备料单信息失败!');
                            }
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        //从物料明细表中删除物料明细
        deleteProduct(index, row) {
            row.isCheck = false;
            this.materialDetailList.splice(index, 1);
        },
        //搜索物料
        search() {
            this.queryMaterialList();
        },

        handleCurrentChange(val) {
            //console.log(row)
            if (val.isCheck) {
                val.isCheck = false;
                var index = this.materialDetailList.indexOf(val);
                this.materialDetailList.splice(index, 1);
            } else {
                val.isCheck = true;
                this.materialDetailList.unshift(val);
            }
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
            findAddMaterialsInfoByMaterialswebApi(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    // console.log("-------------" + JSON.stringify(data.list));
                    if (_this.materialDetailList != null) {
                        data.list.forEach(function(item, index) {
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
        //显示弹窗
        showDialog() {
            this.addTableVisible = true;
            this.queryMaterialList();
        },

        //点击取消,去备料料单列表
        toMaterialStockList() {
            this.$router.push({ name: 'materialStock' });
        },
        //初始化
        findProducePreparesDetailById() {
            var _this = this;
            var params = { 'id': _this.$route.query.materialStockId };
            findProducePreparesDetailById(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                    _this.form = data.producePreparesMaterials;
                    _this.materialDetailList = data.productVoList;
                } else if (code == 500) {
                    _this.$message.error("系统异常!");
                } else if (code == 400) {
                    _this.$message.warning("参数不合法!");
                }
            });
        },
        displayPeopleName(param) {
            if (this.selectType == 0) {
                if (param.length == 0) {
                    this.form.preparesMaterialsPeople = '';
                } else {
                    this.form.preparesMaterialsPeople = param[0].realName;
                }
            } else if (this.selectType == 1) {

                if (param.length == 0) {
                    this.form.verifier = '';
                } else {
                    this.form.verifier = param[0].realName;
                }
            }

        },
        //
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
</style>