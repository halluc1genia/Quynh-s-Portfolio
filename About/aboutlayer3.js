/* =====================================================
   ABOUT — LAYER 3

   Main Subject
   Red Dither
   Pixel Frame
   Floating Tabs
   Connector Lines
   Responsive Tab System
   Linked Tabs
   Read More
   Balanced Colors
   Design DNA
   Glitch Status
   Draggable Tabs
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const image =
    document.getElementById(
        "aboutLayer3Image"
    );


const canvas =
    document.getElementById(
        "aboutLayer3Canvas"
    );


const ctx =
    canvas.getContext(
        "2d"
    );


const svg =
    document.getElementById(
        "aboutLayer3SVG"
    );


const frame =
    document.getElementById(
        "layer3Frame"
    );


const connections =
    document.getElementById(
        "layer3Connections"
    );


const tabsContainer =
    document.getElementById(
        "aboutTabs"
    );


/* =====================================================
   RED PALETTE
===================================================== */

const RED_PALETTE = [

    "#100000",
    "#3D0000",
    "#780000",
    "#C00000",
    "#F80E00",
    "#FF756C"

];


/* =====================================================
   TAB COLORS
===================================================== */

const TAB_COLORS = [

    "#060505",
    "#F80E00",
    "#FFFEFD",
    "#0062FF"

];


/* =====================================================
   BALANCED COLOR POOL
===================================================== */

let colorPool = [];


function shuffleArray(
    array
) {

    const copy =
        [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            copy[i],
            copy[j]
        ] =
        [
            copy[j],
            copy[i]
        ];

    }

    return copy;
}


function createBalancedColorPool(
    amount
) {

    const pool = [];

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        pool.push(
            TAB_COLORS[
                i %
                TAB_COLORS.length
            ]
        );

    }

    return shuffleArray(
        pool
    );

}


/* =====================================================
   STATE
===================================================== */

let imageReady =
    false;

let mouseX =
    -9999;

let mouseY =
    -9999;

let canvasWidth =
    0;

let canvasHeight =
    0;

let frameX =
    0;

let frameY =
    0;

let frameInitialized =
    false;

let colorIndex =
    0;


/* =====================================================
   DITHER SETTINGS
===================================================== */

const DITHER_PIXEL_SIZE =
    1;


/* =====================================================
   IMAGE TONAL SETTINGS
===================================================== */

const CONTRAST =
    1.8;

const BRIGHTNESS =
    1.5;

const SHADOW_LIFT =
    0.10;

const HIGHLIGHT_COMPRESSION =
    0.05;


/* =====================================================
   STRETCH SETTINGS
===================================================== */

const MAX_STRETCH =
    100;

const STRETCH_RADIUS =
    260;

const STRETCH_POWER =
    1.4;


/* =====================================================
   FRAME SETTINGS
===================================================== */

const FRAME_PADDING =
    10;

const FRAME_PIXEL_SIZE =
    5;

const FRAME_SPACING =
    7;

const FRAME_GAP =
    0.1;


/* =====================================================
   MOUSE
===================================================== */

window.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            event.clientX;

        mouseY =
            event.clientY;

    }
);


window.addEventListener(
    "mouseleave",
    () => {

        mouseX =
            -9999;

        mouseY =
            -9999;

    }
);


/* =====================================================
   IMAGE BOUNDS
===================================================== */

function getImageBounds() {

    const rect =
        image.getBoundingClientRect();

    return {

        left:
            rect.left,

        top:
            rect.top,

        width:
            rect.width,

        height:
            rect.height

    };

}


/* =====================================================
   CANVAS RESIZE
===================================================== */

function resizeCanvas() {

    const dpr =
        window.devicePixelRatio || 1;


    canvasWidth =
        window.innerWidth;


    canvasHeight =
        window.innerHeight;


    canvas.width =
        Math.round(
            canvasWidth *
            dpr
        );


    canvas.height =
        Math.round(
            canvasHeight *
            dpr
        );


    canvas.style.width =
        `${canvasWidth}px`;


    canvas.style.height =
        `${canvasHeight}px`;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    if (
        imageReady
    ) {

        renderDither();

        createPixelFrame();

        updateFrame();

        repositionAllTabs();

        updateConnections();

    }

}


window.addEventListener(
    "resize",
    resizeCanvas
);


/* =====================================================
   STRETCH INFLUENCE
===================================================== */

function getStretchInfluence(
    pixelX,
    pixelY
) {

    const dx =
        pixelX -
        mouseX;


    const dy =
        pixelY -
        mouseY;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    let influence =
        1 -
        distance /
        STRETCH_RADIUS;


    influence =
        Math.max(
            0,
            Math.min(
                1,
                influence
            )
        );


    influence =
        Math.pow(
            influence,
            STRETCH_POWER
        );


    return influence;

}


/* =====================================================
   TONAL PROCESSING
===================================================== */

function processBrightness(
    brightness
) {

    if (
        BRIGHTNESS !== 1
    ) {

        brightness =
            Math.pow(
                brightness,
                1 /
                BRIGHTNESS
            );

    }


    brightness =
        (
            brightness -
            0.5
        ) *
        CONTRAST +
        0.5;


    if (
        brightness <
        0.5
    ) {

        brightness +=
            (
                0.5 -
                brightness
            ) *
            SHADOW_LIFT;

    }


    if (
        brightness >
        0.7
    ) {

        brightness =
            0.7 +
            (
                brightness -
                0.7
            ) *
            (
                1 -
                HIGHLIGHT_COMPRESSION
            );

    }


    return Math.max(
        0,
        Math.min(
            1,
            brightness
        )
    );

}


/* =====================================================
   RED DITHER
===================================================== */

