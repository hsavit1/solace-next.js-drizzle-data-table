"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
  globalFilter: string
  setGlobalFilter: (value: string) => void
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  globalFilter,
  setGlobalFilter,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full"
          />
          {globalFilter && (
            <Button
              variant="ghost"
              onClick={() => setGlobalFilter("")}
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 