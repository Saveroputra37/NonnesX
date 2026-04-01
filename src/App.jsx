import React from "react";
import {
  ClerkProvider,
  useUser,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./page/Home/home";
import Layout from "./page/LayoutLogin/layout";
import Detailpost from "./page/Detailpost/Detailpost";

const AppContent = () => {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* HOME: Hanya untuk yang sudah login */}
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

      {/* LOGIN: Hanya untuk yang belum login */}
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

      {/* DETAIL POST: Bisa diakses siapa saja (atau sesuaikan) */}
      <Route path="/detail/:id" element={<Detailpost />} />

      {/* CATCH ALL: Redirect jika route tidak ditemukan */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing Clerk Publishable Key. Check your .env file.");
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
