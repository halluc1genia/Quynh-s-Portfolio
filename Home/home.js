// =====================================================
// CANVAS
// =====================================================

const canvas =
    document.getElementById("dither");

const ctx =
    canvas.getContext("2d");


const faceBacking =
    document.getElementById("faceBacking");

const handBacking =
    document.getElementById("handBacking");


const faceCanvas =
    document.getElementById("faceCanvas");

const faceCtx =
    faceCanvas.getContext("2d");


const handCanvas =
    document.getElementById("handCanvas");

const handCtx =
    handCanvas.getContext("2d");


// =====================================================
// SETTINGS
// =====================================================

const cellSize = 2;

const pixelSize = 2;

const assetPixelSize = 2;


// =====================================================
// BACKING SETTINGS
// =====================================================

const backingScale = 1.05;

const backingOffsetY = -0.01;

const borderThickness = 5;

const borderPixelSize = 3;


// =====================================================
// BORDER FLICKER SETTINGS
// =====================================================

const borderFlickerSpeed = 0.006;

const borderAccentAmount = 0.30;


// =====================================================
// CLOUD SPEED
// =====================================================

const cloudSpeedX = 0.000025;

const cloudSpeedY = 0.000012;


// =====================================================
// PALETTE
// =====================================================

const palette = [

    [5, 8, 15],

    [18, 25, 38],

    [38, 48, 62],

    [65, 78, 95],

    [0, 98, 255],

    [38, 112, 235],

    [105, 145, 185],

    [112, 128, 103],

    [205, 205, 198],

    [248, 14, 0],

    [125, 105, 28]

];


// =====================================================
// MOUSE
// =====================================================

let mouseX = -1000;

let mouseY = -1000;


window.addEventListener(
    "mousemove",
    (event) => {

        mouseX = event.clientX;

        mouseY = event.clientY;

    }
);


// =====================================================
// BAYER MATRIX
// =====================================================

const bayer = [

    [0, 8, 2, 10],

    [12, 4, 14, 6],

    [3, 11, 1, 9],

    [15, 7, 13, 5]

];


// =====================================================
// BAYER THRESHOLD
// =====================================================

function getBayerThreshold(
    x,
    y,
    size
) {

    const bx =
        Math.floor(x / size) % 4;

    const by =
        Math.floor(y / size) % 4;

    return (
        bayer[by][bx] + 0.5
    ) / 16;

}


// =====================================================
// MOUSE FADE
// =====================================================

function getMouseFade(
    x,
    y,
    time
) {

    const dx =
        x - mouseX;

    const dy =
        y - mouseY;

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
        62 + distortion;

    let fade =
        distance / radius;

    fade =
        Math.min(
            fade,
            1
        );

    fade =
        fade *
        fade *
        (3 - 2 * fade);

    return fade;

}


// =====================================================
// HASH
// =====================================================

function hash(
    x,
    y
) {

    const value =
        Math.sin(
            x * 127.1 +
            y * 311.7
        ) * 43758.5453123;

    return (
        value -
        Math.floor(value)
    );

}


// =====================================================
// SMOOTH NOISE
// =====================================================

function smoothNoise(
    x,
    y
) {

    const x0 =
        Math.floor(x);

    const y0 =
        Math.floor(y);

    const x1 =
        x0 + 1;

    const y1 =
        y0 + 1;

    const sx =
        x - x0;

    const sy =
        y - y0;

    const u =
        sx * sx *
        (3 - 2 * sx);

    const v =
        sy * sy *
        (3 - 2 * sy);

    const n00 =
        hash(x0, y0);

    const n10 =
        hash(x1, y0);

    const n01 =
        hash(x0, y1);

    const n11 =
        hash(x1, y1);

    const nx0 =
        n00 +
        (n10 - n00) * u;

    const nx1 =
        n01 +
        (n11 - n01) * u;

    return (
        nx0 +
        (nx1 - nx0) * v
    );

}


// =====================================================
// CLOUD NOISE
// =====================================================

