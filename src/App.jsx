import React from "react";
import {
  ClerkProvider,
  useUser,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./assets/Navbar";
import Home from "./page/Home/home";
import Layout from "./page/LayoutLogin/layout";

// Komponen untuk memproteksi rute atau mengecek status login
const AppContent = () => {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Jika sudah login (SignedIn), arahkan ke Home */}
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <Home />
            </SignedIn>
            <SignedOut>
              <Navigate to="/login" replace />
            </SignedOut>
          </>
        }
      />

      {/* Jika belum login (SignedOut), tampilkan halaman Login/Layout */}
      <Route
        path="/login"
        element={
          <>
            <SignedOut>
              <Layout />
            </SignedOut>
            <SignedIn>
              <Navigate to="/" replace />
            </SignedIn>
          </>
        }
      />

      {/* Tambahkan route lain di sini jika perlu */}
    </Routes>
  );
};

const App = () => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing Publishable Key");
  }

  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={publishableKey}>
        <AppContent />
      </ClerkProvider>
    </BrowserRouter>
  );
};

export default App;
