window = js.global

function clear(r, g, b)
    window:clear(r, g, b)
end

function stroke(r, g, b)
    window:setStrokeFill(r, g, b)
end

function strokeSize(thickness)
    window:setStrokeSize(thickness)
end

function line(x1, y1, x2, y2)
    window:drawLine(x1, y1, x2, y2)
end

function rect(x, y, width, height)
    window:drawRect(x, y, width, height)
end

function square(x, y, size) 
    window:drawRect(x, y, size, size)
end

function circle(x, y, radius)
    window:drawCircle(x, y, radius)
end

function ellipse(x, y, width, height)
    window:drawEllipse(x, y, width, height)
end

function fill(r, g, b) 
    window:setFill(r, g, b)
end