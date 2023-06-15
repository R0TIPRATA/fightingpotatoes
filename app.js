//settings
const attackPower = 1; //damage taken per attack
const keystrokeNum = 10; //determines how many keys you want before attacking

const Potato = class {
    constructor(id){
        this._id = id;
        this._maxHp = 20;
        this._hp = this._maxHp;
        this._attack = 0;
        this._keystrokeElementArr = [];
        this._activeKey = "";
        this._div= "";
    }

    set id(id){
        this._id = id;
    }
    get id(){
        return this._id;
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

    set id(id){
        this._id = id;
    }
    get id(){
        return this._id;
    }

    set div(div){
        this._div = div;
    }
    get div(){
        return this._div;
    }

    set healthBar(healthBar){
        this._healthBar = healthBar;
    }
    get healthBar(){
        return this._healthBar;
    }

}

const HealthBar = class {
    constructor(x,y,w,h,maxHp){
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this._maxHp = maxHp;
        this._maxWidth = w;
        this._hp = maxHp;
    }

    show(context){
        context.lineWidth = 4;
        context.strokeStyle = "#333";
        context.fillStyle = "green";
        context.fillRect(this._x, this._y, this._w, this._h);
        context.strokeRect(this._x,this._y,this._maxWidth, this._h);
    }

    updateHealth(hp){
        if (hp < 0){hp = 0}
        this._health = hp;
        this._w = (hp/this._maxHp) * this._maxWidth;
    }
}


let potatoOne = new Potato(0);
let potatoTwo = new Potato(1);

const resetValues = (potato) => {
    potato.hp = potato.maxHp;
    potato.healthBar.updateHealth(potato.maxHp);
}

const render = () => {
    titleScreen();
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
    potatoesWrapper.append(potatoOne.div,potatoTwo.div);

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

    setKeystrokes(keystrokeNum,potatoOne);
    setKeystrokes(keystrokeNum,potatoTwo);
    //resetValues();
    //listen to keydown
    document.addEventListener("keydown", EventHandlers.onKeydown);
}

const gameOverScreen = (winner) =>{
    document.removeEventListener("keydown",EventHandlers.onKeydown);
    //clear elements not needed
    const top = document.querySelector(".top");
    top.innerHTML = "";
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
        const potatoOneKeys = {actionKeys: ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"], finalKey: "Enter"};
        const potatoTwoKeys = {actionKeys: ["w","a","s","d"], finalKey: " "};
        const input = event.key;
        console.log(input);
        if (potatoOne.keystrokeElementArr.length > 1 && potatoOneKeys.actionKeys.includes(input)) { validateKey(potatoOne, input); } //if keys are arrows, or enter
        if (potatoTwo.keystrokeElementArr.length > 1 && potatoTwoKeys.actionKeys.includes(input)) { validateKey(potatoTwo, input); }
        if (potatoOne.keystrokeElementArr.length === 1 && potatoOneKeys.finalKey === input){attackOpponent(potatoOne,potatoTwo)}; //potato 1 attacks potato 2
        if (potatoTwo.keystrokeElementArr.length === 1 && potatoTwoKeys.finalKey === input){attackOpponent(potatoTwo,potatoOne)};
    }
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
    //console.log("receiving potato ", receivingPotato.id);
    //console.log("attacking potato ", attackingPotato.id);
    //console.log("potato " + receivingPotato.id + " hp: " + receivingPotato.hp);
    attackingPotato.attack += attackPower; //the last attack
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
    const possibleKeys = [ {keystroke: ["ArrowUp","w"], icon: "./img/arrow-up.svg"}, {keystroke: ["ArrowDown","s"], icon: "./img/arrow-down.svg"}, {keystroke: ["ArrowLeft","a"], icon: "./img/arrow-left.svg"}, {keystroke: ["ArrowRight","d"], icon: "./img/arrow-right.svg"} ];
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
            potatoIndex === 0 ? selectedKey = {keystroke: "Enter", icon: "img/enter.png"} : selectedKey = {keystroke: " ", icon: "img/space.png"}
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
const createPowerup = () => { //WIP
    /* List of powerups
    1. First aid
    2. Shield
    3. Time-warper
    4. Attack-up
    */
    const powerUp = document.createElement("img");
    const powerUps = [
        {name: " ",
        img: " ",
        description: " "
        },
    ];
    powerUp.setAttribute("src",)
}


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

const createButton = (className) => {
    const btn = document.createElement("button");
    btn.innerText = className;
    btn.classList.add(className);
    return btn;
}

const createPotatoDiv = (potato) => {
    const div = document.createElement("div");
    div.classList.add("potato");
    div.id = potato.id;
    const img = document.createElement("img");
    img.setAttribute("src","img/potato_knife.svg");
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

    const healthBar = new HealthBar(x, y, healthBarWidth, healthBarHeight, health);
    potato.healthBar = healthBar;

    const frame = () => {
        context.clearRect(0, 0, width, height);
        healthBar.show(context);
        requestAnimationFrame(frame);
    }

    frame();
    //end create hp bar

    div.appendChild(canvas);
    return div;
}

const createActionRowDiv = (potato) => {
    const actionRowDiv = createDiv("action-row", `action-row-${potato.id}`);
    const keySequenceDiv = createDiv("key-sequence", `key-sequence-${potato.id}`);
    const damageDiv = createDiv("damage-points", `damage-points-${potato.id}`);
    const damageHeader = document.createElement("p");
    damageHeader.innerText = "Damage"
    const damageText = document.createElement("p");
    damageText.innerText = potato.attack;
    damageDiv.append(damageHeader,damageText);
    actionRowDiv.append(keySequenceDiv,damageDiv);
    return actionRowDiv;
}

/*
RESOURCES:
1. Building Healthbar: https://www.youtube.com/watch?v=Wh2kVSPi_sE&t=454s

*/
