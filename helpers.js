const { writeFileSync, readFileSync } = require("node:fs");

const writeJsonFile = (path, fileName, data) => {
  data = JSON.stringify(data, 0, 2);
  return writeFileSync(`${path}/${fileName}`, data, { encoding: "utf-8" });
};

const readJsonFile = (path, fileName) => {
  const messages = readFileSync(`${path}/${fileName}`, "utf-8");
  return messages ? JSON.parse(messages) : [];
};

module.exports = {
  writeJsonFile,
  readJsonFile,
};
