"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { safeFetch } from "@/lib/utils/fetch"
import { logger } from "@/lib/utils/logger"
import { PageErrorBoundary } from "@/components/ui/page-error-boundary"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, FolderOpen, Tag } from "lucide-react"

interface Category {
  id: string
  name: string
  icon?: string
  color?: string
}

const ICON_OPTIONS = ['🍔', '🚗', '🏠', '💼', '🎬', '🛍️', '✈️', '💰', '🏥', '📚', '🎮', '💪']
const COLOR_OPTIONS = [
  '#FF5722', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0',
  '#F44336', '#00BCD4', '#8BC34A', '#FFC107', '#673AB7'
]

function CategoriesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    icon: '📁',
    color: '#2196F3',
  })

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    setUser(user)

    try {
      const data = await safeFetch<{ categories: Category[] }>('/api/categories')
      if (data) {
        setCategories(data.categories || [])
      }
    } catch (error) {
      logger.error('Error loading categories:', error)
    }

    setLoading(false)
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({ name: '', icon: '📁', color: '#2196F3' })
        setShowAddForm(false)
        await loadData()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to create category'}`)
      }
    } catch (error) {
      logger.error('Error creating category:', error)
      alert('Failed to create category')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-600">Organize your transactions</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            {showAddForm ? <X className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
            {showAddForm ? 'Cancel' : 'Add Category'}
          </Button>
        </div>

        {/* Add Category Form */}
        {showAddForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Category Name</Label>
                <Input
                  placeholder="e.g., Food & Dining"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Icon</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-3 text-2xl rounded-lg border-2 transition-all ${
                        formData.icon === icon
                          ? 'border-indigo-500 bg-indigo-50 scale-110'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Color</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`h-12 rounded-lg border-2 transition-all ${
                        formData.color === color
                          ? 'border-gray-900 scale-110'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600">
                Add Category
              </Button>
            </form>
          </Card>
        )}

        {/* Categories List */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Categories</h2>

          {categories.length === 0 ? (
            <Card className="p-8 text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No categories yet</p>
              <Button onClick={() => setShowAddForm(true)}>Add Your First Category</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="p-4 hover:shadow-lg transition-all cursor-pointer"
                  style={{ borderLeft: `4px solid ${category.color || '#2196F3'}` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{
                        backgroundColor: `${category.color}20`,
                        color: category.color
                      }}
                    >
                      {category.icon || '📁'}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">Category</p>
                    </div>
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Add Popular Categories */}
        {categories.length < 5 && (
          <Card className="p-6 mt-6 bg-gradient-to-br from-indigo-50 to-purple-50">
            <h3 className="font-bold text-gray-900 mb-3">💡 Quick Add Popular Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Food & Dining', icon: '🍔', color: '#FF5722' },
                { name: 'Transportation', icon: '🚗', color: '#2196F3' },
                { name: 'Shopping', icon: '🛍️', color: '#9C27B0' },
                { name: 'Entertainment', icon: '🎬', color: '#FF9800' },
              ].map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await fetch('/api/categories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(preset)
                      })
                      await loadData()
                    } catch (error) {
                      logger.error('Error adding preset:', error)
                    }
                  }}
                  className="justify-start"
                >
                  <span className="mr-2">{preset.icon}</span>
                  {preset.name}
                </Button>
              ))}
            </div>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  )
}


export default function CategoriesPageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <CategoriesPage />
    </PageErrorBoundary>
  )
}
