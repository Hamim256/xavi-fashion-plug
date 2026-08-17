/* =====================================================
   XAVI FASHION PLUG
   COMPLETE WEBSITE JAVASCRIPT
===================================================== */


/* =====================================================
   MOBILE MENU
===================================================== */

const menuToggle =
    document.getElementById("menuToggle");

const mainNav =
    document.getElementById("mainNav");


if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", function () {

        mainNav.classList.toggle("show");

        if (mainNav.classList.contains("show")) {

            menuToggle.textContent = "×";

        } else {

            menuToggle.textContent = "☰";

        }

    });


    document
        .querySelectorAll(".main-nav a")
        .forEach(function (link) {

            link.addEventListener("click", function () {

                mainNav.classList.remove("show");

                menuToggle.textContent = "☰";

            });

        });

}


/* =====================================================
   PRODUCT GALLERIES
===================================================== */

document
    .querySelectorAll(".product-card")
    .forEach(function (card) {

        const mainImage =
            card.querySelector(".product-image img");

        const thumbnails =
            card.querySelectorAll(".gallery-thumbnails img");


        thumbnails.forEach(function (thumbnail) {

            thumbnail.addEventListener(
                "click",
                function () {

                    mainImage.src =
                        thumbnail.src;

                    mainImage.alt =
                        thumbnail.alt;

                }
            );

        });

    });


/* =====================================================
   LIGHTBOX
===================================================== */

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxClose =
    document.getElementById("lightboxClose");


document
    .querySelectorAll(".product-image img")
    .forEach(function (image) {

        image.addEventListener(
            "click",
            function () {

                lightboxImage.src =
                    image.src;

                lightboxImage.alt =
                    image.alt;

                lightbox.classList.add("active");

                lightbox.setAttribute(
                    "aria-hidden",
                    "false"
                );

                document.body.style.overflow =
                    "hidden";

            }
        );

    });


function closeLightbox() {

    lightbox.classList.remove("active");

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

}


if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


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


document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeLightbox();

        }

    }
);


/* =====================================================
   CHECK SUPABASE
===================================================== */

if (typeof supabaseClient === "undefined") {

    console.error(
        "XAVI ERROR: Supabase is not connected."
    );

}


/* =====================================================
   REGISTER
===================================================== */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const message =
                document
                    .getElementById("registerMessage");


            if (!name || !email || !password) {

                message.textContent =
                    "Please complete all fields.";

                return;

            }


            if (password.length < 6) {

                message.textContent =
                    "Password must contain at least 6 characters.";

                return;

            }


            message.textContent =
                "Creating your Xavi account...";


            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth.signUp({

                        email: email,

                        password: password,

                        options: {

                            data: {
                                full_name: name
                            }

                        }

                    });


                if (error) {

                    console.error(error);

                    message.textContent =
                        error.message;

                    return;

                }


                /*
                 * Save the member profile.
                 *
                 * If email confirmation is enabled,
                 * the user may not have a session yet.
                 */

                if (data.user) {

                    /*
                     * Only try to insert the profile
                     * when there is an authenticated
                     * session.
                     */

                    if (data.session) {

                        const {
                            error: profileError
                        } =
                            await supabaseClient
                                .from(
                                    "member_profiles"
                                )
                                .insert({

                                    id:
                                        data.user.id,

                                    full_name:
                                        name

                                });


                        if (profileError) {

                            console.error(
                                "Profile error:",
                                profileError
                            );

                        }

                    }

                }


                registerForm.reset();


                if (!data.session) {

                    message.textContent =
                        "Account created! Check your email and confirm your account.";

                } else {

                    message.textContent =
                        "Welcome to Xavi Fashion Plug! Your account is ready.";

                    showMember(
                        name
                    );

                }

            } catch (error) {

                console.error(error);

                message.textContent =
                    "Something went wrong. Please try again.";

            }

        }
    );

}


