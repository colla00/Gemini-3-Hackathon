export const AboutInventor = () => (
  <section className="py-20 px-6">
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
        About the Inventor
      </h3>
      <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-10" />

      <div className="p-8 rounded-2xl bg-card border border-border/50">
        <h4 className="text-xl font-bold text-foreground mb-4">
          Dr. Alexis M. Collier, DHA, RN
        </h4>

        <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span><strong className="text-foreground">NIH CLINAQ Fellow</strong> (K12 HL138039-06)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span><strong className="text-foreground">AIM-AHEAD Researcher</strong> (1OT2OD032581, $55,475)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span><strong className="text-foreground">Stanford AI+Health Presenter</strong> (December 2025)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span><strong className="text-foreground">Sole Inventor:</strong> 5 U.S. provisional patent applications filed (2025-2026)</span>
          </li>
        </ul>

        <p className="text-sm text-muted-foreground mb-4">
          Dr. Collier specializes in equipment-independent clinical AI systems validated
          on large-scale datasets. Research focuses on temporal pattern analysis,
          clinical phenotype discovery, and equity in algorithmic decision-making.
        </p>

        <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
          <p className="text-xs font-semibold text-foreground mb-1">Affiliations:</p>
          <p className="text-xs text-muted-foreground">
            University of North Georgia, College of Health Sciences & Professions
            <br />NIH CLINAQ Fellowship Program • AIM-AHEAD Consortium
          </p>
        </div>
      </div>
    </div>
  </section>
);
