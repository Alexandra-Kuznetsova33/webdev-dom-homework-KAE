import { login, register } from "./api.js";

const saveUser = (user) => {
  localStorage.setItem(
    "user",
    JSON.stringify({
      name: user.name,
      login: user.login,
      token: user.token,
    }),
  );
};

export const loadUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const renderAuthPage = (container, onSuccess) => {
  container.innerHTML = "";

  const authDiv = document.createElement("div");
  authDiv.className = "auth-form";

  authDiv.innerHTML = `
    <h2>Вход</h2>
    <input type="text" class="auth-login" placeholder="Логин" />
    <input type="password" class="auth-password" placeholder="Пароль" />
    <div class="auth-buttons">
      <button class="auth-login-btn">Войти</button>
      <button class="auth-register-btn" style="display:none;">Зарегистрироваться</button>
    </div>
    <p class="auth-toggle"><span class="auth-toggle-text">Нет аккаунта?</span>&ensp;<a href="#" class="auth-switch">Зарегистрироваться</a></p>
    <div class="auth-error" style="color:red; display:none;"></div>
  `;

  const nameField = document.createElement("input");
  nameField.type = "text";
  nameField.className = "auth-name";
  nameField.placeholder = "Имя";
  nameField.style.display = "none";
  authDiv.insertBefore(nameField, authDiv.querySelector(".auth-buttons"));

  container.appendChild(authDiv);

  const loginInput = authDiv.querySelector(".auth-login");
  const passwordInput = authDiv.querySelector(".auth-password");
  const loginBtn = authDiv.querySelector(".auth-login-btn");
  const registerBtn = authDiv.querySelector(".auth-register-btn");
  const switchLink = authDiv.querySelector(".auth-switch");
  const errorDiv = authDiv.querySelector(".auth-error");
  const header = authDiv.querySelector('h2');
  const toggleText = authDiv.querySelector('.auth-toggle-text');

  let mode = "login";

  const toggleMode = () => {
    if (mode === "login") {
      mode = "register";
      loginBtn.style.display = "none";
      registerBtn.style.display = "block";
      nameField.style.display = "block";
      toggleText.textContent = 'Есть аккаунт?';
      switchLink.textContent = "Войти";
      header.textContent = 'Регистрация';
    } else {
      mode = "login";
      loginBtn.style.display = "block";
      registerBtn.style.display = "none";
      nameField.style.display = "none";
      toggleText.textContent = 'Нет аккаунта?';
      switchLink.textContent = "Зарегистрироваться";
      header.textContent = 'Вход'; 
    }
    errorDiv.style.display = "none";
  };

  switchLink.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMode();
  });

  const handleSubmit = async () => {
    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();
    if (!login || !password) {
      errorDiv.textContent = "Заполните логин и пароль";
      errorDiv.style.display = "block";
      return;
    }

    try {
      let userData;
      if (mode === "login") {
        const res = await login(login, password);
        userData = res.user;
      } else {
        const name = nameField.value.trim();
        if (!name) {
          errorDiv.textContent = "Введите имя";
          errorDiv.style.display = "block";
          return;
        }
        const res = await register(login, name, password);
        userData = res.user;
      }

      saveUser(userData);
      onSuccess(userData);
    } catch (error) {
      errorDiv.textContent = error.message || "Ошибка";
      errorDiv.style.display = "block";
    }
  };

  loginBtn.addEventListener("click", handleSubmit);
  registerBtn.addEventListener("click", handleSubmit);
};
