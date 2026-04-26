import { formatDate } from "./formateDate.js";
const host = "https://wedev-api.sky.pro/api/v1/sandra-kuznetsova";

export const fetchComments = () => {
  return fetch(host + "/comments")
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

export const postComment = (name, text) => {

  return fetch(host + "/comments", {
    method: "POST",
    body: JSON.stringify({ 
      name, 
      text, 
      forceError: true,
    }),
    
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

export const getErrorMessage = (error) => {
  if (error.isNetworkError) {
    return 'Кажется, у вас сломался интернет, попробуйте позже';
  }
  if (error.status === 500) {
    return 'Сервер сломался, попробуй позже';
  }
  if (error.status === 400) {
    return error.message;
  }
  return 'Что-то пошло не так, попробуйте позже';
};
