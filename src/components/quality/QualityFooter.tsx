export const QualityFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 py-3 px-4 bg-background/95 backdrop-blur-sm border-t border-border/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="font-semibold text-primary">Research-Stage Prototype</span>
        <span className="hidden sm:inline">|</span>
        <span>No live EHR connection</span>
        <span className="hidden sm:inline">|</span>
        <span>Requires human oversight</span>
      </div>
    </footer>
  );
};
