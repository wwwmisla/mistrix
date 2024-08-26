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
        profileLink: document.getElementById('profile-link'),
        saluNameEp: document.getElementById('username-ep'),
        searchInput: document.getElementById('search-input'),
        searchButton: document.getElementById('search-button')
    };

    // Estado inicial do armazenamento local e de sessão
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Recupera as informações do perfil do usuário do localStorage
    const profileData = JSON.parse(localStorage.getItem('profileData'));

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

    // Função para calcular o signo
    function calcularSigno(dataNascimento) {
        const [dia, mes] = dataNascimento.split('/').map(Number);
        
        if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return 'Áries';
        if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return 'Touro';
        if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return 'Gêmeos';
        if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return 'Câncer';
        if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return 'Leão';
        if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return 'Virgem';
        if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return 'Libra';
        if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return 'Escorpião';
        if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return 'Sagitário';
        if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return 'Capricórnio';
        if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return 'Aquário';
        if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) return 'Peixes';

        return 'Signo não identificado';
    }

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
            
            // Atualiza os detalhes do usuário
            if (profileData) {
                const sexo = profileData.sexo;
                const relacionamento = profileData.relacionamento;
                const aniversario = profileData.aniversario;
                const moraEm = `${profileData.moroEm} - ${profileData.pais}`;
                const signo = calcularSigno(aniversario);

                const details = `
                    ${sexo === 'Masculino' ? '👨' : sexo === 'Feminino' ? '👩' : '🌈'} ${sexo}, ${relacionamento === 'Solteiro(a)' ? '🧑‍🎤' : relacionamento === 'Casado(a)' ? '💍' : relacionamento === 'Namorando' ? '❤️' : relacionamento === 'Viúvo(a)' ? '😢' : '😅'} ${relacionamento}, ${signo} ${signo === 'Áries' ? '♈' : signo === 'Touro' ? '♉' : signo === 'Gêmeos' ? '♊' : signo === 'Câncer' ? '♋' : signo === 'Leão' ? '♌' : signo === 'Virgem' ? '♍' : signo === 'Libra' ? '♎' : signo === 'Escorpião' ? '♏' : signo === 'Sagitário' ? '♐' : signo === 'Capricórnio' ? '♑' : signo === 'Aquário' ? '♒' : '♓'}, 📍 ${moraEm}`;

                elements.userDetails.textContent = details;
            } else {
                elements.userDetails.textContent = 'Informações do usuário não encontradas.';
            }

            elements.profilePictureInfo.src = './assets/img/avatar-profile-max.svg';

            elements.saluNameEp.textContent = currentUser.username;

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

    // Editar perfil
    document.getElementById('edit-profile-btn').addEventListener('click', function () {
        const btn = this;
        const isEditing = btn.textContent === 'Salvar';
        const cancelBtn = document.getElementById('cancel-profile-btn');
    
        const spansToEdit = {
            relacionamento: {
                span: document.getElementById('relationship'),
                input:
                    `<select>
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Namorando">Namorando</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                    <option value="Outro">Outro</option>
                </select>`
            },
            aniversario: {
                span: document.getElementById('birthday'),
                input: '<input type="date">'
            },
            idade: {
                span: document.getElementById('age'),
                input: '<input type="number" disabled>'
            },
            quemSouEu: {
                span: document.getElementById('about-me'),
                input: '<input type="text">'
            },
            sexo: {
                span: document.getElementById('gender'),
                input:
                    `<select id="gender-select">
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                </select>`
            },
            moroEm: {
                span: document.getElementById('residence'),
                input: '<input type="text">'
            },
            pais: {
                span: document.getElementById('country'),
                input: '<input type="text">'
            },
            cidadeNatal: {
                span: document.getElementById('hometown'),
                input: '<input type="text">'
            },
        };
    
        if (!isEditing) {
            // Iniciar edição
            for (const key in spansToEdit) {
                const { span, input } = spansToEdit[key];
                const currentValue = span.textContent;
    
                span.innerHTML = input;
    
                const inputElement = span.querySelector('input, select, textarea');
    
                // Ajuste específico para o campo de data
                if (key === 'aniversario') {
                    const [day, month, year] = currentValue.split('/');
                    const formattedDate = `${year}-${month}-${day}`;
                    inputElement.value = formattedDate;
                } else {
                    inputElement.value = currentValue;
                }
            }
    
            btn.textContent = 'Salvar';
            cancelBtn.style.display = 'inline-block'; // Mostrar o botão "Cancelar"
    
            cancelBtn.addEventListener('click', function cancelEdit() {
                for (const key in spansToEdit) {
                    const { span } = spansToEdit[key];
                    const inputElement = span.querySelector('input, select, textarea');
                    span.textContent = inputElement.value;
                }
    
                const savedProfileData = JSON.parse(localStorage.getItem('profileData'));
                if (savedProfileData) {
                    document.getElementById('relationship').textContent = savedProfileData.relacionamento;
                    document.getElementById('birthday').textContent = savedProfileData.aniversario;
                    document.getElementById('age').textContent = savedProfileData.idade;
                    document.getElementById('about-me').textContent = savedProfileData.quemSouEu;
                    document.getElementById('gender').textContent = savedProfileData.sexo;
                    document.getElementById('residence').textContent = savedProfileData.moroEm;
                    document.getElementById('country').textContent = savedProfileData.pais;
                    document.getElementById('hometown').textContent = savedProfileData.cidadeNatal;
                }
    
                btn.textContent = 'Editar meu perfil';
                cancelBtn.style.display = 'none'; // Esconder o botão "Cancelar"
                cancelBtn.removeEventListener('click', cancelEdit); // Remover o evento de cancelamento
            });
    
        } else {
            // Salvar as edições
            const genderSelect = document.getElementById('gender-select');
            const selectedGender = genderSelect ? genderSelect.value : '';
    
            const relationshipSelect = spansToEdit.relacionamento.span.querySelector('select');
            let relationshipValue = relationshipSelect ? relationshipSelect.value : '';
    
            if (selectedGender === 'Masculino' && relationshipValue.endsWith('(a)')) {
                relationshipValue = relationshipValue.slice(0, -4) + 'o';
            } else if (selectedGender === 'Feminino' && relationshipValue.endsWith('(a)')) {
                relationshipValue = relationshipValue.slice(0, -4) + 'a';
            }
    
            const birthdayInput = spansToEdit.aniversario.span.querySelector('input[type="date"]');
            const birthDate = new Date(birthdayInput.value);
            const day = String(birthDate.getUTCDate()).padStart(2, '0');
            const month = String(birthDate.getUTCMonth() + 1).padStart(2, '0');
            const year = birthDate.getUTCFullYear();
            const formattedDate = `${day}/${month}/${year}`;
    
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
    
            spansToEdit.relacionamento.span.textContent = relationshipValue;
            spansToEdit.aniversario.span.textContent = formattedDate;
            spansToEdit.idade.span.textContent = age;
    
            for (const key in spansToEdit) {
                if (key !== 'relacionamento' && key !== 'aniversario' && key !== 'idade') {
                    const { span } = spansToEdit[key];
                    const input = span.querySelector('input, select, textarea');
                    span.textContent = input.value;
                }
            }
    
            const profileData = {
                relacionamento: relationshipValue,
                aniversario: formattedDate,
                idade: age,
                quemSouEu: spansToEdit.quemSouEu.span.textContent,
                sexo: selectedGender,
                moroEm: spansToEdit.moroEm.span.textContent,
                pais: spansToEdit.pais.span.textContent,
                cidadeNatal: spansToEdit.cidadeNatal.span.textContent,
            };
            localStorage.setItem('profileData', JSON.stringify(profileData));
    
            btn.textContent = 'Editar meu perfil';
            cancelBtn.style.display = 'none'; // Esconder o botão "Cancelar"
        }
    });
    
    // Atualizar a imagem inicialmente
    getRandomImage();

    // Exibe a seção apropriada ao carregar a página
    showSection();

    // Funções globais para edição e exclusão de posts
    window.editPost = editPost;
    window.deletePost = deletePost;

    // Carregar dados do perfil ao carregar a página
    window.addEventListener('DOMContentLoaded', () => {
        const savedProfileData = JSON.parse(localStorage.getItem('profileData'));
        if (savedProfileData) {
            document.getElementById('relationship').textContent = savedProfileData.relacionamento;
            document.getElementById('birthday').textContent = savedProfileData.aniversario;
            document.getElementById('age').textContent = savedProfileData.idade;
            document.getElementById('about-me').textContent = savedProfileData.quemSouEu;
            document.getElementById('gender').textContent = savedProfileData.sexo;
            document.getElementById('residence').textContent = savedProfileData.moroEm;
            document.getElementById('country').textContent = savedProfileData.pais;
            document.getElementById('hometown').textContent = savedProfileData.cidadeNatal;
        }
    });

});