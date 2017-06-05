import  store from './store'
import {inject} from 'aurelia-framework'
import {Router} from 'aurelia-router'

@inject(Router)
export default class Verify{
  constructor(router) {
    this.router = router
    this.store = store
  }

  back() {
    this.router.navigateBack()
  }

  activate({'id': id}) {
    this.store.editProject(id)
  }
  
  // 提交
	update = (status) => {
	    this.store
     	.updateProject(status)
     	.verifyProjFeasibility(status)
     	.then((result) => {
        	if (result){
          		this.back()
        	}
      	})
	}
	 // 保存
	create = (status) => {
   	  this.store
      .createProject()
     	.updateProject(status)
     	.verifyProjFeasibility(status)
      .then((result) => {
        if (result){
        	 this.store.createProjFeasibilityFile()
           this.back()
        }
      })
  	}
  verify = () => {
  	console.log(this.radioType);
    this.store
      .verifyProjFeasibility(this.radioType)
      .then((result) => {
        if (result){
          this.back()
        }
      })
  }
}