function renderDither() {

    if (
        !imageReady
    ) {

        return;

    }


    const bounds =
        getImageBounds();


    if (
        bounds.width <= 0 ||
        bounds.height <= 0
    ) {

        return;

    }


    ctx.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );


    const renderWidth =
        Math.max(
            1,
            Math.floor(
                bounds.width /
                DITHER_PIXEL_SIZE
            )
        );


    const renderHeight =
        Math.max(
            1,
            Math.floor(
                bounds.height /
                DITHER_PIXEL_SIZE
            )
        );


    const offscreen =
        document.createElement(
            "canvas"
        );


    offscreen.width =
        renderWidth;


    offscreen.height =
        renderHeight;


    const offCtx =
        offscreen.getContext(
            "2d"
        );


    offCtx.drawImage(
        image,
        0,
        0,
        renderWidth,
        renderHeight
    );


    const imageData =
        offCtx.getImageData(
            0,
            0,
            renderWidth,
            renderHeight
        );


    const pixels =
        imageData.data;


    const bayerMatrix = [

        [0, 8, 2, 10],
        [12, 4, 14, 6],
        [3, 11, 1, 9],
        [15, 7, 13, 5]

    ];


    const pixelWidth =
        bounds.width /
        renderWidth;


    const pixelHeight =
        bounds.height /
        renderHeight;


    const paletteLevels =
        RED_PALETTE.length - 1;


    for (
        let y = 0;
        y < renderHeight;
        y++
    ) {

        for (
            let x = 0;
            x < renderWidth;
            x++
        ) {

            const index =
                (
                    y *
                    renderWidth +
                    x
                ) *
                4;


            const r =
                pixels[index];


            const g =
                pixels[index + 1];


            const b =
                pixels[index + 2];


            const alpha =
                pixels[index + 3];


            if (
                alpha < 15
            ) {

                continue;

            }


            let brightness =
                (
                    r * 0.299 +
                    g * 0.587 +
                    b * 0.114
                ) /
                255;


            brightness =
                processBrightness(
                    brightness
                );


            const scaledBrightness =
                brightness *
                paletteLevels;


            const lowerIndex =
                Math.floor(
                    scaledBrightness
                );


            const upperIndex =
                Math.min(
                    paletteLevels,
                    lowerIndex + 1
                );


            const fraction =
                scaledBrightness -
                lowerIndex;


            const bayerThreshold =
                (
                    bayerMatrix[
                        y % 4
                    ][
                        x % 4
                    ] +
                    0.5
                ) /
                16;


            let paletteIndex;


            if (
                fraction >
                bayerThreshold
            ) {

                paletteIndex =
                    upperIndex;

            } else {

                paletteIndex =
                    lowerIndex;

            }


            paletteIndex =
                Math.max(
                    0,
                    Math.min(
                        RED_PALETTE.length - 1,
                        paletteIndex
                    )
                );


            let drawX =
                bounds.left +
                x *
                pixelWidth;


            let drawY =
                bounds.top +
                y *
                pixelHeight;


            const pixelCenterX =
                drawX +
                pixelWidth / 2;


            const pixelCenterY =
                drawY +
                pixelHeight / 2;


            const influence =
                getStretchInfluence(
                    pixelCenterX,
                    pixelCenterY
                );


            if (
                influence > 0
            ) {

                const stretch =
                    Math.pow(
                        influence,
                        1.2
                    ) *
                    MAX_STRETCH;


                drawX -=
                    stretch *
                    influence;

            }


            ctx.fillStyle =
                RED_PALETTE[
                    paletteIndex
                ];


            ctx.fillRect(

                Math.round(
                    drawX
                ),

                Math.round(
                    drawY
                ),

                Math.ceil(
                    pixelWidth
                ),

                Math.ceil(
                    pixelHeight
                )

            );

        }

    }

}


/* =====================================================
   PIXEL FRAME
===================================================== */

function createPixelFrame() {

    if (
        !imageReady
    ) {

        return;

    }


    frame.innerHTML =
        "";


    const bounds =
        getImageBounds();


    const x =
        bounds.left -
        FRAME_PADDING;


    const y =
        bounds.top -
        FRAME_PADDING;


    const width =
        bounds.width +
        FRAME_PADDING * 2;


    const height =
        bounds.height +
        FRAME_PADDING * 2;


    for (
        let px = x;
        px <= x + width;
        px += FRAME_SPACING
    ) {

        if (
            Math.random() >
            FRAME_GAP
        ) {

            createFramePixel(
                px,
                y,
                FRAME_PIXEL_SIZE
            );

        }


        if (
            Math.random() >
            FRAME_GAP
        ) {

            createFramePixel(
                px,
                y + height,
                FRAME_PIXEL_SIZE
            );

        }

    }


    for (
        let py = y;
        py <= y + height;
        py += FRAME_SPACING
    ) {

        if (
            Math.random() >
            FRAME_GAP
        ) {

            createFramePixel(
                x,
                py,
                FRAME_PIXEL_SIZE
            );

        }


        if (
            Math.random() >
            FRAME_GAP
        ) {

            createFramePixel(
                x + width,
                py,
                FRAME_PIXEL_SIZE
            );

        }

    }

}


/* =====================================================
   FRAME PIXEL
===================================================== */

function createFramePixel(
    x,
    y,
    size
) {

    const rect =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );


    rect.setAttribute(
        "x",
        x
    );


    rect.setAttribute(
        "y",
        y
    );


    rect.setAttribute(
        "width",
        size
    );


    rect.setAttribute(
        "height",
        size
    );


    const colors = [

        "#8F0900",
        "#C20B00",
        "#F80E00",
        "#FF3025"

    ];


    rect.setAttribute(
        "fill",
        colors[
            Math.floor(
                Math.random() *
                colors.length
            )
        ]
    );


    frame.appendChild(
        rect
    );

}


/* =====================================================
   FRAME LAG
===================================================== */

