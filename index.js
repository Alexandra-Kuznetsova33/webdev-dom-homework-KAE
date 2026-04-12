import { renderComments } from "/modules/renderComments.js";
import {
  initLikeListeners,
  initReplyListeners,
  initAddCommentListener,
} from "/modules/initListeners.js";
import { commentsData } from "/modules/comments.js";

document.addEventListener("DOMContentLoaded", () => {
  const commentsList = document.querySelector(".comments");

  if (commentsList) {
    renderComments(commentsData, commentsList);

    initLikeListeners();
    initReplyListeners();
    initAddCommentListener();
  }
});
