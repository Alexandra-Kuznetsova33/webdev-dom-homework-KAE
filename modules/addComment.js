import { postComment, fetchComments } from './api.js';
import { commentsData, updateComments } from './comments.js';
import { renderComments } from './renderComments.js';

export const addCommentAndRender = async (name, text) => {
  const commentsList = document.querySelector(".comments");
  if (!commentsList) return;

  try {
    await postComment(name, text);

    const freshComments = await fetchComments();

    updateComments(freshComments);

    renderComments(commentsData, commentsList);
  } catch (error) {
    console.error("Ошибка добавления:", error);
    alert(`Не удалось добавить комментарий: ${error.message}`);
  }
};