function updateFrame() {

    if (
        !imageReady
    ) {

        return;

    }


    const bounds =
        getImageBounds();


    const targetX =
        bounds.left;


    const targetY =
        bounds.top;


    if (
        !frameInitialized
    ) {

        frameX =
            targetX;

        frameY =
            targetY;

        frameInitialized =
            true;

    }


    const lag =
        0.08;


    frameX +=
        (
            targetX -
            frameX
        ) *
        lag;


    frameY +=
        (
            targetY -
            frameY
        ) *
        lag;


    frame.style.transform =
        `
        translate(
            ${frameX - targetX}px,
            ${frameY - targetY}px
        )
        `;

}


/* =====================================================
   TAB DATA
===================================================== */

const TAB_DATA = [

    /* =================================================
       ABOUT
    ================================================= */

    {

        id:
            "about",

        title:
            "ABOUT",

        width:
            205,

        height:
            235,

        color:
            null,

        defaultOpen:
            true,

        desktop:
            {
                x: 40,
                y: 50
            },

        mobile:
            {
                x: 15,
                y: 60
            },

        anchor:
            {
                x: 44,
                y: 37
            },

        motion:
            {
                x: 8,
                y: 6,
                speed: 0.00022,
                phase: 0
            },

        content: {

            html: `
                <p>
                    I'm Qin — a hyperfocus weirdo,
                    professional eater,
                    music-dependent daydreamer,
                    2D artist, motion & visual designer,
                    typography enjoyer, web designer,
                    occasional coder, video-effect
                    enthusiast, and professional sleeper.
                </p>

                <br>

                <p>
                    Basically, I make visual things,
                    stare at them for too long,
                    change them 47 times,
                    and somehow end up making
                    something completely different
                    from what I started with.
                </p>

                <button
                    class="tab-read-more"
                    data-action="approach">
                    READ MORE →
                </button>

            `

        }

    },


    /* =================================================
       SYSTEM
    ================================================= */

    {

        id:
            "system",

        title:
            "PROFILE",

        width:
            300,

        height:
            100,

        color:
            null,

        defaultOpen:
            false,

        desktop:
            {
                x: 300,
                y: 80
            },

        mobile:
            {
                x: 12,
                y: 350
            },

        anchor:
            {
                x: 56,
                y: 50
            },

        motion:
            {
                x: 6,
                y: 8,
                speed: 0.00029,
                phase: 1.7
            },

        content: {

            html: `

                <p>
                    <b>NAME</b>
                    &nbsp; Quynh
                </p>

                <p>
                    <b>ROLE</b>
                    &nbsp; Digital Media Student — Year 1
                </p>

                <p>
                    <b>SCHOOL</b>
                    &nbsp; RMIT University Vietnam —
                    Saigon South Campus
                </p>

                <button
                    class="tab-read-more"
                    data-action="quest">
                    READ MORE →
                </button>

            `

        }

    },


    /* =================================================
       DNA
    ================================================= */

    {

        id:
            "dna",

        title:
            "DESIGN DNA",

        width:
            190,

        height:
            295,

        color:
            null,

        defaultOpen:
            true,

        desktop:
            {
                x: 950,
                y: 250
            },

        mobile:
            {
                x: 500,
                y: 250
            },

        anchor:
            {
                x: 60,
                y: 60
            },

        motion:
            {
                x: 5,
                y: 7,
                speed: 0.00035,
                phase: 3
            },

        content: {

            html: `
                <div
                    class="dna-list">

                    ${createDNA(
                        "EXPERIMENTATION",
                        100
                    )}

                    ${createDNA(
                        "VISUALS",
                        90
                    )}

                    ${createDNA(
                        "TYPOGRAPHY",
                        90
                    )}

                    ${createDNA(
                        "MOTION",
                        70
                    )}

                    ${createDNA(
                        "INTERACTION",
                        70
                    )}

                    ${createDNA(
                        "OVERTHINKING",
                        100
                    )}

                    ${createDNA(
                        "HALLUCINATING",
                        100
                    )}

                    ${createDNA(
                        "DELUSIONAL",
                        100
                    )}

                </div>

                <button
                    class="tab-read-more"
                    data-action="obsessions">
                    MORE DATA →
                </button>

                <div
                    class="tab-divider">
                </div>

                <span
                    class="tab-section-label">
                    CURRENT STATUS
                </span>

                <div
                    class="status-display"
                    data-status-display>
                    SLEEPY
                </div>

            `

        }

    },


    /* =================================================
       LOG
    ================================================= */

    {

        id:
            "log",

        title:
            "RANDOM FACTS",

        width:
            160,

        height:
            220,

        color:
            null,

        defaultOpen:
            false,

        desktop:
            {
                x: 780,
                y: 320
            },

        mobile:
            {
                x: 12,
                y: 410
            },

        anchor:
            {
                x: 48,
                y: 68
            },

        motion:
            {
            x: 4,
            y: 5,
            speed: 0.0004,
            phase: 4.1
        },

        content: {

            html: `

                <div
                    class="fact-list">

                    <div class="fact">
                        <span
                            class="fact-number">
                            01 —
                        </span>

                        I will spend 2 hours
                        fixing an asset position
                        just to make it look right
                        at every viewport size.
                    </div>

                    <div class="fact">
                        <span
                            class="fact-number">
                            02 —
                        </span>

                        I probably have folders
                        called web, Web, wEB,
                        Final_1, Final_Final_2,
                        w e b, and somehow still
                        can't find the file.
                    </div>

                    <div class="fact">
                        <span
                            class="fact-number">
                            03 —
                        </span>

                        I hate coding but love it
                        at the same time.
                        I guess it's an
                        enemies-to-lovers thing.
                        &lt;333
                    </div>

                </div>

            `

        }

    }

];


