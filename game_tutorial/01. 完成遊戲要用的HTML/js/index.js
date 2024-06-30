
const canvas = document.getElementById('gameCanvas');

document.addEventListener('keydown', function(event) {
    console.log(`key down" ${event.code}`);
});

document.addEventListener('keyup', function(event) {
    console.log(`key up" ${event.code}`);
  
});

canvas.addEventListener('mouseleave', () => {
    console.log(`mouse leave`);
});

canvas.addEventListener('mouseenter', () => {
    console.log(`mouse enter`);
});

canvas.addEventListener('mousemove', function(event) {
    console.log(`mouse move: ${event.clientX} ${event.clientY}`);
});
