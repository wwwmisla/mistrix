document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos do DOM
    const elements = {
        auth: document.getElementById('auth'),
        header: document.getElementById('header'),
        main: document.getElementById('main'),
        infoSection: document.getElementById('info-section'),
        authSection: document.getElementById('auth-section'),
        postsSection: document.getElementById('posts-section'),
        gameSection: document.getElementById('game-section'),
        profileSection: document.getElementById('edit-profile-section'),
        ilusSection: document.getElementById('ilus-section'),
        loginContainer: document.getElementById('login-container'),
        registerContainer: document.getElementById('register-container'),
        loginForm: document.getElementById('login-form'),
        registerForm: document.getElementById('register-form'),
        linkToRegister: document.getElementById('link-to-register'),
        linkToLogin: document.getElementById('link-to-login'),
        profileNameHeader: document.getElementById('profile-name'),
        saluName: document.getElementById('salu-username'),
        postForm: document.getElementById('post-form'),
        postsList: document.getElementById('posts-list'),
        logoutButton: document.getElementById('logout'),
        profileDropdownButton: document.getElementById('profile-dropdown-button'),
        profileDropdown: document.getElementById('profile-dropdown'),
        deleteAccountLink: document.getElementById('delete-account'),
        fullnameInfo: document.getElementById('fullname-info'),
        usernameInfo: document.getElementById('username-info'),
        userTime: document.getElementById('user-time'),
        userDetails: document.getElementById('user-details'),
        profilePictureInfo: document.getElementById('profile-picture-info'),
        imgElement: document.getElementById('random-img'),
        homeLink: document.getElementById('home-link'),
        gameLink: document.getElementById('game-link'),
        profileLink: document.getElementById('profile-link') // Adicionei essa linha
    };

    // Estado inicial do armazenamento local e de sessão
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Funções auxiliares
    const saveData = () => {
        localStorage.setItem('users', JSON.stringify(users));
        if (currentUser) {
            if (document.getElementById('remember-me').checked) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        } else {
            localStorage.removeItem('currentUser');
        }
        localStorage.setItem('posts', JSON.stringify(posts));
    };

    const getTimeSinceRegistration = (registrationDate) => {
        const now = new Date();
        const registeredDate = new Date(registrationDate);
        const timeDiff = now - registeredDate;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        return `${days} dias atrás`;
    };

    const getGreeting = () => {
        const now = new Date();
        const hours = now.getHours();

        if (hours >= 6 && hours < 12) {
            return 'Bom dia';
        } else if (hours >= 12 && hours < 18) {
            return 'Boa tarde';
        } else {
            return 'Boa noite';
        }
    };

    const showSection = () => {
        if (currentUser) {
            elements.auth.style.display = 'none';
            elements.authSection.style.display = 'none';
            elements.header.style.display = 'flex';
            elements.main.style.display = 'grid';
            elements.infoSection.style.display = 'flex';
            elements.postsSection.style.display = 'flex';
            elements.gameSection.style.display = 'none'; // Atualizado
            elements.profileSection.style.display = 'none'; // Adicionado
            elements.ilusSection.style.display = 'flex';

            elements.profileNameHeader.textContent = currentUser.username;
            elements.saluName.textContent = `${getGreeting()}, ${currentUser.username}`;

            const nameParts = currentUser.fullname.split(' ').slice(0, 2).join(' ');
            elements.fullnameInfo.textContent = nameParts;
            elements.usernameInfo.textContent = `@${currentUser.username}`;
            elements.userTime.textContent = getTimeSinceRegistration(currentUser.registrationDate);
            elements.userDetails.textContent = 'Detalhes do usuário';
            elements.profilePictureInfo.src = './assets/img/avatar-profile-max.svg';

            displayPosts();
        } else {
            elements.auth.style.display = 'flex';
            elements.authSection.style.display = 'flex';
            elements.header.style.display = 'none';
            elements.main.style.display = 'none';
            elements.infoSection.style.display = 'none';
            elements.postsSection.style.display = 'none';
            elements.gameSection.style.display = 'none';
            elements.profileSection.style.display = 'none'; // Adicionado
            elements.ilusSection.style.display = 'none';

            // Preencher campos com dados salvos, se existirem
            const savedEmail = localStorage.getItem('savedEmail');
            const savedPassword = localStorage.getItem('savedPassword');
            const rememberMeCheckbox = document.getElementById('remember-me');

            if (savedEmail && savedPassword) {
                document.getElementById('login-email').value = savedEmail;
                document.getElementById('login-password').value = savedPassword;
                rememberMeCheckbox.checked = true;
            } else {
                document.getElementById('login-email').value = '';
                document.getElementById('login-password').value = '';
                rememberMeCheckbox.checked = false;
            }
        }
    };

    const displayPosts = () => {
        elements.postsList.innerHTML = '';
        posts.filter(post => post.userId === currentUser.id).forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');

            // Adiciona o título do post
            const titleElement = document.createElement('h2');
            titleElement.textContent = post.title;

            // Adiciona o conteúdo do post
            const contentElement = document.createElement('div');
            contentElement.innerHTML = post.content;

            // Adiciona os botões de ação
            const btnsDiv = document.createElement('div');
            btnsDiv.classList.add('post-btns');
            btnsDiv.innerHTML = `
                <button onclick="editPost('${post.id}')"><i class="fa-regular fa-pen-to-square"></i></button>
                <button onclick="deletePost('${post.id}')"><i class="fa-solid fa-trash-can"></i></button>
            `;

            // Adiciona os elementos ao postDiv
            postDiv.appendChild(titleElement);
            postDiv.appendChild(contentElement);
            postDiv.appendChild(btnsDiv);

            // Adiciona o postDiv à lista de posts
            elements.postsList.appendChild(postDiv);
        });
    };


    const registerUser = (fullname, username, email, password) => {
        const user = {
            id: Date.now().toString(),
            fullname,
            username,
            email,
            password,
            registrationDate: new Date().toISOString()
        };
        users.push(user);
        currentUser = user;
        saveData();
        alert('Usuário cadastrado com sucesso!');
        elements.registerForm.reset();
        showSection();
    };

    const loginUser = (email, password) => {
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            currentUser = user;
            saveData();
            elements.profileDropdown.style.display = 'none';
            showSection();
        } else {
            alert('Credenciais inválidas');
        }
    };

    const showRegisterForm = () => {
        elements.loginContainer.style.display = 'none';
        elements.registerContainer.style.display = 'block';
    };

    const showLoginForm = () => {
        elements.loginContainer.style.display = 'block';
        elements.registerContainer.style.display = 'none';
    };

    const editPost = (postId) => {
        const post = posts.find(post => post.id === postId);
        if (post) {
            const newContent = prompt('Edit Post', post.content);
            if (newContent !== null) {
                post.content = newContent;
                saveData();
                displayPosts();
            }
        }
    };

    const deletePost = (postId) => {
        posts = posts.filter(post => post.id !== postId);
        saveData();
        displayPosts();
    };

    const savePage = (content) => {
        if (!content.trim()) {
            alert('O conteúdo não pode estar vazio.');
            return;
        }

        const date = new Date();
        const formattedTitle = `${date.toLocaleDateString()} | ${date.toLocaleTimeString()}`;
        const post = {
            id: Date.now().toString(),
            userId: currentUser.id,
            title: formattedTitle,
            content: `<p>${content}</p>`
        };

        posts.push(post);
        saveData();
        displayPosts();
        alert('Página salva com sucesso!');
        elements.postForm.reset();
    };

    const getRandomImage = () => {
        const UNSPLASH_ACCESS_KEY = 'nlGeOlG27NPrDTQ0U_Bko6d8lEBS0yWb2Z6gSGepZck';
        const randomEndpoint = `https://api.unsplash.com/photos/random?query=green&client_id=${UNSPLASH_ACCESS_KEY}`;

        fetch(randomEndpoint)
            .then(response => response.json())
            .then(data => {
                elements.imgElement.src = data.urls.regular;
                elements.imgElement.alt = data.alt_description || 'Imagem aleatória';
            })
            .catch(error => {
                console.error('Erro ao buscar imagem aleatória:', error);
            });
    };

    // Adiciona eventos para links do header
    const updateActiveLink = (activeLink) => {
        const links = document.getElementsByClassName('nav_item');
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            if (link.firstElementChild === activeLink) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    };


    // Event listeners
    elements.linkToRegister.addEventListener('click', (event) => {
        event.preventDefault();
        showRegisterForm();
    });

    elements.linkToLogin.addEventListener('click', (event) => {
        event.preventDefault();
        showLoginForm();
    });

    elements.registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const fullname = document.getElementById('register-fullname').value;
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        registerUser(fullname, username, email, password);
    });

    elements.loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        loginUser(email, password);
    });

    elements.postForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const content = document.getElementById('post-content').value;
        savePage(content);
    });

    elements.logoutButton.addEventListener('click', () => {
        currentUser = null;
        saveData();
        showSection();
    });

    elements.profileDropdownButton.addEventListener('click', () => {
        elements.profileDropdown.style.display = elements.profileDropdown.style.display === 'block' ? 'none' : 'block';
    });

    elements.deleteAccountLink.addEventListener('click', () => {
        if (confirm('Você tem certeza de que deseja deletar sua conta?')) {
            users = users.filter(user => user.id !== currentUser.id);
            currentUser = null;
            saveData();
            showSection();
        }
    });

    elements.homeLink.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentUser) {
            showSection();
            updateActiveLink(elements.homeLink);
        } else {
            alert('Por favor, faça login para acessar o jogo.');
        }
    });

    elements.gameLink.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentUser) {
            elements.infoSection.style.display = 'flex';
            elements.postsSection.style.display = 'none';
            elements.gameSection.style.display = 'flex';
            elements.profileSection.style.display = 'none'; // Adicionado
            elements.ilusSection.style.display = 'flex';
            updateActiveLink(elements.gameLink);
        } else {
            alert('Por favor, faça login para acessar o jogo.');
        }
    });

    elements.profileLink.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentUser) {
            elements.infoSection.style.display = 'flex';
            elements.postsSection.style.display = 'none';
            elements.gameSection.style.display = 'none'; // Atualizado
            elements.profileSection.style.display = 'flex'; // Adicionado
            elements.ilusSection.style.display = 'flex';
            updateActiveLink(elements.profileLink);
        } else {
            alert('Por favor, faça login para acessar o perfil.');
        }
    });

    // Atualizar a imagem inicialmente
    getRandomImage();

    // Exibe a seção apropriada ao carregar a página
    showSection();

    // Funções globais para edição e exclusão de posts
    window.editPost = editPost;
    window.deletePost = deletePost;
});
