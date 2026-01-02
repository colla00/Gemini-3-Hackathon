import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Prevent flash and hydration issues
  if (!mounted) {
    return <>{children}</>;
  }
  
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
