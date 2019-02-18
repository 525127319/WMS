
    var quality = echarts.init(document.getElementById('quality'));
    option = {
        title: {
        text: '3600',
        subtext: '总数',
        x: 'center',
        y: 'center',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 18,
            color:'#1f97fd'
        },
        subtextStyle: {
            color: 'rgba(255,255,255,0.53)'        
        }        
    },      
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)",

    },
    legend: {
        left: 'center',
        top: '0',
        data: ['良品', '待检', '不良品'],
        orient:'horizontal',   //图标横向显示
        textStyle:{
            color:"rgba(255,255,255,0.53)",
        },
        // 图标的宽度
        itemWidth: 30,
        // 图标的高度
        itemHeight:10,
        // 图标间距
        itemGap :20
    },
    series: [{
        name: '质检总数',
        type: 'pie',
        // 动画禁止
        "hoverAnimation": false,
        radius: ['50%', '30%'],
        center: ['50%', '53%'],
        data: [{
                value: 2000,
                name: '良品',
                itemStyle: {
                    normal: {
                        color:'#1bc85e'
                    }
                },
            },
            {
                value: 800,
                name: '待检',
                itemStyle: {
                    normal: {
                        color: '#00a0e9'
                    }
                }
            },
            {
                value: 800,
                name: '不良品',
                itemStyle: {
                    normal: {
                        color: '#496283'
                    }
                }
            },
        ],
        label: {
                normal: {
                    formatter: '{b}\n{d}%',
                    // 提示字的颜色
                    color:"rgba(255,255,255,0.87)",
                    
                },
            },
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        },
        // 提示线的颜色
        labelLine: {
            normal: {
                lineStyle: {
                    color:"rgba(255,255,255,0.87)"
                },
                length:40
            },
        },
    }]
};
    quality.setOption(option);

    // 合格不合格

var standard = echarts.init(document.getElementById('standard'));
option2 = {
    title: {
        text: '单位(pcs)   (月)',
        x: 'left',
        y: '6%',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 12,
            color:'rgba(255,255,255,0.53)'
        },    
    },   
    tooltip : {
        trigger: 'item'
    },
    legend: {
        left: 'left',
        data:['非标准件合格','标准件合格','不合格'],
        textStyle:{
            color:"rgba(255,255,255,0.53)",
        },
        // 图标的宽度
        itemWidth: 30,
        // 图标的高度
        itemHeight:10,
        // 图标间距
        itemGap :20       
    },
    grid: {
        left: '0%',
        right: '0%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['5/16','5/17','5/18','5/19',],
            axisPointer: {
                show: true,
                type: 'shadow'
            },
            axisLine:{
                lineStyle:{  
                    color:'rgba(255,255,255,0.53)'
                 }              
             },
            // 多余的东西
            axisTick: {
                show: false
            },             
        }
    ],
    yAxis : [
        {
            type : 'value',
            scale: true,
            boundaryGap:false,
             min:0,
            axisLine:{  
                show: false,
             lineStyle:{  
                 color:'#0087ED',  
                 width:0
                 }  
            },
            // 多余的东西
            axisTick: {
                show: false
            },
            splitLine: {  
                lineStyle: {  
                         color: ['#192363']  
                     }  
                },  
        }
    ],
    series : [
        {
            name:'非标准件合格',
            type:'bar',
            stack: '不标准',
            data:[50, 100, 150, 170,],
            color:'#00a0e9',
            barWidth : 10,  //图表的粗细
            itemStyle: {
                normal:{
                    barBorderRadius: [2,2,0,0],  
                }
            },
            barCategoryGap:'60%',
        },
        {
            name:'不合格',
            type:'bar',
            stack: '不标准',
            data:[20, 33,44, 22,],
            color:'#496283',
            barWidth : 10,
            itemStyle: {
                normal:{
                    barBorderRadius: [2,2,0,0],  
                }
            },
            barCategoryGap:'60%',
        },         
        {
            name:'标准件合格',
            type:'bar',
            stack: '标准',
            data:[120, 132,165, 332],
            color:'#1bc85e',
            barWidth : 10,
            itemStyle: {
                normal:{
                    barBorderRadius: [2,2,0,0],  
                }
            },
            barCategoryGap:'60%',        
        },
        {
            name:'不合格',
            type:'bar',
            stack: '标准',
            data:[66, 45,32, 25],
            color:'#496283',
            
            itemStyle: {
                normal:{
                    barBorderRadius: [2,2,0,0],  
                }
            },
            barCategoryGap:'60%',

        },    
    ],
};
standard.setOption(option2);