/* =====================================================
   CHILD DATA
===================================================== */

const CHILD_DATA = {

    /* =================================================
       APPROACH
    ================================================= */

    approach: {

        id:
            "approach",

        parent:
            "about",

        title:
            "STYLISTIC APPROACH",

        width:
            175,

        height:
            250,

        color:
            null,

        content: `

            <p>
                I tend to turn things into a mess.
            </p>

            <br>

            <p>
                I like things chaotic, cluttered,
                ugly, creepy, uncomfortable,
                or just slightly wrong —
                especially when they make you
                stop and look twice.
            </p>

            <br>

            <p>
                I'm more interested in creating
                a feeling than making everything
                conventionally beautiful.
            </p>

            <br>

            <p>
                That said, I do love pretty things too.
                I'm not completely <i>insane</i>.
                (or maybe yes¿)
            </p>

            <button
                class="tab-read-more"
                data-action="tools">
                TOOLS & SKILLS →
            </button>

        `

    },


    /* =================================================
       TOOLS
    ================================================= */

    tools: {

        id:
            "tools",

        parent:
            "approach",

        title:
            "TOOLS & SKILLS",

        width:
            150,

        height:
            300,

        color:
            null,

        content: `

            <span
                class="tab-section-label">
                TOOLS
            </span>

            <p>
                Adobe Illustrator
            </p>

            <p>
                Adobe Photoshop
            </p>

            <p>
                After Effects
            </p>

            <p>
                Figma
            </p>

            <p>
                Canva
            </p>

            <p>
                Blender
            </p>

            <p>
                HTML / CSS
            </p>

            <p>
                JavaScript
            </p>

            <div
                class="tab-divider">
            </div>

            <span
                class="tab-section-label">
                SKILLS
            </span>

            <p>
                Graphic Design
            </p>

            <p>
                Digital Illustration
            </p>

            <p>
                Visual Communication
            </p>

            <p>
                Typography
            </p>

            <p>
                Motion Graphics
            </p>

            <p>
                Visual Experimentation
            </p>

            <p>
                Web Design
            </p>

            <p>
                UI / UX
            </p>

        `

    },


    /* =================================================
       QUEST
    ================================================= */

    quest: {

        id:
            "quest",

        parent:
            "system",

        title:
            "QUESTS",

        width:
            175,

        height:
            190,

        color:
            null,

        content: `

            <span
                class="tab-section-label">
                CURRENT QUESTS
            </span>

            <p>
                Coding.
                And coding.
            </p>

            <br>

            <p>
                Make more work that I can
                actually be proud of →
                get noticed →
                get a job →
                get money →
                make more work.
            </p>

            <br>

            <p>
                Seems like a reasonable plan! :D
            </p>

            <button
                class="tab-read-more"
                data-action="future">
                FUTURE QUEST →
            </button>

        `

    },


    /* =================================================
       FUTURE
    ================================================= */

    future: {

        id:
            "future",

        parent:
            "quest",

        title:
            "FUTURE",

        width:
            195,

        height:
            220,

        color:
            null,

        content: `

            <span
                class="tab-section-label">
                FUTURE QUEST
            </span>

            <p>
                Learn TouchDesigner.
            </p>

            <br>

            <p>
                I want to make weird abstract
                things — wobbly shapes,
                glitchy forms, organic digital
                blobs, audio-reactive visuals,
                and whatever else my brain
                decides should move.
            </p>

            <br>

            <p>
                Basically, I want to make things
                that look like they are melting,
                glitching, breathing, or having
                a minor digital breakdown.
            </p>

            <br>

            <p>
                Therefore, I realize TouchDesigner
                might be the main tool to help me
                achieve this path!!
            </p>

        `

    },


    /* =================================================
       OBSESSIONS
    ================================================= */

    obsessions: {

        id:
            "obsessions",

        parent:
            "dna",

        title:
            "KNOW ME MORE! :)",

        width:
            180,

        height:
            500,

        color:
            null,

        content: `

            <span
                class="tab-section-label">
                CURRENT OBSESSIONS
            </span>

            <div
                class="obsession-grid">

                <span class="obsession">
                    PIXELS
                </span>

                <span class="obsession">
                    DITHER
                </span>

                <span class="obsession">
                    WEIRD WEBSITES
                </span>

                <span class="obsession">
                    SLAY TYPOGRAPHY
                </span>

                <span class="obsession">
                    FASHION
                </span>

                <span class="obsession">
                    SLAY NAILS
                </span>

                <span class="obsession">
                    MOTION
                </span>

                <span class="obsession">
                    BLEACHED HAIRRR
                </span>

                <span class="obsession">
                    CHIIKAWAAA!!!
                </span>

                <span class="obsession">
                    HACHIWARE <3
                </span>

                <span class="obsession">
                    USAGI <3
                </span>

            </div>

            <div
                class="tab-divider">
            </div>

            <span
                class="tab-section-label">
                WEAPON OF CHOICE
            </span>

            <p>
                Photoshop + Illustrator
            </p>

            <br>

            <p>
                I somehow manage to spend hours
                doing something that probably
                could have been done in five minutes.
            </p>

            <div
                class="tab-divider">
            </div>

            <span
                class="tab-section-label">
                SPECIAL SKILLS
            </span>

            <p>
                Halftone & Dither
            </p>

            <p>
                Visual experimentation
            </p>

            <p>
                Creating visual mess
            </p>

            <p>
                Making unnecessarily detailed things
            </p>

             <p>
               Turning “this should be simple” into a three-hour project
            </p>

            <div
                class="tab-divider">
            </div>

            <span
                class="tab-section-label">
                WEAKNESSES
            </span>

            <p>
                “I'm gonna put in just one more thing.”
            </p>

            <p>
                “Should I do this?”
            </p>

            <p>
                “…Or no?”
            </p>

            <p>
                “Hmmmmm... Maybe no.”
            </p>

            <p>
                “No wait— It looks better perhaps...” <i>cries in pain</i>
            </p>

        `

    }

};


