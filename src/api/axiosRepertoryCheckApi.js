//库存盘点模块api
import axiosHttp from '../common/axiosHttp';

//库存盘点列表
export const findCheckInfoByPage = params => { return axiosHttp.axiosPost('/wms-stock/repertoryCheck/findCheckInfoByPage.api', params) };

//根据盘点ID查看盘点详情
export const findCheckDetailById = params => { return axiosHttp.axiosPost('/wms-stock/repertoryCheck/findCheckDetailById.api', params) };

//自动生成库存盘点
export const findCheckNum = params => { return axiosHttp.axiosPost('/wms-stock/repertoryCheck/findCheckNum.api', params) };

//产品列表弹框
export const findAddCheckInfo = params => { return axiosHttp.axiosPost('/wms-stock/repertoryCheck/findAddCheckInfo.api', params) };

//物料列表弹框
export const findAddCheckMaterieInfo = params => { return axiosHttp.axiosPost('/wms-stock/repertoryCheck/findAddCheckMaterieInfo.api', params) };

//确定新增库存盘点
export const addCheckInfo = params => { return axiosHttp.axiosPost('/wms-stock/repertoryCheck/addCheckInfo.api', params) };

//确定修改库存盘点
export const updateCheckInfoById = params => { return axiosHttp.axiosPost('/wms-stock/repertoryCheck/updateCheckInfoById.api', params) };




