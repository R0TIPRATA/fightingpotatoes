
//settings
const attackPower = 2; //damage taken per attack
const keystrokeNum = 10; //determines how many keys you want before attacking
const maxAttackPower = attackPower * keystrokeNum;
const powerUpDurationLowerRange = 1;
const powerUpDurationUpperRange = 5; //power up will appear every 1 - 5 s
let hasPowerup = false;
let latestPowerup = "";
const colorOne = "#ff9933"; //to refactor
const colorTwo = "#4700b3" //to refactor
let potatoPowerupTarget = "";
const top_height = document.querySelector(".top").offsetHeight;
let powerupInterval;
let gameOverInterval;

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

const createP = (className, id) => {
    const p = document.createElement("p");
    p.classList.add(className);
    if (id) p.id = id;
    return p;
}

const createImg = (className, src, id) => {
    const img = document.createElement("img");
    img.classList.add(className);
    if (src) img.setAttribute("src",src);
    if (id) img.id = id;
    return img;
}

const createButton = (className) => {
    const btn = document.createElement("button")
    btn.classList.add(className);
    return btn;
}

const showElement = (element) => {
    element.classList.remove("hidden");
}

const createPotatoDiv = (potato) => {
    // const div = document.createElement("div"); //this is the parent
    // div.classList.add("potato");
    // div.id = "potato-" + potato.id;
    const div = createDiv("potato", "potato-" + potato.id)
    const img = document.createElement("img");
    potato.id === 0 ?  img.setAttribute("src","img/potato_knife.svg") : img.setAttribute("src","img/potato_knife2.svg");

    //create potato avatar div which contains potato avatar and effects
    const potatoAvatarDiv = createDiv("potato-avatar", "potato-avatar-" + potato.id);
    //append img 
    potatoAvatarDiv.appendChild(img);

    //append effect (to change this, still testing)
    const effectSrc = "./img/effect-hit.png";
    const imgContainer = createImg("dmg-effect",effectSrc,"dmg-effect-"+potato.id);
    imgContainer.classList.add("hidden");
    potatoAvatarDiv.appendChild(imgContainer);

    //append potatoAvatar to div
    div.appendChild(potatoAvatarDiv);

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

    const potatoIdDiv = createDiv("potato-id-", `potato-id-${potato.id}`);
    const potatoIdElement = document.createElement("h3");
    potatoIdElement.innerText = "P" + (potato.id + 1);
    potatoIdDiv.appendChild(potatoIdElement);

    const damageDiv = createDiv("damage-points", `damage-points-${potato.id}`);
    const damageHeader = document.createElement("p");
    damageHeader.innerText = "DAMAGE"
    const damageText = document.createElement("p");
    damageText.innerText = potato.attack;
    damageDiv.append(damageHeader,damageText);
    actionRowDiv.append(potatoIdDiv,keySequenceDiv,damageDiv);
    return actionRowDiv;
}