function cloudNoise(
    x,
    y,
    time
) {

    const moveX =
        time * cloudSpeedX;

    const moveY =
        time * cloudSpeedY;

    const large =
        smoothNoise(
            (x + moveX * 900) * 0.0028,
            (y + moveY * 900) * 0.0028
        );

    const medium =
        smoothNoise(
            (x - moveX * 500) * 0.0065,
            (y + moveY * 500) * 0.0065
        );

    const small =
        smoothNoise(
            (x + moveX * 300) * 0.015,
            (y - moveY * 300) * 0.015
        );

    const tiny =
        smoothNoise(
            (x - moveX * 180) * 0.030,
            (y + moveY * 180) * 0.030
        );

    return (

        large * 0.58 +

        medium * 0.25 +

        small * 0.12 +

        tiny * 0.05

    );

}


// =====================================================
// CLOUD DENSITY
// =====================================================

function getDensity(
    x,
    y,
    time
) {

    const noise =
        cloudNoise(
            x,
            y,
            time
        );

    return Math.pow(
        noise,
        1.35
    );

}


// =====================================================
// COLOUR FIELD
// =====================================================

function getColourField(
    x,
    y,
    time
) {

    const slowTime =
        time * 0.00008;

    const field1 =
        smoothNoise(
            x * 0.004 +
            slowTime,
            y * 0.004
        );

    const field2 =
        smoothNoise(
            x * 0.009 -
            slowTime * 0.6,
            y * 0.009 +
            slowTime * 0.4
        );

    const field3 =
        smoothNoise(
            x * 0.018 +
            slowTime * 0.3,
            y * 0.018 -
            slowTime * 0.2
        );

    return (

        field1 * 0.55 +

        field2 * 0.30 +

        field3 * 0.15

    );

}


// =====================================================
// PIXEL FLICKER
// =====================================================

function getPixelFlicker(
    x,
    y,
    time
) {

    const t =
        Math.floor(
            time * 0.006
        );

    const value =
        Math.sin(
            x * 12.9898 +
            y * 78.233 +
            t * 17.719
        ) * 43758.5453;

    return (
        value -
        Math.floor(value)
    );

}


// =====================================================
// BORDER FLICKER
// =====================================================

function getBorderFlicker(
    x,
    y,
    time
) {

    const t =
        Math.floor(
            time *
            borderFlickerSpeed
        );

    const value =
        Math.sin(
            x * 12.9898 +
            y * 78.233 +
            t * 17.719
        ) * 43758.5453;

    return (
        value -
        Math.floor(value)
    );

}


// =====================================================
// CLOUD COLOUR
// =====================================================

function getCloudColour(
    density,
    x,
    y,
    time
) {

    const colourField =
        getColourField(
            x,
            y,
            time
        );

    const flicker =
        getPixelFlicker(
            x,
            y,
            time
        );


    if (density < 0.16) {

        return palette[1];

    }


    if (density < 0.30) {

        if (colourField < 0.55) {

            return palette[2];

        }

        return palette[3];

    }


    if (density < 0.44) {

        if (flicker < 0.08) {
            return palette[8];
        }

        if (flicker < 0.14) {
            return palette[10];
        }

        if (flicker < 0.20) {
            return palette[9];
        }

        if (flicker < 0.26) {
            return palette[7];
        }

        if (colourField < 0.25) {
            return palette[3];
        }

        return palette[4];

    }


    if (density < 0.60) {

        if (colourField < 0.20) {

            return palette[3];

        }

        if (colourField < 0.85) {

            return palette[4];

        }

        return palette[5];

    }


    if (density < 0.76) {

        if (colourField < 0.30) {

            return palette[4];

        }

        if (colourField < 0.50) {

            return palette[3];

        }

        if (flicker < 0.1) {
            return palette[8];
        }

        if (flicker < 0.18) {
            return palette[10];
        }

        if (flicker < 0.25) {
            return palette[9];
        }

        if (flicker < 0.32) {
            return palette[7];
        }

        if (flicker < 0.42) {
            return palette[6];
        }

        return palette[4];

    }


    if (density < 0.90) {

        if (flicker < 0.24) {
            return palette[4];
        }

        if (flicker < 0.40) {
            return palette[3];
        }

        if (flicker < 0.440) {
            return palette[8];
        }

        if (flicker < 0.470) {
            return palette[10];
        }

        if (flicker < 0.495) {
            return palette[9];
        }

        if (flicker < 0.520) {
            return palette[7];
        }

        return palette[4];

    }


    if (flicker < 0.30) {
        return palette[4];
    }

    if (flicker < 0.48) {
        return palette[6];
    }

    if (flicker < 0.502) {
        return palette[8];
    }

    if (flicker < 0.517) {
        return palette[10];
    }

    if (flicker < 0.529) {
        return palette[9];
    }

    return palette[4];

}


