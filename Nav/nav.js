/* ================================================= */
/* ELEMENTS                                          */
/* ================================================= */

const nav =
    document.getElementById("nav");

const navTrigger =
    document.getElementById("navTrigger");

const navBox =
    document.getElementById("navBox");

const devilButton =
    document.getElementById("devilButton");

const devilIcon =
    document.getElementById("devilIcon");


/* ================================================= */
/* DEVIL ASSETS                                      */
/* ================================================= */

const OFF =
    "../Images/Nav/off.png";

const ON =
    "../Images/Nav/on.png";


/* ================================================= */
/* STATE                                             */
/* ================================================= */

let locked = false;

let hoveringTop = false;

let hoveringNav = false;

let hoveringDevil = false;


/* ================================================= */
/* ICON                                              */
/* ================================================= */

function setOn() {

    devilIcon.src = ON;

}


function setOff() {

    devilIcon.src = OFF;

}


/* ================================================= */
/* OPEN                                             */
/* ================================================= */

function openNav() {

    /*
        Open immediately.
    */

    nav.classList.add(
        "nav-open"
    );


    /*
        Switch icon immediately.
    */

    setOn();

}


/* ================================================= */
/* CLOSE                                             */
/* ================================================= */

function closeNav() {

    /*
        Locked nav cannot be closed
        by hover.
    */

    if (locked) {

        return;

    }


    nav.classList.remove(
        "nav-open"
    );


    setOff();

}


/* ================================================= */
/* CHECK WHETHER HOVER STILL EXISTS                 */
/* ================================================= */

function checkClose() {

    if (locked) {

        return;

    }


    /*
        If mouse isn't on any trigger,
        close immediately.
    */

    if (
        !hoveringTop &&
        !hoveringNav &&
        !hoveringDevil
    ) {

        closeNav();

    }

}


/* ================================================= */
/* TOP HOVER                                         */
/* ================================================= */

navTrigger.addEventListener(
    "mouseenter",
    () => {

        hoveringTop = true;

        openNav();

    }
);


navTrigger.addEventListener(
    "mouseleave",
    () => {

        hoveringTop = false;

        checkClose();

    }
);


/* ================================================= */
/* NAV HOVER                                         */
/* ================================================= */

navBox.addEventListener(
    "mouseenter",
    () => {

        hoveringNav = true;

        openNav();

    }
);


navBox.addEventListener(
    "mouseleave",
    () => {

        hoveringNav = false;

        checkClose();

    }
);


/* ================================================= */
/* DEVIL HOVER                                       */
/* ================================================= */

devilButton.addEventListener(
    "mouseenter",
    () => {

        hoveringDevil = true;

        /*
            Hover devil:
            ON + OPEN immediately.
        */

        openNav();

    }
);


devilButton.addEventListener(
    "mouseleave",
    () => {

        hoveringDevil = false;

        /*
            If not locked:
            OFF + CLOSE immediately.
        */

        checkClose();

    }
);


/* ================================================= */
/* DEVIL CLICK                                       */
/* ================================================= */

devilButton.addEventListener(
    "click",
    (event) => {

        /*
            This is a normal button.
            Stop anything behind it from
            interfering.
        */

        event.preventDefault();

        event.stopPropagation();


        /* ========================================= */
        /* OFF → ON                                  */
        /* ========================================= */

        if (!locked) {

            locked = true;


            devilButton.classList.add(
                "is-locked"
            );


            /*
                Open and ON immediately.
            */

            nav.classList.add(
                "nav-open"
            );

            setOn();

        }


        /* ========================================= */
        /* ON → OFF                                  */
        /* ========================================= */

        else {

            locked = false;


            devilButton.classList.remove(
                "is-locked"
            );


            /*
                Close and OFF immediately.
            */

            nav.classList.remove(
                "nav-open"
            );

            setOff();

        }

    }
);


/* ================================================= */
/* PAGE NAVIGATION                                   */
/* ================================================= */

const pages = [

    "../Home/index.html",

    "../About/about.html",

    "../Contact/contact.html",

    "../Work/work.html"

];


/* ================================================= */
/* CURRENT PAGE                                      */
/* ================================================= */

const currentPath =
    window.location.pathname
        .toLowerCase();


let currentIndex =
    pages.findIndex(
        (page) => {

            const fileName =
                page
                    .split("/")
                    .pop()
                    .toLowerCase();

            return currentPath
                .endsWith(fileName);

        }
    );


if (currentIndex === -1) {

    currentIndex = 0;

}


/* ================================================= */
/* LEFT                                              */
/* ================================================= */

document
    .getElementById("navLeft")
    .addEventListener(
        "click",
        () => {

            currentIndex--;

            if (
                currentIndex < 0
            ) {

                currentIndex =
                    pages.length - 1;

            }

            window.location.href =
                pages[currentIndex];

        }
    );


/* ================================================= */
/* RIGHT                                             */
/* ================================================= */

document
    .getElementById("navRight")
    .addEventListener(
        "click",
        () => {

            currentIndex++;

            if (
                currentIndex >=
                pages.length
            ) {

                currentIndex = 0;

            }

            window.location.href =
                pages[currentIndex];

        }
    );


/* ================================================= */
/* INITIAL STATE                                     */
/* ================================================= */

/*
    Every reload starts:

    OFF
    CLOSED
    UNLOCKED
*/

locked = false;

hoveringTop = false;

hoveringNav = false;

hoveringDevil = false;


nav.classList.remove(
    "nav-open"
);

devilButton.classList.remove(
    "is-locked"
);

setOff();