const Potato = class {
    constructor(id,color){
        this.id = id;
        this.color = color;
        this.maxHp = 100;
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

    // checkBonus(){
    //     let extraPoints = 0;
    //     this._numRounds < 3 ? extraPoints = 0 : this._numRounds < 5 ? extraPoints = 10 : this._numRounds < 7 ? extraPoints = 20 : extraPoints = 30;
    //     return extraPoints;
    // }
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
    potato.powerup = "";
    potato.powerup.imgDiv = "";
    potato.resetPerfectCombo();
    potato.numRounds = 0;
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
    clearInterval(powerupInterval);
    clearTimeout(gameOverInterval);
    document.removeEventListener("keydown",EventHandlers.onKeydown);
    //clear elements not needed
    const top = document.querySelector(".top");
    top.innerHTML = "";
    document.querySelector(".powerupbg").innerHTML="";
    document.querySelectorAll(".potato-powerup").forEach( element => element.innerHTML = "");

    document.querySelector("#" + potatoOne.healthBar.id).classList.add("hidden");
    document.querySelector("#" + potatoTwo.healthBar.id).classList.add("hidden");
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
        if (potatoOne.keystrokeElementArr.length > 1 && potatoOneKeys.actionKeys.includes(input)) { validateKey(potatoOne, input); } //if keys are arrows, or enter
        if (potatoTwo.keystrokeElementArr.length > 1 && potatoTwoKeys.actionKeys.includes(input)) { validateKey(potatoTwo, input); }
        if (potatoOne.keystrokeElementArr.length === 1 && potatoOneKeys.finalKey === input){attackOpponent(potatoOne,potatoTwo)}; //potato 1 attacks potato 2
        if (potatoTwo.keystrokeElementArr.length === 1 && potatoTwoKeys.finalKey === input){attackOpponent(potatoTwo,potatoOne)};
        
        const powerupKey = "h";
        if(hasPowerup && input === powerupKey ){
            //handlePowerupCollision = false
            //console.log(potatoPowerupTarget.id + "got the powerup!");
            potatoPowerupTarget.powerup = latestPowerup;
            //display powerup
            potatoPowerupTarget.powerupDiv.innerHTML= "";
            const potatoPowerupDiv = potatoPowerupTarget.powerupDiv;
            const potatoPowerupImg = createImg("potato-powerup-img", latestPowerup.imgSrc, "potato-powerup-img-" + potatoPowerupTarget.id);
            //console.log("img", potatoPowerupImg)
            //potatoPowerupImg.style.width = "20px";
            const potatoDiv = document.querySelector("#potato-" + potatoPowerupTarget.id );
            potatoDiv.appendChild(potatoPowerupDiv);
            //powerupDiv should append message element as well
            let usePowerupKey;
            potatoPowerupTarget.id === 0 ? usePowerupKey = "c" : usePowerupKey = "/";
            const tipDiv = createDiv("use-powerup-tip", "use-powerup-tip-" + potatoPowerupTarget.id);
            tipDiv.innerHTML = `Press "${usePowerupKey}" key to use powerup.`

            potatoPowerupDiv.append(potatoPowerupImg,tipDiv);
            //remove powerup from container
            //have to destroy the current powerup
            document.querySelector(".powerup-div").remove();
            clearInterval(powerupInterval);
            potatoPowerupTarget = "";
            latestPowerup = "";

            //after storing in potato, reinitiate powerup
            initPowerup();
            //make handlePowerupCollision = true
            hasPowerup = false;  
        }

        if(potatoOneKeys.powerupKey === input ){potatoOne.usePowerup();}
        if(potatoTwoKeys.powerupKey === input ){potatoTwo.usePowerup();}   
        //bug: powerups get mixed up between the potatoes ):

    }
}


//=====================
// Validate keys
// Functions used to determine whether key is correct, or missed, or is the last key in the seq.
//=====================

const validateKey = (potato, input) =>{
    input === potato.activeKey ? setCorrect(potato, potato.keystrokeElementArr) : setMissed(potato, potato.keystrokeElementArr);
}

//count if correct == 9 
const setCorrect = (potato, keystrokeElementArr) => {
    const currentKeystroke = keystrokeElementArr[0];
    currentKeystroke.dataset.keystrokeStatus = "correct";
    potato.attack += attackPower;
    const damageValueElement = document.querySelector(`#damage-points-${potato.id}`).children[1];
    damageValueElement.innerText = potato.attack; //updates damage box
    scaleAnimate(damageValueElement)
    const nextKeystroke = keystrokeElementArr[1];
    potato.activeKey = nextKeystroke.dataset.keystroke;
    nextKeystroke.dataset.keystrokeStatus = "active";
    potato.keystrokeElementArr.shift();
}


const setMissed = (potato, keystrokeElementArr) => {
    potato.resetPerfectCombo();
    const currentKeystroke = keystrokeElementArr[0];
    currentKeystroke.dataset.keystrokeStatus = "missed";
    potato.keystrokeElementArr = keystrokeElementArr;
    //move on to the next key
    const nextKeystroke = keystrokeElementArr[1];
    potato.activeKey = nextKeystroke.dataset.keystroke;
    nextKeystroke.dataset.keystrokeStatus = "active";
    keystrokeElementArr.shift(); 
}


