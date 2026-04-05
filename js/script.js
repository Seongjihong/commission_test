$(document).ready(function () {
    function getSavedLang() {
        return localStorage.getItem("lang") || "ko";
    }

    function syncLangState(lang) {
        const safeLang = lang === "en" ? "en" : "ko";

        localStorage.setItem("lang", safeLang);
        document.documentElement.setAttribute("data-lang", safeLang);

        $("#ko, #ko2").removeClass("active");
        $("#en, #en2").removeClass("active");

        if (safeLang === "en") {
            $("#en, #en2").addClass("active");
        } else {
            $("#ko, #ko2").addClass("active");
        }
    }

    window.SiteLang = {
        getLang() {
            return getSavedLang();
        },

        setLang(lang) {
            syncLangState(lang);

            const currentLang = this.getLang();
            this.apply(LANG_DATA.common, ".nav [data-key]", currentLang);
            this.applyPage(currentLang);

            $(document).trigger("languageChanged", [currentLang]);
        },

        updateButtons(lang) {
            syncLangState(lang);
        },

        apply(langData, selector, lang) {
            const currentData = langData[lang] || langData.ko;

            $(selector).each(function () {
                const key = $(this).data("key") || $(this).data("page-key");
                if (currentData[key]) {
                    $(this).html(currentData[key]);
                }
            });
        },

        applyPage(lang) {
            const page = $("body").data("page");
            if (!page || !LANG_DATA[page]) return;

            this.apply(LANG_DATA[page], "[data-page-key]", lang);
        }
    };

    function setActiveMenu() {
        let current = window.location.pathname.split("/").pop();

        if (!current || current === "/") {
            current = "index.html";
        }

        $(".nav li a").removeClass("active");

        $(".nav li a").each(function () {
            const link = $(this).attr("href");
            if (link === current) {
                $(this).addClass("active");
            }
        });
    }

    function openMenu() {
        $(".menu-btn").addClass("active").attr("aria-label", "메뉴 닫기");
        $(".nav").addClass("active");
    }

    function closeMenu() {
        $(".menu-btn").removeClass("active").attr("aria-label", "메뉴 열기");
        $(".nav").removeClass("active");
    }

    function toggleTopButton() {
        if ($(window).scrollTop() > 300) {
            $(".top-btn").addClass("show");
        } else {
            $(".top-btn").removeClass("show");
        }
    }

    $("#ko, #ko2").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        SiteLang.setLang("ko");
    });

    $("#en, #en2").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        SiteLang.setLang("en");
    });

    $(".menu-btn").on("click", function (e) {
        e.stopPropagation();
        $(".nav").hasClass("active") ? closeMenu() : openMenu();
    });

    $(".nav").on("click", function (e) {
        e.stopPropagation();
    });

    $(".nav li a").on("click", function () {
       if (window.innerWidth <= 1024) {
            closeMenu();
        }
    });

    $(document).on("click", function () {
        if (window.innerWidth <= 1024) {
            closeMenu();
        }
    });

    $(".top-btn").on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 700, "linear");
    });

    $(window).on("scroll", function () {
        toggleTopButton();
    });

    $(window).on("resize", function () {
        if (window.innerWidth <= 1024) {
            closeMenu();
        }
    });

    $(window).on("pageshow", function () {
        const lang = getSavedLang();
        syncLangState(lang);
        SiteLang.apply(LANG_DATA.common, ".nav [data-key]", lang);
        SiteLang.applyPage(lang);
        setActiveMenu();
        document.documentElement.classList.add("lang-ready");
    });

    const savedLang = getSavedLang();
    syncLangState(savedLang);
    SiteLang.apply(LANG_DATA.common, ".nav [data-key]", savedLang);
    SiteLang.applyPage(savedLang);

    setActiveMenu();
    closeMenu();
    toggleTopButton();

    requestAnimationFrame(function () {
        document.documentElement.classList.add("lang-ready");
    });
});