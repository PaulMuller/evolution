import React, { useEffect, useState } from 'react'
import './App.css'
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import Victor from 'victor'
import { Predator, Herbivore, Food } from './FloraAndFauna'

const resolution = {
    x: 500,
    y: 500
}
const bugsCount = 3

export default () => {
    const [items, setItems] = useState({})

    useEffect(() => {
        const app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: false,
            backgroundColor: 0xbbbbbb,
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

                    item.move && item.move()
                    item.energy && (item.energy > 0 || terminate(item, viewport))
                })
            }

            Math.random() < .99 || spawn(new Food(resolution.x * Math.random(), resolution.y * Math.random()), viewport)
        })

        for (let i = 0; i < bugsCount; i++) {
            const item = new Predator(resolution.x * Math.random(), resolution.y * Math.random(), Victor(0, 1).rotate(Math.random() * 2 * Math.PI))
            spawn(item, viewport)
        }

        for (let i = 0; i < bugsCount; i++) {
            const item = new Herbivore(resolution.x * Math.random(), resolution.y * Math.random(), Victor(0, 1).rotate(Math.random() * 2 * Math.PI))
            spawn(item, viewport)
        }


        return () => document.body.removeChild(app.view)
    }, [])

    const spawn = (item, container) => {
        if (!items[item.constructor.name + 's']) setItems(items[item.constructor.name + 's'] = [])
        const itemsCopy = Object.assign({}, items) 
        itemsCopy[item.constructor.name + 's'].push(item)
        setItems(itemsCopy)
        container.addChild(item)
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
            {Object.keys(items).map( (key, i) => <p>{key}: {items[key].length}</p>)}
        </div>
    )
}