const attackOpponent = (attackingPotato, receivingPotato) => {
    //reduce receiving potato hp
    attackingPotato.attack += attackPower; //the last attack
    document.querySelector("#damage-points-" + attackingPotato.id ).children[1].innerText = attackingPotato.attack;
    
    //check if got attackup powerup, increase final attack by 10%
    // console.log("attacking potato:" + attackingPotato.id);
    // console.log("attacking potato powerup:" + JSON.stringify(attackingPotato.powerup)); 

    // console.log("receiving potato:" + receivingPotato.id);
    // console.log("receiving potato powerup:" + receivingPotato.powerup.activated);
    if(attackingPotato.powerup.activated ==="Attack Up"){
        attackingPotato.attack = Math.round((attackingPotato.attack/100) * 120);
        // attackingPotato.powerupDiv.remove();
        // attackingPotato.powerup="";
        //console.log("attack! :" + attackingPotato.attack);
    }
    if(receivingPotato.powerup.activated ==="Shield"){
        attackingPotato.attack = Math.round((attackingPotato.attack/100) * 80);
        // receivingPotato.powerupDiv.remove();
        // receivingPotato.powerup="";
        //console.log("attack! :" + attackingPotato.attack);
    }

    attackingPotato.isPerfectCombo && attackingPotato.numPerfectCombo++;

    //determine multiplier
    //if 1 set complete x 1.5
    if(attackingPotato.numPerfectCombo == 1){
        attackingPotato.multiplier = 1.5;
    }else if(attackingPotato.numPerfectCombo == 3){
        attackingPotato.multiplier = 2.5;
    }else if(attackingPotato.numPerfectCombo == 5){
        attackingPotato.multiplier = 3;
    }

    //console.log("multiplier: " + attackingPotato.multiplier);

    //show attack!
    attackingPotato.id == 0 ? moveRightAnimate(attackingPotato.div) : moveLeftAnimate(attackingPotato.div);
    attackingPotato.attack = Math.round(attackingPotato.attack * attackingPotato.multiplier);
    //console.log("Checking if attack is a round number: " + attackingPotato.attack);
    showBigDamage(attackingPotato.attack,receivingPotato,attackingPotato);
    attackingPotato.numRounds++; 

    //reduce hp in healthBar
    receivingPotato.hp -= attackingPotato.attack;
    receivingPotato.healthBar.updateHealth(receivingPotato.hp);
    //attackingPotato.attack = 0;
    //setTimeout(() => {attackingPotato.attack = 0} , 1000);


    if(attackingPotato.powerup.activated ==="Attack Up"){
        attackingPotato.powerupDiv.remove();
        attackingPotato.powerup="";
        //console.log("attack! :" + attackingPotato.attack);
    }
    if(receivingPotato.powerup.activated ==="Shield"){
        receivingPotato.powerupDiv.remove();
        receivingPotato.powerup="";
        //console.log("attack! :" + attackingPotato.attack);
    }
    


    //set to 0 again for next sequence
    //for a certain number of rounds, award points
    //console.log("Attacking potato rounds: " + attackingPotato.numRounds);
    //console.log("Attacking potato bonus: " + attackingPotato.checkBonus());
    //attackingPotato.attack += attackingPotato.checkBonus();
    
    if(receivingPotato.hp <= 0) {
        gameOverInterval = setTimeout(() => gameOverScreen(attackingPotato),100);
        //clearTimeout(timeOut);
    }else{
        setTimeout(() => 
        {   clearKeystrokes(attackingPotato);
            setKeystrokes(10,attackingPotato);
        } 
        , 1000);
    }
}

//=====================
// Set keys
// Functions used to create or clear key sequences.
//=====================

const setKeystrokes = (keystrokeNum,potato) => {
    const potatoIndex = potato.id;
    const keySequence = document.querySelector("#key-sequence-" + potatoIndex);
    //keySequence.classList.add("slide-in-animate");
    slideInAnimate(keySequence);
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
    potato.keystrokeElementArr = keystrokeArr;
    keystrokeArr.forEach(keystroke => keySequence.appendChild(keystroke));
}   

