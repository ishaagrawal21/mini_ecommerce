import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, deleteProduct, fetchCategories } from "../utills/apiHelper";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  TextField,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function ProductList({ onEdit, onAddClick }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchParams, setSearchParams] = useState({ q: "", category: "", minPrice: "", maxPrice: "" });

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery(["categories"], () => fetchCategories({}));

  const { data, isLoading, error, refetch } = useQuery(
    ["products", searchParams],
    () =>
      fetchProducts({
        q: searchParams.q,
        category: searchParams.category,
        minPrice: searchParams.minPrice || undefined,
        maxPrice: searchParams.maxPrice || undefined,
      }),
    {
      refetchOnMount: true,
    }
  );

  // Load products on mount
  React.useEffect(() => {
    refetch();
  }, []);

  const handleSearch = () => {
    setSearchParams({
      q: search,
      category: category,
      minPrice: minPrice,
      maxPrice: maxPrice,
    });
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSearchParams({
      q: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  const deleteMut = useMutation((id) => deleteProduct(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    },
  });

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteMut.mutate(productToDelete._id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading products
      </Alert>
    );
  }

  return (
    <Box>
      {onAddClick && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            sx={{ minWidth: { xs: "100%", sm: "auto" } }}
          >
            Add Product
          </Button>
        </Box>
      )}
      <Stack spacing={2} mb={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            label="Search by name"
            size="small"
            sx={{ flex: 1, minWidth: 150 }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={handleSearch}
                    variant="contained"
                    size="small"
                    startIcon={<SearchIcon />}
                    sx={{ minWidth: 100 }}
                  >
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ flex: 1, minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => {
                setCategory(e.target.value);
                // Auto-trigger search when category changes
                setTimeout(() => {
                  setSearchParams({
                    q: search,
                    category: e.target.value,
                    minPrice: minPrice,
                    maxPrice: maxPrice,
                  });
                }, 0);
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categoriesData?.result?.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
          <TextField
            placeholder="Min Price"
            type="number"
            size="small"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
            }}
            inputProps={{ min: 0 }}
            sx={{ width: { xs: "100%", sm: 120 } }}
          />
          <Typography>-</Typography>
          <TextField
            placeholder="Max Price"
            type="number"
            size="small"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
            }}
            inputProps={{ min: 0 }}
            sx={{ width: { xs: "100%", sm: 120 } }}
          />
          <Button
            variant="outlined"
            onClick={handleSearch}
            sx={{ minWidth: { xs: "100%", sm: 100 } }}
          >
            Apply
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<RefreshIcon />}
            color="secondary"
            sx={{ minWidth: { xs: "100%", sm: 100 } }}
          >
            Reset
          </Button>
        </Stack>
      </Stack>

      {!data?.result || data?.result?.length === 0 ? (
        <Alert severity="info">No products found</Alert>
      ) : (
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          {data?.result?.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {product.imageURL && (
                  <Box
                    component="img"
                    src={
                      product.imageURL.startsWith("http")
                        ? product.imageURL
                        : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${product.imageURL}`
                    }
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    gutterBottom
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Chip
                    label={product.category?.name || product.category || "Uncategorized"}
                    size="small"
                    sx={{ mb: 1 }}
                    color="primary"
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "4.5em",
                    }}
                  >
                    {product.description || "No description"}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                    Rs {product.price?.toFixed(2) || "0.00"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(product);
                    }}
                    color="primary"
                    size="small"
                    aria-label="edit product"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(product);
                    }}
                    color="error"
                    size="small"
                    aria-label="delete product"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{productToDelete?.name}"? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMut.isLoading}
          >
            {deleteMut.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
