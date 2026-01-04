// Referências aos elementos html
const container = document.getElementById("mainContainer");
const contaOpcoes = document.getElementById("contaOpcoes");
const opcoes = document.getElementById('OpcoesExpandidas');
const criarMaisButton = document.getElementById("criarMaisButton");
const btn_logout = document.getElementById('logout');
const maratonasCreation = document.getElementById('maratonasCreation');
const partidasCreation = document.getElementById('partidasCreation');
const timesCreation = document.getElementById('timesCreation');
const containerBotaopartidas = document.getElementById('containerBotaopartidas');
const containerBotaoMaratonas = document.getElementById('containerBotaoMaratonas');
const containerBotaoTimes = document.getElementById('containerBotaoTimes');
const containerBotaopartidasCreation = document.getElementById('containerBotaopartidasCreation');
const containerBotaoMaratonasCreation = document.getElementById("containerBotaoMaratonasCreation");
const containerBotaoTimesCreation = document.getElementById('containerBotaoTimesCreation');
const criacao = document.getElementById("criacao");
const fecharCriacao = document.getElementById("fecharCriacao");
const fecharEdicaoMaratona = document.getElementById("fecharEdicaoMaratona");
const criarMaratona = document.getElementById("criarMaratona");
const criarTime = document.getElementById("criarTime");
const formMaratona = document.getElementById("criar-maratona-form");
const exibirCategorias = document.getElementById("ExibirCategorias");
const filter = document.getElementById("filter");
const editarMaratona = document.getElementById("edicaoMaratona");
const screenEdicaoConta = document.getElementById("edicaoConta");
const fecharEdicaoConta = document.getElementById("fecharEdicaoConta");
const editarContaAbrir = document.getElementById("editarContaAbrir");
const maratonaTimePertence = document.getElementById("maratonaTimePertence");
const formEditConta = document.getElementById("form-manipular-conta");
const btnDelUser = document.getElementById("btn-del-user");
const fotoPerfil = document.getElementById("user-icon");
const usernameUpdate = document.getElementById('usernameUpdate');
const emailUpdate = document.getElementById('emailUpdate');
const imagemAtualizar = document.getElementById('imagemAtualizar');
const formTime = document.getElementById('criar-time-form');
const formEditTime = document.getElementById('editar-time-form');
const intoMaratona = document.getElementById("intoMaratona");
const backToHome = document.getElementById("BackToHome");
const initCreationTeam = document.getElementById("initCreationTeam");
const criacaoTimeScreen = document.getElementById("criacaoTime");
const toggleIcon = document.getElementById("toggleIcon");
const overlay = document.getElementById("overlay");
const overlayIntoMaratona = document.getElementById("overlayIntoMaratona");
const overlayIntoTime = document.getElementById("overlayIntoTime");
const containerExibirTimes = document.getElementById("containerExibirTimes");
const sidebar = document.getElementById("sidebar");
const intoTime = document.getElementById("IntoTime");
const EditarTimeContainer = document.getElementById("EditarTime");
const sidebarMaratona = document.getElementById("sidebarMaratona");
const sidebarTime = document.getElementById("sidebarTime");
const criacaoParticipante = document.getElementById("criacaoParticipante");
const filterTime = document.getElementById("filterTime");
const rodadasContainer = document.getElementById('rodadas');
const torneioContainer = document.getElementById("torneio-container");
const containerCampeao = document.getElementById("containerCampeao");
const body = document.getElementById("body");
const criacaoPartida = document.getElementById("criarPartida");
const OptionsVencedor = document.getElementById("TimeVencedor");
const loadingRodada = document.getElementById('loadingRodada');
const containerVencedor = document.getElementById('containerCampeao');
const toast = document.getElementById('toast');

// Vetores que guardarão in memory os gets para tornar o programa performático
var maratonasSalvas = [];
var timesSalvos = [];
let rodadas = [[]];
let userLogado = null;
let bloqueandoChange = false;

document.addEventListener('DOMContentLoaded', function () {
    const options = {
        method: 'GET'
    }
    fetch("/user", options)
        .then(response => response.json())
        .then(data => {
            fotoPerfil.src = `data:image/jpeg;base64,${data.icon}`;
            userLogado = {
                nome: data.username,
                id: data.user_id,
                email: data.email,
                icon: fotoPerfil.src
            }
        })
        .catch((error) => {
            console.error('ERROR: ', error);
        });
    $('#qtdTimes').select2();
    exibirMaratonas();
});

const exibirMaratonas = async () => {
    filter.value = '';
    exibirCategorias.innerHTML = '';
    exibirCategorias.style.display = 'none';
    const carregamaratona = document.getElementById('carregamaratona');
    carregamaratona.style.display = 'flex';

    const options = {
        method: 'GET'
    };
    const maratonasSalvasBackup = maratonasSalvas;
    maratonasSalvas = [];

    try {
        const response = await fetch('/maratonas', options);
        const data = await response.json();

        data.forEach(maratona => {
            const maratonasObj = {
                id: maratona.MId,
                nome: maratona.name,
                descricao: maratona.desc,
                qtdTimes: maratona.numTeam,
                premiacao: maratona.prize,
            };
            maratonasSalvas.push(maratonasObj);
        });
    } catch (error) {
        maratonasSalvas = maratonasSalvasBackup;
        console.error('ERRO: ', error);
    }
    carregamaratona.style.display = 'none';

    maratonasSalvas.forEach((element, index) => {
        exibirCategorias.style.display = 'flex';
        const containerItem = document.createElement('li');

        containerItem.innerHTML = `
            <h3 style="font-size: 1.5em; margin: 10px 0;">${element.nome}</h3>
            <p style="font-size: 1em; color: #ccc; margin: 5px 0;">Descrição: ${element.descricao}</p>
            <p style="font-size: 1em; color: #ccc; margin: 5px 0;">Quantidade de Times: ${element.qtdTimes}</p>
            <p style="font-size: 1em; color: #ccc; margin: 5px 0;">Premiação: ${element.premiacao}</p>
        `;
        containerItem.dataset.index = element.id;
        exibirCategorias.appendChild(containerItem);

        // Adiciona a linha divisória apenas se não for o último item
        if (index < maratonasSalvas.length - 1) {
            const linhaDivisoria = document.createElement('hr');
            linhaDivisoria.classList.add("horizontal-bar");
            linhaDivisoria.style.marginTop = "0";
            linhaDivisoria.style.marginBottom = "0";
            linhaDivisoria.style.width = "100%";
            linhaDivisoria.style.height = "3px";
            exibirCategorias.appendChild(linhaDivisoria);
        }

        containerItem.onclick = async () => {

            if (backToHome.style.pointerEvents === 'none') return;

            backToHome.style.pointerEvents = 'none';

            const atual = {
                id: element.id,
                nome_maratona: element.nome,
                descricao: element.descricao,
                qtdTimes: element.qtdTimes,
                premiacao: element.premiacao,
            };
            IntoMaratona(atual, containerItem);
        };
    });
};

