/**
 * @param {string} str 
 * @returns {string}
 */
function clearify(str) {
  return str.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f _\-]/g, "")
    .toLowerCase();
}

module.exports = clearify;