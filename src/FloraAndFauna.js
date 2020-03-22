import * as PIXI from 'pixi.js'


export class Food extends PIXI.Sprite{
    constructor(x, y) {
        super(PIXI.Texture.from(require(`./assets/herbalFood.png`)))
        this.anchor.set(0.5)
        this.x = x
        this.y = y
        this.scale.set(.3)
    }
}

class Bug extends PIXI.Sprite {
    constructor(x, y, vec) {
        super(PIXI.Texture.from(require(`./assets/bug.png`)))
        this.anchor.set(0.5)
        this.vec = vec
        this.x = x
        this.y = y
        this.scale.set(.3)
        this.rotation = this.vec.direction()
        this.energy = 500
        
    }
    
    move() {  
        this.x += this.vec.x
        this.y += this.vec.y
        this.energy -= this.vec.length()
        this.rotation = this.vec.direction()
        this.vec.rotate((Math.random()-0.5)/10)
    }
}

export class Predator extends Bug{
    constructor(x, y, vec) {
        super(x, y, vec)
        this.texture = (PIXI.Texture.from(require(`./assets/predator.png`)))
        this.status = 'idle'
    }
}


export class Herbivore extends Bug{
    constructor(x, y, vec) {
        super(x, y, vec)
        this.texture = (PIXI.Texture.from(require(`./assets/herbivore.png`)))
        this.status = 'idle'
    }
}