// 入库的两圆  left
var storageLeft = echarts.init(document.getElementById('storage-left'));
option3 = {
        title: {
        text: '3600',
        subtext: '总数',
        x: 'center',
        y: 'center',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 18,
            color:'#1f97fd'
        },
        subtextStyle: {
            color: 'rgba(255,255,255,0.53)'        
        }        
    },     
    tooltip : {
        trigger: 'item',
        show:false,
        },     

    series: [{
        name: '总数',
        type: 'pie',
        clickable:false,
        radius: ['70%', '60%'],
        center: ['50%', '53%'],
        // 动画禁止
        "hoverAnimation": false,
        data: [{
                value: 2000,
                name: '良品',
                itemStyle: {
                    normal: {
                        color:'#ffc107'
                    }
                },
            },
            {
                value: 800,
                name: '待检',
                itemStyle: {
                    normal: {
                        color: '#496283'
                    }
                }
            },
        ],
        itemStyle : {
                normal : {
                    label : {
                        show : false   //隐藏标示文字
                    },
                    labelLine : {
                        show : false   //隐藏标示线
                    }
                }
            },
    }]
};
  storageLeft.setOption(option3);

// 入库的两圆  right
  var storageRight = echarts.init(document.getElementById('storage-right'));
option4 = {
        title: {
        text: '3600',
        subtext: '总数',
        x: 'center',
        y: 'center',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 18,
            color:'#1f97fd',
            
        },

        subtextStyle: {
            color: 'rgba(255,255,255,0.53)',
            padding:10
        }        
    },     
    tooltip : {
        trigger: 'item',
        show:false,
        },     

    series: [{
        name: '总数',
        type: 'pie',
        clickable:false,
        radius: ['70%', '60%'],
        center: ['50%', '53%'],
        "hoverAnimation": false,
        data: [{
                value: 2000,
                name: '良品',
                itemStyle: {
                    normal: {
                        color:'#ffc107'
                    }
                },
            },
            {
                value: 800,
                name: '待检',
                itemStyle: {
                    normal: {
                        color: '#496283'
                    }
                }
            },
        ],
        itemStyle : {
                normal : {
                    label : {
                        show : false   //隐藏标示文字
                    },
                    labelLine : {
                        show : false   //隐藏标示线
                    }
                }
            },
    }]
};
storageRight.setOption(option4);


// 4天入库统计
var storageMsg = echarts.init(document.getElementById('storage-msg'));
option5 = {
    title: {
        text: '单位(pcs)',
        x: 'left',
        y: '6%',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 12,
            color:'rgba(255,255,255,0.53)'
        },    
    },   
    tooltip : {
        trigger: 'item'
    },
    legend: {
        left: 'left',
        data:['非标准件数量','标准件数量',],
        textStyle:{
            color:"rgba(255,255,255,0.53)",
        },
        // 图标的宽度
        itemWidth: 30,
        // 图标的高度
        itemHeight:10,
        // 图标间距
        itemGap :20       
    },
    grid: {
        left: '0%',
        right: '0%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['5/16','5/17','5/18','5/19',],
            axisPointer: {
                show: true,
                type: 'shadow'
            },
            axisLine:{
                lineStyle:{  
                    color:'rgba(255,255,255,0.53)'
                 }              
             },
            // 多余的东西
            axisTick: {
                show: false
            },             
        }
    ],
    yAxis : [
        {
            type : 'value',
            scale: true,
            boundaryGap:false,
            min:0,
            axisLine:{  
                show: false,
             lineStyle:{  
                 color:'#0087ED',  
                 width:0
                 }  
            },
            // 多余的东西
            axisTick: {
                show: false
            },
            splitLine: {  
                lineStyle: {  
                         color: ['#192363']  
                     }  
                },  
        }
    ],
    series: [
    {
        name: '标准件数量',
        type: 'bar',
        barWidth : 10,
        itemStyle: {
            normal: {
                barBorderRadius: [2,2,0,0],  
                color:'#1bc85e',
            }
        },
        barCategoryGap:'60%',
        data: [66, 35, 58, 40]
    },       
        
        {
        name: '非标准件数量',
        type: 'bar',
        barWidth : 10,
        itemStyle: {
            normal: {
                barBorderRadius: [2,2,0,0],  
                color:'#00a0e9',
            }
        },
        barCategoryGap:'60%',
        data: [120, 50, 60, 50]
    }, ]
};
storageMsg.setOption(option5);

