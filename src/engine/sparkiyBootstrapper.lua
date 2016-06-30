-- Per-frame values
DELTA = 0
WIDTH = 0
HEIGHT = 0

function init()
    js.global.document:addEventListener("sparkiyDrawFrame", sparkiyDrawFrameCallback)
    WIDTH = js.global.window.innerWidth
    HEIGHT = js.global.window.innerHeight
end

function sparkiyDrawFrameCallback()
    -- Populate per-frame values
    DELTA = js.global.sparkiyGraphicsFrameDelta
    WIDTH = js.global.window.innerWidth
    HEIGHT = js.global.window.innerHeight

    draw()
end

init()
