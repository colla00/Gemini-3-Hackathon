import { Mail, Phone } from 'lucide-react';

const contacts = [
  { label: 'For Licensing Inquiries', email: 'info@vitasignal.ai' },
  { label: 'For Research Collaborations', email: 'info@vitasignal.ai' },
  { label: 'For Media & Press', email: 'info@vitasignal.ai' },
  { label: 'General Inquiries', email: 'info@vitasignal.ai' },
];

export const ContactSection = () => (
  <section className="py-20 px-6">
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
        Contact
      </h3>
      <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-12" />

      <div className="grid sm:grid-cols-2 gap-6">
        {contacts.map((contact) => (
          <div key={contact.email} className="p-5 rounded-xl bg-card border border-border/50">
            <p className="text-xs font-medium text-muted-foreground mb-1">{contact.label}</p>
            <a
              href={`mailto:${contact.email}`}
              className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              {contact.email}
            </a>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground">
        <Phone className="w-4 h-4 text-primary" />
        <a href="tel:+18883468206" className="font-semibold text-primary hover:underline">(888) 346-8206</a>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-3">
        Response Time: 2-3 business days
      </p>
    </div>
  </section>
);
