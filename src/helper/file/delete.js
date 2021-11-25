const fs = require("fs");

<<<<<<< HEAD
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (error) => {
      if (error) throw error;
    });
  }
  return;
=======
const deleteFile = (fileName) => {
	if (fs.existsSync("public/upload/" + fileName)) {
		fs.unlink("public/upload/" + fileName, (error) => {
			if (error) throw error;
		});
	}
	return;
>>>>>>> 9fbce17d9be72e996388e88046cb2209d79182b4
};

module.exports = deleteFile;
