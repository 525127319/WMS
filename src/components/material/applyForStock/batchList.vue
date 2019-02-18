<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><span class="-produce ventorImg" style="margin-right:3px;"></span>备料单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="请输入申请备料单、物料编号进行搜索" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-select v-model="status" filterable @change="getData" placeholder="请选择批次号" >
                <el-option
                    v-for="item in batchNumberData"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
        </div>

        <el-table :data="tableData" border style="width:100%" ref="multipleTable">
            <el-table-column prop="projectNumber" label="专案号"></el-table-column>
            <el-table-column prop="productName" label="物料名称"></el-table-column>
            <el-table-column prop="productCode" label="物料编号"></el-table-column>
            <el-table-column prop="status" label="状态" width="200">
                <!-- <template scope="scope">
                    <el-button size="small" type="primary" @click="queryDetail(scope.row.id, scope.row.projectNumber)">详情</el-button>
                </template> -->
            </el-table-column>
            <el-table-column prop="createTime" :formatter="dateFormatter" label="申请时间"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {
  getMaterialsInfoByBatchNumber
  ,getBatchList
} from "../../../api/axiosApplyStockApi.js";
import moment from "moment";
import commonUtil from "../../../common/commonUtil";
export default {
  data() {
    return {
      tableData: [],
      batchNumberData:[],
      cur_page: 1,
      select_word: "",
      total_size: 0,
      status: ""
    };
  },
  created() {
    this.getBatchListInfo();
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
    getBatchListInfo() {
        getBatchList("").then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          this.batchNumberData = data;
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
    getData() {
      let _this = this;
      let params = {
        currentPage: _this.cur_page,
        keyWords: _this.select_word,
        batchNumber: _this.status
      };
      getMaterialsInfoByBatchNumber(params).then(res => {
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