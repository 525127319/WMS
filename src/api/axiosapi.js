/**
 * Created by jerry on 2017/4/13.
 */
import axiosHttp from '../common/axiosHttp'

//登录url
export const requestLogin = params => { return axiosHttp.axiosPostNoHeader('/api/token/create.do', params) }

//获取当前登录者的用户名
export const getRealName = params => { return axiosHttp.axiosPost('/wms-management/repertoryLogin/findLoginUserInfo.api', params) }

//仓库列表
// export const repertoryList = params => { return axiosHttp.axiosPost('/service-inventory/repertory/getRepertoryList.api', params) } //old
export const repertoryList = params => { return axiosHttp.axiosPost('/wms-management/repertory/getRepertoryList.api', params) }

//新增仓库时  自动生成仓库编号
// export const findRepertoryNo = params => { return axiosHttp.axiosPost('service-inventory/repertory/findRepertoryNo.api', params) }
export const findRepertoryNo = params => { return axiosHttp.axiosPost('/wms-management/repertory/findRepertoryNo.api', params) }

//新增仓库时,校验仓库编号是否存在
export const findCountRepertoryByNo = params =>{ return axiosHttp.axiosPost('/wms-management/repertory/findCountRepertoryByNo.api', params)}





//新增仓库信息
export const addRepertoryInfo = params => { return axiosHttp.axiosPost('/wms-management/repertory/insertRepertory.api', params) }

//删除仓库信息 params{id :'1'}
export const deleteRepertoryInfoById = params => { return axiosHttp.axiosPost('/wms-management/repertory/deleteByPrimaryKey.api', params) }

//编辑仓库信息 回显
export const editRepertoryInfoById = params => { return axiosHttp.axiosPost('/wms-management/repertory/repertoryFindById.api', params) }

//确定修改仓库信息
export const editRepertoryInfo = params => { return axiosHttp.axiosPost('/wms-management/repertory/updateRepertoryByPrimaryKey.api', params) }


//库位列表
export const repertoryRegionList = params => { return axiosHttp.axiosPost('/wms-management/region/findRegionByPage.api', params) }

//新增库位时  自动生成库位编号
export const findRegionNo = params => { return axiosHttp.axiosPost('/wms-management/region/findRegionNo.api', params) }

//编辑库位 回显
export const editRepertoryRegionInfoById = params => { return axiosHttp.axiosPost('/wms-management/region/findRepertoryRegionById.api', params) }

//确定修改库位信息
export const editRegionInfo = params => { return axiosHttp.axiosPost('/wms-management/region/updateRepertoryRegionById.api', params) }

//新增库位信息
export const addRegionInfo = params => { return axiosHttp.axiosPost('/wms-management/region/addRegionRepertory.api', params) }

//新增库位时 返回仓库ID 仓库名称 集合
export const selectRepertoryIdAndName = params => { return axiosHttp.axiosPost('/wms-management/region/findAddRegionRepertoryInfo.api', params) }

//根据库位id删除库位信息
export const deleteRegionInfoById = params => { return axiosHttp.axiosPost('/wms-management/region/deleteRepertoryRegionById.api', params) }




export const addOrderCustomer = params => { return axiosHttp.axiosPost('/service-aps/order/findUserInfo.api', params) }


//获取人事文件树
export const getOrganizationInfoList = () => { return axiosHttp.axiosPost('/ehr-profile/org/getOrganizationInfoList') }

//获取人事文件树详情
export const getSysUserByOrgId = params => { return axiosHttp.axiosPost('/ehr-profile/user/findUserByPage', params) }



//箱单列表
export const findBoxListByPage = params => { return axiosHttp.axiosPost('/wms-management/boxList/findBoxListByPage.api', params) }

//箱单列表 查看详情(编辑时回显数据)
export const findBoxDetailById = params => { return axiosHttp.axiosPost('/wms-management/boxList/findBoxInfoByBoxId.api', params) }


//新增箱单时 自动生成条码
export const findCode = params => { return axiosHttp.axiosPost('/wms-management/boxList/findCode.api', params) }
//新增箱单时 自动生成流水号以及 P.o.
export const findSerialNumber = params => { return axiosHttp.axiosPost('/wms-management/boxList/findSerialNumber.api', params) }

//新增箱单时 箱单详情列表弹出框
export const findProductInfo = params => { return axiosHttp.axiosPost('/wms-management/boxList/findProductInfo.api', params) }

//确定新增保存箱单
export const addBoxInfo = params => { return axiosHttp.axiosPost('/wms-management/boxList/addBoxListInfo.api', params) }

//确定修改保存箱单
export const editBoxInfo = params => { return axiosHttp.axiosPost('/wms-management/boxList/updateBoxListInfo.api', params) }