// 备料2个圆 left
var stockLeft = echarts.init(document.getElementById('stock-left'));
var data = [{
    value: 50,
    itemStyle: {
        normal: {
                 color: '#ffc107'
            }
        }
}, {
    value: 32,
    itemStyle: {
        normal: {
                 color: '#00a0e9'
            }
        }    
}, {
    value: 32,
    itemStyle: {
        normal: {
                 color: '#496283'
            }
        }    
}
];
var a = 0;
for (var i = 0; i < data.length; i++) {
    a += data[i].value;
}
console.log(a,"0.0")
data.push({
    value: a/2,
    tooltip: {
        show: false
    },
    itemStyle: {
        normal: {
            color: 'transparent'
        },
        emphasis: {
            color: 'transparent',

        },
    }
});
console.log(data);
option6 = {
    title: {
        text: '3000',
        x: 'center',
        y:'70%',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 18,
            color:'#1f97fd'
        },
    },

    series: [{
        name: '访问来源',
        type: 'pie',
        startAngle: 210,
        radius: ['75%', '60%'],
        center: ['50%', '60%'],
        data: data,
        "hoverAnimation": false,
        labelLine: {
            normal: {
                lineStyle: {
                    color:"transparent"
                },
                length:40
            },
        },     
    }]
};
stockLeft.setOption(option6);


// 备料2个圆 right
var stockRight = echarts.init(document.getElementById('stock-right'));
var data2 = [{
    value: 60,
    itemStyle: {
        normal: {
                 color: '#ffc107'
            }
        }
}, {
    value: 32,
    itemStyle: {
        normal: {
                 color: '#00a0e9'
            }
        }    
}, {
    value: 32,
    itemStyle: {
        normal: {
                 color: '#496283'
            }
        }    
}
, {
    value: 32,
    itemStyle: {
        normal: {
                 color: '#1bc85e'
            }
        }    
}
];
var a = 0;
for (var i = 0; i < data2.length; i++) {
    a += data2[i].value;
}
console.log(a,"0.0")
data2.push({
    value: a/2,
    tooltip: {
        show: false
    },
    itemStyle: {
        normal: {
            color: 'transparent'
        },
        emphasis: {
            color: 'transparent',

        },
    }
});
console.log(data);
option7 = {
    title: {
        text: '3000',
        x: 'center',
        y:'70%',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 18,
            color:'#1f97fd'
        },
    },
    series: [{
        name: '访问来源',
        type: 'pie',
        startAngle: 210,
        radius: ['75%', '60%'],
        center: ['50%', '60%'],
        data: data2,
        "hoverAnimation": false,
        labelLine: {
            normal: {
                lineStyle: {
                    color:"transparent"
                },
                length:40
            },
        },     
    }]
};
stockRight.setOption(option7);


// 4天备料
var picking = echarts.init(document.getElementById('picking'));
option8 = {
    title: {
        text: '单位(pcs)',
        x: 'left',
        y: '6%',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 12,
            color:'rgba(255,255,255,0.53)'
        },    
    },   
    tooltip : {
        trigger: 'item'
    },
    legend: {
        left: 'left',
        data:['待备料数','已备料数','领料数'],
        textStyle:{
            color:"rgba(255,255,255,0.53)",
        },
        // 图标的宽度
        itemWidth: 40,
        // 图标的高度
        itemHeight:10,
        // 图标间距
        itemGap :20       
    },
    grid: {
        left: '0%',
        right: '0%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['5/16','5/17','5/18','5/19',],
            axisPointer: {
                show: true,
                type: 'shadow'
            },
            axisLine:{
                lineStyle:{  
                    color:'rgba(255,255,255,0.53)'
                 }              
             },
            // 多余的东西
            axisTick: {
                show: false
            },             
        }
    ],
    yAxis : [
        {
            type : 'value',
            scale: true,
            boundaryGap:false,
            min:0,
            axisLine:{  
                show: false,
             lineStyle:{  
                 color:'#0087ED',  
                 width:0
                 }  
            },
            // 多余的东西
            axisTick: {
                show: false
            },
            splitLine: {  
                lineStyle: {  
                         color: ['#192363'],
                     }  
                },  
        }
    ],
    series: [{
        name: '待备料数',
        type: 'line',
        //弧度
        smooth: true,
        symbolSize: 4,
        // 实现原点
          symbol: 'circle',
          lineStyle: {
            normal: {
                width: 1
            }
        },
        data: [120, 132, 101, 134],
        itemStyle: {
        normal: {
                 color: '#00a0e9'
            }
        }  
    }, {
        name: '已备料数',
        type: 'line',
         smooth: true,
         symbol: 'circle',
         symbolSize: 4,
         lineStyle: {
            normal: {
                width: 1
            }
        },
        data: [130, 182, 191, 234],
        itemStyle: {
        normal: {
                 color: '#1bc85e'
            }
        }  
    }, {
        name: '领料数',
        type: 'line',
         smooth: true,
         symbol: 'circle',
         symbolSize: 4,
         lineStyle: {
            normal: {
                width: 1
            }
        },
        data: [150, 232, 201, 154],
        itemStyle: {
        normal: {
                 color: '#ffc107',
            }
        },
    }]
};
picking.setOption(option8);



