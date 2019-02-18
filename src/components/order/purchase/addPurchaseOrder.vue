<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/purchaseOrder'}">
                    <span class="purchase voterIcon"></span>采购订单入库</el-breadcrumb-item>
                <el-breadcrumb-item>新增采购订单入库</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='form-box'>
            <el-form ref="formData" :rules="rules" :model="formData">
                <el-form-item label="入库时间" prop="stockInDate">
                    <el-col :span="10">
                        <el-date-picker :editable="false" type="date" format="yyyy-MM-dd" placeholder="选择入库时间" v-model="formData.stockInDate"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="单据来源" prop="number">
                    <el-select v-model="formData.chooseType" @change="reset" placeholder="请选择单据来源">
                        <el-option v-for="item in typeArr" :key="item.value" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入库单号" prop="number">
                    <el-col :span="10">
                        <el-input v-model="formData.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                <!--<el-form-item label="入库仓库" prop="repertoryId">
                    <el-select v-model="formData.repertoryId" placeholder="请选择仓库" @change="getRegionListById">
                        <el-option v-for="item in repertoryList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入库库位" prop="repertoryRegionId">
                    <el-select v-model="formData.repertoryRegionId" placeholder="请选择库位">
                        <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>-->
                <div v-if="!isCustomerProvide">
                    <el-form-item label="质检单号">
                        <el-col :span="10">
                            <el-input v-model="formData.qualityId" :placeholder="placeholderInfo" readonly @click.native="ChoiceInspect(0)"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="客户名称" prop="customerName">
                        <el-col :span="10">
                            <el-input v-model="formData.customerName" placeholder='请输入客户' v-on:input="inputFuc"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="客户地址">
                        <el-col :span="10">
                            <el-input v-model="formData.customerAddress"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="关联生产订单号">
                        <el-col :span="10">
                            <el-input v-model="formData.relatedOrderNumber"></el-input>
                        </el-col>
                    </el-form-item>
                </div>
                <div v-else>
                    <el-form-item label="关联采购订单号" prop="orderNumber">
                        <el-col :span="10">
                            <el-input v-model="formData.orderNumber" readonly @click.native="showDialog('purchase')" placeholder='请选择采购订单'></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="供应商名称" prop="name">
                        <el-col :span="10">
                            <el-input v-model="formData.name" readonly></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="关联生产订单号">
                        <el-col :span="10">
                            <el-input v-model="formData.relatedOrderNumber" readonly></el-input>
                        </el-col>
                    </el-form-item>
                </div>
                <el-form-item label="入库人" prop="verifier">
                    <el-col :span="10">
                        <el-input v-model="formData.verifier" readonly @click.native="showEnterPersonTable"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-col :span="10">
                        <el-input type="textarea" v-model="formData.remark"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <!--新增-->
            <el-dialog title="采购订单列表" v-model="addTableVisible" :close-on-click-modal="false">
                <el-input v-model="select_word" placeholder="请输入单据号搜索" class="handle-input"></el-input>
                <el-button type="primary" icon="search" @click="search('purchase')">搜索</el-button>
                <el-table ref="purchaseOrderList" :data="purchaseOrderList" highlight-current-row @row-click="handleCurrentChange" style="width: 100%">
<el-table-column property="planCode" label="单据号">
</el-table-column>
<el-table-column property="createId" label="申请人">
</el-table-column>
<el-table-column property="deptName" label="申请人所在部门">
</el-table-column>
<el-table-column prop="ventor.ventorName" label="供应商">
</el-table-column>
</el-table>
<div class="pagination ">
    <el-pagination @current-change="queryByPage" layout="total,prev, pager, next,jumper " :total="total_size">
    </el-pagination>
</div>
</el-dialog>
<!--<el-button type="primary" v-if="isShowADD && !isCustomerProvide" @click="showDialog('customer_provide')">新增BOM清单</el-button>-->
<div v-show="isCustomerProvide">
    <!-- 采购 -->
    <el-table ref="productList" border :data="productList" highlight-current-row style="width: 100%">
