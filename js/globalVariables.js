const attackPower = 2; //damage taken per attack
const keystrokeNum = 10; //determines how many keys you want before attacking
const maxAttackPower = attackPower * keystrokeNum;
const powerUpDurationLowerRange = 5;
const powerUpDurationUpperRange = 10; //power up will appear every 5-10
let hasPowerup = false;
let latestPowerup = "";
const colorOne = "#ff9933"; //orange
const colorTwo = "#4700b3" //purple
let potatoPowerupTarget = "";
const dialog = document.createElement("dialog");
const top_height = document.querySelector(".top").offsetHeight;
let powerupInterval;

const powerups = [
    {
    id: 0,
    name: "First Aid",
    img: "./img/powerup-firstaid.png",
    imgDiv: () => createDiv("powerup-div"),
    descr: "Increases HP by a random amount between 20 - 80.",
    func:  firstAid = (potato) => {
        const max = 100;
        const min = 20;
        const addHealth = potato.hp + Math.floor(Math.random()*(max-min)) + min;
        //console.log(addHealth);
        potato.healthBar.updateHealth(addHealth);
        potato.powerup = "";
        potato.powerupDiv.remove();
    }
},
    {
    id: 1,
    name: "Shield",
    img: "./img/powerup-shield.png",
    imgDiv: () => createDiv("powerup-div"),
    descr: "Reduce damage of opposing player’s next attack by 20%.",
    func: shield = (potato) => {
            potato.powerup.activated = potato.powerup.name;
            const tipDiv = document.querySelector("#use-powerup-tip-" + potato.id);
            tipDiv.innerHTML = "Shield is in effect!"
            document.querySelector("#potato-powerup-"+potato.id).children[0].style.borderColor = "red"; 
        }    
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
    func: attackUp = (potato) => {
        potato.powerup.activated = potato.powerup.name;
        const tipDiv = document.querySelector("#use-powerup-tip-" + potato.id);
        tipDiv.innerHTML = "Attack up is in effect!"
        document.querySelector("#potato-powerup-"+potato.id).children[0].style.borderColor = "red"; 
    }    
    },
];
