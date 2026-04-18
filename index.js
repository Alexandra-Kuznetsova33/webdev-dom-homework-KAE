import { renderComments } from "./modules/renderComments.js";
import {
  initLikeListeners,
  initReplyListeners,
  initAddCommentListener,
} from "/modules/initListeners.js";
import { commentsData } from "./modules/comments.js";
import { fetchComments } from "./modules/api.js";
import { updateComments } from "./modules/comments.js";

async function loadComments() {
  const commentsList = document.querySelector(".comments");
  const loadingMessage = document.querySelector(".loading-message");

  if (!commentsList || !loadingMessage) return;


  try {
    const serverComments = await fetchComments();
    updateComments(serverComments);
    renderComments(commentsData, commentsList);

    loadingMessage.style.display = "none";
    commentsList.style.display = "flex";
  } catch (error) {
    loadingMessage.textContent = "Не удалось загрузить комментарии :(";
    console.error(error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadComments().then(() => {
    initLikeListeners();
    initReplyListeners();
    initAddCommentListener();
  });
});
