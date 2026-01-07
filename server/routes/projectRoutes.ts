import express from 'express'
import { protect } from '../middlewares/auth.js'
import { deleteProject, getProjectById, getProjectPreview, getPublishedprojects, makeRevision, rollbackToVersion, saveProjectCode } from '../controllers/projectControllers.js'



const Projectrouter=express.Router()

Projectrouter.post('/revision/:projectId',protect,makeRevision)
Projectrouter.put('/save/:projectId',protect,saveProjectCode)
Projectrouter.get('/rollback/:projectId/:versionId',protect,rollbackToVersion)
Projectrouter.delete('/:projectId',protect,deleteProject)
Projectrouter.get('/preview/:projectId',protect,getProjectPreview)
Projectrouter.get('/published',getPublishedprojects)
Projectrouter.get('/published/:projectId',getProjectById)

export  default Projectrouter

