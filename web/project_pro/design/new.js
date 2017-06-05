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
    this.fileInfo = null;
    this.designId = null //初步设计ID 
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
    this.store.loadProjects()
    }
	// 返回
	 back(){
    this.router.navigateBack()
  }
	 // 保存
	  create = () => {
    this.store
      .createProject()
      .then((result) => {
        if (result){
        	 this.store.createProjFeasibilityFile()
        }
      })
  }
	  
	  
	  joinInfo = (catalogInfo, detailInfo, orderInfo) => {
		const fileInfos = {catalog: catalogInfo, detail: detailInfo, order: orderInfo};
		this.fileInfo = fileInfos;
			//当上传的文件时没有和综合验收绑定
			this.store.listFiles = []
	      _.forEach(this.store.reportFiles, (f) => {
				if(f.info.catalog == this.fileInfo.catalog && f.info.detail == this.fileInfo.detail && f.info.order == this.fileInfo.order) {
					//将符合条件的文件加入
					this.store.listFiles.push(f)
				}
			})
		
	}
   
   //上传成功后回调
  afterUpload = (file) => {
		//这边要根据 综合验收Id来判断是否有值,没有值只上传文件,有值上传关联关系
			this.store.uploadFile(file)
	      .then((fi) => { 
	      	  if(this.store.listChangeFiles.length>0)
			    {
      	  	this.store.listFiles = []
      	  	_.forEach(this.store.listChangeFiles, (f) => {
							if(f.info.catalog == this.fileInfo.catalog && f.info.detail == this.fileInfo.detail && f.info.order == this.fileInfo.order) {
								//将符合条件的文件加入
								this.store.listFiles.push(f)
							}
		       })
			    }
	      	toastr.info(file.info.name + " 上传成功")
	      })

	}
 	//保存数据
   save = () => {
   	  this.store.createCostPay()
   }
 	
 //删除文件
 deleteFileById = (id) => {
 	 this.store.deleteFile(id)
  }
 
 
}
