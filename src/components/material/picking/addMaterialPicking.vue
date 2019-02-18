<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/materialPicking'}">
                    <i class="el-icon-date"></i> 领料单</el-breadcrumb-item>
                <el-breadcrumb-item>新增领料单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="领料时间">
                    <el-col :span="10">
                        <el-date-picker :editable="false" type="date" placeholder="选择日期" v-model="form.pickTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item prop="number" label="领料单号">
                    <el-col :span="10">
                        <el-input v-model="form.number" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="pickingPeople" label="领料人">
                    <el-col :span="10">
                        <el-input v-model="form.pickingPeople" readonly @click.native="showZtreeTable(0)"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联订单号">
                    <el-col :span="10">
                        <el-input v-model="form.orderNumber"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="工单号">
                    <el-col :span="10">
                        <el-input v-model="form.workNumber"></el-input>
                    </el-col>
                </el-form-item>
                
                <el-form-item prop="purpose" label="用途">
                    <el-col :span="10">
                        <el-input v-model="form.purpose"></el-input>
                    </el-col>
                </el-form-item>
                <!-- 显示人事ztree弹框 -->
                <user-info-com v-show="userInfoVisible" @user-info="displayPickingPeopleName"></user-info-com>

                <el-form-item prop="remark" label="备注">
                    <el-col :span="10">
                        <el-input type="textarea" v-model="form.remark"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
      
            <el-button @click.native="showDialog" type="primary" >新增领料物料明细</el-button>
        
            <el-table ref="materialDetailList" :data="materialDetailList" border highlight-current-row style="width: 100%">
                <el-table-column label="操作" width="100">
                    <template scope="scope">
                        <el-icon name="minus" @click.native="deleteProduct(scope.$index,materialDetailList)"></el-icon>
                    </template>
                </el-table-column>
                <el-table-column property="productName" label="物料名称"></el-table-column>
                <el-table-column property="productNumber" label="物料编号"></el-table-column>
                <el-table-column property="specification" label="规格"></el-table-column>
                <el-table-column property="planQuantity" label="计划领用数量"></el-table-column>
                <el-table-column property="quantity" label="领用数量">
                    <template scope="scope">
                        <el-input-number :controls="false" size="small" v-model="scope.row.quantity" />
                    </template>
                </el-table-column>
                <el-table-column property="hasQuantity" label="已领用数量"></el-table-column>
                <el-table-column property="unitName" label="单位"></el-table-column>
                <el-table-column property="repertoryName" label="所在仓库"></el-table-column>
                <el-table-column property="regionName" label="所在库位"></el-table-column>
                <el-table-column property="repertoryDetailQuantity" label="剩余库存"></el-table-column>
                <el-table-column property="purpose" label="用途"></el-table-column>
            </el-table>
            <el-dialog title="物料列表" size="large" v-model="addTableVisible" :close-on-click-modal="false">
                    <el-col :span="10">
                        <el-input v-model="select_word" placeholder="请输入物料名称、物料编号搜索" class="handle-input"></el-input>
                    </el-col>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                    <el-table ref="productTable" :data="productTable" highlight-current-row @row-click="handleCurrentChange" style="width: 100%">
                        <el-table-column property="relatedOrderNumber" label="关联订单号">
                        </el-table-column>
                        <el-table-column property="productName" label="物料名称">
                        </el-table-column>
                        <el-table-column property="productNumber" label="物料编号">
                        </el-table-column>
                        <el-table-column property="specification" label="规格">
                        </el-table-column>
                        <el-table-column property="repertoryName" label="所在仓库">
                        </el-table-column>
                        <el-table-column property="regionName" label="所在库位">
                        </el-table-column>
                        <el-table-column property="repertoryDetailQuantity" label="剩余库存">
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
                        <el-pagination @current-change="queryByPage" layout="total,prev, pager, next,jumper " :total="total_size">
                        </el-pagination>
                    </div>
                    <div class='buttons'>
                        <el-button type="primary" @click="addTableVisible = false">确定</el-button>
                    </div>
                </el-dialog>
        </div>
        <div class='buttons'>
            <el-button @click="toMaterialPickingList">返回</el-button>
            <el-popover ref="popover2" width="200" trigger="hover" content="保存为草稿后可以编辑!"></el-popover>
            <el-button v-popover:popover2 type="success" @click="onSubmit('form',1)">保存为草稿</el-button>
            <el-popover ref="popover1" width="200" trigger="hover" content="保存并提交后不能再编辑!"></el-popover>
            <el-button v-popover:popover1 type="primary" @click="onSubmit('form',0)">保存并提交</el-button>
        </div>
    </div>
</template>

<script>
import {
  initRepertoryList,
  getRegionListByRepertoryId,
  getCodeBySeqName
} from "../../../api/axiosPurchaseOrderApi";
import commonUtil from "../../../common/commonUtil.js";
import userInfoCom from "../../page/start";
import {
  findAddMaterialsInfoByMaterialswebApi,
  addMaterialPicking,
  findAddMaterialsNumber
} from "../../../api/axiosMaterialPickingApi";

export default {
    components: {
      userInfoCom
    },
    data: function() {
      return {
          form: {
            number: "", //领料单号
            pickTime: new Date(), //领料时间
            // repertoryId: '',//仓库id
            //repertoryRegionId: '',//库位id
            orderNumber:'',//关联订单号
            recipientsCost: 0, //成本总额
            purpose: "", //用途
            pickingPeople: sessionStorage.getItem("currentLoginUser"), //领料人
            preparesNumber: "",
            remark: "", //备注
            type: 1, //'领料标记：0代表提交领料，1代表保存领料草稿,',
            workNumber:'',//工单号
          },
          rules: {
            number: [{ required: true, message: "请输入领料单号", trigger: "blur" }],
            purpose: [{ required: false, message: "请输入用途", trigger: "blur" }],
            pickingPeople: [{ required: true, message: "请选择领料人", trigger: "change" }],
            remark: [{ required: false, message: "请输入备注", trigger: "blur" }]
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
          selectType: 0
        };
    },
    created() {
      this.findAddMaterialsNumber();
    },
    methods: {
      // formatDateTime (inputTime) {
      //       if (inputTime == undefined) {
      //           return "";
      //       }
      //       var date = new Date(inputTime);
      //       var y = date.getFullYear();
      //       var m = date.getMonth() + 1;
      //       m = m < 10 ? ('0' + m) : m;
      //       var d = date.getDate();
      //       d = d < 10 ? ('0' + d) : d;
      //       var h = date.getHours();
      //       h = h < 10 ? ('0' + h) : h;
      //       var minute = date.getMinutes();
      //       var second = date.getSeconds();
      //       minute = minute < 10 ? ('0' + minute) : minute;
      //       second = second < 10 ? ('0' + second) : second;
      //       return y + '-' + m + '-' + d +' ' + h +':' + minute + ':' +second;
      //   },
      //确定保存
      onSubmit(formName, type) {
        var _this = this;
        // _this.form.pickTime = this.formatDateTime(_this.form.pickTime);
        // console.log(_this.form.pickTime);
        // return
        _this.$refs[formName].validate(function(valid) {
          if (valid) {
            if (_this.form.pickTime == undefined || _this.form.pickTime == "") {
              _this.$message.warning("请选择领料时间!");
              return;
            }
            _this.form.pickTime = commonUtil.formatDateTime(_this.form.pickTime);
            _this.form.type = type;
            var params = {
              'pickMaterials': _this.form,
              'list': _this.materialDetailList
            };
            if (_this.materialDetailList.length == 0) {
              _this.$message.warning("请新增领料物料明细!");
              return;
            }
            var flag = false;
            //成本总额
            _this.form.recipientsCost = 0;
            _this.materialDetailList.forEach(function(value, index) {
              _this.form.recipientsCost +=value.unitPriceExcludingTax * value.quantity;
              if (value.quantity <= 0) {
                _this.$message.warning('物料名称为【'+value.productName+'】领用数量必须大于0');
                flag = true;
              } else if (value.quantity > value.repertoryDetailQuantity) {
                _this.$message.warning('物料名称为【'+value.productName+'】领用数量不能超过库存数量');
                flag = true;
              }
            });
            if (!flag) {
              addMaterialPicking(params).then(res => {
                let { code, msg, data } = res;
                if (code == 200) {
                  _this.$message.success("新增成功!");
                  _this.$router.push({ name: "materialPicking" });
                } else if (code == 14001) {
                  _this.$message.error("新增失败!");
                } else if (code == 500) {
                  _this.$message.error("系统错误,新增失败!");
                }
              });
            }
          } else {
            _this.$message.error("请输入必填项!");
            return;
          }
        });
      },
      //初始化所在仓库下拉框
      initRepertoryList() {
        var _this = this;
        initRepertoryList({}).then(res => {
          let { code, msg, data } = res;
          if (code == 200) {
            _this.repertoryList = data;
          } else if (code == 500) {
            _this.$message.error("系统异常");
          } else if (code == 14000) {
            _this.repertoryList = [];
          }
        });
      },
      //仓库下拉框的值改变时触发,获取所有库位信息
      getRegionListById(repertoryId) {
        var params = { id: repertoryId };
        var _this = this;
        getRegionListByRepertoryId(params).then(res => {
          let { code, msg, data } = res;
          if (code == 200) {
            _this.regionList = data;
            _this.form.repertoryRegionId = _this.regionList[0].id;
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
      
        var params = { currentPage: this.cur_page, keyWords: this.select_word,productType:0,orderNumber:this.form.orderNumber==''?'无':this.form.orderNumber };
        console.log(JSON.stringify(params));
        findAddMaterialsInfoByMaterialswebApi(params).then(res => {
          let { code, msg, data } = res;
          if (code == 200) {
            // console.log("-------------" + JSON.stringify(data.list));
            if (_this.materialDetailList != null) {
              data.list.forEach(function(item, index) {
                item.isCheck = false;
                item.planQuantity = 0;
                item.hasQuantity = 0;
                _this.materialDetailList.forEach(function(selectedItem, i) {
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
      //显示弹窗
      showDialog() {
        this.addTableVisible = true;
        this.queryMaterialList();
      },

      //点击取消,去领料单列表
      toMaterialPickingList() {
        this.$router.push({ name: "materialPicking" });
      },
      //自动生成领料单号
      //初始化序列号
      findAddMaterialsNumber() {
        var _this = this;
        let dataJson = {"seqName":"picking"};
        getCodeBySeqName(dataJson).then(res => {
          let { code, msg, data } = res;
          if (code == 200) {
            _this.form.number = data.number;
          }
        });
      },
      displayPickingPeopleName(param) {
        if (this.selectType == 0) {
          if (param.length == 0) {
            this.form.pickingPeople = "";
          } else {
            this.form.pickingPeople = param[0].realName;
          }
        }
      },
      //
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

.handle-box {
  margin-bottom: 20px;
}
.buttons {
  overflow: hidden;
  padding: 1rem 0;
}
.buttons > * {
  margin-left: 32px;
  float: right;
}
.el-form{
  overflow: hidden;
}
</style>