backToHome.onclick = function () {
        sidebar.classList.remove('show');
        sidebar.classList.add('hide');
        intoMaratona.classList.remove('show');
        intoMaratona.classList.add('hide');
        const imagemCampeao = document.getElementById('imagemCampeao');
        imagemCampeao.src = 'static/img/hackathon.png';
        imagemCampeao.style.display = "block";
        containerVencedor.onclick = null;
        setTimeout(function () {
            container.classList.remove('no-scroll');
        }, 200);
        body.classList.remove("no-scrollbody");
}

// Clica na maratona
const IntoMaratona = (element, containerItem) => {
    rodadasContainer.innerHTML = '';
    let getCacheTimes = timesSalvos.length > 0 && element.id == timesSalvos[0].maratonaId ? true : false
    loadingRodada.style.display = 'flex';
    ExibirTimes(element, getCacheTimes, rodadas, true);
    intoMaratona.classList.remove('hide');
    intoMaratona.classList.add('show');
    sidebar.style.display = "flex";
    sidebar.classList.remove('hide');
    sidebar.classList.add('show');
    container.classList.add("no-scroll");
    body.classList.add("no-scrollbody");
    const editorButton = document.getElementById("editorMaratonaButton");
    const initCreationTeam = document.getElementById("initCreationTeam");
    const abbv = document.getElementById('campAbv');
    abbv.textContent = '';

    editorButton.onclick = function (event) {
        EditarMaratona(element);
    };

    initCreationTeam.onclick = function (event) {
        if (timesSalvos.length === element.qtdTimes) {
            toast.style.backgroundColor = '#f7b917';
            showToast("Número máximo de times atingido");
            event.preventDefault();
            return;
        }
        CreateTeam(element);
    };
    const chaveamento = document.getElementById("chaveamento");
    const loadchave = document.getElementById("loadchave");

    // Clica no botão de chaveamento
    chaveamento.onclick = async function () {

        const ultimaRodada = rodadas[rodadas.length - 1];
        if (!ultimaRodada || ultimaRodada.length === 0) {
            toast.style.backgroundColor = '#f7b917';
            showToast("Nenhuma partida disponível");
            return;
        }

        const partidasSemVencedor = ultimaRodada.filter(
            p => !p.vencedor?.id
        );

        if (partidasSemVencedor.length === 0) {
            toast.style.backgroundColor = '#f7b917';
            showToast("Todas as partidas já têm vencedores");
            return;
        }

        // Times já usados (partidas encerradas)
        const timesUsados = new Set();

        rodadas.flat().forEach(partida => {
            if (partida.vencedor?.id) {
                partida.times.forEach(t => {
                    if (t?.id) timesUsados.add(t.id);
                });
            }
        });

        // Times disponíveis
        const vetorSorteioTimes = timesSalvos.filter(
            t => !timesUsados.has(t.id)
        );

        if (vetorSorteioTimes.length < 2) {
            toast.style.backgroundColor = '#f7b917';
            showToast("Não existem times disponíveis suficientes!");
            return;
        }

        chaveamento.style.display = 'none';
        loadchave.style.display = 'flex';

        let idx = 0;

        while (vetorSorteioTimes.length >= 2 && idx < partidasSemVencedor.length) {
            const partida = partidasSemVencedor[idx];

            const t1 = sorteioTimes(vetorSorteioTimes);
            const t2 = sorteioTimes(vetorSorteioTimes);

            partida.times[0] = t1 ? { ...t1 } : null;
            partida.times[1] = t2 ? { ...t2 } : null;

            idx++;
    }

    //  payload pro backend
    const payload = partidasSemVencedor.map(p => ({
        id: p.id,
        time1: p.times[0]?.id ?? null,
        time2: p.times[1]?.id ?? null
    }));

    const response = await fetch('/chavearRodada', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partidas: payload })
    });

    const data = await response.json();

    if (data.status !== 'success') {
        toast.style.backgroundColor = '#c62828';
        showToast("Erro ao salvar chaveamento.");
        chaveamento.style.display = 'inline-block';
        loadchave.style.display = 'none';
        return;
    }
    toast.style.backgroundColor = '#2e7d32';
    showToast("Chaveamento Realizado!");
    chaveamento.style.display = 'inline-block';
    loadchave.style.display = 'none';
    atualizarLayout(rodadas);
};

}

// Escolhe os times pro chaveamento de forma aleatoria
const sorteioTimes = (vetorSorteioTimes) => {
    if (vetorSorteioTimes.length === 0) {
        return null;
    }

    const indiceSorteado = Math.floor(Math.random() * vetorSorteioTimes.length);

    const timeSorteado = vetorSorteioTimes.splice(indiceSorteado, 1)[0];

    return timeSorteado;
};

// Carrega os times depois de excluir um, editar, entrar na maratona, entre outros fluxos
const ExibirTimes = async (maratona, getCacheTimes, rodadas, exec) => {
    const loadingIndicator = document.getElementById('loadingTimes');
    loadingIndicator.style.display = 'flex';
    filterTime.value = '';
    containerExibirTimes.innerHTML = '';
    if (!getCacheTimes) {
        const timesSalvosBackup = timesSalvos;
        timesSalvos = [];
        const escudoTime = document.createElement("img");
        const formData = new FormData();
        formData.append("maratona_id", maratona.id);

        const options = {
            method: 'POST',
            body: formData
        };
        try {
            const response = await fetch('/getTimes', options);
            if (!response.ok) {
                throw new Error('Erro de rede');
            }
            const data = await response.json();

            data.forEach(time => {
                escudoTime.src = `data:image/jpeg;base64,${time.escudo}`;
                const timesObj = {
                    id: time.id,
                    nome: time.nome_time,
                    abreviacao: time.abreviacao,
                    maratonaId: time.maratonaId,
                    icon: escudoTime.src,
                };
                timesSalvos.push(timesObj);
            });
        } catch (error) {
            timesSalvos = timesSalvosBackup;
            console.error('ERRO: ', error);
        }
    }
    if(exec){
        adicionarPartida(maratona);
    }else{
        atualizarLayout(rodadas); 
    }
    const fragment = document.createDocumentFragment();
    loadingIndicator.style.display = 'none';
    backToHome.style.pointerEvents = 'auto';
    timesSalvos.forEach((element) => {
        const containerItem = document.createElement('li');
        containerItem.classList.add('time-item');
        containerItem.innerHTML = `
            <img src="${element.icon}" alt="${element.abreviacao}">
            <p>${element.abreviacao}</p>
        `;
        containerItem.dataset.index = element.id;
        fragment.appendChild(containerItem);

        containerItem.onclick = function () {
            IntoTeam(element, maratona);
        }
    });
    containerExibirTimes.appendChild(fragment);
};

