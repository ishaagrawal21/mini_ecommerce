import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createProduct, updateProduct, fetchCategories } from "../utills/apiHelper";
import {
  Box,
  TextField,
  Button,
  Stack,
  Alert,
  Input,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

export default function ProductForm({ product, onDone }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors }, control } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(product?.imageURL || "");

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery(["categories"], () => fetchCategories({}));

  useEffect(() => {
    if (product) {
      // Get category ID - handle both populated object and ObjectId string
      let categoryId = "";
      if (product.category) {
        if (typeof product.category === "object" && product.category._id) {
          categoryId = String(product.category._id);
        } else {
          categoryId = String(product.category);
        }
      }
      
      reset({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: categoryId,
        imageURL: product.imageURL || "",
      });
      // Handle image URL - use full URL if available, otherwise construct it
      const imageURL = product.imageURL || "";
      if (imageURL && !imageURL.startsWith("http")) {
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        setPreview(`${baseURL}${imageURL}`);
      } else {
        setPreview(imageURL);
      }
    } else {
      reset({
        name: "",
        description: "",
        price: "",
        category: "",
        imageURL: "",
      });
      setPreview("");
    }
    setSelectedFile(null);
  }, [product, reset]);

  const createMut = useMutation(
    (data) => createProduct(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["products"]);
        reset();
        setSelectedFile(null);
        setPreview("");
        if (onDone) onDone();
      },
    }
  );
  const updateMut = useMutation(
    ({ id, payload, isFormData }) => updateProduct({ id, payload, isFormData }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["products"]);
        reset();
        setSelectedFile(null);
        setPreview("");
        if (onDone) onDone();
      },
    }
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        e.target.value = ""; // Clear the input
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    data.price = Number(data.price);
    
    // Create FormData if file is selected
    if (selectedFile) {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("image", selectedFile);
      
      if (product) {
        updateMut.mutate({ id: product._id, payload: formData, isFormData: true });
      } else {
        createMut.mutate({ payload: formData, isFormData: true });
      }
    } else {
      // Use regular JSON if no file
      // Preserve imageURL when editing
      if (product) {
        const updateData = { ...data };
        if (!updateData.imageURL && product.imageURL) {
          updateData.imageURL = product.imageURL;
        }
        updateMut.mutate({ id: product._id, payload: updateData });
      } else {
        createMut.mutate(data);
      }
    }
  };

  const mutation = product ? updateMut : createMut;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {mutation.isError && (
          <Alert severity="error">
            {mutation.error?.response?.data?.message || "An error occurred"}
          </Alert>
        )}
        {mutation.isSuccess && (
          <Alert severity="success">
            Product {product ? "updated" : "created"} successfully!
          </Alert>
        )}

        <TextField
          label="Name"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Description"
          multiline
          rows={3}
          {...register("description", { required: "Description is required" })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <TextField
          label="Price"
          type="number"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price must be positive" },
          })}
          error={!!errors.price}
          helperText={errors.price?.message}
        />
        <FormControl fullWidth error={!!errors.category}>
          <InputLabel>Category</InputLabel>
          <Controller
            name="category"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <Select {...field} label="Category" value={field.value || ""}>
                {categoriesData?.result?.map((cat) => (
                  <MenuItem key={cat._id} value={String(cat._id)}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.category && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
              {errors.category.message}
            </Typography>
          )}
        </FormControl>
        
        <Box>
          <Typography variant="body2" gutterBottom>
            Product Image
          </Typography>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            sx={{ mb: 1 }}
            inputProps={{
              accept: "image/*",
            }}
          />
          {preview && (
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 1,
                mt: 1,
              }}
            />
          )}
          {!selectedFile && !preview && (
            <TextField
              label="Image URL (optional)"
              {...register("imageURL")}
              fullWidth
              sx={{ mt: 1 }}
            />
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            type="submit"
            variant="contained"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() => {
              reset();
              if (onDone) onDone();
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
