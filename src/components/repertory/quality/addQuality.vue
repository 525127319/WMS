<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-date"></i>库存质检</el-breadcrumb-item>
                <el-breadcrumb-item>新增库存质检</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='form-box'>
            <el-form ref="formData"  :rules="rules" :model="formData">
                <el-form-item label="质检类型" prop="type" >
                    <el-select v-model="formData.type" placeholder="请选择" @change="resetQualityMaterialList" >
                        <el-option v-for="item in typeArr" :key="item.value"  :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="质检方式" prop="way">
                    <el-select v-model="formData.way" placeholder="请选择" >
                        <el-option v-for="item in wayArr" :key="item.value"  :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="质检日期" prop="qualityTime">
                    <el-col :span="10">
                            <el-date-picker type="date" :editable="false" placeholder="选择日期" v-model="formData.qualityTime" style="width: 100%;"></el-date-picker>
                        </el-col>
                </el-form-item>
                <el-form-item label="质检单号" prop="number">
                    <el-col :span="10">
                        <el-input v-model="formData.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                 <el-form-item label="关联采购单号" prop="orderId" v-if="formData.type == 'customer_storage' || formData.type == 'purchase'">
                    <el-col :span="10">
                        <el-input v-model="formData.orderId" :readonly="isOtherStorage" @click.native="showDialog"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联生产订单号" prop="relatedOrderNumber">
                    <el-col :span="10">
                        <el-input v-model="formData.relatedOrderNumber"></el-input>
                    </el-col>
                </el-form-item>
                 <el-form-item label="来料单号" prop="incomingMaterialNumber" v-if="formData.type == 'customer_storage' || formData.type == 'purchase'">
                    <el-col :span="10">
                        <el-input v-model="formData.incomingMaterialNumber" ></el-input>
                    </el-col>
                </el-form-item>
                   <el-form-item label="入库批号" prop="batchNumber">
                    <el-col :span="10">
                        <el-input v-model="formData.batchNumber"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="送检人" prop="inspectors">
                    <el-col :span="10">
                        <el-input v-model="formData.inspectors" readonly @click.native="showZtreeTable(0)"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检人" prop="qualityPeople">
                    <el-col :span="10">
                        <el-input v-model="formData.qualityPeople" readonly @click.native="showZtreeTable(1)"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="供应商" v-if="formData.type == 'purchase'">
                    <el-col :span="10">
                        <el-input v-model="formData.supplierName" readonly></el-input>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item label="备注">
                    <el-col :span="10">
                        <el-input type="textarea" v-model="formData.remark"></el-input>
                    </el-col>
                </el-form-item> -->
            </el-form>
            <user-info-com v-show="userInfoVisible" @user-info="displayPeopleName"></user-info-com>
            <user-info-com v-show="userVisible" @user-info="displayPeople"></user-info-com>
            <el-button @click.native="showProductDialog" type="primary" v-if='!isOtherStorage' style="margin-bottom:12px;" icon="plus">新增质检明细</el-button>
            <el-button type="primary" icon="plus" @click="handleMachinery">新增机加件</el-button>
            <label class="file-btn el-button el-button--primary" icon="plus">批量导入<input type="file" ref="attachmentList" style="display:none;" v-on:change="uploadFile()"></label>        <span v-text="fileName"></span>
            <el-table ref="qualityMaterialList" :data="qualityMaterialList" border highlight-current-row style="width: 100%">
                <el-table-column label="操作" width="100" v-if='!isOtherStorage'>
                    <template scope="scope">
                        <el-icon name="minus" @click.native="deleteProduct(scope.$index,scope.row)"></el-icon>
                        <!-- qualityMaterialList -->
                    </template>
                </el-table-column>
                <el-table-column property="productName" label="物料名称" ></el-table-column>
                <el-table-column property="productNumber" label="物料编号" ></el-table-column>
                <el-table-column property="specification" label="规格" ></el-table-column>
                <el-table-column property="supplierName" label="供应商" ></el-table-column>
                <el-table-column property="categoryName" label="物料类型" ></el-table-column>
                <el-table-column property="planQuantity" label="计划入库数量" ></el-table-column>
                <el-table-column property="inspectionQuantity" label="检验数量" width="100">
                    <template scope="scope">
                        <el-input-number @input="calculationDefectiveRate(scope.$index,qualityMaterialList,1)" :controls="false" size="small" v-model="scope.row.inspectionQuantity" style="width:70px"/>
                    </template>
                </el-table-column>
                <el-table-column property="qualifiedQuantity" label="合格数量" width="100">
                    <template scope="scope">
                        <el-input-number @input="calculationDefectiveRate(scope.$index,qualityMaterialList,2)" :controls="false" size="small" v-model="scope.row.qualifiedQuantity" style="width:70px"/>
                    </template>
                </el-table-column>
                <el-table-column property="unqualifiedQuantity" label="不合格数量" width="100">
                    <template scope="scope">
                        <el-input-number @input="calculationDefectiveRate(scope.$index,qualityMaterialList,3)" :controls="false" size="small" v-model="scope.row.unqualifiedQuantity" style="width:70px"/>
                    </template>
                </el-table-column>
                <el-table-column property="defectiveRate" label="不良率">
                     <template scope="scope">
                        <el-input :controls="false"  readonly v-model="scope.row.defectiveRate"/>
                    </template>
                </el-table-column>
                <el-table-column property="badReasons" label="不良原因">
                     <template scope="scope">
                        <el-input v-model="scope.row.badReasons"/>
                    </template>
                </el-table-column>
                <!-- <el-table-column property="disabledState" label="是否禁用">
                </el-table-column> -->
                <el-table-column property="productQualityStatus" label="质检状态" width="150">
                    <template scope="scope">
                        <el-select v-model="scope.row.productQualityStatus"  placeholder="请选择质检状态" >
                            <el-option v-for="item in productQualityStatusList" :key="item.value"  :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class='buttons'>
            <el-button @click="goBack">返回</el-button>
            <el-button type="success" @click.native="onSubmit('formData','not_quality')">保存</el-button>
            <!-- <el-button type="primary" @click.native="onSubmit('formData','has_quality')">质检</el-button> -->
        </div>
        <el-dialog title="采购订单列表" v-model="purchaseOrderVisible" :close-on-click-modal="true">
            <el-input v-model="select_word" placeholder="请输入单据号" class="handle-input"></el-input>
            <el-button type="primary" icon="search" @click="search()">搜索</el-button>
            <el-table ref="purchaseOrderList" :data="purchaseOrderList" highlight-current-row @row-click="handlePurchaseOrderCurrentChange" style="width: 100%">
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
        <el-dialog title="生产订单列表" v-model="productionStorageVisible" :close-on-click-modal="true">
            <el-input v-model="select_word" placeholder="请输入订单编号" class="handle-input"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-table ref="produceEnterOrderList" :data="produceEnterOrderList" highlight-current-row @row-click="handleProduceEnterCurrentChange" style="width: 100%">
                <el-table-column property="orderId" label="订单编号"></el-table-column>
                <el-table-column property="orderDate" label="订单日期"></el-table-column>
                <el-table-column property="customerName" label="客户名称"></el-table-column>
                <el-table-column property="remark" label="备注"></el-table-column>
            </el-table>
            <div class="pagination ">
                <el-pagination @current-change="queryByPage" layout="total,prev, pager, next,jumper " :total="total_size">
                </el-pagination>
            </div>
        </el-dialog>
        <!--模态框 选新增-->
        <el-dialog title="物料/产品列表" v-model="addProductTableVisible">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="产品" name="first" v-if="formData.type != 'customer_storage'">
                    <el-input v-model="select_word" placeholder="请输入产品名称、产品编号搜索" class="handle-input"></el-input>
                    <el-button type="primary" icon="search" @click="searchPropduct">搜索</el-button>
                    <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChangeProduct" style="width: 100%">
                        <el-table-column property="productName" label="产品名称">
                        </el-table-column>
                        <el-table-column property="productNumber" label="产品编号">
                        </el-table-column>
                        <!-- <el-table-column property="specification" label="产品规格">
                        </el-table-column> -->
                        <el-table-column property="categoryName" label="产品类型" ></el-table-column>
                        <el-table-column label="是否选中" width="100">
                            <template scope="scope">
                                <el-icon name="check" v-if="scope.row.check"></el-icon>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination ">
                        <el-pagination @current-change="queryProductByPage" layout="total,prev, pager, next,jumper" :total="total_size ">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="物料" name="second">
                    <el-input v-model="m_select_word" placeholder="请输入物料名称、物料编号搜索" class="handle-input"></el-input>
                    <el-button type="primary" icon="search" @click="searchMateriel">搜索</el-button>
                    <el-table ref="materielTable" :data="materielTable" highlight-current-row @row-click="handleCurrentChangeMateriel" style="width: 100% ;margin-top:10px;" border>
                        <el-table-column property="productName" label="物料名称">
                        </el-table-column>
                        <el-table-column property="productNumber" label="物料编号">
                        </el-table-column>
                        <el-table-column property="specification" label="物料规格">
                        </el-table-column>
                        <el-table-column property="supplierName" label="供应商" ></el-table-column>
                         <el-table-column property="categoryName" label="物料类型" ></el-table-column>
                        <el-table-column label="是否选中" width="100" align="center">
                            <template scope="scope">
                                <el-icon name="check" v-if="scope.row.check"></el-icon>
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
         <!--新增机加件-->
        <el-dialog title="新增机加件" :visible.sync="dialogFormVisible" width="60%" height="60%w" >
            <el-form :model="form" ref="form" :rules="MachineryRules" class="elForm-box">
                <el-form-item label="名称"  prop="productName" class="elForm">
                    <el-input v-model="form.productName" ></el-input>
                </el-form-item>
                <el-form-item label="图号" prop="productOldCode" class="elForm">
                    <el-input v-model="form.productOldCode"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm('form')">保 存</el-button>
                <el-button @click="cancel">取 消</el-button>    
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { 
  addMaterialsInfo ,
  importExcelInfo //批量导入
} from "../../../api/axiosapi";
import commonUtil from "../../../common/commonUtil";
import userInfoCom from "../../page/start";
import {
  findAddRepertoryQualityNumber, //自动生成质检单号
  addRepertoryQuality, //确定新增质检单
  findOrderForProduction, //获取未质检的生产入库订单
  findPlanProductByStockByApi, //根据orderId查看生产订单下的产品
  initPurchaseOrderNumber //获取未质检的采购入库订单
} from "../../../api/axiosRepertoryQualityApi";
// import {
//     findApsAllPlanIdByApsApi,//点击关联生产订单号
// } from '../../../api/axiosProduceEnterApi';
import {
  getPurchaseOrderProductByCode //根据订单code查看订单下的产品
} from "../../../api/axiosPurchaseOrderApi";

