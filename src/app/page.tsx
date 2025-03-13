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
import { useFetchAdvocates } from "./hooks/useFetchAdvocates";
import { Advocate } from "@/types";

export default function Home() {
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: advocates = [], isLoading, error } = useFetchAdvocates();

  // Initialize filtered advocates when data is loaded
  useEffect(() => {
    if (advocates.length > 0) {
      setFilteredAdvocates(advocates);
    }
  }, [advocates]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    if (!newSearchTerm.trim()) {
      setFilteredAdvocates(advocates);
      return;
    }

    const filtered = advocates.filter((advocate) => {
      const searchTermLower = newSearchTerm.toLowerCase();
      return (
        advocate.firstName.toLowerCase().includes(searchTermLower) ||
        advocate.lastName.toLowerCase().includes(searchTermLower) ||
        advocate.city.toLowerCase().includes(searchTermLower) ||
        advocate.degree.toLowerCase().includes(searchTermLower) ||
        (Array.isArray(advocate.specialties) && advocate.specialties.some((specialty: string) => 
          specialty.toLowerCase().includes(searchTermLower)
        )) ||
        advocate.yearsOfExperience.toString().includes(newSearchTerm)
      );
    });

    setFilteredAdvocates(filtered);
  };

  const handleReset = () => {
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
            placeholder="Search by name, city, degree, or specialty"
          />
          <Button 
            onClick={handleReset}
          >
            Reset Search
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading advocates...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Error loading advocates: {error.message}</div>
      ) : (
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
              <TableRow key={advocate.id || index}>
                <TableCell>{advocate.firstName}</TableCell>
                <TableCell>{advocate.lastName}</TableCell>
                <TableCell>{advocate.city}</TableCell>
                <TableCell>{advocate.degree}</TableCell>
                <TableCell>
                  {Array.isArray(advocate.specialties) && advocate.specialties.map((specialty: string, idx: number) => (
                    <div key={`${specialty}-${idx}`}>{specialty}</div>
                  ))}
                </TableCell>
                <TableCell>{advocate.yearsOfExperience}</TableCell>
                <TableCell>{advocate.phoneNumber.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
