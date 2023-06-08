//create potato object

//Types of screens:
//title screen
//play screen
//results screen

let potatoOne = {
    colour: "#FD9800",
    div: ""
}

let potatoTwo = {
    colour: "#6E1BD7",
    div: ""
}

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
    const potatoOne = createPotato("potato1");
    const potatoTwo = createPotato("potato2");
    const potatoesWrapper = document.createElement("div");
    potatoesWrapper.classList.add("potatoes-wrapper");
    potatoesWrapper.append(potatoOne,potatoTwo);

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

    //initalize keystrokes
    //set 10 keystrokes at a time
    //last keystroke is an enter or space, depending on player
    const keystrokeNum = 10;
    setKeystrokes(10,"potatoOne");
    
}

const setKeystrokes = (keyStrokeNum,potatoId) => {
    const keySequence = document.querySelector(".key-sequence");
    const keyStrokeArr = []; 
    const possibleKeys = [ {keyStroke: "up", icon: "/up"}, {keyStroke: "down", icon: "/down"}, {keyStroke: "left", icon: "/left"}, {keyStroke: "right", icon: "/right"} ];
    for(let i = 1 ; i <= keyStrokeNum - 1 ; i++){
        const keyStrokeDiv = document.createElement("div");
        keyStrokeDiv.classList.add("keystroke");
        keyStrokeDiv.innerText = possibleKeys[Math.floor(Math.random() * 4)].icon;
        //keyStrokeArr.push(keyStrokeDiv);
        keySequence.append(keyStrokeDiv);
    }
    potatoId === potatoOne ? keyStrokeArr.push({keyStroke: "space", icon: "/space"}) : keyStrokeArr.push({keyStroke: "space", icon: "/space"});
    console.log(keySequence);
}   


const createPotato = (potatoId) => {
    const div = document.createElement("div");
    div.classList.add("potato");
    div.id = potatoId;
    const img = document.createElement("img");
    img.setAttribute("src","img/potato_knife.svg");
    div.appendChild(img);
    return div;
}

const createButton = (className) => {
    const btn = document.createElement("button");
    btn.innerText = className;
    btn.classList.add(className);
    return btn;
}


//to do list:
// - create title screen first
// - create potato objects
// - instructions
// - play button

render();
