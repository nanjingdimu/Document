export class Router {
  configureRouter(config, router) {
    config.title = '项目前期-初步设计';
    config.map([
      { route: ['', 'index'], name: 'index',  moduleId: './index', nav: false, title: '初步设计' },
      { route: ['new'], name: 'new',  moduleId: './new', nav: false, title: '新建设计' },
      { route: ['/:id/edit'], name: 'edit',  moduleId: './edit', nav: false, title: '修改' },
      { route: ['/:id/verify'], name: 'verify',  moduleId: './verify', nav: false, title: '审核' },
    ]);

    this.router = router;
  }
}
