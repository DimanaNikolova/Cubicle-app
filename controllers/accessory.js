const accessoryModel = require('../models/accessory')
const cubeModel = require('../models/cube')

function createPost(req, res, next) {
    const { name = null, description = null, imageUrl = null } = req.body
    accessoryModel.create({ name, description, imageUrl })
        .then(created => {
            res.redirect("/")
        }).catch(next)
}

function createGet(req, res, next) {
    res.render("createAccessory.hbs")
}

function attachPost(req, res, next) {
    const { id } = req.params
    const { accessory: accessoryId } = req.body
    Promise.all([
        cubeModel.update({ _id: id }, { $push: { accessories: accessoryId } }),
        accessoryModel.update({ _id: accessoryId }, { $push: { cubes: id } })
    ]).then(()=>{
        res.redirect("/")
    }).catch(next)
}


function attachGet(req, res, next) {
    const { id: cubeId } = req.params
    cubeModel.findById(cubeId)
        .then(cube =>
            Promise.all([cube, accessoryModel.find({ cubes: { $nin:cubeId } })])
            ).then(([cube, filteredAccessories]) => {
               if(filteredAccessories.length>0){
                res.render('attachAccessory.hbs', { cube, accessories: filteredAccessories})
               }
               else{
                res.render('attachAccessory.hbs', { cube, accessories: null})
               }
            }).catch(next)
       

}

module.exports = {
    createGet,
    createPost,
    attachGet,
    attachPost
}