const showCollectedDmg = (damage) => {
    //create an element
    const p = document.createElement("p");
    p.className = "collected-dmg";
    damage !== 0 ? p.innerText = "-" + damage : p.innerText = damage;
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

function jumpingZeroAnimate(element){ 
    element.classList.add('jumping-0-animate');
}

function jumpingOneAnimate(element){ 
    element.classList.add('jumping-1-animate');
}