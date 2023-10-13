import classes from './main.css';
import main from './src/main';

window.addEventListener('DOMContentLoaded',()=>{
  const GameCanvas = document.getElementById('game')
  main(GameCanvas)
})