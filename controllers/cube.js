const cubeModel = require('../models/cube')

function index(req, res) {
    const { from, to, search } = req.query
    const findFn = item => {
        let result = true
        if (search) {
            result = item.name.toLowerCase().includes(search)
        }
        if (result && from) {
            result = +item.difficultyLevel >= +from
        }
        if (result && to) {
            result = +item.difficultyLevel <= +to
        }
        return result
    }

    cubeModel.find(findFn).then((cubes) => {
        res.render('index.hbs', { cubes })
    })

}
function details(req, res) {
    const id = Number(req.params.id)
    cubeModel.getOne(id).then((cube) => {
        if (!cube) {
            res.redirect('/not-found')
            return
        }
        res.render('details.hbs', { cube })
    })

}

function notFound(req, res) {
    res.render('404.hbs')
}
function about(req, res) {
    res.render('about.hbs')
}

function postCreate(req, res) {
    const { name, description, imageUrl, difficultyLevel } = req.body
    const newCube = cubeModel.create(name, description, imageUrl, difficultyLevel)
    cubeModel.insert(newCube).then((inserted) => {
        res.redirect('/')
    })
}

function getCreate(req, res) {
    res.render("create.hbs")
}
module.exports = {
    index,
    details,
    notFound,
    about,
    getCreate,
    postCreate
}