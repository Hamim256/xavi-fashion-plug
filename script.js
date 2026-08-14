// ==========================================
// XAVI FASHION PLUG
// MAIN JAVASCRIPT
// ==========================================


// ==========================================
// MOBILE MENU
// ==========================================

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav");

if (menuToggle && navigation) {

    menuToggle.addEventListener("click", function () {

        navigation.classList.toggle("show");

        // Change menu icon
        if (navigation.classList.contains("show")) {
            menuToggle.textContent = "✕";
        } else {
            menuToggle.textContent = "☰";
        }

    });

}


// ==========================================
// CLOSE MOBILE MENU AFTER CLICKING A LINK
// ==========================================

const navigationLinks =
    document.querySelectorAll(".nav a");

navigationLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        if (navigation) {
            navigation.classList.remove("show");
        }

        if (menuToggle) {
            menuToggle.textContent = "☰";
        }

    });

});


// ==========================================
// PRODUCT IMAGE LIGHTBOX
// ==========================================

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightbox-image");

const lightboxClose =
    document.querySelector(".lightbox-close");


const productImages =
    document.querySelectorAll(".product-image img");


// Open image

productImages.forEach(function (image) {

    image.addEventListener("click", function () {

        if (!lightbox || !lightboxImage) {
            return;
        }

        lightboxImage.src = image.src;

        lightboxImage.alt = image.alt;

        lightbox.classList.add("active");

        // Stop page from scrolling
        document.body.style.overflow = "hidden";

    });

});


// ==========================================
// CLOSE LIGHTBOX
// ==========================================

function closeLightbox() {

    if (!lightbox) {
        return;
    }

    lightbox.classList.remove("active");

    document.body.style.overflow = "";

}


// Close with X button

if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


// Close when clicking outside image

if (lightbox) {

    lightbox.addEventListener(
        "click",
        function (event) {

            if (event.target === lightbox) {

                closeLightbox();

            }

        }
    );

}


// ==========================================
// CLOSE LIGHTBOX WITH ESC KEY
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeLightbox();

        }

    }
);


// ==========================================
// SMOOTH SCROLLING
// ==========================================

const allPageLinks =
    document.querySelectorAll(
        'a[href^="#"]'
    );


allPageLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId =
            link.getAttribute("href");

        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }


        const target =
            document.querySelector(targetId);


        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


// ==========================================
// IMAGE ERROR HANDLING
// ==========================================

productImages.forEach(function (image) {

    image.addEventListener(
        "error",
        function () {

            console.log(
                "Could not load image:",
                image.src
            );

        }
    );

});


// ==========================================
// PAGE READY MESSAGE
// ==========================================

console.log(
    "Xavi Fashion Plug website loaded successfully."
);
