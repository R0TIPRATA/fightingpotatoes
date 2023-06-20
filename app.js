
//settings
const attackPower = 1; //damage taken per attack
const keystrokeNum = 10; //determines how many keys you want before attacking
const powerUpDurationLowerRange = 1;
const powerUpDurationUpperRange = 5; //power up will appear every 30 - 60 s
let hasPowerup = false;
let latestPowerup = "";
const colorOne = "#ff9933"; //to refactor
const colorTwo = "#4700b3" //to refactor
let potatoPowerupTarget = "";

//=====================
// Create HTML elements
// Functions used to create HTML elements.
//=====================
const createDiv = (className, id) => {
    const div = document.createElement("div");
    div.classList.add(className);
    if (id) div.id = id;
    return div;
}

const createImg = (className, src, id) => {
    const img = document.createElement("img");
    img.classList.add(className);
    if (src) img.setAttribute("src",src);
    if (id) img.id = id;
    return img;
}

const createButton = (className) => {
    const btn = document.createElement("button");
    //btn.innerText = className;
    btn.classList.add(className);
    return btn;
}

const createPotatoDiv = (potato) => {
    const div = document.createElement("div");
    div.classList.add("potato");
    div.id = "potato-" + potato.id;
    const img = document.createElement("img");
    potato.id === 0 ?  img.setAttribute("src","img/potato_knife.svg") : img.setAttribute("src","img/potato_knife2.svg");
    div.appendChild(img);
    //create hp bar
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.id = "health-bar-" + potato.id;
    canvas.width = 100;
    canvas.height = 20;
    canvas.style.backgroundColor = "pink"
    const width = canvas.width;
    const height = canvas.height;
    let health = potato.hp;
    const healthBarWidth = canvas.width;
    const healthBarHeight = canvas.height;
    const x = 0;
    const y = 0;

    const healthBar = new HealthBar(canvas.id, x, y, healthBarWidth, healthBarHeight, health);
    potato.healthBar = healthBar;

    const frame = () => {
        context.clearRect(0, 0, width, height);
        healthBar.show(context);
        requestAnimationFrame(frame);
    }

    frame();

    //end create hp bar
    //hide healthbar initially
    canvas.classList.add("hidden");
    div.appendChild(canvas);
    return div;
}

const createActionRowDiv = (potato) => {
    const actionRowDiv = createDiv("action-row", `action-row-${potato.id}`);
    const keySequenceDiv = createDiv("key-sequence", `key-sequence-${potato.id}`);
    const damageDiv = createDiv("damage-points", `damage-points-${potato.id}`);
    const damageHeader = document.createElement("p");
    damageHeader.innerText = "DAMAGE"
    const damageText = document.createElement("p");
    damageText.innerText = potato.attack;
    damageDiv.append(damageHeader,damageText);
    actionRowDiv.append(keySequenceDiv,damageDiv);
    return actionRowDiv;
}

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
        //this.powerupDiv.remove();
    }

}

