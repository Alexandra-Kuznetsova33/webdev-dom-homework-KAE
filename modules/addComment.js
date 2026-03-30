import { escapeHTML } from './escapeHTML.js';
import { formatDate } from './formateDate.js';

export function addComment(commentsArray, name, text) {
  const now = new Date();
  const newComment = {
    id: Date.now(),
    name: escapeHTML(name),
    text: escapeHTML(text),
    date: formatDate(now),
    likes: 0,
    isLiked: false,
  };
  commentsArray.push(newComment);
}