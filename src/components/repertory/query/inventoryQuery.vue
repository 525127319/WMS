<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item>
                    <span class="inventory ventorImg"></span> 库存明细</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
            <el-tab-pane :label="item.categoryName" v-for="item in repertoryList" :key="item.id"></el-tab-pane>
        </el-tabs>
        <div class="handle-box">
            <el-select v-model="status" placeholder="请选存储状态">
                <el-option v-for="item in typeArr" :key="item.value" :label="item.value " :value="item.name">
                </el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="请输入仓库编号、仓库名称、产品名称、产品编号" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <label class="file-btn el-button el-button--primary">导入初始数据<input type="file" ref="attachmentList" style="display:none;" v-on:change="uploadFile()"></label>            <span v-text="fileName"></span>
            <el-button type="success" @click="download()">下载模板</el-button>
            <el-button type="success" @click="exportData">导出数据</el-button>
            <!-- <el-button type="primary" >导入初始数据<el-input type="file" name="attachmentList"  ref="attachmentList"  v-on:change="tempSaveFile()"></el-input></el-button> -->
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="relatedOrderNumber" label="关联订单号">
            </el-table-column>
             <el-table-column prop="transportCoding" label="栈板编号" :formatter="formatterCode">
            </el-table-column>
            <el-table-column prop="repertoryNumber" label="仓库编号">
            </el-table-column>
            <el-table-column prop="repertoryName" label="仓库名称">
            </el-table-column>
            <el-table-column prop="regionNumber" label="库位编号" v-if="status!=='depot'">
            </el-table-column>
            <el-table-column prop="regionName" label="库位名称"  v-if="status!=='depot'">
            </el-table-column>
            <el-table-column prop="productName" label="产品名称">
            </el-table-column>
            <el-table-column prop="productNumber" label="产品编号">
            </el-table-column>
            <el-table-column :formatter="formatterText" prop="specification" label="规格">
            </el-table-column>
            <el-table-column prop="repertoryDetailQuantity" label="库存数量">
            </el-table-column>
            <el-table-column prop="unitName" label="单位">
            </el-table-column>
            <el-table-column prop="barCode" label="二维码" v-if="status=='PackingList'">
            </el-table-column>
             <el-table-column  label="操作" align="center">
                 <template scope="scope">
                     <el-button size="small"  type="primary"  icon="el-icon-printer" @click="handlePrint(scope.$index,scope.row)">打印二维码</el-button>
                 </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next,jumper" :total="total_size">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import {printCodeInfo} from "../../../api/axiosapi";
    import {
        inventoryQueryList, //库存查询列表
        inventoryQueryDetail, //查看库存详情
        uploadFiles, //文件上传
        findRepertory, //物料类别
        findRepertoryInfo, //物料类别数据列表
        findDepot //下来选择库存  
    } from '../../../api/axiosInventoryQueryApi';
    import commonUtil from '../../../common/commonUtil';
    import moment from "moment";

    export default {
        data() {
            return {
                qualityNumber:'无',
                tableData: [],
                cur_page: 1,
                select_word: '',
                total_size: 0,
                fileName: '请选择文件',
                activeName2: '0',
                repertoryList: [], //物料类别列表
                typeArr: [{
                        value: '仓库',
                        name: 'depot'
                    },
                    {
                        value: '库位',
                        name: 'stockAddress'
                    },
                    {
                        value: '箱单',
                        name: 'PackingList'
                    },
                ],
                status: '', //类别
                id: '',
                categoryName: '',
                isflag: '', //标记
                getval: '' //缓存住类别
            }
        },
        created() {
            // 获取物料类别
            this.getRepertory()
            // this.getData();
        },
        methods: {
            //打印二维码
            handlePrint(index,row){
                 var params ={
                    "barCodeList": [
                            {
                                barCode: row.barCode,
                                caseNumber: row.relatedOrderNumber,
                                operator: row.operationPeople,
                                originProductNumber: row.productOldCode,
                                printDate:moment(row.warehousingTime).format("YYYY-MM-DD HH:mm:ss"),
                                productName: row.productName,
                                productNumber: row.productNumber,
                                qualityNumber: this.qualityNumber,
                                quantity: row.repertoryDetailQuantity
                            }
                        ],
                        flag: "table"
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
            handleClick(tab, event) {
                this.status = ''; //置空
                this.id = tab.$options._parentVnode.key;
                this.categoryName = tab.$options.propsData.label;
                // 调用 发起请求
                this.getRepertoryInfo()
            },
            getRepertory() {
                findRepertory().then(res => {
                    let {code,msg,data,success} = res;
                    if (success) {
                        this.repertoryList = data;
                        // 请求回来类别后  请求数据详情
                        this.id = data[0].id;
                        this.categoryName = data[0].categoryName;
                        this.getRepertoryInfo()
                    } else {
                        this.$message.error(msg);
                    }
                });
            },

            getRepertoryInfo() {
                let params = {
                    "currentPage": this.cur_page,
                    "id": this.id,
                    "categoryName": this.categoryName
                };
                findRepertoryInfo(params).then(res => {
                    let {code,msg,data,success} = res;
                    if (success) {
                        this.tableData = data.list;
                        this.total_size = data.page.totalRecord;
                        this.isflag = 1;
                    } else {
                        this.$message.warning(msg);
                        this.tableData = []; //置空
                    }
                });
            },
            //分页
            handleCurrentChange(val) {
                this.cur_page = val;
                if (this.isflag) {
                    this.getRepertoryInfo()
                } else {
                    this.getFindDepot()
                }
            },
            getData() {
                let _this = this;
                var params = {
                    'currentPage': _this.cur_page,
                    'keyWords': _this.select_word
                };
                inventoryQueryList(params).then(res => {
                    let {code,msg,data} = res;
                    if (code == 200) {
                        _this.tableData = data.list;
                        _this.total_size = data.page.totalRecord;
                    } else if (code == 14000) {
                        // _this.$message.warning('无数据');
                        _this.tableData = [];
                        _this.total_size = 0;
                    } else if (code == 500) {
                        _this.$message.error("系统异常!");
                    } else if (code == 400) {
                        _this.$message.warning("参数不合法!");
                    }
                });
            },
            //搜索
            search() {
                this.getData();
            },
            formatterCode(row,column){
                if (row.transportCoding == undefined || row.transportCoding == '') {
                    return "无";
                }
                return row.transportCoding;
            },
            formatterText(row, column) {
                if (row.specification == undefined || row.specification == '') {
                    return "无";
                }
                return row.specification;
            },
            uploadFile() {
                let _this = this;
                let originFile = this.$refs.attachmentList.files[0]; //原文件
                let formData = new FormData();
                formData.append("fileName", originFile);
                uploadFiles(formData).then(res => {
                    _this.fileName = originFile.name;
                    let {code,msg,data} = res;
                    if (code == 200) {
                        _this.fileName = originFile.name;
                        _this.$message.success("导入初始数据成功!");
                        // _this.getData();
                    } else if (code == 500) {
                        _this.$message.error("系统异常");
                    } else if (code == -1404) {
                        _this.$message.warning(msg);
                    } else if (code == 14007) {
                        _this.$message.warning(msg);
                    }
                })
            },
            download() {
                 var url = "http://192.168.20.61:7070/wms/static/img/wms.xlsx"; //测试环境模板地址
                // var url1 = "../../../../static/img/wms.xlsx";
                window.open(url);
            },
            exportData(){
                let dataUrl ="http://imcloud.ceway.com.cn:8080/gateway/wms-stock/repertoryDetailController/excelPort.api"//测试环境
                // let dataUrl ="http://47.106.121.218/gateway/wms-stock/repertoryDetailController/excelPort.api"//正式环境
                window.open(dataUrl);
            },
            getFindDepot() {
                let params = {
                    "currentPage": this.cur_page,
                    "id": this.id,
                    "categoryName": this.categoryName,
                    "status": this.getval
                };
                findDepot(params).then(res => {
                    let {code,msg,data,success} = res;
                    if (success) {
                        this.tableData = data.list;
                        this.total_size = data.page.totalRecord;
                        this.isflag = 0;
                    } else {
                        this.$message.warning(msg);
                        // this.tableData = []; //置空
                    }
                });
            }
        },
        watch: {
            status(val) {
                if(val){
                    this.getval = val;
                    this.getFindDepot();
                }else{
                    return;
                }
               
            }
        }
    }

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
        width: 400px;
        display: inline-block;
    }

    .file-btn input {
        opacity: 0;
        padding-left: 0.5rem;
    }

</style>
