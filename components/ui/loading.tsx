import { Spinner } from "./spinner"

interface LoadingProps {
  message?: string
  size?: "sm" | "md" | "lg"
  fullScreen?: boolean
}

export function Loading({ 
  message = "加载中...", 
  size = "lg",
  fullScreen = true 
}: LoadingProps) {
  const content = (
    <div className="text-center">
      <Spinner size={size} className="mx-auto mb-4 text-primary" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}
