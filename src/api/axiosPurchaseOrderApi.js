//采购订单入库模块api
import axiosHttp from '../common/axiosHttp';

//采购订单列表
export const purchaseOrderList = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findPurchaseEnterList.api', params) };

//自动生成采购订单入库单号
export const initNumber = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findPurchaseEnterNumberCode.api', params) };

//查看详情
export const findPurchaseOrderDetailById = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findPurchaseOrderDetailById.api', params) };

//新增采购订单入库时 供应商名称,供应商id
export const initPurchaseOrderNumber = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findAddPurchaseOrderInfoListByGateWayId.api', params) };

//新增采购订单入库时 根据采购单号查看该采购订单下的所有商品
export const getPurchaseOrderProductByCode = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findPurcahseOrderByCode.api', params) };

//新增采购订单入库时 加载所有仓库下拉框
export const initRepertoryList = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findRepertoryIdAndNameList.api', params) };

//根据仓库id 查询该仓库下的所有库位信息
export const getRegionListByRepertoryId = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findRepertoryRegionIdAndNameList.api', params) };

//确定新增保存订单
export const addPurchaseOrder = params => { return axiosHttp.axiosPost('/wms-warehousing/order/addPurchaseOrder.api', params) };
//确定修改保存订单
export const editPurchaseOrder = params => { return axiosHttp.axiosPost('/wms-warehousing/order/editPurchaseOrder.api', params) };

//删除订单
export const deletePurchaseOrderById = params => { return axiosHttp.axiosPost('/wms-warehousing/order/deletePurchaseOrderById.api', params) };

//http://192.168.16.137:9001/wmswarehousing/order/findRepertoryQuality.api
//查询客供质检单列表
export const findRepertoryQuality = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findRepertoryQuality.api', params) };
//查询质检单物料质检状态
export const findRepertoryQualityDetail = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findRepertoryQualityDetail.api', params) };

//编辑采购订单时回显数据
export const findProductInfo = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findProductInfo.api',params)};

//根据产品编号 查询产品下的物料信息
export const findMaterialByProductCode = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findProductByProductCode.api',params)};


//查找所有客户列表
export const findCustomerInfo = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findCustomerInfo.api',params)};

//根据模块名称获取序列号
export const getCodeBySeqName = params => {return axiosHttp.axiosPost('wms-management/common/findSequenceIdByCode.api',params)}


// 搜索二维码
export const findBarCode = params => {return axiosHttp.axiosPost('wms-management/transitBox/findBarCodeListByKeyWords.api',params)}

// 查询二维码是否需要初始化
export const checkIfNeedInint = params => {return axiosHttp.axiosPost('wms-management/transitBox/checkIfNeedInint.api',params)}

//初始化二维码
export const InitializationBarCode = params => {return axiosHttp.axiosPost('wms-management/initializeBox/delBoxLastRecordInformation.api',params)}