const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7

const background = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position:{
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})


// Creating Player from Sprite Class
const player = new Fighter({
    position: {
    x: 0,
    y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8 
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }

    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})

// Creating Enemy(op) from Sprite Class
const op = new Fighter({
    position: {
    x: 400,
    y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'pink',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4 
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }

    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})


console.log(player) 

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }

}

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    op.update()

    player.velocity.x = 0
    op.velocity.x = 0

    //player movement
    
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // jumping 
    if(player.velocity.y < 0) {
        player.switchSprite('jump')

    }else if (player.velocity.y > 0){
        player.switchSprite('fall')

    }
    
    

    //Op movement
    if (keys.ArrowLeft.pressed && op.lastKey ==='ArrowLeft') {
        op.velocity.x = -5
        op.switchSprite('run')
    } else if (keys.ArrowRight.pressed && op.lastKey === 'ArrowRight'){
        op.velocity.x = 5
        op.switchSprite('run')
    } else{
        op.switchSprite('idle')
    }

    if(op.velocity.y < 0) {
        op.switchSprite('jump')

    }else if (op.velocity.y > 0){
        op.switchSprite('fall')

    }

    // jumping 
    if(op.velocity.y < 0) {
        op.switchSprite('jump')
    
    }else if (op.velocity.y > 0){
        op.switchSprite('fall')
    
    }

        
    // detect for collision & op gets hit
    if ( 
        rectangularCollision({
        rectangle1: player,
        rectangle2: op
    }) && 
    player.isAttacking && 
    player.framesCurrent === 4)
    { 
        op.takeHit()
        player.isAttacking = false

        gsap.to('#opHealth', {
            width: op.health + '%'
        })

    }

    // if player misses
    if(player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }

    // this is where our player gets hit
    if( rectangularCollision({
        rectangle1: op,
        rectangle2: player
    }) && 
    op.isAttacking && op.framesCurrent === 2)
    {
        player.takeHit()
        op.isAttacking = false
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })

    }

    // if player misses
    if(op.isAttacking && op.framesCurrent === 2){
        op.isAttacking = false
    }

    //end game based on health
    if(op.health <= 0 || player.health <= 0){
        determineWinner({ player, op, timerId })


    }

}


animate()

window.addEventListener('keydown', (event) =>{
    if (!player.dead){

    
    switch (event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break

        case ' ':
            player.attack()
            break
    
        } 
    }
    
    if (!op.dead){

    switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            op.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            op.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            op.velocity.y = -20
            break
        case 'ArrowDown':
            op.attack()
            break
    }
}

})  

window.addEventListener('keyup', (event) =>{
    switch (event.key){
        case 'd': 
            keys.d.pressed = false
            break
        case 'a':  
            keys.a.pressed = false
            break
    }

    //enemy (op) keys
    switch (event.key){
        case 'ArrowRight': 
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':  
            keys.ArrowLeft.pressed = false
            break
    }
    

})   