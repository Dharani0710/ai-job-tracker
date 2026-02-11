import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      console.log("TOKEN SAVED:", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex w-full items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-6">Login</h2>

          <input
            name="email"
            type="email"
            placeholder="Enter Email Address"
            className="w-full border border-gray-300 px-4 py-3 mb-4 rounded"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Enter Password"
            className="w-full border border-gray-300 px-4 py-3 mb-4 rounded"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-2 rounded"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <p className="text-center mt-6 text-sm">
            <Link to="/register" className="text-blue-600">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
