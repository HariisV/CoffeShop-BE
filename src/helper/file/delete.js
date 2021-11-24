const fs = require("fs");

const deleteFile = (fileName) => {
  if (fs.existsSync("public/upload/" + fileName)) {
    fs.unlink("public/upload/" + fileName, (error) => {
      if (error) throw error;
    });
  }
  return;
};

module.exports = deleteFile;
