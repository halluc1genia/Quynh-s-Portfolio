 /* =====================================================
   ENTERTAIN.JS

   Floating Assets
   +
   Speech Bubbles
   +
   Current Mood Modal
   +
   Fly Animation
===================================================== */


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           MAIN ELEMENTS
        ================================================= */

        const main =
            document.querySelector("main");


        const devil =
            document.getElementById(
                "floatingDevil"
            );


        const happy =
            document.getElementById(
                "floatingHappy"
            );


        if (
            !main ||
            !devil ||
            !happy
        ) {

            return;

        }



        /* =================================================
           SETTINGS
        ================================================= */

        const SETTINGS = {

            minSpeed: 7,

            maxSpeed: 15,

            hoverRadius: 120,

            bounceRandomness: 3,

            edgePadding: 20

        };



        /* =================================================
           FLOATING ASSET CLASS
        ================================================= */

        class FloatingAsset {


            constructor(
                element,
                startX,
                startY,
                angle
            ) {


                this.element =
                    element;


                this.x =
                    startX;


                this.y =
                    startY;


                this.speed =
                    SETTINGS.minSpeed +
                    Math.random() *
                    (
                        SETTINGS.maxSpeed -
                        SETTINGS.minSpeed
                    );


                this.angle =
                    angle;


                this.vx =
                    Math.cos(
                        this.angle
                    ) *
                    this.speed;


                this.vy =
                    Math.sin(
                        this.angle
                    ) *
                    this.speed;


                this.width = 0;

                this.height = 0;


                this.paused =
                    false;


                this.updateSize();

                this.render();

            }



            /* =================================================
               SIZE
            ================================================= */

            updateSize() {

                const rect =
                    this.element.getBoundingClientRect();


                this.width =
                    rect.width;


                this.height =
                    rect.height;

            }



            /* =================================================
               BOUNCE
            ================================================= */

            randomizeBounce(
                horizontal
            ) {


                const randomness =
                    (
                        Math.random() -
                        0.5
                    ) *
                    SETTINGS.bounceRandomness;


                if (horizontal) {

                    this.vx *= -1;

                    this.vy +=
                        randomness;

                }

                else {

                    this.vy *= -1;

                    this.vx +=
                        randomness;

                }


                const minVelocity =
                    0.12;


                if (
                    Math.abs(this.vx) <
                    minVelocity
                ) {

                    this.vx =
                        this.vx < 0
                            ? -minVelocity
                            : minVelocity;

                }


                if (
                    Math.abs(this.vy) <
                    minVelocity
                ) {

                    this.vy =
                        this.vy < 0
                            ? -minVelocity
                            : minVelocity;

                }

            }



            /* =================================================
               UPDATE
            ================================================= */

            update() {


                if (this.paused) {

                    return;

                }


                this.x +=
                    this.vx;


                this.y +=
                    this.vy;


                const width =
                    main.clientWidth;


                const height =
                    main.clientHeight;



                /* LEFT */

                if (
                    this.x <=
                    SETTINGS.edgePadding
                ) {

                    this.x =
                        SETTINGS.edgePadding;


                    this.randomizeBounce(
                        true
                    );

                }



                /* RIGHT */

                if (
                    this.x +
                    this.width >=
                    width -
                    SETTINGS.edgePadding
                ) {

                    this.x =
                        width -
                        this.width -
                        SETTINGS.edgePadding;


                    this.randomizeBounce(
                        true
                    );

                }



                /* TOP */

                if (
                    this.y <=
                    SETTINGS.edgePadding
                ) {

                    this.y =
                        SETTINGS.edgePadding;


                    this.randomizeBounce(
                        false
                    );

                }



                /* BOTTOM */

                if (
                    this.y +
                    this.height >=
                    height -
                    SETTINGS.edgePadding
                ) {

                    this.y =
                        height -
                        this.height -
                        SETTINGS.edgePadding;


                    this.randomizeBounce(
                        false
                    );

                }


                this.render();

            }



            /* =================================================
               RENDER
            ================================================= */

            render() {

                this.element.style.left =
                    `${this.x}px`;


                this.element.style.top =
                    `${this.y}px`;

            }



            /* =================================================
               MOUSE PROXIMITY
            ================================================= */

            checkMouse(
                mouseX,
                mouseY
            ) {


                if (
                    mouseX === null ||
                    mouseY === null
                ) {

                    return;

                }


                const centerX =
                    this.x +
                    this.width / 2;


                const centerY =
                    this.y +
                    this.height / 2;


                const dx =
                    mouseX -
                    centerX;


                const dy =
                    mouseY -
                    centerY;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                this.paused =
                    distance <
                    SETTINGS.hoverRadius;

            }

        }



        /* =================================================
           INITIAL POSITIONS
        ================================================= */

        const width =
            main.clientWidth;


        const height =
            main.clientHeight;



        /* DEVIL */

        const devilStartX =
            width * 0.08;


        const devilStartY =
            height * 0.20;



        /* HAPPY */

        const happyStartX =
            width * 0.72;


        const happyStartY =
            height * 0.70;



        /* =================================================
           CREATE OBJECTS
        ================================================= */

        const devilObject =
            new FloatingAsset(
                devil,
                devilStartX,
                devilStartY,
                Math.PI * 0.30
            );


        const happyObject =
            new FloatingAsset(
                happy,
                happyStartX,
                happyStartY,
                Math.PI * 1.25
            );



        /* =================================================
           MOUSE
        ================================================= */

        let mouseX = null;

        let mouseY = null;


        main.addEventListener(
            "mousemove",
            (event) => {


                const rect =
                    main.getBoundingClientRect();


                mouseX =
                    event.clientX -
                    rect.left;


                mouseY =
                    event.clientY -
                    rect.top;

            }
        );


        main.addEventListener(
            "mouseleave",
            () => {

                mouseX = null;

                mouseY = null;

            }
        );



        /* =================================================
           SPEECH BUBBLE TEXT
           
           DESKTOP:
           18px → 15px

           MOBILE:
           fixed 16px
        ================================================= */

        const bubbleElements = [

            document.getElementById(
                "cloudright"
            ),

            document.getElementById(
                "starright"
            ),

            document.getElementById(
                "cloudleft"
            )

        ];



        function fitBubble(
            bubble
        ) {


            if (!bubble) {

                return;

            }


            const text =
                bubble.querySelector(
                    ".bubble-text"
                );


            if (!text) {

                return;

            }



            /* ---------------------------------------------
               MOBILE
               --------------------------------------------- */

            const isMobile =
                window.innerWidth <= 600;


            if (isMobile) {

                text.style.fontSize =
                    "16px";

                text.style.whiteSpace =
                    "nowrap";

                return;

            }



            /* ---------------------------------------------
               DESKTOP
               
               START = 18px
               MINIMUM = 15px
            --------------------------------------------- */

            let fontSize =
                18;


            const minFontSize =
                15;


            text.style.fontSize =
                `${fontSize}px`;


            text.style.whiteSpace =
                "nowrap";



            /* ---------------------------------------------
               AUTO SHRINK
            --------------------------------------------- */

            while (
                (
                    text.scrollWidth >
                    text.clientWidth ||

                    text.scrollHeight >
                    text.clientHeight
                )
                &&
                fontSize >
                minFontSize
            ) {


                fontSize -= 1;


                text.style.fontSize =
                    `${fontSize}px`;

            }

        }



        /* =================================================
           FIT ALL BUBBLES
        ================================================= */

        function fitBubbleText() {

            bubbleElements.forEach(
                fitBubble
            );

        }



        /* =================================================
           BUBBLE IMAGE LOAD
        ================================================= */

        const bubbleImages =
            document.querySelectorAll(
                ".speech-bubble img"
            );


        bubbleImages.forEach(
            (image) => {


                if (
                    image.complete
                ) {

                    fitBubbleText();

                }

                else {

                    image.addEventListener(
                        "load",
                        fitBubbleText
                    );

                }

            }
        );



        /* =================================================
           INITIAL BUBBLE FIT
        ================================================= */

        window.addEventListener(
            "load",
            fitBubbleText
        );


        fitBubbleText();



        /* =================================================
           RESIZE
        ================================================= */

        window.addEventListener(
            "resize",
            () => {


                devilObject.updateSize();

                happyObject.updateSize();


                const width =
                    main.clientWidth;


                const height =
                    main.clientHeight;


                devilObject.x =
                    Math.min(
                        devilObject.x,
                        width -
                        devilObject.width -
                        SETTINGS.edgePadding
                    );


                devilObject.y =
                    Math.min(
                        devilObject.y,
                        height -
                        devilObject.height -
                        SETTINGS.edgePadding
                    );


                happyObject.x =
                    Math.min(
                        happyObject.x,
                        width -
                        happyObject.width -
                        SETTINGS.edgePadding
                    );


                happyObject.y =
                    Math.min(
                        happyObject.y,
                        height -
                        happyObject.height -
                        SETTINGS.edgePadding
                    );


                devilObject.render();

                happyObject.render();


                /* REFIT BUBBLE TEXT */

                fitBubbleText();

            }
        );



        /* =================================================
           ANIMATION LOOP
        ================================================= */

        function animate() {


            devilObject.checkMouse(
                mouseX,
                mouseY
            );


            happyObject.checkMouse(
                mouseX,
                mouseY
            );


            devilObject.update();

            happyObject.update();


            requestAnimationFrame(
                animate
            );

        }


        animate();



        /* =====================================================
           CURRENT MOOD MODAL
        ===================================================== */

        const moodModal =
            document.getElementById(
                "moodModal"
            );


        const moodTrigger =
            document.getElementById(
                "moodTrigger"
            );


        const moodClose =
            document.getElementById(
                "moodClose"
            );



        if (
            !moodModal ||
            !moodTrigger ||
            !moodClose
        ) {

            return;

        }



        /* =====================================================
           OPEN
        ===================================================== */

        function openMood() {

            moodModal.classList.add(
                "is-open"
            );


            moodModal.setAttribute(
                "aria-hidden",
                "false"
            );

        }



        /* =====================================================
           CLOSE
        ===================================================== */

        function closeMood() {

            moodModal.classList.remove(
                "is-open"
            );


            moodModal.setAttribute(
                "aria-hidden",
                "true"
            );

        }



        /* =====================================================
           MOOD BUTTON
        ===================================================== */

        moodTrigger.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                openMood();

            }
        );



        /* =====================================================
           CLOSE BUTTON
        ===================================================== */

        moodClose.addEventListener(
            "click",
            closeMood
        );



        /* =====================================================
           CLICK OUTSIDE
        ===================================================== */

        moodModal.addEventListener(
            "click",
            (event) => {


                if (
                    event.target ===
                    moodModal
                ) {

                    closeMood();

                }

            }
        );



        /* =====================================================
           ESCAPE
        ===================================================== */

        document.addEventListener(
            "keydown",
            (event) => {


                if (
                    event.key ===
                    "Escape"
                ) {

                    closeMood();

                }

            }
        );



        /* =====================================================
           FLY ANIMATION

           fly1 → fly2 → fly3
           1 second each
        ===================================================== */

        const flyFrames =
            document.querySelectorAll(
                ".mood-fly-frame"
            );


        let currentFly =
            0;


        const FLY_INTERVAL =
            1000;


        function showFlyFrame(
            index
        ) {


            flyFrames.forEach(
                (frame, i) => {

                    frame.classList.toggle(
                        "is-active",
                        i === index
                    );

                }
            );

        }


        showFlyFrame(
            currentFly
        );


        setInterval(
            () => {


                currentFly++;


                if (
                    currentFly >=
                    flyFrames.length
                ) {

                    currentFly = 0;

                }


                showFlyFrame(
                    currentFly
                );


            },
            FLY_INTERVAL
        );


    }
);