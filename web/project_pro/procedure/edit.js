import  store from './store'
import {inject} from 'aurelia-framework'
import {Router} from 'aurelia-router'

@inject(Router)
export default class Edit{
	constructor(router) {
	    this.router = router
	    this.store = store
	    this.store.reset()
	    this.store.project = {}
	    this.store.loadBuildUnits()
	    this.fileInfo = {catalog: '1', detail: '1' , order: 1};
	}
	
 	activate({'id': id}) {
   		this.store.editProject(id)
  	}
	
	// 返回
	back() {
    	this.router.navigateBack()
  	}
	// 提交
	update = (status) => {
	    this.store
     	.updateProject(status)
     	.then((result) => {
        	if (result){
          		this.back()
        	}
      	})
	}
	 // 保存
	create = () => {
   	  this.store
      .createProject()
      .then((result) => {
        if (result){
        	 this.store.createProjFeasibilityFile()
           this.back()
        }
      })
  	}
	// 上传成功
	afterUpload = (file) => {
		console.log(file.info.name)
	    toastr.info(file.info.name + " 上传成功")
	    this.store.fileId = file.id;
	//  this.store
	//  .uploadConstructionDraw(file)
	//  .then((fi) => { 
	//    	this.store.loadFileInfo(this.fileInfo.catalog,this.fileInfo.detail,this.fileInfo.order);
	//   })
	}
	
	 // 新增行
   addLine = () => {
   	
 	  const pay ={}
 	  pay.tempId  = this.lineNum + 1
      this.store.cost_pay.push(pay);
      
  }
   // 删除行
   deleteLine= (index,pid) => {
   	
        _.forEach(this.store.cost_pay, (f) => {
     	if(f.tempId == index && f.tempId != undefined )
     	{
     		this.delProject_pays.push(f)
     		this.store.cost_pay = this.delProject_pays
     	}
     	else
     	{
     		if( pid !=undefined && f.id == pid )
     		{
     			this.store.deleteCostPay(f.id)
     		}
     	}
      })
        
      this.store.loadCostPayById(this.payId)
        
  }
}