const clearKeystrokes = (potato) => {
    const keySequence = document.querySelector("#key-sequence-" + potato.id);
    keySequence.innerHTML = "";
    potato.attack = 0;
    document.querySelector("#damage-points-" + potato.id ).children[1].innerText = potato.attack;
    potato.isPerfectCombo = true;
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

    // initializePowerUpDimensions(){
    //     this.height = this.imgDiv.offsetHeight;
    //     this.width = this.imgDiv.offsetWidth;
    //     this.left = this.imgDiv.offsetLeft; 
    //     this.top = this.imgDiv.offsetTop - top_height;
    // }
    appendKeyTip(div){
        const keyTipImg = createImg("keytip-img",'./img/pressTip.png');
        div.append(this.imgElement,keyTipImg);
        return div;
    }

    init() {
        //console.log(1);
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
        //if handlePowerupCollision is false, do not change the color

        // console.log("powerup properties: ", powerup.offsetHeight, powerup.offsetWidth,powerup.offsetLeft, powerup.offsetTop);
        //let powerup_height = powerup.imgDiv.offsetHeight; 
        //offsetHeight returns the height of an element, including vertical padding and borders, as an integer
        //let powerup_width = powerup.imgDiv.offsetWidth;
        let left = powerup.imgDiv.offsetLeft; 
        //returns the number of pixels that the upper left corner of the current element is offset to the left within the HTMLElement.offsetParent node.
        const top_height = document.querySelector(".top").offsetHeight;
        let top = powerup.imgDiv.offsetTop - top_height;
        
        const container = document.querySelector(".powerupbg");
        let container_height = container.offsetHeight; //window.innerHeight;
        let container_width = container.offsetWidth//window.innerWidth;
        // console.log("window properties: ", win_height,win_width);

        if (left <= 0 || left + powerup.width >= container_width) { //if doesnt got out of bound on left or on the right
          powerup.xIncr = ~powerup.xIncr + 1;
          //xIncr += xIncr;
          //powerup.updateColor();
          //console.log("hey1");
        }
        if (top <= 0 || top + powerup.height >= container_height) { //if doesnt got out of bound on bottom or on the top
          powerup.yIncr = ~powerup.yIncr + 1;
          //console.log("test2" + yIncr);
          //yIncr += 1;
          powerup.updateColor();
          //console.log(4);
          //console.log("hey2");
        }
    }

    frame(powerup) { 
        powerup.handleCollision(powerup);
        //top height
        //let top_height = document.querySelector(".top").offsetHeight;
        powerup.imgDiv.style.top = powerup.imgDiv.offsetTop + powerup.yIncr + "px";
        powerup.imgDiv.style.left = powerup.imgDiv.offsetLeft + powerup.xIncr + "px";
        //console.log("x", powerup.yIncr);
        //console.log("y", powerup.xIncr)
    }

}

//get when powerup 


