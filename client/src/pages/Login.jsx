import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading , setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  setError(err.response?.data?.message || "Login failed");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
useEffect(() => {
  if (localStorage.getItem("token")) {
    navigate("/dashboard");
  }
}, []);

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* LEFT SIDE – IMAGE */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100">
        <img
          src="/login-illustration.svg"
          alt="Login Illustration"
          className="w-3/4 max-w-md"
        />
      </div>

      {/* RIGHT SIDE – LOGIN CARD */}
      <div className="flex w-full md:w-1/2 items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-6">Login here</h2>

          <input
            name="email"
            type="email"
            placeholder="Enter Email Address"
            className="w-full border border-gray-300 px-4 py-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-black"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Enter Password"
            className="w-full border border-gray-300 px-4 py-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-black"
            onChange={handleChange}
            required
          />

          <div className="flex items-center mb-6">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm text-gray-600">Remember Me</span>
          </div>
        
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
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
