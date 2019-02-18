//库存查询
import axiosHttp from '../common/axiosHttp'


//导入初始数据上传
export const uploadFiles = params => { return axiosHttp.axiosUpload('/wms-stock/repertoryDetailController/uploadFile.api', params) };




//库存查询列表
export const inventoryQueryList = params => { return axiosHttp.axiosPost('/wms-stock/repertoryDetailController/findRepertoryDetailByOrder.api', params) };

//查看库存详情
export const inventoryQueryDetail = params => { return axiosHttp.axiosPost('/wms-stock/repertoryDetailController/findRepertoryDetailVoByRegionId.api', params) };

//订单库存列表查询(产品、物料)
export const orderInventoryQueryList = params => { return axiosHttp.axiosPost('/wms-stock/repertoryDetailController/findRepertoryDetailByOrder.api', params) };


//工单库存列表查询(产品)
export const findRepertoryDetailByWorkNumber = params => { return axiosHttp.axiosPost('/wms-stock/repertoryDetailController/findRepertoryDetailByWorkNumber.api', params) };


export const getCodeBySeqName = params => {return axiosHttp.axiosPost('wms-management/common/findSequenceIdByCode.api',params)}






//查看其他入库列表信息
export const OtherStorageList  = params => { return axiosHttp.axiosPost('/wms-warehousing/OtherInstorage/findOtherInstorageByPage.api', params) };
export const OtherStorageDetailById  = params => { return axiosHttp.axiosPost('/wms-warehousing/OtherInstorage/findOtherStorageVo.api', params) };

//新增采购订单入库时 加载所有仓库下拉框
export const initRepertoryList = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findRepertoryIdAndNameList.api', params) };
//根据仓库id 查询该仓库下的所有库位信息
export const getRegionListByRepertoryId = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findRepertoryRegionIdAndNameList.api', params) };
//确定修改保存生产入库
export const editOtherStorage = params => { return axiosHttp.axiosPost('/wms-warehousing/OtherInstorage/editOtherStorage.api', params) };
//新增其它入库时 自动生成id 与 入库单号
export const findOtherStorageCode = params => { return axiosHttp.axiosPost('/wms-warehousing/OtherInstorage/findOtherStorageNumberCode.api', params) };
//新增其它入库时 , 新增物料列表
export const findOtherInstorageMateriel = params => { return axiosHttp.axiosPost('/wms-warehousing/OtherInstorage/findMaterialsInfo.api', params) };
//新增其它入库时 , 新增产品列表
export const findOtherInstorageProduct = params => { return axiosHttp.axiosPost('/wms-warehousing/OtherInstorage/findProductInfo.api', params) };
// 保存它入库的新增产品 , 
export const saveOtherInstorageProduct = params => { return axiosHttp.axiosPost('/wms-warehousing/OtherInstorage/addOtherStorage.api', params) };
// 查询质检信息, 
export const findRpertoryQuality = params => { return axiosHttp.axiosPost('/wms-warehousing/OtherInstorage/findRepertoryQuality.api', params) };
// 查询质检单号的详细数据, 
export const findfindRpertoryQualityDetail = params => { return axiosHttp.axiosPost('/wms-warehousing/OtherInstorage/findRepertoryQualityDetail.api', params) };
// 更改库位  获取库存信息
export const findInventory = params => { return axiosHttp.axiosPost('/wms-warehousing/OtherInstorage/findInventory.api', params) };

// 物料类别展示接口
export const findRepertory = params => { return axiosHttp.axiosPost('/wms-stock/repertoryDetailController/findAllCategory.api', params) };
// 查询某一物料类别数据
export const findRepertoryInfo = params => { return axiosHttp.axiosPost('/wms-stock/repertoryDetailController/findRepertoryByCategory.api', params) };

//下拉框的数据查询
export const findDepot = params => { return axiosHttp.axiosPost('/wms-stock/repertoryDetailController/findDepot.api', params) };