<el-table-column property="productName" label="物料名称">
</el-table-column>
<el-table-column property="productNumber" label="物料编号">
</el-table-column>
<el-table-column property="specification" label="物料规格">
</el-table-column>
<el-table-column property="purchaseProductNumber" label="计划采购数量">
</el-table-column>
<el-table-column property="arrivalQuantity" label="入库数量">
    <template scope="scope">
        <el-input-number v-model="scope.row.arrivalQuantity" :disabled="scope.row.purchaseProductNumber==scope.row.repertoryQuantity"
            :controls="false" size="small" />
    </template>
</el-table-column>
<el-table-column property="unitName" label="单位">
</el-table-column>
<el-table-column property="repertoryQuantity" label="已入库数量">
</el-table-column>
<el-table-column property="inspectionQuantity" label="质检数量">
</el-table-column>
<el-table-column property="unqualifiedQuantity" label="不合格数量">
</el-table-column>
<el-table-column property="defectiveRate" label="不良率">
</el-table-column>
<el-table-column property="repertoryId" label="入库仓库">
    <template scope="scope">
        <el-select v-model="scope.row.repertoryId" placeholder="请选择仓库" @change="getRegionListById">
            <el-option v-for="item in repertoryList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
        </el-select>
    </template>
</el-table-column>
<el-table-column property="regionId" label="入库库位">
    <template scope="scope">
        <el-select v-model="scope.row.regionId" placeholder="请选择库位">
            <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
        </el-select>
    </template>
</el-table-column>
<el-table-column property="barCode" label="二维码">
    <template scope="scope">
        <el-input v-model="scope.row.barCode" @focus="setinputInfo('',scope.$index)" @change="setinputInfo($event,scope.$index)"
        />

        <ul class="response" v-show="(barCodeList.length>0 && isShowList) && isThis==scope.$index">
            <li v-for="(item,index) in barCodeList" :key="index" v-text="item" v-on:click="setbarCode(item,scope.row,isShowList=false)"></li>
        </ul>
    </template>

</el-table-column>
<el-table-column property="productQualityStatus" :formatter="productQualityStatusStr" label="物料质检状态">
</el-table-column>
</el-table>
</div>
<div v-show="!isCustomerProvide">
    <!-- 客供 -->
    <el-table ref="productList" border :data="productList" highlight-current-row style="width: 100%">
<el-table-column label="操作" width="100">
    <template scope="scope">
        <el-icon name="minus" @click.native="deleteProduct(scope.$index,productList)"></el-icon>
    </template>
</el-table-column>
<el-table-column property="productName" label="物料名称">
</el-table-column>
<el-table-column property="productNumber" label="物料编号">
</el-table-column>
<el-table-column property="specification" label="物料规格">
</el-table-column>
<el-table-column property="purchaseProductNumber" label="计划采购数量">
</el-table-column>
<el-table-column property="arrivalQuantity" label="入库数量">
    <template scope="scope">
        <el-input-number v-model="scope.row.arrivalQuantity" :controls="false" size="small" />
    </template>
</el-table-column>
<el-table-column property="unitName" label="单位">
</el-table-column>
<el-table-column property="repertoryQuantity" label="已入库数量">
</el-table-column>

<el-table-column property="inspectionQuantity" label="质检数量">
</el-table-column>
<el-table-column property="unqualifiedQuantity" label="不合格数量">
</el-table-column>
<el-table-column property="defectiveRate" label="不良率">
</el-table-column>
<el-table-column property="repertoryId" label="入库仓库">
    <template scope="scope">
        <el-select v-model="scope.row.repertoryId" placeholder="请选择仓库" @change="getRegionListById">
            <el-option v-for="item in repertoryList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
        </el-select>
    </template>
</el-table-column>
<el-table-column property="regionId" label="入库库位">
    <template scope="scope">
        <el-select v-model="scope.row.regionId" placeholder="请选择库位">
            <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
        </el-select>
    </template>
