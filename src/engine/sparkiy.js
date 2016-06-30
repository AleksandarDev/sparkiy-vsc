var stage, graphics, renderer;

var rendererWidth, rendererHeight;
var strokeFill, strokeSize;

renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { antialias: true });
document.body.appendChild(renderer.view);

function clear(r, g, b) {
    renderer.backgroundColor = getColorNumber(r, g, b);
    graphics.clear();
}

function setStrokeFill(r, g, b) {
    strokeFill = getColorNumber(r, g, b);
    setStrokeFromCurrentStyle();
}

function clearStrokeFill() {
    strokeSize = 0;
    strokeFill = 0;
    setStrokeFromCurrentStyle();
}

function setStrokeSize(thickness) {
    strokeSize = thickness;
    setStrokeFromCurrentStyle();
}

function setStrokeFromCurrentStyle() {
    if (strokeSize == 0)
        graphics.lineStyle(0);
    else graphics.lineStyle(strokeSize, strokeFill, 1);
}

function setFill(r, g, b) {
    setFillFromNumber(getColorNumber(r, g, b));
}

function setFillFromNumber(fill) {
    graphics.beginFill(fill);
}

function drawLine(x1, y1, x2, y2) {
    graphics.moveTo(x1, y1);
    graphics.lineTo(x2, y2);
}

function drawRect(x, y, width, height) {
    graphics.drawRect(x, y, width, height);
}

function drawCircle(x, y, radius) {
    graphics.drawCircle(x, y, radius);
}

function drawEllipse(x, y, width, height) {
    graphics.drawEllipse(x, y, width, height);
}

function getColorNumber(r, g, b) {
    return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | ((b & 0xFF)); 
}

// run the render loop
animate();

var sparkiyGraphicsFrameDelta = 0;
var previousTimestamp;
function animate() {
    if (rendererHeight != window.innerHeight || rendererWidth != window.innerWidth)
        renderer.resize(window.innerWidth, window.innerHeight);

    requestAnimationFrame(animate);

    // create the root of the scene graph
    stage = new PIXI.Container();
    graphics = new PIXI.Graphics();
    stage.addChild(graphics);

    document.dispatchEvent(new CustomEvent("sparkiyDrawFrame"));
    renderer.render(stage);

    // Calculate frame delta that can be used on LUA side
    var currentTimesamp = Date.now(); 
    sparkiyGraphicsFrameDelta = currentTimesamp - previousTimestamp;    
    previousTimestamp = currentTimesamp;
}


