import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories, deleteCategory } from "../utills/apiHelper";
import {
  Box,
  TextField,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function CategoryList({ onEdit, onAddClick }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams, setSearchParams] = useState({ q: "" });

  const { data, isLoading, error } = useQuery(
    ["categories", searchParams],
    () => fetchCategories({ q: searchParams.q }),
    {
      refetchOnMount: true,
    }
  );

  // Load categories on mount
  React.useEffect(() => {
    setSearchParams({ q: "" });
  }, []);

  const handleSearch = () => {
    setSearchParams({ q: search });
  };

  const handleReset = () => {
    setSearch("");
    setSearchParams({ q: "" });
  };

  const deleteMut = useMutation((id) => deleteCategory(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    },
  });

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteMut.mutate(categoryToDelete._id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
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
        Error loading categories
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
            Add Category
          </Button>
        </Box>
      )}
      <Stack direction="row" spacing={1} mb={2}>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          label="Search categories"
          size="small"
          fullWidth
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          sx={{ minWidth: 120 }}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          onClick={handleReset}
          startIcon={<RefreshIcon />}
          color="secondary"
          sx={{ minWidth: 120 }}
        >
          Reset
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!data?.result || data?.result?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              data?.result?.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {category.description
                      ? category.description.length > 50
                        ? `${category.description.substring(0, 50)}...`
                        : category.description
                      : "-"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      edge="end"
                      onClick={() => onEdit(category)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteClick(category)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{categoryToDelete?.name}"? This
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

