// const supabase = require("./supabaseClient");

// exports.postUpload = async (req, res) => {
//   try {
//     const file = req.file;

//     if (!file) {
//       return res.status(400).send("Please upload an image");
//     }

//     const safeName = file.originalname.replace(/\s+/g, "_");
//     const fileName = Date.now() + "_" + safeName;

//     // Upload to SAME bucket
//     const { error } = await supabase.storage
//       .from("test")
//       .upload(fileName, file.buffer, {
//         contentType: file.mimetype,
//       });

//     if (error) {
//       console.error(error);
//       return res.status(500).send("Error uploading image");
//     }

//     const { data: urlData } = supabase.storage
//       .from("test")
//       .getPublicUrl(fileName);

//     const fileUrl = urlData.publicUrl;
//     console.log("File URL:", fileUrl);
//     res.json({
//       success: true,
//       fileUrl: fileUrl,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// };
const supabase = require("./supabaseClient");

exports.postUpload = async (req, res) => {
  try {
    // 1. Multer puts multiple files in req.files
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).send("Please upload at least one file");
    }

    // 2. Map through files and create an array of upload promises
    const uploadPromises = files.map(async (file) => {
      const safeName = file.originalname.replace(/\s+/g, "_");
      const fileName = `${Date.now()}_${safeName}`;

      const { error } = await supabase.storage
        .from("test")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        throw error; // This will be caught by the catch block
      }

      // Get public URL for this specific file
      const { data: urlData } = supabase.storage
        .from("test")
        .getPublicUrl(fileName);

      return {
        url: urlData.publicUrl,
        name: file.originalname,
      };
    });

    // 3. Wait for all uploads to complete
    const uploadedFiles = await Promise.all(uploadPromises);

    // console.log("Uploaded Files:", uploadedFiles);

    // 4. Return the array of URLs
    res.json({
      success: true,
      files: uploadedFiles, // Returns [{url, name}, ...]
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during file upload",
      error: err.message,
    });
  }
};
