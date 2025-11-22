const fs = require("fs");
const path = require("path");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Handle file upload using express-fileupload
const handleFileUpload = (req) => {
  return new Promise((resolve, reject) => {
    try {
      // express-fileupload puts form fields in req.body
      const fields = req.body || {};
      
      // Check if file is uploaded
      if (!req.files || !req.files.image) {
        return resolve({ fields: fields, file: null });
      }

      const file = req.files.image;
      const ext = path.extname(file.name);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const uploadPath = path.join(uploadsDir, uniqueName);

      // Move file to uploads directory
      file.mv(uploadPath, (err) => {
        if (err) {
          return reject(err);
        }

        resolve({
          fields: fields,
          file: {
            filename: uniqueName,
            originalName: file.name,
            path: `/uploads/${uniqueName}`,
          },
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { handleFileUpload };

