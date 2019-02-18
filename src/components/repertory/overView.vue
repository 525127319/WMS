<template>
    <!-- 最大的 -->
    <article class="spectaculars">
        <header class="spectaculars-top">
            <h1>仓库信息总览数据图</h1>
            <div class="spectaculars-text">
                 <div class="text-left">
                    <span>
                        <i class="icon-dili"></i>
                        深圳市基迈斯智能有限公司
                    </span>
                </div>
                 <div class="text-right">
                   <!-- 2018年5月28日 星期一 11:05 -->
                     <span>{{nowTime}}</span>
                </div>
            </div>

        </header>
        <ul class="spectaculars-main">
            <!-- 4个模块 -->
            <li class="main-li">
                <h2>质检信息概览</h2>
                <div class="li-center">
                    <div class="center-ech" >
                        <div id="quality"></div>
                        <p class="ech-text">质检总数与之百分比</p>
                    </div>
                    <div class="center-ech">
                        <div id="standard"></div>
                        <p class="ech-text">非标准件与标准件质量检测统计图</p>
                    </div>
                </div>
                <p class="li-footer">
                    <span class="f_bg"></span>
                    <!-- 机加件与标准质量检测合格率共同主办 -->
                    <marquee  class="footer-text" direction="left">{{quarantine}}</marquee>
                </p>
            </li>
            <li class="main-li">
                <h2>入库信息概览</h2>
                <div class="li-center">
                        <div class="center-ech storage" >
                            <div class="storage-main">
                                <div id="storage-left"></div>
                                <p class="storage-top">标准件<small>(单位pcs)</small></p>
                                <ul class="storage-fot">
                                    <li v-for="(item,index) in newStandSt" :key="index" >
                                        <span class="ico" :class="'no'+(index+1)"></span>
                                        <p><span v-text="index==0?'待入库':'已入库'"></span>&nbsp;&nbsp;<span>{{item.value}}pcs</span></p>
                                        <span>{{item.quantityProcess}}</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="storage-main">
                                <div id="storage-right"></div>
                                <p class="storage-top">非标准件<small>(单位pcs)</small></p>
                                <ul class="storage-fot">
                                    <li v-for="(item,index) in newUnstandSt" :key="index">
                                        <span class="ico no" :class="'no'+(index+1)"></span>
                                        <p><span v-text="index==0?'待备料':'已备料'"></span>&nbsp;&nbsp;<span>{{item.value}}pcs</span></p>
                                        <span>{{item.quantityProcess}}</span>
                                    </li>
                                </ul>                                
                            </div>                
                        </div>
                        <div class="center-ech" >
                            <div id="storage-msg"></div>
                            <p class="ech-text">非标准件与标准件近四天入库统计图</p>                           
                        </div>                       
                </div>
                <p class="li-footer">
                        <span class="f_bg"></span>
                        <marquee  class="footer-text" direction="left">{{stockPend}}</marquee>
                 </p>
            </li>
            <li class="main-li">
                <h2>备料领料信息概览</h2>
                <div class="li-center">
                    <div class="center-ech no-border">
                        <ul class="stock-main">
                            <li class="stock-main-l">
                                <div id="stock-left"></div>
                                <p class="stock-title">待备已备占库存数</p>
                                <ul class="storage-fot">
                                    <li v-for="(item,index) in prepareArr" :key="index">
                                        <span class="ico" :class="'stock'+(index+1)"></span>
                                        <p><span v-text="index==0?'待入库':'已入库'"></span>&nbsp;&nbsp;<span>{{item.value}}pcs</span></p>
                                        <span>{{item.QuantityProcess}}</span>
                                    </li>
                                </ul>                                
                            </li>
                            <li class="stock-main-l">
                                <div id="stock-right"></div>
                                <p class="stock-title">订单前三百分比</p>
                                <!-- 专案 .projects -->
                                <ul class="storage-fot projects" >
                                    <li v-for="(item,index) in threePercent" :key="index">
                                        <span class="ico projects1" :class="'projects' + (index+1)"></span>
                                        <p>{{item.orderNumber}}</p>
                                        <span>{{item.quantityProcess}}</span>
                                    </li>                                  
                                </ul>                                  
                             </li>                           
                        </ul>
                     </div>
                     <div class="center-ech" >
                        <div id="picking"></div>
                        <p class="ech-text">近四天备料与领料数据统计图</p>
                    </div>                     
                </div>
                <p class="li-footer">
                        <span class="f_bg"></span>
                        <marquee  class="footer-text" direction="left"> {{prepares}}</marquee>
                 </p>               
            </li>
            <li class="main-li">
                <h2>出库信息概览</h2>
                <!-- 单月出库 -->
                <div class="month-main">
                    <div id="month_warehouse"></div>
                    <p class="ech-text">当月出库数据统计图</p>
                    <span class="month">{{month}}</span>
                </div>
            </li>
            <!-- 4个模块end -->
        </ul>
    </article>
