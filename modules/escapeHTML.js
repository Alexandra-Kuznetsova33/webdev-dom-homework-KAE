// modules/escapeHTML.js
export function escapeHTML(str) {
  return str.replaceAll('&', '&')
            .replaceAll('<', '<')
            .replaceAll('>', '>')
            .replaceAll('"', '"')
            .replaceAll("'", "'");
}