// =====================================================
// ASSET IMAGES
// =====================================================

let faceImage = null;

let handImage = null;


// =====================================================
// ASSET SIZE
// =====================================================

function getAssetSize(
    canvasElement,
    image
) {

    const rect =
        canvasElement.getBoundingClientRect();

    const width =
        Math.round(
            rect.width
        );

    const height =
        Math.round(
            width *
            image.naturalHeight /
            image.naturalWidth
        );

    return {
        width,
        height
    };

}


// =====================================================
// ASSET DITHER COLOUR
// =====================================================

function getAssetColour(
    brightness,
    x,
    y
) {

    const random =
        hash(x, y);


    if (brightness < 0.15) {
        return palette[1];
    }

    if (brightness < 0.30) {
        return palette[2];
    }

    if (brightness < 0.43) {
        return palette[3];
    }

    if (brightness < 0.62) {
        return palette[4];
    }

    if (brightness < 0.78) {
        return palette[5];
    }

    if (random < 0.68) {
        return palette[4];
    }

    if (random < 0.82) {
        return palette[6];
    }

    if (random < 0.92) {
        return palette[8];
    }

    if (random < 0.97) {
        return palette[9];
    }

    return palette[10];

}


// =====================================================
// CANVAS RESIZE
// =====================================================

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}


// =====================================================
// BACKING DATA
// =====================================================

let faceBackingData = null;

let handBackingData = null;


// =====================================================
// CREATE BACKING
// =====================================================

