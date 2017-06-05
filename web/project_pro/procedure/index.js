import store from './store'

export default class Index{
  constructor() {
    this.store = store
    this.store.reset()
    this.store.loadBuildUnits()
    this.store.loadProjects()
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
}
