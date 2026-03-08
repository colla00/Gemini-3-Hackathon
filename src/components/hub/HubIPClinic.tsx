import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Plus, Trash2, GraduationCap, BookOpen, Building2, FileCheck, ClipboardList } from "lucide-react";
import { toast } from "sonner";

/* ── Part A: Law School Contact ── */
interface SchoolContact {
  id: string;
  school_name: string;
  address: string;
  aba_date: string;
  url: string;
}

/* ── Outreach Log Entry ── */
interface OutreachEntry {
  id: string;
  school_name: string;
  date_contacted: string;
  response_status: string;
  notes: string;
}

/* ── Part C: Clinic Details ── */
interface ClinicDetail {
  title: string;
  type: string;
  semesters: string;
  credit_hours: string;
}

const DOCUMENT_CHECKLIST = [
  "Academic catalog showing IP curriculum",
  "Course descriptions for patent courses",
  "Course descriptions for trademark courses",
  "Faculty bios / resumes",
  "Clinic supervision plan",
  "Student practice order (if applicable)",
  "ABA accreditation letter",
  "Bar admission / student practice rules",
];

const IP_CURRICULUM = [
  { id: "patent_law", label: "Patent Law course offered" },
  { id: "trademark_law", label: "Trademark Law course offered" },
  { id: "patent_prosecution", label: "Patent Prosecution / Drafting" },
  { id: "patent_litigation", label: "Patent Litigation" },
  { id: "ip_survey", label: "IP Survey / Introduction" },
  { id: "trade_secret", label: "Trade Secret Law" },
  { id: "prerequisites", label: "Technical prerequisites required" },
  { id: "faculty_bios", label: "Faculty bios collected" },
];

const uid = () => Math.random().toString(36).slice(2, 10);

