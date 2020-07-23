import {resolution, bugsCount, spawnableObjects} from './config'
import React, { useEffect, useState } from 'react'
import { Viewport } from 'pixi-viewport'
import * as PIXI from 'pixi.js'
import Victor from 'victor'
import './App.css'



export default () => {
    const [items, setItems] = useState({})

    useEffect(() => {
        const app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: false,
            backgroundColor: 0xDDDDDD,
            resolution: window.devicePixelRatio || 1,
            antialias: true
        })
        document.body.appendChild(app.view)

        const viewport = new Viewport({ interaction: app.renderer.plugins.interaction })
        viewport.moveCenter(resolution.x / 2, resolution.y / 2)
        viewport.drag().pinch().wheel().decelerate()
        app.stage.addChild(viewport)

        const border = new PIXI.Graphics()
        border.beginFill(0xaaaaaa)
        border.drawRect(0, 0, resolution.x, resolution.y)
        border.endFill()
        viewport.addChild(border)

        app.ticker.add(() => {
            for (const key in items) {
                items[key].forEach(item => {
                    if (item.x <= 0 || item.x >= resolution.x) item.vec.invertX()
                    if (item.y <= 0 || item.y >= resolution.y) item.vec.invertY()
                    if (item.x <= 0) item.x = 1
                    if (item.y <= 0) item.y = 1
                    if (item.x >= resolution.x) item.x = resolution.x -1
                    if (item.y >= resolution.y) item.y = resolution.y -1

                    item.move && item.move(items)
                    if (item.energy !== undefined){
                        if (item.energy <= 0 )terminate(item, viewport)
                        if (item.energy > item.energyToReplicate){
                            item.energy /= 2
                            const x = item.x
                            const y = item.y
                            const vec = item.vec.clone().invert()
                            const newSpeedModifier = (Math.random() - .5) /2
                            vec.x += newSpeedModifier
                            vec.y += newSpeedModifier

                            spawn(new spawnableObjects[item.constructor.name](x, y, vec),viewport)
                        }
                    }
                })
            }

            // Math.random() < .05 && spawn(new spawnableObjects['Plant'](resolution.x * Math.random(), resolution.y * Math.random()), viewport)
        })
        

        for (let i = 0; i < bugsCount; i++) 
            // spawn(new spawnableObjects['Herbivore'](resolution.x * Math.random(), resolution.y * Math.random(), Victor(0, .4).rotate(Math.random() * 2 * Math.PI)), viewport)
        
        // spawn(new spawnableObjects['Predator'](resolution.x * Math.random(), resolution.y * Math.random(), Victor(0, .2).rotate(Math.random() * 2 * Math.PI)), viewport)
        spawn(new spawnableObjects['Predator'](resolution.x /2, resolution.y, Victor(0, .3)), viewport)
        spawn(new spawnableObjects['Herbivore'](0, resolution.y /2, Victor(.4, 0)), viewport)
        spawn(new spawnableObjects['Plant'](resolution.x, resolution.y /2), viewport)

        return () => document.body.removeChild(app.view)
    }, [])

    const spawn = (item, container) => {
        if (!items[item.constructor.name + 's']) setItems(items[item.constructor.name + 's'] = [])
        const itemsCopy = Object.assign({}, items) 
        itemsCopy[item.constructor.name + 's'].push(item)
        setItems(itemsCopy)
        container.addChild(item)


        item.updateGenome != undefined && item.updateGenome()
    }

    const terminate = (item, container) => {
        if (!item && !container && !items[item.constructor.name + 's'])
            return console.error(`Bad value for termination: ${item} in container: ${container}`)
        
        const itemsCopy = Object.assign({}, items) 
        itemsCopy[item.constructor.name + 's'].splice(itemsCopy[item.constructor.name + 's'].indexOf(item), 1)
        setItems(itemsCopy)
        container.removeChild(item)
    }


    return (
        <div>
            {Object.keys(items).map( key => <p>{key}: {items[key].length}</p>)}
        </div>
    )
}











