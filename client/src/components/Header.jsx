import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

export default function Header({ currentPage, onNavigate, onLogout, user }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleNavigation = (page) => {
    handleMobileMenuClose();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleLogout = () => {
    handleMenuClose();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <ShoppingCartIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Mini E-Commerce
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => onNavigate("products")}
              variant={currentPage === "products" ? "outlined" : "text"}
              sx={{ mr: 1 }}
            >
              Products
            </Button>
            <Button
              color="inherit"
              onClick={() => onNavigate("categories")}
              variant={currentPage === "categories" ? "outlined" : "text"}
              sx={{ mr: 1 }}
            >
              Categories
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          {isMobile && (
            <>
              <IconButton
                color="inherit"
                onClick={handleMobileMenuOpen}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMobileMenuClose}
                PaperProps={{
                  sx: {
                    minWidth: 200,
                    mt: 1,
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  onClick={() => handleNavigation("products")}
                  selected={currentPage === "products"}
                >
                  Products
                </MenuItem>
                <MenuItem
                  onClick={() => handleNavigation("categories")}
                  selected={currentPage === "categories"}
                >
                  Categories
                </MenuItem>
              </Menu>
            </>
          )}

          {/* User Menu */}
          {user && (
            <>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ mr: 1 }}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    minWidth: 200,
                    maxHeight: "calc(100vh - 64px)",
                    mt: 1,
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem disabled>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                    <AccountCircleIcon />
                    <Typography variant="body2">{user.name}</Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

