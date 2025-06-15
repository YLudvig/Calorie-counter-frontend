import { useState } from "react";
import { login } from "../../API/AuthCall";
import type { LoginRequest, User } from "../../types/AuthTypes";
import { Link, useNavigate } from "react-router-dom";

type LoginProps = {
    setUser: (user: User) => void;
}

function Login({setUser}: LoginProps){
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const credentials: LoginRequest = { email, password };
      const response = await login(credentials);

      if (response.token) {
        setUser({
          token: response.token,
          userId: response.userId,
          username: response.name,
        });
        localStorage.setItem("token", response.token);
        console.log("Login successful");
        navigate("/calcounter");
      }
    } catch (error) {
      setError("Inloggningen misslyckades. Kontrollera dina uppgifter.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
          Logga in på ditt konto
        </h2>

        {error && (
          <div className="text-red-700 bg-red-100 border border-red-300 rounded px-4 py-3 mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-postadress
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="E-postadress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Lösenord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded font-medium transition-colors"
          >
            Logga in
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/register" className="text-blue-500 hover:text-blue-600 hover:underline font-medium">
            Skapa nytt konto
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
