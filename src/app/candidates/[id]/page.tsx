import { notFound } from "next/navigation";
import { Candidate } from "@interfaces/interfaces";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
} from "@mui/material";
import Link from "next/link";

async function getCandidate(id: string): Promise<Candidate | null> {
  try {
    const res = await fetch('http://localhost:3000/data.json');
    
    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.status}`);
    }

    const jsonData = await res.json();
    return jsonData.data.find((candidate: Candidate) => candidate.id === id) || null;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default async function CandidatePage({
  params,
}: {
  params: { id: string };
}) {
  const candidate = await getCandidate(params.id);

  if (!candidate) {
    notFound();
  }

  return (
    <Box sx={{ margin: 2 }}>
      <Link href="/candidates" passHref>
        <Button variant="outlined" sx={{ marginBottom: 2 }}>
          Back to List
        </Button>
      </Link>
      
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {candidate.first_name} {candidate.last_name}
          </Typography>
          
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {candidate.job_title}
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            Seniority Level: {candidate.seniority_level}
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Skills
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {candidate.skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                variant="outlined"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
