import { renderComments } from "./modules/renderComments.js";
import {
  initLikeListeners,
  initReplyListeners,
  initAddCommentListener,
} from "/modules/initListeners.js";
import { commentsData } from "./modules/comments.js";
import { fetchComments } from "./modules/api.js";
import { updateComments } from "./modules/comments.js";
const commentsList = document.querySelector(".comments");

document.addEventListener("DOMContentLoaded", async () => {
  const commentsList = document.querySelector(".comments");

  if (commentsList) {
    const serverComments = await fetchComments();
    updateComments(serverComments);
    renderComments(commentsData, commentsList);

    initLikeListeners();
    initReplyListeners();
    initAddCommentListener();
  }
});
