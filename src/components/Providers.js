"use client";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: { background: "oklch(var(--b1))", color: "oklch(var(--bc))", border: "1px solid oklch(var(--b3))", borderRadius: "14px", fontWeight: 500 },
          }}
        />
      </WishlistProvider>
    </AuthProvider>
  );
}
