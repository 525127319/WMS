import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/index",
      component: resolve => require(["../components/page/Index.vue"], resolve) // 拖拽列表组件
    },
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      component: resolve => require(["../components/page/Login.vue"], resolve)
    },
    {
      name: "overView",
      path: "/overView", //仓库信息总数据图
      component: resolve =>require(["../components/repertory/overView.vue"], resolve)
    },
    {
      name: "print",
      path: "/print", //编辑仓库信息
      component: resolve =>
        require(["../components/repertory/print.vue"], resolve)
    },
    {
      name: "printBig",
      path: "/printBig", //编辑仓库信息
      component: resolve =>
        require(["../components/repertory/printBig.vue"], resolve)
    },
    {
      path: "/readme",
      //path: '/repertory',
      component: resolve => require(["../components/common/Home.vue"], resolve),
      children: [
        {
          path: "/",
          // component: resolve => require(['../components/page/Readme.vue'], resolve)
          component: resolve =>
            require(["../components/order/purchase/purchaseOrder.vue"], resolve)
        },
        //采购模块start--------
        {
          name: "purchaseOrder", //采购订单列表
          path: "/purchaseOrder",
          component: resolve =>
            require(["../components/order/purchase/purchaseOrder.vue"], resolve)
        },

        {
          name: "addPurchaseOrder", //新增采购订单信息
          path: "/addPurchaseOrder",
          component: resolve =>
            require([
              "../components/order/purchase/addPurchaseOrder.vue"
            ], resolve)
        },
        {
          name: "editPurchaseOrder", //编辑采购订单信息
          path: "/editPurchaseOrder",
          component: resolve =>
            require([
              "../components/order/purchase/editPurchaseOrder.vue"
            ], resolve)
        },
        //-------采购模块end

        //生产模块start-------------

        //生产领料start
        {
          name: "materialPicking", //领料单列表
          path: "/materialPicking",
          component: resolve =>
            require([
              "../components/material/picking/materialPicking.vue"
            ], resolve)
        },
        {
          name: "addMaterialPicking", //新增领料单
          path: "/addMaterialPicking",
          component: resolve =>
            require([
              "../components/material/picking/addMaterialPicking.vue"
            ], resolve)
        },
        {
          name: "editMaterialPicking", //编辑领料单
          path: "/editMaterialPicking",
          component: resolve =>
            require([
              "../components/material/picking/editMaterialPicking.vue"
            ], resolve)
        },
        //生产领料end

        //生产备料start
        {
          name: "materialStock", //生产备料单列表
          path: "/materialStock",
          component: resolve =>
            require(["../components/material/stock/stockMaterial.vue"], resolve)
        },
        {
          name: "addMaterialStock", //新增生产备料单
          path: "/addMaterialStock",
          component: resolve =>
            require([
              "../components/material/stock/addMaterialStock.vue"
            ], resolve)
        },
        {
          name: "editMaterialStock", //编辑生产备料单
          path: "/editMaterialStock",
          component: resolve =>
            require([
              "../components/material/stock/editMaterialStock.vue"
            ], resolve)
        },
        //生产备料end

        //申请备料start
        {
          name: "applyStockList", //申请备料
          path: "/applyStockList",
          component: resolve =>
            require([
              "../components/material/applyForStock/applyStockList.vue"
            ], resolve)
        },
        //申请备料end
        
         //批次查询start
         {
          name: "batchList", //批次查询
          path: "/batchList",
          component: resolve =>
            require([
              "../components/material/applyForStock/batchList.vue"
            ], resolve)
        },
        //批次查询end

        //生产入库start
        {
          name: "produceEnter", //生产入库列表
          path: "/produceEnter",
          component: resolve =>
            require([
              "../components/repertory/produce/produceEnter.vue"
            ], resolve)
        },
        {
          name: "addProduceEnter", //新增生产入库
          path: "/addProduceEnter",
          component: resolve =>
            require([
              "../components/repertory/produce/addProduceEnter.vue"
            ], resolve)
        },
        {
          name: "editProduceEnter", //编辑生产入库
          path: "/editProduceEnter",
          component: resolve =>
            require([
              "../components/repertory/produce/editProduceEnter.vue"
            ], resolve)
        },
        //生产入库end

        //生产退料单(暂不做) start
        {
          name: "materialReturn", //退料单列表
          path: "/materialReturn",
          component: resolve =>
            require([
              "../components/material/return/returnMaterial.vue"
            ], resolve)
        },
        {
          name: "addMaterialReturn", //新增退料单
          path: "/addMaterialReturn",
          component: resolve =>
            require([
              "../components/material/return/addReturnMaterial.vue"
            ], resolve)
        },
        {
          name: "editMaterialReturn", //编辑退料单
          path: "/editMaterialReturn",
          component: resolve =>
            require([
              "../components/material/return/editMaterialReturn.vue"
            ], resolve)
        },
        //生产退料单end
        //生产模块end --------------

        //库存模块start-----------------

        {
          name: "inventoryQuery",
          path: "/inventoryQuery", //库存查询
          component: resolve =>
            require([
              "../components/repertory/query/inventoryQuery.vue"
            ], resolve)
        },
        {
          name: "orderQuery",
          path: "/orderQuery", //订单库存查询
          component: resolve =>
            require(["../components/repertory/query/orderQuery.vue"], resolve)
        },
        {
          name: "workNumberQuery",
          path: "/workNumberQuery", //订单库存查询
          component: resolve =>
            require([
              "../components/repertory/query/workNumberQuery.vue"
            ], resolve)
        },

        // 库存 /产品出库模块start
        {
          name: "productOut",
          path: "/productOut", //产品出库列表
          component: resolve =>
            require(["../components/repertory/out/productOut.vue"], resolve)
        },
        {
          name: "addproductOut",
          path: "/addproductOut", //产品出库列表
          component: resolve =>
            require(["../components/repertory/out/addproductOut.vue"], resolve)
        },

        // 库存 /产品出库模块end

        // 库存 /其它入库模块start
        {
          name: "OtherStorage",
          path: "/OtherStorage", //产品出库列表
          component: resolve =>
            require([
              "../components/repertory/Storage/OtherStorage.vue"
            ], resolve)
        },
        // 库存 /它入库模块end

        // 库存 /新增其它入库模块start

        {
          name: "addOtherStorage",
          path: "/addOtherStorage", //产品出库列表
          component: resolve =>
            require([
              "../components/repertory/Storage/addOtherStorage.vue"
            ], resolve)
        },
        // 库存 /新增其它入库模块end

        // 库存 /编辑其它入库模块start
        {
          name: "editOtherStorage", //编辑生产入库
          path: "/editOtherStorage",
          component: resolve =>
            require([
              "../components/repertory/Storage/editOtherStorage.vue"
            ], resolve)
        },
        // 库存 /编辑其它入库模块end

        // 库存 /其它出库模块start
        {
          name: "Otherlibrary",
          path: "/Otherlibrary", //产品出库列表
          component: resolve =>
            require([
              "../components/repertory/library/Otherlibrary.vue"
            ], resolve)
        },
        // 库存 /其它出库模块end

        // 库存 /编辑其它出库模块start
        {
          name: "editOtherlibrary",
          path: "/editOtherlibrary", //产品出库列表
          component: resolve =>
            require([
              "../components/repertory/library/editOtherlibrary.vue"
            ], resolve)
        },
        // 库存 /编辑其它出库模块end

        // 库存 /新增其它出库模块start
        {
          name: "addOtherlibrary",
          path: "/addOtherlibrary", //产品出库列表
          component: resolve =>
            require([
              "../components/repertory/library/addOtherlibrary.vue"
            ], resolve)
        },
        // 库存 /新增其它出库模块end

        //库存 /库存调拨模块start
        {
          name: "move",
          path: "/move", //库存调拨列表
          component: resolve =>
            require(["../components/repertory/move/moveList.vue"], resolve)
        },
        {
          name: "addMove",
          path: "/addMove", //新增库存调拨
          component: resolve =>
            require(["../components/repertory/move/addMove.vue"], resolve)
        },
        {
          name: "moveOut",
          path: "/moveOut", //库存调出
          component: resolve =>
            require(["../components/repertory/move/moveOut.vue"], resolve)
        },
        //库存 /库存调拨模块end

        //库存 /库存盘点模块start
        {
          name: "check",
          path: "/check", //库存盘点列表
          component: resolve =>
            require(["../components/repertory/check/checkList.vue"], resolve)
        },
        {
          name: "addCheck",
          path: "/addCheck", //新增库存盘点
          component: resolve =>
            require(["../components/repertory/check/addCheck.vue"], resolve)
        },
        {
          name: "editCheck",
          path: "/editCheck", //编辑库存盘点
          component: resolve =>
            require(["../components/repertory/check/editCheck.vue"], resolve)
        },
        //库存 /库存盘点模块end

        //库存 /库存质检模块start
        {
          name: "quality",
          path: "/quality", //库存盘点列表
          component: resolve =>
            require([
              "../components/repertory/quality/qualityList.vue"
            ], resolve)
        },
        {
          name: "addQuality",
          path: "/addQuality", //新增库存质检信息
          component: resolve =>
            require(["../components/repertory/quality/addQuality.vue"], resolve)
        },
        {
          name: "editQuality",
          path: "/editQuality", //编辑库存质检信息
          component: resolve =>
            require([
              "../components/repertory/quality/editQuality.vue"
            ], resolve)
        },

        //库存 /库存质检模块end

        //库存模块end-----------------

        //管理模块start -----
        // 仓库管理start
        {
          name: "repertory",
          path: "/repertory", //仓库管理列表
          component: resolve =>
            require(["../components/repertory/repertory.vue"], resolve)
        },
        {
          name: "addRepertory",
          path: "/addRepertory", //新增仓库信息
          component: resolve =>
            require(["../components/repertory/addRepertory.vue"], resolve)
        },
        {
          name: "editRepertory",
          path: "/editRepertory", //编辑仓库信息
          component: resolve =>
            require(["../components/repertory/editRepertory.vue"], resolve)
        },

        //仓库管理end

        //库位管理start
        {
          name: "region",
          path: "/region", //库位管理列表
          component: resolve =>
            require(["../components/repertory/region.vue"], resolve)
        },
        {
          name: "addRegion",
          path: "/addRegion", //新增库位信息
          component: resolve =>
            require(["../components/repertory/addRegion.vue"], resolve)
        },
        {
          name: "editRegion", //编辑库位信息
          path: "/editRegion",
          component: resolve =>
            require(["../components/repertory/editRegion.vue"], resolve)
        },
        //库位管理end

        //箱单管理start
        //箱单管理start
        {
          name: "box",
          path: "/box", //箱单管理列表
          component: resolve =>
            require(["../components/repertory/box.vue"], resolve)
        },
        {
          name: "addBox",
          path: "/addBox", //新增箱单信息
          component: resolve =>
            require(["../components/repertory/addBox.vue"], resolve)
        },
        {
          name: "editBox", //编辑箱单信息
          path: "/editBox",
          component: resolve =>
            require(["../components/repertory/editBox.vue"], resolve)
        },
        //箱单管理end
        //中转箱管理start
        //中转箱管理start
        {
          name: "transitBox",
          path: "/transitBox", //中转箱管理列表
          component: resolve =>
            require(["../components/repertory/transitBox.vue"], resolve)
        },
        {
          name: "addTransitBox",
          path: "/addTransitBox", //新增中转箱信息
          component: resolve =>
            require(["../components/repertory/addTransitBox.vue"], resolve)
        },
        {
          name: "editTransitBox", //编辑中转箱信息
          path: "/editTransitBox",
          component: resolve =>
            require(["../components/repertory/editTransitBox.vue"], resolve)
        },
        //中转箱箱单管理end
         //栈板管理start
         {
          name: "transport",
          path: "/transport", //栈板管理列表
          component: resolve =>
            require(["../components/repertory/transport.vue"], resolve)
        },
        {
          name: "addTransport",
          path: "/addTransport", //新增栈板
          component: resolve =>
            require(["../components/repertory/addTransport.vue"], resolve)
        },
        {
          name: "editTransport",
          path: "/editTransport", //编辑栈板
          component: resolve =>
            require(["../components/repertory/editTransport.vue"], resolve)
        },
        //栈板管理end
        //管理模块end-------------
        //销售模块start
        {
          name: "salesOrder", //销售订单列表
          path: "/salesOrder",
          component: resolve =>
            require(["../components/order/sales/salesOrder.vue"], resolve)
        },
        //销售模块end

        {
          path: "/markdown",
          component: resolve =>
            require(["../components/page/Markdown.vue"], resolve) // Vue-Quill-Editor组件
        },
        {
          path: "/upload",
          component: resolve =>
            require(["../components/page/Upload.vue"], resolve) // Vue-Core-Image-Upload组件
        },
        {
          path: "/basecharts",
          component: resolve =>
            require(["../components/page/BaseCharts.vue"], resolve) // vue-schart组件
        },
        {
          path: "/drag",
          component: resolve =>
            require(["../components/page/DragList.vue"], resolve) // 拖拽列表组件
        },
        {
          path: "/table",
          component: resolve =>
            require(["../components/page/VueTable.vue"], resolve) // 拖拽列表组件
        }
      ]
    }
  ]
});
