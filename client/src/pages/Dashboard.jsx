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
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">AI Job Tracker</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-3">Upload Resume (PDF)</h2>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResumeFile(e.target.files[0])}
          className="mb-4"
        />

        <h2 className="font-semibold mb-2">Paste Job Description</h2>
        <textarea
          rows="5"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Paste job description here..."
        />

        <button
          onClick={handleUploadAndAnalyze}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze ATS"}
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">ATS Result</h2>

          <p className="mb-2">
            <strong>ATS Score:</strong>{" "}
            <span className="text-blue-600 font-bold">
              {result.atsScore}%
            </span>
          </p>

          <div className="mb-3">
            <strong>Missing Keywords:</strong>
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {result.missingKeywords.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Tips:</strong>
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {result.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
