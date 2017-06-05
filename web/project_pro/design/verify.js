import  store from './store'
import {inject} from 'aurelia-framework'
import {Router} from 'aurelia-router'

@inject(Router)
export default class Verify{
  constructor(router) {
    this.router = router
    this.store = store
    this.fileInfo = null;
  }

  back() {
    this.router.navigateBack()
  }

  activate({'id': id}) {
    this.store.editProject(id)
  }
  
  
	  joinInfo = (catalogInfo, detailInfo, orderInfo) => {
		const fileInfos = {catalog: catalogInfo, detail: detailInfo, order: orderInfo};
		this.fileInfo = fileInfos;
			//查询当前的文件信息
	 	 	this.store.loadFileInfo(catalogInfo, detailInfo, orderInfo);
		
	}
  
  // 提交
	update = (status) => {
	    this.store
     	.updateProject(status)
     	.verifyProjFeasibility(this.radioType)
     	.then((result) => {
        	if (result){
          		this.back()
        	}
      	})
	}
	 
  verify = () => {
			this.store
      .verifyProjFeasibility(this.radioType)
      .then((result) => {
        if (result){
          this.back()
        }
      })
  }
}

