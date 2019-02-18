//生产备料模块api
import axiosHttp from '../common/axiosHttp'

//备料单列表
export const findStockMaterialsByPage = params => { return axiosHttp.axiosPost('/wms-materials/ProducePrepares/getProducePreparesList.api', params) };

//查看备料单详情
export const findProducePreparesDetailById = params => { return axiosHttp.axiosPost('/wms-materials/ProducePrepares/findProducePreparesDetailById.api', params) };

//根据产品编号 选择材料备料仓库
export const findInventeryByProductNumber = params => { return axiosHttp.axiosPost('/wms-materials/ProducePrepares/findInventeryByProductNumber.api', params) };

//新增生产备料时,自动生成备料单号/findPrepareMaterialsCode.api
export const findPrepareMaterialsCode = params => { return axiosHttp.axiosPost('/wms-materials/ProducePrepares/findPrepareMaterialsCode.api', params) };

//新增生产备料单时 关联备料单列表
export const findOrderForReady = params => { return axiosHttp.axiosPost('/wms-materials/ProducePrepares/findOrderForReady.api', params) };


//新增生产备料单  
export const addMaterialStock = params => { return axiosHttp.axiosPost('/wms-materials/ProducePrepares/addProducePrepares.api', params) };


//编辑保存生产备料单   
export const editMaterialStock = params => { return axiosHttp.axiosPost('/wms-materials/ProducePrepares/editProducePrepares.api', params) };