// Clica em um time
const IntoTeam = (time, maratona) => {
    const lista = document.getElementById("containerExibirCompetidores");
    lista.innerHTML = '';
    torneioContainer.style.display = 'none';
    sidebarMaratona.classList.remove('show');
    sidebarMaratona.classList.add('hide');
    sidebarTime.classList.remove('hide');
    sidebarTime.classList.add('show');

    criacaoParticipante.classList.add('show');
    const NomeTime = document.getElementById('nameTime');
    NomeTime.textContent = time.nome;
    const txtabrev = document.getElementById('abrev');
    txtabrev.textContent = time.abreviacao;

    const imagemTime = document.getElementById('imagemTime');
    imagemTime.src = time.icon;

    const loadingIndic = document.getElementById('loadingDev');
    loadingIndic.style.display = 'flex';

    document.getElementById("BackToMaratona").onclick = function () {
        sidebarTime.classList.remove('show');
        sidebarTime.classList.add('hide');
        sidebarMaratona.classList.remove('hide');
        sidebarMaratona.classList.add('show');
        criacaoParticipante.classList.remove('show');

    torneioContainer.style.display = 'grid';
    }

    document.getElementById("editorTimeButton").onclick = function () {
        EditarTime(time, maratona);
    }

    document.getElementById("ConfirmarCriacaoParticipante").onclick = async function (event) {
        event.preventDefault();

        const nomeParticipanteInput = document.querySelector("input[name='nomeParticipante']");
        const nomeParticipante = nomeParticipanteInput.value;
        const timeId = time.id;
        
        if (!nomeParticipante) {
            toast.style.backgroundColor = '#f7b917';
            showToast("O nome do competidor é obrigatório!");
            return;
        }

        const ConfirmarCriacaoParticipante = document.getElementById('ConfirmarCriacaoParticipante');
        const loadparticipa = document.getElementById('loadparticipa');
        ConfirmarCriacaoParticipante.style.display = 'none';
        loadparticipa.style.display = 'flex';

        const lista = document.getElementById("containerExibirCompetidores");
        lista.innerHTML = '';
        const loadingIndic = document.getElementById('loadingDev');
        loadingIndic.style.display = 'flex';

        const data = {
            nomeJogador: nomeParticipante,
            timeId: timeId
        };

        try {
            const response = await fetch("/createCompetidor", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

        } catch (error) {
            toast.style.backgroundColor = '#c62828';
            showToast("Erro ao criar competidor!");
            console.error("Erro ao criar competidor:", error);
        }
        ConfirmarCriacaoParticipante.style.display = 'inline-block';
        loadparticipa.style.display = 'none';
        AtualizarListaCompetidores(timeId);
        nomeParticipanteInput.value = '';
    }

    const AtualizarListaCompetidores = async (timeId) => {
        try {
            const response = await fetch(`/competidor?time_id=${timeId}`, { method: 'GET' });
            if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

            const competidores = await response.json();
            const lista = document.getElementById("containerExibirCompetidores");
            lista.innerHTML = '';

            competidores.forEach(({ nome_competidor, id }) => {
                const li = document.createElement("li");
                li.textContent = nome_competidor;
                li.dataset.id = id;

                const deleteIcon = document.createElement("i");
                deleteIcon.className = "bi bi-trash-fill";
                deleteIcon.addEventListener("click", async (event) => {
                    event.stopPropagation();
                    const id = li.dataset.id;
                    try {
                        const deleteResponse = await fetch('/deleteCompetidor', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ id })
                        });

                        const result = await deleteResponse.json();
                        if (result.status === "success") {
                            li.remove();
                            toast.style.backgroundColor = '#2e7d32';
                            showToast(result.message);
                        } else {
                            toast.style.backgroundColor = '#c62828';
                            showToast(result.message);
                            console.error("Erro ao excluir competidor:", result.message);
                        }
                    } catch (error) {
                            toast.style.backgroundColor = '#c62828';
                        showToast("Erro inesperado ao excluir competidor");
                        console.error("Erro ao excluir competidor:", error);
                    }
                });

                li.appendChild(deleteIcon);
                lista.appendChild(li);
            });
            loadingIndic.style.display = 'none';
        } catch (error) {
            console.error("Erro ao carregar competidores:", error);
        }
    };

    AtualizarListaCompetidores(time.id);
}

// Verifica se a abreviação é válida (até 3 caracteres)
function validarAbreviacao(abrev) {
    if (!abrev) return false;

    abrev = abrev.trim();

    return abrev.length <= 3;
}

const EditarTime = (time, maratona) => {
    EditarTimeContainer.classList.add('show');
    overlayIntoMaratona.classList.add('show');
    intoMaratona.classList.add("no-scroll");

    const timeeditload = document.getElementById("timeeditload");
    const buttom = document.getElementById("divbut");

    const botaoEditar = document.getElementById("ConfirmarEdicaoTime");
    const botaoExcluir = document.getElementById("ExcluirTime");

    const nomeTime = document.getElementById("nomeTimeEditar");
    const abreviacaoTime = document.getElementById("AbreviacaoEditar");
    nomeTime.value = time.nome;
    abreviacaoTime.value = time.abreviacao;

    const imgElement = document.getElementById('imagemAtualizarTimeEdicao');
    imgElement.src = time.icon;
    const inputImagemTime = document.getElementById('inputImagemTimeEditar');

    let currentImageFile = null;

    document.getElementById('containerArredondadoEditaTime').onclick = function () {
        inputImagemTime.click();
    };

    inputImagemTime.onchange = function (event) {
        const arquivo = event.target.files[0];
        if (arquivo) {
            const urlImagem = URL.createObjectURL(arquivo);
            imgElement.style.width = "100%";
            imgElement.src = urlImagem;
            currentImageFile = arquivo;
        }
    };

    botaoEditar.onclick = async function (event) {
        event.preventDefault();
        const abreviacao = abreviacaoTime.value;
        if (!validarAbreviacao(abreviacao)) {
            toast.style.backgroundColor = '#f7b917';
            showToast("A abreviação deve ter pelo menos 3 caracteres.");
            return;
        }

        timeeditload.style.display = 'flex';
        buttom.style.display = 'none';

        const formData = new FormData();
        formData.append("NovoNomeTime", nomeTime.value);
        formData.append("NovaAbreviacao", abreviacaoTime.value);
        formData.append("id", time.id);

        if (currentImageFile) {
            formData.append("NovoEscudoTime", currentImageFile);
        } else {
            const response = await fetch(time.icon);
            const blob = await response.blob();
            formData.append("NovoEscudoTime", blob, "imagem_atual.png");
        }

        const options = {
            method: 'PUT',
            body: formData
        };

        try {
            const response = await fetch("/updateTime", options);
            const result = await response.json();
            if (result.status === "success") {
                time.nome = nomeTime.value;
                time.abreviacao = abreviacaoTime.value;
                time.icon = imgElement.src;
                toast.style.backgroundColor = '#2e7d32';
                showToast(result.message);
                ExibirTimes(maratona, true, rodadas, true);
                document.getElementById("fecharEdicaoTime").click();
                const NomeTime = document.getElementById('nameTime');
                NomeTime.textContent = time.nome;
                const txtabrev = document.getElementById('abrev');
                txtabrev.textContent = time.abreviacao;
                const imagemTime = document.getElementById('imagemTime');
                imagemTime.src = time.icon;
            } else {
                toast.style.backgroundColor = '#c62828';
                showToast(result.message);
            }
        } catch (error) {
            toast.style.backgroundColor = '#c62828';
            showToast("ERROR");
            console.error("ERROR: ", error);
        }
        timeeditload.style.display = 'none';
        buttom.style.display = 'flex';
    };

    botaoExcluir.onclick = async function (event) {
        event.preventDefault();

        timeeditload.style.display = 'flex';
        buttom.style.display = 'none';


        const data = { id: time.id };

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch("/deleteTime", options);
            const result = await response.json();
            if (result.status === "success") {
                toast.style.backgroundColor = '#2e7d32';
                showToast(result.message);
                document.getElementById("fecharEdicaoTime").click();
                document.getElementById("BackToMaratona").click();
                ExibirTimes(maratona, false, rodadas, true);
            } else {
                toast.style.backgroundColor = '#c62828';
                showToast(result.message);
            }
        } catch (error) {
            toast.style.backgroundColor = '#c62828';
            showToast("ERROR");
            console.error('ERROR: ', error);
        }
        timeeditload.style.display = 'none';
        buttom.style.display = 'flex';
    };
};

