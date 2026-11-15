
// ==========================================
// PROJETO INTEGRADOR - FATEC GARÇA
// JAVASCRIPT PRINCIPAL
// ==========================================

// MENU RESPONSIVO

const botaoMenu = document.querySelector("#botao-menu");
const menuPrincipal = document.querySelector("#menu-principal");

if (botaoMenu && menuPrincipal) {

    botaoMenu.addEventListener("click", () => {

        const aberto = menuPrincipal.classList.toggle("aberto");

        botaoMenu.setAttribute("aria-expanded", String(aberto));

        botaoMenu.setAttribute(
            "aria-label",
            aberto ? "Fechar menu" : "Abrir menu"
        );

        botaoMenu.textContent = aberto ? "✕" : "☰";
    });

    // Fecha o menu ao selecionar uma página
    menuPrincipal.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            menuPrincipal.classList.remove("aberto");

            botaoMenu.setAttribute("aria-expanded", "false");
            botaoMenu.setAttribute("aria-label", "Abrir menu");

            botaoMenu.textContent = "☰";
        });
    });
}

// ANO AUTOMÁTICO DO RODAPÉ

const anoAtual = document.querySelector("#ano-atual");

if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
}


// ==========================================
// ABAS DO PROJETO INTEGRADOR
// ==========================================

const botoesEtapas = document.querySelectorAll("[data-aba]");
const paineisEtapas = document.querySelectorAll(".painel-etapa");

function selecionarEtapa(botaoSelecionado) {

    const etapa = botaoSelecionado.dataset.aba;

    botoesEtapas.forEach(botao => {

        const ativo = botao === botaoSelecionado;

        botao.classList.toggle("ativo", ativo);

        botao.setAttribute(
            "aria-selected",
            String(ativo)
        );

        botao.tabIndex = ativo ? 0 : -1;
    });

    paineisEtapas.forEach(painel => {

        painel.hidden = painel.id !== `conteudo-${etapa}`;
    });
}

botoesEtapas.forEach((botao, indice) => {

    botao.addEventListener("click", () => {
        selecionarEtapa(botao);
    });

    botao.addEventListener("keydown", evento => {

        if (!["ArrowLeft", "ArrowRight", "Home", "End"]
            .includes(evento.key)) {
            return;
        }

        evento.preventDefault();

        let novoIndice = indice;

        if (evento.key === "ArrowRight") {
            novoIndice = (indice + 1) % botoesEtapas.length;
        }

        if (evento.key === "ArrowLeft") {
            novoIndice =
                (indice - 1 + botoesEtapas.length)
                % botoesEtapas.length;
        }

        if (evento.key === "Home") {
            novoIndice = 0;
        }

        if (evento.key === "End") {
            novoIndice = botoesEtapas.length - 1;
        }

        const novoBotao = botoesEtapas[novoIndice];

        selecionarEtapa(novoBotao);
        novoBotao.focus();
    });
});


// ==========================================
// FILTROS DO EMBASAMENTO TEÓRICO
// ==========================================

const campoBusca = document.querySelector("#buscar-tema");

const filtrosEmbasamento = document.querySelectorAll(
    ".filtro-embasamento"
);

const cardsEmbasamento = document.querySelectorAll(
    ".embasamento-card"
);

const mensagemSemResultados = document.querySelector(
    "#sem-resultados"
);

let categoriaSelecionada = "todos";

// NORMALIZA TEXTO PARA PESQUISA

function normalizarTexto(texto) {

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// FILTRAR CARDS

function filtrarEmbasamento() {

    if (!campoBusca) return;

    const termo = normalizarTexto(
        campoBusca.value.trim()
    );

    let encontrados = 0;

    cardsEmbasamento.forEach(card => {

        const textoCard = normalizarTexto(
            card.textContent
        );

        const categoriaCard = card.dataset.categoria;

        const correspondeBusca = textoCard.includes(termo);

        const correspondeCategoria =
            categoriaSelecionada === "todos" ||
            categoriaCard === categoriaSelecionada;

        const mostrar =
            correspondeBusca && correspondeCategoria;

        card.hidden = !mostrar;

        if (mostrar) {
            encontrados++;
        }
    });

    if (mensagemSemResultados) {
        mensagemSemResultados.hidden = encontrados > 0;
    }
}

// PESQUISA EM TEMPO REAL

if (campoBusca) {

    campoBusca.addEventListener(
        "input",
        filtrarEmbasamento
    );
}

// BOTÕES DE CATEGORIA

filtrosEmbasamento.forEach(botao => {

    botao.addEventListener("click", () => {

        categoriaSelecionada = botao.dataset.filtro;

        filtrosEmbasamento.forEach(filtro => {

            const ativo = filtro === botao;

            filtro.classList.toggle("ativo", ativo);

            filtro.setAttribute(
                "aria-pressed",
                String(ativo)
            );
        });

        filtrarEmbasamento();
    });
});


// ==========================================
// LEVANTAMENTO DE DADOS
// ==========================================

// GRÁFICO DE BARRAS

const barrasGrafico = document.querySelectorAll(
    ".grafico-barra"
);

function atualizarGrafico() {

    barrasGrafico.forEach(barra => {

        const valor = Number(barra.dataset.valor);

        if (Number.isFinite(valor)) {

            const percentual = Math.max(
                0,
                Math.min(100, valor)
            );

            barra.style.width = `${percentual}%`;
        }
    });
}

// ANIMAÇÃO QUANDO O GRÁFICO APARECER

if (barrasGrafico.length > 0) {

    const grafico = document.querySelector(
        ".grafico-container"
    );

    if ("IntersectionObserver" in window && grafico) {

        const observador = new IntersectionObserver(
            (entradas, observer) => {

                entradas.forEach(entrada => {

                    if (entrada.isIntersecting) {

                        atualizarGrafico();

                        observer.unobserve(
                            entrada.target
                        );
                    }
                });
            },
            {
                threshold: 0.2
            }
        );

        observador.observe(grafico);

    } else {

        atualizarGrafico();
    }
}

// ==========================================
// FILTROS DAS ENTREVISTAS
// ==========================================

const filtrosEntrevistas = document.querySelectorAll(
    ".filtro-entrevista"
);

const cardsEntrevistas = document.querySelectorAll(
    ".entrevista-card"
);

filtrosEntrevistas.forEach(botao => {

    botao.addEventListener("click", () => {

        const tipoSelecionado = botao.dataset.entrevista;

        filtrosEntrevistas.forEach(filtro => {

            const ativo = filtro === botao;

            filtro.classList.toggle("ativo", ativo);

            filtro.setAttribute(
                "aria-pressed",
                String(ativo)
            );
        });

        cardsEntrevistas.forEach(card => {

            const mostrar =
                tipoSelecionado === "todos" ||
                card.dataset.tipo === tipoSelecionado;

            card.hidden = !mostrar;
        });
    });
});
