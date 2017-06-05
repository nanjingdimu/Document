import  store from './store'
import {inject} from 'aurelia-framework'
import {Router} from 'aurelia-router'

@inject(Router)
export default class Edit{
  constructor(router) {
    this.router = router
    this.store = store
    this.store.loadBuildUnits()
  }

  back() {
    this.router.navigateBack()
  }

  activate({'id': id}) {
    this.store.editProject(id)
  }

  update = (status) => {
    this.store
      .updateProject(status)
      .then((result) => {
        if (result){
          this.back()
        }
      })
  }
}