function buildBacking(
    image,
    assetCanvas,
    backingCanvas
) {

    const assetRect =
        assetCanvas.getBoundingClientRect();

    const assetWidth =
        Math.max(
            1,
            Math.round(
                assetRect.width
            )
        );

    const assetHeight =
        Math.max(
            1,
            Math.round(
                assetRect.height
            )
        );

    const backingWidth =
        Math.round(
            assetWidth *
            backingScale
        );

    const backingHeight =
        Math.round(
            assetHeight *
            backingScale
        );

    backingCanvas.width =
        backingWidth;

    backingCanvas.height =
        backingHeight;

    const bctx =
        backingCanvas.getContext("2d");

    bctx.clearRect(
        0,
        0,
        backingWidth,
        backingHeight
    );


    // =================================================
    // DRAW ORIGINAL ASSET ALPHA
    // =================================================

    const offsetX =
        (
            backingWidth -
            assetWidth
        ) / 2;

    const offsetY =
        (
            backingHeight -
            assetHeight
        ) / 2;

    bctx.drawImage(
        image,
        offsetX,
        offsetY,
        assetWidth,
        assetHeight
    );


    const sourceData =
        bctx.getImageData(
            0,
            0,
            backingWidth,
            backingHeight
        );

    const source =
        sourceData.data;


    // =================================================
    // EXPAND SILHOUETTE
    // =================================================

    const expandedCanvas =
        document.createElement("canvas");

    expandedCanvas.width =
        backingWidth;

    expandedCanvas.height =
        backingHeight;

    const expandedCtx =
        expandedCanvas.getContext("2d");

    const expandedImage =
        expandedCtx.createImageData(
            backingWidth,
            backingHeight
        );

    const expanded =
        expandedImage.data;

    const expandX =
        Math.max(
            2,
            Math.round(
                assetWidth *
                (backingScale - 1) /
                2
            )
        );

    const expandY =
        Math.max(
            2,
            Math.round(
                assetHeight *
                (backingScale - 1) /
                2
            )
        );


    for (
        let y = 0;
        y < backingHeight;
        y++
    ) {

        for (
            let x = 0;
            x < backingWidth;
            x++
        ) {

            let found = false;


            for (
                let oy = -expandY;
                oy <= expandY && !found;
                oy += 2
            ) {

                const sy =
                    y + oy;


                if (
                    sy < 0 ||
                    sy >= backingHeight
                ) {

                    continue;

                }


                for (
                    let ox = -expandX;
                    ox <= expandX;
                    ox += 2
                ) {

                    const sx =
                        x + ox;


                    if (
                        sx < 0 ||
                        sx >= backingWidth
                    ) {

                        continue;

                    }


                    const index =
                        (
                            sy *
                            backingWidth +
                            sx
                        ) * 4;


                    if (
                        source[index + 3] > 20
                    ) {

                        found = true;

                        break;

                    }

                }

            }


            if (found) {

                const index =
                    (
                        y *
                        backingWidth +
                        x
                    ) * 4;


                expanded[index] = 0;

                expanded[index + 1] = 0;

                expanded[index + 2] = 0;

                expanded[index + 3] = 255;

            }

        }

    }


    expandedCtx.putImageData(
        expandedImage,
        0,
        0
    );


    // =================================================
    // ORIGINAL ASSET MASK
    // =================================================

    const originalCanvas =
        document.createElement("canvas");

    originalCanvas.width =
        backingWidth;

    originalCanvas.height =
        backingHeight;

    const originalCtx =
        originalCanvas.getContext("2d");


    originalCtx.drawImage(
        image,
        offsetX,
        offsetY,
        assetWidth,
        assetHeight
    );


    const originalData =
        originalCtx.getImageData(
            0,
            0,
            backingWidth,
            backingHeight
        );


    // =================================================
    // SAVE MASKS
    // =================================================

    const expandedData =
        expandedCtx.getImageData(
            0,
            0,
            backingWidth,
            backingHeight
        );


    // =================================================
    // CLEAR VISIBLE BACKING
    // =================================================

    bctx.clearRect(
        0,
        0,
        backingWidth,
        backingHeight
    );


    // =================================================
    // DRAW BLACK BACKING
    // =================================================

    bctx.putImageData(
        expandedImage,
        0,
        0
    );


    // =================================================
    // BORDER MASK
    // =================================================

    const borderMask =
        new Uint8Array(
            backingWidth *
            backingHeight
        );


    for (
        let y = 0;
        y < backingHeight;
        y += borderPixelSize
    ) {

        for (
            let x = 0;
            x < backingWidth;
            x += borderPixelSize
        ) {

            const index =
                (
                    y *
                    backingWidth +
                    x
                ) * 4;


            if (
                expandedData.data[
                    index + 3
                ] < 20
            ) {

                continue;

            }


            if (
                originalData.data[
                    index + 3
                ] > 35
            ) {

                continue;

            }


            const threshold =
                getBayerThreshold(
                    x,
                    y,
                    borderPixelSize
                );


            if (
                threshold > 0.48
            ) {

                continue;

            }


            borderMask[
                y *
                backingWidth +
                x
            ] = 1;

        }

    }


    return {

        canvas: backingCanvas,

        width: backingWidth,

        height: backingHeight,

        data: expandedData,

        borderMask: borderMask,

        original: originalData

    };

}


// =====================================================
// DRAW FLICKER BORDER
// =====================================================

