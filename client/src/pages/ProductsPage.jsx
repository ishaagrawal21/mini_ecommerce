import React, { useState } from "react";
import { Paper, Box, Typography, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

export default function ProductsPage() {
  const [editingProduct, setEditingProduct] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setEditingProduct(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setOpen(true);
  };

  const handleDone = () => {
    handleClose();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
        Product Management
      </Typography>
      <Paper sx={{ p: { xs: 1, sm: 2 } }}>
        <ProductList onEdit={handleEdit} onAddClick={handleOpen} />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          fontSize: "1.5rem",
          fontWeight: 600,
          pb: 2
        }}>
          <Typography variant="h6" component="span">
            {editingProduct ? "Edit Product" : "Add New Product"}
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
          <ProductForm product={editingProduct} onDone={handleDone} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
