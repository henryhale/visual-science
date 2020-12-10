// Initial Params
let init_angle = 30;
let init_speed = 50;
let init_ball_x = 15;
let init_ball_y = 30;
let barrel_length = 30;

// Constants
let accn_g = 9.81;
let prec = 0.05;

// Transitive Params
let ball_x, ball_y, ball_vx, ball_vy;
let ballFired = false;

// Trajectory
let points = [];

// Scale
let scale;

function shootBall() {
    ballFired = true;
    ball_x = init_ball_x;
    ball_y = init_ball_y;
    ball_vx = init_speed * Math.cos(toRadian(init_angle));
    ball_vy = init_speed * Math.sin(toRadian(init_angle));
}

function drawBall() {
    if (ballFired) {
        context.strokeStyle = "#ffffff";
        context.lineWidth = 2;
        context.beginPath();
        context.arc(ball_x / scale, canvas_height - ball_y / scale, 5, 0, 2 * Math.PI);
        context.stroke();
        console.log("Ball drawn");
    }
}

function drawTrajectories() {
    context.fillStyle = "#ffffff";
    for (let point of points) {
        context.fillRect(point.x, point.y, 2, 2);
    }
}

function clearTrajectories() {
    points = [];
}

function drawRaw() {
    context.strokeStyle = "#ffffff";
    context.fillStyle = "#ffffff";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(0, canvas_height - 10);
    context.lineTo(canvas_width, canvas_height - 10);
    context.stroke();

    context.beginPath();
    context.arc(20, canvas_height - 20, 10, 0, 2 * Math.PI);
    context.stroke();

    context.beginPath();
    context.moveTo(15, canvas_height - 25);
    context.lineTo(15 + barrel_length * Math.cos(toRadian(angle_slider.value)), canvas_height - 25 - barrel_length * Math.sin(toRadian(angle_slider.value)));
    context.lineTo(25 + barrel_length * Math.cos(toRadian(angle_slider.value)), canvas_height - 17 - barrel_length * Math.sin(toRadian(angle_slider.value)));
    context.lineTo(25, canvas_height - 17);
    context.lineTo(15, canvas_height - 25);
    context.closePath();
    context.fill();
}

function update_params(input) {
    if (input == "angle-slide") {
        angle_display.innerHTML = `&theta; = ${angle_slider.value} degrees`;
        init_angle = angle_slider.value;
    }
    else if (input == "speed-slide") {
        speed_display.innerHTML = `u = ${speed_slider.value} units`;
        init_speed = speed_slider.value;
    }
}

function update() {
    if (ballFired) {
        ball_vy = ball_vy - accn_g * prec;

        ball_x = ball_x + ball_vx * prec;
        ball_y = ball_y + ball_vy * prec;

        points.push({
            x: ball_x / scale,
            y: canvas_height - ball_y / scale,
        });

        if (ball_y <= 30.0) {
            ballFired = false;
        }
    }
}

function render() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas_width, canvas_height);

    drawRaw();
    drawBall();
    drawTrajectories();
}

function initParams() {
    angle_slider.value = init_angle;
    update_params('angle-slide');

    speed_slider.value = init_speed;
    update_params('speed-slide');
}

function calcScale() {
    let maxRange = (100 * 100) / accn_g;
    scale = maxRange / (canvas_width - 50);
}

window.onload = function () {
    initParams();
    calcScale();
    animate(step);
}

function step() {
    update();
    render();
    animate(step);
};