document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURACIÓN
    ====================================================== */

    /* Si el sistema pide menos movimiento, se apagan
       los efectos y se conservan solo los útiles */

    const REDUCED = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* En pantallas táctiles se eliminan los efectos
       que solo funcionan con ratón y se baja la
       resolución de los lienzos para ahorrar batería */

    const TOUCH = window.matchMedia(
        "(hover: none), (pointer: coarse)"
    ).matches;

    const MOVIL = TOUCH || window.innerWidth <= 700;

    const CONFIG = {

        matrix: !REDUCED,

        network: !REDUCED,

        cursor: !REDUCED && !TOUCH,

        floatingData: !REDUCED && !MOVIL,

        glitch: !REDUCED,

        terminal: true,

        clickEffect: !REDUCED && !TOUCH,

        tilt: !REDUCED && !TOUCH,

        parallax: !REDUCED && !TOUCH

    };


    /* Un móvil con dpr 3 dibujaría 9 veces más
       píxeles que uno de dpr 1 sin ganar nitidez */

    const DPR_MAX = MOVIL ? 1.5 : 2;

    const pixelRatio = () =>
        Math.min(
            window.devicePixelRatio || 1,
            DPR_MAX
        );


    /* Los bucles de animación se detienen
       cuando la pestaña no está a la vista */

    let pageVisible = !document.hidden;

    document.addEventListener(
        "visibilitychange",
        () => {

            pageVisible = !document.hidden;

        }
    );


    /* =====================================================
       NAVBAR
    ====================================================== */

    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 30) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    });


    /* =====================================================
       MENÚ MÓVIL
    ====================================================== */

    const menuBtn = document.getElementById("menuBtn");

    const navLinks = document.getElementById("navLinks");


    function setMenu(open) {

        navLinks.classList.toggle("open", open);

        menuBtn.classList.toggle("abierto", open);

        menuBtn.setAttribute(
            "aria-expanded",
            String(open)
        );

        menuBtn.setAttribute(
            "aria-label",
            open ? "Cerrar menú" : "Abrir menú"
        );

    }


    menuBtn.addEventListener("click", () => {

        setMenu(!navLinks.classList.contains("open"));

    });


    document.querySelectorAll("#navLinks a").forEach(link => {

        link.addEventListener("click", () => setMenu(false));

    });


    /* Cerrar el menú con Esc o al hacer clic fuera */

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            navLinks.classList.contains("open")
        ) {

            setMenu(false);

            menuBtn.focus();

        }

    });


    document.addEventListener("click", event => {

        if (!navLinks.classList.contains("open")) return;

        /* El camino del evento se revisa porque al
           pulsar el botón el destino puede haber
           cambiado dentro del mismo clic */

        const ruta =
            event.composedPath
                ? event.composedPath()
                : [event.target];

        if (
            ruta.includes(navLinks) ||
            ruta.includes(menuBtn)
        ) return;

        setMenu(false);

    });



    /* =====================================================
       REVEAL DE ELEMENTOS
    ====================================================== */

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.12
        }

    );


    document.querySelectorAll(".reveal").forEach(element => {

        observer.observe(element);

    });



    /* =====================================================
       CURSOR CYBER
    ====================================================== */

    if (CONFIG.cursor) {

        const cursor =
            document.getElementById("cyberCursor");

        const glow =
            document.getElementById("mouseGlow");


        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let cursorX = mouseX;
        let cursorY = mouseY;


        document.addEventListener("mousemove", event => {

            mouseX = event.clientX;
            mouseY = event.clientY;

        });


        function updateCursor() {

            if (pageVisible) {

                cursorX +=
                    (mouseX - cursorX) * 0.18;

                cursorY +=
                    (mouseY - cursorY) * 0.18;


                cursor.style.left =
                    cursorX + "px";

                cursor.style.top =
                    cursorY + "px";


                glow.style.left =
                    mouseX + "px";

                glow.style.top =
                    mouseY + "px";

            }

            requestAnimationFrame(updateCursor);

        }


        updateCursor();


        document
            .querySelectorAll("a, button, .skill-card, .cert-card")
            .forEach(element => {

                element.addEventListener(
                    "mouseenter",
                    () => {

                        cursor.classList.add(
                            "cursor-active"
                        );

                    }
                );


                element.addEventListener(
                    "mouseleave",
                    () => {

                        cursor.classList.remove(
                            "cursor-active"
                        );

                    }
                );

            });

    }



    /* =====================================================
       TERMINAL ANIMADA
    ====================================================== */

    if (CONFIG.terminal) {

        const terminal =
            document.getElementById("terminalText");


        const commands = [

            " ./portfolio --initialize",

            " scanning network interfaces...",

            " firewall status: ACTIVE",

            " cybersecurity modules: ONLINE",

            " loading cloud infrastructure...",

            " loading embedded systems...",

            " analyzing data...",

            " access granted.",

            " welcome Miguel."

        ];


        let commandIndex = 0;

        let letterIndex = 0;

        let deleting = false;


        function typeTerminal() {

            const current =
                commands[commandIndex];


            if (!deleting) {

                terminal.textContent =
                    current.substring(
                        0,
                        letterIndex
                    );

                letterIndex++;


                if (
                    letterIndex >
                    current.length
                ) {

                    deleting = true;

                    setTimeout(
                        typeTerminal,
                        1200
                    );

                    return;

                }

            } else {

                letterIndex--;

                terminal.textContent =
                    current.substring(
                        0,
                        letterIndex
                    );


                if (letterIndex <= 0) {

                    deleting = false;

                    commandIndex++;

                    if (
                        commandIndex >=
                        commands.length
                    ) {

                        commandIndex = 0;

                    }

                }

            }


            setTimeout(
                typeTerminal,
                deleting ? 20 : 45
            );

        }


        /* Con movimiento reducido se muestra la última
           línea de una vez, sin escribir ni borrar */

        if (REDUCED) {

            terminal.textContent =
                commands[commands.length - 1];

        } else {

            typeTerminal();

        }

    }



    /* =====================================================
       MATRIX
    ====================================================== */

    if (CONFIG.matrix) {

        const canvas =
            document.getElementById(
                "matrixCanvas"
            );

        const ctx =
            canvas.getContext("2d");


        let width;
        let height;

        let columns;

        let drops;


        function resizeMatrix() {

            const dpr = pixelRatio();

            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width =
                Math.floor(width * dpr);

            canvas.height =
                Math.floor(height * dpr);

            canvas.style.width =
                width + "px";

            canvas.style.height =
                height + "px";

            ctx.setTransform(
                dpr, 0, 0, dpr, 0, 0
            );


            columns =
                Math.floor(width / 18);


            drops =
                Array(columns)
                    .fill(1)
                    .map(() =>
                        Math.random() * -100
                    );

        }


        resizeMatrix();


        window.addEventListener(
            "resize",
            resizeMatrix
        );


        const chars =
            "01ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>#$%";


        function matrix() {

            if (pageVisible) {

                ctx.fillStyle =
                    "rgba(5,8,22,.08)";

                ctx.fillRect(
                    0,
                    0,
                    width,
                    height
                );


                ctx.font =
                    "11px JetBrains Mono";


                ctx.fillStyle =
                    "rgba(34,211,238,.35)";


                for (
                    let i = 0;
                    i < drops.length;
                    i++
                ) {

                    const char =
                        chars[
                            Math.floor(
                                Math.random() *
                                chars.length
                            )
                        ];

                    ctx.fillText(
                        char,
                        i * 18,
                        drops[i] * 18
                    );


                    if (
                        drops[i] * 18 >
                        height &&
                        Math.random() > .975
                    ) {

                        drops[i] = 0;

                    }


                    drops[i] += .4;

                }

            }

            requestAnimationFrame(matrix);

        }



        matrix();

    }



    /* =====================================================
       RED DE NODOS
    ====================================================== */

    if (CONFIG.network) {

        const canvas =
            document.getElementById(
                "networkCanvas"
            );

        const ctx =
            canvas.getContext("2d");


        let nodes = [];

        let width;

        let height;


        function resizeNetwork() {

            const dpr = pixelRatio();

            width =
                window.innerWidth;

            height =
                window.innerHeight;

            canvas.width =
                Math.floor(width * dpr);

            canvas.height =
                Math.floor(height * dpr);

            canvas.style.width =
                width + "px";

            canvas.style.height =
                height + "px";

            ctx.setTransform(
                dpr, 0, 0, dpr, 0, 0
            );


            nodes = [];


            const count =
                Math.min(
                    80,
                    Math.floor(
                        window.innerWidth / 15
                    )
                );


            for (
                let i = 0;
                i < count;
                i++
            ) {

                nodes.push({

                    x:
                        Math.random() *
                        width,

                    y:
                        Math.random() *
                        height,

                    vx:
                        (Math.random() - .5)
                        * .3,

                    vy:
                        (Math.random() - .5)
                        * .3,

                    radius:
                        Math.random() * 1.5 + .5

                });

            }

        }


        resizeNetwork();


        window.addEventListener(
            "resize",
            resizeNetwork
        );


        function drawNetwork() {

            if (pageVisible) {

                ctx.clearRect(
                    0,
                    0,
                    width,
                    height
                );


                nodes.forEach(node => {

                    node.x += node.vx;

                    node.y += node.vy;


                    if (
                        node.x < 0 ||
                        node.x > width
                    ) {

                        node.vx *= -1;

                    }


                    if (
                        node.y < 0 ||
                        node.y > height
                    ) {

                        node.vy *= -1;

                    }


                    ctx.beginPath();

                    ctx.arc(
                        node.x,
                        node.y,
                        node.radius,
                        0,
                        Math.PI * 2
                    );


                    ctx.fillStyle =
                        "rgba(34,211,238,.7)";

                    ctx.fill();

                });


                for (
                    let i = 0;
                    i < nodes.length;
                    i++
                ) {

                    for (
                        let j = i + 1;
                        j < nodes.length;
                        j++
                    ) {

                        const dx =
                            nodes[i].x -
                            nodes[j].x;


                        const dy =
                            nodes[i].y -
                            nodes[j].y;


                        const distance =
                            Math.sqrt(
                                dx * dx +
                                dy * dy
                            );


                        if (distance < 120) {

                            ctx.beginPath();

                            ctx.moveTo(
                                nodes[i].x,
                                nodes[i].y
                            );

                            ctx.lineTo(
                                nodes[j].x,
                                nodes[j].y
                            );


                            ctx.strokeStyle =
                                `rgba(34,211,238,${
                                    (1 - distance / 120)
                                    * .22
                                })`;


                            ctx.lineWidth = .6;

                            ctx.stroke();

                        }

                    }

                }

            }


            requestAnimationFrame(
                drawNetwork
            );

        }


        drawNetwork();

    }



    /* =====================================================
       DATOS TECNOLÓGICOS FLOTANTES
    ====================================================== */

    if (CONFIG.floatingData) {

        const data = [

            "TCP/IP",

            "SSH",

            "010101",

            "FIREWALL",

            "LINUX",

            "C++",

            "PYTHON",

            "UAZ",

            "NETWORK",

            "ENCRYPTED",

            "CYBERSECURITY",

            "IOT",

            "FPGA",

            "CLOUD",

            "AWS",

            "BIGQUERY",

            "PACKET_TRACER"

        ];


        data.forEach((text, index) => {

            const element =
                document.createElement(
                    "div"
                );


            element.textContent =
                text;


            element.style.position =
                "fixed";


            element.style.left =
                Math.random() * 95 + "%";


            element.style.top =
                Math.random() * 90 + "%";


            element.style.font =
                "9px 'JetBrains Mono'";


            element.style.color =
                "rgba(34,211,238,.12)";


            element.style.pointerEvents =
                "none";


            element.style.zIndex =
                "-1";


            element.style.animation =
                `floatData ${
                    5 + Math.random() * 8
                }s ease-in-out infinite alternate`;


            element.style.animationDelay =
                `${index * -.5}s`;


            document.body.appendChild(
                element
            );

        });


        const style =
            document.createElement(
                "style"
            );


        style.textContent = `

            @keyframes floatData {

                from {

                    transform:
                        translateY(0)
                        translateX(0);

                }

                to {

                    transform:
                        translateY(-30px)
                        translateX(15px);

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }



    /* =====================================================
       EFECTO 3D DE TARJETAS
    ====================================================== */

    if (CONFIG.tilt) {

        document
            .querySelectorAll(
                ".skill-card, .cert-card, .stat-card"
            )
            .forEach(card => {


                card.addEventListener(
                    "mousemove",
                    event => {

                        if (
                            window.innerWidth <
                            800
                        ) return;


                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width -
                            .5;


                        const y =
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height -
                            .5;


                        card.style.transform = `

                            perspective(700px)

                            rotateX(${y * -5}deg)

                            rotateY(${x * 5}deg)

                            translateY(-5px)

                        `;

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.transform =
                            "";

                    }
                );

            });

    }



    /* =====================================================
       GLITCH DEL NOMBRE
    ====================================================== */

    if (CONFIG.glitch) {

        const title =
            document.querySelector(
                ".hero h1"
            );


        setInterval(() => {

            if (!pageVisible) return;

            if (
                Math.random() >
                .65
            ) {

                title.style.transform =
                    "translateX(2px)";


                title.style.textShadow = `

                    2px 0 #22d3ee,

                    -2px 0 #3b82f6

                `;


                setTimeout(() => {

                    title.style.transform =
                        "";

                    title.style.textShadow =
                        "";

                }, 100);

            }

        }, 1800);

    }



    /* =====================================================
       PARALLAX DE LA FOTO
    ====================================================== */

    if (CONFIG.parallax) {

        const photo =
            document.querySelector(
                ".photo-container"
            );


        document.addEventListener(
            "mousemove",
            event => {

                if (
                    window.innerWidth <
                    900
                ) return;


                const x =
                    event.clientX /
                    window.innerWidth -
                    .5;


                const y =
                    event.clientY /
                    window.innerHeight -
                    .5;


                photo.style.transform = `

                    perspective(900px)

                    rotateY(${x * 6}deg)

                    rotateX(${y * -6}deg)

                `;

            }
        );

    }



    /* =====================================================
       EFECTO AL HACER CLICK
    ====================================================== */

    if (CONFIG.clickEffect) {

        document.addEventListener(
            "click",
            event => {

                const pulse =
                    document.createElement(
                        "div"
                    );


                pulse.style.position =
                    "fixed";


                pulse.style.left =
                    event.clientX + "px";


                pulse.style.top =
                    event.clientY + "px";


                pulse.style.width =
                    "8px";


                pulse.style.height =
                    "8px";


                pulse.style.border =
                    "1px solid #22d3ee";


                pulse.style.borderRadius =
                    "50%";


                pulse.style.pointerEvents =
                    "none";


                pulse.style.zIndex =
                    "9998";


                pulse.style.boxShadow =
                    "0 0 20px #22d3ee";


                pulse.style.transform =
                    "translate(-50%,-50%)";


                document.body.appendChild(
                    pulse
                );


                pulse.animate(

                    [

                        {
                            transform:
                                "translate(-50%,-50%) scale(1)",

                            opacity:1

                        },

                        {

                            transform:
                                "translate(-50%,-50%) scale(8)",

                            opacity:0

                        }

                    ],

                    {

                        duration:500,

                        easing:
                            "cubic-bezier(.2,.8,.2,1)"

                    }

                ).onfinish = () => {

                    pulse.remove();

                };

            }
        );

    }



    /* =====================================================
       COPIAR CORREO
       Los enlaces ya están en el HTML, aquí solo
       se agrega la acción de copiar
    ====================================================== */

    const copyEmail = document.getElementById("copyEmail");


    if (copyEmail) {

        const copyIcon =
            '<i class="fa-solid fa-copy"></i>';

        const doneIcon =
            '<i class="fa-solid fa-check"></i>';


        copyEmail.addEventListener("click", async () => {

            const email =
                copyEmail.dataset.email;

            try {

                await navigator.clipboard.writeText(email);

                copyEmail.classList.add("copiado");

                copyEmail.innerHTML =
                    doneIcon + " ¡Copiado!";

                setTimeout(() => {

                    copyEmail.classList.remove(
                        "copiado"
                    );

                    copyEmail.innerHTML =
                        copyIcon + " Copiar correo";

                }, 2000);

            } catch (error) {

                /* Sin HTTPS o sin permiso:
                   se abre el cliente de correo */

                window.location.href =
                    "mailto:" + email;

            }

        });

    }


    /* =========================================
       SLIDER DE LA GALERÍA
    ========================================= */

    const galleryTrack =
        document.querySelector(
            ".gallery-track"
        );

    const galleryItems =
        galleryTrack.querySelectorAll(
            ".gallery-item"
        );

    const galleryPrev =
        document.getElementById(
            "galleryPrev"
        );

    const galleryNext =
        document.getElementById(
            "galleryNext"
        );

    const galleryProgress =
        document.getElementById(
            "galleryProgress"
        );

    const galleryProgressBar =
        document.getElementById(
            "galleryProgressBar"
        );

    const galleryCounter =
        document.getElementById(
            "galleryCounter"
        );


    let galleryDragging = false;

    let galleryDragged = false;

    let galleryStartX = 0;

    let galleryStartScroll = 0;


    /* Que las imágenes no se arrastren de forma nativa */

    galleryTrack
        .querySelectorAll("img")
        .forEach(image => {

            image.draggable = false;

        });


    /* Ancho de un paso entre imágenes */

    function galleryStep() {

        const item =
            galleryItems[0];

        if (!item) return 1;

        const styles =
            getComputedStyle(
                galleryTrack
            );

        const gap =
            parseFloat(
                styles.columnGap ||
                styles.gap
            ) || 0;

        return item.getBoundingClientRect().width + gap;

    }


    function galleryMaxScroll() {

        return galleryTrack.scrollWidth -
            galleryTrack.clientWidth;

    }


    /* Imagen actual */

    function galleryIndex() {

        const step = galleryStep();

        if (step <= 0) return 0;

        return Math.min(
            Math.max(
                Math.round(
                    galleryTrack.scrollLeft / step
                ),
                0
            ),
            galleryItems.length - 1
        );

    }


    /* Ir a una imagen concreta */

    function galleryGoTo(index) {

        galleryTrack.scrollTo({
            left: Math.min(
                Math.max(index, 0) * galleryStep(),
                galleryMaxScroll()
            ),
            behavior: "smooth"
        });

    }


    /* Refrescar flechas, barra y contador */

    function galleryUpdate() {

        const max =
            galleryMaxScroll();

        const left =
            galleryTrack.scrollLeft;

        const width =
            galleryProgress.clientWidth;

        const ratio =
            max > 0
                ? left / max
                : 0;

        const bar =
            max > 0
                ? Math.max(
                    18,
                    width *
                    galleryTrack.clientWidth /
                    galleryTrack.scrollWidth
                )
                : width;

        const current =
            galleryIndex();

        galleryProgressBar.style.width =
            bar + "px";

        galleryProgressBar.style.transform =
            `translateX(${ratio * (width - bar)}px)`;

        galleryCounter.textContent =
            String(current + 1).padStart(2, "0") +
            " / " +
            String(galleryItems.length).padStart(2, "0");

        galleryProgress.setAttribute(
            "aria-valuenow",
            current + 1
        );

        galleryProgress.setAttribute(
            "aria-valuemax",
            galleryItems.length
        );

        galleryPrev.disabled =
            left <= 1;

        galleryNext.disabled =
            left >= max - 1;

    }


    galleryPrev.addEventListener(
        "click",
        () => galleryGoTo(galleryIndex() - 1)
    );

    galleryNext.addEventListener(
        "click",
        () => galleryGoTo(galleryIndex() + 1)
    );


    /* Barra de progreso: saltar a la posición */

    function gallerySeek(event) {

        const rect =
            galleryProgress
                .getBoundingClientRect();

        const ratio =
            (event.clientX - rect.left) / rect.width;

        const max =
            galleryMaxScroll();

        galleryTrack.scrollLeft =
            Math.min(
                Math.max(ratio, 0) * max,
                max
            );

    }

    galleryProgress.addEventListener(
        "pointerdown",
        event => {

            /* Si el navegador no concede la captura,
               la búsqueda igual debe funcionar */

            try {

                galleryProgress.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {}

            gallerySeek(event);

        }
    );

    galleryProgress.addEventListener(
        "pointermove",
        event => {

            if (
                !galleryProgress.hasPointerCapture(
                    event.pointerId
                )
            ) return;

            gallerySeek(event);

        }
    );


    /* Teclado sobre la barra */

    galleryProgress.addEventListener(
        "keydown",
        event => {

            const keys = [
                "ArrowLeft",
                "ArrowRight",
                "Home",
                "End"
            ];

            if (!keys.includes(event.key)) return;

            event.preventDefault();

            if (event.key === "Home") {

                galleryGoTo(0);

            } else if (event.key === "End") {

                galleryGoTo(galleryItems.length - 1);

            } else {

                galleryGoTo(
                    galleryIndex() +
                    (event.key === "ArrowRight" ? 1 : -1)
                );

            }

        }
    );


    /* Arrastrar con el mouse */

    galleryTrack.addEventListener(
        "pointerdown",
        event => {

            if (event.pointerType !== "mouse") return;

            if (event.button !== 0) return;

            galleryDragging = true;

            galleryStartX = event.clientX;

            galleryStartScroll = galleryTrack.scrollLeft;

        }
    );

    galleryTrack.addEventListener(
        "pointermove",
        event => {

            if (!galleryDragging) return;

            const distance =
                event.clientX - galleryStartX;

            if (Math.abs(distance) > 4) {

                galleryDragged = true;

                galleryTrack.classList.add(
                    "dragging"
                );

            }

            galleryTrack.scrollLeft =
                galleryStartScroll - distance;

        }
    );

    window.addEventListener(
        "pointerup",
        () => {

            if (!galleryDragging) return;

            galleryDragging = false;

            galleryTrack.classList.remove(
                "dragging"
            );

        }
    );


    /* Un arrastre no debe abrir el visor */

    galleryTrack.addEventListener(
        "click",
        event => {

            if (!galleryDragged) return;

            event.stopPropagation();

            event.preventDefault();

            galleryDragged = false;

        },
        true
    );


    galleryTrack.addEventListener(
        "scroll",
        galleryUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        galleryUpdate
    );

    galleryUpdate();


    /* =========================================
    GALERÍA / LIGHTBOX
    ========================================= */

    const galleryImages =
        document.querySelectorAll(
            ".gallery-item img"
        );

    const lightbox =
        document.getElementById(
            "imageLightbox"
        );

    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );

    const lightboxClose =
        document.getElementById(
            "lightboxClose"
        );

    const lightboxCaption =
        document.getElementById(
            "lightboxCaption"
        );

    const lightboxCounter =
        document.getElementById(
            "lightboxCounter"
        );


    let lightboxIndex = 0;


    /* Mostrar una imagen en el visor */

    function showLightboxImage(index) {

        const total =
            galleryImages.length;

        if (!total) return;

        lightboxIndex =
            (index + total) % total;

        const image =
            galleryImages[lightboxIndex];

        lightboxImage.src =
            image.src;

        lightboxImage.alt =
            image.alt;

        lightboxCaption.textContent =
            image.alt;

        lightboxCounter.textContent =
            String(lightboxIndex + 1).padStart(2, "0") +
            " / " +
            String(total).padStart(2, "0");

    }


    /* Abrir imagen */

    galleryImages.forEach((image, index) => {

        image.addEventListener(
            "click",
            () => {

                showLightboxImage(index);

                lightbox.classList.add(
                    "active"
                );

                document.body.style.overflow =
                    "hidden";

                lightboxClose.focus();

            }
        );

    });


    /* Cerrar */

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


    /* Cerrar haciendo clic en el fondo */

    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );


    /* Cerrar con ESC y navegar con las flechas */

    document.addEventListener(
        "keydown",
        event => {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) return;


            if (
                event.key === "Escape"
            ) {

                closeLightbox();

                return;

            }


            if (
                event.key === "ArrowRight"
            ) {

                showLightboxImage(
                    lightboxIndex + 1
                );

                /* La galería sigue a la imagen del visor */

                galleryGoTo(lightboxIndex);

            }


            if (
                event.key === "ArrowLeft"
            ) {

                showLightboxImage(
                    lightboxIndex - 1
                );

                galleryGoTo(lightboxIndex);

            }

        }
    );

    /* =========================================
       CERTIFICACIONES: ZOOM Y PROTECCIÓN
    ========================================= */

    const certThumbs =
        document.querySelectorAll(
            ".cert-thumb"
        );

    const certModal =
        document.getElementById(
            "certModal"
        );

    const certStage =
        document.getElementById(
            "certStage"
        );

    const certImage =
        document.getElementById(
            "certModalImage"
        );

    const certTitle =
        document.getElementById(
            "certModalTitle"
        );

    const certZoomLevel =
        document.getElementById(
            "certZoomLevel"
        );

    const certModalHint =
        document.getElementById(
            "certModalHint"
        );

    const certZoomIn =
        document.getElementById(
            "certZoomIn"
        );

    const certZoomOut =
        document.getElementById(
            "certZoomOut"
        );

    const certModalPrev =
        document.getElementById(
            "certModalPrev"
        );

    const certModalNext =
        document.getElementById(
            "certModalNext"
        );

    /* Niveles de zoom.
       El 0 es "ajustar a la pantalla",
       los demás son múltiplos
       del tamaño real */

    const ZOOM_STEPS = [0, 1, 1.5, 2, 3];

    let certIndex = 0;

    let certZoom = 0;

    let certLastFocus = null;


    /* Evita que la imagen se pueda arrastrar
       o guardar con el clic derecho */

    function protegerImagen(element) {

        element.draggable = false;

        element.addEventListener(
            "dragstart",
            event => event.preventDefault()
        );

        element.addEventListener(
            "contextmenu",
            event => event.preventDefault()
        );

    }

    document.querySelectorAll(
        ".cert-thumb img"
    ).forEach(protegerImagen);

    protegerImagen(certImage);


    /* Aplicar el nivel de zoom */

    function aplicarZoom() {

        const nivel =
            ZOOM_STEPS[certZoom];

        /* 0 = la imagen completa, sin ampliar */

        if (!nivel) {

            certImage.style.width = "";

            certImage.classList.remove("ampliada");

            certZoomLevel.textContent = "Ajustar";

            certModalHint.textContent =
                "Clic en la imagen para acercar";

            return;

        }

        certImage.style.width =
            certImage.naturalWidth * nivel + "px";

        certImage.classList.add("ampliada");

        certZoomLevel.textContent =
            Math.round(nivel * 100) + "%";

        certModalHint.textContent =
            "Arrastra para recorrer la imagen · Esc para cerrar";

    }


    function cambiarZoom(delta) {

        const siguiente =
            certZoom + delta;

        /* No se puede alejar más que "ajustar" */

        if (siguiente < 0) return;

        /* Del máximo se vuelve a ajustar */

        certZoom =
            siguiente >= ZOOM_STEPS.length
                ? 0
                : siguiente;

        aplicarZoom();

    }


    /* Mostrar un certificado en el visor */

    function mostrarCertificado(index) {

        const total = certThumbs.length;

        if (!total) return;

        certIndex =
            (index + total) % total;

        const thumb = certThumbs[certIndex];

        const origen = thumb.querySelector("img");

        certImage.src = origen.currentSrc || origen.src;

        certImage.alt = origen.alt;

        certTitle.textContent =
            (certIndex + 1) + " / " + total +
            " · " + origen.alt.replace("Certificado de ", "");

        certZoom = 0;

        aplicarZoom();

        certStage.scrollTop = 0;

        certStage.scrollLeft = 0;

        certModalPrev.disabled = total < 2;

        certModalNext.disabled = total < 2;

    }


    function abrirCertificado(index, thumb) {

        certLastFocus = thumb || document.activeElement;

        mostrarCertificado(index);

        certModal.classList.add("active");

        document.body.style.overflow = "hidden";

        document.getElementById(
            "certModalClose"
        ).focus();

    }


    function cerrarCertificado() {

        certModal.classList.remove("active");

        document.body.style.overflow = "";

        if (certLastFocus) {

            certLastFocus.focus();

        }

    }


    certThumbs.forEach((thumb, index) => {

        protegerImagen(thumb);

        thumb.addEventListener(
            "click",
            () => abrirCertificado(
                index,
                thumb
            )
        );

    });


    document.getElementById(
        "certModalClose"
    ).addEventListener(
        "click",
        cerrarCertificado
    );


    /* Clic en el fondo para cerrar */

    certModal.addEventListener(
        "click",
        event => {

            if (
                event.target === certModal
            ) {

                cerrarCertificado();

            }

        }
    );


    /* Clic en la imagen: acercar o volver a ajustar */

    certImage.addEventListener(
        "click",
        () => {

            if (certMovido) return;

            if (certZoom) {

                certZoom = 0;

            } else {

                certZoom = 1;

            }

            aplicarZoom();

        }
    );


    certZoomIn.addEventListener(
        "click",
        () => cambiarZoom(1)
    );

    certZoomOut.addEventListener(
        "click",
        () => cambiarZoom(-1)
    );


    certModalPrev.addEventListener(
        "click",
        () => mostrarCertificado(certIndex - 1)
    );

    certModalNext.addEventListener(
        "click",
        () => mostrarCertificado(certIndex + 1)
    );


    /* Rueda del ratón con Ctrl para acercar */

    certStage.addEventListener(
        "wheel",
        event => {

            if (!event.ctrlKey) return;

            event.preventDefault();

            cambiarZoom(
                event.deltaY < 0 ? 1 : -1
            );

        },
        { passive: false }
    );


    /* Arrastrar para recorrer la imagen ampliada */

    let certArrastrando = false;

    let certOrigenX = 0;

    let certOrigenY = 0;

    let certScrollX = 0;

    let certScrollY = 0;


    /* Si el puntero se movió, fue arrastre
       y no debe cambiar el zoom */

    let certMovido = false;


    certImage.addEventListener(
        "pointerdown",
        event => {

            certMovido = false;

            if (!certZoom) return;

            certArrastrando = true;

            certOrigenX = event.clientX;

            certOrigenY = event.clientY;

            certScrollX = certStage.scrollLeft;

            certScrollY = certStage.scrollTop;

            certImage.style.cursor = "grabbing";

        }
    );

    window.addEventListener(
        "pointermove",
        event => {

            if (!certArrastrando) return;

            const dx =
                event.clientX - certOrigenX;

            const dy =
                event.clientY - certOrigenY;

            if (
                Math.abs(dx) > 4 ||
                Math.abs(dy) > 4
            ) {

                certMovido = true;

            }

            certStage.scrollLeft =
                certScrollX - dx;

            certStage.scrollTop =
                certScrollY - dy;

        }
    );

    window.addEventListener(
        "pointerup",
        () => {

            if (!certArrastrando) return;

            certArrastrando = false;

            certImage.style.cursor = "zoom-out";

        }
    );


    /* Teclado: cerrar, pasar de certificado y zoom */

    document.addEventListener(
        "keydown",
        event => {

            if (
                !certModal.classList.contains("active")
            ) return;

            if (
                event.key === "Escape"
            ) {

                cerrarCertificado();

            }

            if (
                event.key === "ArrowRight"
            ) {

                mostrarCertificado(certIndex + 1);

            }

            if (
                event.key === "ArrowLeft"
            ) {

                mostrarCertificado(certIndex - 1);

            }

            if (
                event.key === "+" ||
                event.key === "="
            ) {

                cambiarZoom(1);

            }

            if (
                event.key === "-"
            ) {

                cambiarZoom(-1);

            }

        }
    );

});

