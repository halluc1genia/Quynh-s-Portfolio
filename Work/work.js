/* =========================================================
   DITHER BACKGROUND
   ========================================================= */

const canvas = document.getElementById("ditherCanvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;


/* =========================================================
   MOUSE
   ========================================================= */

const mouse = {
    x: -1000,
    y: -1000,
    active: false
};

const targetMouse = {
    x: -1000,
    y: -1000
};


/* =========================================================
   CONFIG
   ========================================================= */

const CONFIG = {

    /* Main background colour */
    red: "#F80E00",

    /* Cursor interaction */
    mouseRadius: 170,
    mouseStrength: 32,
    mouseSmoothness: 0.12,

    /*
        Dither starts at 29% of viewport
        and continues toward the bottom.
    */
    ditherStart: 0.29,
    ditherEnd: 0.94,

    /*
        Size of one dither pixel.

        This is intentionally larger than
        the previous version so the pattern
        looks like actual square pixels.
    */
    pixelSize: 3,

    /*
        Space between pixels.

        4px pixel + 1px gap.
    */
    pixelGap: 1
};


/* =========================================================
   BAYER 4 × 4 MATRIX
   ========================================================= */

/*
        Classic Bayer ordered dithering.

        0   8   2  10
        12  4  14   6
        3  11   1   9
        15  7  13   5

    This produces the characteristic
    diagonal / checker-like square pattern.
*/

const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
];


/* =========================================================
   RESIZE
   ========================================================= */

function resizeCanvas() {

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    width =
        window.innerWidth;

    height =
        window.innerHeight;


    canvas.width =
        width * dpr;

    canvas.height =
        height * dpr;


    canvas.style.width =
        `${width}px`;

    canvas.style.height =
        `${height}px`;


    /*
        Keep all drawing calculations
        in CSS pixels.
    */

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}


window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


/* =========================================================
   MOUSE MOVE
   ========================================================= */

window.addEventListener(
    "mousemove",
    (event) => {

        targetMouse.x =
            event.clientX;

        targetMouse.y =
            event.clientY;

        mouse.active = true;
    }
);


/* =========================================================
   MOUSE LEAVE
   ========================================================= */

window.addEventListener(
    "mouseleave",
    () => {

        mouse.active = false;

        targetMouse.x = -1000;
        targetMouse.y = -1000;
    }
);


/* =========================================================
   UPDATE MOUSE
   ========================================================= */

function updateMouse() {

    mouse.x +=
        (
            targetMouse.x -
            mouse.x
        ) *
        CONFIG.mouseSmoothness;


    mouse.y +=
        (
            targetMouse.y -
            mouse.y
        ) *
        CONFIG.mouseSmoothness;
}


/* =========================================================
   BACKGROUND GRADIENT
   ========================================================= */

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            height
        );


    /*
        TOP
        -----------------------------------------------------
        Very bright red.
    */

    gradient.addColorStop(
        0,
        "#F80E00"
    );


    gradient.addColorStop(
        0.25,
        "#F80E00"
    );


    /*
        MIDDLE
        -----------------------------------------------------
        Gradually becomes darker red.
    */

    gradient.addColorStop(
        0.38,
        "#E70D00"
    );


    gradient.addColorStop(
        0.52,
        "#BD0A00"
    );


    gradient.addColorStop(
        0.66,
        "#780600"
    );


    gradient.addColorStop(
        0.80,
        "#330300"
    );


    /*
        BOTTOM
        -----------------------------------------------------
        Pure black.
    */

    gradient.addColorStop(
        1,
        "#000000"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        width,
        height
    );
}


/* =========================================================
   DITHER DENSITY
   ========================================================= */

function getDitherDensity(y) {

    const start =
        height *
        CONFIG.ditherStart;


    const end =
        height *
        CONFIG.ditherEnd;


    /*
        No dither above starting point.
    */

    if (y < start) {
        return 0;
    }


    /*
        Fully dense near the bottom.
    */

    if (y >= end) {
        return 1;
    }


    let t =
        (
            y - start
        ) /
        (
            end - start
        );


    /*
        This controls the shape
        of the transition.

        Lower exponent =
        dither appears earlier.

        Higher exponent =
        dither stays sparse longer.
    */

    t =
        Math.pow(
            t,
            1.15
        );


    return t;
}


/* =========================================================
   CURSOR DISTORTION
   ========================================================= */

function distortPoint(x, y) {

    if (!mouse.active) {

        return {
            x: x,
            y: y
        };
    }


    const dx =
        x - mouse.x;

    const dy =
        y - mouse.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    /*
        Outside the cursor radius:
        no distortion.
    */

    if (
        distance >
        CONFIG.mouseRadius
    ) {

        return {
            x: x,
            y: y
        };
    }


    /*
        1 at cursor,
        0 at edge.
    */

    const force =
        1 -
        (
            distance /
            CONFIG.mouseRadius
        );


    /*
        Smooth falloff.
    */

    const easedForce =
        force * force;


    let angle = 0;


    if (distance > 0) {

        angle =
            Math.atan2(
                dy,
                dx
            );
    }


    const strength =
        CONFIG.mouseStrength *
        easedForce;


    return {

        x:
            x +
            Math.cos(angle) *
            strength,

        y:
            y +
            Math.sin(angle) *
            strength
    };
}


