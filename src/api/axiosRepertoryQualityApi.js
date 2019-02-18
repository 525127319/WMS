//库存质检模块api
import axiosHttp from '../common/axiosHttp'

//获取质检列表
export const findRepertoryQualityByPage = params => { return axiosHttp.axiosPost('/wms-stock/repertoryQuality/findRepertoryQualityByPage.api', params) }

//自动生成质检单号
export const findAddRepertoryQualityNumber = params => { return axiosHttp.axiosPost('/wms-stock/repertoryQuality/findAddRepertoryQualityNumber.api', params) }

//确定新增质检单
export const addRepertoryQuality = params => { return axiosHttp.axiosPost('/wms-stock/repertoryQuality/addRepertoryQuality.api', params) }

//根据质检单ID查看详情
export const findRepertoryQualityById = params => { return axiosHttp.axiosPost('/wms-stock/repertoryQuality/findRepertoryQualityById.api', params) }

//确定编辑质检单
export const updateRepertoryQuality = params => { return axiosHttp.axiosPost('/wms-stock/repertoryQuality/updateRepertoryQuality.api', params) }




//生产入库质检弹框
export const findOrderForProduction = params => { return axiosHttp.axiosPost('/aps-order/order/findOrderInfoIsCheck.api', params) }

//根据生产入库单ID查看产品
export const findPlanProductByStockByApi = params => { return axiosHttp.axiosPost('/wms-warehousing/productionInStorage/findPlanProductByStockByApi.api', params) }

//采购入库质检弹框
export const initPurchaseOrderNumber = params => { return axiosHttp.axiosPost('/pms-purchase/purchaseOrderController/getPurchaseOrderListForIV.api', params) }






