const Powerup = class {
    constructor(id,name,imgSrc,imgDiv,descr,func){
        this.id = id,
        this.name = name,
        this.imgSrc = imgSrc,
        this.imgElement = createImg("powerup",imgSrc);
        this.imgDiv = this.appendKeyTip(imgDiv);
        this.descr = descr;
        this.func = func;
        this.activated = "";
        this.xIncr = 1;
        this.yIncr = 3;
        this.height = this.imgElement.offsetHeight;
        this.width = this.imgElement.offsetWidth;
        this.left = this.imgElement.offsetLeft; 
        this.top = this.imgElement.offsetTop - top_height;
        this.parentContainer = document.querySelector(".powerupbg");
    }

    set id(id){ 
        this._id = id;
    }
    get id(){
        return this._id;
    }

    set name(name){ 
        this._name = name;
    }
    get name(){
        return this._name;
    }

    set img(img){ 
        this._img = img;
    }
    get img(){
        return this._img;
    }
    set descr(descr){ 
        this._descr = descr;
    }
    get descr(){
        return this._descr;
    }
    set imgElement(imgElement){
        this._imgElement = imgElement;
    }
    get imgElement(){
        return this._imgElement;
    }

    set activated(activated){
        this._activated = activated;
    }
    get activated(){
        return this._activated;
    }

    set xIncr(xIncr){
        this._xIncr = xIncr;
    }
    get xIncr(){
        return this._xIncr
    }
    set yIncr(yIncr){
        this._yIncr = yIncr;
    }
    get yIncr(){
        return this._yIncr;
    }

    set height(height){
        this._height = height;
    }
    get height(){
        return this._height;
    }
    set width(width){
        this._width = width;
    }
    get width(){
        return this._width;
    }
    set left(left){
        this._left = left;
    }
    get left(){
        return this._left;
    }
    set top(top){
        this._top = top;
    }
    get top(){
        return this._top;
    }
    set parentContainer(parentContainer){
        this._parentContainer = parentContainer;
    }
    get parentContainer(){
        return this._parentContainer;
    }

    appendKeyTip(div){
        const keyTipImg = createImg("keytip-img",'./img/pressTip.png');
        div.append(this.imgElement,keyTipImg);
        return div;
    }

    init() {
        this.updateColor();
        this.imgElement.style.position = 'absolute';
        powerupInterval = setInterval((() => this.frame(this)), 5); //run frame every 5 ms
        hasPowerup = true;  
        latestPowerup = this;
    }

    updateColor() {
        const random = Math.floor((Math.random() * 2));
        potatoPowerupTarget = potatoes[random]; //select random potato
        this.imgElement.style.borderColor = potatoPowerupTarget.color;
        //console.log(JSON.stringify(potatoPowerupTarget));
    }

   handleCollision(powerup) {
        let left = powerup.imgDiv.offsetLeft; 
        //returns the number of pixels that the upper left corner of the current element is offset to the left within the HTMLElement.offsetParent node.
        const top_height = document.querySelector(".top").offsetHeight;
        let top = powerup.imgDiv.offsetTop - top_height;
        
        const container = document.querySelector(".powerupbg");
        let container_height = container.offsetHeight; 
        let container_width = container.offsetWidth;

        if (left <= 0 || left + powerup.width >= container_width) { //if doesnt got out of bound on left or on the right
          powerup.xIncr = powerup.xIncr * (-1);
        }
        if (top <= 0 || top + powerup.height >= container_height) { //if doesnt got out of bound on bottom or on the top
          powerup.yIncr = powerup.yIncr * (-1);
          powerup.updateColor();
        }
    }

    frame(powerup) { 
        powerup.handleCollision(powerup);
        powerup.imgDiv.style.top = powerup.imgDiv.offsetTop + powerup.yIncr + "px";
        powerup.imgDiv.style.left = powerup.imgDiv.offsetLeft + powerup.xIncr + "px";
    }

}