</template>

<script>
let echarts = require("echarts");
import { qualityLeftInfo,storageInfo,stockAndPickingInfo,monthWarehouseInfo,allInformationInfo} from "../../api/axiosapi";
import moment from "moment";
export default {
  // name: "HelloWorld",
  data() {
    return {
      months:"",//当前月份
      nowTimes:"",//当前时间
      // qualityText: "",
      quarantine:"",//质检信息提示
      stockPend:"",//入库信息提示
      prepares:"",//备料信息提示 
      quality: null,
      standard: null,
      storageLeft:null,
      storageRight:null,
      storageMsg:null,
      picking:null,
      stockRight:null,
      stockLeft:null,
      monthWarehouse:null,
      // storageRg:[],
      threePercent:[],//订单前三百分比
      prepareArr:[],//备料
      newStandSt:[],//入库标准件
      newUnstandSt:[],//入库非标准件
      storageLeftOption:{},//入库标准件统计
      storageRightOption:{},//入库非标准件统计
      storageMsgOption:{},//近4天入库统计
      pickingOption:{},//近4天备料与领料统计
      qualityOption: {},//质检总数统计
      standardOption: {},//质检质量检测统计
      stockRightOption:{},//备料占库存数统计
      stockLeftOption:{},//订单前三百分比统计
      monthWarehouseOption:{},//当月出库信息统计
    };
  },
  created: function() {
    this.getDataInfo();
  },
  mounted() {
    this.initPie();
  },
  computed:{
    //获取当前时间
    nowTime:function(){
      let year=moment().format("YYYY年MM月DD日");
      let hour=moment().format("HH:mm");
      let day=' 星期'+'日一二三四五六'.charAt(new Date().getDay());
      this.nowTimes =year+" "+day+" "+hour;
      return this.nowTimes;
    },
    //获取当前月份
    month:function(){
      let month=moment().format("M月");
      this.months=month;
      return this.months;
    }
  },
  methods: {
    getDataInfo() {
      //获取质检信息
      qualityLeftInfo().then(res => {
        let { code, msg, data, success } = res;
        if (code == 200) {
          // console.log(res, "res");
          this.qualityOption.title.text = data.inspectionCountPercentVo.total;
          this.qualityOption.series[0].data[0].value =
            data.inspectionCountPercentVo.qualifiedQuantity;
          this.qualityOption.series[0].data[1].value =
            data.inspectionCountPercentVo.unqualifiedQuantity;
          this.qualityOption.series[0].data[2].value =
            data.inspectionCountPercentVo.waitQuantity;
          let stdqualified=[];
          let stdunqualified=[];
          let unstdqualified =[];
          let unstdunqualified=[];
          let _standardInspectionStatisticsVo=data.standardInspectionStatisticsVo;
          for(let i=0;i<_standardInspectionStatisticsVo.length;i++){
            stdqualified.push(_standardInspectionStatisticsVo[i].qualifiedQuantity);
            stdunqualified.push(_standardInspectionStatisticsVo[i].unqualifiedQuantity);
          }
          let _unstandardInspectionStatisticsVo=data.unstandardInspectionStatisticsVo;
          for(let j=0;j<_unstandardInspectionStatisticsVo.length;j++){
             unstdqualified.push(_unstandardInspectionStatisticsVo[j].qualifiedQuantity);
             unstdunqualified.push(_unstandardInspectionStatisticsVo[j].unqualifiedQuantity);
           }
          this.standardOption.xAxis[0].data=data.daysLine.reverse();
          this.standardOption.series[0].data=unstdqualified.reverse();
          this.standardOption.series[1].data=unstdunqualified.reverse();
          this.standardOption.series[2].data=stdqualified.reverse();
          this.standardOption.series[3].data=stdunqualified.reverse();
          this.quality.setOption(this.qualityOption);
          this.standard.setOption(this.standardOption);
        } else {
          this.$message.warning(msg);
        }
      });
      //获取入库信息
      storageInfo().then(res =>{
         let { code, msg, data, success } = res;
          if (code == 200) {
              // console.log(res,'入库信息');
              let newStandArr =data.standardWarehousingVo;
                  let standStock={};
                  let standPrStock={};
                  let unstandStock ={};
                  let unstandPrStock={};
                  let _newStandSt=[];
                  let _newUnstandSt=[];
                  let _standStock={};
                  let _standPrStock={};
                  let _unstandStock ={};
                  let _unstandPrStock={};
                  standPrStock.value=newStandArr[0].unreadyQuantity;
                  standStock.value=newStandArr[0].alreadyQuantity;
                  _standStock.value=newStandArr[0].alreadyQuantity;
                  _standPrStock.value=newStandArr[0].unreadyQuantity;
                  _unstandStock.value=newStandArr[1].alreadyQuantity;
                  _unstandPrStock.value=newStandArr[1].unreadyQuantity;
                  standStock.quantityProcess=newStandArr[0].alreadyQuantityProcess;
                  standPrStock.quantityProcess=newStandArr[0].unreadyQuantityProcess;
                  unstandStock.quantityProcess=newStandArr[1].alreadyQuantityProcess;
                  unstandStock.value=newStandArr[1].alreadyQuantity;
                  unstandPrStock.quantityProcess=newStandArr[1].unreadyQuantityProcess;
                  unstandPrStock.value=newStandArr[1].unreadyQuantity;
                  this.newStandSt.push(standStock);
                  this.newStandSt.push(standPrStock);
                  this.newUnstandSt.push(unstandStock);
                  this.newUnstandSt.push(unstandPrStock);
                  this.newStandSt=this.newStandSt.reverse();
                  this.newUnstandSt =this.newUnstandSt.reverse();
                  _newStandSt.push(_standStock);
                  _newStandSt.push(_standPrStock);
                  _newUnstandSt.push(_unstandStock);
                  _newUnstandSt.push(_unstandPrStock)
              let qualifiedQuantityArr=[];
              let unqualifiedQuantityArr =[];
              let newStWh =data.standardWhousingStatisticsVo
              for(let index=0;index<newStWh.length;index++){
                  qualifiedQuantityArr.push(newStWh[index].standQuantity);
                  unqualifiedQuantityArr.push(newStWh[index].unstandQuantity);
              }
              this.storageMsgOption.xAxis[0].data=data.daysLine.reverse();
              this.storageMsgOption.series[0].data=qualifiedQuantityArr.reverse();
              this.storageMsgOption.series[1].data=unqualifiedQuantityArr.reverse();
              this.storageLeftOption.series[0].data=_newStandSt;
              this.storageRightOption.series[0].data=_newUnstandSt;
              this.storageLeftOption.title.text=Math.round(newStandArr[0].total);
              this.storageRightOption.title.text=Math.round(newStandArr[1].total);
              this.storageLeft.setOption(this.storageLeftOption);
              this.storageRight.setOption(this.storageRightOption);
              this.storageMsg.setOption(this.storageMsgOption);
          }else{
            this.$message.warning(msg);
          }
      })
      //获取备料与领料信息
      stockAndPickingInfo().then(res =>{
        const _this =this;
        let { code, msg, data, success } = res;
         if (code == 200) {
            // console.log(res,'备料领料信息');
            if(res.data.threePercentVo){
                for(let item of res.data.threePercentVo){
                    _this.threePercent.push(item);
                }
                let otherPercent ={};
                otherPercent.quantityProcess =res.data.threePercentVo[0].otherQuantityProcess;
                otherPercent.quantity=res.data.threePercentVo[0].otherQuantity;
                otherPercent.orderNumber ="其他";
                _this.threePercent.push(otherPercent);
            }
            let  newQuantity = [];
            let  sumValue =0;
            let  sumObj={};
            for(let index=0;index<_this.threePercent.length;index++){ 
                let qualityObj={};
                sumValue +=_this.threePercent[index].quantity;
                qualityObj.value=_this.threePercent[index].quantity;
                newQuantity.push(qualityObj);
            }
            sumObj.value=Math.round(sumValue/2);
            newQuantity.push(sumObj);

            let qy ={};
            let qyp={};
            let otherPreAndPick={};
            let newOtherPreAndPick=[]; 
            if(res.data.prepareAndPickInfoVo){
                qy.value=res.data.prepareAndPickInfoVo.alreadyQuantity;
                qy.QuantityProcess=res.data.prepareAndPickInfoVo.alreadyQuantityProcess;
                qyp.value=res.data.prepareAndPickInfoVo.unreadyQuantity;
                qyp.QuantityProcess=res.data.prepareAndPickInfoVo.unreadyQuantityProcess;
                this.prepareArr.push(qyp);
                this.prepareArr.push(qy);
                otherPreAndPick.value =Math.round((qy.value+qyp.value)/2);
            }
            newOtherPreAndPick.push(qy);
            newOtherPreAndPick.push(qyp);
            newOtherPreAndPick.push(otherPreAndPick);
            console.log(newOtherPreAndPick,'newOtherPreAndPick');
            let pickQuantityArr=[];
            let alreadyQuantityArr =[];
            let unreadyQuantityArr=[];
            // let newQuantity =[];
            this.pickingOption.xAxis[0].data=data.daysLine.reverse();
             for(let item of res.data.prepareAndPickInfoStatisticsVo){
                  pickQuantityArr.push(item.pickQuantity);
                  alreadyQuantityArr.push(item.alreadyQuantity);
                  unreadyQuantityArr.push(item.unreadyQuantity);
              }
              this.pickingOption.series[2].data=pickQuantityArr;
              this.pickingOption.series[1].data=alreadyQuantityArr;
              this.pickingOption.series[0].data=unreadyQuantityArr;
              this.stockRightOption.series[0].data=newQuantity;
              this.stockRightOption.title.text=Math.round(res.data.threePercentVo[0].totalQuantity);
              this.stockLeftOption.series[0].data=newOtherPreAndPick;
              this.stockLeftOption.title.text=Math.round(res.data.prepareAndPickInfoVo.quantity);
              this.picking.setOption(this.pickingOption);
              this.stockRight.setOption(this.stockRightOption);
              this.stockLeft.setOption(this.stockLeftOption);
         }else{
           this.$message.warning(msg);
         }
      })
      //获取当月出库信息
      monthWarehouseInfo().then(res =>{
         let { code, msg, data, success } = res;
          if (code == 200) {
            // console.log(res,'出库信息');
            let all = [];
            let stdStorge =[];
            let unStdStorge=[];
            let months=[];
            let newArr =data.outboundStatisticsVo;
            for(let index=0;index<newArr.length;index++){
              months.push(newArr[index].day);
              all.push(newArr[index].total);
              stdStorge.push(newArr[index].standQuantity);
              unStdStorge.push(newArr[index].unstandQuantity);
            }
            this.monthWarehouseOption.series[0].data=all;
            this.monthWarehouseOption.xAxis[0].data =months;
            this.monthWarehouseOption.series[1].data=stdStorge;
            this.monthWarehouseOption.series[2].data=unStdStorge;
            this.monthWarehouse.setOption(this.monthWarehouseOption);
         } else {
            this.$message.warning(msg);
        }
      })

      allInformationInfo().then(res =>{
       let { code, msg, data, success } = res;
        if (code == 200) {
            data.forEach((item,index)=>{
              if(item.type =="inspection"){
                this.quarantine= "你有"+item.quantity+"(单)质检单待检";
              }else if(item.type =="enter"){
                this.stockPend="你有"+item.quantity+"(pcs)物料待入库";
              }else if(item.type =="prepares"){
                this.prepares="你有"+item.quantity+"(单)备料单待备料";
              }
            });
        }else{
           this.$message.warning(msg);
        }
      })
    },
    //初始化Echarts
    initPie: function() {
      //   let _this = this;
      this.quality = echarts.init(document.getElementById("quality"));
      this.standard = echarts.init(document.getElementById("standard"));
      this.storageLeft = echarts.init(document.getElementById("storage-left"));
      this.storageRight = echarts.init(document.getElementById("storage-right"));
      this.storageMsg = echarts.init(document.getElementById("storage-msg"));
      this.stockLeft = echarts.init(document.getElementById("stock-left"));
      this.stockRight = echarts.init(document.getElementById("stock-right"));
      this.picking = echarts.init(document.getElementById("picking"));
      this.monthWarehouse = echarts.init(
        document.getElementById("month_warehouse")
      );

      this.qualityOption = {
        title: {
          text: "",
          subtext: "总数",
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "normal",
            fontSize: 18,
            color: "#1f97fd"
          },
          subtextStyle: {
            color: "rgba(255,255,255,0.53)"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          left: "center",
          top: "0",
          data: ["良品", "待检", "不良品"],
          orient: "horizontal", //图标横向显示
          textStyle: {
            color: "rgba(255,255,255,0.53)"
          },
          // 图标的宽度
          itemWidth: 30,
          // 图标的高度
          itemHeight: 10,
          // 图标间距
          itemGap: 20
        },
        series: [
          {
            name: "质检总数",
            type: "pie",
            // 动画禁止
            hoverAnimation: false,
            radius: ["50%", "30%"],
            center: ["50%", "53%"],
            data: [
              {
                name: "良品",
                value: "",
                itemStyle: {
                  normal: {
                    color: "#1bc85e"
                  }
                }
              },
              {
                name: "待检",
                value: "",
                itemStyle: {
                  normal: {
                    color: "#00a0e9"
                  }
                }
              },
              {
                name: "不良品",
                value: "",
                itemStyle: {
                  normal: {
                    color: "#496283"
                  }
                }
              }
            ],
            label: {
              normal: {
                formatter: "{b}\n{d}%",
                // 提示字的颜色
                color: "rgba(255,255,255,0.87)"
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            // 提示线的颜色
            labelLine: {
              normal: {
                lineStyle: {
                  color: "rgba(255,255,255,0.87)"
                },
                length: 40
              }
            }
          }
        ]
      };

      // 合格不合格
      this.standardOption = {
        title: {
          text: "单位(pcs)   (月)",
          x: "left",
          y: "6%",
          textStyle: {
            fontWeight: "normal",
            fontSize: 12,
            color: "rgba(255,255,255,0.53)"
          }
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          left: "left",
          data: ["非标准件合格", "标准件合格", "不合格"],
          textStyle: {
            color: "rgba(255,255,255,0.53)"
          },
          // 图标的宽度
          itemWidth: 30,
          // 图标的高度
          itemHeight: 10,
          // 图标间距
          itemGap: 20
        },
        grid: {
          left: "0%",
          right: "0%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisPointer: {
              show: true,
              type: "shadow"
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.53)"
              }
            },
            // 多余的东西
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            boundaryGap: false,
            min: 0,
            axisLine: {
              show: false,
              lineStyle: {
                color: "#0087ED",
                width: 0
              }
            },
            // 多余的东西
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: ["#192363"]
              }
            }
          }
        ],
        series: [
          {
            name: "非标准件合格",
            type: "bar",
            stack: "不标准",
            data: [50, 100, 150, 170],
            color: "#00a0e9",
            barWidth: 10, //图表的粗细
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0]
              }
            },
            barCategoryGap: "60%"
          },
          {
            name: "不合格",
            type: "bar",
            stack: "不标准",
            data: [20, 33, 44, 22],
            color: "#496283",
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0]
              }
            },
            barCategoryGap: "60%"
          },
          {
            name: "标准件合格",
            type: "bar",
            stack: "标准",
            data: [120, 132, 165, 332],
            color: "#1bc85e",
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0]
              }
            },
            barCategoryGap: "60%"
          },
          {
            name: "不合格",
            type: "bar",
            stack: "标准",
            data: [66, 45, 32, 25],
            color: "#496283",

            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0]
              }
            },
            barCategoryGap: "60%"
          }
        ]
      };

      // 入库的两圆  left
     
      this.storageLeftOption={
        color: ["#ffc107", "#496283"],
        title: {
          text: "",
          subtext: "总数",
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "normal",
            fontSize: 18,
            color: "#1f97fd"
          },
          subtextStyle: {
            color: "rgba(255,255,255,0.53)"
          }
        },
        tooltip: {
          trigger: "item",
          show: false
        },
        series: [
          {
            name: "总数",
            type: "pie",
            clickable: false,
            radius: ["70%", "60%"],
            center: ["50%", "53%"],
            // 动画禁止
            hoverAnimation: false,
            data: [
              // {
              //   value: 2000,
              //   name: "良品",
              // },
              // {
              //   value: 800,
              //   name: "待检",
              // }
            ],
            itemStyle: {
              normal: {
                label: {
                  show: false //隐藏标示文字
                },
                labelLine: {
                  show: false //隐藏标示线
                }
              }
            }
          }
        ]
      }

      // 入库的两圆  right
      this.storageRightOption={
        color: ["#ffc107", "#496283"],
        title: {
          text: "",
          subtext: "总数",
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "normal",
            fontSize: 18,
            color: "#1f97fd"
          },
          subtextStyle: {
            color: "rgba(255,255,255,0.53)",
            padding: 10
          }
        },
        tooltip: {
          trigger: "item",
          show: false
        },
        series: [
          {
            name: "总数",
            type: "pie",
            clickable: false,
            radius: ["70%", "60%"],
            center: ["50%", "53%"],
            hoverAnimation: false,
            data: [
              // {
              //   value: 2000,
              //   name: "良品",
              // },
              // {
              //   value: 800,
              //   name: "待检",
              // }
            ],
            itemStyle: {
              normal: {
                label: {
                  show: false //隐藏标示文字
                },
                labelLine: {
                  show: false //隐藏标示线
                }
              }
            }
          }
        ]
      }

      // 4天入库统计
       this.storageMsgOption={
        title: {
          text: "单位(pcs)",
          x: "left",
          y: "6%",
          textStyle: {
            fontWeight: "normal",
            fontSize: 12,
            color: "rgba(255,255,255,0.53)"
          }
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          left: "left",
          data: ["非标准件数量", "标准件数量"],
          textStyle: {
            color: "rgba(255,255,255,0.53)"
          },
          // 图标的宽度
          itemWidth: 30,
          // 图标的高度
          itemHeight: 10,
          // 图标间距
          itemGap: 20
        },
        grid: {
          left: "0%",
          right: "0%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisPointer: {
              show: true,
              type: "shadow"
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.53)"
              }
            },
            // 多余的东西
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            boundaryGap: false,
            min: 0,
            axisLine: {
              show: false,
              lineStyle: {
                color: "#0087ED",
                width: 0
              }
            },
            // 多余的东西
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: ["#192363"]
              }
            }
          }
        ],
        series: [
          {
            name: "标准件数量",
            type: "bar",
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0],
                color: "#1bc85e"
              }
            },
            barCategoryGap: "60%",
            data: []
          },
          {
            name: "非标准件数量",
            type: "bar",
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0],
                color: "#00a0e9"
              }
            },
            barCategoryGap: "60%",
            data: []
          }
        ]
      }

      // 备料2个圆 left
      // var data = [
      //   {
      //     value: 50,
      //     itemStyle: {
      //       normal: {
      //         color: "#ffc107"
      //       }
      //     }
      //   },
      //   {
      //     value: 32,
      //     itemStyle: {
      //       normal: {
      //         color: "#00a0e9"
      //       }
      //     }
      //   },
      //   {
      //     value: 32,
      //     itemStyle: {
      //       normal: {
      //         color: "#496283"
      //       }
      //     }
      //   }
      // ];
      // var a = 0;
      // for (var i = 0; i < data.length; i++) {
      //   a += data[i].value;
      // }
      // console.log(a, "0.0");
      // data.push({
      //   value: a / 2,
      //   tooltip: {
      //     show: false
      //   },
      //   itemStyle: {
      //     normal: {
      //       color: "transparent"
      //     },
      //     emphasis: {
      //       color: "transparent"
      //     }
      //   }
      // });

      
    this.stockLeftOption={
        color:["#ffc107","#00a0e9","transparent"],
        title: {
          text: "3000",
          x: "center",
          y: "70%",
          textStyle: {
            fontWeight: "normal",
            fontSize: 18,
            color: "#1f97fd"
          }
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            startAngle: 210,
            radius: ["75%", "60%"],
            center: ["50%", "60%"],
            data: [],
            hoverAnimation: false,
            labelLine: {
              normal: {
                lineStyle: {
                  color: "transparent"
                },
                length: 40
              }
            }
          }
        ]
      }

      // 备料2个圆 right
     this.stockRightOption={
        color:["#ffc107","#00a0e9","#1bc85e","#496283","transparent"],
        title: {
          text: "3000",
          x: "center",
          y: "70%",
          textStyle: {
            fontWeight: "normal",
            fontSize: 18,
            color: "#1f97fd"
          }
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            startAngle: 210,
            radius: ["75%", "60%"],
            center: ["50%", "60%"],
            data: [],
            hoverAnimation: false,
            labelLine: {
              normal: {
                lineStyle: {
                  color: "transparent"
                },
                length: 40
              }
            }
          }
        ]
      }

      // 4天备料
     this.pickingOption={
        title: {
          text: "单位(pcs)",
          x: "left",
          y: "6%",
          textStyle: {
            fontWeight: "normal",
            fontSize: 12,
            color: "rgba(255,255,255,0.53)"
          }
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          left: "left",
          data: ["待备料数", "已备料数", "领料数"],
          textStyle: {
            color: "rgba(255,255,255,0.53)"
          },
          // 图标的宽度
          itemWidth: 40,
          // 图标的高度
          itemHeight: 10,
          // 图标间距
          itemGap: 20
        },
        grid: {
          left: "0%",
          right: "0%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["5/16", "5/17", "5/18", "5/19"],
            axisPointer: {
              show: true,
              type: "shadow"
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.53)"
              }
            },
            // 多余的东西
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            boundaryGap: false,
            min: 0,
            axisLine: {
              show: false,
              lineStyle: {
                color: "#0087ED",
                width: 0
              }
            },
            // 多余的东西
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: ["#192363"]
              }
            }
          }
        ],
        series: [
          {
            name: "待备料数",
            type: "line",
            //弧度
            smooth: true,
            symbolSize: 4,
            // 实现原点
            symbol: "circle",
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: [],
            itemStyle: {
              normal: {
                color: "#00a0e9"
              }
            }
          },
          {
            name: "已备料数",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 4,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: [],
            itemStyle: {
              normal: {
                color: "#1bc85e"
              }
            }
          },
          {
            name: "领料数",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 4,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: [],
            itemStyle: {
              normal: {
                color: "#ffc107"
              }
            }
          }
        ]
      }

      // 单月出库
    this.monthWarehouseOption={
        title: {
          text: "单位(pcs)   (月）",
          // subtext: '5月',
          x: "left",
          y: "6%",
          textStyle: {
            fontWeight: "normal",
            fontSize: 12,
            color: "rgba(255,255,255,0.53)"
          }
          // subtextStyle: {
          //     color: 'rgba(255,255,255,0.53)',
          // },
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          left: "left",
          data: ["出库总数", "标准件", "非标准件"],
          textStyle: {
            color: "rgba(255,255,255,0.53)"
          },
          // 图标的宽度
          itemWidth: 40,
          // 图标的高度
          itemHeight: 10,
          // 图标间距
          itemGap: 20
        },
        grid: {
          left: "0%",
          right: "0%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisPointer: {
              show: true,
              type: "shadow"
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.53)"
              }
            },
            // 多余的东西
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            min: 0,
            boundaryGap: false,
            axisLine: {
              show: false,
              lineStyle: {
                color: "#0087ED",
                width: 0
              }
            },
            // 多余的东西
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: ["#192363"]
              }
            }
          }
        ],
        series: [
          {
            name: "出库总数",
            type: "line",
            //弧度
            smooth: true,
            symbolSize: 4,
            // 实现原点
            symbol: "circle",
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: [],
            itemStyle: {
              normal: {
                color: "#00a0e9"
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,0,0,1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 160, 223, 0.2)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0, 160, 223, 0)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10
              }
            }
          },
          {
            name: "标准件",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 4,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: [],
            itemStyle: {
              normal: {
                color: "#1bc85e"
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(27, 200, 94, 0.2)"
                    },
                    {
                      offset: 1,
                      color: "rgba(27, 200, 94, 0)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10
              }
            }
          },
          {
            name: "非标准件",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 4,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: [],
            itemStyle: {
              normal: {
                color: "#ffc107"
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(255, 193, 7, 0.2)"
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 193, 7, 0)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10
              }
            }
          }
        ]
      }
    //   window.addEventListener("resize",function(){
    //       // month_warehouse.resize();
    //       picking.resize();
    //       stockRight.resize();
    //       stockLeft.resize();
    //       storageMsg.resize();
    //       storageRight.resize();
    //       quality.resize();
    //       standard.resize();
    //       storageLeft.resize();
    //       storageRight.resize();
    //   });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
