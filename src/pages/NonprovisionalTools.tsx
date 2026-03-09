import { SiteLayout } from "@/components/layout/SiteLayout";
import { NonprovisionalTools } from "@/components/patent/NonprovisionalTools";

export default function NonprovisionalPage() {
  return (
    <SiteLayout
      title="Nonprovisional Patent Conversion Tools | VitaSignal"
      description="Preparation tools for converting 11 provisional patent applications to nonprovisional filings."
    >
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <NonprovisionalTools />
        </div>
      </section>
    </SiteLayout>
  );
}
