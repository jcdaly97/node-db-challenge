const db = require('../data/dbConnect')

module.exports = {
    getProjects,
    getTasks,
    getResources,
    getProjectByID,
    getProjectTasks,
    getProjectResources,
    addProject,
    addTask,
    addResource,
    allocateResource
}

function getProjects(){
    return db('projects')
}

function getTasks(){
    return db('tasks as t')
        .join('projects as p', 't.project_id', 'p.id')
        .select('t.id', 'p.name', 't.description', 't.notes', 't.completed')
}

function getResources(){
    return db('resources')
}

function getProjectByID(id){
    return db('projects').where({id:id}).first()
}

function getProjectTasks(id){
    return db('tasks as t').where({project_id: id})
        .select('t.description', 't.notes', 't.completed')
}

function getProjectResources(id){
    return db('allocations as a').where({project_id: id})
        .join('resources as r', 'a.resource_id', 'r.id')
        .select('r.name', 'a.notes' )
} 

function addProject(project){
        return db('projects').insert(project)
        /*.then(newID=>{
                console.log(newID[0])
        })*/
}

function addTask(task){
    return db('tasks').insert(task)
        /*.then(newID=>{
            return getProjectTasks(task.project_id)
        })*/
}

function addResource(resource){
    return db('resources').insert(resource)
}

function allocateResource(allocation){
    return db('allocations').insert(allocation)
        /*.then(newId=>{
            return getProjectResources(allocation.project_id)
        })*/
}