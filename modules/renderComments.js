import { escapeHTML } from "./escapeHTML.js";
import { formatDate } from "./formateDate.js";

export function renderComments(commentsArray, commentsListElement) {
  commentsListElement.innerHTML = "";

  commentsArray.forEach((comment) => {
    const likeButtonClass = comment.isLiked
      ? "like-button -active-like"
      : "like-button";

    let quotedBlock = "";
    let displayText = escapeHTML(comment.text);

    if (comment.text.startsWith("> Ответ на комментарий:")) {
      const parts = comment.text.split("\n");
      const quoteLine = parts[0];
      const replyLines = parts
        .slice(1)
        .map((line) => escapeHTML(line))
        .join("\n");

      quotedBlock = `
        <div class="quoted-comment">
          <p>${quoteLine.replace("> ", "")}</p>
        </div>
      `;
      displayText = replyLines
        ? `<div class="comment-text">${replyLines}</div>`
        : "";
    } else {
      displayText = `<div class="comment-text">${displayText}</div>`;
    }

    const commentHTML = `
      <li class="comment" data-id="${comment.id}">
        <div class="comment-header">
          <div>${escapeHTML(comment.name)}</div>
          <div>${comment.date}</div>
        </div>
        ${quotedBlock}
        ${displayText}
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="${likeButtonClass}"></button>
          </div>
        </div>
      </li>
    `;

    commentsListElement.insertAdjacentHTML("beforeend", commentHTML);
  });
}
