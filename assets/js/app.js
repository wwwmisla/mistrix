document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos do DOM
    const auth = document.getElementById('auth'); // container auth
    const header = document.getElementById('header'); // container header
    const main = document.getElementById('main'); // container main
    const infoSection = document.getElementById('info-section'); // container info-section
    const authSection = document.getElementById('auth-section'); // sections auth/post/game
    const postsSection = document.getElementById('posts-section');
    const gameSection = document.getElementById('game-section');
    const loginContainer = document.getElementById('login-container'); // containers login/register
    const registerContainer = document.getElementById('register-container');
    const loginForm = document.getElementById('login-form'); // forms login/register
    const registerForm = document.getElementById('register-form');
    const linkToRegister = document.getElementById('link-to-register'); // links login/register
    const linkToLogin = document.getElementById('link-to-login');
    const profileNameHeader = document.getElementById('profile-name'); // profile name header
    const saluName = document.getElementById('salu-username'); // salutation username 
    const postForm = document.getElementById('post-form'); // form de postagem
    const postsList = document.getElementById('posts-list'); // lista de postagens
    const logoutButton = document.getElementById('logout'); // botão de logout
    const profileDropdownButton = document.getElementById('profile-dropdown-button'); // botão de perfil
    const profileDropdown = document.getElementById('profile-dropdown'); // dropdown de perfil
    const deleteAccountLink = document.getElementById('delete-account'); // link de exclusão de conta
    const fullnameInfo = document.getElementById('fullname-info');
    const usernameInfo = document.getElementById('username-info');
    const userTime = document.getElementById('user-time');
    const userDetails = document.getElementById('user-details');
    const profilePictureInfo = document.getElementById('profile-picture-info');

    // Estado inicial do armazenamento local
    let users = JSON.parse(localStorage.getItem('users')) || []; // lista de usuarios
    let currentUser = JSON.parse(localStorage.getItem('currentUser')); // usuario logado
    let posts = JSON.parse(localStorage.getItem('posts')) || []; // lista de postagens

    // Função para salvar dados no localStorage
    const saveData = () => {
        localStorage.setItem('users', JSON.stringify(users)); // salva a lista de usuarios
        localStorage.setItem('currentUser', JSON.stringify(currentUser)); // salva o usuario logado
        localStorage.setItem('posts', JSON.stringify(posts)); // salva a lista de postagens
    };

    // Função para calcular o tempo desde o registro
    const getTimeSinceRegistration = (registrationDate) => {
        const now = new Date();
        const registeredDate = new Date(registrationDate);
        const timeDiff = now - registeredDate;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        return `${days} dias atrás`;
    };

    // Função para mostrar a seção apropriada
    const showSection = () => {
        if (currentUser) { // se o usuario estiver logado
            auth.style.display = 'none'; // esconde o container auth
            authSection.style.display = 'none'; // esconde a seção de login/registro
            header.style.display = 'flex'; // mostra o container header
            main.style.display = 'grid'; // mostra o container main
            infoSection.style.display = 'flex'; // mostra o container info-section
            postsSection.style.display = 'flex'; // mostra a seção de postagens
            gameSection.style.display = 'flex'; // mostra a seção de jogo

            profileNameHeader.textContent = currentUser.username; // exibe o nome do usuario logado
            saluName.textContent = currentUser.username; // exibe a saudação do usuario logado

            // Atualiza as informações do usuário na seção info-section
            const nameParts = currentUser.fullname.split(' ').slice(0, 2).join(' '); // Obtém os dois primeiros nomes
            fullnameInfo.textContent = nameParts;
            usernameInfo.textContent = `@${currentUser.username}`;
            userTime.textContent = getTimeSinceRegistration(currentUser.registrationDate);
            userDetails.textContent = 'Detalhes do usuário'; // Adicione detalhes adicionais se necessário
            profilePictureInfo.src = './assets/img/avatar-profile-max.png'; // Atualize o caminho se necessário

            infoSection.style.display = 'block'; // mostra o container info-section

            displayPosts(); // exibe as postagens
        } else {
            auth.style.display = 'flex'; // mostra o container auth
            authSection.style.display = 'flex'; // mostra a seção de login/registro
            header.style.display = 'none'; // esconde o container header'
            main.style.display = 'none'; // esconde o container main
            infoSection.style.display = 'none'; // esconde o container info-section'
            postsSection.style.display = 'none'; // esconde a seção de postagens
            gameSection.style.display = 'none'; // esconde a seção de jogo
        }
    };

    // Função para exibir posts
    const displayPosts = () => {
        postsList.innerHTML = '';
        const userPosts = posts.filter(post => post.userId === currentUser.id);
        userPosts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');
            postDiv.innerHTML = `
                <p>${post.content}</p>
                <div id="post-btns">
                <button onclick="editPost('${post.id}')"><i class="fa-regular fa-pen-to-square"></i></button>
                <button onclick="deletePost('${post.id}')"><i class="fa-solid fa-trash-can"></i></button>
                <div>
            `;
            postsList.appendChild(postDiv);
        });
    };

    // Função para registrar um usuário
    const registerUser = (fullname, username, email, password) => {
        const user = {
            id: Date.now().toString(),
            fullname,
            username,
            email,
            password,
            registrationDate: new Date().toISOString() // Adiciona a data de registro
        };
        users.push(user);
        currentUser = user;
        saveData();
        alert('Usuário cadastrado com sucesso!');
        registerForm.reset();
        showSection();
    };

    // Função para login do usuário
    const loginUser = (email, password) => {
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            currentUser = user;
            saveData();
            // Fechar o dropdown do perfil ao fazer logout
            profileDropdown.style.display = 'none';
            showSection();
        } else {
            alert('Credenciais inválidas');
        }
    };

    // Função para trocar para o formulário de cadastro
    const showRegisterForm = () => {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    };

    // Função para trocar para o formulário de login
    const showLoginForm = () => {
        loginContainer.style.display = 'block';
        registerContainer.style.display = 'none';
    };

    // Event listener para formulário de login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        loginUser(email, password);
    });

    // Event listener para formulário de registro
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullname = document.getElementById('register-fullname').value;
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        registerUser(fullname, username, email, password);
    });

    // Event listener para troca de formulário de login para cadastro
    linkToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    // Event listener para troca de formulário de cadastro para login
    linkToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    // Event listener para formulário de postagem
    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = document.getElementById('post-content').value;
        const post = {
            id: Date.now().toString(),
            userId: currentUser.id,
            content
        };
        posts.push(post);
        saveData();
        displayPosts();
        postForm.reset();
    });

    // Event listener para o link Excluir Conta
    deleteAccountLink.addEventListener('click', () => {
        // Confirmação com o usuário antes de excluir a conta
        const confirmDelete = confirm('Tem certeza de que deseja excluir sua conta? Esta ação é irreversível.');
        if (confirmDelete) {
            // Remove o usuário do localStorage
            users = users.filter(user => user.id !== currentUser.id);
            currentUser = null; // Define currentUser como null
            saveData(); // Salva as alterações no localStorage
            alert('Conta excluída com sucesso.');
            // Redireciona ou atualiza a interface conforme necessário
            showSection(); // Exibe a seção apropriada (por exemplo, a tela de autenticação)
        }
    });

    // Event listener para logout
    logoutButton.addEventListener('click', () => {
        currentUser = null;
        saveData();
        showSection();
    });

    // Event listener para o botão do dropdown de perfil
    profileDropdownButton.addEventListener('click', () => {
        if (profileDropdown.style.display === 'none' || profileDropdown.style.display === '') {
            profileDropdown.style.display = 'block';
        } else {
            profileDropdown.style.display = 'none';
        }
    });

    // Função para editar um post
    window.editPost = (postId) => {
        const post = posts.find(post => post.id === postId);
        const newContent = prompt('Edit Post', post.content);
        if (newContent !== null) {
            post.content = newContent;
            saveData();
            displayPosts();
        }
    };

    // Função para apagar um post
    window.deletePost = (postId) => {
        posts = posts.filter(post => post.id !== postId);
        saveData();
        displayPosts();
    };

    // Exibe a seção apropriada ao carregar a página
    showSection();
});

// img aleatoria

const UNSPLASH_ACCESS_KEY = 'nlGeOlG27NPrDTQ0U_Bko6d8lEBS0yWb2Z6gSGepZck';

const imgElement = document.getElementById('random-img');

function getRandomImage() {
    fetch(`https://api.unsplash.com/photos/random?query=green&client_id=${UNSPLASH_ACCESS_KEY}`)
        .then(response => response.json())
        .then(data => {
            imgElement.src = data.urls.regular;
        })
        .catch(error => console.error('Erro ao obter imagem:', error));
}

// Atualizar a imagem inicialmente
getRandomImage();