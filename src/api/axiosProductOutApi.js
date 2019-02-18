//库存 --产品出库模块api
import axiosHttp from '../common/axiosHttp'

//产品出库模块
export const productOutList = params => { return axiosHttp.axiosPost('/wms-outbound/productOutOfRepertory/findProductOutOfRepertoryListByPage.api', params) };

//查看详情
export const findProductOutOfRepertoryById = params => { return axiosHttp.axiosPost('/wms-outbound/productOutOfRepertory/findProductOutOfRepertoryById.api', params) };

// 其他出库

//查看列表
export const OtherOutRepertoryList = params => { return axiosHttp.axiosPost('/wms-outbound/OtherOutRepertory/findOtherOutRepertoryByPage.api', params) };

export const findOtherOutRepertoryVoById  = params => { return axiosHttp.axiosPost('/wms-outbound/OtherOutRepertory/findOtherOutRepertoryVoById.api', params) };

//根据仓库id 查询该仓库下的所有库位信息
export const getRegionListByRepertoryId = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findRepertoryRegionIdAndNameList.api', params) };

// 加载所有仓库下拉框
export const initRepertoryList = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findRepertoryIdAndNameList.api', params) };

//确定修改保存其它出库
export const editOtherlibrary = params => { return axiosHttp.axiosPost('/wms-outbound/OtherOutRepertory/editOtherOutRepertory.api', params) };
//新增其它出库时 自动生成id 与 入库单号
export const findOtherlibraryCode = params => { return axiosHttp.axiosPost('/wms-outbound/OtherOutRepertory/findOtherOutRepertoryNumberCode.api', params) };

//新增其它出库时 , 列表
export const findOtherOutlibraryList = params => { return axiosHttp.axiosPost('/wms-outbound/OtherOutRepertory/findAddOtherOutRepertoryInfo.api', params) };

// 保存它入库的新增产品 , 
export const saveOtherOutRepertory = params => { return axiosHttp.axiosPost('/wms-outbound/OtherOutRepertory/addOtherOutRepertory.api', params) };

// 更改库位  获取库存信息
export const findInventory = params => { return axiosHttp.axiosPost('/wms-warehousing/OtherInstorage/findInventory.api', params) };



//根据模块名称获取序列号
export const getCodeBySeqName = params => {return axiosHttp.axiosPost('wms-management/common/findSequenceIdByCode.api',params)}

//新增生产入库时,查询关联生产订单号 列表(新版 2017.3.1)
export const findOrderForProduction = params => { return axiosHttp.axiosPost('/aps-order/order/findOrderForProductionOut.api', params) };

//根据订单编号查询工单接口(新版 2018.3.1)
// export const findWorkOrderInfo= params => { return axiosHttp.axiosPost('/aps-order/productionInStorage/findWorkOrderInfo.api', params) };
export const findWorkOrderInfo= params => { return axiosHttp.axiosPost('/aps-order/order/findWorkOrderOutInfo.api ', params) };

// aps-order/order/findWorkOrderOutInfo.api 



//根据订单编号查询工单接口(新版 2018.3.1)
export const getInitiateRequest= params => { return axiosHttp.axiosPost('/wms-outbound/productOutOfRepertory/findStockByOrderAndWorkOrder.api', params) };

//根据订单编号查询工单接口(新版 2018.3.1)
export const getAddPurchaseOrder= params => { return axiosHttp.axiosPost('/wms-outbound/productOutOfRepertory/addStockByOrderAndWorkOrder.api', params) };

