<template>
    <div width="100%">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/produceEnter'}">
                    <span class="-produce voterIcon" style="margin-right:3px;"></span>生产入库</el-breadcrumb-item>
                    <el-breadcrumb-item>新增生产入库</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
<div class="form-box">
    <el-form ref="formData" :rules="rules" :model="formData">
        <el-form-item label="入库时间">
            <el-col :span="12">
                <el-date-picker type="date" :editable="false" format="yyyy-MM-dd" placeholder="选择入库时间" v-model="formData.inboundTime"></el-date-picker>
            </el-col>
        </el-form-item>
        <el-form-item prop="productionInStorageCode" label="入库单号">
            <el-col :span="12">
                <el-input v-model="formData.productionInStorageCode" readonly></el-input>
            </el-col>
        </el-form-item>
        <el-form-item prop="relatedOrderNumber" label="关联生产订单号">
            <el-col :span="12">
                <el-input v-model="formData.relatedOrderNumber" @click.native="showDialog" placeholder="请选择关联生产订单" readonly></el-input>
            </el-col>
        </el-form-item>
        <el-form-item prop="workOrderNum" label="工单">
            <el-col :span="12">
                <el-select v-model="formData.workOrderNum" placeholder="请选择工单" style='width:100%'>
                    <el-option v-for="(item,index) in WorkOrderList" :key="index" :label="item.workOrderNum" :value="item.workOrderNum">
                    </el-option>
                </el-select>
            </el-col>
    </el-form-item>
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
<el-form-item label="客户名称">
    <el-col :span="12">
        <el-input v-model="formData.customerName" readonly></el-input>
    </el-col>
</el-form-item>
<el-form-item label="备注" prop="remark">
    <el-col :span="10">
        <el-input type="textarea" v-model="formData.remark"></el-input>
    </el-col>
</el-form-item>
<!--新增-->
<el-dialog title="关联生产订单列表" v-model="addTableVisible">
    <el-input v-model="select_word" placeholder="请输入订单编号" class="handle-input"></el-input>
    <el-button type="primary" icon="search" @click="search">搜索</el-button>
    <!-- <el-button type="text" @click="generationOrderNumber">无订单生产入库</el-button> -->
    <el-table ref="planOrderTable" :data="planOrderTable" highlight-current-row @row-click="handleCurrentChange" style="width: 100%">
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

<el-dialog title="产品列表" v-model="addProductTableVisible" :close-on-click-modal="false">
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
        <el-pagination @current-change="queryProductByPage" layout="total,prev, pager, next,jumper " :total="total_size ">
        </el-pagination>
    </div>
    <div class='buttons'>
        <el-button type="primary" @click="addProductTableVisible = false">确定</el-button>
    </div>
</el-dialog>
<!-- <el-button @click.native="showProductDialog" type="primary">新增生产入库产品</el-button> -->
<!-- 待入库产品列表 -->
<el-table ref="productList" :data="productList" border highlight-current-row style="width: 100%">
<!-- <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-icon name="minus" @click.native="deleteProduct(scope.$index,productList)"></el-icon>
                        </template>
                    </el-table-column> -->
<!-- <el-table-column property="batchNumber" label="生产批号"></el-table-column> -->
    <el-table-column property="productName" label="产品名称"></el-table-column>
    <!-- <el-table-column property="number" label="产品编号"></el-table-column> -->
    <el-table-column property="productNumber" label="产品编号"></el-table-column>
    <el-table-column property="planQuantity" label="计划入库数量"></el-table-column>
    <el-table-column property="hasQuantity" label="入库数量">
        <template scope="scope">
            <el-input-number :disabled="scope.row.planQuantity==scope.row.hasStorageQuantity" :controls="false" size="small" v-model="scope.row.hasQuantity"
            />
        </template>
    </el-table-column>
    <el-table-column property="unitName" label="单位"></el-table-column>
   <el-table-column prop="repertoryId" label="所在仓库" width="200">
        <template scope="scope">
            <el-select v-model="scope.row.repertoryId" placeholder="请选择仓库" @change="getRegionListById(scope.row.repertoryId,scope.row)" style='width:100%'>
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
    <el-table-column property="barCode" label="二维码">
        <template scope="scope">
            <el-input v-model="scope.row.barCode" @focus="setinputInfo('',scope.$index)" @change="setinputInfo($event,scope.$index)"/>
            <ul class="response" v-show="(barCodeList.length>0 && isShowList) && isThis==scope.$index">
                <li v-for="(item,index) in barCodeList" :key="index" v-text="item" v-on:click="setbarCode(item,scope.row,isShowList=false)"></li>
            </ul>
        </template>
    </el-table-column>

    <el-table-column property="hasStorageQuantity" label="已入库数量"></el-table-column>
