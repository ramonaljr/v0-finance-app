"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Card } from "@/components/ui/card"
import {
  AlertCircle,
  TrendingUp,
  Calendar,
  CreditCard,
  CheckCircle2,
  X
} from "lucide-react"

export interface Notification {
  id: string
  type: 'warning' | 'info' | 'success' | 'alert'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

const NOTIFICATION_ICONS = {
  warning: AlertCircle,
  info: TrendingUp,
  success: CheckCircle2,
  alert: Calendar,
}

const NOTIFICATION_COLORS = {
  warning: {
    bg: "bg-red-50",
    icon: "bg-gradient-to-br from-red-500 to-red-600",
    glow: "shadow-red-500/20",
    text: "text-red-600"
  },
  info: {
    bg: "bg-blue-50",
    icon: "bg-gradient-to-br from-blue-500 to-blue-600",
    glow: "shadow-blue-500/20",
    text: "text-blue-600"
  },
  success: {
    bg: "bg-green-50",
    icon: "bg-gradient-to-br from-green-500 to-green-600",
    glow: "shadow-green-500/20",
    text: "text-green-600"
  },
  alert: {
    bg: "bg-amber-50",
    icon: "bg-gradient-to-br from-amber-500 to-amber-600",
    glow: "shadow-amber-500/20",
    text: "text-amber-600"
  },
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const dismissNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error('Failed to dismiss notification:', error)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl">
          <Bell className="h-5 w-5" strokeWidth={2.5} />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs border-2 border-white"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Notifications</SheetTitle>
          <SheetDescription>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up!'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-600">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">No notifications yet</p>
              <p className="text-sm text-gray-500">We'll notify you when something needs your attention</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = NOTIFICATION_ICONS[notification.type]
              const colors = NOTIFICATION_COLORS[notification.type]

              return (
                <Card
                  key={notification.id}
                  className={`p-4 rounded-2xl ${!notification.read ? 'border-l-4 border-l-indigo-500' : ''} cursor-pointer hover:shadow-lg transition-all`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.icon} shadow-lg ${colors.glow} border-2 border-white`}>
                      <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-gray-900">{notification.title}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            dismissNotification(notification.id)
                          }}
                        >
                          <X className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-700 mt-1">{notification.message}</p>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-600 font-medium">
                          {formatTimestamp(notification.timestamp)}
                        </p>

                        {notification.actionUrl && notification.actionLabel && (
                          <Button
                            variant="link"
                            size="sm"
                            className={`h-auto p-0 ${colors.text} font-semibold`}
                            onClick={(e) => {
                              e.stopPropagation()
                              window.location.href = notification.actionUrl!
                            }}
                          >
                            {notification.actionLabel} →
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {notifications.length > 0 && (
          <Button
            variant="ghost"
            className="w-full mt-4 font-semibold"
            onClick={() => {
              notifications.forEach(n => {
                if (!n.read) markAsRead(n.id)
              })
            }}
          >
            Mark all as read
          </Button>
        )}
      </SheetContent>
    </Sheet>
  )
}