// 单月出库
var month_warehouse = echarts.init(document.getElementById('month_warehouse'));
option9 = {
    title: {
        text: '单位(pcs)   (月）',
        // subtext: '5月',
        x: 'left',
        y: '6%',        
        textStyle: {
            fontWeight: 'normal',
            fontSize: 12,
            color:'rgba(255,255,255,0.53)',           
        },  
        // subtextStyle: {
        //     color: 'rgba(255,255,255,0.53)',
        // },
    },   
    tooltip : {
        trigger: 'item'
    },
    legend: {
        left: 'left',
        data:['出库总数','标准件','非标准件'],
        textStyle:{
            color:"rgba(255,255,255,0.53)",
        },
        // 图标的宽度
        itemWidth: 40,
        // 图标的高度
        itemHeight:10,
        // 图标间距
        itemGap :20       
    },
    grid: {
        left: '0%',
        right: '0%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
            axisPointer: {
                show: true,
                type: 'shadow'
            },
            axisLine:{
                lineStyle:{  
                    color:'rgba(255,255,255,0.53)'
                 }              
             },
            // 多余的东西
            axisTick: {
                show: false
            },             
        }
    ],
    yAxis : [
        {
            type : 'value',
            scale: true,
            min:0,
            boundaryGap:false,
            axisLine:{  
                show: false,
             lineStyle:{  
                 color:'#0087ED',  
                 width:0
                 }  
            },
            // 多余的东西
            axisTick: {
                show: false
            },
            splitLine: {  
                lineStyle: {  
                         color: ['#192363'],
                     }  
                },  
        }
    ],
    series: [{
        name: '出库总数',
        type: 'line',
        //弧度
        smooth: true,
        symbolSize: 4,
        // 实现原点
          symbol: 'circle',
          lineStyle: {
            normal: {
                width: 1
            }
        },
        data: [120, 132, 101, 134,182, 191, 234,120, 132, 182, 191, 234,120, 132,201,191, 234,120, 132,201, 154,120, 132,201, 154,132, 134,152, 181, 254,181],
        itemStyle: {
        normal: {
                 color: '#00a0e9'
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 160, 223, 0.2)'
                }, {
                    offset: 1,
                    color: 'rgba(0, 160, 223, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        },
    }, {
        name: '标准件',
        type: 'line',
         smooth: true,
         symbol: 'circle',
         symbolSize: 4,
         lineStyle: {
            normal: {
                width: 1
            }
        },
        data: [130, 182, 191, 234,120, 132, 101, 134,130, 182, 191, 234,120, 132,201, 154,182, 191, 234,120, 132,120, 132,201, 154, 132, 134,132, 161, 134,161],
        itemStyle: {
        normal: {
                 color: '#1bc85e'
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(27, 200, 94, 0.2)'
                }, {
                    offset: 1,
                    color: 'rgba(27, 200, 94, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        },
    }, {
        name: '非标准件',
        type: 'line',
         smooth: true,
         symbol: 'circle',
         symbolSize: 4,
         lineStyle: {
            normal: {
                width: 1
            }
        },
        data: [150, 232, 201, 154,182, 191, 234,120, 132, 134,182, 191, 234,120, 132,182, 191, 234,120, 132,201,120, 132,201, 154,132, 134,142, 141, 214,134],
        itemStyle: {
        normal: {
                 color: '#ffc107',
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(255, 193, 7, 0.2)'
                }, {
                    offset: 1,
                    color: 'rgba(255, 193, 7, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        },        
    }]
};
month_warehouse.setOption(option9);
window.addEventListener("resize",function(){
    month_warehouse.resize();
    picking.resize();
    stockRight.resize();
    stockLeft.resize();
    storageMsg.resize();
    storageRight.resize();
    quality.resize();
    standard.resize();
    storageLeft.resize();
    storageRight.resize();
});
