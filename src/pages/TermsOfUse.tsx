import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, AlertTriangle, Scale, Lock, List } from 'lucide-react';
import { ResearchDisclaimer } from '@/components/ResearchDisclaimer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms', icon: Scale },
  { id: 'research', title: '2. Research Prototype Notice', icon: AlertTriangle },
  { id: 'intellectual-property', title: '3. Intellectual Property Rights', icon: Lock },
  { id: 'monitoring', title: '4. Access Monitoring', icon: Shield },
  { id: 'confidentiality', title: '5. Confidentiality', icon: Lock },
  { id: 'warranties', title: '6. Disclaimer of Warranties', icon: Shield },
  { id: 'liability', title: '7. Limitation of Liability', icon: Shield },
  { id: 'indemnification', title: '8. Indemnification', icon: Shield },
  { id: 'governing-law', title: '9. Governing Law', icon: Scale },
  { id: 'contact', title: '10. Contact Information', icon: FileText },
];

export const TermsOfUse = () => {
  const [activeSection, setActiveSection] = useState('');
  const [showToc, setShowToc] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => ({
        id: s.id,
        element: document.getElementById(s.id)
      }));

      for (const section of sectionElements.reverse()) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ResearchDisclaimer />
      
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowToc(!showToc)}
              className="lg:hidden"
            >
              <List className="w-4 h-4 mr-2" />
              TOC
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 flex gap-8">
        {/* Table of Contents - Sidebar */}
        <aside className={cn(
          "w-64 shrink-0 hidden lg:block",
          showToc ? "block" : "hidden"
        )}>
          <div className="sticky top-24 space-y-2">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <List className="w-4 h-4" />
              Table of Contents
            </h2>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                    activeSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile TOC */}
        {showToc && (
          <div className="lg:hidden fixed inset-x-0 top-[73px] z-30 bg-background border-b border-border p-4">
            <nav className="grid grid-cols-2 gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    scrollToSection(section.id);
                    setShowToc(false);
                  }}
                  className={cn(
                    "text-left px-3 py-2 text-xs rounded-lg transition-colors",
                    activeSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Terms of Use</h1>
              <p className="text-muted-foreground">Last Updated: December 2024</p>
            </div>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
            
            {/* Acceptance */}
            <section id="acceptance" className="scroll-mt-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Scale className="w-5 h-5 text-primary" />
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground">
                By accessing or using the NSO Quality Dashboard ("Software"), you agree to be bound by these Terms of Use. 
                If you do not agree to these terms, you may not access or use the Software.
              </p>
            </section>

            {/* Research Prototype Notice */}
            <section id="research" className="scroll-mt-24 p-6 rounded-xl bg-destructive/5 border border-destructive/30">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                2. Research Prototype — Not for Clinical Use
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="font-medium text-foreground">
                  THIS SOFTWARE IS A RESEARCH PROTOTYPE PROVIDED FOR EDUCATIONAL AND DEMONSTRATION PURPOSES ONLY.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Not FDA Cleared or Approved:</strong> This software has not been cleared or approved by the 
                    U.S. Food and Drug Administration (FDA) or any other regulatory body.
                  </li>
                  <li>
                    <strong>Not a Medical Device:</strong> This software is not a medical device as defined under 
                    21 CFR Part 820 and is not intended to be used as such.
                  </li>
                  <li>
                    <strong>Not for Clinical Decision-Making:</strong> This software is not intended for diagnosis, 
                    treatment, cure, mitigation, or prevention of any disease or medical condition.
                  </li>
                  <li>
                    <strong>Simulated Data Only:</strong> All patient data, risk scores, and predictions displayed 
                    are simulated and do not represent real patients or actual clinical outcomes.
                  </li>
                  <li>
                    <strong>Human Judgment Required:</strong> Any clinical decisions must be made by qualified 
                    healthcare professionals using their independent clinical judgment.
                  </li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section id="intellectual-property" className="scroll-mt-24 p-6 rounded-xl bg-primary/5 border border-primary/30">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Lock className="w-5 h-5 text-primary" />
                3. Intellectual Property Rights
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>Copyright:</strong> © 2024–2026 Dr. Alexis Collier. All rights reserved. The Software, including 
                  its design, code, methodologies, algorithms, user interfaces, and documentation, is protected by 
                  copyright law and international treaties.
                </p>
                <p>
                  <strong>Patents Filed:</strong> This technology is protected by 5 U.S. provisional patent applications. 
                  Patent filing status provides notice of patent rights.
                </p>
                <p>
                  <strong>Restrictions:</strong> You may not, without prior written consent:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Copy, modify, or distribute the Software or its source code</li>
                  <li>Reverse engineer, decompile, or disassemble the Software</li>
                  <li>Remove or alter any proprietary notices or labels</li>
                  <li>Use the Software for any commercial purpose</li>
                  <li>Create derivative works based on the Software</li>
                  <li>Screenshot, record, or capture any portion of the interface without authorization</li>
                  <li>Share access credentials with unauthorized parties</li>
                </ul>
              </div>
            </section>

            {/* Access Monitoring & Evidence Collection */}
            <section id="monitoring" className="scroll-mt-24 p-6 rounded-xl bg-accent/5 border border-accent/30">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Shield className="w-5 h-5 text-accent-foreground" />
                4. Access Monitoring & Evidence Collection
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>Session Tracking:</strong> By accessing this Software, you acknowledge and consent to the 
                  collection and storage of access logs, including but not limited to: timestamps of access, 
                  pages viewed, duration of sessions, and user identification information.
                </p>
                <p>
                  <strong>Watermarking:</strong> All views of the Software include visible and invisible watermarks 
                  containing user identification. Screenshots or recordings may be traced back to the viewing user.
                </p>
                <p>
                  <strong>Evidence Preservation:</strong> Access logs are maintained for patent enforcement and 
                  intellectual property protection purposes. These records may be used as evidence in any 
                  legal proceedings related to unauthorized use or infringement.
                </p>
                <p>
                  <strong>Audit Trail:</strong> All significant actions within the Software are logged and 
                  timestamped. This audit trail serves as a forensic record of access and usage patterns.
                </p>
              </div>
            </section>

            {/* Confidentiality */}
            <section id="confidentiality" className="scroll-mt-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Lock className="w-5 h-5 text-primary" />
                5. Confidentiality Obligations
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  By accessing this Software, you agree to treat all information, methodologies, algorithms, 
                  user interfaces, and technical specifications as confidential information. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Not disclose any aspect of the Software to third parties</li>
                  <li>Not discuss technical details, algorithms, or methodologies publicly</li>
                  <li>Protect access credentials with the same degree of care as your own confidential information</li>
                  <li>Immediately notify the author of any unauthorized access or disclosure</li>
                  <li>Return or destroy any materials containing confidential information upon request</li>
                </ul>
                <p className="font-medium text-foreground">
                  Breach of confidentiality may result in immediate termination of access and legal action.
                </p>
              </div>
            </section>

            {/* Disclaimer of Warranties */}
            <section id="warranties" className="scroll-mt-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mt-0">
                <Shield className="w-5 h-5 text-primary" />
                6. Disclaimer of Warranties
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="uppercase font-medium text-foreground text-sm">
                  THE SOFTWARE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
                  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
                  ACCURACY, COMPLETENESS, AND NON-INFRINGEMENT.
                </p>
                <p>
                  The author makes no warranty that: (a) the Software will meet your requirements; (b) the Software 
                  will be uninterrupted, timely, secure, or error-free; (c) the results obtained from the Software 
                  will be accurate or reliable; or (d) any errors in the Software will be corrected.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section id="liability" className="scroll-mt-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground mt-0">
                7. Limitation of Liability
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="uppercase font-medium text-foreground text-sm">
                  IN NO EVENT SHALL THE AUTHOR, AFFILIATED INSTITUTIONS, OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
                  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, 
                  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
                  HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
                  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF 
                  ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                </p>
              </div>
            </section>

            {/* Indemnification */}
            <section id="indemnification" className="scroll-mt-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground mt-0">
                8. Indemnification
              </h2>
              <p className="text-muted-foreground">
                You agree to indemnify, defend, and hold harmless the author, affiliated institutions, and their 
                respective officers, directors, employees, and agents from and against any claims, liabilities, 
                damages, losses, and expenses arising out of or in any way connected with your access to or use 
                of the Software.
              </p>
            </section>

            {/* Governing Law */}
            <section id="governing-law" className="scroll-mt-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground mt-0">
                9. Governing Law
              </h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the State of Georgia, 
                United States, without regard to its conflict of law provisions.
              </p>
            </section>

            {/* Contact */}
            <section id="contact" className="scroll-mt-24 p-6 rounded-xl bg-secondary/50 border border-border">
              <h2 className="text-xl font-semibold text-foreground mt-0">
                10. Contact Information
              </h2>
              <div className="text-muted-foreground">
                <p>For questions regarding these Terms of Use or licensing inquiries:</p>
                <p className="mt-2">
                  <strong>Alexis Collier</strong><br />
                  University of North Georgia<br />
                  College of Health Sciences & Professions<br />
                  Email: <a href="mailto:alexis.collier@ung.edu" className="text-primary hover:underline">alexis.collier@ung.edu</a>
                </p>
              </div>
            </section>

            {/* Links */}
            <div className="flex gap-4 text-sm">
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </div>

          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/30 bg-secondary/30 mt-12">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024–2026 Dr. Alexis Collier. All Rights Reserved.</p>
          <p className="mt-1">5 U.S. Patents Filed</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfUse;