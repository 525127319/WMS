<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><span class="-produce ventorImg" style="margin-right:3px;"></span>备料单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <label class="file-btn el-button el-button--primary" icon="plus">导入清单<input type="file" ref="attachmentList" style="display:none;" v-on:change="uploadFile()"></label>        <span style="display:none;" v-text="fileName"></span>
            <el-input v-model="select_word" placeholder="请输入申请备料单、物料编号进行搜索" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-select v-model="status" @change="getData" placeholder="请选择批次状态" >
                <el-option
                    v-for="item in typeArr"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <!--    其实我们素昧平生

        但为何一见如故呢    -->
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="id" v-if="1===2" label=""></el-table-column>
            <el-table-column prop="batchNumber" label="批次号"></el-table-column>
            <el-table-column prop="projectNumber" label="专案号"></el-table-column>
            <el-table-column prop="status" label="批次状态"></el-table-column>
            <el-table-column prop="createTime" :formatter="dateFormatter" label="申请时间"></el-table-column>
            <el-table-column prop="type" label="操作" width="200">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="queryDetail(scope.row.id, scope.row.projectNumber)">详情</el-button>
                    <template v-if="scope.row.status === '未备料'">
                        <el-button size="small" type="primary" @click="deleteProjectInfo(scope.row.id)">删除</el-button>
                    </template>
                    <template v-else>
                        <el-button size="small" type="primary" disabled="disabled" @click="deleteProjectInfo(scope.row.id)">删除</el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
            </el-pagination>
        </div>
        <!-- 查看详情 -->
        <el-dialog title="备料单详情" size='large' :visible.sync="dialogTableVisible">
            <el-tabs type="card" v-model="activeName">
                <el-tab-pane name = "0" label="未申请">
                    <el-table :data="applyStockDetailsnoApplyData" tooltip-effect="dark" style="width: 100%" ref="materialsTabs" @selection-change="handleCurrentChangeProduct">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column prop="id" v-if="1===2" label="ID">
                        </el-table-column>
                        <el-table-column prop="applyStockId" v-if="1===2" label="父级ID">
                        </el-table-column>
                        <el-table-column prop="productName" label="物料名称">
                        </el-table-column>
                        <el-table-column prop="productCode" label="物料编号">
                        </el-table-column>
                        <el-table-column prop="quantity" label="计划备料数量">
                        </el-table-column>
                        <el-table-column label="总数量(公共池数量)">
                            <template scope="scope">
                                <span>
                                    {{scope.row.repertoryQuantity}}({{scope.row.noProjectRepertoryQuantity}})
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态">
                        </el-table-column>
                        <el-table-column prop="type" label="操作" width="200">
                        <template scope="scope">
                          <el-button size="small" type="primary" @click="deleteDetailsInfoById(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                    </el-table>
                    <el-button size="small" type="primary" @click="stockMaterials()">备料</el-button>
                </el-tab-pane>
                <el-tab-pane name = "1" label="已申请">
                    <el-table :data="applyStockDetailsyetApplyData" tooltip-effect="dark" style="width: 100%" ref="materialsTabs" @selection-change="handleCurrentChangeProduct">
                        <el-table-column prop="id" v-if="1===2" label="ID">
                        </el-table-column>
                        <el-table-column prop="applyStockId" v-if="1===2" label="父级ID">
                        </el-table-column>
                        <el-table-column prop="productName" label="物料名称">
                        </el-table-column>
                        <el-table-column prop="productCode" label="物料编号">
                        </el-table-column>
                        <el-table-column prop="quantity" label="计划备料数量">
                        </el-table-column>
                        <el-table-column prop="status" label="状态">
                        </el-table-column>
                    </el-table>
                    <el-button size="small" type="primary" @click="stockMaterials()">备料</el-button>
                </el-tab-pane>
                <el-tab-pane name = "2" label="异常">
                    <el-table :data="applyStockDetailsAbnormaData" style="width: 100%">
                        <el-table-column prop="id" v-if="1===2" label="ID">
                        </el-table-column>
                        <el-table-column prop="applyStockId" v-if="1===2" label="父级ID">
                        </el-table-column>
                        <el-table-column prop="productName" label="物料名称">
                        </el-table-column>
                        <el-table-column prop="productCode" label="物料编号">
                        </el-table-column>
                        <el-table-column prop="quantity" label="计划备料数量">
                        </el-table-column>
                        <el-table-column label="状态">
                            <template scope="scope">
                                <template v-if="scope.row.status === '正常'">
                                    <span>{{scope.row.status}}</span>
                                </template>
                                <template v-else>
                                    <span style="color:red;">{{scope.row.status}}</span>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            
            
        </el-dialog>
    </div>
</template>
<script>
import {
  getApplyStockByPage,
  getApplyStockDetailsById,
  addApplyStockInfo,
  addStockInfo,
  deleteApplyStockInfo,
  deleteApplyStockDetailsInfoById
} from "../../../api/axiosApplyStockApi.js";
import moment from "moment";
import commonUtil from "../../../common/commonUtil";
export default {
  data() {
    return {
      activeName:'0',
      id:'',
      projectNumber:'',
      tableData: [],
      cur_page: 1,
      select_word: "",
      total_size: 0,
      dialogTableVisible: false,
      applyStockDetailsnoApplyData: [],
      applyStockDetailsyetApplyData: [],
      applyStockDetailsAbnormaData: [],
      stockList: [],
      status: "",
      fileName: "请选择文件",
      typeArr: [
        {
          name: "全部",
          value: ""
        },
        {
          name: "未备料",
          value: "no_stock"
        },
        {
          name: "部分备料",
          value: "portion_stock"
        },
        {
          name: "已备料",
          value: "yet_stock"
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    dateFormatter(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },
    //导入
    uploadFile() {
      let _this = this;
      let originFile = this.$refs.attachmentList.files[0]; //原文件
      let formData = new FormData();
      formData.append("fileName", originFile);
      addApplyStockInfo(formData).then(res => {
        _this.fileName = originFile.name;
        let { code, msg, data } = res;
        if (code == 200) {
            this.getData();
            this.$message({
                message: msg,
                type: 'success'
            });
        } else if (code == 500) {
          _this.$message.error("系统异常");
        } else {
          _this.$message.warning(msg);
        }
      });
    },
    getData() {
      let _this = this;
      let params = {
        currentPage: _this.cur_page,
        keyWords: _this.select_word,
        type: _this.status
      };
      getApplyStockByPage(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
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
    search() {
      this.getData();
    },
    stockMaterials() {
        if (this.stockList.length <= 0) {
            this.$message.warning("请选择需要备料的物料!");
            return;
        }
        let isRight = false;
        this.stockList.forEach(function(value, index) {
            if (value.quantity > value.repertoryQuantity) {
              isRight = true;
              return;
            }
        });
        if (isRight) {
          this.$message.warning("物料数量不足无法备料，请重新选择物料!");
          return;
        }
        let dataJson = {"id":this.id,"projectNumber":this.projectNumber,"list":this.stockList};
        addStockInfo(dataJson).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
            this.$message({
                message: msg,
                type: 'success'
            });
            this.getData();
            this.queryDetail(this.id,this.projectNumber);
            this.activeName = '1';
        } else if (code == 500) {
          _this.$message.error("系统异常!");
        } else if (code == 400) {
          _this.$message.warning("参数不合法!");
        } else if (code == 14000) {
          _this.$message.warning("无数据!");
        }
      });
    },
    handleCurrentChangeProduct(val) {
      this.stockList = val;
    },

    //查看详情
    queryDetail(id, projectNumber) {
      let _this = this;
      _this.activeName = '0';
      _this.id = id;
      _this.projectNumber = projectNumber;
      let params = { Id: id,"projectNumber":projectNumber};
      getApplyStockDetailsById(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
            _this.dialogTableVisible = true;
            _this.applyStockDetailsnoApplyData = data.noApplyList;
            _this.applyStockDetailsAbnormaData = data.abnormalList;
            _this.applyStockDetailsyetApplyData = data.yetApplyList;
        } else if (code == 500) {
          _this.$message.error("系统异常!");
        } else if (code == 400) {
          _this.$message.warning("参数不合法!");
        } else if (code == 14000) {
          _this.$message.warning("无数据!");
        }
      });
    },
    deleteProjectInfo(id){
      let params = { id: id};
      deleteApplyStockInfo(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
            this.getData();
            this.$message({
                message: msg,
                type: 'success'
            });
        } else if (code == 500) {
          _this.$message.error("系统异常!");
        } else if (code == 400) {
          _this.$message.warning("参数不合法!");
        } else if (code == 14000) {
          _this.$message.warning("无数据!");
        }
      });
    },
    deleteDetailsInfoById(id) {
      let params = { id: id};
      deleteApplyStockDetailsInfoById(params).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
            this.$message({
                message: msg,
                type: 'success'
            });
            this.getData();
            this.queryDetail(this.id,this.projectNumber);
            this.activeName = '0';
        } else if (code == 500) {
          _this.$message.error("系统异常!");
        } else if (code == 400) {
          _this.$message.warning("参数不合法!");
        } else if (code == 14000) {
          _this.$message.warning("无数据!");
        }
      });
    }
  }
};
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
.el-form-item__content {
  line-height: 34px;
  position: relative;
  font-size: 14px;
}
</style>