import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props} 
            className="fixed top-4 right-4 bg-green-500 text-white border-green-600 py-2 px-4 w-auto max-w-sm"
          >
            <div className="grid gap-1">
              {title && <ToastTitle className="text-sm font-semibold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-xs">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="absolute right-1 top-1 rounded-md p-1 text-white opacity-60 transition-opacity hover:opacity-100" />
          </Toast>
        )
      })}
      <ToastViewport className="fixed top-4 right-4 flex flex-col gap-2 w-full max-w-[420px] z-[9999]" />
    </ToastProvider>
  )
}