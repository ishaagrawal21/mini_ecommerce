import React, { useState } from "react";
import { Container, Box, CircularProgress } from "@mui/material";
import ProductsPage from "./pages/ProductsPage";
import CategoryPage from "./pages/CategoryPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("products");
  const { user, logout, loading } = useAuth();

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    logout();
    setCurrentPage("signin");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show auth pages if not logged in
  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {currentPage === "signup" ? (
          <SignUp onNavigate={handleNavigate} />
        ) : (
          <SignIn onNavigate={handleNavigate} />
        )}
      </Box>
    );
  }

  // Show main app if logged in
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        user={user}
      />
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 2, sm: 4 }, 
          px: { xs: 1, sm: 2 },
          flex: 1,
        }}
      >
        {currentPage === "products" && <ProductsPage />}
        {currentPage === "categories" && <CategoryPage />}
      </Container>
      <Footer />
    </Box>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
