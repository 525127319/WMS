<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb>
                 <el-breadcrumb-item><span class="manage ventorImg"></span> 栈板管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model.trim="select_word" placeholder="请输入二维码或栈板名称" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button  type="primary" icon="plus" class="handle-del mr10" @click="addTransport">新增</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable" v-loading="fullscreenLoading" >
            <el-table-column prop="transportName" label="栈板名称" align="center">
            </el-table-column>
            <el-table-column prop="transportCreater" label="创建者" align="center">
            </el-table-column>
            <el-table-column prop="creatTime" label="创建时间" :formatter="dateFormatter" align="center">
            </el-table-column>
             <el-table-column prop="transportCoding" label="二维码"  align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template scope="scope">
                    <!-- <el-button size="small" type="primary" icon="plus" class="handle-del mr10" @click="addTransport(scope.$index, scope.row)">新增</el-button> -->
                    <el-button size="small"  type="primary"  @click="handleEdit(scope.$index, scope.row)" icon="edit">编辑</el-button>
                    <el-button size="small"  type="primary"  icon="el-icon-printer" @click="handlePrint(scope.$index,scope.row)">打印二维码</el-button>
                    <!-- <el-button size="small"  type="danger"  @click=" handleDelete(scope.$index, scope.row)" icon="delete">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" 
             @size-change="handleSizeChange"  :page-sizes="[10, 20, 30, 40]"  :page-size="limit"   layout="total, sizes, prev, pager, next, jumper" :total="total_size">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { transportList, deleteTransportInfo,printCodeInfo } from "../../api/axiosapi";
import moment from "moment";

export default {
  data() {
    return {
      fullscreenLoading: false,
      tableData: [],
      select_word: "",
      cur_page: 1,
      limit: 10,
      total_size: 0,
      barCode:'',
      caseNumber:'',
      operator:'',
      originProductNumber:'',
      printDate:'',
      productName:'',
      productNumber:'',
      qualityNumber:'',
      quantity:'',
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //打印
    handlePrint(index,row){
        var params ={
            "barCodeList": [
                    {
                      "barCode": row.transportCoding,
                      "caseNumber": this.caseNumber,
                      "operator": this.operator,
                      "originProductNumber": this.originProductNumber,
                      "printDate": this.printDate,
                      "productName": this.productName,
                      "productNumber": this.productNumber,
                      "qualityNumber": this.qualityNumber,
                      "quantity": this.quantity
                    }
                ],
                "flag": "code"
              } 
            printCodeInfo(params).then(res =>{
                let { code, msg, data, success } = res;
                if(code ==200){
                  this.$message.success('打印成功');
                }else{
                  this.$message.warning(msg);
                }
            })

                
      },
    dateFormatter(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    //栈板列表
    getData() {
      let _this = this;
      var params = {
        keyWords: _this.select_word,
        pageNum: _this.cur_page,
        pageSize: _this.limit
      };
      transportList(params).then(res => {
        let { code, data, msg } = res;
        if (code == 200) {
          _this.tableData = data.list;
          _this.total_size = data.page.totalRecord;
        } else {
          _this.$message.error(msg);
        }
      });
    },
    //搜索
    search() {
      this.getData();
    },
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    //去编辑页面
    handleEdit(index, row) {
      this.$router.push({
        path: "editTransport",
        query: {
          id: row.transportId
        }
      });
    },
    //删除
    handleDelete(index, row) {
      var params = { transportId: row.transportId };
      var _this = this;
      _this
        .$confirm("你确定要删除该条栈板信息吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          deleteTransportInfo(params).then(res => {
            let { code, msg, data } = res;
            if (code == 200) {
              _this.tableData.splice(index, 1);
              _this.$message.success("删除成功");
              _this.getData();
            } else {
              _this.$message.error(msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //去新增页面
    addTransport(index, row) {
      this.$router.push({
        path: "addTransport"
      });
    }
  }
};
</script>

<style scoped>
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
</style>