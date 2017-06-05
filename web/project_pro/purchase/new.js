import store from './store'
import {inject} from 'aurelia-framework'
import {Router} from 'aurelia-router'

@inject(Router)
export default class New{
  constructor(router) {
  	this.router = router
    this.store = store
    this.store.project = {}
    this.store.reset()
    this.store.loadProjects()
    this.fileInfo = {catalog: '1', detail: '1' , order: 1};
    this.store.loadProject()
  }

  delete = (id) => {
    this.store
      .deleteProject(id)
      .then((result) => {
        if (result) {
          this.store.loadProjects()
        }
      })
  }
  
	//更改项目 重新加载列表
	changeProject = () => {
    this.store.loadProject()
    }
	// 返回
	 back() {
    this.router.navigateBack()
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
	  
	   // 提交
	  verifyProjFeasibility = (status) => {
    this.store
      . verifyProjFeasibility()
      .then((result) => {
        if (result){
          this.back()
        }
      })
  }
	  
	  //上传成功回掉
 afterUpload = (file) => {
    toastr.info(file.info.name + " 上传成功")
    this.store.fileId = file.id;
//  this.store
//    .uploadConstructionDraw(file)
//    .then((fi) => { 
//    	
//    	  this.store.loadFileInfo(this.fileInfo.catalog,this.fileInfo.detail,this.fileInfo.order);
//    })
  }
	  
	 
	 
}