const HealthBar = class {
    constructor(id,x,y,w,h,maxHp){
        this.id = id;
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


//=====================
// Screens 
// New screens are created based on events 
//(e.g. on load, title screen appears, clicking on play btn starts game, etc)  
//=====================

const titleScreen = () => {
    const top = document.querySelector(".top");
    const bottom = document.querySelector(".bottom");
    const titleScreen = document.createElement("div");
    titleScreen.classList.add("titleScreen");
    
    //add title 
    const titleImg = document.createElement("img");
    titleImg.classList.add("title-img");
    titleImg.setAttribute("src", "./img/title.svg");
    
    //make potato divs
    potatoOne.div = createPotatoDiv(potatoOne);
    potatoTwo.div = createPotatoDiv(potatoTwo);
    const potatoesWrapper = document.createElement("div");
    potatoesWrapper.classList.add("potatoes-wrapper");
    potatoesWrapper.append(potatoOne.div, potatoTwo.div);

    // add buttons
    const playBtn = createButton("play-btn");
    const helpBtn = createButton("help-btn");
    const settingsBtn = createButton("settings-btn");
    playBtn.addEventListener("click", playScreen);
    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.classList.add("buttons-wrapper");
    buttonsWrapper.append(helpBtn,playBtn,settingsBtn);

    //append all elements
    top.append(titleImg);
    bottom.append(potatoesWrapper, buttonsWrapper);

}

const playScreen = () => {
    document.querySelector(".buttons-wrapper") && document.querySelector(".buttons-wrapper").remove(); //if from title page, remove buttons
    const top = document.querySelector(".top");
    top.innerHTML = "";
    top.append(createActionRowDiv(potatoOne),createActionRowDiv(potatoTwo));
    
    //show healthBar
    document.querySelector("#" + potatoOne.healthBar.id).classList.remove("hidden");
    document.querySelector("#" + potatoTwo.healthBar.id).classList.remove("hidden");

    setKeystrokes(keystrokeNum,potatoOne);
    setKeystrokes(keystrokeNum,potatoTwo);

    //listen to keydown
    document.addEventListener("keydown", EventHandlers.onKeydown);

    //include powerup
    initPowerup();
}

const gameOverScreen = (winner) =>{
    document.removeEventListener("keydown",EventHandlers.onKeydown);
    //clear elements not needed
    const top = document.querySelector(".top");
    top.innerHTML = "";
    document.querySelector(".powerupbg").innerHTML="";
    //create elements for game over screen
    const resultsTextElement = document.createElement("h3");
    const potatoIndex = winner.id + 1;
    resultsTextElement.innerText = `Potato ${potatoIndex} wins!`;
    resultsTextElement.classList.add("winning-text");
    const replayBtn = createButton("replay-btn");
    replayBtn.addEventListener("click", playScreen);
    top.append(resultsTextElement,replayBtn);
    //reset potato stats
    //resetPotatoes();
    resetValues(potatoOne);
    resetValues(potatoTwo);
}    


//=====================
// Event handlers 
// 
//=====================

const EventHandlers = {
    onKeydown: (event) => {
        event.preventDefault(); //prevent space bar scrolling
        const potatoOneKeys = {actionKeys: ["w","a","s","d"], finalKey: " ", powerupKey:"c"};
        const potatoTwoKeys = {actionKeys: ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"], finalKey: "Enter", powerupKey: "/"};
        const input = event.key;
        console.log(input);
        if (potatoOne.keystrokeElementArr.length > 1 && potatoOneKeys.actionKeys.includes(input)) { validateKey(potatoOne, input); } //if keys are arrows, or enter
        if (potatoTwo.keystrokeElementArr.length > 1 && potatoTwoKeys.actionKeys.includes(input)) { validateKey(potatoTwo, input); }
        if (potatoOne.keystrokeElementArr.length === 1 && potatoOneKeys.finalKey === input){attackOpponent(potatoOne,potatoTwo)}; //potato 1 attacks potato 2
        if (potatoTwo.keystrokeElementArr.length === 1 && potatoTwoKeys.finalKey === input){attackOpponent(potatoTwo,potatoOne)};
        
        const powerupKey = "h";
        if(hasPowerup && input === powerupKey ){
            console.log(potatoPowerupTarget.id + "got the powerup!"); //success! correct potato shown
            potatoPowerupTarget.powerup = latestPowerup;
            //console.log( "potato-" + potatoPowerupTarget.id + " got " + potatoPowerupTarget.powerup.name);
            //display powerup
            potatoPowerupTarget.powerupDiv.innerHTML= "";
            const potatoPowerupDiv = potatoPowerupTarget.powerupDiv;
            const potatoPowerupImg = createImg("potato-powerup-img", latestPowerup.imgSrc, "potato-powerup-img-" + potatoPowerupTarget.id);
            console.log("img", potatoPowerupImg)
            //potatoPowerupImg.style.width = "20px";
            const potatoDiv = document.querySelector("#potato-" + potatoPowerupTarget.id );
            potatoDiv.appendChild(potatoPowerupDiv);
            potatoPowerupDiv.append(potatoPowerupImg);
            //remove powerup from container
            document.querySelector(".powerup").remove();
            latestPowerup = "";
            //after storing in potato, reinitiate powerup
            initPowerup();
            hasPowerup = false;  
        }

        if(potatoOneKeys.powerupKey === input ){potatoOne.usePowerup();}
        if(potatoTwoKeys.powerupKey === input ){potatoTwo.usePowerup();}   
        //bug: powerups get mixed up between the potatoes ):

    },
    // onKeydownPowerup: (event) => {
    //     const input = event.key;
    //     const powerupKey = "h";
    //     if(input === powerupKey ){
    //         console.log(potatoPowerupTarget.id + "got the powerup!");
    //     }
    // }
}


//=====================
// Validate keys
// Functions used to determine whether key is correct, or missed, or is the last key in the seq.
//=====================

const validateKey = (potato, input) =>{
    input === potato.activeKey ? setCorrect(potato, potato.keystrokeElementArr) : setMissed(potato, potato.keystrokeElementArr);
}

const setCorrect = (potato, keystrokeElementArr) => {
    const currentKeystroke = keystrokeElementArr[0];
    currentKeystroke.dataset.keystrokeStatus = "correct";
    potato.attack += attackPower;
    document.querySelector(`#damage-points-${potato.id}`).children[1].innerText = potato.attack; //updates damage box
    const nextKeystroke = keystrokeElementArr[1];
    console.log("next keystroke ", nextKeystroke);
    potato.activeKey = nextKeystroke.dataset.keystroke;
    console.log("new active key: " + potato.activeKey);
    nextKeystroke.dataset.keystrokeStatus = "active";
    potato.keystrokeElementArr.shift();
}

const setMissed = (potato, keystrokeElementArr) => {
    const currentKeystroke = keystrokeElementArr[0];
    currentKeystroke.dataset.keystrokeStatus = "missed";
    potato.keystrokeElementArr = keystrokeElementArr;
    //move on to the next key
    const nextKeystroke = keystrokeElementArr[1];
    potato.activeKey = nextKeystroke.dataset.keystroke;
    console.log("new active key: " + potato.activeKey);
    nextKeystroke.dataset.keystrokeStatus = "active";
    keystrokeElementArr.shift(); 
}

const attackOpponent = (attackingPotato, receivingPotato) => {
    //reduce receiving potato hp
    attackingPotato.attack += attackPower; //the last attack
    
    //check if got attackup powerup, increase final attack by 10%
    console.log("attacking potato:" + attackingPotato.id);
    console.log("attacking potato powerup:" + JSON.stringify(attackingPotato.powerup)); 

    console.log("receiving potato:" + receivingPotato.id);
    console.log("receiving potato powerup:" + receivingPotato.powerup.activated);
    if(attackingPotato.powerup.activated ==="Attack Up"){
        attackingPotato.attack = (attackingPotato.attack/100) * 120;
        attackingPotato.powerupDiv.remove();
        attackingPotato.powerup="";
        //console.log("attack! :" + attackingPotato.attack);
    }
    if(receivingPotato.powerup.activated ==="Shield"){
        attackingPotato.attack = (attackingPotato.attack/100) * 80;
        receivingPotato.powerupDiv.remove();
        receivingPotato.powerup="";
        //console.log("attack! :" + attackingPotato.attack);
    }

    //reduce hp in healthBar
    receivingPotato.hp -= attackingPotato.attack;
    receivingPotato.healthBar.updateHealth(receivingPotato.hp);
    attackingPotato.attack = 0; //set to 0 again for next sequence
    if(receivingPotato.hp <= 0) {
        //console.log("game ends!");
        gameOverScreen(attackingPotato);
    }else{
        clearKeystrokes(attackingPotato);
        setKeystrokes(10,attackingPotato);
    }
}

//=====================
// Set keys
// Functions used to create or clear key sequences.
//=====================

const setKeystrokes = (keystrokeNum,potato) => {
    const potatoIndex = potato.id;
    const keySequence = document.querySelector("#key-sequence-" + potatoIndex);
    const keystrokeArr = []; 
    const possibleKeys = [ {keystroke: ["w","ArrowUp"], icon: "./img/arrow-up.svg"}, {keystroke: ["s","ArrowDown"], icon: "./img/arrow-down.svg"}, {keystroke: ["a","ArrowLeft"], icon: "./img/arrow-left.svg"}, {keystroke: ["d","ArrowRight"], icon: "./img/arrow-right.svg"} ];
    for(let i = 1 ; i <= keystrokeNum; i++){
        const keystrokeElement = document.createElement("div");
        let selectedKey = possibleKeys[Math.floor(Math.random() * 4)]; //selected key 
        let selectedKeyValue = selectedKey.keystroke[potato.id];
        let keyStatus = "inactive";
        if (i===1) { //initalize first key
            keyStatus = "active";
            potato.activeKey = selectedKeyValue;
        };
        if (i===keystrokeNum) { //last key   
            potatoIndex === 0 ? selectedKey = {keystroke: " ", icon: "img/space.png"} : selectedKey = {keystroke: "enter", icon: "img/enter.png"}
            selectedKeyValue = selectedKey.keystroke;
        };
        keystrokeElement.classList.add("keystroke");
        keystrokeElement.setAttribute("data-keystroke",selectedKeyValue);
        keystrokeElement.setAttribute("data-keystroke-status",keyStatus);
        let keyIconElement = document.createElement("img");
        keyIconElement.setAttribute("src",selectedKey.icon);
        keystrokeElement.appendChild(keyIconElement);
        keystrokeArr.push(keystrokeElement);
    }
    //console.log(potato.keystrokeElementArr);
    potato.keystrokeElementArr = keystrokeArr;
    keystrokeArr.forEach(keystroke => keySequence.appendChild(keystroke));
}   

const clearKeystrokes = (potato) => {
    const keySequence = document.querySelector("#key-sequence-" + potato.id);
    keySequence.innerHTML = "";
    document.querySelector("#damage-points-" + potato.id ).children[1].innerText = 0;
}


// const resetValues = () => {
//     document.querySelector("#damage-points-0").children[1].innerText = 0;
//     document.querySelector("#damage-points-1").children[1].innerText = 0;
//     document.querySelector("#hp-0").innerText = potatoOne.hp;
//     document.querySelector("#hp-1").innerText = potatoTwo.hp;
// }

//=====================
// Powerup related functions
// 
//=====================
//create powerup
//powerup appears randomly, and can only appear one at a time

const Powerup = class {
    constructor(id,name,imgSrc,descr,func){
        this.id = id,
        this.name = name,
        this.imgSrc = imgSrc,
        this.imgDiv = createImg("powerup",imgSrc);
        this.descr = descr;
        this.func = func;
        this.activated = "";
        this.xIncr = 1;
        this.yIncr = 3;
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
    set imgDiv(imgDiv){
        this._imgDiv = imgDiv;
    }
    get imgDiv(){
        return this._imgDiv;
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
        return this._yIncr
    }

    init() {
        this.updateColor();
        this.imgDiv.style.position = 'absolute';
        setInterval((() => this.frame(this)), 10); //run frame every 5 ms
        hasPowerup = true;  
        latestPowerup = this;
    }

    updateColor() {
        //const colors = ["#ff9933","#4700b3"]; 
        //const random = Math.floor((Math.random() * 2));
        //let color = colors[random];
        //potatoPowerupTarget = potatoes.filter(potato => potato.color === color)[0];
        //select random potato
        const random = Math.floor((Math.random() * 2));
        potatoPowerupTarget = potatoes[random];
        this.imgDiv.style.borderColor = potatoPowerupTarget.color;

    }

   handleCollision(powerup) {
       // console.log("powerup properties: ", powerup.offsetHeight, powerup.offsetWidth,powerup.offsetLeft, powerup.offsetTop);
        let powerup_height = powerup.imgDiv.offsetHeight; 
        //offsetHeight returns the height of an element, including vertical padding and borders, as an integer
        let powerup_width = powerup.imgDiv.offsetWidth;
        let left = powerup.imgDiv.offsetLeft; 
        //returns the number of pixels that the upper left corner of the current element is offset to the left within the HTMLElement.offsetParent node.
        const top_height = document.querySelector(".top").offsetHeight;
        let top = powerup.imgDiv.offsetTop - top_height;
        
        const container = document.querySelector(".powerupbg");
        let win_height = container.offsetHeight; //window.innerHeight;
        let win_width = container.offsetWidth//window.innerWidth;
        // console.log("window properties: ", win_height,win_width);

        if (left <= 0 || left + powerup_width >= win_width) { //if doesnt got out of bound on left or on the right
          powerup.xIncr = ~powerup.xIncr + 1;
          //xIncr += xIncr;
          powerup.updateColor();
        }
        if (top <= 0 || top + powerup_height >= win_height) { //if doesnt got out of bound on bottom or on the top
          powerup.yIncr = ~powerup.yIncr + 1;
          //console.log("test2" + yIncr);
          //yIncr += 1;
          powerup.updateColor();
        }
    }

    frame(powerup) { 
        powerup.handleCollision(powerup);
        //top height
        //let top_height = document.querySelector(".top").offsetHeight;
        powerup.imgDiv.style.top = powerup.imgDiv.offsetTop + powerup.yIncr + "px";
        powerup.imgDiv.style.left = powerup.imgDiv.offsetLeft + powerup.xIncr + "px";
       // console.log("x", powerup.offsetTop);
       // console.log("y", powerup.offsetLeft)
    }

}

//get when powerup 


const initPowerup = () =>{ //rename this?
    //select random powerup
    console.log("hi");
    const powerups = [
        // {
        // id: 0,
        // name: "First Aid",
        // img: "./img/powerup-firstaid.png",
        // descr: "Increases HP by a random amount between 20 - 80.",
        // func: firstAid
        // },
        {
        id: 1,
        name: "Shield",
        img: "./img/powerup-shield.png",
        descr: "Reduce damage of opposing player’s next attack by 20%.",
        func: shield
        },
        // {
        // id: 2,
        // name: "Timewarp",
        // img: "./img/powerup-timewarp.png",
        // descr: "Delays opposing player’s moves for 5s.",
        // func: timeWarp
        // },
        {
        id: 3,
        name: "Attack Up",
        img: "./img/powerup-attackup.png",
        descr: "Increase damage of next attack by 10%.",
        func: attackUp
        },
    ];

    let randDelay = (Math.floor(Math.random() * (powerUpDurationUpperRange - powerUpDurationLowerRange)) + powerUpDurationLowerRange)  * 1000; 

    console.log("randDelay:" + randDelay);
    setTimeout(
        () => {
            const randPowerup = powerups[Math.floor(Math.random() * powerups.length)];
            const powerup = new Powerup(randPowerup.id, randPowerup.name, randPowerup.img, randPowerup.descr, randPowerup.func);
            const container = document.querySelector(".powerupbg");
            container.appendChild(powerup.imgDiv);
            document.querySelector('.bottom').appendChild(container);
            powerup.init();
        }    
        
    ,randDelay);
}

// const removePowerup = (powerup) => {
//     powerup.remove();
//     //remove event listener
//     //remove setInterval
// }

const firstAid = (potato) => {
    console.log("potato used first aid!");
    const max = 100;
    const min = 20;
    const addHealth = Math.floor(Math.random()*(max-min)) + min;
    potato.healthBar.updateHealth(addHealth);
    potato.powerup = "";
    potato.powerupDiv.remove();
} 

const shield = (potato) => {
    console.log("potato used shield!");
    activatePowerup(potato);
}

const timeWarp = (potato) => {
    console.log("potato used timewarp!");
    activatePowerup(potato);
}

const attackUp = (potato) => {
    console.log("potato used attack up!");
    activatePowerup(potato);
}

const activatePowerup = (potato) => {
    potato.powerup.activated = potato.powerup.name;
    document.querySelector("#potato-powerup-"+potato.id).children[0].style.borderColor = "red";
}
const render = () => {
    titleScreen();
}

render();

/*
RESOURCES:
1. Building Healthbar: https://www.youtube.com/watch?v=Wh2kVSPi_sE&t=454s
2. Bouncing animation: 
*/