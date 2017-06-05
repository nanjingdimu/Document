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
    this.listChangeFiles = []
    this.fileIn = null
    this.listFiles = []  //存储文件列表''
    this.fileInfoList = [] //存放文件信息列表
    this.fileId = null
    this.editProjects = {}
    this.editProjectArr = []
    this.radioTypeText = {}
    this.designId = null
  }

  reset() {
     this.buildUnits = []
     this.designId = null
     this.buildUnitproject = {}
     this.selectedBuildUnitId = null
     this.projFeasibility = {}
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
     this.listChangeFiles = []
     this.fileIn = null
     this.listFiles = []  //存储文件列表
     this.fileInfoList = [] //存放文件信息列表
     this.fileId = null
     this.editProjects = {}
     this.editProjectArr = []
     this.radioTypeText = {}
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
      relations: ['build_unit', 'ProjInitDesign']
    }).then(({
      data: p
    }) => {
    	this.designId = id //ID
      if (p.history && p.history.length > 0) {
        this.editProjects = p.history[0]
      } else {
        this.editProjects = p
      }
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
         this.designId =this.projects[0].id;
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

  
  // 保存
  createProject = () => {
    const project = this.project
    const projFeasibility = this.projFeasibility
    projFeasibility.status = '就绪'
    return post('/api/relation/', {
         action: 'create',
        model: 'Project',
        id: project.id,
        relations: [{
        	to_model: 'ProjFeasibility',
          to_param: projFeasibility
        }]
      }).then(({data: b}) => {
      	toastr.info("项目保存成功")
      	this.projFeasibility = b;
      	this.projects = b
      	//this.createProjFeasibilityFile()
      })
      .catch(err =>  toastr.error("项目保存失败"))
    
  }
  // edit提交
  updateProject = (status) => {
  	const designId = this.designId
  	const projects = this.projects
  	projects.proj_init_designs[0].status = status
    return post('/api/relation', {
        action: 'update',
        model: 'Project',
	      id: designId,
	      param:projects,
	      relations: []
	    }).then(() => {
        toastr.info("项目更新成功")
        return true
      })
      .catch((err) => {
        toastr.error("项目更新失败")
        return false
      })
  }
  
  
  		//上传
	uploadFile = (file) => {
		this.listFiles = []
		this.fileIn = file;
		return post('/api/relation', {
			action: 'create',
			model: 'File',
			id: file.id
		}).then(() =>{
    			this.listFiles.push(file)
    			this.reportFiles.push(file)
    			this.listChangeFiles.push(file)

    })
	}
   
    
     /**
     * 删除文件
     */
    deleteFile = (id) => {
     return post('/api/relation', {
        action: 'delete',
        model: 'File',
        id: id
      }).then(() => {
        toastr.info("文件删除成功")
        return true
      })
      .catch((err) => {
        toastr.error("文件删除失败")
        return false
      })
  }
    //查询
	loadFileInfo = (catalogInfo, detailInfo, orderInfo) => {
		this.listFiles = []
		return post('/api/relation', {
			action: 'query',
			model: 'ProjInitDesign',
			id: this.designId,
			relations: ['File']
		}).then(({
			data: arrayfiles
		}) => {
			_.forEach(arrayfiles.files, (f) => {
				if(f.info.catalog == catalogInfo && f.info.detail == detailInfo && f.info.order == orderInfo) {
					//将符合条件的文件加入
					this.listFiles.push(f)
				}
			})

		})
	}
    //保存
    createCostPay = () => {
	    const designId = this.designId
	    const designProject = {}
	    designProject.status = "就绪"
	    return post('/api/relation/', {
	      action: 'create',
	      model: 'Project',
	      id: designId,
	      relations: [
		        	{to_model: 'ProjInitDesign', to_params: [designProject]}
		        ]
	    }).then(({data:project}) => {
				//遍历支付上传的文件
				this.projects = project
				_.forEach(this.listChangeFiles,(p)=>{
		          	this.createCostPayToFile(project.proj_init_designs[0].id,p.id)
		      })
	      return true
	    }).catch((err) => {
	      return false
	    })
    }
    //创建支付与文件的关系
    createCostPayToFile = (id,fileId)=>{
	    	return post('/api/relation/', {
	      action: 'create',
	      model: 'ProjInitDesign',
	      id: id,
	      relations: [
	        {to_model: 'File', to_ids: [fileId]}
	      ]
	    }).then(() => {
	      toastr.info("保存关联关系信息成功")
	      return true
	    }).catch((err) => {
	        toastr.error("保存关联关系信息失败")
	        return false
	      })
    }
   
 // 审核
  verifyProjFeasibility = (a) => {
  	console.log(a)
  	const projects = this.projects
  	const designId = this.designId
  	console.log(JSON.stringify(projects))
    if(a == true){
  		projects.proj_init_designs[0].status = "审核通过"
  	}else{
  		projects.proj_init_designs[0].status = "审核失败"
  	}
    return post('/api/relation', {
      action: 'update',
      model: 'project',
      id: designId,
      param:projects,
      relations: ['ProjInitDesign']
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
