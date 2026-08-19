// ==========================================
// CONFIGURAÇÃO DOS CAPÍTULOS
// ==========================================

const chapters = {
    1: {
        title: "Capítulo 1",
        pages: 3
    },

    2: {
        title: "Capítulo 2",
        pages: 3
    }
};


// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

const comicContainer = document.getElementById("comic-container");
const chapterTitle = document.getElementById("chapter-title");
const chapterSelect = document.getElementById("chapter-select");

const previousButton = document.getElementById("previous-chapter");
const nextButton = document.getElementById("next-chapter");

const bottomPrevious = document.getElementById("bottom-previous");
const bottomNext = document.getElementById("bottom-next");


// ==========================================
// CAPÍTULO ATUAL
// ==========================================

const urlParams = new URLSearchParams(window.location.search);

let currentChapter = parseInt(urlParams.get("chapter")) || 1;


// ==========================================
// CARREGAR CAPÍTULO
// ==========================================

function loadChapter(chapterNumber) {

    // Verifica se o capítulo existe
    if (!chapters[chapterNumber]) {
        console.error("Capítulo não encontrado:", chapterNumber);
        return;
    }

    currentChapter = chapterNumber;

    const chapter = chapters[currentChapter];

    // Atualiza título
    chapterTitle.textContent = chapter.title;

    // Atualiza seletor
    chapterSelect.value = currentChapter;

    // Limpa páginas anteriores
    comicContainer.innerHTML = "";


    // ======================================
    // CARREGA AS PÁGINAS
    // ======================================

    for (let page = 1; page <= chapter.pages; page++) {

        const image = document.createElement("img");

        const chapterFolder =
            String(currentChapter).padStart(2, "0");

        const pageFile =
            String(page).padStart(2, "0");

        image.src =
            `images/chapters/${chapterFolder}/${pageFile}.webp`;

        image.alt =
            `${chapter.title} - Página ${page}`;

        image.classList.add("comic-image");

        // Só carrega a imagem quando estiver próxima
        // de aparecer na tela.
        image.loading = "lazy";

        // Caso uma página não exista
        image.onerror = function () {

            console.warn(
                `Não foi possível carregar: ${image.src}`
            );

            image.remove();
        };

        comicContainer.appendChild(image);
    }


    // Atualiza os botões
    updateNavigation();


    // Atualiza URL
    history.replaceState(
        null,
        "",
        `comic.html?chapter=${currentChapter}`
    );


    // Volta para o topo
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ==========================================
// ATUALIZAR NAVEGAÇÃO
// ==========================================

function updateNavigation() {

    const firstChapter =
        currentChapter === getFirstChapter();

    const lastChapter =
        currentChapter === getLastChapter();


    // Botões superiores

    previousButton.disabled = firstChapter;
    nextButton.disabled = lastChapter;


    // Botões inferiores

    bottomPrevious.disabled = firstChapter;
    bottomNext.disabled = lastChapter;
}


// ==========================================
// PEGAR PRIMEIRO CAPÍTULO
// ==========================================

function getFirstChapter() {

    return Math.min(
        ...Object.keys(chapters).map(Number)
    );
}


// ==========================================
// PEGAR ÚLTIMO CAPÍTULO
// ==========================================

function getLastChapter() {

    return Math.max(
        ...Object.keys(chapters).map(Number)
    );
}


// ==========================================
// CAPÍTULO ANTERIOR
// ==========================================

function previousChapter() {

    const previous =
        currentChapter - 1;

    if (chapters[previous]) {

        loadChapter(previous);

    }
}


// ==========================================
// PRÓXIMO CAPÍTULO
// ==========================================

function nextChapter() {

    const next =
        currentChapter + 1;

    if (chapters[next]) {

        loadChapter(next);

    }
}


// ==========================================
// SELETOR DE CAPÍTULOS
// ==========================================

chapterSelect.addEventListener(
    "change",
    function () {

        const selectedChapter =
            parseInt(this.value);

        loadChapter(selectedChapter);

    }
);


// ==========================================
// BOTÕES
// ==========================================

previousButton.addEventListener(
    "click",
    previousChapter
);

nextButton.addEventListener(
    "click",
    nextChapter
);

bottomPrevious.addEventListener(
    "click",
    previousChapter
);

bottomNext.addEventListener(
    "click",
    nextChapter
);


// ==========================================
// TECLADO
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        // ← capítulo anterior
        if (event.key === "ArrowLeft") {
            previousChapter();
        }

        // → próximo capítulo
        if (event.key === "ArrowRight") {
            nextChapter();
        }

    }
);


// ==========================================
// INICIALIZAÇÃO
// ==========================================

loadChapter(currentChapter);
