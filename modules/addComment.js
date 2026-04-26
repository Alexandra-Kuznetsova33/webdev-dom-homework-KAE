import { postComment, fetchComments, getErrorMessage } from "./api.js";
import { commentsData, updateComments } from "./comments.js";
import { renderComments } from "./renderComments.js";

export const addCommentAndRender = async (text, attempt = 1) => {
  const commentsList = document.querySelector(".comments");
  const addForm = document.querySelector(".add-form");
  const addingMessage = document.querySelector(".adding-message");

  if (!commentsList || !addForm || !addingMessage) return;

  addForm.style.display = "none";
  addingMessage.style.display = "flex";

  if (attempt === 1) {
    addingMessage.textContent = "Комментарий добавляется...";
  }

  try {
    await postComment(text);

    const freshComments = await fetchComments();

    updateComments(freshComments);

    renderComments(commentsData, commentsList);
    return true;
  } catch (error) {
    console.error("Ошибка добавления:", error);
    const message = getErrorMessage(error);
    alert(message);

    if (error.status === 500 && attempt === 1) {
      addingMessage.textContent = "Повторная попытка...";
      const result = await addCommentAndRender(text, attempt + 1);
      if (result) {
        addForm.style.display = "flex";
        addingMessage.style.display = "none";
      }
      return result;
    }

    return false;
  } finally {
    if (attempt === 1 || (attempt === 2 && !(error && error.status === 500))) {
      addForm.style.display = "flex";
      addingMessage.style.display = "none";
      addingMessage.textContent = "Комментарий добавляется..."; 
    }
  }
};