<!--<el-table-column property="qualifiedQuantity" label="质检数量"></el-table-column>
                    <el-table-column property="unqualifiedQuantity" label="不合格数量"></el-table-column>
                    <el-table-column property="defectiveRate" label="不良率"></el-table-column>
                    <el-table-column property="productQualityStatus" label="物料质检状态" :formatter="productQualityStatusStr"></el-table-column>-->
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
    <!-- <el-button type="primary" @click="onSubmit">提交</el-button><el-button @click="toProduceEnterList">取消</el-button> -->
</div>
</div>
</template>
<script>
import {
  initRepertoryList, //初始化所有仓库下拉列表
  getRegionListByRepertoryId, //根据选中仓库id,查看库位
  getCodeBySeqName
} from "../../../api/axiosPurchaseOrderApi";
import commonUtil from "../../../common/commonUtil.js";
import {
  findProductionInStorageCode, //新增生产入库时 自动生成id 与 入库单号
  findProductInfo, //查询弹框列表
  findRepertoryNumberByCode, //根据产品编号查询产品库存数量
  addProduceEnter, //确定保存生产入库单
  findApsAllPlanIdByApsApi, //点击关联生产订单号
  findPlanProductByStockByApi, //
  findOrderForProduction, //查询关联生产订单
  findNewPlanProductByStockByApi, //根据选中订单ID 查找订单产品
  findWorkOrderInfo, //查询工单列表
  findBarCode, //查看二维码
  checkIfNeedInint, //查寻二维码是否需要初始化
  InitializationBarCode, //初始化二维码
  getInitiateRequest //根据工单请求详情
} from "../../../api/axiosProduceEnterApi";
import userInfoCom from "../../page/start";
export default {
  components: {
    userInfoCom
  },
  data: function() {
    return {
      barCode:'',
      formData: {
        id: "",
        inboundTime: new Date(), //入库时间
        productionInStorageCode: "", //入库单号
        relatedOrderNumber: "", //关联生产订单号
        remark: "", //备注
        warehousePeople: sessionStorage.getItem("currentLoginUser"), //入库人
        batchNumber: "", //生产批号
        type: 1, //入库标记：0代表提交入库，1代表保存入库单
        customerName: "", //客户名称
        workOrderNum: "" //工单号
      },
      rules: {
        productionInStorageCode: [
          {
            required: true,
            message: "请输入入库单号",
            trigger: "blur"
          }
        ],
        batchNumber: [
          {
            required: true,
            message: "请输入生产批号",
            trigger: "blur"
          }
        ],
        number: [
          {
            required: true,
            message: "请输入关联生产订单号",
            trigger: "change"
          }
        ],
        warehousePeople: [
          {
            required: true,
            message: "请选择入库人",
            trigger: "change"
          }
        ],
        remark: [
          {
            required: true,
            message: "请输入备注",
            trigger: "blur"
          }
        ],
        repertoryId: [
          {
            required: true,
            message: "请选择所在仓库",
            trigger: "change"
          }
        ],
        regionId: [
          {
            required: true,
            message: "请选择所在库位",
            trigger: "change"
          }
        ]
      },
      //labelPosition: 'top',//对齐方式
      total_size: 0,
      addTableVisible: false,
      addProductTableVisible: false,
      productList: [], //选中后的产品列表
      planOrderTable: [],//调用接口
      productTable: [],
      repertoryList: [], //所有仓库
      regionList: [], //库位
      cur_page: 1,
      select_word: "",
      userInfoVisible: false, //显示入库人弹框
      selectType: 0,
      WorkOrderList: [], //工单列表
      isThis: 0, //记录点击的
      resarr: [],
      barCodeList: [], //二维码集合
      AlreadyGetbarCodeList: [] //缓存二维码
    };
  },
  created() {
    this.initRepertoryList();
    this.initProductionInStorageCode();
  },
  methods: {
    //确定提交
    onSubmit(formName, type) {
      var _this = this;
      _this.$refs[formName].validate(function(valid) {
        if (valid) {
          if (
            _this.formData.inboundTime == undefined ||
            _this.formData.inboundTime == ""
          ) {
            _this.$message.warning("请选择入库时间!");
            return;
          }
          _this.formData.type = type; // 入库标记：0代表提交入库，1代表保存入库单
          if (_this.productList.length == 0) {
            _this.$message.warning("请选择一种入库产品");
            return;
          }
          var productParamsList = new Array();
          var flag = false;
          _this.productList.forEach(function(item, index) {
            if (item.hasQuantity < 0) {
              _this.$message.warning(
                "产品编号为【" + item.productNumber + "】的入库数量不能小于零!~"
              );
              flag = true;
              return;
            }
            // var product = new Object();
            //  product = item;
            // product.productNumber = item.number;
            //  productParamsList.push(product);
          });

          if (!flag) {
            var params = {
              productionInStorageInfo: _this.formData,
              list: _this.productList
            };
            if (type == "submit") {
              for (var i = 0; i < _this.productList.length; i++) {
                var item = _this.productList[i];
                if (item.productQualityStatus == "not_quality") {
                  _this
                    .$confirm("该订单有未质检的产品,是否确认入库?", "提示", {
                      cancelButtonText: "取消",
                      confirmButtonText: "确定",
                      type: "warning"
                    })
                    .then(() => {
                      _this.addProduceEnter(params);
                    })
                    .catch(() => {
                      _this.$message.info("已取消");
                    });
                  return;
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
                if (item.productQualityStatus == "not_quality") {
                  _this
                    .$confirm("该订单有未质检的产品,是否确认入库?", "提示", {
                      cancelButtonText: "取消",
                      confirmButtonText: "确定",
                      type: "warning"
                    })
                    .then(() => {
                      _this.addProduceEnter(params);
                    })
                    .catch(() => {
                      _this.$message.info("已取消");
                    });
                  return;
                }
              }

              _this.addProduceEnter(params);
            } else if (type == "save") {
              //var params = {'productionInStorageInfo':_this.formData,'list':_this.productList};
              _this.addProduceEnter(params);
            }
          }
        } else {
          _this.$message.error("请填写必填项!");
          console.log("error submit!!");
          return false;
        }
      });
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
    },
    addProduceEnter(params) {
      var _this = this;
      addProduceEnter(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.$message.success("新增生产入库成功!");
          _this.$router.push({
            name: "produceEnter"
          });
        } else if (code == 500) {
          _this.$message.error("系统异常,新增生产入库失败!");
        } else if (code == 400) {
          _this.$message.warning("参数错误!");
        }
      });
    },
    //搜索订单
    queryByPage(val) {
      this.cur_page = val;
      this.findApsAllPlanIdByApsApi();
    },
    search() {
      this.findApsAllPlanIdByApsApi();
    },
    queryProductByPage(val) {
      this.cur_page = val;
      this.queryProductList();
    },
    //搜索产品
    searchPropduct() {
      this.queryProductList();
    },
    //自动生成入库单号
    //初始化序列号
    initProductionInStorageCode() {
      var _this = this;
      let dataJson = {
        seqName: "produceEnter"
      };
      getCodeBySeqName(dataJson).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.formData.id = data.id; //id
          _this.formData.productionInStorageCode = data.number; //入库单号
        } else if (code == 500) {
          _this.$message.error("系统异常!");
        }
      });

      dataJson = {
        seqName: "produce_batch"
      };
      getCodeBySeqName(dataJson).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          _this.formData.batchNumber = data.number; //生产批号
        } else if (code == 500) {
          _this.$message.error("系统异常!");
        }
      });
    },
    //查询关联生产订单列表弹框
    findApsAllPlanIdByApsApi() {
      var _this = this;
      var params = {
        cur_page: _this.cur_page,
        keyWords: _this.select_word
      };
      findOrderForProduction(params).then(res => {
        console.log(res, 333);
        let { code, msg, data } = res;
        if (code == 200) {
          _this.planOrderTable = data;
           _this.formData.workOrderNum ="";
          // _this.planOrderTable = data.list;
          // _this.total_size = data.totalsize;
        } else if (code == 500) {
          _this.$message.error("系统异常");
        } else if (code == 400) {
          _this.$message.error("非法参数");
        } else if (code == 14000) {
          _this.planOrderTable = [];
          _this.total_size = 0;
        } else if (code == 402) {
          _this.planOrderTable = [];
          _this.total_size = 0;
        }
      });
    },
    //展示弹框
    showDialog() {
      this.addTableVisible = true;
      this.findApsAllPlanIdByApsApi();
    },
    showProductDialog() {
      this.addProductTableVisible = true;
      this.queryProductList();
    },
    //查询产品列表弹框
    queryProductList() {
      var _this = this;
      var params = {
        currentPage: _this.cur_page,
        keyWords: _this.select_word
      };
      findProductInfo(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          if (_this.productList != null) {
            data.list.forEach(function(item, index) {
              _this.productList.forEach(function(selectedItem, i) {
                if (selectedItem.number == item.number) {
                  item.isCheck = true;
                }
              });
            });
          }
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

    handleCurrentChange(val) {
      this.addTableVisible = false;
      this.formData.relatedOrderNumber = val.orderId;
      // 发起请求工单列表
      this.getFindWorkOrderInfo(val);
    },

    handleCurrentChangeProduct(val) {
      if (val.isCheck) {
        val.isCheck = false;
        var index = this.productList.indexOf(val);
        this.productList.splice(index, 1);
      } else {
        val.isCheck = true;
        this.productList.push(val);

        // 发起请求工单列表
        this.getFindWorkOrderInfo(val);
      }
    },
    // 发起请求工单列表
    getFindWorkOrderInfo(val) {
      let params = {
        orderId: val.orderId
      };
      findWorkOrderInfo(params).then(res => {
        let { code, msg, data, success } = res;
        if (success) {
          this.WorkOrderList = data;
        } else {
          this.$message.error(msg);
        }
      });
    },

    deleteProduct(index, row) {
      row.isCheck = false;
      this.productList.splice(index, 1);
    },
    //无订单生产入库 ,自动生成关联生产订单号
    generationOrderNumber() {
      this.formData.number = new Date().getTime() + "";
      this.addTableVisible = false;
    },
    //初始化所有仓库下拉框
    initRepertoryList() {
        var _this = this;
        initRepertoryList({}).then(res => {
            let {code,msg,data} = res;
                if (code == 200) {
                    _this.repertoryList = data;
                    console.log(_this.repertoryList,'初始化仓库');
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
        var params = {'id': resdata.repertoryId};
        var _this = this;
        getRegionListByRepertoryId(params).then(res => {
            let {code, msg,data} = res;
                if (code == 200) {
                    resdata.regionId = data[0].id;
                    _this.regionList = data;
                } else {
                    _this.regionList = [];
                    _this.$message.warning(msg);
                }
        });
    },
    //点击取消 去生产入库列表页面
    toProduceEnterList() {
      this.$router.push({
        name: "produceEnter"
      });
    },
    showZtreeTable(selectType) {
      this.selectType = selectType;
      this.userInfoVisible = !this.userInfoVisible;
    },
    displayPersonName(param) {
      if (this.selectType == 0) {
        if (param.length == 0) {
          this.formData.warehousePeople = "";
        } else {
          this.formData.warehousePeople = param[0].realName;
        }
      }
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
    // 请求工单详情
    InitiateRequest() {
      let params = {
        workOrderNum: this.formData.workOrderNum
      };
      var _this = this;
      getInitiateRequest(params).then(res => {
        let { code, msg, data, success } = res;
        if (success) {
          data.forEach((item,index) =>{
              data[index].regionId="";
              data[index].repertoryId="";
               data[index].barCode="";
          })
          _this.productList = data;
          _this.formData.customerName = data[0].customerName;
        } else {
          _this.$message.warning(msg);
        }
      });
    }
  },
  watch: {
    "formData.workOrderNum": {
      handler: function(val, oldVal) {
        if (val) {
          this.InitiateRequest();
        }
      },
      deep:true
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