export class Router {
  configureRouter(config, router) {
    config.title = '项目前期-可行性研究'
    config.map([
      { route: ['', 'index'], name: 'index', moduleId: './index', nav: false, title: '可行性研究' },
      { route: ['new'], name: 'new', moduleId: './new', nav: false, title: '新建可行性研究' },
      { route: ['verify'], name: 'verify', moduleId: './verify', nav: false, title: '审核可行性研究' },
      { route: ['edit'], name: 'edit', moduleId: './edit', nav: false, title: '编辑可行性研究' },
    ])
    this.router = router
  }
}
