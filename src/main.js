const WIDTH = 800
const HEIGHT = 600
const TIMER = 2000

export default function main(canvas){
  const state = {
    isPlaying: false,
    score: 0,
    hiscore: 0,
    shots: 0,
    hits: 0,
    timer: TIMER,
    ghosts: [
      //{x:400,y:300}
    ],
    bullets: [
      //{x:400,y:300,tick:5}
    ],
    disabledClick: false,
    firstPlay: true,
    menuWobble: 0,
  }

  window.state=state

  const ctx = canvas.getContext('2d');

  state.ctx = ctx
  state.ctx.imageSmoothingEnabled = false;
  state.ctx.font = '60px "Boned"'

  const GHOST = '👻'
  const GHOST_WIDTH = ctx.measureText(GHOST).width

  function tick() {
    if(!state.isPlaying) {
      state.menuWobble++
      return
    }
    state.timer--
    if(state.timer<=0) gameover()
    state.ghosts.forEach(g=>{
      g.y -= 2
      g.tick++
      g.x += (g.dir + (Math.sin(g.tick/10)*3*g.intensity))
      if (g.y < 0) g.dead = true
    })
    state.ghosts = state.ghosts.filter(g=>!g.dead)

    state.bullets.forEach(b=>b.tick--)
    state.bullets = state.bullets.filter(b=>b.tick>0)
  }
  function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if(!state.isPlaying){
      ctx.font = '80px "Boned"'
      let txt = 'Bust-a-Ghost'
      let x = (WIDTH/2) - (ctx.measureText(txt).width/2)
      ctx.fillStyle = 'black'
      ctx.fillText(txt,x+5,150+5+(Math.sin(state.menuWobble/7)*5))
      txt = '👻 Bust-a-Ghost 👻'
      x = (WIDTH/2) - (ctx.measureText(txt).width/2)
      ctx.fillStyle = 'white'
      ctx.fillText(txt,x,150+(Math.sin(state.menuWobble/7)*5))

      ctx.font = '60px "Boned"'
      txt = 'High Score: '+state.hiscore
      x = (WIDTH/2) - (ctx.measureText(txt).width/2)
      ctx.fillStyle = 'black'
      ctx.fillText(txt,x+5,(state.firstPlay?350:230)+5)
      ctx.fillStyle = 'white'
      ctx.fillText(txt,x,(state.firstPlay?350:230))

      if(!state.firstPlay){
        txt = 'Score: '+state.score
        x = (WIDTH/2) - (ctx.measureText(txt).width/2)
        ctx.fillStyle = 'black'
        ctx.fillText(txt,x+5,300+5)
        ctx.fillStyle = 'white'
        ctx.fillText(txt,x,300)
  
        txt = 'Accuracy: '+Math.floor((state.hits/state.shots)*100)
        x = (WIDTH/2) - (ctx.measureText(txt).width/2)
        ctx.fillStyle = 'black'
        ctx.fillText(txt,x+5,370+5)
        ctx.fillStyle = 'white'
        ctx.fillText(txt,x,370)
      }

      txt = state.firstPlay?'click to start':'click to play again'
      x = (WIDTH/2) - (ctx.measureText(txt).width/2)
      ctx.fillStyle = 'black'
      ctx.fillText(txt,x+5,470+5)
      ctx.fillStyle = 'white'
      ctx.fillText(txt,x,470)
    }

    else{
      state.ghosts.forEach(
        ghost => {
          ctx.fillText(GHOST,ghost.x-(GHOST_WIDTH/2),ghost.y + 30)
        }
      )
  
      state.bullets.forEach(
        bullet => {
          ctx.fillStyle = 'yellow'
          ctx.beginPath();
          ctx.arc(bullet.x, bullet.y, bullet.tick * 7, 0, 2 * Math.PI);
          ctx.fill();
        }
      )
  
      let txt = 'Score: '+state.score
      ctx.fillStyle = 'black'
      ctx.fillText(txt,20 + 5,600 - 45)
      ctx.fillStyle = 'white'
      ctx.fillText(txt,20,600 - 50)
  
      ctx.fillStyle = '#44444488'
      ctx.beginPath();
      ctx.arc(800-80, 80, 44, 0, 2 * Math.PI);
      ctx.lineTo(800-80, 80)
      ctx.fill();
      ctx.fillStyle = state.timer > (TIMER/4) ? 'white' : `rgb(255,${255*(state.timer/(TIMER/4))},${255*(state.timer/(TIMER/4))})`
      ctx.beginPath();
      ctx.arc(800-80, 80, 40, (2 * Math.PI-(2 * Math.PI * Math.max(0.1,state.timer))/TIMER)-Math.PI/2, 0-(Math.PI/2));
      ctx.lineTo(800-80, 80)
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  canvas.addEventListener('click', shoot, false);
  canvas.addEventListener('touchstart', ev => {
    ev.preventDefault()
    shoot(ev)
  })
  function shoot(event) {
    if(!state.isPlaying){
      if(!state.disabledClick)reset()
      return
    }
    var rect = canvas.getBoundingClientRect();
    var x = event.pageX - rect.left,
        y = event.pageY - rect.top;

    state.shots++

    state.bullets.push({x,y,tick:5})

    // Collision detection between clicked offset and element.
    state.ghosts.forEach(ghost => {
      const dist = Math.sqrt(
        ((ghost.x-x) ** 2) +
        ((ghost.y-y) ** 2)
      )
      if (dist<40) {
        ghost.dead = true
        state.score++
        state.hits++
      }
    });
  }

  function spawn(){
    if(state.isPlaying)
      state.ghosts.push(
        {
          x: (Math.random()*700)+50,
          y: 700,
          tick: (Math.random()*5),
          speed: 0.6 + (Math.random()),
          dir: 0.5 - (Math.random()),
          intensity: 0.5 + Math.random(),
        }
      )
  }
  setInterval(spawn, 800)
  setInterval(tick, 1000/60)

  function gameover(){
    state.isPlaying = false
    state.disabledClick = true
    state.hiscore = Math.max(state.hiscore,state.score)

    setTimeout(()=>state.disabledClick=false,1000)

    localStorage.setItem("hiscore", state.hiscore)
  }

  function reset(){
    state.timer = TIMER
    state.score = 0
    state.ghosts = []
    state.bullets = []
    state.hits = 0
    state.shots = 0
    state.firstPlay = false

    // first ghost for next game
    spawn()

    state.isPlaying = true
  }

  state.hiscore = localStorage.getItem("hiscore") || 0
}