const CreateTeam = (maratona) => {
    formTime.reset();
    criacaoTimeScreen.classList.add('show');
    overlayIntoMaratona.classList.add('show');
    intoMaratona.classList.add("no-scroll");

    const imgElement = document.getElementById('imagemAtualizarTime');
    const inputImagemTime = document.getElementById('inputImagemTime');

    inputImagemTime.onchange = function (event) {
        const arquivo = event.target.files[0];
        if (arquivo) {
            const urlImagem = URL.createObjectURL(arquivo);
            imgElement.style.width = "100%";
            imgElement.src = urlImagem;
        }
    };

    formTime.onsubmit = async function (event) {
        event.preventDefault();
        const abreviacao = formTime.Abreviacao.value;
        const timeload = document.getElementById('timeload');
        const ConfirmarCriacaoTime = document.getElementById('ConfirmarCriacaoTime');

        if (!validarAbreviacao(abreviacao)) {
            toast.style.backgroundColor = '#f7b917';
            showToast("A abreviação deve ter pelo menos 3 caracteres.");
            return;
        }

        timeload.style.display = 'flex';
        ConfirmarCriacaoTime.style.display = 'none';

        const formData = new FormData(formTime);
        formData.append("idMaratona", maratona.id);

        const options = {
            method: 'POST',
            body: formData
        };

        try {
            const response = await fetch("/criarTime", options);
            const data = await response.json();

            if (data.status === 'success') {
                toast.style.backgroundColor = '#2e7d32';
                if (timesSalvos.length + 1 === maratona.qtdTimes) {
                    criacaoTimeScreen.classList.remove('show');
                    overlayIntoMaratona.classList.remove('show');
                    intoMaratona.classList.remove("no-scroll");
                    timeload.style.display = 'none';
                    ConfirmarCriacaoTime.style.display = 'inline-block';
                    showToast(data.message);
                    ExibirTimes(maratona, false, rodadas, false);
                    return;
                }
                showToast(data.message);
                ExibirTimes(maratona, false, rodadas, false);
                formTime.reset();
                imgElement.src = 'static/img/escudoTime.png';
                imgElement.style.width = "70%";
            } else {
            toast.style.backgroundColor = '#c62828';
            showToast(data.message);
            }
        } catch (error) {
            toast.style.backgroundColor = '#c62828';
            showToast("ERROR");
            console.error("ERROR: ", error);
        }
        timeload.style.display = 'none';
        ConfirmarCriacaoTime.style.display = 'inline-block';
    };

    document.getElementById("fecharCriacaoTime").onclick = function () {
        criacaoTimeScreen.classList.remove('show');
        overlayIntoMaratona.classList.remove('show');
        intoMaratona.classList.remove("no-scroll");
    };
};

document.getElementById("fecharEdicaoTime").onclick = function () {
    EditarTimeContainer.classList.remove('show');
    overlayIntoMaratona.classList.remove('show');
    intoMaratona.classList.remove("no-scroll");
}

const EditarMaratona = (element) => {
    const inputNomeMaratona = document.getElementById("novoNomeMaratona");
    const inputDescricaoMaratona = document.getElementById("novaDescricaoMaratona");
    const inputQtdTimesMaratona = document.getElementById("novaqtdTimes");
    const inputPremioMaratona = document.getElementById("novoPremioMaratona");
    const botaoEditar = document.getElementById("ConfirmarEdicaoMaratona");
    const botaoExcluir = document.getElementById("ExcluirMaratona");
    const loadedit = document.getElementById("editload");
    const divb = document.getElementById("buttoneditmaratona");

    editarMaratona.classList.add('show');
    overlayIntoMaratona.classList.add('show');
    body.classList.add("no-scrollbody");

    inputNomeMaratona.value = element.nome_maratona;
    inputDescricaoMaratona.value = element.descricao;
    inputQtdTimesMaratona.value = element.qtdTimes;
    inputPremioMaratona.value = element.premiacao;

    botaoEditar.onclick = async (event) => {
        event.preventDefault();
        loadedit.style.display = 'flex';
        divb.style.display = 'none';

        const data = {
            id: element.id,
            nome_maratona: inputNomeMaratona.value,
            descricao: inputDescricaoMaratona.value,
            qtdTimes: inputQtdTimesMaratona.value,
            premiacao: inputPremioMaratona.value,
        };

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch("/updateMaratona", options);
            const result = await response.json();
            if (result.status === "success") {
                element.nome_maratona = inputNomeMaratona.value;
                element.descricao = inputDescricaoMaratona.value;
                element.premiacao = inputPremioMaratona.value;
                fecharEdicaoMaratona.click();
                toast.style.backgroundColor = '#2e7d32';
                showToast(result.message);
                exibirMaratonas();
            } else {
            toast.style.backgroundColor = '#c62828';
            showToast(result.message);
            }
        } catch (error) {
            toast.style.backgroundColor = '#c62828';
            showToast("ERROR");
            console.error("ERROR: ", error);
        }
        divb.style.display = 'flex';
        loadedit.style.display = 'none';
    };

    botaoExcluir.onclick = async (event) => {
        event.preventDefault();
        loadedit.style.display = 'flex';
        divb.style.display = 'none';
        const data = { id: element.id };

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch("/deleteMaratona", options);
            const result = await response.json();
            if (result.status === "success") {
                exibirMaratonas();
                fecharEdicaoMaratona.click();
                backToHome.click();
                toast.style.backgroundColor = '#2e7d32';
                showToast(result.message);
            } else {
                toast.style.backgroundColor = '#c62828';
                showToast(result.message);
            }
        } catch (error) {
            toast.style.backgroundColor = '#c62828';
            showToast("ERROR");
            console.error('ERROR: ', error);
        }
        divb.style.display = 'flex';
        loadedit.style.display = 'none';
    };
}

