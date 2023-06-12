
const Potato = class {
    constructor(id){
        this._id = id;
        this._hp = 100;
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

}

const potatoOne = new Potato(0);
const potatoTwo = new Potato(1);

const render = () => {
    titleScreen();
}

const titleScreen = () => {
    const main = document.querySelector("main");
    const titleScreen = document.createElement("div");
    titleScreen.classList.add("titleScreen");
    
    //add title 
    const titleImg = document.createElement("img");
    titleImg.classList.add("title-img");
    titleImg.setAttribute("src", "/img/title.svg");

    //potatoes
    //const potatoOne = createPotato("potato1");
    //const potatoTwo = createPotato("potato2");
    // const potatoOne = new Potato(1);
    // const potatoTwo = new Potato(2);
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

    main.append(titleImg, potatoesWrapper, buttonsWrapper);
}

const playScreen = () => {
    //clear just the buttons and the title
    //potatoes shift to the bottom a bit to make way for keyboard
    document.querySelector(".title-img").remove();
    document.querySelector(".buttons-wrapper").remove();
    const actionArea = document.querySelector(".action-area");
    actionArea.classList.remove("hidden");

    const keystrokeNum = 10;
    setKeystrokes(10,potatoOne);
    setKeystrokes(10,potatoTwo);

    //listen to keydown
    document.addEventListener("keydown", (event) => {
        //TO DO: check for both potatoes keys
        //both potatoes have active keys. Only check if keys are a,w,s,d,space or up,down,left,right,enter 
        const potatoOneKeys = {actionKeys: ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"], finalKey: "Enter"};
        const potatoTwoKeys = {actionKeys: ["w","a","s","d"], finalKey: " "};
        const input = event.key;
        console.log(input);
        if (potatoOne.keystrokeElementArr.length > 1 && potatoOneKeys.actionKeys.includes(input)) { validateKey(potatoOne, input); } //if keys are arrows, or enter
        if (potatoTwo.keystrokeElementArr.length > 1 && potatoTwoKeys.actionKeys.includes(input)) { validateKey(potatoTwo, input); }
        if (potatoOne.keystrokeElementArr.length === 1 && potatoOneKeys.finalKey === input){attackOpponent(potatoOne,potatoTwo)}; //potato 1 attacks potato 2
        if (potatoTwo.keystrokeElementArr.length === 1 && potatoTwoKeys.finalKey === input){attackOpponent(potatoTwo,potatoOne)};
    });

    const validateKey = (potato, input) =>{
        input === potato.activeKey ? setCorrect(potato, potato.keystrokeElementArr) : setMissed(potato, potato.keystrokeElementArr);
    }
    
    const attackOpponent = (attackingPotato, receivingPotato) => {
        //reduce receiving potato hp
        console.log("receiving potato ", receivingPotato.id);
        console.log("attacking potato ", attackingPotato.id);
        console.log("potato " + receivingPotato.id + " hp: " + receivingPotato.hp);
        receivingPotato.hp -= attackingPotato.attack;
        console.log("potato " + receivingPotato.id + " hp: " + receivingPotato.hp);
        //update hp div
        const hpElement = document.getElementById("hp-"+ receivingPotato.id);
        hpElement.innerText = receivingPotato.hp;
        //check if receiving potato hp = 0
        //if = 0, end game
        //else, reset attacking potato attack to 0
        attackingPotato.attack = 0;
        document.querySelector(`#damage-points-${attackingPotato.id}`).children[1].innerText = 0; //updates damage box
        //give attacking potato new key sequence
        clearKeystrokes(attackingPotato);
        setKeystrokes(10,attackingPotato);
    }

    const setCorrect = (potato, keystrokeElementArr) => {
        const currentKeystroke = keystrokeElementArr[0];
        currentKeystroke.dataset.keystrokeStatus = "correct";
        potato.attack += 2;
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

}

const clearKeystrokes = (potato) => {
    const keySequence = document.querySelector("#key-sequence-" + potato.id);
    keySequence.innerHTML = "";
}

const setKeystrokes = (keystrokeNum,potato) => {
    const potatoIndex = potato.id;
    const keySequence = document.querySelector("#key-sequence-" + potatoIndex);
    const keystrokeArr = []; 
    const possibleKeys = [ {keystroke: ["ArrowUp","w"], icon: "img/arrow-up.svg"}, {keystroke: ["ArrowDown","s"], icon: "img/arrow-down.svg"}, {keystroke: ["ArrowLeft","a"], icon: "img/arrow-left.svg"}, {keystroke: ["ArrowRight","d"], icon: "img/arrow-right.svg"} ];
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


const createPotatoDiv = (potato) => {
    const div = document.createElement("div");
    div.classList.add("potato");
    div.id = potato.id;
    const img = document.createElement("img");
    img.setAttribute("src","img/potato_knife.svg");
    div.appendChild(img);
    //hp bar
    const hp = document.createElement("p");
    hp.id = "hp-" + potato.id;
    hp.innerText = potato.hp
    div.appendChild(hp);
    return div;
}

const createButton = (className) => {
    const btn = document.createElement("button");
    btn.innerText = className;
    btn.classList.add(className);
    return btn;
}


render();
