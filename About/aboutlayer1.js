// =====================================================
// ABOUT — LAYER 1
// GRAYSCALE BAYER DITHER
// =====================================================


// =====================================================
// ELEMENTS
// =====================================================

const aboutImage =
    document.getElementById(
        "aboutLayer1Image"
    );


const aboutCanvas =
    document.getElementById(
        "aboutLayer1Canvas"
    );


const aboutCtx =
    aboutCanvas.getContext(
        "2d"
    );


// =====================================================
// SETTINGS
// =====================================================

// -----------------------------------------------------
// DITHER PIXEL SIZE
// -----------------------------------------------------

const aboutPixelSize = 1.5;


// -----------------------------------------------------
// BRIGHTNESS
// -----------------------------------------------------

const aboutBrightnessGamma = 0.90;


// -----------------------------------------------------
// CONTRAST
// -----------------------------------------------------

const aboutContrast = 1.45;


// -----------------------------------------------------
// DITHER STRENGTH
// -----------------------------------------------------

const aboutDitherStrength = 0.95;


// =====================================================
// MOUSE
// =====================================================

let aboutMouseX = -1000;

let aboutMouseY = -1000;


window.addEventListener(
    "mousemove",
    (event) => {

        aboutMouseX =
            event.clientX;

        aboutMouseY =
            event.clientY;

    }
);


// =====================================================
// BAYER MATRIX
// =====================================================

const aboutBayer = [

    [0, 8, 2, 10],

    [12, 4, 14, 6],

    [3, 11, 1, 9],

    [15, 7, 13, 5]

];


// =====================================================
// BAYER THRESHOLD
// =====================================================

function getAboutBayerThreshold(
    x,
    y
) {

    const bx =
        Math.floor(
            x / aboutPixelSize
        ) % 4;


    const by =
        Math.floor(
            y / aboutPixelSize
        ) % 4;


    return (
        aboutBayer[by][bx] + 0.5
    ) / 16;

}


// =====================================================
// MOUSE FADE
// SAME LOGIC AS HOME
// =====================================================

function getAboutMouseFade(
    x,
    y,
    time
) {

    const dx =
        x -
        aboutMouseX;


    const dy =
        y -
        aboutMouseY;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const angle =
        Math.atan2(
            dy,
            dx
        );


    // =================================================
    // ANGULAR DISTORTION
    // =================================================

    const distortion =

        Math.sin(
            angle * 5 +
            time * 0.00035
        ) * 7

        +

        Math.sin(
            angle * 8 -
            time * 0.00025
        ) * 4

        +

        Math.sin(
            angle * 11 +
            time * 0.00020
        ) * 2;


    const radius =
        62 +
        distortion;


    // =================================================
    // DISTANCE
    // =================================================

    let fade =
        distance /
        radius;


    fade =
        Math.min(
            fade,
            1
        );


    // =================================================
    // SMOOTHSTEP
    // =================================================

    fade =
        fade *
        fade *
        (3 - 2 * fade);


    return fade;

}


// =====================================================
// DRAW DITHER
// =====================================================

