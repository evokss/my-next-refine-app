import { GetListResponse } from "@refinedev/core";
import { Candidate } from "@interfaces/interfaces";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import Link from "next/link";

// Ensure page is dynamic
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

async function getCandidates(): Promise<GetListResponse<Candidate>> {
  try {
    const res = await fetch('http://localhost:3000/data.json');

    // Check if the response status is OK (200-299)
    if (!res.ok) {
      throw new Error(`Failed to fetch candidates: ${res.statusText}`);
    }

    const jsonData = await res.json();

    // Validate that jsonData has the expected structure
    if (!jsonData.data || !Array.isArray(jsonData.data)) {
      throw new Error('Invalid data structure');
    }

    return {
      data: jsonData.data,
      total: jsonData.data.length,
    };
  } catch (error) {
    console.error('Error fetching candidates:', error);
    // Return an empty response or handle the error as needed
    return {
      data: [],
      total: 0,
    };
  }
}

export default async function CandidatesPage() {
  const candidates = await getCandidates();

  return (
    <Box sx={{ margin: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        m: 2,
        }}>
        <Link href="/candidates/create" passHref>
          <Button variant="contained" sx={{color: 'primary.contrastText'}}>
            Create New Candidate
          </Button>
        </Link>
      </Box>

      <Paper elevation={2} sx={{ 
        margin: 2, 
        padding: 2,
        backgroundColor: 'background.paper',
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Seniority Level</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.data.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <Link 
                    href={`/candidates/${candidate.id}`} passHref>
                    <Button variant="text" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      {candidate.first_name} {candidate.last_name}
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>{candidate.job_title}</TableCell>
                <TableCell>{candidate.seniority_level}</TableCell>
                <TableCell>
                  {candidate.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{ 
                        margin: 0.5,
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                      }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Link href={`/candidates/${candidate.id}`} passHref>
                    <Button 
                      variant="contained"
                      sx={{
                        color: 'primary.contrastText',
                      }}
                      >
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
