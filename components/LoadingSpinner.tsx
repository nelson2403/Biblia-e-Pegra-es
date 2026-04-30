export function LoadingSpinner({ fullScreen = true }: { fullScreen?: boolean }) {
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
    </div>
  )
}