function drawAboutDither(
    time
) {

    // =================================================
    // IMAGE CHECK
    // =================================================

    if (
        !aboutImage ||
        !aboutImage.complete ||
        aboutImage.naturalWidth === 0
    ) {

        return;

    }


    // =================================================
    // VIEWPORT
    // =================================================

    const width =
        window.innerWidth;


    const height =
        window.innerHeight;


    // =================================================
    // CANVAS SIZE
    // =================================================

    if (
        aboutCanvas.width !== width ||
        aboutCanvas.height !== height
    ) {

        aboutCanvas.width =
            width;

        aboutCanvas.height =
            height;

    }


    // =================================================
    // CLEAR
    // =================================================

    aboutCtx.clearRect(
        0,
        0,
        width,
        height
    );


    // =================================================
    // SOURCE IMAGE SIZE
    // =================================================

    const sourceWidth =
        aboutImage.naturalWidth;


    const sourceHeight =
        aboutImage.naturalHeight;


    const sourceRatio =
        sourceWidth /
        sourceHeight;


    const viewportRatio =
        width /
        height;


    // =================================================
    // OBJECT-FIT: CONTAIN
    // =================================================

    let imageWidth;

    let imageHeight;


    if (
        sourceRatio >
        viewportRatio
    ) {

        imageWidth =
            width;


        imageHeight =
            width /
            sourceRatio;

    }

    else {

        imageHeight =
            height;


        imageWidth =
            height *
            sourceRatio;

    }


    // =================================================
    // IMAGE POSITION
    // =================================================

    const imageLeft =
        (
            width -
            imageWidth
        ) / 2;


    const imageTop =
        (
            height -
            imageHeight
        ) / 2;


    // =================================================
    // TEMP CANVAS
    // =================================================

    const tempCanvas =
        document.createElement(
            "canvas"
        );


    const tempCtx =
        tempCanvas.getContext(
            "2d"
        );


    tempCanvas.width =
        Math.ceil(
            imageWidth
        );


    tempCanvas.height =
        Math.ceil(
            imageHeight
        );


    // =================================================
    // DRAW SOURCE
    // =================================================

    tempCtx.drawImage(

        aboutImage,

        0,
        0,

        imageWidth,
        imageHeight

    );


    // =================================================
    // GET PIXELS
    // =================================================

    const imageData =
        tempCtx.getImageData(

            0,
            0,

            tempCanvas.width,
            tempCanvas.height

        );


    const pixels =
        imageData.data;


    // =================================================
    // DITHER
    // =================================================

    for (
        let y = 0;
        y < imageHeight;
        y += aboutPixelSize
    ) {

        for (
            let x = 0;
            x < imageWidth;
            x += aboutPixelSize
        ) {

            // =================================================
            // SAMPLE POSITION
            // =================================================

            const sampleX =
                Math.min(
                    Math.floor(x),
                    tempCanvas.width - 1
                );


            const sampleY =
                Math.min(
                    Math.floor(y),
                    tempCanvas.height - 1
                );


            const index =
                (
                    sampleY *
                    tempCanvas.width +
                    sampleX
                ) * 4;


            // =================================================
            // RGB
            // =================================================

            const red =
                pixels[index];


            const green =
                pixels[index + 1];


            const blue =
                pixels[index + 2];


            const alpha =
                pixels[index + 3];


            // =================================================
            // ALPHA
            // =================================================

            if (
                alpha < 20
            ) {

                continue;

            }


            // =================================================
            // GRAYSCALE
            // =================================================

            const brightness =

                (
                    red * 0.299 +
                    green * 0.587 +
                    blue * 0.114
                ) / 255;


            // =================================================
            // GAMMA
            // =================================================

            let adjustedBrightness =

                Math.pow(
                    brightness,
                    aboutBrightnessGamma
                );


            // =================================================
            // CONTRAST
            // =================================================

            adjustedBrightness =

                (
                    adjustedBrightness -
                    0.5
                ) *
                aboutContrast +
                0.5;


            // =================================================
            // CLAMP
            // =================================================

            adjustedBrightness =

                Math.max(
                    0,
                    Math.min(
                        1,
                        adjustedBrightness
                    )
                );


            // =================================================
            // SCREEN COORDINATES
            // =================================================

            const screenX =
                imageLeft +
                x;


            const screenY =
                imageTop +
                y;


            // =================================================
            // MOUSE
            // =================================================

            const mouseFade =
                getAboutMouseFade(

                    screenX,
                    screenY,

                    time

                );


            // =================================================
            // HOME-STYLE VISIBILITY
            // =================================================

            const visibility =

                0.82 +
                mouseFade * 0.18;


            // =================================================
            // FINAL DITHER VALUE
            // =================================================

            const ditherValue =

                adjustedBrightness *
                visibility *
                aboutDitherStrength;


            // =================================================
            // BAYER
            // =================================================

            const threshold =
                getAboutBayerThreshold(
                    x,
                    y
                );


            // =================================================
            // SKIP PIXEL
            // =================================================

            if (
                ditherValue <
                threshold
            ) {

                continue;

            }


            // =================================================
            // DRAW BLACK PIXEL
            // =================================================

            aboutCtx.fillStyle =
                "rgb(0, 0, 0)";


            aboutCtx.fillRect(

                imageLeft + x,
                imageTop + y,

                aboutPixelSize,
                aboutPixelSize

            );

        }

    }

}


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    () => {

        if (
            !aboutCanvas
        ) {

            return;

        }


        aboutCanvas.width =
            window.innerWidth;


        aboutCanvas.height =
            window.innerHeight;

    }
);


// =====================================================
// ANIMATION
// =====================================================

function animateAbout(
    time
) {

    drawAboutDither(
        time
    );


    requestAnimationFrame(
        animateAbout
    );

}


// =====================================================
// START
// =====================================================

function startAbout() {

    // =================================================
    // IMAGE CHECK
    // =================================================

    if (
        !aboutImage
    ) {

        console.error(
            "aboutLayer1Image not found."
        );

        return;

    }


    // =================================================
    // CANVAS CHECK
    // =================================================

    if (
        !aboutCanvas
    ) {

        console.error(
            "aboutLayer1Canvas not found."
        );

        return;

    }


    // =================================================
    // INITIAL CANVAS SIZE
    // =================================================

    aboutCanvas.width =
        window.innerWidth;


    aboutCanvas.height =
        window.innerHeight;


    // =================================================
    // WAIT FOR IMAGE
    // =================================================

    if (
        aboutImage.complete &&
        aboutImage.naturalWidth > 0
    ) {

        requestAnimationFrame(
            animateAbout
        );

    }

    else {

        aboutImage.onload =
            () => {

                requestAnimationFrame(
                    animateAbout
                );

            };

    }

}


// =====================================================
// INIT
// =====================================================

startAbout();