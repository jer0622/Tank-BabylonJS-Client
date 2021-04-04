
// Conversion degres ----> radians
export function degToRad(deg) {
    return (Math.PI * deg) / 180
}
 
// Conversion radians ----> degres
export function radToDeg(rad) {
    return (rad * 180) / Math.PI
}

// Renvoie un random entre min et max inclut
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}