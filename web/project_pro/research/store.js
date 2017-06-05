import client from 'common/client'
import tracked from 'common/tracked'
import uuid from 'common/uuid'
import {post} from 'common/client'
import {dictData} from 'data'
import _ from 'lodash'

class Store {
  constructor() {
    this.buildUnits = [] 
    this.buildUnitproject = {}
    this.projFeasibility = {}
    this.selectedBuildUnitId = null
    this.selectedProjectId = null
    this.quantityList = []
    this.filteredProjects = []
    this.dictData = dictData
    this.projects = []
    this.key_type = null
    this.key_construction_type = null
    this.project = {}
    this.quantityList = {}
    this.quantity_list_id = null
    this.status = null
    this.upFloor = null
    this.downFloor = null
    this.reportFiles = []
    this.fileIn = null
    this.listFiles = []  //存储文件列表''
    this.fileId = null
    this.editProjects = {}
    this.projFeasibilityProject = {}
    this.editProjectArr = []
    this.radioType = null
  }

  reset() {
     this.buildUnits = []
     this.buildUnitproject = {}
     this.selectedBuildUnitId = null
     this.projFeasibility = {}
     this.projFeasibilityProject = {}
     this.selectedProjectId = null
     this.filteredProjects = []
     this.dictData = dictData
     this.key_type = null
     this.key_construction_type = null
     this.project = {}
     this.quantityList = []
     this.quantityList = {}
     this.quantity_list_id = null
     this.status = null
     this.upFloor = null
     this.downFloor = null
     this.reportFiles = []
     this.fileIn = null
     this.listFiles = []  //存储文件列表
     this.fileId = null
     this.editProjects = {}
     this.editProjectArr = []
     this.radioType = null
  }

  // 删除
  deleteProject = (id) => {
    return post('/api/relation', {
        action: 'delete',
        model: 'project',
        id: id
      }).then(() => {
        toastr.info("项目删除成功")
        return true
      })
      .catch((err) => {
        toastr.error("项目删除失败")
        return false
      })
  }
  // 获取当前项目
  editProject = (id) => {
    return post('/api/relation', {
      action: 'query',
      model: 'project',
      id: id,
      relations: ['build_unit', 'ProjFeasibility']
    }).then(({
      data: p
    }) => {
        this.project = p
        this.projFeasibility = p.proj_feasibilitys[0]
        
      this.buildUnitproject = p.build_units[0].name
      if (p.projFeasibilitys && p.projFeasibilitys.length > 0) {
        this.projFeasibility = _.maxBy(p.projFeasibilitys, 'updated_at')
      }
    })
  }
  // 获取建筑
  loadBuildUnits = () => {
    return post('/api/relation', {
        action: 'query',
        model: 'build_unit',
        relations: []
      })
      .then(({
        data: units
      }) => this.buildUnits = units)
      .catch(err => toastr.error('获取建筑单位失败'))
  }
	// 取值
  loadProjects = () => {
  	
    return post('/api/relation', {
        action: 'query',
        model: 'Project',
        relations: ['BuildUnit']
      })
      .then(({
        data: projects
      }) => {
        // 从 history 中取出第一次的值
        let origProjects = []
        _.forEach(projects, function (p) {
          if (p.history && p.history.length > 0) {
            p.history[0].build_units = p.build_units
            origProjects.push(p.history[0])
          } else {
            origProjects.push(p)
          }
        })

        this.projects = origProjects
        this.filteredProjects = origProjects
      })
  }
  
 //过滤符合条件的项目名
  //&& (this.status == "" || p.construction_draws[0] != undefined || this.status == p.construction_draws[0].status)
  filterProjects = () => {
    this.filteredProjects = []
    _.forEach(this.projects, (p) => {
      if ((this.selectedProjectId == "" || this.selectedProjectId == p.name[0].id)){
        this.filteredProjects.push(p)
      }
    })
  }

  // 项目对象
   loadProject = () => {
   	console.log(this.selectedProjectId)
    return post('/api/relation', {
      action: 'query',
      model: 'Project',
      id: this.selectedProjectId,
      relations: ['BuildUnit']
    }).then(({data: p}) => {
        this.project = p
        console.log("xiangmu====="+JSON.stringify(this.project))
    })
  }
 
  // 保存
  createProject = () => {
  	console.log("baocun==="+JSON.stringify(this.project))
    const project = this.project
    console.log("0000======="+JSON.stringify(project))
    const projFeasibility = this.projFeasibility
    console.log("111"+JSON.stringify(projFeasibility))
    console.log("222"+JSON.stringify(project))
    projFeasibility.status = '就绪'
    return post('/api/relation/', {
        action: 'create',
        model: 'project',
        param: project,
        id: project.id,
        relations: [{
        	to_model: 'ProjFeasibility',
          to_params: [projFeasibility]
        }]
      }).then(({data: b}) => {
      	toastr.info("项目保存成功")
      	this.projFeasibility = b.proj_feasibilitys[0];
      	this.project = b;
      	console.log("111"+this.project.id)
      })
      .catch(err =>  toastr.error("项目保存失败"))
    
  }
  // edit提交
  updateProject = (status) => {
    const project = this.project
    project.status = status

    return post('/api/relation', {
        action: 'update',
        model: 'project',
        id: project.id,
        param: project,
        relations: [{
          action: 'replace',
          to_model: 'build_unit',
          to_id: this.buildUnitproject.name
        },{
        	action: 'replace',
          to_model: 'ProjFeasibility',
          to_id: this.projFeasibility.id
        }
        ]
      }).then(() => {
        toastr.info("项目更新成功")
        return true
      })
      .catch((err) => {
        toastr.error("项目更新失败")
        return false
      })
  }
  
  // 保存可行性研究与文件对应关系
  createProjFeasibilityFile = () => {
    const projFeasibilityProject = this.projFeasibilityProject
    return post('/api/relation/', {
        action: 'create',
        model: 'ProjFeasibility',
        id: projFeasibilityProject.id,
        relations: [{
        to_model: 'File',
        to_ids: [this.fileId]
      }]
      }).then(({data: pro}) => {
      })
    
  }
 // 审核
  verifyProjFeasibility = (a) => {
  	const project = this.project
    const projFeasibilityProject = this.projFeasibilityProject
    if(a == true){
    	 projFeasibilityProject.status = "审核通过"
    }else{
    	 projFeasibilityProject.status = "审核失败"
    }
    console.log("审核状态："+projFeasibilityProject.status);
    console.log("审核ID："+project.id);
    console.log("关联表："+JSON.stringify(this.projFeasibilityProject));
    return post('/api/relation', {
      action: 'update',
      model: 'project',
       id: project.id,
      relations: [{
        action: 'replace',
        to_model: 'ProjFeasibility',
        to_params: [projFeasibilityProject]
      }]
    }).then(() => {
    	
      toastr.info("审核信息更新成功")
      return true
    }).catch((err) => {
      toastr.error("审核信息更新失败")
      return false
    })
  }
}

export default new Store()