/* =====================================================
   DNA GENERATOR
===================================================== */

function createDNA(
    label,
    percentage
) {

    return `

        <div
            class="dna-row">

            <div
                class="dna-label">

                <span>
                    ${label}
                </span>

                <span
                    class="dna-value">
                    ${percentage}%
                </span>

            </div>

            <div
                class="dna-track">

                <div
                    class="dna-fill"
                    data-dna="${percentage}">
                </div>

            </div>

        </div>

    `;

}


/* =====================================================
   TAB OBJECTS
===================================================== */

const tabObjects =
    [];


/* =====================================================
   TAB Z INDEX
===================================================== */

let highestZ =
    20;


/* =====================================================
   CREATE TABS
===================================================== */

function createTabs() {

    tabsContainer.innerHTML =
        "";

    tabObjects.length =
        0;

    colorPool =
        createBalancedColorPool(
            TAB_DATA.length +
            Object.keys(
                CHILD_DATA
            ).length +
            10
        );


    TAB_DATA.forEach(
        data => {

            if (
                data.defaultOpen
            ) {

                createTab(
                    data
                );

            }

        }
    );


    createTabLauncher();

    requestAnimationFrame(
        () => {

            repositionAllTabs();

            updateConnections();

        }
    );

}


/* =====================================================
   GET NEXT COLOR
===================================================== */

function getNextColor() {

    if (
        colorIndex >=
        colorPool.length
    ) {

        colorPool =
            createBalancedColorPool(
                20
            );

        colorIndex =
            0;

    }


    return colorPool[
        colorIndex++
    ];

}


/* =====================================================
   CONTRAST
===================================================== */

function getContrastColor(
    color
) {

    if (
        color === "#060505" ||
        color === "#F80E00" ||
        color === "#0062FF"
    ) {

        return "#FFFEFD";

    }


    return "#060505";

}


/* =====================================================
   CREATE SINGLE TAB
===================================================== */

function createTab(
    data,
    options = {}
) {

    const existing =
        tabObjects.find(
            tab =>
                tab.id ===
                data.id
        );


    if (
        existing
    ) {

        return existing;

    }


    const tab =
        document.createElement(
            "div"
        );


    tab.className =
        "about-tab";


    if (
        options.isChild
    ) {

        tab.classList.add(
            "is-child"
        );

    }


    tab.dataset.id =
        data.id;


    if (
        data.parent
    ) {

        tab.dataset.parent =
            data.parent;

    }


    const color =
        data.color ||
        getNextColor();


    tab.style.background =
        color;


    tab.style.color =
        getContrastColor(
            color
        );


    tab.style.setProperty(
        "--tab-bg",
        color
    );


    tab.style.width =
        `${data.width}px`;


    tab.style.height =
        `${data.height}px`;


    const header =
        document.createElement(
            "div"
        );


    header.className =
        "about-tab-header";


    header.style.background =
        color;


    const title =
        document.createElement(
            "span"
        );


    title.className =
        "about-tab-title";


    title.textContent =
        data.title;


    const close =
        document.createElement(
            "button"
        );


    close.className =
        "about-tab-close";


    close.textContent =
        "×";


    close.setAttribute(
        "aria-label",
        "Close tab"
    );


    close.addEventListener(
        "pointerdown",
        event => {

            event.stopPropagation();

        }
    );


    close.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            closeTab(
                data.id
            );

        }
    );


    header.appendChild(
        title
    );


    header.appendChild(
        close
    );


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "about-tab-content";


    content.style.background =
        color;


    content.style.color =
        getContrastColor(
            color
        );


    content.innerHTML =
        data.content?.html ||
        data.content ||
        "";


    tab.appendChild(
        header
    );


    tab.appendChild(
        content
    );


    tabsContainer.appendChild(
        tab
    );


    const position =
        getInitialPosition(
            data,
            options
        );


    tab.style.left =
        `${position.x}px`;


    tab.style.top =
        `${position.y}px`;


    const motion =
        {

            id:
                data.id,

            element:
                tab,

            data:
                data,

            parent:
                data.parent ||
                null,

            baseX:
                position.x,

            baseY:
                position.y,

            currentX:
                position.x,

            currentY:
                position.y,

            amplitudeX:
                data.motion?.x ||
                0,

            amplitudeY:
                data.motion?.y ||
                0,

            speed:
                data.motion?.speed ||
                0.0002,

            phase:
                data.motion?.phase ||
                0,

            paused:
                false,

            open:
                true,

            dragging:
                false,

            dragStartX:
                0,

            dragStartY:
                0,

            dragOriginX:
                0,

            dragOriginY:
                0,

            isChild:
                !!options.isChild

        };


    tabObjects.push(
        motion
    );


    setupTabInteractions(
        tab,
        motion
    );


    setupReadMoreButtons(
        tab
    );


    animateDNA(
        tab
    );


    startStatusGlitch(
        tab
    );


    tab.style.zIndex =
        ++highestZ;


    return motion;

}


/* =====================================================
   INITIAL POSITION
===================================================== */

function getInitialPosition(
    data,
    options = {}
) {

    const mobile =
        window.innerWidth <= 700;


    const smallPhone =
        window.innerWidth <= 430;


    if (
        options.child
    ) {

        return getChildPosition(
            options.parentId,
            data
        );

    }


    const source =
        mobile
            ? data.mobile
            : data.desktop;


    let x =
        source.x;


    let y =
        source.y;


    if (
        smallPhone
    ) {

        x =
            Math.max(
                10,
                Math.min(
                    x,
                    window.innerWidth -
                    data.width -
                    10
                )
            );

        y =
            Math.max(
                80,
                Math.min(
                    y,
                    window.innerHeight -
                    data.height -
                    70
                )
            );

    }


    return {
        x,
        y
    };

}


