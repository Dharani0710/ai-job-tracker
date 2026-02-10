const pdfParse = require("pdf-parse");

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pdfData = await pdfParse(req.file.buffer);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return res.status(400).json({
        message: "PDF contains no readable text (scanned image)",
      });
    }

    res.json({
      message: "Resume uploaded successfully",
      text: pdfData.text,
    });
  } catch (error) {
    console.error("PDF PARSE ERROR:", error);
    res.status(500).json({ message: "Resume parsing failed" });
  }
};
