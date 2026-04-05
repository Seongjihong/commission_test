$(document).ready(function () {
    const portfolioData = {
        basic: [
            {
                src: "./img/portfolio/b_type1.png",
                titleKo: "베이직 샘플 01",
                titleEn: "Basic Sample 01",
                descKo: "깔끔한 셀식 채색과 가벼운 구성이 돋보이는 베이직 타입 작업물입니다.",
                descEn: "A basic type sample featuring clean cel-style coloring and a light overall composition."
            },
            {
                src: "./img/portfolio/b_type2.png",
                titleKo: "베이직 샘플 02",
                titleEn: "Basic Sample 02",
                descKo: "빠른 파츠 분리 작업에 적합한 베이직 타입 샘플입니다.",
                descEn: "A basic type sample suitable for efficient parts separation work."
            }
        ],
        premium: [
            {
                src: "./img/portfolio/p_type1.png",
                titleKo: "프리미엄 샘플 01",
                titleEn: "Premium Sample 01",
                descKo: "디테일하고 밀도 높은 채색 표현이 강조된 프리미엄 타입 작업물입니다.",
                descEn: "A premium type sample focused on rich detail and dense rendering."
            },
            {
                src: "./img/portfolio/p_type2.png",
                titleKo: "프리미엄 샘플 02",
                titleEn: "Premium Sample 02",
                descKo: "풍부한 파츠 구성과 높은 완성도를 보여주는 프리미엄 샘플입니다.",
                descEn: "A premium sample that showcases rich part composition and a polished finish."
            },
            {
                src: "./img/portfolio/p_type3.png",
                titleKo: "프리미엄 샘플 03",
                titleEn: "Premium Sample 03",
                descKo: "고가동과 섬세한 표현을 중점으로 한 프리미엄 작업물입니다.",
                descEn: "A premium work focused on high mobility and delicate detail."
            }
        ]
    };

    const portfolioMeta = {
        ko: {
            basic: {
                heading: "베이직 포트폴리오",
                text: "깔끔한 셀식 채색과 가벼운 구성의 작업물입니다.",
                label: "BASIC",
                features: ["깔끔한 셀식 채색", "빠른 작업", "가벼운 구성"]
            },
            premium: {
                heading: "프리미엄 포트폴리오",
                text: "풍부한 디테일과 높은 완성도의 작업물입니다.",
                label: "PREMIUM",
                features: ["디테일한 채색", "고가동 파츠", "높은 완성도"]
            }
        },
        en: {
            basic: {
                heading: "Basic Portfolio",
                text: "Works with clean cel-style coloring and a lighter composition.",
                label: "BASIC",
                features: ["Clean cel shading", "Fast workflow", "Light composition"]
            },
            premium: {
                heading: "Premium Portfolio",
                text: "Works with richer detail and a more polished finish.",
                label: "PREMIUM",
                features: ["Detailed rendering", "High mobility parts", "High-quality finish"]
            }
        }
    };

    let currentType = "basic";
    let currentIndex = 0;

    function getLang() {
        return SiteLang.getLang();
    }

    function getCurrentItems() {
        return portfolioData[currentType];
    }

    function getDisplayTitle(item, lang) {
        return lang === "en" ? item.titleEn : item.titleKo;
    }

    function getDisplayDesc(item, lang) {
        return lang === "en" ? item.descEn : item.descKo;
    }

    function renderText(lang) {
        SiteLang.apply(LANG_DATA.portfolio, ".portfolio-page [data-key]", lang);
    }

    function renderTabs() {
        $(".type-tab").removeClass("active");
        $(`.type-tab[data-type="${currentType}"]`).addClass("active");
    }

    function renderTypeIntro(lang) {
        const meta = portfolioMeta[lang][currentType];
        $("#portfolioTypeTitle").text(meta.heading);
        $("#portfolioTypeText").text(meta.text);

        const featureHtml = meta.features.map(feature => `<li>${feature}</li>`).join("");
        $("#portfolioFeatureList").html(featureHtml);
    }

    function renderMainCard(lang) {
        const items = getCurrentItems();
        const item = items[0];
        const label = portfolioMeta[lang][currentType].label;

        $("#portfolioMainImage")
            .attr("src", item.src)
            .attr("alt", getDisplayTitle(item, lang));

        $("#portfolioMainLabel")
            .text(label)
            .removeClass("basic premium")
            .addClass(currentType);

        $("#portfolioMainName").text(getDisplayTitle(item, lang));
        $("#portfolioMainDesc").text(getDisplayDesc(item, lang));
    }

    function renderGrid(lang) {
        const items = getCurrentItems();

        const html = items.map((item, index) => {
            return `
                <article class="portfolio-item">
                    <button type="button" class="portfolio-thumb" data-index="${index}">
                        <img src="${item.src}" alt="${getDisplayTitle(item, lang)}">
                    </button>
                    <div class="portfolio-item-info">
                        <h3>${getDisplayTitle(item, lang)}</h3>
                        <p>${getDisplayDesc(item, lang)}</p>
                    </div>
                </article>
            `;
        }).join("");

        $("#portfolioGrid").html(html);
    }

    function renderPortfolio(lang) {
        renderText(lang);
        renderTabs();
        renderTypeIntro(lang);
        renderMainCard(lang);
        renderGrid(lang);
    }

    function updateModal() {
        const lang = getLang();
        const items = getCurrentItems();
        const item = items[currentIndex];
        const label = portfolioMeta[lang][currentType].label;

        $("#modalImage")
            .attr("src", item.src)
            .attr("alt", getDisplayTitle(item, lang));

        $("#modalLabel")
            .text(label)
            .removeClass("basic premium")
            .addClass(currentType);

        $("#modalTitle").text(getDisplayTitle(item, lang));
        $("#modalDesc").text(getDisplayDesc(item, lang));
    }

    function openModal(index) {
        currentIndex = index;
        updateModal();
        $("#portfolioModal").addClass("open").attr("aria-hidden", "false");
        $("body").addClass("modal-open");
    }

    function closeModal() {
        $("#portfolioModal").removeClass("open").attr("aria-hidden", "true");
        $("body").removeClass("modal-open");
    }

    function moveModal(step) {
        const items = getCurrentItems();
        currentIndex = (currentIndex + step + items.length) % items.length;
        updateModal();
    }

    $(document).on("click", ".type-tab", function () {
        currentType = $(this).data("type");
        renderPortfolio(getLang());
    });

    $("#portfolioMainButton").on("click", function () {
        openModal(0);
    });

    $(document).on("click", ".portfolio-thumb", function () {
        openModal(Number($(this).data("index")));
    });

    $("#modalClose, .portfolio-modal__overlay").on("click", function () {
        closeModal();
    });

    $("#modalPrev").on("click", function () {
        moveModal(-1);
    });

    $("#modalNext").on("click", function () {
        moveModal(1);
    });

    $(document).on("keydown", function (e) {
        if (!$("#portfolioModal").hasClass("open")) return;

        if (e.key === "Escape") {
            closeModal();
        } else if (e.key === "ArrowLeft") {
            moveModal(-1);
        } else if (e.key === "ArrowRight") {
            moveModal(1);
        }
    });

    $(document).on("languageChanged", function (event, lang) {
        renderPortfolio(lang);

        if ($("#portfolioModal").hasClass("open")) {
            updateModal();
        }
    });

    renderPortfolio(getLang());
});