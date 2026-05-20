import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // REGISTER FUNCTION
  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Register failed");
        return;
      }

      setMessage(data.message);

    } catch (err) {
      setMessage("Register error");
    }
  };

  // LOGIN FUNCTION
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      setMessage("Login successful 🚀");

    } catch (err) {
      setMessage("Login error");
    }
  };

  // UPLOAD FUNCTION
  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    const token = localStorage.getItem("token");

    if (!token) {
      return alert("Please login first");
    }

    setLoading(true);
    setMessage("");
    setUrl("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Upload failed");
        return;
      }

      setMessage(data.message);
      setUrl(data.url);

    } catch (err) {
      setMessage("Network error — backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">

      <h1 className="text-4xl font-bold mb-4">
        CloudForge
      </h1>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Email"
        className="p-2 rounded text-black"
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Password"
        className="p-2 rounded text-black"
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* AUTH BUTTONS */}
      <div className="flex gap-4">

        <button
          onClick={handleRegister}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Register
        </button>

        <button
          onClick={handleLogin}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Login
        </button>

      </div>

      {/* FILE INPUT */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mt-4"
      />

      {/* UPLOAD BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-white text-black px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* MESSAGE */}
      {message && (
        <p className="mt-4 text-green-400">
          {message}
        </p>
      )}

      {/* FILE URL */}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 underline mt-2"
        >
          View Uploaded File
        </a>
      )}

    </div>
  );
}

export default App;