/* =====================================================
   CHILD POSITION
===================================================== */

function getChildPosition(
    parentId,
    data
) {

    const parent =
        tabObjects.find(
            tab =>
                tab.id ===
                parentId
        );


    const isMobile =
        window.innerWidth <= 700;


    if (
        !parent
    ) {

        return {

            x:
                20,

            y:
                100

        };

    }


    const parentRect =
        parent.element.getBoundingClientRect();


    let x;
    let y;


    if (
        isMobile
    ) {

        x =
            parent.baseX +
            18;


        y =
            parent.baseY +
            parent.element.offsetHeight +
            16;

    } else {

        const direction =
            parentRect.left <
            window.innerWidth / 2
                ? 1
                : -1;


        x =
            parent.baseX +
            (
                direction *
                (
                    parent.element.offsetWidth +
                    20
                )
            );


        y =
            parent.baseY +
            25;

    }


    return clampPosition(
        x,
        y,
        data.width,
        data.height
    );

}


/* =====================================================
   CLAMP POSITION
===================================================== */

function clampPosition(
    x,
    y,
    width,
    height
) {

    const padding =
        window.innerWidth <= 430
            ? 8
            : 12;


    const topSafe =
        window.innerWidth <= 430
            ? 60
            : 70;


    const bottomSafe =
        window.innerWidth <= 430
            ? 58
            : 30;


    const maxX =
        Math.max(
            padding,
            window.innerWidth -
            width -
            padding
        );


    const maxY =
        Math.max(
            topSafe,
            window.innerHeight -
            height -
            bottomSafe
        );


    return {

        x:
            Math.max(
                padding,
                Math.min(
                    x,
                    maxX
                )
            ),

        y:
            Math.max(
                topSafe,
                Math.min(
                    y,
                    maxY
                )
            )

    };

}


/* =====================================================
   RESPONSIVE REPOSITION
===================================================== */

function repositionAllTabs() {

    const mobile =
        window.innerWidth <= 700;


    const small =
        window.innerWidth <= 430;


    tabObjects.forEach(
        tab => {

            if (
                tab.dragging
            ) {

                return;

            }


            if (
                tab.isChild
            ) {

                const position =
                    getChildPosition(
                        tab.parent,
                        tab.data
                    );


                tab.baseX =
                    position.x;

                tab.baseY =
                    position.y;

                tab.currentX =
                    position.x;

                tab.currentY =
                    position.y;


                tab.element.style.left =
                    `${position.x}px`;


                tab.element.style.top =
                    `${position.y}px`;


                return;

            }


            const source =
                mobile
                    ? tab.data.mobile
                    : tab.data.desktop;


            let x =
                source.x;

            let y =
                source.y;


            if (
                small
            ) {

                x =
                    Math.max(
                        8,
                        Math.min(
                            x,
                            window.innerWidth -
                            tab.element.offsetWidth -
                            8
                        )
                    );


                y =
                    Math.max(
                        65,
                        Math.min(
                            y,
                            window.innerHeight -
                            tab.element.offsetHeight -
                            60
                        )
                    );

            }


            const position =
                clampPosition(
                    x,
                    y,
                    tab.element.offsetWidth,
                    tab.element.offsetHeight
                );


            tab.baseX =
                position.x;

            tab.baseY =
                position.y;

            tab.currentX =
                position.x;

            tab.currentY =
                position.y;


            tab.element.style.left =
                `${position.x}px`;


            tab.element.style.top =
                `${position.y}px`;

        }
    );


    updateConnections();

}


/* =====================================================
   TAB INTERACTIONS
===================================================== */

function setupTabInteractions(
    tab,
    motion
) {

    tab.addEventListener(
        "mouseenter",
        () => {

            if (
                !motion.dragging
            ) {

                motion.paused =
                    true;

            }

        }
    );


    tab.addEventListener(
        "mouseleave",
        () => {

            if (
                !motion.dragging
            ) {

                motion.paused =
                    false;

            }

        }
    );


    setupTabDrag(
        tab,
        motion
    );

}


/* =====================================================
   DRAG
===================================================== */

function setupTabDrag(
    tab,
    motion
) {

    tab.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target.closest(
                    ".about-tab-close"
                )
            ) {

                return;

            }


            if (
                event.target.closest(
                    ".tab-read-more"
                )
            ) {

                return;

            }


            event.preventDefault();


            motion.dragging =
                true;


            motion.paused =
                true;


            tab.classList.add(
                "is-dragging"
            );


            tab.setPointerCapture(
                event.pointerId
            );


            const rect =
                tab.getBoundingClientRect();


            motion.dragStartX =
                event.clientX;


            motion.dragStartY =
                event.clientY;


            motion.dragOriginX =
                rect.left;


            motion.dragOriginY =
                rect.top;


            tab.style.zIndex =
                ++highestZ;

        }
    );


    tab.addEventListener(
        "pointermove",
        event => {

            if (
                !motion.dragging
            ) {

                return;

            }


            const dx =
                event.clientX -
                motion.dragStartX;


            const dy =
                event.clientY -
                motion.dragStartY;


            const containerRect =
                tabsContainer.getBoundingClientRect();


            let newX =
                motion.dragOriginX +
                dx -
                containerRect.left;


            let newY =
                motion.dragOriginY +
                dy -
                containerRect.top;


            const clamped =
                clampPosition(
                    newX,
                    newY,
                    tab.offsetWidth,
                    tab.offsetHeight
                );


            newX =
                clamped.x;

            newY =
                clamped.y;


            motion.baseX =
                newX;

            motion.baseY =
                newY;

            motion.currentX =
                newX;

            motion.currentY =
                newY;


            tab.style.left =
                `${newX}px`;


            tab.style.top =
                `${newY}px`;


            tab.style.transform =
                "translate3d(0,0,0)";


            updateConnections();

        }
    );


    tab.addEventListener(
        "pointerup",
        event => {

            finishTabDrag(
                tab,
                motion,
                event
            );

        }
    );


    tab.addEventListener(
        "pointercancel",
        event => {

            finishTabDrag(
                tab,
                motion,
                event
            );

        }
    );

}


