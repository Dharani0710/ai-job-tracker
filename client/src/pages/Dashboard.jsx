import { useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleUploadAndAnalyze = async () => {
    if (!resumeFile || !jobDesc) {
      alert("Upload resume and paste job description");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Upload resume
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const uploadRes = await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resumeText = uploadRes.data.text;
const logout = () => {
  localStorage.removeItem("token");
  window.location.replace("/#/login");
};

      // 2️⃣ Analyze ATS
      const aiRes = await API.post("/ai/analyze", {
        resumeText,
        jobDescription: jobDesc,
      });

      setResult(aiRes.data);
    } catch (err) {
  console.error("DASHBOARD ERROR:", err.response?.data || err.message);
  alert(err.response?.data?.message || "Analysis failed");
}
finally {
      setLoading(false);
    }
  };
return (
  <div className="min-h-screen bg-slate-100 p-4 md:p-8">
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-indigo-600">
        AI Job Tracker
      </h1>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
      >
        Logout
      </button>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT: Upload Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Upload Resume & Job Description
        </h2>

        <label className="block text-sm font-medium mb-1">
          Resume (PDF)
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResumeFile(e.target.files[0])}
          className="w-full border rounded-lg p-2 mb-4"
        />

        <label className="block text-sm font-medium mb-1">
          Job Description
        </label>
        <textarea
          rows="6"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Paste job description here..."
        />

        <button
          onClick={handleUploadAndAnalyze}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium"
        >
          {loading ? "Analyzing..." : "Analyze ATS"}
        </button>
      </div>

      {/* RIGHT: ATS RESULT */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          ATS Analysis Result
        </h2>

        {!result && (
          <p className="text-slate-500 text-sm">
            Upload resume and job description to see results.
          </p>
        )}

        {result && (
          <>
            {/* ATS SCORE */}
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="font-medium">ATS Score</span>
                <span className="font-bold text-indigo-600">
                  {result.atsScore}%
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full"
                  style={{ width: `${result.atsScore}%` }}
                ></div>
              </div>
            </div>

            {/* MISSING KEYWORDS */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Missing Keywords</h3>
              {result.missingKeywords.length === 0 ? (
                <p className="text-green-600 text-sm">
                  🎉 No missing keywords
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((k, i) => (
                    <span
                      key={i}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* TIPS */}
            <div>
              <h3 className="font-medium mb-2">Tips</h3>
              <ul className="list-disc ml-5 text-sm text-slate-600 space-y-1">
                {result.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
}