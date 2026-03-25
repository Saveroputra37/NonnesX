import { Eye, EyeOff, Snowflake } from "lucide-react";
import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
const Usercreatepage = () => {
  const { signUp: _signUp, setActive, isLoaded } = useSignUp();
  const [showpassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");
  const [signUpId, setSignUpId] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const result = await _signUp.create({
        username: name,
        first_name: firstname,
        last_name: lastname,
        email_address: email,
        password: password,
      });

      if (result.status === "complete") {
        console.log("Sign up berhasil", result);
        // Mengatur sesi aktif
        await setActive({ session: result.createdSessionId });
        setError("");
      } else if (result.status === "missing_requirements") {
        console.log("Perlu langkah verifikasi tambahan", result);
        console.log("Email untuk verifikasi:", email);
        console.log("Signup ID:", result.id);

        // PENTING: Kirim verification code sebelum masuk ke verification mode
        try {
          console.log("Mengirim verification code...");
          await _signUp.prepareEmailAddressVerification();
          console.log("Verification code berhasil dikirim ke:", email);
        } catch (prepareErr) {
          console.error("Error preparing verification:", prepareErr);
          setError(
            "Gagal mengirim kode verifikasi. " +
              (prepareErr.errors?.[0]?.message || ""),
          );
          return;
        }

        // Simpan signup ID untuk verifikasi
        setSignUpId(result.id);
        setIsVerifying(true);
        const message = `Kode verifikasi telah dikirim ke: ${email}`;
        setError(message);
        console.log(message);
      }
    } catch (err) {
      const errorMessage =
        err.errors?.[0]?.message || "Terjadi kesalahan saat membuat akun";
      setError(errorMessage);
      console.error("Error:", errorMessage);
    }
    setEmail("");
    setPassword("");
    setName("");
    setFirstname("");
    setLastname("");
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!signUpId || !verificationCode) {
      setError("Masukkan kode verifikasi");
      return;
    }

    // Trim dan validasi kode
    const trimmedCode = verificationCode.trim();
    if (trimmedCode.length === 0) {
      setError("Kode verifikasi tidak boleh kosong");
      return;
    }

    try {
      console.log("Verifying email dengan kode:", trimmedCode);
      console.log("Kode length:", trimmedCode.length);
      console.log("Signup ID:", signUpId);

      // Verifikasi dengan kode yang sudah di-trim
      const result = await _signUp.attemptEmailAddressVerification({
        code: trimmedCode,
      });

      console.log("Verification result:", result);
      if (result.status === "complete") {
        console.log("Email verified berhasil", result);
        await setActive({ session: result.createdSessionId });
        setError("");
        setIsVerifying(false);
        // Reset form
        setVerificationCode("");
        setSignUpId(null);
      } else {
        console.log("Verification status:", result.status);
        setError("Verifikasi gagal, coba lagi atau minta kode baru");
      }
    } catch (err) {
      const errorMessage =
        err.errors?.[0]?.message || "Kode verifikasi tidak valid";
      console.error("Verification Error:", err);
      console.error("Error details:", err.errors);

      // Better error messages
      if (errorMessage.includes("Incorrect code")) {
        setError(
          "Kode verifikasi salah. Periksa kembali kode di email Anda atau minta kode baru.",
        );
      } else if (errorMessage.includes("send a verification code")) {
        setError(
          "Silakan klik 'Kirim Ulang Kode' untuk menerima kode verifikasi baru",
        );
      } else if (errorMessage.includes("expired")) {
        setError("Kode verifikasi telah kadaluarsa. Silakan minta kode baru.");
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleResendVerification = async () => {
    if (!signUpId) {
      setError("Signup ID tidak ditemukan");
      return;
    }

    setIsResending(true);
    try {
      console.log(
        "Mengirim ulang verification email untuk signup ID:",
        signUpId,
      );
      // Resend verification code
      const result = await _signUp.prepareEmailAddressVerification();

      console.log("Resend result:", result);
      setError(
        `Kode verifikasi baru telah dikirim ke email: ${email}. Periksa inbox atau folder spam.`,
      );
    } catch (err) {
      const errorMessage =
        err.errors?.[0]?.message || "Gagal mengirim ulang kode verifikasi";
      setError(errorMessage);
      console.error("Resend Error:", err);
      console.error("Error details:", err.errors);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg lg:w-full h-full sm:w-full md:w-full shadow-lg relative">
      <div className="flex items-center text-center mb-4 -ml-7 justify-center md:gap-x-1 lg:gap-x-2">
        <Snowflake size={60} color="blue" />
        <h2 className="xl:text-5xl font-bold md:text-xl">NonnesX</h2>
      </div>
      <div className="mt-10">
        <h5 className=" font-bold text-2xl text-center">
          Selamat Datang Tamu Baru!
        </h5>
        <p className="text-center mt-2 text-gray-600/70 capitalize xl:text-lg md:text-md xl:w-[90%] mx-auto">
          Buat Akun Anda sekarang dan jadilah bagian dari keluarga di era
          aplikasi berita sosial!
        </p>
      </div>
      <form
        className="mt-7 space-y-4 xl:w-[80%] md:w-full mx-auto"
        onSubmit={isVerifying ? handleVerifyEmail : handleSubmitSignUp}
      >
        {!isVerifying ? (
          <>
            <div id="clerk-captcha"></div>
            <div className="my-5 flex items-center gap-x-2">
              <input
                className="shadow appearance-none border border-blue-100 focus:border-blue-700 focus:border-2 duration-100 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstname"
                type="text"
                onChange={(e) => setFirstname(e.target.value)}
                value={firstname}
                placeholder="Nama Depan"
              />
              <input
                className="shadow appearance-none border border-blue-100 focus:border-blue-700 focus:border-2 duration-100 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastname"
                type="text"
                onChange={(e) => setLastname(e.target.value)}
                value={lastname}
                placeholder="Nama Belakang"
              />
            </div>
            <div className="my-5">
              <input
                className="shadow appearance-none border border-blue-100 focus:border-blue-700 focus:border-2 duration-100 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Nama Pengguna"
              />
            </div>
            <div className="my-5">
              <input
                className="shadow appearance-none border border-blue-100 focus:border-blue-700 focus:border-2 duration-100 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Yang Benar"
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
                className=" w-full  rounded-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {isLoaded ? "Buat Akun Sekarang!" : "Memuat..."}
              </button>
              <div>
                <p className="text-sm text-gray-600/70">
                  Sudah punya akun?
                  <span className="text-blue-500 hover:text-blue-700 cursor-pointer pl-1">
                    Masuk
                  </span>
                </p>
              </div>
              <div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </div>
          </>
        ) : (
          <div className="my-5">
            <h3 className="text-xl font-bold text-center mb-4">
              Verifikasi Email
            </h3>
            <p className="text-center text-gray-600 mb-3 text-sm">
              Masukkan kode verifikasi (6 digit) yang kami kirim ke email Anda
            </p>
            <p className="text-center text-gray-500 mb-4 text-xs">
              Periksa folder Spam jika tidak menemukan email di Inbox
            </p>
            <input
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength="6"
              className="shadow appearance-none border border-blue-100 focus:border-blue-700 focus:border-2 duration-100 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 text-center text-lg font-mono tracking-widest"
            />
            <p className="text-center text-gray-500 text-xs mb-4">
              {verificationCode.length}/6 karakter
            </p>
            <button
              type="submit"
              disabled={verificationCode.trim().length !== 6}
              className="w-full rounded-lg bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 transition-all"
            >
              {verificationCode.trim().length === 6
                ? "Verifikasi Sekarang"
                : "Tunggu 6 digit kode"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsVerifying(false);
                setVerificationCode("");
                setError("");
              }}
              className="w-full rounded-lg border-2 border-gray-300 text-gray-600 font-bold py-2 px-4 focus:outline-none focus:shadow-outline mb-3"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full rounded-lg border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-bold py-2 px-4 focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Mengirim ulang..." : "Kirim Ulang Kode"}
            </button>
            <div>
              {error && (
                <p className="text-sm text-red-500 mt-4 text-center">{error}</p>
              )}
            </div>
          </div>
        )}
        <p className="text-center text-sm text-gray-600/70 absolute bottom-5 left-7 w-10/12 border-t-2 border-gray-200 pt-3">
          Dengan mendaftar, Anda setuju dengan Ketentuan dan Kebijakan Privasi
          kami.
        </p>
      </form>
    </div>
  );
};

export default Usercreatepage;
