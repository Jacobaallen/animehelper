const luffy = document.querySelectorAll('.luffy')
const scoreBoard    = document.querySelector('#score')
let remainingPeeps, score

function randomLuffy() {
  const index = Math.floor(Math.random() * luffy.length)
  return luffy[index]
}

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

function sprout(luffy){
  luffy.classList.add('up')
}

function shrink(luffy){
  luffy.classList.remove('up')
}

function bonk(luffy) {
  shrink(luffy)
  score++
  scoreBoard.textContent = score
}

function peep(luffy) {
  const time = randomTime(200, 2000)
  sprout(luffy)
  setTimeout( () => { shrink(luffy) }, time)
  if(remainingPeeps > 0){
    remainingPeeps--
    const luffy = randomLuffy()
    setTimeout( () => { peep(luffy) }, time )
  }
}

function startGame() {
  remainingPeeps = 10
  score = 0
  scoreBoard.textContent = score
  const luffy = randomLuffy()
  peep(luffy)
}
