export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 py-2.5 px-4 bg-background/90 backdrop-blur-sm border-t border-border/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium">Research Prototype</span>
        <span className="text-right">
          Not for Clinical Use · Synthetic Data Only
        </span>
      </div>
    </footer>
  );
};
