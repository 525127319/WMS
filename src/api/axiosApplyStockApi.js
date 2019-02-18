/**
 * Created by jerry on 2018年4月26日.
 */
import axiosHttp from '../common/axiosHttp'

//分页查询申请备料信息
export const getApplyStockByPage  = params => { return axiosHttp.axiosPost('wms-materials/applyForStock/findApplyStockInfoByPage.api', params) };

//根据ID查询申请备料详情
export const getApplyStockDetailsById  = params => { return axiosHttp.axiosPost('wms-materials/applyForStock/findApplyStockDetailsById.api', params) };

//导入申请备料物料列表信息
export const addApplyStockInfo  = params => { return axiosHttp.axiosUpload('wms-materials/applyForStock/addApplyStockInfo.api', params) };

//添加备料单
export const addStockInfo  = params => { return axiosHttp.axiosPost('wms-materials/applyForStock/addStockInfo.api', params) };

//删除申请备料单
export const deleteApplyStockInfo  = params => { return axiosHttp.axiosPost('wms-materials/applyForStock/deleteApplyStockInfoById.api', params) };

//根据详情ID删除申请备料详情
export const deleteApplyStockDetailsInfoById  = params => { return axiosHttp.axiosPost('wms-materials/applyForStock/deleteApplyStockDetailsInfoById.api', params) };

//根据批次号分页查询物料信息
export const getMaterialsInfoByBatchNumber  = params => { return axiosHttp.axiosPost('wms-materials/batch/findDetailsInfoByBatchNumber.api', params) };

//查询所有批次号集合
export const getBatchList  = params => { return axiosHttp.axiosPost('wms-materials/batch/findAllBatchNumber.api', params) };
