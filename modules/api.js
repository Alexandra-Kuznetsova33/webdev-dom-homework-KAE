import { formatDate } from "./formateDate.js";
const host = "https://wedev-api.sky.pro/api/v1/sandra-kuznetsova";

export const fetchComments = () => {
  return fetch(host + "/comments")
    .then((res) => {
      if (!res.ok) throw new Error("Ошибка загрузки");
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
      console.error("fetchComments error:", error);
      return [];
    });
};

export const postComment = (name, text) => {
  return fetch(host + "/comments", {
    method: "POST",
    body: JSON.stringify({ name, text }),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((errData) => {
        throw new Error(errData.error || `Ошибка ${res.status}`);
      });
    }
    return res.json();
  });
};
