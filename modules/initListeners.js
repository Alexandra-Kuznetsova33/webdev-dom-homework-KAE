import { commentsData } from "./comments.js";
import { escapeHTML } from "./escapeHTML.js";
import { renderComments } from "./renderComments.js";
import { addCommentAndRender } from "./addComment.js";

function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(resolve, interval);
  });
}

export const initLikeListeners = () => {
  const commentsList = document.querySelector(".comments");
  if (!commentsList) return;

  commentsList.addEventListener("click", async function (event) {
    const likeButton = event.target.closest(".like-button");
    if (!likeButton) return;

    const commentElement = likeButton.closest(".comment");
    const commentId = commentElement.dataset.id;   
    const comment = commentsData.find((c) => c.id === commentId);
    if (!comment) return;

    comment.isLikeLoading = true;
    renderComments(commentsData, commentsList);

    await delay(1000);

    comment.isLiked = !comment.isLiked;
    comment.likes += comment.isLiked ? 1 : -1;
    comment.isLikeLoading = false;

    renderComments(commentsData, commentsList);
  });
};

export const initReplyListeners = () => {
  const commentsList = document.querySelector(".comments");

  commentsList.addEventListener("click", function (event) {
    const target = event.target;

    if (target.closest(".like-button")) {
      event.stopPropagation();
      return;
    }

    const commentElement = target.closest(".comment");
    if (commentElement) {
      const commentId = commentElement.dataset.id;
      const comment = commentsData.find((c) => c.id === commentId);

      if (comment) {
        const quotedText = `> Ответ на комментарий: ${escapeHTML(comment.name)} : ${escapeHTML(comment.text)}\n`;
        const textInput = document.querySelector(".add-form-text");
        textInput.value = quotedText;
        textInput.focus();
      }
    }
  });
};

export const initAddCommentListener = () => {
  const addButton = document.querySelector(".add-form-button");
  const nameInput = document.querySelector(".add-form-name");
  const textInput = document.querySelector(".add-form-text");
  const commentsList = document.querySelector(".comments");

  if (addButton && nameInput && textInput && commentsList) {
    addButton.addEventListener("click", async () => {
      const text = textInput.value.trim();

      if (text.length < 3) {
        alert("Текст комментария должен быть не короче 3 символов");
        return;
      }

      addButton.disabled = true;
      const success = await addCommentAndRender(text);
      addButton.disabled = false;

      if (success) {
        textInput.value = "";
      }
    });
  }
};