function drawBackingBorder(
    backingCanvas,
    backingData,
    time
) {

    if (!backingData) {

        return;

    }


    const bctx =
        backingCanvas.getContext("2d");

    const width =
        backingData.width;

    const height =
        backingData.height;


    // =================================================
    // RESET
    // =================================================

    bctx.clearRect(
        0,
        0,
        width,
        height
    );


    bctx.putImageData(
        backingData.data,
        0,
        0
    );


    // =================================================
    // FLICKER BORDER
    // =================================================

    for (
        let y = 0;
        y < height;
        y += borderPixelSize
    ) {

        for (
            let x = 0;
            x < width;
            x += borderPixelSize
        ) {

            const maskIndex =
                y *
                width +
                x;


            if (
                backingData.borderMask[
                    maskIndex
                ] !== 1
            ) {

                continue;

            }


            const flicker =
                getBorderFlicker(
                    x,
                    y,
                    time
                );


            const threshold =
                getBayerThreshold(
                    x,
                    y,
                    borderPixelSize
                );


            const visibility =
                0.55 +
                flicker * 0.45;


            if (
                visibility <
                threshold * 1.35
            ) {

                continue;

            }


            let colour;


            if (flicker < 0.38) {

                colour =
                    palette[6];

            }

            else if (flicker < 0.58) {

                colour =
                    palette[3];

            }

            else if (flicker < 0.75) {

                colour =
                    palette[4];

            }

            else if (flicker < 0.82) {

                colour =
                    palette[8];

            }

            else if (flicker < 0.88) {

                colour =
                    palette[10];

            }

            else if (flicker < 0.93) {

                colour =
                    palette[9];

            }

            else {

                colour =
                    palette[7];

            }


            bctx.fillStyle =
                `rgb(
                    ${colour[0]},
                    ${colour[1]},
                    ${colour[2]}
                )`;


            bctx.fillRect(
                x,
                y,
                borderPixelSize,
                borderPixelSize
            );

        }

    }

}


// =====================================================
// POSITION BACKING
// =====================================================

function positionBacking(
    assetCanvas,
    backingCanvas
) {

    const rect =
        assetCanvas.getBoundingClientRect();

    const backingWidth =
        backingCanvas.width;

    const backingHeight =
        backingCanvas.height;

    const assetCenterX =
        rect.left +
        rect.width / 2;

    const assetCenterY =
        rect.top +
        rect.height / 2;

    const backingCenterY =
        assetCenterY +
        rect.height *
        backingOffsetY;


    backingCanvas.style.width =
        `${backingWidth}px`;

    backingCanvas.style.height =
        `${backingHeight}px`;

    backingCanvas.style.left =
        `${assetCenterX - backingWidth / 2}px`;

    backingCanvas.style.top =
        `${backingCenterY - backingHeight / 2}px`;

    backingCanvas.style.transform =
        "none";

}


// =====================================================
// BUILD ALL BACKINGS
// =====================================================

function rebuildBackings() {

    if (
        !faceImage ||
        !handImage
    ) {

        return;

    }


    faceBackingData =
        buildBacking(
            faceImage,
            faceCanvas,
            faceBacking
        );


    handBackingData =
        buildBacking(
            handImage,
            handCanvas,
            handBacking
        );


    positionBacking(
        faceCanvas,
        faceBacking
    );


    positionBacking(
        handCanvas,
        handBacking
    );

}


// =====================================================
// CLOUD MASK CHECK
// =====================================================

function isInsideBacking(
    x,
    y
) {

    // =================================================
    // FACE
    // =================================================

    if (faceBackingData) {

        const rect =
            faceBacking.getBoundingClientRect();


        if (
            x >= rect.left &&
            x < rect.right &&
            y >= rect.top &&
            y < rect.bottom
        ) {

            const localX =
                Math.floor(
                    (
                        x -
                        rect.left
                    ) *
                    faceBacking.width /
                    rect.width
                );


            const localY =
                Math.floor(
                    (
                        y -
                        rect.top
                    ) *
                    faceBacking.height /
                    rect.height
                );


            if (
                localX >= 0 &&
                localY >= 0 &&
                localX < faceBacking.width &&
                localY < faceBacking.height
            ) {

                const index =
                    (
                        localY *
                        faceBacking.width +
                        localX
                    ) * 4;


                if (
                    faceBackingData.data[
                        index + 3
                    ] > 20
                ) {

                    return true;

                }

            }

        }

    }


    // =================================================
    // HAND
    // =================================================

    if (handBackingData) {

        const rect =
            handBacking.getBoundingClientRect();


        if (
            x >= rect.left &&
            x < rect.right &&
            y >= rect.top &&
            y < rect.bottom
        ) {

            const localX =
                Math.floor(
                    (
                        x -
                        rect.left
                    ) *
                    handBacking.width /
                    rect.width
                );


            const localY =
                Math.floor(
                    (
                        y -
                        rect.top
                    ) *
                    handBacking.height /
                    rect.height
                );


            if (
                localX >= 0 &&
                localY >= 0 &&
                localX < handBacking.width &&
                localY < handBacking.height
            ) {

                const index =
                    (
                        localY *
                        handBacking.width +
                        localX
                    ) * 4;


                if (
                    handBackingData.data[
                        index + 3
                    ] > 20
                ) {

                    return true;

                }

            }

        }

    }


    return false;

}


