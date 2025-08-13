"use client"

interface UserAvatarProps {
  name: string
  role: string
  size?: "sm" | "md" | "lg"
}

export function UserAvatar({ name, size = "md" }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium`}>
      {initials}
    </div>
  )
}
