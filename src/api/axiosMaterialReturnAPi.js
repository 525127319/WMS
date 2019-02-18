//生产退料模块api
import axiosHttp from '../common/axiosHttp'

//退料料单列表
export const findReturnMaterialsByPage = params => { return axiosHttp.axiosPost('/wms-materials/returnMaterials/findReturnMaterialsByPage.api', params) };

//新增退料单 自动生成退料单号
export const findAddMaterialsNumber = params => { return axiosHttp.axiosPost('/wms-materials/returnMaterials/findAddMaterialsNumber.api', params) };

//确定新增退料单
export const addMaterials = params => { return axiosHttp.axiosPost('/wms-materials/returnMaterials/addReturnMaterials.api', params) };

//根据退料单ID查询详情
export const findReturnMaterialsById = params => { return axiosHttp.axiosPost('/wms-materials/returnMaterials/findReturnMaterialsById.api', params) };

//确定修改退料单
export const updateReturnMaterials = params => { return axiosHttp.axiosPost('/wms-materials/returnMaterials/updateReturnMaterials.api', params) };

