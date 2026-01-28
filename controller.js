const supabase = require("./supabaseClient");

exports.postUpload = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send("Please upload an image");
    }

    const safeName = file.originalname.replace(/\s+/g, "_");
    const fileName = Date.now() + "_" + safeName;

    // Upload to SAME bucket
    const { error } = await supabase.storage
      .from("test")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error(error);
      return res.status(500).send("Error uploading image");
    }

    const { data: urlData } = supabase.storage
      .from("test")
      .getPublicUrl(fileName);

    const fileUrl = urlData.publicUrl;
    console.log("File URL:", fileUrl);
    res.json({
      success: true,
      fileUrl: fileUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
