
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