/* =====================================================
   FINISH DRAG
===================================================== */

function finishTabDrag(
    tab,
    motion,
    event
) {

    if (
        !motion.dragging
    ) {

        return;

    }


    motion.dragging =
        false;


    motion.paused =
        false;


    tab.classList.remove(
        "is-dragging"
    );


    try {

        tab.releasePointerCapture(
            event.pointerId
        );

    } catch (
        error
    ) {}

}


/* =====================================================
   READ MORE
===================================================== */

function setupReadMoreButtons(
    tab
) {

    const buttons =
        tab.querySelectorAll(
            "[data-action]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "pointerdown",
                event => {

                    event.stopPropagation();

                }
            );


            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const action =
                        button.dataset.action;


                    openChildTab(
                        action,
                        tab.dataset.id
                    );

                }
            );

        }
    );

}


/* =====================================================
   OPEN CHILD
===================================================== */

function openChildTab(
    childId,
    parentId
) {

    const data =
        CHILD_DATA[
            childId
        ];


    if (
        !data
    ) {

        return;

    }


    const existing =
        tabObjects.find(
            tab =>
                tab.id ===
                childId
        );


    if (
        existing
    ) {

        existing.open =
            true;

        existing.element.style.opacity =
            "1";

        existing.element.style.pointerEvents =
            "auto";

        existing.element.style.zIndex =
            ++highestZ;

        return;

    }


    data.parent =
        parentId;


    createTab(
        data,
        {
            isChild:
                true,

            child:
                true,

            parentId:
                parentId

        }
    );


    requestAnimationFrame(
        () => {

            updateConnections();

        }
    );

}


/* =====================================================
   CLOSE TAB
===================================================== */

function closeTab(
    id
) {

    const object =
        tabObjects.find(
            tab =>
                tab.id ===
                id
        );


    if (
        !object
    ) {

        return;

    }


    object.open =
        false;


    object.dragging =
        false;


    object.element.style.pointerEvents =
        "none";


    object.element.style.opacity =
        "0";


    object.element.style.transform =
        "scale(0.8)";


    updateLauncherState(
        id,
        false
    );


    setTimeout(
        () => {

            if (
                object.element
                .parentNode
            ) {

                object.element.remove();

            }


            const index =
                tabObjects.indexOf(
                    object
                );


            if (
                index !== -1
            ) {

                tabObjects.splice(
                    index,
                    1
                );

            }


            updateConnections();

        },
        180
    );

}


/* =====================================================
   OPEN MAIN TAB
===================================================== */

function openTab(
id
) {

    const data =
        TAB_DATA.find(
            item =>
                item.id ===
                id
        );


    if (
        !data
    ) {

        return;

    }


    const existing =
        tabObjects.find(
            tab =>
                tab.id ===
                id
        );


    if (
        existing
    ) {

        existing.open =
            true;

        existing.element.style.opacity =
            "1";

        existing.element.style.pointerEvents =
            "auto";

        existing.element.style.transform =
            "translate3d(0,0,0)";

        existing.element.style.zIndex =
            ++highestZ;

        updateLauncherState(
            id,
            true
        );

        return;

    }


    createTab(
        data
    );


    updateLauncherState(
        id,
        true
    );


    requestAnimationFrame(
        () => {

            repositionAllTabs();

            updateConnections();

        }
    );

}


/* =====================================================
   LAUNCHER
===================================================== */

let launcher =
    null;


function createTabLauncher() {

    if (
        launcher
    ) {

        launcher.remove();

    }


    launcher =
        document.createElement(
            "div"
        );


    launcher.id =
        "aboutTabLauncher";


    document.body.appendChild(
        launcher
    );


    TAB_DATA.forEach(
        (
            data,
            index
        ) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "about-launcher-item";


            item.dataset.id =
                data.id;


            const color =
                data.color ||
                getLauncherColor(
                    data.id
                );


            item.style.background =
                color;


            item.style.color =
                getContrastColor(
                    color
                );


            item.style.setProperty(
                "--launcher-delay",
                `${index * 0.08}s`
            );


            item.innerHTML = `

                <span
                    class="about-launcher-status">
                    ●
                </span>

                <span>
                    ${data.title}
                </span>

            `;


            item.addEventListener(
                "click",
                () => {

                    const object =
                        tabObjects.find(
                            tab =>
                                tab.id ===
                                data.id
                        );


                    if (
                        object &&
                        object.open
                    ) {

                        closeTab(
                            data.id
                        );

                    } else {

                        openTab(
                            data.id
                        );

                    }

                }
            );


            launcher.appendChild(
                item
            );

        }
    );


    requestAnimationFrame(
        () => {

            launcher.classList.add(
                "is-loaded"
            );

        }
    );


    TAB_DATA.forEach(
        data => {

            updateLauncherState(
                data.id,
                !!data.defaultOpen
            );

        }
    );

}


/* =====================================================
   LAUNCHER COLOR
   Keeps launcher colors balanced too.
===================================================== */

function getLauncherColor(
    id
) {

    const index =
        TAB_DATA.findIndex(
            item =>
                item.id ===
                id
        );


    return TAB_COLORS[
        index %
        TAB_COLORS.length
    ];

}


/* =====================================================
   UPDATE LAUNCHER
===================================================== */

