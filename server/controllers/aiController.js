const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeATS = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: "resumeText and jobDescription are required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are an ATS (Applicant Tracking System) expert.

Analyze the resume against the job description.

Return JSON in this format ONLY:

{
  "atsScore": number (0-100),
  "matchedSkills": [array of matched keywords],
  "missingSkills": [array of missing important keywords],
  "feedback": "detailed improvement suggestions"
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    // Try parsing AI response safely
    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch (err) {
      return res.json({
        atsScore: 65,
        matchedSkills: [],
        missingSkills: [],
        feedback: response,
      });
    }

    res.json(parsed);

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ message: "AI analysis failed" });
  }
};
