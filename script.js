/* =====================================================
   XAVI FASHION PLUG
   SUPABASE MEMBERSHIP + LOGIN + NEWSLETTER
===================================================== */


/* =====================================================
   CHECK SUPABASE CONNECTION
===================================================== */

if (typeof supabaseClient === "undefined") {
    console.error(
        "Supabase is not connected. Check supabase.js and index.html."
    );
}


/* =====================================================
   REGISTER MEMBER
===================================================== */

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const message =
            document.getElementById("registerMessage");


        message.textContent = "Creating your Xavi account...";


        try {

            const { data, error } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {
                            full_name: name
                        },

                        emailRedirectTo:
                            window.location.origin +
                            window.location.pathname

                    }

                });


            if (error) {

                console.error(error);

                message.textContent =
                    error.message;

                return;

            }


            /*
             If email confirmation is enabled,
             Supabase normally sends a confirmation email.
            */

            if (data.user && !data.session) {

                message.textContent =
                    "Account created! Please check your email and confirm your Xavi Fashion Plug account.";

            } else {

                message.textContent =
                    "Welcome to Xavi Fashion Plug! Your account has been created.";

            }


            registerForm.reset();


        } catch (error) {

            console.error(error);

            message.textContent =
                "Something went wrong. Please try again.";

        }

    });

}


/* =====================================================
   LOGIN MEMBER
===================================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");


        message.textContent =
            "Signing you in...";


        try {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,

                    password: password

                });


            if (error) {

                console.error(error);

                message.textContent =
                    error.message;

                return;

            }


            message.textContent =
                "Login successful. Welcome back!";


            loginForm.reset();


            /*
             You can later change this to:
             window.location.href = "account.html";
            */

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to login. Please try again.";

        }

    });

}


/* =====================================================
   CHECK CURRENT MEMBER
===================================================== */

async function checkMemberLogin() {

    if (typeof supabaseClient === "undefined") {
        return;
    }


    const {
        data: { user }
    } = await supabaseClient.auth.getUser();


    if (user) {

        console.log(
            "Xavi member currently logged in:",
            user.email
        );

    } else {

        console.log(
            "No Xavi member currently logged in."
        );

    }

}


checkMemberLogin();


/* =====================================================
   LOGOUT FUNCTION
===================================================== */

async function logoutMember() {

    if (typeof supabaseClient === "undefined") {
        return;
    }


    const { error } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error(
            "Logout error:",
            error.message
        );

        return;

    }


    alert(
        "You have been logged out of Xavi Fashion Plug."
    );

    window.location.reload();

}


/*
Make logoutMember available to HTML buttons.
*/

window.logoutMember = logoutMember;


/* =====================================================
   AUTHENTICATION STATE
===================================================== */

if (typeof supabaseClient !== "undefined") {

    supabaseClient.auth.onAuthStateChange(
        function (event, session) {

            console.log(
                "Xavi authentication:",
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
   NEWSLETTER
===================================================== */

const newsletterForm =
    document.getElementById("newsletterForm");


if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("newsletterEmail")
                    .value
                    .trim();


            const message =
                document
                    .getElementById("newsletterMessage");


            message.textContent =
                "Subscribing...";


            /*
             IMPORTANT:

             The newsletter requires a
             Supabase table called:

             newsletter_subscribers

             We will create that table
             in the next step.
            */


            try {

                const { error } =
                    await supabaseClient
                        .from("newsletter_subscribers")
                        .insert({

                            email: email

                        });


                if (error) {

                    console.error(error);

                    /*
                     If the email already exists,
                     show a friendly message.
                    */

                    if (
                        error.code === "23505"
                    ) {

                        message.textContent =
                            "This email is already subscribed.";

                    } else {

                        message.textContent =
                            error.message;

                    }

                    return;

                }


                message.textContent =
                    "You're subscribed! Welcome to the Xavi community.";


                newsletterForm.reset();


            } catch (error) {

                console.error(error);

                message.textContent =
                    "Unable to subscribe right now. Please try again.";

            }

        }
    );

}


/* =====================================================
   PRODUCT IMAGE LIGHTBOX
===================================================== */

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxClose =
    document.getElementById("lightboxClose");


if (
    lightbox &&
    lightboxImage &&
    lightboxClose
) {


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

                    lightbox.classList.add(
                        "active"
                    );

                    document.body.style.overflow =
                        "hidden";

                }
            );

        });


    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );

        document.body.style.overflow =
            "";

    }


    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );


    lightbox.addEventListener(
        "click",
        function (event) {

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeLightbox();

            }

        }
    );

}


/* =====================================================
   MOBILE MENU
===================================================== */

const menuToggle =
    document.getElementById("menuToggle");

const mainNav =
    document.getElementById("mainNav");


if (menuToggle && mainNav) {


    menuToggle.addEventListener(
        "click",
        function () {

            mainNav.classList.toggle(
                "show"
            );


            if (
                mainNav.classList.contains(
                    "show"
                )
            ) {

                menuToggle.textContent =
                    "✕";

            } else {

                menuToggle.textContent =
                    "☰";

            }

        }
    );


    document
        .querySelectorAll(".nav a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    mainNav.classList.remove(
                        "show"
                    );

                    menuToggle.textContent =
                        "☰";

                }
            );

        });

}


/* =====================================================
   FINISHED
===================================================== */

console.log(
    "Xavi Fashion Plug website loaded successfully."
);
