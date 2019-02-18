<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <!-- <el-breadcrumb-item>
                    <i class="el-icon-menu"></i> 库存</el-breadcrumb-item> -->
                <el-breadcrumb-item><span class="inventory ventorImg"></span>库存质检</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        
        <div class="handle-box">
            <el-select v-model="typeStatus" @change="getData" placeholder="质检类型" >
                <el-option
                    v-for="item in typeArr"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="请输入质检单号,关联订单号搜索" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="addQuality">新增</el-button>
        </div>

        <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="qualityTime" label="质检日期">
            </el-table-column>
            <el-table-column prop="number" label="质检单号">
            </el-table-column>
             <el-table-column prop="relatedOrderNumber" label="关联生产订单号">
            </el-table-column>
            <el-table-column prop="type" :formatter="formatterType" label="质检类型">
            </el-table-column>
            <el-table-column prop="way" :formatter="formatterWay" label="质检方式">
            </el-table-column>
             <el-table-column prop="inspectors" label="送检人">
            </el-table-column>
             <el-table-column prop="qualityPeople" label="质检人">
            </el-table-column>
            <!-- <el-table-column prop="status" :formatter="formatterStatus" label="状态">
            </el-table-column> -->
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="queryDetail(scope.$index, tableData)">详情</el-button>
                    <el-button size="small" icon="edit" v-if="tableData[scope.$index].status !='has_quality'" @click="handleEdit(scope.$index, tableData)">质检</el-button>
                    <!-- <el-button size="small" icon="edit"  @click="handleEdit(scope.$index, tableData)">质检</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
            </el-pagination>
        </div>
        <!-- 查看详情 -->
        <el-dialog title="质检详情" size='large' :visible.sync="dialogTableVisible">
            <el-form ref="formData" :model="formData" label-width="100px">
                <el-form-item label="质检类型">
                    <el-col :span="5">
                        <el-input v-model="formData.typeName" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检日期">
                    <el-col :span="5">
                        <el-date-picker type="date" placeholder="选择日期" readonly v-model="formData.qualityTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检方式">
                    <el-col :span="5">
                        <el-input v-model="formData.wayName" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检单号">
                    <el-col :span="5">
                        <el-input v-model="formData.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联采购单号" v-if="formData.type == 'customer_storage' || formData.type == 'purchase'">
                    <el-col :span="5">
                        <el-input v-model="formData.orderId" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联生产订单号">
                    <el-col :span="5">
                        <el-input v-model="formData.relatedOrderNumber" readonly></el-input>
                    </el-col>
                </el-form-item>
                 <el-form-item label="来料单号" v-if="formData.type == 'customer_storage' || formData.type == 'purchase'">
                    <el-col :span="5">
                        <el-input v-model="formData.incomingMaterialNumber" readonly></el-input>
                    </el-col>
                </el-form-item>
                 <el-form-item label="入库批号">
                    <el-col :span="5">
                        <el-input v-model="formData.batchNumber" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="供应商" v-if="formData.supplierName == ''">
                    <el-col :span="5">
                        <el-input  v-model="formData.supplierName" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="送检人">
                    <el-col :span="5">
                        <el-input v-model="formData.inspectors" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检人">
                    <el-col :span="5">
                        <el-input v-model="formData.qualityPeople" readonly></el-input>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item label="添加">
                    <el-col :span="5">
                        <el-input v-model="formData.remark" readonly></el-input>
                    </el-col>
                </el-form-item> -->
            </el-form>
            
            <el-table :data="qualityMaterialList" style="width: 100%" border>
                <el-table-column property="productName" label="物料名称"></el-table-column>
                <el-table-column property="productNumber" label="物料编号"></el-table-column>
                <el-table-column property="specification" label="规格"></el-table-column>
                <el-table-column property="supplierName" label="供应商" ></el-table-column>
                <el-table-column property="categoryName" label="物料类型" ></el-table-column>
                <el-table-column property="inspectionQuantity" label="检验数量"></el-table-column>
                <el-table-column property="qualifiedQuantity" label="合格数量"></el-table-column>
                <el-table-column property="unqualifiedQuantity" label="不合格数量"></el-table-column>
                <el-table-column property="defectiveRate" label="不良率"></el-table-column>
                <el-table-column property="badReasons" label="备注"></el-table-column>
                <el-table-column property="productQualityStatus" label="质检状态" width="150 ">
                    <template scope="scope">
                        <el-select v-model="scope.row.productQualityStatus" :disabled="true"  placeholder="请选择质检状态">
                            <el-option 
                                v-for="item in productQualityStatusList" 
                                :key="item.value" 
                                :label="item.name" 
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template scope="scope">
                        <el-button size="small" type="primary" @click="handlePrinter(scope.$index, scope.row)">确认打印</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import {
  findBoxListByPage, //查询箱单列表
  findBoxDetailById, //根据箱单id查看详情
  findBoxPrintInfo, //打印详情
  confirmPrintInfo, //确认打印
  printCodeInfo, //打印二维码  
  newConfirmPrintInfo,//打印
} from "../../../api/axiosapi";
import commonUtil from "../../../common/commonUtil";
import {
  findRepertoryQualityByPage,
  findRepertoryQualityById
} from "../../../api/axiosRepertoryQualityApi";
// import axiosHttp from "../../../common/axiosHttp";
import moment from "moment";