import {
  findOtherInstorageMateriel, //查询新增物料列表
  findOtherInstorageProduct, //查询新增产品列表
  getCodeBySeqName
} from "../../../api/axiosInventoryQueryApi";

export default {
  components: {
    userInfoCom
  },
  computed: {
    //是否为其他入库
    isOtherStorage: function() {
      return (
        this.formData.type != "other_storage" &&
        this.formData.type != "customer_storage"
      );
    }
  },
  created() {
    this.findAddRepertoryQualityNumber();
  },
  data() {
    return {
      dialogFormVisible: false,
      formData: {
        qualityTime: new Date(), //质检日期
        number: "", //质检单号
        type: "customer_storage", //质检类型
        way: "all_inspection", //质检方式
        qualityPeople: sessionStorage.getItem("currentLoginUser"), //质检人
        inspectors: sessionStorage.getItem("currentLoginUser"), //送检人
        orderId: "", //关联采购订单ID
        relatedOrderNumber: "", //关联生产订单号
        incomingMaterialNumber: "", //来料单号
        batchNumber: "", //入库批号
        supplierId: "", //供应商ID
        supplierName: "", //供应商名称
        remark: "", //备注
        status: ""
      },
      rules: {
        qualityTime: [
          {
            type: "date",
            required: true,
            message: "请选择质检日期",
            trigger: "blur"
          }
        ],
        orderId: [
          { required: false, message: "请输入关联订单号", trigger: "change" }
        ],
        number: [
          { required: true, message: "请输入质检单号", trigger: "blur" }
        ],
        qualityPeople: [
          { required: true, message: "请选择质检人", trigger: "change" }
        ],
        inspectors: [
          { required: true, message: "请选择送检人", trigger: "change" }
        ],
        type: [
          { required: true, message: "请选择质检类型", trigger: "change" }
        ],
        way: [{ required: true, message: "请选择质检方式", trigger: "change" }]
      },
      MachineryRules: {
        productName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        productOldCode: [
          { required: true, message: "请输入图号", trigger: "blur" }
        ]
      },
      wayArr: [
        {
          name: "全检",
          value: "all_inspection"
        },
        {
          name: "抽检",
          value: "spot_check"
        }
      ],
      productQualityStatusList: [
        {
          name: "未质检",
          value: "not_quality"
        },
        {
          name: "已质检",
          value: "has_quality"
        },
        {
          name: "部分质检",
          value: "part_quality"
        }
      ],
      typeArr: [
        {
          name: "客供质检",
          value: "customer_storage"
        },
        {
          name: "采购入库质检",
          value: "purchase"
        },
        {
          name: "其他入库质检",
          value: "other_storage"
        },
        {
          name: "生产入库质检",
          value: "production_storage"
        }
      ],
      userInfoVisible: false, //人事弹框
      userVisible: false, //送检人弹框
      purchaseOrderVisible: false, //采购质检弹框
      purchaseOrderList: [], //采购订单弹框列表
      productionStorageVisible: false, //生产入库质检弹框
      produceEnterOrderList: [], //生产入库订单弹框

      materielTable: [],
      productTable: [],
      // 默认
      activeName: "second",
      addProductTableVisible: false,
      //select_word: '', //搜索产品关键字
      m_select_word: "", //搜索物料关键字
      cur_page: 1, //产品的分页
      m_cur_page: 1, //物料的分页
      // total_size: 10,
      m_total_size: 10,
      qualityMaterialList: [], //所有质检table
      select_word: "",
      total_size: 0,
      cur_page: 1,
      fileName: '请选择文件',
      form: {
        productName: "",
        productOldCode: ""
      }
    };
  },

  methods: {
    //批量导入
    uploadFile() {
            let _this = this;
            let originFile = this.$refs.attachmentList.files[0]; //原文件
            let formData = new FormData();
            formData.append("fileName", originFile);
            importExcelInfo(formData).then(res => {
                _this.fileName = originFile.name;
                let {code,msg,data} = res;
                if (code == 200) {
                    data.forEach((item) =>{
                       item.productQualityStatus = "not_quality";
                      _this.qualityMaterialList.push(item);
                    })
                    _this.fileName = originFile.name;
                    _this.$message.success("导入初始数据成功!");
                } else if (code == 500) {
                    _this.$message.error("系统异常");
                } else{
                    _this.$message.warning(msg);
                }
            })
        },
    //机加件提交
    submitForm(formName) {
      let self = this;
      let params = {
        prodCategoryId: "61ed58e441d611e89c8838d5470f6ec0",
        productName: self.form.productName,
        productOldCode: self.form.productOldCode
      };
      self.$refs[formName].validate(valid => {
        if (valid) {
          addMaterialsInfo(params).then(res => {
            let { msg, code, data } = res;
            if (code == 200) {
              let data = JSON.parse(res.data);
              data.productQualityStatus = "not_quality";
              self.qualityMaterialList.push(data);
              this.dialogFormVisible = !this.dialogFormVisible;
            } else {
              self.$message.warning(msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //机加件按钮取消
    cancel() {
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    //弹出机加件窗口
    handleMachinery() {
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    //计算不良率
    calculationDefectiveRate(index, data, type) {
      // type =1说明是检验数量, type = 2说明是合格数量, type =3说明是不合格数量

      if (data[index].unqualifiedQuantity > data[index].inspectionQuantity) {
        //不合格数量不能超过质检数量
        this.$message.warning("不合格数量不能超过质检数量");
        data[index].unqualifiedQuantity = 0;
        return;
      } else if (
        data[index].qualifiedQuantity > data[index].inspectionQuantity
      ) {
        //合格数量不能超过质检数量
        this.$message.warning("合格数量不能超过质检数量");
        data[index].qualifiedQuantity = 0;
        return;
      } else if (
        data[index].planQuantity != 0 &&
        data[index].inspectionQuantity > data[index].planQuantity
      ) {
        //计划数量不为0  并且检验数量大于计划入库数量
        this.$message.warning("质检数量不能超过计划入库数量");
        data[index].inspectionQuantity = data[index].planQuantity;
        return;
      }
      if (data[index].inspectionQuantity == 0) {
        return;
      }
      data[index].defectiveRate =
        (
          data[index].unqualifiedQuantity /
          data[index].inspectionQuantity *
          100
        ).toFixed(2) + "%";
      if (type == 1) {
        //  type =1说明是检验数量,
        data[index].unqualifiedQuantity = 0;
        data[index].qualifiedQuantity = 0;
        return;
      } else if (type == 2) {
        // type = 2说明是合格数量,
        data[index].unqualifiedQuantity =
          data[index].inspectionQuantity - data[index].qualifiedQuantity;
      } else if (type == 3) {
        //type =3说明是不合格数量
        data[index].qualifiedQuantity =
          data[index].inspectionQuantity - data[index].unqualifiedQuantity;
      }
    },
    onSubmit(formName, status) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.formData.status = status;
          var longTime = _this.formData.qualityTime.getTime();

          if (_this.qualityMaterialList.length == 0) {
            if (
              _this.formData.type == "purchase" ||
              _this.formData.type == "production_storage"
            ) {
              _this.$message.warning("请选择关联订单号!");
            } else {
              _this.$message.warning("请新增质检物料明细!");
            }
            _this.formData.qualityTime = new Date(longTime);
            return;
          } else {
            var length = _this.qualityMaterialList.length;
            for (var i = 0; i < length; i++) {
              var item = _this.qualityMaterialList[i];
              // debugger
              if (
                item.productQualityStatus == undefined ||
                item.productQualityStatus == ""
              ) {
                _this.$message.warning(
                  "请对物料名称为【" + item.productName + "】的物料选择质检状态"
                );
                return;
              }
              if (item.unqualifiedQuantity < 0) {
                _this.$message.warning(
                  "物料名称为【" + item.productName + "】不合格数量不能小于零!"
                );
                return;
              }
              if (item.qualifiedQuantity < 0) {
                _this.$message.warning(
                  "物料名称为【" + item.productName + "】合格数量不能小于零!"
                );
                return;
              }
              if (
                item.productQualityStatus == "has_quality" &&
                item.inspectionQuantity <= 0 || item.productQualityStatus == "not_quality" && item.inspectionQuantity <= 0 || item.productQualityStatus == "part_quality" && item.inspectionQuantity <= 0
              ) {
                _this.$message.warning(
                  "请对物料名称为【" + item.productName + "】的物料输入检验数量!"
                );
                return;
              }

              if (
                _this.formData.status == "has_quality" &&
                item.productQualityStatus == "has_quality"
              ) {
                item.disabledState = "has_disabled";
              }
            }
          }

          _this.formData.qualityTime = commonUtil.formatDateTime(
            _this.formData.qualityTime
          );

         
          var params = {
            repertoryQuality: _this.formData,
            list: _this.qualityMaterialList
          };

          // return;
          addRepertoryQuality(params).then(res => {
            let { code, msg, data } = res;
            if (code == 200) {
              _this.$message.success("保存成功!");
              this.$router.push({ name: "quality" });
            } else if (code == 400) {
              _this.formData.qualityTime = commonUtil.formatDateTime(
                _this.formData.qualityTime
              );
              _this.$message.warning("非法参数!");
            } else if (code == 500) {
              _this.formData.qualityTime = commonUtil.formatDateTime(
                _this.formData.qualityTime
              );
              _this.$message.error("系统异常!");
            }
          });
        } else {
          _this.$message.error("请输入必填项!");
          return;
        }
      });
    },
    //自动生成质检单号
    //初始化序列号
    findAddRepertoryQualityNumber() {
      var _this = this;
      let dataJson = { seqName: "quality" };
      getCodeBySeqName(dataJson).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.formData.number = data.number;
        } else if (code == 500) {
          _this.$message.error("系统异常");
        }
      });
    },
    //返回列表页面
    goBack() {
      this.$router.push({ name: "quality" });
    },
    //回显质检人姓名
    displayPeopleName(param) {
      if (param.length == 0) {
        this.formData.qualityPeople = "";
      } else {
        this.formData.qualityPeople = param[0].realName;
      }
    },
    displayPeople(param) {
      if (param.length == 0) {
        this.formData.inspectors = "";
      } else {
        this.formData.inspectors = param[0].realName;
      }
    },
    //展示人事组织树结构
    showZtreeTable(param) {
      if (param == 1) {
        this.userInfoVisible = !this.userInfoVisible;
      } else {
        this.userVisible = !this.userVisible;
      }
    },
    //初始化所有采购订单列表
    initPurchaseOrderNumber() {
      var _this = this;
      var params = { nowPage: _this.cur_page, searchTxt: _this.select_word };
      initPurchaseOrderNumber(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.purchaseOrderList = data.list;
          _this.total_size = data.total;
        } else if (code == 14000) {
          _this.purchaseOrderList = [];
          _this.total_size = 0;
        } else if (code == 500) {
          _this.$message.error("系统异常!");
        } else if (code == 400) {
          _this.$message.warning("参数不合法!");
        }
      });
    },

    //点击采购订单弹框中的每一行数据
    handlePurchaseOrderCurrentChange(val) {
      var _this = this;
      _this.formData.orderId = val.planCode;
      _this.formData.supplierName = val.ventor.ventorName;
      _this.formData.supplierId = val.ventor.ventorId;

      var params = { purchaseOrderCode: val.planCode };
      getPurchaseOrderProductByCode(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.purchaseOrderVisible = false;
          if (
            data.productVoList != undefined &&
            data.productVoList.length > 0
          ) {
            _this.qualityMaterialList = [];
            for (var i = 0; i < data.productVoList.length; i++) {
              var item = data.productVoList[i];
              item.categoryName = item.categoryName;
              item.productNumber = item.productNumber;
              item.productName = item.productName;
              item.planQuantity = item.purchaseProductNumber;
              item.productQualityStatus = "not_quality";
              item.disabledState = "not_disabled";
              item.defectiveRate = "0";
              console.log(item);

              _this.qualityMaterialList.push(item);
            }
          }
          //_this.qualityMaterialList = data;
        } else if (code == 500) {
          _this.$message.error("系统异常!");
        }
      });
    },
    //查询生产入库订单列表弹框
    findApsAllPlanIdByApsApi() {
      var _this = this;
      var params = { cur_page: _this.cur_page, orderId: _this.select_word };
      findOrderForProduction(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.produceEnterOrderList = data;
          // _this.produceEnterOrderList = data.list;
          // _this.total_size = data.totalsize;
        } else if (code == 500) {
          _this.$message.error("系统异常");
        } else if (code == 400) {
          _this.$message.error("非法参数");
        } else if (code == 14000) {
          _this.produceEnterOrderList = [];
          _this.total_size = 0;
        } else if (code == 402) {
          _this.produceEnterOrderList = [];
          _this.total_size = 0;
        }
      });
    },
    //点击生产入库订单弹框中的每一行数据
    handleProduceEnterCurrentChange(val) {
      this.formData.orderId = val.orderId;
      var params = { orderId: val.orderId };
      var _this = this;
      findPlanProductByStockByApi(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.productionStorageVisible = false;
          if (data.list != undefined && data.list.length > 0) {
            for (var i = 0; i < data.list.length; i++) {
              var item = data.list[i];
              // item.number = item.productNumber;
              item.productName = item.name;
              item.specification = "无";
              item.categoryName = item.categoryName;
              item.productQualityStatus = "not_quality";
              item.disabledState = "not_disabled";
              item.defectiveRate = "0";
              // _this.qualityMaterialList.push(item);
            }
          }
          _this.qualityMaterialList = data.list;
        } else {
          _this.$message.warning(msg);
        }
      });
    },
    search() {
      if (this.formData.type == "purchase") {
        //采购入库质检
        this.initPurchaseOrderNumber();
      } else if (this.formData.type == "production_storage") {
        //生产入库质检
        this.findApsAllPlanIdByApsApi();
      }
    },
    queryByPage(val) {
      this.cur_page = val;
      if (this.formData.type == "purchase") {
        //采购入库质检
        this.initPurchaseOrderNumber();
      } else if (this.formData.type == "production_storage") {
        //生产入库质检
        this.findApsAllPlanIdByApsApi();
      }
    },
    showDialog() {
      if (this.formData.type == "purchase") {
        //采购入库质检
        this.purchaseOrderVisible = true;
        this.initPurchaseOrderNumber();
      } else if (this.formData.type == "production_storage") {
        //生产入库质检
        this.productionStorageVisible = true;
        this.findApsAllPlanIdByApsApi();
      }
    },
    showProductDialog() {
      // if(this.formData.type == 'other_storage'){
      this.addProductTableVisible = true;
      if (this.productTable.length > 0) return;
      // 关键字置空
      this.select_word = "";
      this.m_select_word = "";
      // 请求产品信息
      this.OtherStorageProductList();
      // 请求物料信息
      this.OtherStorageMaterielList();
      // }else if(this.formData.type == 'customer_storage'){

      // }
    },
    // 请求产品信息
    OtherStorageProductList() {
      var _this = this;
      var params = {
        currentPage: _this.cur_page,
        keyWords: _this.select_word
      };
      findOtherInstorageProduct(params).then(res => {
        let { code, msg, data } = res;
        console.log(res);
        if (code == 200) {
          data.list.forEach(function(item, index) {
            item.productQualityStatus = "not_quality";
            if (_this.qualityMaterialList != null) {
              _this.qualityMaterialList.forEach(function(selectedItem, i) {
                if (selectedItem.productNumber == item.productNumber) {
                  item.check = true;
                }
              });
            }
          });
          _this.productTable = data.list;
          _this.total_size = data.page.totalRecord;
        } else if (code == 500) {
          _this.$message.error("系统异常");
        } else if (code == 400) {
          _this.$message.error("非法参数");
        } else if (code == 14000) {
          _this.productTable = [];
          _this.total_size = 0;
        }
      });
    },
    // 请求物料信息
    OtherStorageMaterielList() {
      var _this = this;
      var params = {
        currentPage: _this.m_cur_page,
        keyWords: _this.m_select_word
      };
      findOtherInstorageMateriel(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          data.list.forEach(function(item, index) {
            item.productQualityStatus = "not_quality";
            if (_this.qualityMaterialList.length > 0) {
              _this.qualityMaterialList.forEach(function(selectedItem, i) {
                if (selectedItem.productNumber == item.productNumber) {
                  item.check = true;
                }
              });
            }
          });
          _this.materielTable = data.list;
          _this.m_total_size = data.page.totalRecord;
        } else if (code == 500) {
          _this.$message.error("系统异常");
        } else if (code == 400) {
          _this.$message.error("非法参数");
        } else if (code == 14000) {
          _this.materielTable = [];
          _this.m_total_size = 0;
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
    //搜索产品信息
    searchPropduct() {
      this.OtherStorageProductList();
    },
    //搜索物料信息
    searchMateriel() {
      this.OtherStorageMaterielList();
    },
    //选中的产品
    handleCurrentChangeProduct(val) {
      if (val.check) {
        val.check = false;
        var index = this.qualityMaterialList.indexOf(val);
        this.qualityMaterialList.splice(index, 1);
      } else {
        val.check = true;
        val.specification = "无";
        val.productName = val.productName;
        val.productNumber = val.productNumber;
        val.categoryName = val.categoryName;
        val.disabledState = "not_disabled";
        val.defectiveRate = "0";
        val.planQuantity = 0;
        this.qualityMaterialList.push(val);
      }
    },
    //选中的物料
    handleCurrentChangeMateriel(val) {
      if (val.check) {
        val.check = false;
        var index = this.qualityMaterialList.indexOf(val);
        this.qualityMaterialList.splice(index, 1);
      } else {
        val.check = true;
        val.productName = val.productName;
        val.productNumber = val.productNumber;
        val.categoryName = val.categoryName;
        val.supplierName = val.supplierName;
        val.productQualityStatus = "not_quality";
        val.defectiveRate = "0";
        val.planQuantity = 0;
        this.qualityMaterialList.push(val);
      }
    },
    // 切换
    handleClick(tab, event) {
      this.addProductTableVisible = true;
    },
    resetQualityMaterialList() {
      this.qualityMaterialList = [];
      this.formData.orderId = "";
      this.relatedOrderNumber = ""; //关联生产订单号
      this.incomingMaterialNumber = ""; //来料单号
      this.batchNumber = ""; //入库批号
    },
    deleteProduct(index, row) {
      row.check = false;
      this.qualityMaterialList.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  margin: 40px 0 0 70px;
}
.elForm-box {
  display: flex;
  flex-direction: column;
}
.elForm {
  flex: 1;
}
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
.handle-input {
  width: 300px;
  display: inline-block;
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