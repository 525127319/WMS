//生产生产入库模块api
import axiosHttp from '../common/axiosHttp';

//生产入库列表
export const produceEnterList = params => { return axiosHttp.axiosPost('/wms-warehousing/productionInStorage/findProductionInStorageListByPage.api', params) };

//根据生产入库id 查看入库详情
export const queryProduceEnterDetailById = params => { return axiosHttp.axiosPost('/wms-warehousing/productionInStorage/findProductionInStorageById.api', params) };

//新增生产入库时 自动生成id 与 入库单号
export const findProductionInStorageCode = params => { return axiosHttp.axiosPost('/wms-warehousing/productionInStorage/findProductionInStorageCode.api', params) };

//新增生产入库时  查询关联生产订单号 列表(旧版)
export const findApsAllPlanIdByApsApi = params => { return axiosHttp.axiosPost('/wms-warehousing/productionInStorage/findApsAllPlanIdByApsApi.api', params) };


//新增生产入库时  根据订单id 查看订单下的产品 列表(旧版)
export const findPlanProductByStockByApi = params => { return axiosHttp.axiosPost('/wms-warehousing/productionInStorage/findPlanProductByStockByApi.api', params) };



//新增生产入库时 , 生产入库产品弹框
export const findProductInfo = params => { return axiosHttp.axiosPost('/wms-warehousing/productionInStorage/findProductInfo.api', params) };

//在选中弹框中的每一条数据后,根据选中的产品编号查询库存
export const findRepertoryNumberByCode = params => { return axiosHttp.axiosPost('/wms-warehousing/productionInStorage/findRepertoryNumberByCode.api', params) };

//确定新增保存生产入库
export const addProduceEnter = params => { return axiosHttp.axiosPost('/wms-warehousing/productionInStorage/addProductionInStorageList.api', params) };

//确定修改保存生产入库
export const editProduceEnter = params => { return axiosHttp.axiosPost('/wms-warehousing/productionInStorage/updateProductionInStorageList.api', params) };


//新增生产入库时,查询关联生产订单号 列表(新版 2017.11.07)
// export const findOrderForProduction = params => { return axiosHttp.axiosPost('/aps-order/order/findOrderForProductionToStock.api', params) };
//新增生产入库时,查询关联生产订单号 列表(新版 2017.3.1)
export const findOrderForProduction = params => { return axiosHttp.axiosPost('/wms-warehousing/productionInStorage/findOrderForProduction.api', params) };

//根据订单ID查找产品 列表(新版 2017.11.07)
export const findNewPlanProductByStockByApi = params => { return axiosHttp.axiosPost('/wms-warehousing/productionInStorage/findPlanProductByStockByApi.api', params) };

//根据订单编号查询工单接口(新版 2018.3.1)
export const findWorkOrderInfo= params => { return axiosHttp.axiosPost('/wms-warehousing/productionInStorage/findWorkOrderInfo.api', params) };

// 搜索二维码
export const findBarCode = params => {return axiosHttp.axiosPost('wms-management/transitBox/findBarCodeListByKeyWords.api',params)}

// 查询二维码是否需要初始化
export const checkIfNeedInint = params => {return axiosHttp.axiosPost('wms-management/transitBox/checkIfNeedInint.api',params)}

//初始化二维码
export const InitializationBarCode = params => {return axiosHttp.axiosPost('wms-management/initializeBox/delBoxLastRecordInformation.api',params)}
//初始化二维码
export const getInitiateRequest = params => {return axiosHttp.axiosPost('wms-warehousing/productionInStorage/findInStorageQuantity.api',params)}










