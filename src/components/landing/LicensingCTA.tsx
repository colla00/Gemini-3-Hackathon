import { Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const LicensingCTA = () => (
  <section className="py-20 px-6 bg-primary">
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto text-center"
    >
      <h2 className="font-display text-2xl md:text-3xl text-primary-foreground mb-4">
        Licensing & Partnerships
      </h2>
      <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
        VitaSignal is available for licensing to EHR vendors, hospital systems,
        healthcare AI companies, and strategic investors.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="secondary" size="lg" className="text-base" asChild>
          <a href="mailto:info@alexiscollier.com" className="gap-2">
            <Mail className="w-5 h-5" />
            Licensing Inquiries
          </a>
        </Button>
        <Button variant="secondary" size="lg" className="text-base" asChild>
          <Link to="/licensing" className="gap-2">
            View Options
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  </section>
);
