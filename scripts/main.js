// set up canvas
const evilCircleSize = 10;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const pBallCount = document.querySelector('p');
let msg = 'Ball count :';
let ballCount = 0;
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
    constructor(x, y, velX, velY, exists) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = exists;
    }
}

class Ball extends Shape {

    constructor(x, y, velX, velY, exists = true, color, size) {
        super(x, y, velX, velY, exists);
        this.color = color;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        if ((this.x + this.size) >= width) {
            this.velX = -(this.velX);
        }

        if ((this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        }

        if ((this.y + this.size) >= height) {
            this.velY = -(this.velY);
        }

        if ((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (const ball of balls) {
            if (!(this === ball)) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.color = this.color = randomRGB();
                }
            }
        }
    }

}

class EvilCircle extends Shape {
    constructor(x, y) {
        super(x, y, evilCircleSize, evilCircleSize, false);
        this.color = 'white';
        this.size = evilCircleSize;
    }

    draw() {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }

    checkBounds() {
        if ((this.x + this.size) >= width) {
            this.x = width - this.size;
        }

        if ((this.x - this.size) <= 0) {
            this.x = this.size;
        }

        if ((this.y + this.size) >= height) {
            this.y = height - this.size;
        }

        if ((this.y - this.size) <= 0) {
            this.y = this.size;
        }
    }
    setControls() {
        var _this = this;
        window.onkeydown = function (e) {
            if (e.keyCode === 65) {
                _this.x -= _this.velX;
            } else if (e.keyCode === 68) {
                _this.x += _this.velX;
            } else if (e.keyCode === 87) {
                _this.y -= _this.velY;
            } else if (e.keyCode === 83) {
                _this.y += _this.velY;
            }
        }
    }

    collisionDetect() {
        for (const ball of balls) {
            if (ball.exists) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.exists = false;
                    balls.splice(balls.indexOf(ball), 1);
                    ballCount--;
                    pBallCount.textContent = `${msg} ${ballCount}`;
                }
            } else {

            }
        }
    }
}

const balls = [];

while (balls.length < 25) {
    const size = random(10, 20);
    const ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        true,
        randomRGB(),
        size
    );

    balls.push(ball);
}
const evilCircle = new EvilCircle(random(evilCircleSize, width - evilCircleSize),
    random(evilCircleSize, height - evilCircleSize));
evilCircle.setControls();
function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();
    ballCount = 0;
    for (const ball of balls) {
        if (ball.exists) {
            ball.draw();
            ballCount++;
            pBallCount.textContent = `${msg} ${ballCount}`;
            ball.update();
            ball.collisionDetect();
        } else {
            ballCount = 0;
            pBallCount.textContent = `${msg} ${ballCount}`;
        }
    }

    requestAnimationFrame(loop);
}
loop();