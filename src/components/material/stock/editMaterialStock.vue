<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path:'/materialStock'}">
          <span class="-produce voterIcon" style="margin-right:3px;"></span>备料单</el-breadcrumb-item>
        <el-breadcrumb-item>编辑备料单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
<div class="form-box">
  <el-form ref="form" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="备料时间"  prop="produceTime">
      <el-col :span="10">
        <el-date-picker :editable="false" type="date" format="yyyy-MM-dd" placeholder="选择日期" v-model="form.produceTime" style="width: 100%;"></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item prop="number" label="备料单号">
      <el-col :span="10">
        <el-input v-model="form.number" readonly></el-input>
      </el-col>
    </el-form-item>
    <el-form-item prop="preparesMaterialsPeople" label="备料人">
      <el-col :span="10">
        <el-input v-model="form.preparesMaterialsPeople" readonly @click.native="showZtreeTable(0)"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="关联订单单号">
      <el-col :span="10">
        <el-input v-model="form.orderNumber" readonly></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="工单号">
      <el-col :span="10">
        <el-input v-model="form.workNumber" readonly></el-input>
      </el-col>
    </el-form-item>
    <el-form-item prop="remark" label="备注">
      <el-col :span="10">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-col>
    </el-form-item>
    </el-form>
<!-- 显示人事ztree弹框 -->
<user-info-com v-show="userInfoVisible" @user-info="displayPeopleName"></user-info-com>
<el-table ref="materialDetailList" :data="materialDetailList" border highlight-current-row style="width: 100%">
<el-table-column property="productName" label="物料名称"></el-table-column>
<el-table-column property="productNumber" label="物料编号"></el-table-column>
<!-- <el-table-column property="specification" label="规格"></el-table-column> -->
<el-table-column property="requiredQuantity" label="订单计划备料数量"></el-table-column>

 <el-table-column property="balance" label="结存数量"></el-table-column> 

<el-table-column property="quantity" label="实际备料数量"></el-table-column>
<el-table-column property="unitName" label="单位"></el-table-column>
<el-table-column label="操作">
  <template scope="scope">
    <el-button size="small" type="success" @click="findInventeryByProductNumber(scope.$index, materialDetailList)">备料</el-button>
  </template>
</el-table-column>
</el-table>
<el-dialog title="备料明细" size="large" v-model="addTableVisible" :close-on-click-modal="false">
    <span>计划备料数量:{{planPreparesQuantity}}</span>
    <!-- <el-form-item label="计划数量:"> -->
    <!-- <span v-text="planPreparesQuantity"></span> -->
    <!-- </el-form-item> -->
    <el-table ref="productTable" :data="productTable" highlight-current-row style="width: 100%">
        <el-table-column property="productName" label="物料名称">
        </el-table-column>
        <el-table-column property="productNumber" label="物料编号">
        </el-table-column>
        <el-table-column property="repertoryName" label="所在仓库">
        </el-table-column>
        <el-table-column property="regionName" label="所在库位">
        </el-table-column>
        <el-table-column property="barCode" label="二维码编号">
        </el-table-column>
        <el-table-column property="repertoryQuantity" label="剩余库存">
        </el-table-column>
        <el-table-column property="unitName" label="单位">
        </el-table-column>
        <el-table-column property="quantity" label="已备料数量">
        </el-table-column>
        <el-table-column property="currQuantity" label="备料数量">
          <template scope="scope">
            <el-input-number :controls="false" size="small" v-model="scope.row.currQuantity" />
          </template>
        </el-table-column>
    </el-table>
    <div class='buttons'>
      <el-button type="primary" @click="calculationQuantity">确定</el-button>
      <el-button @click="addTableVisible = false">取消</el-button>
    </div>
  </el-dialog>
