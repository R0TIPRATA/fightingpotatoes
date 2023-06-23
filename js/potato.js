const Potato = class {
    constructor(id,color){
        this.id = id;
        this.color = color;
        this.maxHp = 200;
        this.hp = this.maxHp;
        this.attack = 0;
        this.keystrokeElementArr = [];
        this.activeKey = "";
        this.numRounds = 0;
        this.isPerfectCombo = true;
        this.numPerfectCombo = 0;
        this.multiplier = 1;
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

    set numRounds(numRounds){
        this._numRounds = numRounds;
    }
    get numRounds(){
        return this._numRounds;
    }

    set isPerfectCombo(isPerfectCombo){
        this._isPerfectCombo = isPerfectCombo;
    }
    get isPerfectCombo(){
        return this._isPerfectCombo;
    }

    set numPerfectCombo(numPerfectCombo){
        this._numPerfectCombo = numPerfectCombo;
    }
    get numPerfectCombo(){
        return this._numPerfectCombo;
    }

    set multiplier(multiplier){
        this._multiplier = multiplier;
    }
    get multiplier(){
        return this._multiplier;
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
    }

    resetPerfectCombo(){
        this.isPerfectCombo = false;
        this.multiplier = 1;
        this.numPerfectCombo = 0;
    }

    resetValues(){
        this.hp = this.maxHp;
        this.attack = 0;
        this.healthBar.updateHealth(this.maxHp);
        this.powerup = "";
        this.resetPerfectCombo();
        this.numRounds = 0;
    }

    // checkBonus(){
    //     let extraPoints = 0;
    //     this._numRounds < 3 ? extraPoints = 0 : this._numRounds < 5 ? extraPoints = 10 : this._numRounds < 7 ? extraPoints = 20 : extraPoints = 30;
    //     return extraPoints;
    // }
}