contaOpcoes.addEventListener('mouseenter', function () {
    opcoes.style.display = "flex";
    toggleIcon.classList.add("rotate");
})

opcoes.addEventListener('mouseenter', function () {
    opcoes.style.display = "flex";
    toggleIcon.classList.add("rotate");
})

contaOpcoes.addEventListener('mouseleave', function () {

    if (!opcoes.matches(':hover')) {
        opcoes.style.display = "none";
        toggleIcon.classList.remove("rotate");
    }

})

opcoes.addEventListener('mouseleave', function () {

    if (!contaOpcoes.matches(':hover')) {
        opcoes.style.display = "none";
        toggleIcon.classList.remove("rotate");
    }

})

fecharCriacao.onclick = function () {
    criacao.classList.remove('show');
    overlay.classList.remove('show');
    body.classList.remove("no-scrollbody");
}

fecharEdicaoMaratona.onclick = function () {
    editarMaratona.classList.remove('show');
    overlayIntoMaratona.classList.remove('show');
    intoMaratona.classList.remove("no-scroll");
}

fecharEdicaoConta.onclick = function () {
    screenEdicaoConta.classList.remove('show');
    overlay.classList.remove('show');
    body.classList.remove("no-scrollbody");
}

editarContaAbrir.onclick = function () {
    screenEdicaoConta.classList.add('show');
    overlay.classList.add('show');
    body.classList.add("no-scrollbody");

    usernameUpdate.value = userLogado.nome;
    emailUpdate.value = userLogado.email;
    imagemAtualizar.src = userLogado.icon;

    let currentImageUrl = '';

    const inputImagem = document.getElementById('inputImagem');
    const containerArredondadoEdicao = document.getElementById('containerArredondadoEdicao');

    containerArredondadoEdicao.onclick = function () {
        inputImagem.click();
    };

    inputImagem.onchange = function (event) {
        const arquivo = event.target.files[0];
        if (arquivo) {

            if (currentImageUrl) {
                URL.revokeObjectURL(currentImageUrl);
            }

            currentImageUrl = URL.createObjectURL(arquivo);
            imagemAtualizar.src = currentImageUrl;

        }

    };
};



function mostrarSenha() {
    var inputPass = document.getElementById('newPassword');
    var btnShowPass = document.getElementById('btn-senha');

    if (inputPass.type === 'password') {
        inputPass.setAttribute('type', 'text')
        btnShowPass.classList.replace('bi-eye-fill', 'bi-eye-slash-fill')
    } else {
        inputPass.setAttribute('type', 'password')
        btnShowPass.classList.replace('bi-eye-slash-fill', 'bi-eye-fill')
    }
}

criarMaisButton.onclick = function () {
    criacao.classList.add('show');
    overlay.classList.add('show');
    body.classList.add("no-scrollbody");
}

btn_logout.onclick = function (event) {
    event.preventDefault();

    fetch('/logout', { method: 'GET' })
    window.location.href = '/'
}

formEditConta.onsubmit = (event) => {
    event.preventDefault();
    const containerbut = document.getElementById('containerbut');
    const loadconta = document.getElementById('loadconta');
    const inputImagem = document.getElementById('inputImagem');
    const formData = new FormData(formEditConta);
    if (!inputImagem.files.length) {
        formData.delete('iconPerfil');
    }
    containerbut.style.display = 'none';
    loadconta.style.display = 'flex';
    const options = {
        method: 'PUT',
        body: formData
    }

    fetch('/updateUser', options)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                userLogado.nome = usernameUpdate.value;
                userLogado.email = emailUpdate.value;
                userLogado.icon = imagemAtualizar.src;
                fotoPerfil.src = imagemAtualizar.src;
                formEditConta.reset();
                fecharEdicaoConta.click();
                toast.style.backgroundColor = '#2e7d32';
                showToast(data.message);
            } else {
                toast.style.backgroundColor = '#c62828';
                if (data.status === "error") {
                    showToast(data.message);
                } else if (data.status == "passInvalid") {
                    showToast(data.message);
                }
            }
        })
        .catch((error) => {
            toast.style.backgroundColor = '#c62828';
            showToast("ERROR");
            console.log("Erro: ", error);
        })
        .finally(() => {
            containerbut.style.display = 'flex';
            loadconta.style.display = 'none';
        });
}

btnDelUser.onclick = (event) => {
    event.preventDefault();
    const containerbut = document.getElementById('containerbut');
    const loadconta = document.getElementById('loadconta');
        
    containerbut.style.display = 'none';
    loadconta.style.display = 'flex';

    fetch("/deleteUser", { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.status === "sucess") {
                window.location.href = "/"
            } else {
            toast.style.backgroundColor = '#c62828';
            showToast(data.message);
            }
        })
        .catch((error) => {
            toast.style.backgroundColor = '#c62828';
            showToast("ERROR");
            console.error("ERRO: ", error);
        })
}

formMaratona.onsubmit = async function (event) {
    event.preventDefault();
    const criaload = document.getElementById("criaload");
    criaload.style.display = 'flex';
    const buttomcria = document.getElementById("ConfirmarCriacao");
    buttomcria.style.display = 'none';
    const formData = new FormData(formMaratona);
    data = {}

    formData.forEach((value, key) => {
        data[key] = value;
    })

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }

    await fetch('/createMarathon', options)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                exibirMaratonas();
                toast.style.backgroundColor = '#2e7d32';
                showToast(data.message);
                formMaratona.reset();
                fecharCriacao.click();
            } else {
                toast.style.backgroundColor = '#c62828';
                if (data.status === "error") {
                showToast(data.message);
                } else if (data.status == "N/A") {
                    showToast(data.message);
                }
            }
        })
        .catch((error) => {
            console.log("Erro: ", error);
        });
        criaload.style.display = 'none';
        buttomcria.style.display = 'inline-block';
};

filterTime.oninput = function (event) {
    containerExibirTimes.innerHTML = '';

    const timesFiltrados = timesSalvos.filter(element =>
        element.abreviacao.toLowerCase().includes(event.target.value.toLowerCase())
    );

    timesFiltrados.forEach((element) => {
        const containerItem = document.createElement('li');
        containerItem.classList.add('time-item');
        containerItem.innerHTML = `
            <img src="${element.icon}" alt="${element.abreviacao}">
            <p>${element.abreviacao}</p>
        `;
        containerItem.dataset.index = element.id;
        containerExibirTimes.appendChild(containerItem);

        containerItem.onclick = function () {
            IntoTeam(element);
        }
    });
}

