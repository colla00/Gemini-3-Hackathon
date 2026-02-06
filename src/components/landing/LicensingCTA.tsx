import { Mail } from 'lucide-react';

export const LicensingCTA = () => (
  <section className="py-20 px-6 bg-primary text-primary-foreground">
    <div className="max-w-4xl mx-auto text-center">
      <h3 className="text-2xl md:text-3xl font-bold mb-4">
        Licensing & Partnerships
      </h3>
      <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
        VitaSignal is available for licensing to EHR vendors, hospital systems,
        healthcare AI companies, and strategic investors.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="mailto:licensing@dralexis.ceo"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-xl font-semibold hover:bg-primary-foreground/90 transition-colors shadow-lg"
        >
          <Mail className="w-5 h-5" aria-hidden="true" />
          Licensing Inquiries
        </a>
        <a
          href="mailto:contact@dralexis.ceo"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground/10 text-primary-foreground rounded-xl font-semibold border-2 border-primary-foreground/30 hover:bg-primary-foreground/20 transition-colors"
        >
          General Contact
        </a>
      </div>
    </div>
  </section>
);
