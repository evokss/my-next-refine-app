'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormHelperText,
  Paper,
} from "@mui/material";
import { Candidate } from "@/interfaces/interfaces";

const SENIORITY_LEVELS = ["Junior", "Middle", "Senior", "Lead"];
const AVAILABLE_SKILLS = ["React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Python", "Java", "C#", "SQL"];

type FormErrors = {
  [K in keyof Candidate]: string;
};

export function CreateCandidateForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Candidate>>({
    first_name: "",
    last_name: "",
    job_title: "",
    seniority_level: "",
    skills: [],
  });
  
  // FormErrors type for errors state
  const [errors, setErrors] = useState<Partial<FormErrors>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    // Use FormErrors type for newErrors
    const newErrors: Partial<FormErrors> = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name?.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.job_title?.trim()) {
      newErrors.job_title = "Job title is required";
    }
    if (!formData.seniority_level) {
      newErrors.seniority_level = "Seniority level is required";
    }
    if (!formData.skills?.length) {
      newErrors.skills = "At least one skill is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add cache control headers to prevent caching
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          ...formData
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create candidate');
      }

      // Wait for the response to complete before navigation
      await response.json();
      
      // Force a revalidation of the candidates data
      await fetch('/api/candidates', { 
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' }
      });

      // Refresh the router cache before navigation
      router.refresh();
      
      // Small delay to ensure refresh completes
      setTimeout(() => {
        router.push('/candidates');
      }, 100);
      
    } catch (error) {
      console.error('Error creating candidate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="First Name"
          value={formData.first_name || ''}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          error={!!errors.first_name}
          helperText={errors.first_name}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Last Name"
          value={formData.last_name || ''}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          error={!!errors.last_name}
          helperText={errors.last_name}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Job Title"
          value={formData.job_title || ''}
          onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
          error={!!errors.job_title}
          helperText={errors.job_title}
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal" error={!!errors.seniority_level} required>
          <InputLabel>Seniority Level</InputLabel>
          <Select
            value={formData.seniority_level || ''}
            onChange={(e) => setFormData({ ...formData, seniority_level: e.target.value })}
            label="Seniority Level"
          >
            {SENIORITY_LEVELS.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
          {errors.seniority_level && (
            <FormHelperText>{errors.seniority_level}</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.skills} required>
          <InputLabel>Skills</InputLabel>
          <Select
            multiple
            value={formData.skills || []}
            onChange={(e) => setFormData({
              ...formData,
              skills: typeof e.target.value === 'string' 
                ? e.target.value.split(',')
                : e.target.value,
            })}
            input={<OutlinedInput label="Skills" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {AVAILABLE_SKILLS.map((skill) => (
              <MenuItem key={skill} value={skill}>
                {skill}
              </MenuItem>
            ))}
          </Select>
          {errors.skills && (
            <FormHelperText>{errors.skills}</FormHelperText>
          )}
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{color: 'primary.contrastText'}}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Candidate'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/candidates')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
