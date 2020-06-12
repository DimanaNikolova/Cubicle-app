const fs = require('fs')
const path = require('path')


class CubeModel {
    constructor() {
        this.data = require('../config/database.json')
    }

    create(name, description, imageUrl, difficultyLevel) {
        return { name, description, imageUrl, difficultyLevel }
    }
    _write(newData, resolveData) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.resolve('config/database.json'), JSON.stringify(newData), (err) => {
                if (err) {
                    reject(err)
                    return;
                }
                this.data = newData;
                resolve(resolveData)
            })
        })
    }
    insert(newCube) {
        const newIndex = ++this.data.lastIndex
        newCube = { id: newIndex, ...newCube }
        const newData = {
            lastIndex: newIndex,
            entities: this.data.entities.concat(newCube)
        }
        return this._write(newData, newCube)
    }
    update(cubeId, updates) {

        const entityIndex = this.data.entities.findIndex(({ id }) => id === cubeId)
        const entity = this.data.entities[entityIndex]
        const updatedEntity = { ...entity, ...updates }

        const newData = {
            lastIndex: this.data.lastIndex,
            entities: [
                ...this.data.entities.slice(0, entityIndex),
                updatedEntity,
                ...this.data.entities.slice(entityIndex + 1)
            ]
        }
        return this._write(newData, updatedEntity)
    }
    delete(id) {
        const deleted = this.getOne(id)
        const newData = {
            lastIndex: this.data.lastIndex,
            entities: this.data.entities.filter(({ id: i }) => id !== i)
        }
        return this._write(newData, deleted)

    }
    find(pred) {
        return Promise.resolve(this.data.entities.filter(pred))
    }
    getOne(id) {
        return Promise.resolve(this.data.entities.find(({ id: i }) => i === id))
    }
    getAll() {
        return Promise.resolve(this.data.entities)
    }



}

module.exports = new CubeModel()