</el-table-column>
<el-table-column property="barCode" label="二维码">
    <template scope="scope">
        <el-input v-model="scope.row.barCode" @focus="setinputInfo('',scope.$index)" @change="setinputInfo($event,scope.$index)"
        />

        <ul class="response" v-show="(barCodeList.length>0 && isShowList) && isThis==scope.$index">
            <li v-for="(item,index) in barCodeList" :key="index" v-text="item" v-on:click="setbarCode(item,scope.row,isShowList=false)"></li>
        </ul>
    </template>

</el-table-column>
<el-table-column property="productQualityStatus" :formatter="productQualityStatusStr" label="物料质检状态">
</el-table-column>
</el-table>
</div>


<el-dialog title="产品列表" v-model="addProductTableVisible" :close-on-click-modal="false">
    <el-input v-model="select_word" placeholder="请输入产品名称或产品编号搜索" class="handle-input"></el-input>
    <el-button type="primary" icon="search" @click="search('customer_provide')">搜索</el-button>
    <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleProductCurrentChange" style="width: 100%">
<el-table-column property="name" label="产品名称">
</el-table-column>
<el-table-column property="number" label="产品编号">
</el-table-column>
<!-- <el-table-column property="specification" label="产品规格">
                    </el-table-column> -->
<el-table-column prop="unitName" label="单位">
</el-table-column>
<el-table-column prop="isCheck" label="是否选中">
    <template scope="scope">
        <el-icon name="check" v-if="scope.row.isCheck"></el-icon>
    </template>
</el-table-column>
</el-table>
<div class="pagination ">
    <el-pagination @current-change="queryProductByPage" layout="total,prev,pager,next,jumper" :total="total_size">
    </el-pagination>
</div>
<div class='buttons'>
    <el-button type="primary" @click="addProductTableVisible = false">确定</el-button>
</div>
</el-dialog>
<!--模态框 质检单号-->
<el-dialog title="质检单号列表" :visible.sync="centerDialogVisible" width="80%" center>
    <el-table ref="qualitytestingList" :data="qualitytestingList" highlight-current-row @row-click="handleQualitytesting" style="width: 100%">
<el-table-column property="qualityTime" :formatter="formatterInboundTime" label="质检时间">
</el-table-column>
<el-table-column property="number" label="质检编号">
</el-table-column>
<el-table-column property="relatedOrderNumber" label="关联订单号">
</el-table-column>
<el-table-column property="qualityPeople" label="质检人">
</el-table-column>
</el-table>
<div class="pagination ">
    <el-pagination layout="total,prev, pager,next,jumper" :total="total_size " @current-change="queryProductListByPage">
    </el-pagination>
</div>
</el-dialog>
<!--模态框 客户列表-->
<!--<el-dialog title="客户列表" :visible.sync="customerDialogVisible" width="80%" center>
                <el-input v-model="select_word" placeholder="请输入客户编号或客户名称搜索" class="handle-input"></el-input>
                <el-button type="primary" icon="search" @click="searchCustomer()">搜索</el-button>
                <el-table ref="customerList" :data="customerList" highlight-current-row @row-click="handleCustomer" style="width: 100%">
                    <el-table-column property="code" label="客户编号">
                    </el-table-column>
                    <el-table-column property="customerName" label="客户名称">
                    </el-table-column>
                    <el-table-column property="customerAddress" label="客户地址">
                    </el-table-column>
                </el-table>
                <div class="pagination ">
                    <el-pagination @current-change="queryCustomerByPage" layout="total,prev, pager,next,jumper" :total="total_size ">
                    </el-pagination>
                </div>
            </el-dialog>-->
<!-- 待入库产品列表 -->
<user-info-com v-show="userInfoVisible" @user-info="displayEnterPersonName"></user-info-com>
</div>
<div class='buttons'>
    <el-button @click="goBack();">返回</el-button>
    <el-button type="success" @click="onSubmit('formData','save')">保存为草稿</el-button>
    <el-button type="primary" @click="onSubmit('formData','submit')">保存并提交</el-button>