const initPowerup = () =>{ //rename this?
    //select random powerup
    const powerups = [
        {
        id: 0,
        name: "First Aid",
        img: "./img/powerup-firstaid.png",
        imgDiv: () => createDiv("powerup-div"),
        descr: "Increases HP by a random amount between 20 - 80.",
        func: firstAid
        },
        {
        id: 1,
        name: "Shield",
        img: "./img/powerup-shield.png",
        imgDiv: () => createDiv("powerup-div"),
        descr: "Reduce damage of opposing player’s next attack by 20%.",
        func: shield
        },
        // {
        // id: 2,
        // name: "Timewarp",
        // img: "./img/powerup-timewarp.png",
        //imgDiv: () => createDiv("powerup-div),
        // descr: "Delays opposing player’s moves for 5s.",
        // func: timeWarp
        // },
        {
        id: 3,
        name: "Attack Up",
        img: "./img/powerup-attackup.png",
        imgDiv: () => createDiv("powerup-div"),
        descr: "Increase damage of next attack by 10%.",
        func: attackUp
        },
    ];

    let randDelay = (Math.floor(Math.random() * (powerUpDurationUpperRange - powerUpDurationLowerRange)) + powerUpDurationLowerRange)  * 1000; 

    console.log("randDelay:" + randDelay);
    setTimeout(
        () => {
            potatoPowerupTarget = "";
            const randPowerup = powerups[Math.floor(Math.random() * powerups.length)];
            
            let powerup = new Powerup(randPowerup.id, randPowerup.name, randPowerup.img, randPowerup.imgDiv(), randPowerup.descr, randPowerup.func);


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
    const max = 100;
    const min = 20;
    const addHealth = potato.hp + Math.floor(Math.random()*(max-min)) + min;
    //console.log(addHealth);
    potato.healthBar.updateHealth(addHealth);
    potato.powerup = "";
    potato.powerupDiv.remove();
} 

const shield = (potato) => { //need to refactor
    activatePowerup(potato);
}

const timeWarp = (potato) => {
    activatePowerup(potato);
}

const attackUp = (potato) => {
    activatePowerup(potato);
}

const activatePowerup = (potato) => {
    potato.powerup.activated = potato.powerup.name;
    const tipDiv = document.querySelector("#use-powerup-tip-" + potato.id)
    if(potato.powerup.activated !== "First Aid"){
        tipDiv.innerHTML = potato.powerup.activated + " is in effect!"
    }
    document.querySelector("#potato-powerup-"+potato.id).children[0].style.borderColor = "red";
}

/*
---------------
Special effects
---------------
*/
const showCollectedDmg = (damage) => {
    //create an element
    const p = document.createElement("p");
    p.className = "collected-dmg";
    damage !== 0 ? p.innerText = "-" + damage : p.innerText = damage;

    //delete the element
    //p.remove();
}

const showBigDamage = (damage,receivingPotato, attackingPotato) => {
    const dmgEffect = document.querySelector("#dmg-effect-"+receivingPotato.id);
    showElement(dmgEffect);
    const potatoAvatar =  document.querySelector("#potato-avatar-"+receivingPotato.id);
    //create a parent div
    const parent = createDiv("dmg-details","dmg-details-"+receivingPotato.id);

    //create damage points element
    const damagePointsElement = createP("dmg-points");
    damagePointsElement.innerText = "-" + damage;
    parent.appendChild(damagePointsElement);

    //if contain multiplier, show multiplier text
    const multiplierElement = createDiv("show-multiplier-text");
    if(attackingPotato.multiplier > 1){
        const subText1 = createP("subtext1");
        const subText2 = createP("subtext2");
        subText1.innerText = "Perfect!"; 
        subText2.innerText = attackingPotato.multiplier + " multiplier damage"; 
        multiplierElement.append(subText1,subText2);
        parent.appendChild(multiplierElement);
    }

    //if there is powerup applied, include
    const powerupEffectElement = createP("show-powerup-text");
    if(receivingPotato.powerup.activated === "Shield"){
        powerupEffectElement.innerText = "Shield used! -20% damage";
        parent.appendChild(powerupEffectElement);
    }else if(attackingPotato.powerup.activated === "Attack Up"){
        powerupEffectElement.innerText = "Attack up used! +20% damage";
        parent.appendChild(powerupEffectElement);
    }

    potatoAvatar.append(parent);
    setTimeout( () => {
        dmgEffect.classList.add("hidden");
        parent.remove();
    },1000);
}

const showBigDamageOriginal = (damage,receivingPotato, attackingPotato) => {
    const potatoAvatar =  document.querySelector("#potato-avatar-"+receivingPotato.id);
    const dmgEffect = document.querySelector("#dmg-effect-"+receivingPotato.id);//createImg("dmg-effect",src,"dmg-effect-"+receivingPotato.id);
    showElement(dmgEffect);

    const damageElement = document.createElement("p");
    damageElement.className = "big-dmg";
    damageElement.innerText = "-" + damage;
    potatoAvatar.append(damageElement);

    //console.log("testing multiplier value: " + attackingPotato.multiplier);
    const multiplierElement = document.createElement("p");
    multiplierElement.className="show-multiplier-text";
    if(attackingPotato.multiplier > 1){
        multiplierElement.innerText ="Perfect! " + attackingPotato.multiplier + " multiplier damage" ;
        potatoAvatar.append(multiplierElement);
    }
    
    const powerupEffectElement = document.createElement("p");
    powerupEffectElement.className="show-powerup-text";
    if(receivingPotato.powerup.activated === "Shield"){
        powerupEffectElement.innerText = "Shield used! -20% damage";
        potatoAvatar.append(powerupEffectElement);
    }else if(attackingPotato.powerup.activated === "Attack Up"){
        powerupEffectElement.innerText = "Attack up used! +20% damage";
        potatoAvatar.append(powerupEffectElement);
    }

    // setTimeout( () => {
    //     dmgEffect.classList.add("hidden");
    //     multiplierElement.remove();
    //     damageElement.remove();
    //     powerupEffectElement.remove();
    // },1000);
}


function slideInAnimate(element){ 
    element.classList.add('slide-in-animate');
    setTimeout(()=> {
      element.classList.remove('slide-in-animate')
    },500)
}

function scaleAnimate(element){ 
    element.classList.add('collectDamage-animate');
    setTimeout(()=> {
      element.classList.remove('collectDamage-animate')
    },500)
}

function moveRightAnimate(element){ 
    element.classList.add('move-right-animate');
    setTimeout(()=> {
      element.classList.remove('move-right-animate')
    },500)
}

function moveLeftAnimate(element){ 
    element.classList.add('move-left-animate');
    setTimeout(()=> {
      element.classList.remove('move-left-animate')
    },500)
}


//check whether sequence is a perfect combination
//if perfect combination, increase damage
//show this effect  (DONE and shown effect)


//check if on nth round on keyboard sequence
//if on nth round, reflect multiplier effect
//show multiplier effect (DONE and shown effect)

//fix bug on powerup (DONE)


//add sprite animation

//improve potato distance UI (Let's ignore this for now)

//add music

//include instructions

//include settings?

//start on Github writeup


/*
----------------
Render
----------------
*/

const render = () => {
    titleScreen();
}

render();


/*
RESOURCES:
1. Building Healthbar: https://www.youtube.com/watch?v=Wh2kVSPi_sE&t=454s
2. Bouncing animation: 
3. Animation: https://unused-css.com/blog/css-shake-animation/
*/