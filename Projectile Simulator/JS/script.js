var updateInterval = parseFloat(1000/60);
var Timer = parseFloat(0); 
var image = new Image();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var textTimer = document.getElementById('temporizador');
var startTimer = parseFloat(0);

drawDistanceLines();

//canvas resolution is 1280x768. 1280 should be 2km, this means height will be 1.2 km
document.getElementById('InputData').addEventListener('submit', function(event) {
    event.preventDefault();
    var velcx = ConvertMetertoPixel(parseFloat(document.getElementById('xInput').value));
    var velcy = ConvertMetertoPixel(parseFloat(document.getElementById('yInput').value));
    velcy = -velcy;
    var grav = ConvertMetertoPixel(parseFloat(document.getElementById('gravityInput').value));
    startTimer = performance.now();
    Timer = startTimer;
    Begin(new Cannonball(10, 736, velcx, velcy, grav));
    

});

function loadCannonballImage(callback) {
    image.onload = function() {
        callback(image);
    };
    image.src = './images/cannon ball.png'; 
}

function Begin(bola) {
    loadCannonballImage(function(image) {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        deltaTime = parseFloat(performance.now() - Timer);
        if(deltaTime > updateInterval) {
            bola.update(deltaTime);
            Timer = performance.now();
        }
    })
    textTimer.textContent = 'time: ' + parseFloat((performance.now() - startTimer)/1000) + ' s';

    ctx.drawImage(image, bola.x, bola.y)
    drawDistanceLines();

    requestAnimationFrame(function() {
    Begin(bola);
    });    
}

function drawDistanceLines() {
    var startX = 10; // Posição inicial no eixo x
    var endX = canvas.width - 50; // Posição final no eixo x
    var startY = canvas.height - 20; // Posição no eixo y onde as linhas serão desenhadas
    var smallLineInterval = 63; // Intervalo para linhas pequenas (100 metros)
    var bigLineInterval = 315; // Intervalo para linhas maiores (500 metros)
    var currentX = startX;
    var text = parseInt(0);

    // Desenhar linhas pequenas a cada 100 metros
    while (currentX < endX) {
        ctx.beginPath();
        ctx.moveTo(currentX, startY - 10);
        ctx.lineTo(currentX, startY);
        ctx.stroke();
        ctx.closePath();
        ctx.fillText(text + 'm', currentX - 10, startY + 20);
        text += 100
        currentX += smallLineInterval;
    }

    // Desenhar linhas maiores a cada 500 metros
    currentX = startX;
    while (currentX < endX) {
        ctx.beginPath();
        ctx.moveTo(currentX, startY - 20);
        ctx.lineTo(currentX, startY);
        ctx.stroke();
        ctx.closePath();
        currentX += bigLineInterval;
    }

    ctx.beginPath();
    ctx.moveTo(canvas.width, startY - 20);
    ctx.lineTo(canvas.width, startY);
    ctx.fillText(ConvertPixettoMeter((canvas.width - startX)) + 'm', canvas.width - 30, startY + 20);
    ctx.stroke();
    ctx.closePath();

}

class Cannonball {
    constructor(x, y, velx, vely, gravity) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
        this.velx = parseFloat(velx);
        this.vely = parseFloat(vely);
        this.gravity = parseFloat(gravity);
    }

    update(deltaTime) {
        this.x = this.x + this.velx*deltaTime/1000;
        this.y = this.y + this.vely*deltaTime/1000;
        this.vely = this.vely + this.gravity*deltaTime/1000;
        
    }
}

function ConvertMetertoPixel(meters) {
    return parseFloat(meters*0.635);
}

function ConvertPixettoMeter(pixels) {
    return parseFloat(pixels*2000/1270);
}