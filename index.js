import { renderComments } from "./modules/renderComments.js";
import {
  initLikeListeners,
  initReplyListeners,
  initAddCommentListener,
} from "./modules/initListeners.js";
import { commentsData } from "./modules/comments.js";
import { fetchComments, getErrorMessage } from "./modules/api.js";
import { updateComments } from "./modules/comments.js";

async function loadComments() {
  const commentsList = document.querySelector(".comments");
  const loadingMessage = document.querySelector(".loading-message");

  if (!commentsList || !loadingMessage) return;

  loadingMessage.style.display = "flex";
  commentsList.style.display = "none";

  try {
    const serverComments = await fetchComments();
    updateComments(serverComments);
    renderComments(commentsData, commentsList);

    loadingMessage.style.display = "none";
    commentsList.style.display = "flex";
  } catch (error) {
    console.error(error);
    const message = getErrorMessage(error);
    loadingMessage.textContent = message;
    alert(message);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadComments().then(() => {
    initLikeListeners();
    initReplyListeners();
    initAddCommentListener();
  });
});