</div>
</div>
</template>

<script>
import {
  initRepertoryList,
  getRegionListByRepertoryId,
  addPurchaseOrder,
  initPurchaseOrderNumber,
  getPurchaseOrderProductByCode,
  initNumber,
  findRepertoryQuality, //查询质检单列表
  findRepertoryQualityDetail, //查询质检单物料质检状态
  findProductInfo, //查询所有产品
  findMaterialByProductCode, //根据产品编号查询产品下的物料信息
  findCustomerInfo, //查看所有客户列表
  getCodeBySeqName,
  findBarCode, //查看二维码
  checkIfNeedInint, //查寻二维码是否需要初始化
  InitializationBarCode //初始化二维码
} from "../../../api/axiosPurchaseOrderApi";
import commonUtil from "../../../common/commonUtil.js";
import userInfoCom from "../../page/start";
//import getCodeBySeqName from "../../../api/axiosapi.js";
export default {
  components: {
    userInfoCom
  },
  computed: {
    //是否为客户提供    单据来源为采购系统是 isCustomerProvide 为true
    isCustomerProvide: function() {
      return this.formData.chooseType != "customer_provide";
    }
  },
  data: function() {
    return {
      formData: {
        stockInDate: new Date(), //入库时间
        number: "", //入库单号
        orderNumber: "", //关联采购订单号
        relatedOrderNumber: "", //关联订生产单号
        supplierId: "", //供应商id
        name: "", //供应商名称
        repertoryId: "", //所在仓库
        repertoryRegionId: "", //所在库位
        verifier: sessionStorage.getItem("currentLoginUser"), //入库人
        remark: "", //备注
        statusName: "", //质检状态
        wayName: "", //质检方式
        type: "", //save OR submit
        customerNumber: "", //客供单号
        customerName: "", //客户名称
        customerAddress: "", //客户地址
        chooseType: "purchase", //订单来源(客户提供、采购订单)
        qualityId: "" //客供质检单号
      },
      rules: {
        // stockInDate: [{ type: 'date', required: true, message: '请选择入库时间', trigger: 'change' }],
        number: [
          {
            required: true,
            message: "请输入入库单号",
            trigger: "blur"
          }
        ],
        orderNumber: [
          {
            required: true,
            message: "请选择关联采购订单号",
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: "供应商",
            trigger: "change"
          }
        ],
        repertoryId: [
          {
            required: true,
            message: "请选择所在仓库",
            trigger: "change"
          }
        ],
        repertoryRegionId: [
          {
            required: true,
            message: "请选择所在库位",
            trigger: "change"
          }
        ],
        verifier: [
          {
            required: true,
            message: "请选择入库人",
            trigger: "change"
          }
        ],
        remark: [
          {
            required: false,
            message: "请输入备注",
            trigger: "blur"
          }
        ]
      },
      addTableVisible: false, //采购订单弹框标记
      productList: [], //选中后的产品列表
      purchaseOrderList: [], //关联采购订单列表
      addProductTableVisible: false,
      productTable: [], //调用接口,客供产品列表
      repertoryList: [], //所有仓库
      regionList: [], //库位
      total_size: 1,
      cur_page: 1,
      select_word: "",
      userInfoVisible: false, //显示入库人弹框
      typeArr: [
        {
          name: "客户提供",
          value: "customer_provide"
        },
        {
          name: "采购系统",
          value: "purchase"
        }
      ],
      placeholderInfo: "请选择质检单号",
      centerDialogVisible: false, //质检单弹框
      qualitytestingList: [], //质检单列表
      isShowADD: true, //是否显示新增bom清单按钮
      customerDialogVisible: false, //客户列表弹框标致
      customerList: [], //客户列表
      barCodeList: [], //二维码列表
      isShowList: false,
      isThis: 0, //记录点击的
      AlreadyGetbarCodeList: [], //记录被选中的
      resarr: [],
      current_Page: 1
    };
  },
  created() {
    // alert(this.isCustomerProvide)
    this.initRepertoryList();
    this.initNumber();
  },
  methods: {
    //确定保存
    onSubmit(formName, type) {
      var _this = this;

      _this.$refs[formName].validate(function(valid) {
        if (valid) {
          if (
            _this.formData.stockInDate == undefined ||
            _this.formData.stockInDate == ""
          ) {
            _this.$message.warning("请选择入库时间!");
            return;
          }
          _this.formData.stockInDate = commonUtil.formatDateTime(
            _this.formData.stockInDate
          );
          _this.formData.type = type;
          var params = {
            purchaseOrder: _this.formData,
            productArr: _this.productList
          };

          if (_this.productList == null || _this.productList.length == 0) {
            if (_this.formData.chooseType == "purchase") {
              _this.$message.warning("物料明细不能为空,请选择关联采购订单号!");
              return false;
            } else if (_this.formData.chooseType == "customer_provide") {
              _this.$message.warning("物料明细不能为空,请新增bom清单");
              return false;
            }
          }
          for (var item of _this.productList) {
            _this.resarr.push(item.barCode);
            if (
              _this.resarr.length > Array.from(new Set(_this.resarr)).length
            ) {
              _this.$message.warning("有重复的二维码,请核对并从新选择");
              return;
            }
            if (
              _this.formData.chooseType == "customer_provide" &&
              item.arrivalQuantity <= 0
            ) {
              _this.$message.warning("入库数量必须大于0");
              return;
            } else if (
              _this.formData.chooseType == "purchase" &&
              item.arrivalQuantity < 0
            ) {
              _this.$message.warning("入库数量不能小于0");
              return;
            }
          }

          for (var i = 0; i < _this.productList.length; i++) {
            var item = _this.productList[i];
            if (item.productQualityStatus == "not_quality") {
              _this
                .$confirm("该采购订单有未质检的物料,是否确认入库?", "提示", {
                  cancelButtonText: "取消",
                  confirmButtonText: "确定",
                  type: "warning"
                })
                .then(() => {
                  _this.addPurchaseOrder(params);
                })
                .catch(() => {
                  _this.$message.info("已取消");
                });
              return;
            }
          }
          _this.addPurchaseOrder(params);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    addPurchaseOrder(params) {
      var _this = this;
      addPurchaseOrder(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.$message.success("新增采购订单成功!");
          _this.$router.push({
            name: "purchaseOrder",
            params: {
              chooseType: _this.formData.chooseType
            }
          });
        } else if (code == 400) {
          _this.$message.error("非法参数");
        } else if (code == 500) {
          _this.$message.error("系统异常");
        }
      });
    },
    //点击取消去采购订单列表页
    goBack() {
      let _this = this;
      this.$router.push({
        name: "purchaseOrder",
        params: {
          chooseType: _this.formData.chooseType
        }
      });
    },
    handleCurrentChange(val) {
      var _this = this;
      _this.addTableVisible = false;
      _this.formData.relatedOrderNumber =
        val.orderNumber == undefined ? "无" : val.orderNumber;
      _this.formData.orderNumber = val.planCode;
      _this.formData.name = val.ventor.ventorName;
      _this.formData.supplierId = val.ventor.ventorId;
      if (
        _this.formData.orderNumber != undefined ||
        _this.formData.orderNumber != ""
      ) {
        let params = {
          purchaseOrderCode: _this.formData.orderNumber
        };
        getPurchaseOrderProductByCode(params).then(res => {
          let { code, msg, data } = res;
          if (code == 200) {
            _this.formData.statusName = data.purchaseEnterVo.statusName;
            _this.formData.wayName = data.purchaseEnterVo.wayName;
            _this.productList = data.productVoList;
          } else if (code == 500) {
            _this.$message.error("系统异常!");
          }
        });
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
      var params = {
        id: repertoryId
      };
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
    //初始化所有采购订单列表
    initPurchaseOrderNumber() {
      var _this = this;
      var params = {
        currentPage: _this.cur_page,
        keyWords: _this.select_word
      };
      initPurchaseOrderNumber(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.purchaseOrderList = data.purchaseOrderList;
          _this.purchaseOrderList = data.purchaseOrderList;
          _this.total_size = data.total;
        } else if (code == 14000) {
          _this.orderNumberList = [];
          _this.total_size = 0;
        } else if (code == 500) {
          _this.$message.error("系统异常!");
        } else if (code == 400) {
          _this.$message.warning("参数不合法!");
        }
      });
    },
    queryByPage(val) {
      this.cur_page = val;
      this.initPurchaseOrderNumber();
    },

    //显示入库人选择表
    showEnterPersonTable() {
      this.userInfoVisible = !this.userInfoVisible;
    },

    displayEnterPersonName(param) {
      if (param.length == 0) {
        this.formData.verifier = "";
      } else {
        this.formData.verifier = param[0].realName;
      }
    },
    //搜索产品
    search(type) {
      if (type == "customer_provide") {
        this.queryAllProduct();
      } else if (type == "purchase") {
        this.initPurchaseOrderNumber();
      }
    },
    queryProductByPage(val) {
      this.cur_page = val;
      this.queryAllProduct();
    },
    //查询所有产品
    queryAllProduct() {
      var _this = this;
      var params = {
        currentPage: _this.cur_page,
        keyWords: _this.select_word
      };
      findProductInfo(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.productTable = data.list;
          _this.total_size = data.page.totalRecord;
        } else if (code == 14000) {
          _this.productTable = [];
          _this.total_size = 0;
        } else if (code == 500) {
          _this.$message.error("系统异常!");
        } else if (code == 400) {
          _this.$message.warning("参数不合法!");
        }
      });
    },
    handleProductCurrentChange(val) {
      let _this = this;
      if (val.isCheck) {
        _this.$message.warning("该条产品已添加");
      } else {
        val.isCheck = true;
        let params = {
          productCode: val.number
        };
        findMaterialByProductCode(params).then(res => {
          let { code, msg, data } = res;
          if (code == 200) {
            var arr = _this.productList.concat(data);

            //去重操作
            var hash = {};
            arr = arr.reduce((item, next) => {
              hash[next.number]
                ? ""
                : (hash[next.number] = true && item.push(next));
              return item;
            }, []);
            _this.productList = arr;
          } else if (code == 14000) {
            if (data != null && data != undefined) {
              _this.productList.concat(data);
            }
          } else if (code == 500) {
            _this.$message.error("系统异常!");
          } else if (code == 400) {
            _this.$message.warning("参数不合法!");
          }
        });
      }
    },
    //显示采购订单入库弹框
    showDialog(type) {
      if (type == "purchase") {
        //显示采购订单列表
        this.addTableVisible = true;
        this.initPurchaseOrderNumber();
      } else if (type == "customer_provide") {
        //显示客供产品列表
        this.addProductTableVisible = true;
        this.queryAllProduct();
      }
    },
    //初始化入库单号
    //初始化序列号
    initNumber() {
      var _this = this;
      let dataJson = "";
      if (_this.chooseType == undefined) {
        dataJson = {
          seqName: "purchase"
        };
      } else {
        dataJson = {
          seqName: _this.chooseType
        };
      }
      getCodeBySeqName(dataJson).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.formData.number = data.number;
        }
      });
    },
    productQualityStatusStr(row, column, cellValue) {
      if (row.productQualityStatus == "not_quality") {
        return "未质检";
      } else if (row.productQualityStatus == "has_quality") {
        return "已质检";
      } else if (row.productQualityStatus == "part_quality") {
        return "部分质检";
      }
    },
    // 选择质检
    ChoiceInspect() {
      let data = {
        currentPage: this.current_Page
      };
      findRepertoryQuality(data).then(res => {
        let { code, msg, data } = res;
        if (code == 14005) {
          this.qualitytestingList = [];
          this.isShowADD = true;
          this.placeholderInfo = "无质检单号";
        } else if (code == 200) {
          this.qualitytestingList = data.list;
          this.total_size = data.page.totalRecord;
          this.centerDialogVisible = true;
        } else {
          this.qualitytestingList = [];
          this.$message.error(msg);
        }
      });
    },
    queryProductListByPage(val) {
      console.log(val);
      this.current_Page = val;
      this.ChoiceInspect();
    },
    handleQualitytesting(val) {
      // 质检单号
      this.formData.qualityId = val.number;
      this.formData.relatedOrderNumber = val.relatedOrderNumber;
      this.formData.customerName = val.customerName;

      if (val.orderId != "" || val.orderId != undefined) {
        this.formData.customerNumber = val.orderId;
      }
      const _this = this;
      var params = {
        number: val.number
      };
      findRepertoryQualityDetail(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          for (let item of data) {
            item.repertoryId = "";
            item.regionId = "";
          }
          _this.productList = data; //入库单号

          this.isShowADD = false;
          _this.centerDialogVisible = false;
        } else if (code == 500) {
          _this.$message.error("系统异常!");
        }
      });
    },
    inputFuc() {
      if (this.formData.customerName.length > 50) {
        this.$message.warning("客户名称输入过长!");
      }
    },
    showCustomerDialog() {
      this.customerDialogVisible = true;
      this.initCustomer();
    },
    initCustomer() {
      let _this = this;
      let params = {
        currentPage: _this.cur_page,
        loginName: "stock",
        keyWords: _this.select_word
      };
      findCustomerInfo(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.customerList = data.list;
          _this.total_size = data.totalsize;
        } else if (code == 400) {
          _this.$message.warning("非法参数");
        } else if (code == 500) {
          _this.$message.error("系统异常");
        } else if (code == 14000) {
          _this.customerList = [];
          _this.total_size = 0;
        }
      });
    },
    // queryCustomerByPage(val){
    //     this.cur_page = val;
    //     this.initCustomer();
    // },
    //搜索客户
    // searchCustomer(){
    //     this.initCustomer();
    // },
    //点击客户列表的每一行数据
    // handleCustomer(val){
    //     this.formData.customerName = val.customerName;
    //     this.formData.customerAddress = val.customerAddress;
    //     this.customerDialogVisible = false;
    // },
    //格式化日期
    formatterInboundTime(row, column, cellValue) {
      if (row.qualityTime == undefined) {
        return "";
      }
      return commonUtil.formatDateTime(row.qualityTime);
    },
    reset() {
      this.productList = [];
    },
    // 触发二维码输入框
    setinputInfo(resevent, resIndex) {
      this.isThis = resIndex;
      let params = {
        keyWords: resevent
      };
      findBarCode(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          this.barCodeList = data.list;
          this.isShowList = true;
        } else {
          this.barCodeList = [];
          this.isShowList = false;
          this.$message.warning(msg);
        }
      });
    },
    // 选择
    setbarCode(resBarCode, item) {
      if (this.AlreadyGetbarCodeList.includes(resBarCode)) {
        this.$message.warning("此二维码已经被选择,请更换另一个!");
        return;
      } else {
        item.barCode = resBarCode;
      }
      this.AlreadyGetbarCodeList.push(resBarCode);
      const _this = this;

      let params = {
        barCode: resBarCode
      };
      // 查询是否需要初始化
      checkIfNeedInint(params).then(res => {
        let { code, msg, data, success } = res;
        if (success && data.flag) {
          this.$confirm("是否初始化此二维码以便后续使用, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              // 初始化此二维码
              let params = {
                list: []
              };
              params.list.push(resBarCode);
              InitializationBarCode(params).then(res => {
                if (res.success) {
                  _this.$message({
                    type: "success",
                    message: "初始化成功!"
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
        }
      });
    }
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