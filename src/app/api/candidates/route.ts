import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Candidate } from '@/interfaces/interfaces';

// Helper function to read data file
async function readDataFile() {
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  const fileContent = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContent);
}

// GET handler
export async function GET() {
  try {
    const jsonData = await readDataFile();
    
    return NextResponse.json(jsonData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: Request) {
  try {
    const newCandidate: Candidate = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'data.json');
    
    // Read current data
    const jsonData = await readDataFile();
    
    // Add new candidate to the beginning of the list
    jsonData.data.unshift(newCandidate);
    
    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    
    return NextResponse.json(newCandidate, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to create candidate' },
      { status: 500 }
    );
  }
}

// For Next.js 13+
export const dynamic = 'force-dynamic';
export const revalidate = 0;