function updateLauncherState(
    id,
    isOpen
) {

    if (
        !launcher
    ) {

        return;

    }


    const item =
        launcher.querySelector(
            `[data-id="${id}"]`
        );


    if (
        !item
    ) {

        return;

    }


    item.classList.toggle(
        "is-open",
        isOpen
    );


    item.classList.toggle(
        "is-closed",
        !isOpen
    );


    const status =
        item.querySelector(
            ".about-launcher-status"
        );


    if (
        status
    ) {

        status.textContent =
            isOpen
                ? "●"
                : "○";

    }

}


/* =====================================================
   DNA ANIMATION
===================================================== */

function animateDNA(
    tab
) {

    const fills =
        tab.querySelectorAll(
            ".dna-fill"
        );


    if (
        !fills.length
    ) {

        return;

    }


    requestAnimationFrame(
        () => {

            fills.forEach(
                (
                    fill,
                    index
                ) => {

                    const percentage =
                        Number(
                            fill.dataset.dna
                        );


                    setTimeout(
                        () => {

                            fill.style.width =
                                `${percentage}%`;

                        },
                        180 +
                        index *
                        100
                    );

                }
            );

        }
    );

}


/* =====================================================
   STATUS GLITCH
===================================================== */

const STATUS_WORDS = [

    "SLEEPY",
    "BROKE",
    "DANCIN'"

];


function startStatusGlitch(
    tab
) {

    const display =
        tab.querySelector(
            "[data-status-display]"
        );


    if (
        !display
    ) {

        return;

    }


    let index =
        0;


    const switchStatus =
        () => {

            display.classList.add(
                "glitch"
            );


            setTimeout(
                () => {

                    index =
                        (
                            index + 1
                        ) %
                        STATUS_WORDS.length;


                    display.textContent =
                        STATUS_WORDS[
                            index
                        ];


                    display.classList.remove(
                        "glitch"
                    );

                },
                90
            );


            setTimeout(
                switchStatus,
                1900 +
                Math.random() *
                1400
            );

        };


    setTimeout(
        switchStatus,
        1600
    );

}


/* =====================================================
   TAB FLOATING MOTION
===================================================== */

function animateTabs(
    time
) {

    tabObjects.forEach(
        tab => {

            if (
                !tab.open
            ) {

                return;

            }


            if (
                tab.dragging
            ) {

                return;

            }


            if (
                tab.paused
            ) {

                return;

            }


            const t =
                time *
                tab.speed +
                tab.phase;


            const targetX =
                tab.baseX +
                Math.sin(
                    t
                ) *
                tab.amplitudeX;


            const targetY =
                tab.baseY +
                Math.cos(
                    t * 0.83
                ) *
                tab.amplitudeY;


            tab.currentX +=
                (
                    targetX -
                    tab.currentX
                ) *
                0.035;


            tab.currentY +=
                (
                    targetY -
                    tab.currentY
                ) *
                0.035;


            tab.element.style.transform =
                `
                translate3d(
                    ${tab.currentX - tab.baseX}px,
                    ${tab.currentY - tab.baseY}px,
                    0
                )
                `;

        }
    );

}


/* =====================================================
   CONNECTOR LINES
===================================================== */

function updateConnections() {

    if (
        !imageReady
    ) {

        return;

    }


    connections.innerHTML =
        "";


    const bounds =
        getImageBounds();


    tabObjects.forEach(
        tab => {

            if (
                !tab.open
            ) {

                return;

            }


            const anchor =
                tab.data.anchor;


            let anchorX =
                bounds.left +
                bounds.width *
                (
                    anchor.x /
                    100
                );


            let anchorY =
                bounds.top +
                bounds.height *
                (
                    anchor.y /
                    100
                );


            const rect =
                tab.element.getBoundingClientRect();


            const tabX =
                rect.left;


            const tabY =
                rect.top +
                rect.height /
                2;


            const middleX =
                (
                    anchorX +
                    tabX
                ) /
                2;


            const path =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                );


            path.classList.add(
                "layer3-connector"
            );


            if (
                tab.isChild
            ) {

                path.classList.add(
                    "child"
                );

            }


            path.setAttribute(
                "d",
                `
                M ${anchorX} ${anchorY}

                L ${middleX} ${anchorY}

                L ${middleX} ${tabY}

                L ${tabX} ${tabY}
                `
            );


            connections.appendChild(
                path
            );


            const anchorPixel =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "rect"
                );


            anchorPixel.classList.add(
                "layer3-anchor"
            );


            anchorPixel.setAttribute(
                "x",
                anchorX - 2
            );


            anchorPixel.setAttribute(
                "y",
                anchorY - 2
            );


            anchorPixel.setAttribute(
                "width",
                4
            );


            anchorPixel.setAttribute(
                "height",
                4
            );


            connections.appendChild(
                anchorPixel
            );

        }
    );

}


/* =====================================================
   MAIN ANIMATION LOOP
===================================================== */

function animationLoop(
    time
) {

    if (
        imageReady
    ) {

        renderDither();

        updateFrame();

        animateTabs(
            time
        );

        updateConnections();

    }


    requestAnimationFrame(
        animationLoop
    );

}


/* =====================================================
   IMAGE LOAD
===================================================== */

image.addEventListener(
    "load",
    () => {

        imageReady =
            true;


        resizeCanvas();


        createPixelFrame();


        createTabs();


        updateFrame();


        updateConnections();


        requestAnimationFrame(
            animationLoop
        );

    }
);


/* =====================================================
   IMAGE ALREADY LOADED
===================================================== */

if (
    image.complete
) {

    imageReady =
        true;


    resizeCanvas();


    createPixelFrame();


    createTabs();


    updateFrame();


    updateConnections();


    requestAnimationFrame(
        animationLoop
    );

}