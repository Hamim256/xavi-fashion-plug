document.querySelector("button").addEventListener("click", function () {
    alert("Welcome to Xavi Fashion Plug!");
    ...
}<script>

/* =====================================================
   PRODUCT IMAGE GALLERY
===================================================== */

function showImage(gallery, index) {

    const images =
        gallery.querySelectorAll(".gallery-images img");

    if (index >= images.length) {
        index = 0;
    }

    if (index < 0) {
        index = images.length - 1;
    }

    images.forEach(image => {
        image.classList.remove("active");
    });

    images[index].classList.add("active");

    const counter =
        gallery.querySelector(".current");

    counter.textContent =
        String(index + 1).padStart(2, "0");

    gallery.dataset.current = index;
}


function changeImage(button, direction) {

    const gallery =
        button.parentElement;

    const images =
        gallery.querySelectorAll(".gallery-images img");

    let current =
        Number(gallery.dataset.current || 0);

    current += direction;

    showImage(gallery, current);
}


/* =====================================================
   PHONE SWIPE
===================================================== */

document.querySelectorAll(".product-gallery").forEach(gallery => {

    let startX = 0;
    let endX = 0;

    gallery.addEventListener("touchstart", function(event) {

        startX = event.touches[0].clientX;

    }, { passive: true });


    gallery.addEventListener("touchend", function(event) {

        endX = event.changedTouches[0].clientX;

        const difference = startX - endX;

        /*
        Only change the picture when the
        finger moved at least 50 pixels.
        */

        if (Math.abs(difference) < 50) {
            return;
        }

        if (difference > 0) {

            // Swipe LEFT → next picture
            changeImage(gallery.querySelector(".gallery-next"), 1);

        } else {

            // Swipe RIGHT → previous picture
            changeImage(gallery.querySelector(".gallery-prev"), -1);

        }

    }, { passive: true });

});

</script>
