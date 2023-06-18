const Potato = class {
    constructor(){
        this.id = 1;
        this.maxHp = 20;
        this.hp = this.maxHp;
        this.attack = 0;
        this.keystrokeElementArr = [];
        this.activeKey = "";
        this.div= "";
    }

    set id(id){ 
        this._id = id;
    }
    get id(){
        return this._id;
    }
}
const potato = new Potato();
//potato.id = 2;
console.log(JSON.stringify(potato));