filter.oninput = function (event) {
    exibirCategorias.innerHTML = '';

    const maratonasFiltradas = maratonasSalvas.filter(element =>
        element.nome.toLowerCase().includes(event.target.value.toLowerCase())
    );

    maratonasFiltradas.forEach((element, index) => {
        const containerItem = document.createElement('li');
        containerItem.innerHTML = `
            <h3 style="font-size: 1.5em; margin: 10px 0;">${element.nome}</h3>
            <p style="font-size: 1em; color: #ccc; margin: 5px 0;">Descrição: ${element.descricao}</p>
            <p style="font-size: 1em; color: #ccc; margin: 5px 0;">Quantidade de Times: ${element.qtdTimes}</p>
            <p style="font-size: 1em; color: #ccc; margin: 5px 0;">Premiação: ${element.premiacao}</p>
        `;
        exibirCategorias.appendChild(containerItem);

        if (index < maratonasFiltradas.length - 1) {
            const linhaDivisoria = document.createElement('hr');
            linhaDivisoria.classList.add("horizontal-bar");
            linhaDivisoria.style.marginTop = "0";
            linhaDivisoria.style.marginBottom = "0";
            linhaDivisoria.style.width = "100%";
            linhaDivisoria.style.height = "3px";
            exibirCategorias.appendChild(linhaDivisoria);
        }

        // Adiciona o evento de clique para abrir a tela de edição da maratona
        containerItem.addEventListener('click', function () {
            const atual = {
                id: element.id,
                nome_maratona: element.nome,
                descricao: element.descricao,
                qtdTimes: element.qtdTimes,
                premiacao: element.premiacao,
            };
            IntoMaratona(atual);
        });
    });
};

// Função para carregar as partidas do banco de dados (Não cria, elas são criadas no momento da criação da maratona)
const adicionarPartida = async (maratona) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(`/partida?maratona_id=${maratona.id}`, options);
        if (!response.ok) {
            throw new Error(`Erro ao listar partidas: ${response.status}`);
        }

        const rodadasBackend = await response.json();

        rodadas = rodadasBackend.map(rodada =>
            rodada.map(partida => {
                // função auxiliar para pegar dados completos do time
                const getTimeInfo = (id) => {
                    if (!id) return { id: null, nome:'', abreviacao:'', icon:'' };
                    const time = timesSalvos.find(t => t.id === id);
                    return time ? { id: time.id, nome: time.nome, abreviacao: time.abreviacao, icon: time.icon } 
                                : { id, nome:'', abreviacao:'', icon:'' };
                };

                return {
                    id: partida.id,
                    data_partida: partida.data_partida,
                    local_partida: partida.local_partida,
                    times: [
                        getTimeInfo(partida.times[0]?.id),
                        getTimeInfo(partida.times[1]?.id)
                    ],
                    vencedor: getTimeInfo(partida.vencedor),
                    maratonaId: partida.maratonaId
                };
            })
        );
        loadingRodada.style.display = 'none';
        atualizarLayout(rodadas);

    } catch (error) {
        console.error('Falha ao adicionar partidas:', error);
    }
};

function getPartidaFinal(rodadas) {
    if (!Array.isArray(rodadas)) return null;
    if (!rodadas.length) return null;
    if (!Array.isArray(rodadas[0])) return null;
    if (!rodadas[0].length) return null;

    return rodadas[0][0];
}

// Função para renderizar o layout com as novas atualizações de partidas
function atualizarLayout(rodadas) {
    rodadasContainer.innerHTML = '';
    const vetorSorteioTimes = timesSalvos;

    rodadas.forEach((rodada, indexRodada) => {
        const rodadaDiv = document.createElement('div');
        rodadaDiv.classList.add('rodada');

        let gap = 109;

        if (rodadas.length === 3) {
            if (indexRodada === 1) {
                rodadaDiv.style.gap = `${110}px`;
                gap = 110 + 109;
            }
        }
        if (rodadas.length > 3) {
            if (indexRodada === 1) {
                rodadaDiv.style.gap = `${330}px`;
                gap = 330 + 109;
            }
            if (indexRodada === 2) {
                rodadaDiv.style.gap = `${110}px`;
                gap = 110 + 109;
            }
        }


        rodada.forEach((partida, indexPartida) => {
            const partidaDiv = document.createElement('div');
            partidaDiv.classList.add('partida');

            const time1 = document.createElement('select');
            time1.classList.add('time');
            selecionarTime(partida.id, 0, rodadas, time1);


            const time2 = document.createElement('select');
            time2.classList.add('time');
            selecionarTime(partida.id, 1, rodadas, time2);

            const trof = document.createElement('div');
            trof.classList.add('seta');
            trof.innerHTML = '<i class="bi bi-trophy-fill"></i>';
            trof.onclick = async () => CriarPartida(partida, rodadas);

            // Habilitar ou desabilitar baseando-se na rodada e no número de times
            if (indexRodada === rodadas.length - 1) {
                const temDoisTimes = partida.times[0].id !== null && partida.times[1].id !== null;
                const vence = partida.vencedor.id === null;
                time1.disabled = !vence;
                time2.disabled = !vence;
                trof.style.pointerEvents = 'auto';
                if (vence && !temDoisTimes) {
                    trof.style.color = "black";
                } else if (vence && temDoisTimes) {
                    trof.style.color = "green";
                } else {
                    trof.style.color = "gold";
                }
            } else {
                const temDoisTimes = (partida.times[0].id !== null && partida.times[1].id !== null);
                const vence = partida.vencedor.id === null;
                time1.disabled = true;
                time2.disabled = true;
                trof.style.pointerEvents = 'auto';
                if (!temDoisTimes && vence) {
                    trof.style.color = "gray";
                    trof.style.pointerEvents = 'none';
                } else if (temDoisTimes && vence) {
                    trof.style.color = "green";
                } else {
                    trof.style.color = "gold";
                }
            }

            // Monta a estrutura da partida
            partidaDiv.appendChild(time1);
            partidaDiv.appendChild(trof);
            partidaDiv.appendChild(time2);


            // Se for uma partida par, adicionar a linha vertical que conecta à partida ímpar
            // Adiciona a linha vertical se a rodada estiver cheia
            if (rodada.length >= Math.pow(2, indexRodada)) {
                if (indexPartida % 2 === 0 && rodada[indexPartida + 1]) {
                    const linhaVertical = document.createElement('div');
                    linhaVertical.classList.add('linha-vertical');
                    linhaVertical.style.height = `${gap}px`;
                    partidaDiv.appendChild(linhaVertical);
                }
            } else {
                // Adiciona a linha vertical alternativa se a rodada não estiver cheia
                if (indexPartida % 2 === 0 && rodada[indexPartida + 1]) {
                    const linhaVertical2 = document.createElement('div');
                    linhaVertical2.classList.add('vertical2');
                    linhaVertical2.style.height = `${gap}px`;
                    partidaDiv.appendChild(linhaVertical2);
                }
            }

            // Se não for a última rodada, adiciona linha horizontal para a próxima rodada
            if (indexRodada > 0 && rodadas[indexRodada - 1].length === Math.floor(rodada.length / 2)) {
                const linhaHorizontal = document.createElement('div');
                linhaHorizontal.classList.add('linha-horizontal');
                partidaDiv.appendChild(linhaHorizontal);

            }
            if (indexRodada === 0) { // pra ter na final
                const linhaHorizontal = document.createElement('div');
                linhaHorizontal.classList.add('linha-horizontal');
                partidaDiv.appendChild(linhaHorizontal);
            }

            rodadaDiv.appendChild(partidaDiv);
        });

        rodadasContainer.appendChild(rodadaDiv);
        $('.time, #TimeVencedor').select2({

            templateResult: function (data) {
                if (!data.id) {
                    return data.text;
                }

                if (data.element && data.element.value === "Remover") {
                    const $remover = $(`
                        <span style="display: block; background-color: red; color: white; padding: 5px; border-radius: 5px;">
                            <i class="bi bi-trash" style="color: white;"></i>
                        </span>
                    `);
                    return $remover;
                }

                return data.text;
            },
            escapeMarkup: function (markup) {
                return markup;
            }
        });
    });

    function verificarCampeao(rodadas) {
        const final = getPartidaFinal(rodadas);
        const imagemCampeao = document.getElementById('imagemCampeao');
        const abv = document.getElementById('campAbv');
        if (!final || !final.vencedor?.id) {
            imagemCampeao.src = 'static/img/hackathon.png';
            imagemCampeao.style.display = "block";
            abv.textContent = '';
            containerVencedor.onclick = null;
            return;
        }

        if (final && final.vencedor && final.vencedor.id !== null) {
            imagemCampeao.src = final.vencedor.icon;
            imagemCampeao.style.display = "block";
            abv.textContent = final.vencedor.abreviacao;

            const timeCampeao = timesSalvos.find(time => time.id === final.vencedor.id) || null;
            const maratona = maratonasSalvas.find(m => m.id === final.maratonaId) || null;

            if (timeCampeao && maratona) {
                containerVencedor.onclick = function () {
                IntoTeam(timeCampeao, maratona);
            };
            } else {
                containerVencedor.onclick = null;
            }
}
}
verificarCampeao(rodadas);

}

