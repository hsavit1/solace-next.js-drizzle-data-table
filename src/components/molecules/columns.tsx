"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Advocate } from "@/types"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

// Helper function to format phone numbers
const formatPhoneNumber = (phoneNumber: string | number | unknown): string => {
  // Convert to string and remove any non-digit characters
  const cleaned = String(phoneNumber).replace(/\D/g, '');
  
  // Check if the input is valid
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  // If the phone number doesn't match the expected format, return the original
  return String(phoneNumber);
};

export const columns: ColumnDef<Advocate>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
  },
  {
    accessorKey: "city",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          City
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("city")}</div>,
  },
  {
    accessorKey: "degree",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Degree
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("degree")}</div>,
  },
  {
    accessorKey: "specialties",
    header: "Specialties",
    cell: ({ row }) => {
      const specialties = row.original.specialties;
      return (
        <div className="space-y-1">
          <ul className="list-disc list-inside">
            {Array.isArray(specialties) && specialties.map((specialty: string, idx: number) => (
              <li key={`${specialty}-${idx}`} className="text-xs text-secondary-foreground">
                {specialty}
              </li>
            ))}
          </ul>
        </div>
      );
    },
  },
  {
    accessorKey: "yearsOfExperience",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Years of Experience
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("yearsOfExperience")}</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      const phoneNumber = row.getValue("phoneNumber");
      return <div>{formatPhoneNumber(phoneNumber)}</div>;
    },
  },
] 