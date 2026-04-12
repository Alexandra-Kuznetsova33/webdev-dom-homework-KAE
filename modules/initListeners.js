import { commentsData } from "./comments.js";
import { escapeHTML } from "./escapeHTML.js";
import { renderComments } from "./renderComments.js";
import { addCommentAndRender } from "./addComment.js";

export const initLikeListeners = () => {
  const commentsList = document.querySelector(".comments");

  commentsList.addEventListener("click", function (event) {
    if (event.target.closest(".like-button")) {
      const likeButton = event.target.closest(".like-button");
      const commentElement = likeButton.closest(".comment");
      const commentId = parseInt(commentElement.dataset.id);
      const comment = commentsData.find((c) => c.id === commentId);

      if (comment) {
        if (comment.isLiked) {
          comment.isLiked = false;
          comment.likes -= 1;
        } else {
          comment.isLiked = true;
          comment.likes += 1;
        }
        renderComments(commentsData, commentsList);
      }
    }
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
      const commentId = parseInt(commentElement.dataset.id);
      const comment = commentsData.find((c) => c.id === commentId);

      if (comment) {
        const quotedText = `> Ответ на комментарий: ${escapeHTML(comment.name)} : ${escapeHTML(comment.text)}\n`;
        const textInput = document.querySelector(".add-form-text");
        textInput.value = quotedText;
        textInput.focus();
      }
    }
  });

  renderComments(commentsData, commentsList);
};

export const initAddCommentListener = () => {
  const addButton = document.querySelector(".add-form-button");
  const nameInput = document.querySelector(".add-form-name");
  const textInput = document.querySelector(".add-form-text");
  const commentsList = document.querySelector(".comments");

  if (addButton && nameInput && textInput && commentsList) {
    addButton.addEventListener("click", async () => {
      const name = nameInput.value.trim();
      const text = textInput.value.trim();

      if (!name || !text) {
        alert("Пожалуйста, заполните имя и комментарий!");
        return;
      }

      if (name.length < 3 || text.length < 3) {
        alert("Имя и текст комментария должны содержать хотя бы 3 символа.");
        return;
      }

      await addCommentAndRender(name, text);

      nameInput.value = "";
      textInput.value = "";
    });
  }
};
