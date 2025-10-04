"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Filter, X, Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  icon?: string
  color?: string
}

interface TransactionFiltersProps {
  categories: Category[]
  onApplyFilters: (filters: FilterState) => void
  activeFilters?: FilterState
}

export interface FilterState {
  startDate?: Date
  endDate?: Date
  categoryIds: string[]
  minAmount?: number
  maxAmount?: number
  direction?: 'in' | 'out' | 'all'
}

export function TransactionFilters({ categories, onApplyFilters, activeFilters }: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>(
    activeFilters || {
      categoryIds: [],
      direction: 'all'
    }
  )

  const handleApply = () => {
    onApplyFilters(filters)
    setIsOpen(false)
  }

  const handleClear = () => {
    const clearedFilters = {
      categoryIds: [],
      direction: 'all' as const
    }
    setFilters(clearedFilters)
    onApplyFilters(clearedFilters)
  }

  const toggleCategory = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }))
  }

  const activeFilterCount =
    (filters.startDate ? 1 : 0) +
    (filters.endDate ? 1 : 0) +
    (filters.categoryIds.length > 0 ? 1 : 0) +
    (filters.minAmount ? 1 : 0) +
    (filters.maxAmount ? 1 : 0) +
    (filters.direction && filters.direction !== 'all' ? 1 : 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative shrink-0 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
          <Filter className="h-4 w-4" strokeWidth={2.5} />
          {activeFilterCount > 0 && (
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
              {activeFilterCount}
            </div>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Transactions</SheetTitle>
          <SheetDescription>
            Refine your transaction list with these filters
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Transaction Type */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Transaction Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={filters.direction === 'all' ? 'default' : 'outline'}
                className={cn(
                  "h-10",
                  filters.direction === 'all' && "bg-indigo-600 hover:bg-indigo-700"
                )}
                onClick={() => setFilters({ ...filters, direction: 'all' })}
              >
                All
              </Button>
              <Button
                variant={filters.direction === 'out' ? 'default' : 'outline'}
                className={cn(
                  "h-10",
                  filters.direction === 'out' && "bg-red-600 hover:bg-red-700"
                )}
                onClick={() => setFilters({ ...filters, direction: 'out' })}
              >
                Expenses
              </Button>
              <Button
                variant={filters.direction === 'in' ? 'default' : 'outline'}
                className={cn(
                  "h-10",
                  filters.direction === 'in' && "bg-emerald-600 hover:bg-emerald-700"
                )}
                onClick={() => setFilters({ ...filters, direction: 'in' })}
              >
                Income
              </Button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Date Range</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-600 mb-1.5 block">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.startDate ? format(filters.startDate, "MMM dd, yyyy") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.startDate}
                      onSelect={(date) => setFilters({ ...filters, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1.5 block">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.endDate ? format(filters.endDate, "MMM dd, yyyy") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.endDate}
                      onSelect={(date) => setFilters({ ...filters, endDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Quick Date Presets */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => {
                  const today = new Date()
                  const lastWeek = new Date(today)
                  lastWeek.setDate(today.getDate() - 7)
                  setFilters({ ...filters, startDate: lastWeek, endDate: today })
                }}
              >
                Last 7 days
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => {
                  const today = new Date()
                  const lastMonth = new Date(today)
                  lastMonth.setDate(today.getDate() - 30)
                  setFilters({ ...filters, startDate: lastMonth, endDate: today })
                }}
              >
                Last 30 days
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => {
                  const today = new Date()
                  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
                  setFilters({ ...filters, startDate: startOfMonth, endDate: today })
                }}
              >
                This month
              </Button>
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <Label className="text-sm font-semibold mb-3 block">Categories</Label>
              <Card className="p-3 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={filters.categoryIds.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="flex-1 flex items-center gap-2 text-sm font-medium cursor-pointer"
                      >
                        {category.icon && <span>{category.icon}</span>}
                        <span>{category.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
              {filters.categoryIds.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  {filters.categoryIds.length} category selected
                </p>
              )}
            </div>
          )}

          {/* Amount Range */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Amount Range</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-600 mb-1.5 block">Min Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={filters.minAmount || ''}
                    onChange={(e) => setFilters({ ...filters, minAmount: parseFloat(e.target.value) || undefined })}
                    className="pl-6 w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1.5 block">Max Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={filters.maxAmount || ''}
                    onChange={(e) => setFilters({ ...filters, maxAmount: parseFloat(e.target.value) || undefined })}
                    className="pl-6 w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClear}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
          <Button
            onClick={handleApply}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
