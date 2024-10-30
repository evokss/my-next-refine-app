import { Box, Typography } from "@mui/material";
import { CreateCandidateForm } from "./create-from";

export default function CreateCandidatePage() {
  return (
    <Box sx={{ margin: 2 }}>
      <Typography variant="h4" gutterBottom sx={{color: 'primary.main', textAlign: 'center', mb: 4, mt: 8}}>
        Create New Candidate
      </Typography>
      <CreateCandidateForm />
    </Box>
  );
}