//打印二维码
export const printBoxQrcode = params => { return axiosHttp.axiosPost('/wms-management/boxList/printBarCode.api', params) }
//打印二维码
export const printRegionQrcode = params => { return axiosHttp.axiosPost('/wms-management/region/printBarCode.api', params) }
//打印二维码
export const printRepertoryQrcode = params => { return axiosHttp.axiosPost('/wms-management/repertory/printBarCode.api', params) }
//获取中转箱信息
export const getTransitBoxList = params => {return axiosHttp.axiosPost('wms-management/transitBox/findTransitBoxListByPage.api',params)}
//添加中转箱信息
export const addTransitBoxInfo = params => {return axiosHttp.axiosPost('wms-management/transitBox/addTransitBox.api',params)}
//获取中转箱条码
export const getBarCode = params => {return axiosHttp.axiosPost('wms-management/transitBox/findCode.api',params)}

//根据ID获取中转箱信息
export const getTransitBoxInfoById = params => {return axiosHttp.axiosPost('wms-management/transitBox/findTransitBoxInfoById.api',params)}

//系统菜单接口
// export const getRightMenu = params => {return axiosHttp.axiosPost('service-rights/rbacRightController/getRightMenu.api',params)}//正式
export const getRightMenu = params => {return axiosHttp.axiosPost('platform-rights/rbacRightController/getRightMenu.api',params)}//测试
//根据模块名称获取序列号
export const getCodeBySeqName = params => {return axiosHttp.axiosPost('wms-management/common/findSequenceIdByCode.api',params)}
//查询所有仓库类型
export const getRepertoryType = params => {return axiosHttp.axiosPost('wms-management/repertory/findAllRepertoryInfo.api',params)}

//栈板列表
export const transportList = params => { return axiosHttp.axiosPost('wms-management/transport/queryTransportByInfo.api', params) }
//添加栈板
export const addTransportInfo = params => { return axiosHttp.axiosPost('wms-management/transport/addTransport.api', params) }
//打印二维码
// export const printCodeInfo = params => { return axiosHttp.axiosPost('http://127.0.0.1:8080/print/printQRCodeOrTable.api', params) }//正式
export const printCodeInfo = params => { return axiosHttp.axiosPost('http://172.16.4.56:8080/print/printQRCodeOrTable.api', params) }//测试
//编辑栈板
export const editTransportInfo = params => { return axiosHttp.axiosPost('wms-management/transport/updateTransport.api', params) }
//编辑栈板信息回显
export const editTransportInfoById = params => { return axiosHttp.axiosPost('wms-management/transport/queryTransportById.api', params) }
//删除栈板
export const deleteTransportInfo = params => { return axiosHttp.axiosPost('wms-management/transport/delTransport.api', params) }
//新增栈板初始二维码
export const addTransportInfoByCode = params => { return axiosHttp.axiosPost('wms-management/common/findSequenceIdByCode.api', params) }
//库存质检打印详情页面
export const findBoxPrintInfo = params => { return axiosHttp.axiosPost('wms-stock/repertoryQuality/findBoxPrintInfo.api', params) }
//库存质检详情搜索
export const detailSearchInfo = params => { return axiosHttp.axiosPost('wms-stock/repertoryQuality/findRepertoryQualityById.api', params) }
//确认打印二维码
export const confirmPrintInfo = params => { return axiosHttp.axiosPost('wms-stock/repertoryQuality/confirmPrint.api', params) }
//新增机加件
export const addMaterialsInfo = params => { return axiosHttp.axiosPost('mms-materialsweb/productController/addMPInfo.api', params) }
//打印
export const newConfirmPrintInfo = params => { return axiosHttp.axiosPost('wms-stock/repertoryQuality/oneClickPrint.api', params) }
//批量导入
export const importExcelInfo = params => { return axiosHttp.axiosUpload('mms-materialsweb/productController/importMPInfos.do', params) }
//质检信息统计
export const qualityLeftInfo = params => { return axiosHttp.axiosPost('WarehouseOverview/queryOverViewOfInspection.api', params) }
//入库信息统计
export const storageInfo = params => { return axiosHttp.axiosPost('WarehouseOverview/queryOverViewOfWarehouse.api', params) }
//备料领料统计
export const stockAndPickingInfo = params => { return axiosHttp.axiosPost('WarehouseOverview/queryOverViewOfParepareAndPick.api', params) }
//月出库信息统计
export const monthWarehouseInfo = params => { return axiosHttp.axiosPost('WarehouseOverview/queryOverViewOfOutbound.api', params) }
//仓库信息提示
export const allInformationInfo = params => { return axiosHttp.axiosPost('WarehouseOverview/queryWaitInfo.api', params) }

