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
    const div = createDiv("potato", "potato-" + potato.id)
    const img = document.createElement("img");
    potato.id === 0 ?  img.setAttribute("src","img/potato_knife.svg") : img.setAttribute("src","img/potato_knife2.svg");

    //create potato avatar div which contains potato avatar and effects
    const potatoAvatarDiv = createDiv("potato-avatar", "potato-avatar-" + potato.id);
    potatoAvatarDiv.appendChild(img);

    //hitting effect
    const effectSrc = "./img/effect-hit.png";
    const imgContainer = createImg("dmg-effect",effectSrc,"dmg-effect-"+potato.id);
    imgContainer.classList.add("hidden");
    potatoAvatarDiv.appendChild(imgContainer);
    div.appendChild(potatoAvatarDiv);

    //create helth bar
    const canvas = createHealthBar(potato);
    canvas.classList.add("hidden");
    div.appendChild(canvas);
    return div;
}

const createHealthBar = (potato) => {
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
     return canvas;
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
