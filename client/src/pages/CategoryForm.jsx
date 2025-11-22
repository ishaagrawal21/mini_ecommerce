import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory } from "../utills/apiHelper";
import { Box, TextField, Button, Stack, Alert } from "@mui/material";
import { useForm } from "react-hook-form";

export default function CategoryForm({ category, onDone }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    reset(
      category
        ? {
            name: category.name,
            description: category.description || "",
          }
        : { name: "", description: "" }
    );
  }, [category, reset]);

  const createMut = useMutation(createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      reset();
      if (onDone) onDone();
    },
  });

  const updateMut = useMutation(
    ({ id, payload }) => updateCategory({ id, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
        reset();
        if (onDone) onDone();
      },
    }
  );

  const onSubmit = (data) => {
    if (category) {
      updateMut.mutate({ id: category._id, payload: data });
    } else {
      createMut.mutate(data);
    }
  };

  const mutation = category ? updateMut : createMut;

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
            Category {category ? "updated" : "created"} successfully!
          </Alert>
        )}

        <TextField
          label="Category Name"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Description"
          multiline
          rows={3}
          {...register("description")}
        />

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

