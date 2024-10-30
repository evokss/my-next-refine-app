import React from "react";
import { Typography, Box, Button } from "@mui/material";
import Link from "next/link";

const Home = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    padding={4}
    margin="20px auto"
    bgcolor="background.paper"
    border={1}
    borderColor="divider" 
    borderRadius={2}
    boxShadow={2}
    maxWidth={600}
  >
    <Typography variant="h4" align="center" gutterBottom sx={{color: 'primary.main', m: 4}}>
      Welcome to the Test Candidate Management App!
    </Typography>
    <Typography variant="body1" align="center" paragraph>
      The Memposit NextJS Refine Test application is a streamlined frontend solution developed using Next.js and Refine. 
    </Typography>
    <Typography variant="body1" align="center" paragraph>
      This simple app enables users to view a Candidate List, access individual Candidate Pages, and create new Candidates.
    </Typography>
    <Typography variant="body1" align="center" paragraph>
      I hope you enjoy this journey! Let's get started!
    </Typography>
    <Link href="/candidates" passHref>
      <Button
        variant="contained"
        color="primary"
        sx={{ 
          color: 'primary.contrastText',
          mt: 2 }}
        >
        View Candidates List
      </Button>
    </Link>
  </Box>
);

export default Home;
