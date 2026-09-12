const fb =
    document.getElementById(
        "fb"
    );

const insta =
    document.getElementById(
        "insta"
    );

const mail =
    document.getElementById(
        "mail"
    );


const fbText =
    document.getElementById(
        "fb-text"
    );

const instaText =
    document.getElementById(
        "insta-text"
    );

const mailText =
    document.getElementById(
        "mail-text"
    );


/* =====================================================
   POSITION TEXT NEXT TO LOGOS
===================================================== */

function positionContactText() {

    /*
       Normal gap for FB + Instagram
    */

    const logoGap = 
    Math.max(
        12,
        Math.min(
            22,
            12 + (window.innerWidth - 700) * 0.025
        )
    );


    /*
       Mail needs a little more breathing room
    */

    const mailGap =
    Math.max(
        22,
        Math.min(
            39,
            22 + (window.innerWidth - 700) * 0.025
        )
    );

    /* -------------------------------------------------
       FACEBOOK
       Text → LEFT
    ------------------------------------------------- */

    const fbRect =
        fb.getBoundingClientRect();

    fbText.style.top =
        `${fbRect.top + (fbRect.height / 2) - (fbText.offsetHeight / 2) + window.scrollY}px`;

    fbText.style.left =
        `${fbRect.left - fbText.offsetWidth - logoGap}px`;


    /* -------------------------------------------------
       INSTAGRAM
       Text → RIGHT
    ------------------------------------------------- */

    const instaRect =
        insta.getBoundingClientRect();

    instaText.style.top =
        `${instaRect.top + (instaRect.height / 2) - (instaText.offsetHeight / 2) + window.scrollY}px`;

    instaText.style.left =
        `${instaRect.right + logoGap}px`;


    /* -------------------------------------------------
       EMAIL
       Text → LEFT
       Larger gap than FB
    ------------------------------------------------- */

    const mailRect =
        mail.getBoundingClientRect();

    mailText.style.top =
        `${mailRect.top + (mailRect.height / 2) - (mailText.offsetHeight / 2) + window.scrollY}px`;

    mailText.style.left =
        `${mailRect.left - mailText.offsetWidth - mailGap}px`;

}


/* =====================================================
   INITIAL POSITION
===================================================== */

window.addEventListener(
    "load",
    () => {

        positionContactText();

    }
);


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
    "resize",
    () => {

        positionContactText();

    }
);


/* =====================================================
   SCROLL
===================================================== */

window.addEventListener(
    "scroll",
    () => {

        positionContactText();

    }
);


/* =====================================================
   DESKTOP
===================================================== */

const isMobile =
    window.matchMedia(
        "(max-width: 700px)"
    ).matches;


if (!isMobile) {

    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            const id =
                                entry.target.id;


                            if (
                                id === "fb"
                            ) {

                                fbText.classList.add(
                                    "typing"
                                );

                            }


                            if (
                                id === "insta"
                            ) {

                                instaText.classList.add(
                                    "typing"
                                );

                            }


                            if (
                                id === "mail"
                            ) {

                                mailText.classList.add(
                                    "typing"
                                );

                            }


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.3
            }
        );


    observer.observe(fb);
    observer.observe(insta);
    observer.observe(mail);

}


/* =====================================================
   MOBILE
===================================================== */

else {

    setTimeout(
        () => {

            fbText.classList.add(
                "typing"
            );

        },
        400
    );


    setTimeout(
        () => {

            instaText.classList.add(
                "typing"
            );

        },
        900
    );


    setTimeout(
        () => {

            mailText.classList.add(
                "typing"
            );

        },
        1400
    );

}