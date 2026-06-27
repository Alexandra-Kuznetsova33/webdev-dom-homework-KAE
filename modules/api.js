import { formatDate } from "./formateDate.js";
const host = "https://wedev-api.sky.pro/api/v2/alex-kuznetsova";
const userApiHost = "https://wedev-api.sky.pro/api/user";

let currentToken = null;

export const setToken = (token) => {
  currentToken = token;
};

export const getToken = () => currentToken;

export const fetchComments = () => {
  const headers = {};
  if (currentToken) {
    headers["Authorization"] = `Bearer ${currentToken}`;
  }
  return fetch(`${host}/comments`, { headers })
    .then((res) => {
      if (!res.ok) {
        const error = new Error(`Ошибка ${res.status}`);
        error.status = res.status;
        throw error;
      }
      return res.json();
    })

    .then((responseData) => {
      const commentsArray = responseData.comments;
      return commentsArray.map((comment) => ({
        id: comment.id,
        name: comment.author.name,
        date: formatDate(new Date(comment.date)),
        text: comment.text,
        likes: comment.likes,
        isLiked: false,
      }));
    })
    .catch((error) => {
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        error.isNetworkError = true;
      }
      throw error;
    });
};

export const postComment = (text) => {
  if (!currentToken) throw new Error("Нет токена");

  return fetch(host + "/comments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
    body: JSON.stringify({ text }),
  }).then((res) => {
    if (!res.ok) {
      return res
        .json()
        .then((errData) => {
          const error = new Error(errData.error || `Ошибка ${res.status}`);
          error.status = res.status;
          error.body = errData;
          throw error;
        })
        .catch(() => {
          const error = new Error(`Ошибка ${res.status}`);
          error.status = res.status;
          throw error;
        });
    }
    return res.json();
  });
};

export const login = (login, password) => {
  return fetch(`${userApiHost}/login`, {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          const error = new Error(err.error || `Ошибка ${res.status}`);
          error.status = res.status;
          throw error;
        });
      }
      return res.json();
    });
};

export const register = (login, name, password) => {
  return fetch(userApiHost, {
    method: 'POST',
    body: JSON.stringify({ login, name, password }),
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          const error = new Error(err.error || `Ошибка ${res.status}`);
          error.status = res.status;
          throw error;
        });
      }
      return res.json();
    });
};

export const getErrorMessage = (error) => {
  if (error.isNetworkError) {
    return "Кажется, у вас сломался интернет, попробуйте позже";
  }
  if (error.status === 500) {
    return "Сервер сломался, попробуй позже";
  }
  if (error.status === 400) {
    return error.message;
  }
  return "Что-то пошло не так, попробуйте позже";
};
