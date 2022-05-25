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
            framesMax: 8,
        },
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
    player.update()
    // op.update()

    player.velocity.x = 0
    op.velocity.x = 0

    //player movement
    player.image = player.sprites.idle.image
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.image = player.sprites.run.image
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.image = player.sprites.run.image
    }
    

    //Op movement
    if (keys.ArrowLeft .pressed && op.lastKey === 'ArrowLeft') {
        op.velocity.x = -5
    } else if (keys.ArrowRight.pressed && op.lastKey === 'ArrowRight') {
        op.velocity.x = 5
    }
        
    // detect for collision
    if( rectangularCollision({
        rectangle1: player,
        rectangle2: op
    }) && 
    player.isAttacking)
    { 
        player .isAttacking = false
        op.health -= 20
        document.querySelector('#opHealth').style.width = op.health + '%'

    }

    if( rectangularCollision({
        rectangle1: op,
        rectangle2: player
    }) && 
    op.isAttacking)
    {
        op .isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'

    }

    //end game based on health
    if(op.health <= 0 || player.health <= 0){
        determineWinner({ player, op, timerId })


    }

}


animate()

window.addEventListener('keydown', (event) =>{
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
            op.isAttacking = true
            break
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