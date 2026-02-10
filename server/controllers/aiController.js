// Simple ATS-style analyzer (rule-based)

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text) {
  const stopwords = new Set([
    "and","or","the","a","an","to","of","in","for","with","on","by",
    "is","are","was","were","be","as","at","from","that","this","it"
  ]);

  const words = normalize(text).split(" ");
  const keywords = new Set();

  for (const w of words) {
    if (w.length > 2 && !stopwords.has(w)) {
      keywords.add(w);
    }
  }
  return Array.from(keywords);
}

exports.analyzeATS = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "resumeText and jobDescription are required" });
    }

    const resumeKeywords = extractKeywords(resumeText);
    const jobKeywords = extractKeywords(jobDescription);

    const resumeSet = new Set(resumeKeywords);

    const matched = [];
    const missing = [];

    for (const kw of jobKeywords) {
      if (resumeSet.has(kw)) matched.push(kw);
      else missing.push(kw);
    }

    const atsScore =
      jobKeywords.length === 0
        ? 0
        : Math.round((matched.length / jobKeywords.length) * 100);

    const tips = [
      atsScore < 60 && "Add more job-specific keywords to your resume.",
      missing.length > 0 && `Consider adding: ${missing.slice(0, 10).join(", ")}`,
      "Use clear section headings (Skills, Experience, Projects).",
      "Avoid images/tables; use simple text for ATS compatibility."
    ].filter(Boolean);

    res.json({
      atsScore,
      matchedKeywords: matched.slice(0, 30),
      missingKeywords: missing.slice(0, 30),
      tips
    });
  } catch (err) {
    res.status(500).json({ message: "AI analysis failed" });
  }
};
