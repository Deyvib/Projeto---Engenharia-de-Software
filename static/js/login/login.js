const mudarParaCadastro = document.getElementById("criarConta");
const side = document.getElementById("side");
const container = document.getElementById("formularioCampos");
const cadastroScreen = document.getElementById("cadastro-form");
const loginScreen = document.getElementById("campos");
const naoTemConta = document.getElementById("naoTemConta");
const mudarParaLogin = document.getElementById("logar");
const jaTemConta = document.getElementById("jaTemConta");
const mensagemVerificaSenha = document.getElementById("textLogin");
const mensagemVerificaCadastro = document.getElementById("textSigin");

cadastroScreen.remove();
jaTemConta.remove();

if(window.innerWidth <=768){
    cadastroScreen.style.transform = "rotateY(180deg)";
    jaTemConta.style.transform = "rotateY(180deg)";
}

function mostrarSenha(){
    var inputPass = document.getElementById('senha');
    var btnShowPass = document.getElementById('btn-senha');

    if(inputPass.type === 'password'){
        inputPass.setAttribute('type', 'text')
        btnShowPass.classList.replace('bi-eye-fill', 'bi-eye-slash-fill')
        }else{
            inputPass.setAttribute('type', 'password')
                btnShowPass.classList.replace('bi-eye-slash-fill', 'bi-eye-fill')
        }
    }

    function mostrarSenhaCriar(){
        var inputPass = document.getElementById('senhaCriar');
        var btnShowPass = document.getElementById('btn-senha');
    
        if(inputPass.type === 'password'){
            inputPass.setAttribute('type', 'text')
            btnShowPass.classList.replace('bi-eye-fill', 'bi-eye-slash-fill')
            }else{
                inputPass.setAttribute('type', 'password')
                    btnShowPass.classList.replace('bi-eye-slash-fill', 'bi-eye-fill')
            }
        }

mudarParaCadastro.addEventListener("click", function(){
    mensagemVerificaSenha.textContent="";
    loginScreen.remove();
    naoTemConta.remove();
    if(window.innerWidth>768){
        container.classList.add("formMoveLeft");
    }
    else{
        container.classList.add("formMoveLeftMobile");
    }
    container.appendChild(cadastroScreen);
    container.appendChild(jaTemConta);
    side.classList.add("sideMoveRight");
});

mudarParaLogin.addEventListener("click",function(){
    cadastroScreen.remove();
    jaTemConta.remove();
    if(window.innerWidth > 768){
        container.classList.remove("formMoveLeft");
    }
    else{
        container.classList.remove("formMoveLeftMobile");
    }
    container.appendChild(loginScreen);
    container.appendChild(naoTemConta);
    side.classList.remove("sideMoveRight");
});

loginScreen.addEventListener('submit', async(event) => {
    event.preventDefault();

    const formData = new FormData(loginScreen);
    const data ={};
    formData.forEach((value, key) => {
        data[key] = value;
    })

    const loadlogin = document.getElementById('loadlogin');
    const entrar = document.getElementById('entrar');

    loadlogin.style.display = 'flex';
    entrar.style.display = 'none';

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }

    await fetch('/submit', options)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                window.location.href = "/home"
                //recebe os dados aqui
                //EX: id = data.user_id;
            } else {
                alert('Senha ou email incorreto');
                loadlogin.style.display = 'none';
                entrar.style.display = 'inline-block';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            loadlogin.style.display = 'none';
            entrar.style.display = 'inline-block';
        })
})

cadastroScreen.addEventListener('submit', async (event) => {
    event.preventDefault()

    const nome = document.getElementById("nomeCriar").value;
    const user = document.getElementById("usuarioCriar").value;
    const senha = document.getElementById("senhaCriar").value;
    const formData = new FormData(cadastroScreen)
    const data = {}

    if(nome.length === 0 || user.length === 0 || senha.length === 0){
        mensagemVerificaCadastro.textContent = "Todos os campos devem ser preenchidos";
        return;
    }

    const loadcadastro = document.getElementById('loadcadastro');
    const botaoCadastrar = document.getElementById('botaoCadastrar');

    loadcadastro.style.display = 'flex';
    botaoCadastrar.style.display = 'none';

    formData.forEach((value, key) => {
        data[key] = value
    })

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }

    await fetch('/create', options)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success'){
                window.location.href = '/'
            }else if(data.status === 'passInvalid'){
                mensagemVerificaCadastro.textContent = data.message;
                loadlogin.style.display = 'none';
                entrar.style.display = 'inline-block';
            }else{
                mensagemVerificaCadastro.textContent = "Erro ao cadastrar";
                loadlogin.style.display = 'none';
                entrar.style.display = 'inline-block';
            }
        })
        .catch((error) => {
            console.error('Error: ', error)
        });
})