export default function HubIPClinic() {
  // Part A
  const [schools, setSchools] = useState<SchoolContact[]>([]);
  const [schoolForm, setSchoolForm] = useState<SchoolContact>({ id: "", school_name: "", address: "", aba_date: "", url: "" });

  // Part B
  const [checkedCurriculum, setCheckedCurriculum] = useState<string[]>([]);

  // Part C
  const [clinic, setClinic] = useState<ClinicDetail>({ title: "", type: "IP Clinic", semesters: "", credit_hours: "" });

  // Outreach
  const [outreach, setOutreach] = useState<OutreachEntry[]>([]);
  const [outreachForm, setOutreachForm] = useState<OutreachEntry>({ id: "", school_name: "", date_contacted: "", response_status: "pending", notes: "" });

  // Documents
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);

  // Section open state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ a: true, b: true, c: true, outreach: true, docs: true });
  const toggle = (key: string) => setOpenSections(p => ({ ...p, [key]: !p[key] }));

  const addSchool = () => {
    if (!schoolForm.school_name) { toast.error("School name required"); return; }
    setSchools(p => [...p, { ...schoolForm, id: uid() }]);
    setSchoolForm({ id: "", school_name: "", address: "", aba_date: "", url: "" });
    toast.success("School added");
  };

  const addOutreach = () => {
    if (!outreachForm.school_name) { toast.error("School name required"); return; }
    setOutreach(p => [...p, { ...outreachForm, id: uid() }]);
    setOutreachForm({ id: "", school_name: "", date_contacted: "", response_status: "pending", notes: "" });
    toast.success("Outreach entry added");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <GraduationCap className="w-6 h-6" style={{ color: "#00c8b4" }} />
        <div>
          <h2 className="text-xl font-bold text-white">IP Clinic Form Organizer</h2>
          <p className="text-xs text-white/40">USPTO Law School Clinic Certification — Supporting Materials</p>
        </div>
      </div>

      {/* Part A */}
      <Collapsible open={openSections.a} onOpenChange={() => toggle("a")}>
        <Card className="bg-white/5 border-white/10">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                {openSections.a ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronRight className="w-4 h-4 text-white/50" />}
                <Building2 className="w-4 h-4" style={{ color: "#00c8b4" }} />
                <CardTitle className="text-sm text-white">Part A — Law School Contact Info</CardTitle>
                <Badge variant="secondary" className="text-[10px] ml-auto">{schools.length} schools</Badge>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input placeholder="School name *" value={schoolForm.school_name} onChange={e => setSchoolForm(p => ({ ...p, school_name: e.target.value }))} className="bg-white/5 border-white/10 text-white text-sm" />
                <Input placeholder="Address" value={schoolForm.address} onChange={e => setSchoolForm(p => ({ ...p, address: e.target.value }))} className="bg-white/5 border-white/10 text-white text-sm" />
                <Input placeholder="ABA accreditation date" value={schoolForm.aba_date} onChange={e => setSchoolForm(p => ({ ...p, aba_date: e.target.value }))} className="bg-white/5 border-white/10 text-white text-sm" />
                <Input placeholder="Website URL" value={schoolForm.url} onChange={e => setSchoolForm(p => ({ ...p, url: e.target.value }))} className="bg-white/5 border-white/10 text-white text-sm" />
              </div>
              <Button size="sm" onClick={addSchool} className="gap-1" style={{ background: "#00c8b4", color: "#0f1729" }}>
                <Plus className="w-3.5 h-3.5" /> Add School
              </Button>
              {schools.length > 0 && (
                <div className="rounded-lg border border-white/10 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-white/10 text-white/50">
                      <th className="text-left p-2">School</th><th className="text-left p-2">Address</th><th className="text-left p-2">ABA Date</th><th className="text-left p-2">URL</th><th className="p-2"></th>
                    </tr></thead>
                    <tbody>
                      {schools.map(s => (
                        <tr key={s.id} className="border-b border-white/5 text-white/70">
                          <td className="p-2 font-medium text-white">{s.school_name}</td>
                          <td className="p-2">{s.address || "—"}</td>
                          <td className="p-2">{s.aba_date || "—"}</td>
                          <td className="p-2">{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#00c8b4" }}>{s.url}</a> : "—"}</td>
                          <td className="p-2"><button onClick={() => setSchools(p => p.filter(x => x.id !== s.id))} className="text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Part B */}
      <Collapsible open={openSections.b} onOpenChange={() => toggle("b")}>
        <Card className="bg-white/5 border-white/10">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                {openSections.b ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronRight className="w-4 h-4 text-white/50" />}
                <BookOpen className="w-4 h-4" style={{ color: "#00c8b4" }} />
                <CardTitle className="text-sm text-white">Part B — IP Curriculum Checklist</CardTitle>
                <Badge variant="secondary" className="text-[10px] ml-auto">{checkedCurriculum.length}/{IP_CURRICULUM.length}</Badge>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {IP_CURRICULUM.map(item => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`cur-${item.id}`}
                      checked={checkedCurriculum.includes(item.id)}
                      onCheckedChange={(checked) => setCheckedCurriculum(p => checked ? [...p, item.id] : p.filter(x => x !== item.id))}
                    />
                    <label htmlFor={`cur-${item.id}`} className="text-sm text-white/70 cursor-pointer">{item.label}</label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Part C */}
      <Collapsible open={openSections.c} onOpenChange={() => toggle("c")}>
        <Card className="bg-white/5 border-white/10">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                {openSections.c ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronRight className="w-4 h-4 text-white/50" />}
                <FileCheck className="w-4 h-4" style={{ color: "#00c8b4" }} />
                <CardTitle className="text-sm text-white">Part C — Clinic Details</CardTitle>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input placeholder="Clinic title" value={clinic.title} onChange={e => setClinic(p => ({ ...p, title: e.target.value }))} className="bg-white/5 border-white/10 text-white text-sm" />
                <Select value={clinic.type} onValueChange={v => setClinic(p => ({ ...p, type: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IP Clinic">IP Clinic</SelectItem>
                    <SelectItem value="Patent Clinic">Patent Clinic</SelectItem>
                    <SelectItem value="Trademark Clinic">Trademark Clinic</SelectItem>
                    <SelectItem value="General IP">General IP</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Semesters offered" value={clinic.semesters} onChange={e => setClinic(p => ({ ...p, semesters: e.target.value }))} className="bg-white/5 border-white/10 text-white text-sm" />
                <Input placeholder="Credit hours" value={clinic.credit_hours} onChange={e => setClinic(p => ({ ...p, credit_hours: e.target.value }))} className="bg-white/5 border-white/10 text-white text-sm" />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Outreach Log */}
      <Collapsible open={openSections.outreach} onOpenChange={() => toggle("outreach")}>
        <Card className="bg-white/5 border-white/10">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                {openSections.outreach ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronRight className="w-4 h-4 text-white/50" />}
                <ClipboardList className="w-4 h-4" style={{ color: "#00c8b4" }} />
                <CardTitle className="text-sm text-white">Outreach Log</CardTitle>
                <Badge variant="secondary" className="text-[10px] ml-auto">{outreach.length} entries</Badge>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input placeholder="School name *" value={outreachForm.school_name} onChange={e => setOutreachForm(p => ({ ...p, school_name: e.target.value }))} className="bg-white/5 border-white/10 text-white text-sm" />
                <Input type="date" value={outreachForm.date_contacted} onChange={e => setOutreachForm(p => ({ ...p, date_contacted: e.target.value }))} className="bg-white/5 border-white/10 text-white text-sm" />
                <Select value={outreachForm.response_status} onValueChange={v => setOutreachForm(p => ({ ...p, response_status: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="interested">Interested</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                    <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Notes" value={outreachForm.notes} onChange={e => setOutreachForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/5 border-white/10 text-white text-sm" />
              </div>
              <Button size="sm" onClick={addOutreach} className="gap-1" style={{ background: "#00c8b4", color: "#0f1729" }}>
                <Plus className="w-3.5 h-3.5" /> Add Entry
              </Button>
              {outreach.length > 0 && (
                <div className="rounded-lg border border-white/10 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-white/10 text-white/50">
                      <th className="text-left p-2">School</th><th className="text-left p-2">Date</th><th className="text-left p-2">Status</th><th className="text-left p-2">Notes</th><th className="p-2"></th>
                    </tr></thead>
                    <tbody>
                      {outreach.map(o => (
                        <tr key={o.id} className="border-b border-white/5 text-white/70">
                          <td className="p-2 font-medium text-white">{o.school_name}</td>
                          <td className="p-2">{o.date_contacted || "—"}</td>
                          <td className="p-2">
                            <Badge variant="outline" className={`text-[10px] ${
                              o.response_status === "interested" ? "border-emerald-500/50 text-emerald-400" :
                              o.response_status === "declined" ? "border-red-500/50 text-red-400" :
                              o.response_status === "meeting_scheduled" ? "border-blue-500/50 text-blue-400" :
                              "border-white/20 text-white/50"
                            }`}>{o.response_status.replace("_", " ")}</Badge>
                          </td>
                          <td className="p-2">{o.notes || "—"}</td>
                          <td className="p-2"><button onClick={() => setOutreach(p => p.filter(x => x.id !== o.id))} className="text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Document Upload Checklist */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" style={{ color: "#00c8b4" }} />
            <CardTitle className="text-sm text-white">Document Upload Checklist</CardTitle>
            <Badge variant="secondary" className="text-[10px] ml-auto">{checkedDocs.length}/{DOCUMENT_CHECKLIST.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {DOCUMENT_CHECKLIST.map((doc, i) => (
              <div key={i} className="flex items-center gap-2">
                <Checkbox
                  id={`doc-${i}`}
                  checked={checkedDocs.includes(doc)}
                  onCheckedChange={(checked) => setCheckedDocs(p => checked ? [...p, doc] : p.filter(x => x !== doc))}
                />
                <label htmlFor={`doc-${i}`} className={`text-sm cursor-pointer ${checkedDocs.includes(doc) ? "text-white/40 line-through" : "text-white/70"}`}>{doc}</label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}