import { renderComments } from "./modules/renderComments.js";
import {
  initLikeListeners,
  initReplyListeners,
  initAddCommentListener,
} from "./modules/initListeners.js";
import { commentsData, updateComments } from "./modules/comments.js";
import { fetchComments, getErrorMessage, setToken } from "./modules/api.js";
import { loadUser, renderAuthPage } from "./modules/authComponent.js";

let currentUser = null;

function updateUI() {
  const authLink = document.querySelector(".auth-link");
  const addForm = document.querySelector(".add-form");
  const nameInput = document.querySelector(".add-form-name");

  if (currentUser) {
    if (authLink) authLink.style.display = "none";
    if (addForm) {
      addForm.style.display = "flex";
      if (nameInput) nameInput.value = currentUser.name;
    }
  } else {
    if (authLink) authLink.style.display = "flex";
    if (addForm) addForm.style.display = "none";
  }
}
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
  const mainContent = document.getElementById("main-content");
  const authPage = document.getElementById("auth-page");

  const savedUser = loadUser();
  if (savedUser && savedUser.token) {
    currentUser = savedUser;
    setToken(savedUser.token);
  }

  updateUI();

  loadComments().then(() => {
    initLikeListeners();
    initReplyListeners();
    if (currentUser) {
      initAddCommentListener();
    }

    const authLinkTrigger = document.querySelector(".auth-link-trigger");
    if (authLinkTrigger) {
      authLinkTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        mainContent.style.display = "none";
        authPage.style.display = "flex";
        renderAuthPage(authPage, (user) => {
          currentUser = user;
          setToken(user.token);
          updateUI();
          authPage.style.display = "none";
          mainContent.style.display = "flex";

          loadComments().then(() => {
            initAddCommentListener();
          });
        });
      });
    }
  });
});