/* =====================================================
   LOGIN
===================================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const message =
                document
                    .getElementById("loginMessage");


            message.textContent =
                "Signing you in...";


            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({

                            email: email,

                            password: password

                        });


                if (error) {

                    console.error(error);

                    message.textContent =
                        error.message;

                    return;

                }


                loginForm.reset();


                message.textContent =
                    "Login successful!";


                let name =
                    data.user.user_metadata
                        ?.full_name;


                if (!name) {

                    const {
                        data: profile
                    } =
                        await supabaseClient
                            .from(
                                "member_profiles"
                            )
                            .select("full_name")
                            .eq(
                                "id",
                                data.user.id
                            )
                            .maybeSingle();


                    if (profile) {

                        name =
                            profile.full_name;

                    }

                }


                showMember(
                    name || "Xavi Member"
                );


            } catch (error) {

                console.error(error);

                message.textContent =
                    "Login failed. Please try again.";

            }

        }
    );

}


/* =====================================================
   SHOW MEMBER
===================================================== */

function showMember(name) {

    const welcome =
        document.getElementById(
            "memberWelcome"
        );

    const memberName =
        document.getElementById(
            "memberName"
        );


    if (welcome && memberName) {

        memberName.textContent =
            name;

        welcome.classList.remove(
            "hidden"
        );

    }

}


/* =====================================================
   LOGOUT
===================================================== */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                const {
                    error
                } =
                    await supabaseClient.auth
                        .signOut();


                if (error) {

                    console.error(error);

                    return;

                }


                document
                    .getElementById(
                        "memberWelcome"
                    )
                    .classList.add(
                        "hidden"
                    );


                alert(
                    "You have been logged out."
                );


            } catch (error) {

                console.error(error);

            }

        }
    );

}


/* =====================================================
   CHECK EXISTING LOGIN
===================================================== */

async function checkExistingMember() {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        return;

    }


    try {

        const {
            data
        } =
            await supabaseClient.auth
                .getUser();


        if (!data.user) {

            return;

        }


        let name =
            data.user.user_metadata
                ?.full_name;


        if (!name) {

            const {
                data: profile
            } =
                await supabaseClient
                    .from(
                        "member_profiles"
                    )
                    .select("full_name")
                    .eq(
                        "id",
                        data.user.id
                    )
                    .maybeSingle();


            if (profile) {

                name =
                    profile.full_name;

            }

        }


        showMember(
            name || "Xavi Member"
        );


    } catch (error) {

        console.error(error);

    }

}


checkExistingMember();


/* =====================================================
   NEWSLETTER
===================================================== */

const newsletterForm =
    document.getElementById(
        "newsletterForm"
    );


if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "newsletterEmail"
                    )
                    .value
                    .trim();


            const message =
                document
                    .getElementById(
                        "newsletterMessage"
                    );


            message.textContent =
                "Subscribing...";


            try {

                const {
                    error
                } =
                    await supabaseClient
                        .from(
                            "newsletter_subscribers"
                        )
                        .insert({

                            email: email

                        });


                if (error) {

                    console.error(error);


                    if (
                        error.code ===
                        "23505"
                    ) {

                        message.textContent =
                            "This email is already subscribed.";

                    } else {

                        message.textContent =
                            "Subscription failed: " +
                            error.message;

                    }

                    return;

                }


                newsletterForm.reset();


                message.textContent =
                    "You're subscribed! Welcome to Xavi.";

            } catch (error) {

                console.error(error);

                message.textContent =
                    "Unable to subscribe. Please try again.";

            }

        }
    );

}


/* =====================================================
   AUTH STATE
===================================================== */

if (
    typeof supabaseClient !==
    "undefined"
) {

    supabaseClient.auth.onAuthStateChange(
        function (event, session) {

            console.log(
                "Xavi authentication event:",
                event
            );


            if (session) {

                console.log(
                    "Member logged in:",
                    session.user.email
                );

            }

        }
    );

}


/* =====================================================
   FINAL MESSAGE
===================================================== */

console.log(
    "XAVI FASHION PLUG WEBSITE LOADED"
);
