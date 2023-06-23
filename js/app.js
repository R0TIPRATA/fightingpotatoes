
let potatoOne = new Potato(0,colorOne);
let potatoTwo = new Potato(1,colorTwo);
const potatoes = [potatoOne, potatoTwo]; //used for powerup functions

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
    //const helpBtn = createButton("help-btn");
    //const settingsBtn = createButton("settings-btn");
    playBtn.addEventListener("click", playScreen);
    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.classList.add("buttons-wrapper");
    buttonsWrapper.appendChild(playBtn);
    //buttonsWrapper.append(helpBtn,playBtn,settingsBtn);

    //append all elements
    top.append(titleImg);
    bottom.append(potatoesWrapper, buttonsWrapper);

}

const playScreen = () => {
    //animate potato avatars
    jumpingZeroAnimate(document.querySelector("#potato-avatar-0"));
    jumpingOneAnimate(document.querySelector("#potato-avatar-1"));
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
    showPowerup();
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
    potatoOne.resetValues();
    potatoTwo.resetValues();
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
            showPowerup();
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
    }
    if(receivingPotato.powerup.activated ==="Shield"){
        attackingPotato.attack = Math.round((attackingPotato.attack/100) * 80);
    }

    attackingPotato.isPerfectCombo && attackingPotato.numPerfectCombo++;

    //determine multiplier
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
    
    
    if(receivingPotato.hp <= 0) {
        gameOverInterval = setTimeout(() => gameOverScreen(attackingPotato),100);
        //clearTimeout(timeOut);
    }else{
        setTimeout(() => 
        {   clearKeystrokes(attackingPotato);
            setKeystrokes(10,attackingPotato);
        } 
        , 200);
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

// const removePowerup = (powerup) => {
//     powerup.remove();
//     //remove event listener
//     //remove setInterval
// }

const showPowerup = () =>{ 
    let randDelay = (Math.floor(Math.random() * (powerUpDurationUpperRange - powerUpDurationLowerRange)) + powerUpDurationLowerRange)  * 1000; 
    //console.log("randDelay:" + randDelay);
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

/*
---------------
To-Do List
---------------
*/

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