import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../API/AuthCall.ts";
import type { ApiResponse, RegisterResponse } from "../../types/AuthTypes.ts"

const RegisterForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.email || !user.password || !user.name) {
      alert("Fyll i alla fält");
      return;
    }
    if (user.password.length < 8) {
      alert("Lösenordet måste vara minst 8 tecken långt");
      return;
    }

    try {
      const response: ApiResponse<RegisterResponse> = await register(user);
      console.log(response);

      if (response) {
        navigate('/');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message: string } } };
      alert(error.response?.data?.message || "Registrering har misslyckats");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-500 mb-8 text-center">
        Calcounter
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Registrera dig
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-600 font-medium mb-2">
              Namn
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              id="name"
              name="name"
              type="text"
              value={user.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-600 font-medium mb-2">
              Mejladress
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              id="email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600 font-medium mb-2">
              Lösenord
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              name="password"
              type="password"
              id="password"
              value={user.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-3 rounded transition duration-200 mb-4"
          >
            Registrera
          </button>
        </form>

        <div className="text-center text-gray-600">
          Har du redan ett konto?{" "}
          <Link to="/" className="text-blue-500 hover:text-blue-600 hover:underline ml-1 font-medium">
            Logga in här
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
