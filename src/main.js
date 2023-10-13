const WIDTH = 800
const HEIGHT = 600

export default function main(canvas){
  const state = {
    screen: null,
    elements: [],
    frame: 0,
    innerX: 5,
    innerY: 80,
    settings: {},
    ghosts: [
      //{x:400,y:300}
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
    state.ghosts.forEach(g=>{
      g.y -= 2
      g.tick++
      g.x += (Math.sin(g.tick/10)*3)
      if (g.y < 0) g.dead = true //g.y = 800
    })
    state.ghosts = state.ghosts.filter(g=>!g.dead)
  }
  function draw() {
    tick()
    state.frame++

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    state.ghosts.forEach(
      ghost => {
        ctx.fillText(GHOST,ghost.x-(GHOST_WIDTH/2),ghost.y + 30)
      }
    )

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  canvas.addEventListener('click', function(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.pageX - rect.left,
        y = event.pageY - rect.top;

        console.log(x,y)

    // Collision detection between clicked offset and element.
    state.ghosts.forEach(ghost => {
      const dist = Math.sqrt(
        ((ghost.x-x) ** 2) +
        ((ghost.y-y) ** 2)
      )
      console.log(dist)
      if (dist<40) {
          //alert('clicked an element');
          ghost.dead = true
      }
    });

}, false);

  function spawn(){
    state.ghosts.push(
      {
        y: 700,
        tick: (Math.random()*5),
        x: (Math.random()*700)+50
      }
    )
  }
  setInterval(spawn,1200)
  spawn()
}
