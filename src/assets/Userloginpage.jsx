import { Eye, EyeOff, Snowflake } from "lucide-react";
import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";

const Userloginpage = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [showpassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      console.log("Attempting sign in dengan email:", email);
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete") {
        console.log("Login berhasil", result);
        // Mengatur sesi aktif
        await setActive({ session: result.createdSessionId });
        setError("");
        // Reset form
        setPassword("");
        setEmail("");
      } else {
        console.log("Perlu langkah verifikasi tambahan", result);
        setError("Login gagal. Periksa kembali email dan password Anda.");
      }
    } catch (err) {
      const errorMessage = err.errors?.[0]?.message || "Terjadi kesalahan saat login";
      setError(errorMessage);
      console.error("Login Error:", err);
      console.error("Error details:", err.errors);

      // Better error messages
      if (errorMessage.includes("Couldn't find")) {
        setError("Email tidak ditemukan. Silakan periksa email Anda atau daftar akun baru.");
      } else if (errorMessage.includes("password")) {
        setError("Email atau password salah. Coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      console.log("Starting Google OAuth sign in...");
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin,
        redirectUrlComplete: window.location.origin,
      });
    } catch (err) {
      const errorMessage = err.errors?.[0]?.message || "Gagal melakukan login dengan Google";
      setError(errorMessage);
      console.error("Google Sign In Error:", err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg lg:w-full h-full sm:w-full md:w-full shadow-lg relative">
      <div className="flex items-center text-center mb-4 -ml-7 justify-center md:gap-x-1 lg:gap-x-2">
        <Snowflake size={60} color="blue" />
        <h2 className="xl:text-5xl font-bold md:text-xl">NonnesX</h2>
      </div>
      <div className="mt-10">
        <h5 className="font-bold text-2xl text-center">
          Selamat Datang Kembali!
        </h5>
        <p className="text-center mt-2 text-gray-600/70 capitalize xl:text-lg md:text-md xl:w-[70%] mx-auto">
          Masuk ke akun Anda dan terus berbagi berita bersama kami!
        </p>
      </div>
      <form
        className="mt-7 space-y-4 xl:w-[80%] md:w-full mx-auto"
        onSubmit={handleSubmitLogin}
      >
        <div id="clerk-captcha"></div>
        <div className="my-5">
          <input
            className="shadow appearance-none border border-blue-100 focus:border-blue-700 focus:border-2 duration-100 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="my-5 flex items-center">
          <input
            className="shadow appearance-none border border-blue-100 focus:border-blue-700 focus:border-2 duration-100 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            type={showpassword ? "text" : "password"}
            value={password}
            placeholder="Kata Sandi"
            required
          />
          <div
            role="button"
            className="shadow appearance-none border border-blue-100 focus:border-blue-700 focus:border-2 duration-100 rounded-sm w-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex items-center justify-center cursor-pointer"
            onClick={() => setShowPassword(!showpassword)}
          >
            {showpassword ? (
              <EyeOff size={20} color="gray" />
            ) : (
              <Eye size={20} color="gray" />
            )}
          </div>
        </div>
        <div className="flex items-center flex-col gap-y-4 justify-between">
          <button
            className="w-full  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sedang Masuk..." : "Masuk Sekarang!"}
          </button>
          <button
            className="w-full rounded-lg border-2 border-blue-200 hover:border-blue-700 hover:bg-blue-50 font-bold py-2 px-4 focus:outline-none focus:shadow-outline flex items-center justify-center gap-x-2 transition-all"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={!isLoaded}
          >
            <img
              src="/Logo-google-icon.png"
              alt="google"
              className="w-5 h-5"
            />
            <p className="text-blue-500">Masuk dengan Google</p>
          </button>
          <div>
            <p className="text-sm text-gray-600/70">
              Belum punya akun?
              <span className="text-blue-500 hover:text-blue-700 cursor-pointer pl-1 font-semibold">
                Daftar Di Sini
              </span>
            </p>
          </div>
          <div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <p className="absolute bottom-0 left-10 text-center text-sm text-gray-600/70 border-t-2 border-gray-200 pt-3 mt-6 w-[80%]">
          Dengan masuk, Anda setuju dengan Ketentuan dan Kebijakan Privasi kami.
        </p>
      </form>
    </div>
  );
};

export default Userloginpage;