async function definirVencedor(partida, rodadas, vencedorId) {

    const aplicado = aplicarVencedorLocal(partida, vencedorId);
    if (!aplicado) {
        toast.style.backgroundColor = '#f7b917';
        showToast("Vencedor inválido!");
        return;
    }

    await propagarVencedor(partida, rodadas);
    atualizarLayout(rodadas);
}


function aplicarVencedorLocal(partida, vencedorId) {
    const [time1, time2] = partida.times;

    const vencedor =
        vencedorId == time1?.id ? time1 :
        vencedorId == time2?.id ? time2 :
        null;

    if (!vencedor) return false;

    partida.vencedor = {
        nome: vencedor.nome,
        abreviacao: vencedor.abreviacao,
        icon: vencedor.icon,
        id: vencedor.id,
        maratonaId: vencedor.maratonaId
    };

    return true;
}

async function propagarVencedor(partida, rodadas) {
    const rodadaAtual = rodadas.find(r => r.includes(partida));
    const rodadaIndex = rodadas.indexOf(rodadaAtual);

    // Se for final, não propaga
    if (rodadaIndex === 0) return;

    const proximaRodada = rodadas[rodadaIndex - 1];
    const posAtual = rodadaAtual.indexOf(partida);
    const posProxima = Math.floor(posAtual / 2);

    const proximaPartida = proximaRodada[posProxima];
    if (!proximaPartida) return;

    // Decide slot
    if (!proximaPartida.times[0]?.id) {
        proximaPartida.times[0] = partida.vencedor;
    } else {
        proximaPartida.times[1] = partida.vencedor;
    }

    // ATUALIZA BACKEND DA PRÓXIMA PARTIDA
    await atualizarPartidaBackend({
        id: proximaPartida.id,
        data_partida: proximaPartida.data_partida ?? null,
        local_partida: proximaPartida.local ?? null,
        time1: proximaPartida.times[0]?.id ?? null,
        time2: proximaPartida.times[1]?.id ?? null,
        vencedor: null
    });
}

// Não cria a partida, apenas atualiza suas informações no banco
const CriarPartida = (partida, rodadas) => {

    criacaoPartida.classList.add('show');
    overlayIntoMaratona.classList.add('show');
    intoMaratona.classList.add("no-scroll");

    const BotaoConfirmar = document.getElementById("ConfirmarCriacaoPartida");
    const LocalPartida = document.getElementById("LocalPartida");
    const DataPartida = document.getElementById("DataPartida");
    const loadpartida = document.getElementById("loadpartida");

    LocalPartida.value = partida.local_partida ?? "";
    DataPartida.value = partida.data_partida
    ? new Date(partida.data_partida).toISOString().slice(0, 10)
    : "";
    BotaoConfirmar.textContent = "Atualizar";
    OptionsVencedor.innerHTML = "";
    BotaoConfirmar.classList.remove('unclick');
    BotaoConfirmar.classList.add('ConfirmarCriacao');
    OptionsVencedor.disabled = false;
    LocalPartida.disabled = false;
    DataPartida.disabled = false;
    BotaoConfirmar.disabled = false;

    // Opções de times da partida
        partida.times.forEach(time => {
        if (time?.id) {
            const opt = document.createElement("option");
            opt.value = time.id;
            opt.textContent = time.abreviacao;
            OptionsVencedor.appendChild(opt);
        }
    });

    //Opção remover
    const optRemover = document.createElement("option");
    optRemover.value = "Remover";
    OptionsVencedor.appendChild(optRemover);

    if (partida.vencedor?.id !== null) {
        OptionsVencedor.value = partida.vencedor.id;
        OptionsVencedor.disabled = true;
        LocalPartida.disabled = true;
        DataPartida.disabled = true;
        BotaoConfirmar.textContent = "Finalizada";
        BotaoConfirmar.disabled = true;
        BotaoConfirmar.classList.remove('ConfirmarCriacao');
        BotaoConfirmar.classList.add('unclick');
    } else {
        OptionsVencedor.value = "";
    }

    document.getElementById("fecharCriacaoPartida").onclick = fecharTelaCriarPartida;

    BotaoConfirmar.onclick = async () => {
        if (partida.vencedor?.id){
            toast.style.backgroundColor = '#f7b917';
            showToast("Partidas com vencedores não podem ser modificadas");
            return;
        }

        let vencedor = OptionsVencedor.value;

         const time1Id = partida.times[0]?.id;
        const time2Id = partida.times[1]?.id;

        if (!vencedor || vencedor === "Remover") {
            vencedor = null;
        }

        if (vencedor && (!time1Id || !time2Id)) {
            toast.style.backgroundColor = '#f7b917';
            showToast("Partidas sem 2 times não podem ter vencedores!");
            
            return;
        }

        BotaoConfirmar.style.display = 'none';
        loadpartida.style.display = 'flex';

        const sucesso = await atualizarPartidaBackend({
            id: partida.id,
            data_partida: DataPartida.value || null,
            local_partida: LocalPartida.value || null,
            time1: partida.times[0]?.id || null,
            time2: partida.times[1]?.id || null,
            vencedor
        });

        // Se backend falhar, NÃO altera nada no front
        if (!sucesso) {
            toast.style.backgroundColor = '#f7b917';
            showToast("Erro ao atualizar partida!");
            BotaoConfirmar.style.display = 'inline-block';
            loadpartida.style.display = 'none';
            return;
        }
        partida.data_partida = DataPartida.value || null;
        partida.local_partida = LocalPartida.value || null;

        toast.style.backgroundColor = '#2e7d32';
        showToast("Partida Atualizada!");
        if (vencedor) {
            definirVencedor(partida, rodadas, vencedor);
        }
        BotaoConfirmar.style.display = 'inline-block';
        loadpartida.style.display = 'none';
        fecharTelaCriarPartida();
        atualizarLayout(rodadas);
    };
};

