const fs = require("fs");

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (error) => {
      if (error) throw error;
    });
  }
  return;
};

module.exports = deleteFile;
