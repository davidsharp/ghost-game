const fs = require('fs')

const assets = [
  {name:'crosshair',path:'./crosshair.png'},
]

const json = `export default {${assets.map(asset => `"${asset.name}":"data:image/png;base64,${fs.readFileSync(asset.path, "base64")}"`).join(',')}}`

console.log(json)
