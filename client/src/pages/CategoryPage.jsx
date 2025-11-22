import React, { useState } from "react";
import { Paper, Typography, Box, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";

export default function CategoryPage() {
  const [editingCategory, setEditingCategory] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setEditingCategory(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleDone = () => {
    handleClose();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
        Category Management
      </Typography>
      <Paper sx={{ p: { xs: 1, sm: 2 } }}>
        <CategoryList onEdit={handleEdit} onAddClick={handleOpen} />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          fontSize: "1.5rem",
          fontWeight: 600,
          pb: 2
        }}>
          <Typography variant="h6" component="span">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <CategoryForm category={editingCategory} onDone={handleDone} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

