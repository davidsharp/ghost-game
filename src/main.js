const WIDTH = 800
const HEIGHT = 600
const TIMER = 1000

export default function main(canvas){
  const state = {
    isPlaying: true,
    score: 0,
    hiscore: 0,
    timer: TIMER,
    ghosts: [
      //{x:400,y:300}
    ],
    bullets: [
      //{x:400,y:300,tick:5}
    ],
  }

  window.state=state

  const ctx = canvas.getContext('2d');

  state.ctx = ctx
  state.ctx.imageSmoothingEnabled = false;
  state.ctx.font = '60px "Boned"'

  const GHOST = '👻'
  const GHOST_WIDTH = ctx.measureText(GHOST).width

  function tick() {
    if(!state.isPlaying) return
    state.timer--
    if(state.timer<=0) gameover()
    state.ghosts.forEach(g=>{
      g.y -= 2
      g.tick++
      g.x += (Math.sin(g.tick/10)*3)
      if (g.y < 0) g.dead = true
    })
    state.ghosts = state.ghosts.filter(g=>!g.dead)

    state.bullets.forEach(b=>b.tick--)
    state.bullets = state.bullets.filter(b=>b.tick>0)
  }
  function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if(!state.isPlaying){
      // handle menu stuff here
      let txt = 'High Score: '+state.hiscore
      let x = (WIDTH/2) - (ctx.measureText(txt).width/2)
      ctx.fillStyle = 'black'
      ctx.fillText(txt,x+5,300+5)
      ctx.fillStyle = 'white'
      ctx.fillText(txt,x,300)

      requestAnimationFrame(draw);
    }

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

    ctx.fillStyle = state.timer > (TIMER/5) ? 'white' : 'red'
    ctx.beginPath();
    ctx.arc(800-100, 100, 50, (2 * Math.PI-(2 * Math.PI * Math.max(0.1,state.timer))/TIMER)-Math.PI/2, 0-(Math.PI/2));
    ctx.lineTo(800-100, 100)
    ctx.fill();

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  canvas.addEventListener('click', function(event) {
    if(!state.isPlaying){
      // handle menu stuff here
      state.isPlaying = true
      return
    }
    var rect = canvas.getBoundingClientRect();
    var x = event.pageX - rect.left,
        y = event.pageY - rect.top;

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
      }
    });

}, false);

  function spawn(){
    if(state.isPlaying)
      state.ghosts.push(
        {
          x: (Math.random()*700)+50,
          y: 700,
          tick: (Math.random()*5),
        }
      )
  }
  setInterval(spawn, 1000)
  setInterval(tick, 1000/60)

  function gameover(){
    state.isPlaying = false
    state.timer = TIMER
    state.hiscore = Math.max(state.hiscore,state.score)
    state.score = 0
    state.ghosts = []
    state.bullets = []

    localStorage.setItem("hiscore", state.hiscore)

    // first ghost for next game
    spawn()
  }

  spawn()
  state.hiscore = localStorage.getItem("hiscore") || 0
}
