"use client";

import { useState } from "react";
import { useFetchAdvocates } from "./hooks/useFetchAdvocates";
import { columns } from "../components/molecules/columns";
import { DataTable } from "@/components/molecules/data-table";
import { DataTableToolbar } from "@/components/molecules/data-table-toolbar";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  FilterFn,
} from "@tanstack/react-table";

// Custom filter function that searches across multiple fields
const customGlobalFilter: FilterFn<any> = (row, columnId, value) => {
  const searchValue = value.toLowerCase();
  
  // Get values from specific fields we want to search
  const firstName = String(row.getValue("firstName") || "").toLowerCase();
  const lastName = String(row.getValue("lastName") || "").toLowerCase();
  const city = String(row.getValue("city") || "").toLowerCase();
  const degree = String(row.getValue("degree") || "").toLowerCase();
  const phoneNumber = String(row.getValue("phoneNumber") || "").toLowerCase();
  
  // Get specialties array from the original row data
  const specialties = row.original.specialties || [];
  const hasMatchingSpecialty = Array.isArray(specialties) && 
    specialties.some((specialty: string) => 
      specialty.toLowerCase().includes(searchValue)
    );
  
  // Return true if any field contains the search value
  return (
    firstName.includes(searchValue) ||
    lastName.includes(searchValue) ||
    city.includes(searchValue) ||
    degree.includes(searchValue) ||
    phoneNumber.includes(searchValue) ||
    hasMatchingSpecialty
  );
};

export default function Home() {
  const { data: advocates = [], isLoading, error } = useFetchAdvocates();
  const [globalFilter, setGlobalFilter] = useState<string>("");

  // Initialize TanStack Table for global filtering
  const table = useReactTable({
    data: advocates,
    columns,
    filterFns: {
      customGlobalFilter,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: customGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Solace Advocates</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg font-medium">Loading advocates...</div>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <div className="text-lg font-medium">Error loading advocates</div>
            <div className="text-sm">{error.message}</div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <DataTableToolbar 
            table={table}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder="Search by name, city, degree, phone number, or specialty..."
          />
          <DataTable 
            columns={columns} 
            data={table.getFilteredRowModel().rows.map(row => row.original)} 
          />
        </div>
      )}
    </main>
  );
}
