//生产领料模块api
import axiosHttp from '../common/axiosHttp'

//领料单列表
export const findPickMaterialsByPage = params => { return axiosHttp.axiosPost('/wms-materials/pickMaterials/findPickMaterialsByPage.api', params) };

//根据id查看领料单详情
export const findPickMaterialsDetailsByOrderId = params => { return axiosHttp.axiosPost('/wms-materials/pickMaterials/findPickMaterialsDetailsByOrderId.api', params) };

//根据id删除领料单信息
export const deleteMaterialPickingById = params => { return axiosHttp.axiosPost('', params) };

//新增领料单时 加载领料材料明细列表(物料编码,物料名称,物料属性,供应商名称,物料分类,库存数量,领用数量)
//调用标准件接口
export const findAddMaterialsInfoByMaterialswebApi = params => { return axiosHttp.axiosPost('/wms-stock/repertoryDetailController/findRepertoryDetailByOrderNumber.api', params) };

//确定新增领料单
export const addMaterialPicking = params => { return axiosHttp.axiosPost('/wms-materials/pickMaterials/addPickMaterials.api', params) };
//确定修改领料单
export const updateMaterialPicking = params => { return axiosHttp.axiosPost('/wms-materials/pickMaterials/updatePickMaterialsDetailsByOrderId.api', params) };

//新增领料单自动生成单号
export const findAddMaterialsNumber  = params => { return axiosHttp.axiosPost('/wms-materials/pickMaterials/findAddMaterialsNumber.api', params) };