// =====================================================
// DRAW CLOUD
// =====================================================

function drawCloud(
    time
) {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (
        let y = 0;
        y < canvas.height;
        y += cellSize
    ) {

        for (
            let x = 0;
            x < canvas.width;
            x += cellSize
        ) {

            if (
                isInsideBacking(
                    x,
                    y
                )
            ) {

                continue;

            }


            let density =
                getDensity(
                    x,
                    y,
                    time
                );


            const mouseFade =
                getMouseFade(
                    x,
                    y,
                    time
                );


            density *=
                0.68 +
                mouseFade * 0.32;


            if (
                density < 0.12
            ) {

                continue;

            }


            const threshold =
                getBayerThreshold(
                    x,
                    y,
                    cellSize
                );


            const colourPosition =
                density *
                (
                    palette.length - 1
                );


            const fractional =
                colourPosition -
                Math.floor(
                    colourPosition
                );


            if (
                fractional <
                threshold
            ) {

                continue;

            }


            const colour =
                getCloudColour(
                    density,
                    x,
                    y,
                    time
                );


            ctx.fillStyle =
                `rgb(
                    ${colour[0]},
                    ${colour[1]},
                    ${colour[2]}
                )`;


            ctx.fillRect(
                x,
                y,
                pixelSize,
                pixelSize
            );

        }

    }

}


// =====================================================
// DITHER ASSET
// =====================================================

function ditherImage(
    image,
    canvasElement,
    context,
    time
) {

    const size =
        getAssetSize(
            canvasElement,
            image
        );


    if (
        size.width <= 0 ||
        size.height <= 0
    ) {

        return;

    }


    canvasElement.width =
        size.width;

    canvasElement.height =
        size.height;


    const tempCanvas =
        document.createElement("canvas");

    const tempCtx =
        tempCanvas.getContext("2d");


    tempCanvas.width =
        size.width;

    tempCanvas.height =
        size.height;


    tempCtx.drawImage(
        image,
        0,
        0,
        size.width,
        size.height
    );


    const imageData =
        tempCtx.getImageData(
            0,
            0,
            size.width,
            size.height
        );


    const pixels =
        imageData.data;


    context.clearRect(
        0,
        0,
        canvasElement.width,
        canvasElement.height
    );


    const rect =
        canvasElement.getBoundingClientRect();


    for (
        let y = 0;
        y < size.height;
        y += assetPixelSize
    ) {

        for (
            let x = 0;
            x < size.width;
            x += assetPixelSize
        ) {

            const sampleX =
                Math.min(
                    x,
                    size.width - 1
                );


            const sampleY =
                Math.min(
                    y,
                    size.height - 1
                );


            const index =
                (
                    sampleY *
                    size.width +
                    sampleX
                ) * 4;


            const red =
                pixels[index];

            const green =
                pixels[index + 1];

            const blue =
                pixels[index + 2];

            const alpha =
                pixels[index + 3];


            if (
                alpha < 20
            ) {

                continue;

            }


            // =================================================
            // BRIGHTNESS
            // =================================================

            const brightness =
                (
                    red * 0.299 +
                    green * 0.587 +
                    blue * 0.114
                ) / 255;


            const assetContrast =
                Math.pow(
                    brightness,
                    0.68
                );


            // =================================================
            // SCREEN COORDINATES
            // =================================================

            const scaleX =
                rect.width /
                canvasElement.width;


            const scaleY =
                rect.height /
                canvasElement.height;


            const screenX =
                rect.left +
                x * scaleX;


            const screenY =
                rect.top +
                y * scaleY;


            // =================================================
            // MOUSE
            // =================================================

            const mouseFade =
                getMouseFade(
                    screenX,
                    screenY,
                    time
                );


            const assetVisibility =
                0.70 +
                mouseFade * 0.30;


            // =================================================
            // BAYER
            // =================================================

            const threshold =
                getBayerThreshold(
                    x,
                    y,
                    assetPixelSize
                );


            const ditherValue =
                assetContrast *
                assetVisibility;


            if (
                ditherValue <
                threshold
            ) {

                continue;

            }


            // =================================================
            // COLOUR
            // =================================================

            const colour =
                getAssetColour(
                    brightness,
                    x,
                    y
                );


            context.fillStyle =
                `rgba(
                    ${colour[0]},
                    ${colour[1]},
                    ${colour[2]},
                    ${alpha / 255}
                )`;


            context.fillRect(
                x,
                y,
                assetPixelSize,
                assetPixelSize
            );

        }

    }

}


