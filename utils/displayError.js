function displayError(code, index) {
  const rows = code.split(/\r?\n/);
  let row = 0;
  let col = index;
  for (let i = 0; i < rows.length; i++) {
    if (col <= rows[i].length - 1) {
      break;
    } else {
      col -= rows[i].length + 1;
      row++;
    }
  }

  const result = [];
  for (let i = row - 2; i <= row; i++) {
    if (!rows[i]) continue;
    result.push(`${i === row ? ">": " "} ${i + 1} | ${rows[i].length > 50 ? rows[i].slice(0, 57) + "...": rows[i]}`);
  }

  let pointer = "    | ";
  for (let i = 0; i < col; i++) {
    pointer += " ";
  }
  pointer += "^";
  result.push(pointer);

  return result.join("\n");
}

module.exports = displayError;