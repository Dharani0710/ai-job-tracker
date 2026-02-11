import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ---------------- FETCH JOBS ---------------- */
  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("FETCH JOBS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* ---------------- DELETE JOB ---------------- */
  const handleDelete = async (id) => {
    try {
      await API.delete(`/jobs/${id}`);
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      alert("Failed to delete job");
    }
  };

  /* ---------------- STATUS COLOR ---------------- */
  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-600";
      case "Interviewing":
        return "bg-yellow-100 text-yellow-600";
      case "Offered":
        return "bg-green-100 text-green-600";
      case "Rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /* ---------------- ANALYZE ATS ---------------- */
  const handleUploadAndAnalyze = async () => {
    if (!resumeFile || !jobDesc) {
      alert("Upload resume and paste job description");
      return;
    }

    try {
      setLoading(true);

      // Upload Resume
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const uploadRes = await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resumeText = uploadRes.data.text;

      // Analyze
      const aiRes = await API.post("/ai/analyze", {
        resumeText,
        jobDescription: jobDesc,
      });

      setResult(aiRes.data);

      setLoading(false);
    } catch (err) {
      console.error("DASHBOARD ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Analysis failed");
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
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
        {/* LEFT PANEL */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Upload Resume & Job Description
          </h2>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="w-full border rounded-lg p-2 mb-4"
          />

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

        {/* RIGHT PANEL - ATS RESULT */}
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

              <div>
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
            </>
          )}
        </div>
      </div>

      {/* JOB LIST */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-6 text-slate-700">
          Your Applications
        </h2>

        {jobs.length === 0 && (
          <p className="text-slate-500 text-sm">
            No jobs added yet.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow p-5 border border-slate-200"
            >
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {job.role}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {job.company}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.status}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>ATS Score</span>
                  <span className="font-bold text-indigo-600">
                    {job.atsScore}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${job.atsScore}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(job._id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
