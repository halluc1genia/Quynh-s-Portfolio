/* =====================================================
   LOADING ASSETS
===================================================== */

const loadingAssets = [

    "../Images/Load/id 1.png",
    "../Images/Load/id 2.png",
    "../Images/Load/id 3.png",
    "../Images/Load/id 4.png"

];


/* =====================================================
   CREATE LOADER
===================================================== */

const loaderHTML = `

    <div id="loader">

        <div id="loadingBox">

            ${Array.from(
                { length: 8 },
                (_, index) => {

                    const src =
                        loadingAssets[
                            index %
                            loadingAssets.length
                        ];

                    return `
                        <img
                            src="${src}"
                            data-image="${src}"
                            alt=""
                        >
                    `;

                }
            ).join("")}

        </div>

    </div>

`;


document.body.insertAdjacentHTML(
    "afterbegin",
    loaderHTML
);


/* =====================================================
   ELEMENTS
===================================================== */

const loader =
    document.getElementById("loader");

const loadingBox =
    document.getElementById("loadingBox");

const allAssets =
    Array.from(
        loadingBox.querySelectorAll("img")
    );


/* =====================================================
   LOCK PAGE
===================================================== */

document.body.classList.add(
    "loading-active"
);


/* =====================================================
   GET VISIBLE ASSETS
===================================================== */

function getVisibleAssets() {

    return allAssets.filter(asset => {

        return (
            window.getComputedStyle(asset)
                .display !== "none"
        );

    });

}


/* =====================================================
   SHUFFLE ARRAY
===================================================== */

function shuffleArray(array) {

    const result = [
        ...array
    ];


    for (
        let i =
            result.length - 1;

        i > 0;

        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            result[i],
            result[randomIndex]
        ] = [
            result[randomIndex],
            result[i]
        ];

    }


    return result;

}


/* =====================================================
   CHECK IF SLOT IMAGE CHANGED
===================================================== */

function hasSameImage(
    current,
    next
) {

    for (
        let i = 0;

        i < current.length;

        i++
    ) {

        if (
            current[i].dataset.image ===
            next[i].dataset.image
        ) {

            return true;

        }

    }


    return false;

}


/* =====================================================
   CREATE NEW ARRANGEMENT
===================================================== */

function createNewArrangement(
    visibleAssets
) {

    const current =
        [...visibleAssets];


    let next =
        shuffleArray(
            current
        );


    /*
     * Thử random nhiều lần để tránh
     * asset nằm lại đúng slot cũ.
     */

    let attempts = 0;


    while (
        hasSameImage(
            current,
            next
        )
        &&
        attempts < 20
    ) {

        next =
            shuffleArray(
                current
            );

        attempts++;

    }


    /*
     * Nếu random vẫn bị trùng,
     * rotate array để đảm bảo
     * vị trí thay đổi.
     */

    if (
        hasSameImage(
            current,
            next
        )
    ) {

        const offset =
            Math.floor(
                Math.random() *
                (next.length - 1)
            ) + 1;


        next =
            current.map(
                (_, index) => {

                    return current[
                        (index + offset) %
                        current.length
                    ];

                }
            );

    }


    return next;

}


/* =====================================================
   SHUFFLE
===================================================== */

function shuffleAssets() {

    const visibleAssets =
        getVisibleAssets();


    if (
        visibleAssets.length < 2
    ) {

        return;

    }


    /*
     * Tạo arrangement mới
     */

    const newArrangement =
        createNewArrangement(
            visibleAssets
        );


    /*
     * DocumentFragment
     *
     * Gom toàn bộ DOM operation
     * thành một batch.
     */

    const fragment =
        document.createDocumentFragment();


    newArrangement.forEach(
        asset => {

            fragment.appendChild(
                asset
            );

        }
    );


    /*
     * Chỉ update DOM một lần.
     */

    loadingBox.appendChild(
        fragment
    );

}


/* =====================================================
   SHUFFLE SPEED
===================================================== */

const isMobile =
    window.matchMedia(
        "(max-width: 700px)"
    ).matches;


const shuffleSpeed =
    isMobile
        ? 500
        : 500;


const shuffleInterval =
    setInterval(
        shuffleAssets,
        shuffleSpeed
    );


/* =====================================================
   MINIMUM LOADING TIME
===================================================== */

const minimumLoadingTime =
    3000;

const loadingStartTime =
    performance.now();


/* =====================================================
   WAIT FOR LOADING ASSETS
===================================================== */

function waitForLoadingAssets() {

    const promises =
        allAssets.map(
            asset => {

                /*
                 * Image đã load
                 */

                if (
                    asset.complete &&
                    asset.naturalWidth > 0
                ) {

                    return Promise.resolve();

                }


                /*
                 * Image chưa load
                 */

                return new Promise(
                    resolve => {

                        asset.addEventListener(
                            "load",
                            resolve,
                            {
                                once: true
                            }
                        );


                        asset.addEventListener(
                            "error",
                            resolve,
                            {
                                once: true
                            }
                        );

                    }
                );

            }
        );


    return Promise.all(
        promises
    );

}


/* =====================================================
   FINISH LOADING
===================================================== */

async function finishLoading() {

    /*
     * Đợi tất cả loading asset.
     */

    await waitForLoadingAssets();


    /*
     * Tính thời gian đã chạy.
     */

    const elapsed =
        performance.now() -
        loadingStartTime;


    /*
     * Đảm bảo minimum 3 giây.
     */

    const remaining =
        Math.max(
            0,
            minimumLoadingTime -
            elapsed
        );


    setTimeout(() => {

        clearInterval(
            shuffleInterval
        );


        /*
         * Fade OUT loader
         */

        loader.classList.add(
            "is-hidden"
        );


        document.body.classList.remove(
            "loading-active"
        );


        /*
         * Remove sau khi fade hoàn thành.
         */

        setTimeout(() => {

            loader.remove();

        }, 600);

    }, remaining);

}


/* =====================================================
   PAGE LOAD
===================================================== */

window.addEventListener(
    "load",
    finishLoading
);