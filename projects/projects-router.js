const express = require('express')

const Projects = require('./projects-model')

const router = express.Router()

router.get('/', (req,res)=>{
    Projects.getProjects()
        .then(projects=>{
            res.status(200).json(projects)
        })
        .catch(err=>{
            res.status(500).json({ message: "Failed to retrieve data" })
        })
})

router.get('/:id', (req,res)=>{
    Projects.getProjectByID(req.params.id)
        .then(project=>{
            Projects.getProjectResources(req.params.id)
                .then(resources=>{
                    Projects.getProjectTasks(req.params.id)
                        .then(tasks=>{
                            res.status(200).json({
                                ...project,
                                tasks: tasks,
                                resources: resources
                            })
                        })
                        .catch(err => {
                            res.status(500).json({ message: "Failed to get tasks" });
                          })
                })
                .catch(err => {
                    res.status(500).json({ message: "Failed to get resources" });
                  })
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to get project" });
          })

})  

router.post('/', (req,res)=>{
    Projects.addProject(req.body)
        .then(newID=>{
            Projects.getProjectByID(newID[0])
                .then(proj=>{
                    res.status(200).json(proj)
                })
                .catch(err=>{
                    res.status(500).json({
                        message: 'error retrieving new project',
                        error: err
                    })
                })
        })
        .catch(err=>{
            res.status(500).json({
                message: 'error adding to db',
                error: err
            })
        })
})

router.post('/:id/tasks', (req,res)=>{
    const newTask = {
        ...req.body,
        project_id: req.params.id
    } 
    Projects.addTask(newTask)
        .then(newId=>{
            Projects.getProjectTasks(req.params.id)
                .then(tasks=>{
                    res.status(200).json(tasks)
                })
                .catch(err=>{
                    res.status(500).json({
                        message: 'error retrieving tasklist',
                        error: err
                    })
                })
        })
        .catch(err=>{
            res.status(500).json({
                message: 'error adding new task',
                error: err
            })
        })
})

router.post('/resources', (req,res)=>{
    Projects.addResource(req.body)
        .then(newID=>{
            res.status(200).json(newID)
        })
        .catch(err=>{
            res.status(500).json({
                message: 'error retrieving new resource',
                error: err
            })
        })
})

router.post('/:pID/resources/:rID', (req,res)=>{
    const allocation = {
        project_id: req.params.pID,
        resource_id: req.params.rID,
        ...req.body
    }
    Projects.allocateResource(allocation)
        .then(newID=>{
            Projects.getProjectResources(req.params.pID)
                .then(resources=>{
                    res.status(200).json(resources)
                })
                .catch(err=>{
                    res.status(500).json({
                        message: 'error retrieving new resource',
                        error: err
                    })
                })
        })
        .catch(err=>{
            res.status(500).json({
                message: 'error retrieving new resource',
                error: err
            })
        })
})

module.exports = router