"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the Advocate type to fix TypeScript errors
interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: string;
  phoneNumber: string;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    console.log("filtering advocates...");
    const filtered = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(newSearchTerm) ||
        advocate.lastName.includes(newSearchTerm) ||
        advocate.city.includes(newSearchTerm) ||
        advocate.degree.includes(newSearchTerm) ||
        advocate.specialties.includes(newSearchTerm) ||
        advocate.yearsOfExperience.includes(newSearchTerm)
      );
    });

    setFilteredAdvocates(filtered);
  };

  const handleReset = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
    setSearchTerm("");
  };

  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Solace Advocates</h1>
      
      <div className="mb-8">
        <p className="text-sm font-medium mb-2">Search</p>
        <p className="text-sm mb-2">
          Searching for: <span className="font-medium">{searchTerm}</span>
        </p>
        <div className="flex gap-2">
          <Input 
            value={searchTerm}
            onChange={handleChange} 
          />
          <Button 
            onClick={handleReset}
          >
            Reset Search
          </Button>
        </div>
      </div>
      
      <Table>
        <TableCaption>List of Solace Advocates</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Degree</TableHead>
            <TableHead>Specialties</TableHead>
            <TableHead>Years of Experience</TableHead>
            <TableHead>Phone Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAdvocates.map((advocate, index) => (
            <TableRow key={`${advocate.firstName}-${advocate.lastName}-${index}`}>
              <TableCell>{advocate.firstName}</TableCell>
              <TableCell>{advocate.lastName}</TableCell>
              <TableCell>{advocate.city}</TableCell>
              <TableCell>{advocate.degree}</TableCell>
              <TableCell>
                {advocate.specialties.map((specialty, idx) => (
                  <div key={`${specialty}-${idx}`}>{specialty}</div>
                ))}
              </TableCell>
              <TableCell>{advocate.yearsOfExperience}</TableCell>
              <TableCell>{advocate.phoneNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