/* =========================================================
   DRAW DITHER
   ========================================================= */

function drawDither() {

    /*
        Scale according to screen width.

        1440px = original scale.
    */

    const scale =
        Math.max(
            0.75,
            Math.min(
                width / 1440,
                1.5
            )
        );


    /*
        Actual square pixel.
    */

    const pixel =
        CONFIG.pixelSize *
        scale;


    /*
        Distance from one pixel
        to the next.
    */

    const step =
        (
            CONFIG.pixelSize +
            CONFIG.pixelGap
        ) *
        scale;


    const startY =
        height *
        CONFIG.ditherStart;


    const endY =
        height *
        CONFIG.ditherEnd;


    /*
        Number of Bayer cells across
        the screen.

        We use the physical grid
        rather than a random pattern.
    */

    const matrixCellSize =
        step;


    /*
        Loop through every pixel position.
    */

    for (
        let row = 0,
        y = startY;

        y < endY;

        row++,
        y += matrixCellSize
    ) {


        /*
            Dither density for this row.
        */

        const density =
            getDitherDensity(y);


        /*
            Bayer row.
        */

        const bayerRow =
            row % 4;


        for (
            let column = 0,
            x = 0;

            x < width;

            column++,
            x += matrixCellSize
        ) {


            /*
                Bayer column.
            */

            const bayerColumn =
                column % 4;


            /*
                Get threshold
                from Bayer matrix.
            */

            const threshold =
                (
                    BAYER[
                        bayerRow
                    ][
                        bayerColumn
                    ] + 0.5
                ) / 16;


            /*
                Decide whether this
                pixel should exist.

                This is the actual
                ordered dithering step.
            */

            if (
                density <=
                threshold
            ) {

                continue;
            }


            /* ---------------------------------------------
               CURSOR DISTORTION
               --------------------------------------------- */

            const distorted =
                distortPoint(
                    x,
                    y
                );


            /* ---------------------------------------------
               DITHER OPACITY
               --------------------------------------------- */

            let opacity =
                0.72;


            /*
                Slightly stronger near bottom.
            */

            opacity +=
                density *
                0.18;


            /* ---------------------------------------------
               CURSOR EFFECT
               --------------------------------------------- */

            if (mouse.active) {

                const dx =
                    x - mouse.x;

                const dy =
                    y - mouse.y;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distance <
                    CONFIG.mouseRadius
                ) {

                    const proximity =
                        1 -
                        (
                            distance /
                            CONFIG.mouseRadius
                        );


                    /*
                        Darken the dither
                        around cursor.
                    */

                    opacity +=
                        proximity *
                        0.12;
                }
            }


            /*
                Prevent opacity from
                exceeding 1.
            */

            opacity =
                Math.min(
                    opacity,
                    1
                );


            /* ---------------------------------------------
               DRAW SQUARE
               --------------------------------------------- */

            ctx.fillStyle =
                `rgba(
                    0,
                    0,
                    0,
                    ${opacity}
                )`;


            ctx.fillRect(
                distorted.x,
                distorted.y,
                pixel,
                pixel
            );
        }
    }
}


/* =========================================================
   CURSOR RED GLOW
   ========================================================= */

function drawMouseGlow() {

    if (!mouse.active) {
        return;
    }


    const radius =
        CONFIG.mouseRadius *
        1.35;


    const gradient =
        ctx.createRadialGradient(
            mouse.x,
            mouse.y,
            0,

            mouse.x,
            mouse.y,
            radius
        );


    /*
        Subtle red glow.
    */

    gradient.addColorStop(
        0,
        "rgba(248, 14, 0, 0.20)"
    );


    gradient.addColorStop(
        0.30,
        "rgba(248, 14, 0, 0.10)"
    );


    gradient.addColorStop(
        0.65,
        "rgba(248, 14, 0, 0.04)"
    );


    gradient.addColorStop(
        1,
        "rgba(248, 14, 0, 0)"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        mouse.x - radius,
        mouse.y - radius,
        radius * 2,
        radius * 2
    );
}


/* =========================================================
   MAIN ANIMATION
   ========================================================= */

function animate() {

    /*
        Update cursor.
    */

    updateMouse();


    /*
        Draw red → black background.
    */

    drawBackground();


    /*
        Draw square ordered dither.
    */

    drawDither();


    /*
        Draw cursor interaction.
    */

    drawMouseGlow();


    /*
        Continue animation.
    */

    requestAnimationFrame(
        animate
    );
}


/* =========================================================
   START
   ========================================================= */

animate();












/* =========================================================
   INTRO
========================================================= */

const intro = document.getElementById("intro");
const introButton = document.getElementById("intro-button");
const introVideo = document.getElementById("intro-video");
const blackFade = document.getElementById("black-fade");


/* =========================================================
   CLICK INTRO BUTTON
========================================================= */

introButton.addEventListener("click", () => {

    // Fade out intro
    intro.classList.add("hide");


    // Stop video after intro fade
    setTimeout(() => {

        introVideo.pause();

    }, 800);


    // Fade out black overlay
    setTimeout(() => {

        blackFade.classList.add("hide");

    }, 800);

});


