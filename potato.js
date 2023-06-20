
const Potato = class {
    constructor(id,color){
        this.id = id;
        this.color = color;
        this.maxHp = 20;
        this.hp = this.maxHp;
        this.attack = 0;
        this.keystrokeElementArr = [];
        this.activeKey = "";
        this.div= "";
        this.powerup = ""; 
        this.powerupDiv = createDiv("potato-powerup","potato-powerup-" + this.id);
        this.healthBar = "";
    }

    set id(id){ 
        this._id = id;
    }
    get id(){
        return this._id;
    }

    set color(color){ 
        this._color = color;
    }
    get color(){
        return this._color;
    }

    set hp(hp){
        this._hp = hp;
    }
    get hp(){
        return this._hp;
    }

    set maxHp(maxHp){
        this._maxHp = maxHp;
    }
    get maxHp(){
        return this._maxHp;
    }

    set attack(attack){
        this._attack = attack;
    }
    get attack(){
        return this._attack;
    }

    set keystrokeElementArr(arr){
        this._keystrokeElementArr = arr;
    }
    get keystrokeElementArr(){
        return this._keystrokeElementArr;
    }

    set activeKey(activeKey){
        this._activeKey = activeKey;
    }
    get activeKey(){
        return this._activeKey;
    }

    set div(div){
        this._div = div;
    }
    get div(){
        return this._div;
    }

    set powerup(powerup){
        this._powerup = powerup;
    }
    get powerup(){
        return this._powerup;
    }

    set powerupDiv(powerupDiv){
        this._powerupDiv = powerupDiv;
    }
    get powerupDiv(){
        return this._powerupDiv;
    }

    set healthBar(healthBar){
        this._healthBar = healthBar;
    }
    get healthBar(){
        return this._healthBar;
    }

    usePowerup(){
        if(this.powerup.length <= 0){
            return;
        }else{
            this.powerup.func(this);
        }
        this.powerupDiv.remove();
    }

}

const HealthBar = class {
    constructor(x,y,w,h,maxHp){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.maxHp = maxHp;
        this.maxWidth = w;
        this.hp = maxHp;
    }

    show(context){
        context.lineWidth = 4;
        context.strokeStyle = "#333";
        context.fillStyle = "green";
        context.fillRect(this.x, this.y, this.w, this.h);
        context.strokeRect(this.x,this.y,this.maxWidth, this.h);
    }

    updateHealth(hp){
        if (hp < 0){hp = 0}
        this.health = hp;
        this.w = (hp/this.maxHp) * this.maxWidth;
    }
}


let potatoOne = new Potato(0,colorOne);
let potatoTwo = new Potato(1,colorTwo);
const potatoes = [potatoOne, potatoTwo]; //used for powerup functions

const resetValues = (potato) => {
    potato.hp = potato.maxHp;
    potato.healthBar.updateHealth(potato.maxHp);
}