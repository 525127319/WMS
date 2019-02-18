//库存调拨模块api
import axiosHttp from '../common/axiosHttp'

//获取调拨列表
export const findMoveInfoByPage = params => { return axiosHttp.axiosPost('/wms-stock/repertoryMove/findMoveInfoByPage.api', params) }


//根据ID查看详情
export const findMoveInfoById = params => { return axiosHttp.axiosPost('/wms-stock/repertoryMove/findMoveInfoById.api', params) }

//新增时 自动生成调拨单号
export const findMoveNum = params => { return axiosHttp.axiosPost('/wms-stock/repertoryMove/findMoveNum.api', params) }

//查询调拨物料产品列表
export const findAddMoveInfo = params => { return axiosHttp.axiosPost('/wms-stock/repertoryMove/findAddMoveInfo.api', params) }

//新增调拨单
export const addMoveInfo = params => { return axiosHttp.axiosPost('/wms-stock/repertoryMove/addMoveInfo.api', params) }

//查看调拨明细
export const findMoveDetailsInfo = params => { return axiosHttp.axiosPost('/wms-stock/repertoryMove/findInventeryByProductNumber.api', params) }

//新增采购订单入库时 加载所有仓库下拉框
export const initRepertoryList = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findRepertoryIdAndNameList.api', params) };

//根据仓库id 查询该仓库下的所有库位信息
export const getRegionListByRepertoryId = params => { return axiosHttp.axiosPost('/wms-warehousing/order/findRepertoryRegionIdAndNameList.api', params) };

// 搜索二维码
export const findBarCode = params => { return axiosHttp.axiosPost('wms-management/transitBox/findBarCodeListByKeyWords.api', params) }

// 查询二维码是否需要初始化
export const checkIfNeedInint = params => { return axiosHttp.axiosPost('wms-management/transitBox/checkIfNeedInint.api', params) }

//初始化二维码
export const InitializationBarCode = params => { return axiosHttp.axiosPost('wms-management/initializeBox/delBoxLastRecordInformation.api', params) }

//初始化二维码
export const submitEditMoveInfo = params => { return axiosHttp.axiosPost('wms-stock/repertoryMove/editMoveInfo.api', params) }

//初始化二维码
export const editMoveBoxInfo = params => { return axiosHttp.axiosPost('wms-stock/repertoryMove/editMoveBoxInfo.api', params) }







