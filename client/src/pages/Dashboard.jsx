import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------- STAT CARD ---------- */
function StatCard({ title, value, color }) {
  return (
    <div className={`rounded-xl p-4 text-white shadow ${color}`}>
      <p className="text-sm opacity-80">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile default closed
  const [darkMode, setDarkMode] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------- FETCH JOBS ---------- */
  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  /* ---------- STATS ---------- */
  const stats = jobs.reduce(
    (acc, job) => {
      acc.total++;
      if (acc[job.status] !== undefined) acc[job.status]++;
      return acc;
    },
    { total: 0, Applied: 0, Interviewing: 0, Offered: 0, Rejected: 0 }
  );

  const chartData = [
    { name: "Applied", value: stats.Applied },
    { name: "Interviewing", value: stats.Interviewing },
    { name: "Offered", value: stats.Offered },
    { name: "Rejected", value: stats.Rejected },
  ];

  const COLORS = ["#3b82f6", "#f59e0b", "#22c55e", "#ef4444"];

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id) => {
    await API.delete(`/jobs/${id}`);
    fetchJobs();
  };

  /* ---------- UPDATE STATUS ---------- */
  const updateStatus = async (id, status) => {
    await API.put(`/jobs/${id}`, { status });
    fetchJobs();
  };

  /* ---------- ATS ANALYZE ---------- */
  const handleAnalyze = async () => {
    if (!resumeFile || !jobDesc.trim()) {
      alert("Upload resume and paste job description");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resumeFile);

      const uploadRes = await API.post("/resume/upload", formData);
      const resumeText = uploadRes.data.text;

      const aiRes = await API.post("/ai/analyze", {
        resumeText,
        jobDescription: jobDesc,
      });

      setResult(aiRes.data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">

      {/* SIDEBAR */}
      <div
        className={`fixed md:static z-40 h-full bg-white dark:bg-slate-800 shadow-lg p-5 transition-all duration-300 
        ${sidebarOpen ? "w-64" : "w-0 md:w-64 overflow-hidden"}`}
      >
        <div className="flex justify-between mb-8">
          <h2 className="font-bold text-indigo-600 dark:text-white">
            AI Tracker
          </h2>
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>
        </div>

        <button
          onClick={logout}
          className="mt-10 bg-red-500 text-white w-full py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-8 w-full">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8">
          <button
            className="md:hidden text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h1 className="text-xl md:text-2xl font-bold dark:text-white">
            Dashboard
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-200 dark:bg-gray-700 dark:text-white px-3 py-2 rounded text-sm"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard title="Total" value={stats.total} color="bg-indigo-500" />
          <StatCard title="Applied" value={stats.Applied} color="bg-blue-500" />
          <StatCard title="Interviewing" value={stats.Interviewing} color="bg-yellow-500" />
          <StatCard title="Offered" value={stats.Offered} color="bg-green-500" />
        </div>

        {/* UPLOAD SECTION */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 md:p-6 mb-10">
          <h2 className="font-semibold mb-4 dark:text-white">
            Upload Resume & Analyze
          </h2>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="border p-2 mb-4 w-full"
          />

          <textarea
            rows="4"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste job description..."
            className="border p-2 mb-4 w-full"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            {loading ? "Analyzing..." : "Analyze ATS"}
          </button>

          {result && (
            <div className="mt-6 dark:text-white">
              <p className="font-semibold">
                ATS Score: {result.atsScore}%
              </p>
            </div>
          )}
        </div>

        {/* CHARTS */}
        {jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

            <div className="bg-white dark:bg-slate-800 p-6 rounded shadow h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" outerRadius={100} label>
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded shadow h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

        {/* JOB LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white dark:bg-slate-800 p-4 rounded shadow"
            >
              <h3 className="font-semibold dark:text-white">{job.role}</h3>
              <p className="text-sm text-gray-500">{job.company}</p>

              <select
                value={job.status}
                onChange={(e) =>
                  updateStatus(job._id, e.target.value)
                }
                className="border mt-2 p-1 rounded w-full"
              >
                <option>Applied</option>
                <option>Interviewing</option>
                <option>Offered</option>
                <option>Rejected</option>
              </select>

              <button
                onClick={() => handleDelete(job._id)}
                className="text-red-500 text-sm mt-2"
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