// =====================================================
// LOAD IMAGE
// =====================================================

function loadImage(
    src
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const image =
                new Image();


            image.onload =
                () => {

                    resolve(
                        image
                    );

                };


            image.onerror =
                () => {

                    reject(
                        new Error(
                            "Could not load: " +
                            src
                        )
                    );

                };


            image.src =
                src;

        }
    );

}


// =====================================================
// LOAD ASSETS
// =====================================================

async function loadAssets() {

    try {

        /*
            IMPORTANT:

            home.html is inside:

            /Home/

            therefore assets inside:

            /Images/Home/

            must use:

            ../Images/Home/
        */


        faceImage =
            await loadImage(
                "../Images/Home/Face.png"
            );


        handImage =
            await loadImage(
                "../Images/Home/Hand.png"
            );


        // =================================================
        // DITHER ASSETS FIRST
        // =================================================

        ditherImage(
            faceImage,
            faceCanvas,
            faceCtx,
            0
        );


        ditherImage(
            handImage,
            handCanvas,
            handCtx,
            0
        );


        // =================================================
        // CREATE BACKINGS
        // =================================================

        rebuildBackings();


    } catch (error) {

        console.error(
            error
        );

    }

}


// =====================================================
// DRAW ASSETS
// =====================================================

function drawAssets(
    time
) {

    if (
        !faceImage ||
        !handImage
    ) {

        return;

    }


    // =================================================
    // ASSET DITHERING
    // =================================================

    ditherImage(
        faceImage,
        faceCanvas,
        faceCtx,
        time
    );


    ditherImage(
        handImage,
        handCanvas,
        handCtx,
        time
    );


    // =================================================
    // FLICKER BORDER
    // =================================================

    drawBackingBorder(
        faceBacking,
        faceBackingData,
        time
    );


    drawBackingBorder(
        handBacking,
        handBackingData,
        time
    );

}


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    () => {

        resizeCanvas();


        if (
            faceImage &&
            handImage
        ) {

            const time =
                performance.now();


            ditherImage(
                faceImage,
                faceCanvas,
                faceCtx,
                time
            );


            ditherImage(
                handImage,
                handCanvas,
                handCtx,
                time
            );


            rebuildBackings();

        }

    }
);


// =====================================================
// ANIMATION
// =====================================================

function animate(
    time
) {

    // =================================================
    // BACKGROUND CLOUD
    // =================================================

    drawCloud(
        time
    );


    // =================================================
    // ASSETS + BORDER
    // =================================================

    drawAssets(
        time
    );


    requestAnimationFrame(
        animate
    );

}


// =====================================================
// START
// =====================================================

resizeCanvas();

loadAssets();

requestAnimationFrame(
    animate
);









