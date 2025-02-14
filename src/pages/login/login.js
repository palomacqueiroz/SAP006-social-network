import {
  loginWithRegister,
  loginWithGoogle,
  keepLogged,
  newRegister,
} from '../../services/index.js';
import { navigateTo } from '../../navegation.js';
import { error } from '../../services/error.js';

export const loginMainScreen = () => {
  const main = document.getElementById('root');
  main.innerHTML = '';
  const loginPage = document.createElement('section');
  loginPage.setAttribute('class', 'background');
  loginPage.innerHTML = `
    <header>  
      <img class="logo-img" src="img/gif-logo.gif" alt="logo">  
    </header>
    <main class="container-main">
      <input class="input" type="checkbox" id="chk" aria-hidden="true">
        <section class="signup">
          <form>
            <label class="label" for="chk" aria-hidden="true">Cadastro</label>
            <fieldset class="form-login">
              <input class="input" type="email" id="email" placeholder="Email" required="">
              <div class="icons-input">
                <i class="far fa-envelope icons"></i>
              </div>
              </fieldset>
            <p id="error-email"></p>

            <fieldset class="form-login">
              <input class="input" type="password" id="password" placeholder="Password" required="">
              <div class="icons-input">
                <i id="show" class="fas fa-lock icons"></i>
                <i id="hide" class="fas fa-lock-open icons"></i>
              </div>
            </fieldset>
            <p id="error-pass">Insira no mínimo 6 caracteres</p>

            <fieldset class="form-login">
              <input class="input" type="password" id="repeat-password" placeholder="Repeat Password" required="">
              <div class="icons-input">
                <i id="show-again" class="fas fa-lock icons"></i>
                <i id="hide-again" class="fas fa-lock-open icons"></i>
              </div>
            </fieldset>
            <p class="error-hide" id="error-repeat">A senha deve ser igual ao campo anterior</p>

            <button class="btn" id="btn-register"><i class="fas fa-ticket-alt"> Cadastrar</i></button>
          </form>
        </section>

        <section class="login">
          <label class="label" for="chk" aria-hidden="true">Login</label>
          <form>
            <fieldset class="form-login">
              <input class="input" type="email" id="email-login" placeholder="Email" required="">
              <div class="icons-input">
                <i class="far fa-envelope icons"></i>
              </div>
            </fieldset>

            <fieldset class="form-login">
              <input class="input" type="Password" id="password-login" placeholder="Password" required="">
              <div class="icons-input">
                <i id="show-login" class="fas fa-lock icons"></i>
                <i id="hide-login" class="fas fa-lock-open icons"></i>
              </div>
            </fieldset>
            <p id="error-login"></p>
                          
            <div class="checkbox-container">
              <input class="input checkbox" id="checkbox" type="checkbox" name="remember">
              <label class="label checkbox-phrase" for="remember">Manter conectado(a)</label>
              <span class="checkbox-phrase"><a class="pass-animation" id="recover" href="#">Esqueceu a senha?</a></span>
            </div>

            <button class="btn" id="btn-login"><i class="far fa-play-circle"></i></button>
            <div>
              <img src="img/icone-google.png" class="btn-google" id="google" type="button">
            </div>
            <p class="phrase">Entrar com o Google</p>
          </form>
        </section>
      </main> 
  `;

  const email = loginPage.querySelector('#email');
  const emailLogin = loginPage.querySelector('#email-login');
  const password = loginPage.querySelector('#password');
  const passwordLogin = loginPage.querySelector('#password-login');
  const btnLogin = loginPage.querySelector('#btn-login');
  const btnLoginWithGoogle = loginPage.querySelector('#google');
  const btnRegister = loginPage.querySelector('#btn-register');
  const keepMeSignedIn = loginPage.querySelector('#checkbox');
  const showRegister = loginPage.querySelector('#show');
  const hideRegister = loginPage.querySelector('#hide');
  const showLogin = loginPage.querySelector('#show-login');
  const hideLogin = loginPage.querySelector('#hide-login');
  const showAgain = loginPage.querySelector('#show-again');
  const hideAgain = loginPage.querySelector('#hide-again');
  const repeatPassword = loginPage.querySelector('#repeat-password');
  const btnRecoverPass = loginPage.querySelector('#recover');
  const errorLogin = loginPage.querySelector('#error-login');
  const errorEmail = loginPage.querySelector('#error-email');
  const errorPass = loginPage.querySelector('#error-pass');
  const errorRepeat = loginPage.querySelector('#error-repeat');

  // BOTÃO DE LOGIN
  btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginWithRegister(emailLogin.value, passwordLogin.value).then(() => navigateTo('/feed'))
      .catch((erro) => {
        const errorCode = erro.code;
        switch (errorCode) {
          case 'auth/wrong-password':
            error('Senha inválida');
            break;
          case 'auth/invalid-email':
            error('Email inválido');
            break;
          case 'auth/user-not-found':
            error('usuário não encontrado');
            break;
          default:
            error('Por favor insira uma conta existente ou cadastre-se');
        }
      });
  });

  // BOTÃO DE LOGIN COM O GOOGLE
  btnLoginWithGoogle.addEventListener('click', (e) => {
    e.preventDefault();
    loginWithGoogle().then(() => navigateTo('/feed'));
  });

  // LINK ESQUECEU A SENHA
  btnRecoverPass.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('/recuperar');
  });

  // CHECKBOX DE MANTER CONECTADO
  keepMeSignedIn.addEventListener('change', () => {
    const local = firebase.auth.Auth.Persistence.LOCAL;
    const none = firebase.auth.Auth.Persistence.NONE;
    if (keepMeSignedIn.checked === true && loginWithGoogle) {
      keepLogged(local);
    } else if (keepMeSignedIn.checked === true && loginWithRegister) {
      keepLogged(local);
    }
    keepLogged(none);
  });

  // FUNÇÃO PARA CONFIRMAR SENHAS
  /* const checkPassword = () => {
    const pswd = password.value;
    const pswdRepeat = repeatPassword.value;
    console.log(pswd, pswdRepeat);
    console.log(message);

    if (pswd.length !== 0) {
      if (pswd === pswdRepeat) {
        errorRepeat.innerHTML = 'Senhas corretas';
      } else {
        errorRepeat.innerHTML = 'A senha deve ser igual ao campo anterior';
      }
    }
  };

  checkPassword(); */

  // BOTÃO DE CADASTRAR
  btnRegister.addEventListener('click', (e) => {
    e.preventDefault();
    const emailInput = email.value;
    const pswd = password.value;
    const pswdRepeat = repeatPassword.value;
    newRegister(emailInput, pswd, pswdRepeat)
      .then(() => navigateTo('/profile'))
      .catch((erro) => {
        const errorCode = erro.code;
        switch (errorCode) {
          case 'auth/email-already-in-use':
            error('Email em uso');
            break;
          case 'auth/invalid-email':
            error('Email inválido');
            break;
          case 'auth/weak-password':
            error('Senha fraca');
            break;
          default:
            error('Por favor, verifique as informações digitadas');
        }
      });
  });

  // MOSTRAR E OCULTAR A SENHA CADASTRO
  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    password.setAttribute('type', 'text');
    showRegister.style.display = 'none';
    hideRegister.style.display = 'block';
  });

  hideRegister.addEventListener('click', (e) => {
    e.preventDefault();
    password.setAttribute('type', 'password');
    hideRegister.style.display = 'none';
    showRegister.style.display = 'block';
  });

  // MOSTRAR E OCULTAR DE REPETIR A SENHA CADASTRO
  showAgain.addEventListener('click', (e) => {
    e.preventDefault();
    repeatPassword.setAttribute('type', 'text');
    showAgain.style.display = 'none';
    hideAgain.style.display = 'block';
  });

  hideAgain.addEventListener('click', (e) => {
    e.preventDefault();
    repeatPassword.setAttribute('type', 'password');
    hideAgain.style.display = 'none';
    showAgain.style.display = 'block';
  });

  // MOSTRAR E OCULTAR DE REPETIR A SENHA CADASTRO
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    passwordLogin.setAttribute('type', 'text');
    showLogin.style.display = 'none';
    hideLogin.style.display = 'block';
  });

  hideLogin.addEventListener('click', (e) => {
    e.preventDefault();
    passwordLogin.setAttribute('type', 'password');
    hideLogin.style.display = 'none';
    showLogin.style.display = 'block';
  });

  // Validação email LOGIN
  emailLogin.addEventListener('keyup', () => {
    if (emailLogin.value.indexOf('@') === -1) {
      emailLogin.setAttribute('style', 'color: red');
    } else {
      emailLogin.setAttribute('style', 'color: green');
    }
  });

  // Validação de senha LOGIN
  passwordLogin.addEventListener('keyup', () => {
    if (passwordLogin.value.length < 6) {
      passwordLogin.setAttribute('style', 'color: red');
      errorLogin.style.display = 'block';
    } else {
      passwordLogin.setAttribute('style', 'color: green');
      errorLogin.style.display = 'none';
    }
  });

  // Validação de email CADASTRO
  email.addEventListener('keyup', () => {
    if (email.value.indexOf('@') === -1) {
      email.setAttribute('style', 'color: red');
      errorEmail.style.display = 'block';
    } else {
      email.setAttribute('style', 'color: green');
      errorEmail.style.display = 'none';
    }
  });

  // Validação de senha CADASTRO
  password.addEventListener('keyup', () => {
    if (password.value.length < 6) {
      password.setAttribute('style', 'color: red');
      errorPass.style.display = 'block';
    } else {
      password.setAttribute('style', 'color: green');
      errorPass.style.display = 'none';
    }
  });

  // Validação de mensagens igual na senha CADASTRO
  repeatPassword.addEventListener('keyup', () => {
    if (password.value !== repeatPassword.value) {
      repeatPassword.setAttribute('style', 'color: red');
      errorRepeat.style.display = 'block';
    } else {
      repeatPassword.setAttribute('style', 'color: green');
      errorRepeat.style.display = 'none';
    }
  });

  return main.appendChild(loginPage);
};
