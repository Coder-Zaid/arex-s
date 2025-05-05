
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { useNavigate } from "react-router-dom"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const navigate = useNavigate()
  
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg cursor-pointer",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        onClick: () => {
          // Navigate to cart when toast is clicked
          navigate('/cart');
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

// Create a modified toast function that accepts a route parameter
export const toast = ({ route = '/cart', ...props }: any & { route?: string }) => {
  const { toast: originalToast } = require('sonner');
  return originalToast({
    ...props,
    onClick: () => {
      if (route) {
        window.location.href = route;
      }
    },
  });
};
