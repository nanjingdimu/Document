export class Router {
  configureRouter(config, router) {
    config.title = '项目前期-服务采购';
    config.map([
      { route: ['', 'index'], name: 'index',  moduleId: './index', nav: false, title: '服务采购' },
      { route: ['new'], name: 'new',  moduleId: './new', nav: false, title: '新建' },
      { route: ['/:id/edit'], name: 'edit',  moduleId: './edit', nav: false, title: '编辑' },
    ]);

    this.router = router;
  }
}
