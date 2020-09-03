import * as PIXI from 'pixi.js'
import Victor from 'victor'


export class Plant extends PIXI.Sprite{
    constructor(x, y) {
        super(PIXI.Texture.from(require(`./assets/herbalFood.png`)))
        this.anchor.set(0.5)
        this.x = x
        this.y = y
        this.scale.set(.3)
        this.energy = 100
        this.vec = new Victor(0, 0)
    }
}


class Bug extends PIXI.Sprite{
    constructor(x, y, vec) {
        super(PIXI.Texture.from(require(`./assets/bug.png`)))
        this.anchor.set(0.5)
        this.vec = vec
        this.x = x
        this.y = y
        this.scale.set(.5)
        this.rotation = this.vec.direction()
        this.energy = 500
        this.status = 'idle'
        this.viewRadius = 75
        this.energyToReplicate = 1000
        this.foodType = []
        this.dangerSource = []
        this.currentFood = undefined
        this.currentDanger = undefined
    }

    visibleFood(items){
        let arrayOfVisibleFood = []
        if (!items[this.foodType]) return arrayOfVisibleFood

        items[this.foodType].forEach( food => {
            let distance = Math.sqrt((food.x - this.x)**2 + (food.y - this.y)**2)
            if (distance <= this.viewRadius) arrayOfVisibleFood.push({distance, food})
        })

        arrayOfVisibleFood.sort( (firstEl, secondEl) => firstEl.distance - secondEl.distance)
        return arrayOfVisibleFood
    }

    visibleDanger(items){
        let arrayOfVisibleDanger = []
        if (!items[this.dangerSource]) return arrayOfVisibleDanger

        items[this.dangerSource].forEach( danger => {
            let distance = Math.sqrt((danger.x - this.x)**2 + (danger.y - this.y)**2)
            if (distance <= this.viewRadius)  arrayOfVisibleDanger.push({distance, danger})
        })
        
        arrayOfVisibleDanger.sort( (firstEl, secondEl) => firstEl.distance - secondEl.distance)
        return arrayOfVisibleDanger
    }
    
    move(items) {  
        this.x += this.vec.x
        this.y += this.vec.y
        this.energy -= this.vec.length()
        this.rotation = this.vec.direction()

                                                                                    
        this.currentFood = this.visibleFood !== undefined && this.visibleFood(items)
        // .filter(el => el.food.vec.magnitude() < this.vec.magnitude())
        .sort( (firstEl, secondEl) => firstEl.food.vec.magnitude() * firstEl.distance - secondEl.food.vec.magnitude() * secondEl.distance)[0]

        this.currentDanger =  this.visibleDanger !== undefined ? this.visibleDanger(items).filter(el => el.danger.vec.magnitude() > this.vec.magnitude())[0] : undefined

        // console.log(this.visibleDanger(items).filter(el => el.danger.vec.magnitude() > this.vec.magnitude())[0])

       
        //Area: instincts
        if (!this.currentFood && !this.currentDanger) this.status = 'idle'
        if ( this.currentFood && !this.currentDanger) this.status = 'moving_to_food'
        if (!this.currentFood &&  this.currentDanger) this.status = 'running_from_danger'
        if ( this.currentFood &&  this.currentDanger) this.status =  this.currentFood.distance < this.currentDanger.distance ? 'moving_to_food' : 'running_from_danger'
            


        //Area: brain
        if (this.status === 'moving_to_food' ){
            
        }

        switch (this.status) {
            case 'moving_to_food':
                const distanceToTarget = Victor(this.currentFood.food.x - this.x, this.currentFood.food.y - this.y).magnitude()
                const iterationsToArrive = distanceToTarget / this.vec.magnitude()
                const futurePointOfTarget = {
                    x: this.currentFood.food.x + this.currentFood.food.vec.clone().x * iterationsToArrive,
                    y: this.currentFood.food.y + this.currentFood.food.vec.clone().y * iterationsToArrive
                }

                const assaultVector = Victor(futurePointOfTarget.x - this.x, futurePointOfTarget.y - this.y)

                console.log({
                    distanceToTarget,
                    iterationsToArrive,
                    futurePointOfTarget,
                    assaultVector
                })

                this.vec.rotate((assaultVector.angle() - this.vec.angle()))
                // this.vec.rotate((Victor(this.currentFood.food.x - this.x, this.currentFood.food.y - this.y).angle() - this.vec.angle()))
                // this.vec.rotate(visibleFood[0].food.vec.clone().add(this.vec).angle())
                // this.vec.rotate((Victor(visibleFood[0].food.vec.clone().add(this.vec)).angle() - this.vec.angle()))
                break
            case 'running_from_danger':
                this.vec.rotate((Victor(this.currentDanger.danger.x - this.x, this.currentDanger.danger.y - this.y).angle() - this.vec.angle()))
                this.vec.rotate(Math.PI)
                this.vec.rotate((Math.random()-0.5)/8)
                break
            default:
                // this.vec.rotate((Math.random()-0.5)/10)
                break
        }
        
        if (this.currentFood){
            if (this.currentFood.distance <= 3){
                this.energy += this.currentFood.food.energy
                this.currentFood.food.energy = 0
            }
        }
    }

    updateGenome(){
        this.scale.set(1/(((this.vec.length() - 1 ) / 4) + 1) * .5)
    }
}

export class Predator extends Bug{
    constructor(x, y, vec) {
        super(x, y, vec)
        this.texture = (PIXI.Texture.from(require(`./assets/predator.png`)))
        this.energy = 5000
        this.energyToReplicate = 10000
        this.foodType = ['Herbivores']
        this.viewRadius = 150
    }
}


export class Herbivore extends Bug{
    constructor(x, y, vec) {
        super(x, y, vec)
        this.texture = (PIXI.Texture.from(require(`./assets/herbivore.png`)))
        this.energy = 500
        this.energyToReplicate = 1000
        this.foodType = ['Plants']
        this.dangerSource = ['Predators']
    }
}