const fecharTelaCriarPartida = () => {
    const LocalPartida = document.getElementById("LocalPartida");
    const DataPartida = document.getElementById("DataPartida");
    LocalPartida.value = "";
    DataPartida.value = "";
    OptionsVencedor.innerHTML = "";
    criacaoPartida.classList.remove('show');
    overlayIntoMaratona.classList.remove('show');
    intoMaratona.classList.remove("no-scroll");
}

// Verifica se o time selecionado é válido
function timeJaUsadoEmOutraPartida(timeId, partidaAtualId, rodadas) {
    return rodadas.flat().some(p =>
        p.id !== partidaAtualId &&           // não é a mesma partida
        p.times.some(t => t?.id === timeId)  // time já está nela
    );
}

function selecionarTime(partidaId, timeIndex, rodadas, selectElement) {
    const partida = rodadas.flat().find(p => p.id === partidaId);
    if (!partida) return;

    selectElement.innerHTML = '';

    const optionRemover = document.createElement('option');
    optionRemover.value = "Remover";
    selectElement.appendChild(optionRemover);

    // Preenche opções com times salvos
    timesSalvos.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = t.abreviacao;
        selectElement.appendChild(option);
    });

    // Seleciona valor atual
    selectElement.value = partida.times[timeIndex]?.id ?? "";

    let valorAnteriorSelect = selectElement.value;
    let valoranteriorabv = partida.times[timeIndex]?.abreviacao ?? "";

    selectElement.onchange = async function () {

        if (bloqueandoChange) return;

        const timeIdSelecionado = selectElement.value || null;

        const valorAnterior = valorAnteriorSelect;
        const val = valoranteriorabv;
        const estadoAnterior = { ...partida.times[timeIndex] };

        if (timeIdSelecionado === "Remover" || !timeIdSelecionado) {
            partida.times[timeIndex] = { id: null, nome:'', abreviacao:'', icon:'' };

            const sucesso = await atualizarPartidaBackend({
                id: partida.id,
                data_partida: partida.data_partida ?? null,
                local_partida: partida.local_partida ?? null,
                time1: partida.times[0]?.id ?? null,
                time2: partida.times[1]?.id ?? null,
                vencedor: null
            });

            if (!sucesso) {
                partida.times[timeIndex] = estadoAnterior;
                bloqueandoChange = true;
                $(selectElement).val(valorAnterior).trigger('change');
                bloqueandoChange = false;
                return;
            }

            valorAnteriorSelect = selectElement.value;
            atualizarLayout(rodadas);
            return;
        }

        const timeSelecionado = timesSalvos.find(t => t.id == timeIdSelecionado);
        if (!timeSelecionado) {
            bloqueandoChange = true;
            $(selectElement).val(valorAnterior).trigger('change');
            bloqueandoChange = false;
            return;
        }

        const outroIndex = timeIndex === 0 ? 1 : 0;
        if (partida.times[outroIndex]?.id === timeSelecionado.id) {
            toast.style.backgroundColor = '#f7b917';
            showToast("Time já selecionado!");
            bloqueandoChange = true;
            $(selectElement).val(valorAnterior).trigger('change');
            bloqueandoChange = false;
            return;
        }

        if (timeJaUsadoEmOutraPartida(timeSelecionado.id, partida.id, rodadas)) {
            toast.style.backgroundColor = '#f7b917';
            showToast("Time já selecionado!");
            bloqueandoChange = true;
            $(selectElement).val(valorAnterior).trigger('change');
            bloqueandoChange = false;
            return;
        }

        // Atualiza localmente
        partida.times[timeIndex] = {
            id: timeSelecionado.id,
            nome: timeSelecionado.nome,
            abreviacao: timeSelecionado.abreviacao,
            icon: timeSelecionado.icon
        };

        const sucesso = await atualizarPartidaBackend({
            id: partida.id,
            data_partida: partida.data_partida ?? null,
            local_partida: partida.local_partida ?? null,
            time1: partida.times[0]?.id ?? null,
            time2: partida.times[1]?.id ?? null,
            vencedor: null
        });

        if (!sucesso) {
            partida.times[timeIndex] = estadoAnterior;
            bloqueandoChange = true;
            $(selectElement).val(valorAnterior).trigger('change');
            bloqueandoChange = false;
            return;
        }
       
        valorAnteriorSelect = selectElement.value;
        atualizarLayout(rodadas);
    };
}

function normalizarDataParaMysql(data) {
    if (!data) return null;

    // já está no formato certo
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        return data;
    }

    // tenta converter
    const d = new Date(data);
    if (isNaN(d)) return null;

    return d.toISOString().slice(0, 10);
}

// Função genérica para atualizar a partida no backend
const atualizarPartidaBackend = async ({ id, data_partida, local_partida, time1, time2, vencedor }) => {
    data_partida = normalizarDataParaMysql(data_partida);
    try {
        const response = await fetch('/updatePartida', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, data_partida, local_partida, time1, time2, vencedor })
        });

        const data = await response.json();
        if (data.status === 'success') {
            return true;
        } else {
            alert("Erro ao atualizar partida no servidor!");
            return false;
        }
    } catch (error) {
        console.error("Erro ao atualizar partida:", error);
        return false;
    }
};

let toastTimeout = null;

function showToast(message) {
    const msg = document.getElementById('toast-message');

    msg.textContent = message;

    // reset
    clearTimeout(toastTimeout);
    toast.classList.remove('hidden');

    void toast.offsetWidth;

    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
        hideToast();
    }, 5000);
}

function hideToast() {
    toast.classList.remove('show');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 400);
}

document.getElementById('toast').addEventListener('click', hideToast);