</div>
<div class='buttons'>
  <el-button @click="toMaterialStockList">返回</el-button>
  <el-popover ref="popover1" width="200" trigger="hover" content="如果提交后,此领料单不可编辑!请谨慎"></el-popover>
  <el-button type="primary" @click="onSubmit('form','two')">提交</el-button>
  <el-popover ref="popover2" width="200" trigger="hover" content="此保存按钮为保存数据使用,可编辑!如果确认无误后,请点击提交按钮"></el-popover>
</div>
</div>
</template>

<script>
  import commonUtil from "../../../common/commonUtil.js";
  import userInfoCom from "../../page/start";
  import { findAddMaterialsInfoByMaterialswebApi } from "../../../api/axiosMaterialPickingApi";
  import {
    editMaterialStock, //编辑备料单
    findProducePreparesDetailById, //编辑回显
    findInventeryByProductNumber //根据产品编号 选择物料备料仓库
  } from "../../../api/axiosMaterialStockApi";
  import moment from "moment";

  export default {
    components: {
      userInfoCom
    },
    data: function () {
      return {
        form: {
          id: "", //备料单id
          produceTime:'', //备料时间
          number: "", //备料单号
          orderNumber: "", //关联订单单号
          preparesMaterialsPeople: "", //备料人
          produceResion: "备料原因即用途", //用途
          verifier: "审核人暂不用", //审核人
          remark: "", //备注
          type: "two", //备料类型:0-已生产备料，1-待备料备料
          workNumber: "" //工单号
          //preparesMaterialsSource: 2,//备料单来源:2-本地web生产备料单，3-生产计划生产备料单
        },
        rules: {
          number: [{ required: true, message: "请输入备料单号", trigger: "blur" }],
          preparesMaterialsPeople: [
            { required: true, message: "请选择备料人", trigger: "change" }
          ],
          remark: [{ required: false, message: "请输入备注", trigger: "blur" }],
          // produceTime: [{ type: 'date', required: true,  message: "请选中备料时间", trigger: "change" }],
        },
        userInfoVisible: false, //领料人弹框标记
        addTableVisible: false, //物料列表弹框
        repertoryList: [], //仓库id 仓库名称下拉框
        regionList: [], //库位id 库位名称下拉框
        materialDetailList: [], //选中后的物料明细数组
        productTable: [], //物料列表
        select_word: "", //关键字
        total_size: 0, //总记录数
        cur_page: 1, //当前页码
        count: 0,
        selectType: 0,
        planPreparesQuantity: 0, //计划备料数量
        SelectedData: ''//选中的数据
      };
    },
    created() {
      this.findProducePreparesDetailById();
    },
    methods: {
      //确定保存
      onSubmit(formName, type) {
        var _this = this;
        _this.$refs[formName].validate(valid => {
          if (valid) {
            _this.form.produceTime = commonUtil.formatDateTime(_this.form.produceTime);
            _this.form.type = type;
            delete _this.form.createTime;
            delete _this.form.creator;
            delete _this.form.delFlag;
            delete _this.form.updateTime;
            delete _this.form.updator;
            var params = {
              producePreparesMaterials: _this.form,
              productArr: _this.materialDetailList
            };
            editMaterialStock(params).then(res => {
              let { code, msg, data } = res;
              if (code == 200) {
                _this.$message.success("编辑备料单信息成功!");
                _this.$router.push({ name: "materialStock" });
              } else if (code == 14001) {
                _this.$message.error("编辑备料单信息失败!");
              } else if (code == 500) {
                _this.$message.error("系统错误,编辑备料单信息失败!");
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      //计算已备料数量(备料明细中的每个仓库库位备料数量)
      calculationQuantity() {
        const _this = this;
        let productNumber = ""; //产品编号
        let countQuantity = 0; //总数量

        for (let item of _this.productTable) {
          if (item.currQuantity > item.repertoryQuantity) {
            //当前备料数量 超出库存数量
            _this.$message.warning(item.repertoryName + "-" + item.regionName + "备料数量不能超过库存数量");
            return;
          } else {
            countQuantity += item.quantity + item.currQuantity;
            productNumber = item.number;
          }
        }
        console.log(countQuantity,5555)
        if (countQuantity > this.SelectedData.requiredQuantity) {
          _this.$message.warning('备料数量大于计划备料数量,请核对重新备料');
        } else {
          this.SelectedData.quantity = countQuantity;
          this.SelectedData.detailArr = _this.productTable;

          _this.addTableVisible = false;
        }
      },
      // 
      findInventeryByProductNumber(index, item) {
        this.SelectedData = item[index];
        var _this = this;
        var params = {
          productId: this.SelectedData.id,
          orderNumber: _this.form.orderNumber,
          number: _this.form.number
        };
        _this.planPreparesQuantity = this.SelectedData.requiredQuantity+this.SelectedData.balance; //计划备料数量
        findInventeryByProductNumber(params).then(res => {
          let { code, msg, data } = res;
          if (code == 200) {
            _this.addTableVisible = true;
            _this.productTable = data.list;
          } else if (code == 500) {
            _this.$message.error("系统错误!");
          } else {
            _this.$message.warning(msg);
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

        var params = { currentPage: this.cur_page, keyWords: this.select_word };
        findAddMaterialsInfoByMaterialswebApi(params).then(res => {
          let { code, msg, data } = res;
          if (code == 200) {
            if (_this.materialDetailList != null) {
              data.list.forEach(function (item, index) {
                _this.materialDetailList.forEach(function (selectedItem, i) {
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
            _this.$message.error("系统异常");
          } else if (code == 400) {
            _this.$message.error("非法参数");
          } else if (code == 14000) {
            _this.productTable = [];
            _this.total_size = 0;
          }
        });
      },
      //显示弹窗
      showDialog() {
        this.addTableVisible = true;
        this.queryMaterialList();
      },

      //点击取消,去备料料单列表
      toMaterialStockList() {
        this.$router.push({ name: "materialStock" });
      },
      //初始化
      findProducePreparesDetailById() {
        var _this = this;
        var params = { id: _this.$route.query.materialStockId };
        findProducePreparesDetailById(params).then(res => {
          console.log(res,3333);
          let { code, msg, data } = res;
          if (code == 200) {
             
              data.producePreparesMaterials.preparesMaterialsPeople= sessionStorage.getItem('currentLoginUser');
              data.producePreparesMaterials.produceTime =new Date();
              _this.form = data.producePreparesMaterials;
              // _this.form.preparesMaterialsPeople = '';
              _this.materialDetailList = data.productVoList;
            //var params = {'productId':item[index].id,'orderNumber':_this.form.orderNumber,'number':_this.form.number};

            // _this.materialDetailList.forEach(function (item, index) {
            //   var params1 = {
            //     productId: item.id,
            //     number: _this.form.number,
            //     orderNumber: _this.form.orderNumber
            //   };
            //   findInventeryByProductNumber(params1).then(res => {
            //     let { code, msg, data } = res;
            //     if (code == 200) {
            //       // _this.productTable = data.list;
            //       item.detailArr = data.list;
            //     } else if (code == 500) {
            //       _this.$message.error("系统错误!");
            //     } else {
            //       _this.$message.warning(msg);
            //     }
            //   });
            // });
          } else if (code == 500) {
            _this.$message.error("系统异常!");
          } else if (code == 400) {
            _this.$message.warning("参数不合法!");
          } else {
            _this.$message.error(msg);
          }
        });
      },
      displayPeopleName(param) {
        // if (this.selectType == 0) {
        console.log('start');
        if (param.length == 0) {
          this.form.preparesMaterialsPeople = "";
        } else {
          this.form.preparesMaterialsPeople = param[0].realName;
        }
        // } 
        // else if (this.selectType == 1) {
        //   if (param.length == 0) {
        //     this.form.verifier = "";
        //   } else {
        //     this.form.verifier = param[0].realName;
        //   }
        // }
      },
      showZtreeTable(selectType) {
        this.selectType = selectType;
        this.userInfoVisible = !this.userInfoVisible;
      }
    }
  };
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