export default {
  data() {
    return {
      keyWords:'',
      getBar_code:'',
      fullscreenLoading: false,
      originProductNumber: "无",
      showInput: true,
      totalBox: "",
      targetBarCode: "",
      addDialog: false,
      formData: {
        id: "",
        type: "", //质检类型
        qualityTime: "", //质检日期
        way: "", //质检方式
        number: "", //质检单号
        relatedOrderNumber: "", //关联生产订单号
        supplierId: "", //供应商ID
        supplierName: "", //供应商
        inspectors: "", //送检人
        qualityPeople: "", //质检人
        remark: "" //备注
      },
      tableData: [],
      cur_page: 1,
      select_word: "",
      total_size: 0,
      dialogTableVisible: false,
      qualityMaterialList: [], //质检物料详情
      printingDetailslList: [], //打印详情页 箱单列表
      printingformData: {}, //打印详情
      typeStatus: "",
      typeArr: [
        {
          name: "全部",
          value: ""
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
        },
        {
          name: "客供质检",
          value: "customer_storage"
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
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: { 
    //确认打印
    handlePrinter(index,row){
        let self =this;
        if(self.formData.type ==="customer_storage"){
             let params =
                {
                  rqpNumber:self.formData.number,
                  rqpProductId:row.productId,
                  checkNumber:row.inspectionQuantity,
                  seqName:"bar_code",
                  list:[{
                        productId:row.productId,
                        productNumber:row.productNumber,
                        purpose:self.formData.type,
                        quantity:row.inspectionQuantity,
                        planQuantity:row.planQuantity,
                        barCode:"barCodeNull",
                        qualityId:row.inspectionId,
                        relatedOrderNumber:self.formData.relatedOrderNumber
                    }]
                  }
                  newConfirmPrintInfo(params).then(res =>{
                    let {code, msg, data, success} =res;
                    if(code == 200){
                      self.getBar_code=data;
                      self.confirmprintingBarcode(row);
                    }else{
                      this.$message.warning(msg);
                    }
                })
          }else{
              let params =
              {
                rqpNumber:self.formData.number,
                rqpProductId:row.productId,
                checkNumber:row.planQuantity,
                seqName:"bar_code",
                list:[{
                      productId:row.productId,
                      productNumber:row.productNumber,
                      purpose:self.formData.type,
                      quantity:row.inspectionQuantity,
                      planQuantity:row.planQuantity,
                      barCode:"barCodeNull",
                      qualityId:row.inspectionId,
                      relatedOrderNumber:self.formData.relatedOrderNumber
                  }]
                }
                newConfirmPrintInfo(params).then(res =>{
                    let {code, msg, data, success} =res;
                    if(code == 200){
                      self.getBar_code=data;
                      self.confirmprintingBarcode(row);
                    }else{
                      this.$message.warning(msg);
                    }
                })
          }
    },
    //  打印二维码
    confirmprintingBarcode(row) {
      let self = this;
        var params = {
            barCodeList: [
              {
                barCode: self.getBar_code,
                caseNumber: self.formData.relatedOrderNumber,
                operator: self.formData.qualityPeople,
                originProductNumber: !row.productOldCode?self.originProductNumber:row.productOldCode,
                printDate: moment(self.formData.qualityTime).format("YYYY-MM-DD HH:mm:ss"),
                productName: row.productName,
                productNumber: row.productNumber,
                qualityNumber: self.formData.number,
                quantity: row.inspectionQuantity,
                remark:row.badReasons,
                qualifiedQuantity:row.qualifiedQuantity,
                unqualifiedQuantity:row.unqualifiedQuantity
              }
            ],
            flag: "table"
          };
            printCodeInfo(params).then(res => {
              let { code, msg, data, success } = res;
              if (code == 200) {
                this.$message.success("打印成功");
              } else if (code == 500) {
                this.$message.error(msg);
              } else {
                this.$message.warning(msg);
              }
            });
      },
    //分页
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    getData() {
      let _this = this;
      var params = {
        currentPage: _this.cur_page,
        keyWords: _this.select_word,
        type: this.typeStatus,
        status: ""
      };
      findRepertoryQualityByPage(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          data.list.forEach(function(item) {
            item.qualityTime = commonUtil.formatDateTime(item.qualityTime);
          });
          _this.tableData = data.list;

          _this.total_size = data.page.totalRecord;
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
    addQuality() {
      this.$router.push({ name: "addQuality" });
    },
    //去质检编辑页面
    handleEdit(index, data) {
      this.$router.push({
        name: "editQuality",
        query: {
          qualityId: data[index].id
        }
      });
    },
    //搜索
    search() {
      this.getData();
    },
    //查看详情
    queryDetail(index, data) {
      var _this = this;
      var params = { id: data[index].id };
      // return;
      findRepertoryQualityById(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.dialogTableVisible = true;
          _this.formData = data.repertoryQualityVO;
          _this.qualityMaterialList = data.repertoryQualityVO.list;
          console.log(_this.qualityMaterialList,555555555);
        } else if (code == 500) {
          _this.$message.error("系统异常!");
        } else if (code == 400) {
          _this.$message.warning("参数不合法!");
        } else if (code == 14000) {
          _this.boxDetailList = [];
          _this.dialogTableVisible = false;
          _this.$message.warning("当前质检单没有详情!");
        }
      });
    },
    formatterType(row, column, cellValue) {
      if (row.type == "other_storage") {
        return "其他入库质检";
      } else if (row.type == "purchase") {
        return "采购入库质检";
      } else if (row.type == "production_storage") {
        return "生产入库质检";
      } else if (row.type == "customer_storage") {
        return "客供质检";
      }
    },
    formatterWay(row, column, cellValue) {
      if (row.way == "all_inspection") {
        return "全检";
      } else if (row.way == "spot_check") {
        return "抽检";
      }
    },
    formatterStatus(row, column, cellValue) {
      if (row.status == "has_quality") {
        return "已质检";
      } else if (row.status == "not_quality") {
        return "未质检";
      } else if (row.status == "part_quality") {
        return "部分质检";
      }
    }
  }
};
</script>
<style scoped>
.handle-search{
  float: right;
  margin-bottom:20px;
}
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