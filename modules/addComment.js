import { postComment, fetchComments } from "./api.js";
import { commentsData, updateComments } from "./comments.js";
import { renderComments } from "./renderComments.js";

export const addCommentAndRender = async (name, text) => {
  const commentsList = document.querySelector(".comments");
  const addForm = document.querySelector(".add-form");
  const addingMessage = document.querySelector(".adding-message");
  if (!commentsList || !addForm || !addingMessage) return;
  addForm.style.display = "none";
  addingMessage.style.display = "flex";

  try {
    await postComment(name, text);

    const freshComments = await fetchComments();

    updateComments(freshComments);

    renderComments(commentsData, commentsList);
  } catch (error) {
    console.error("Ошибка добавления:", error);
    alert(`Не удалось добавить комментарий: ${error.message}`);
  } finally {
    addForm.style.display = "flex";
    addingMessage.style.display = "none";
  }
};
