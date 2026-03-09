import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { FileText, Plus, CheckCircle2, Clock, AlertTriangle, RefreshCw } from "lucide-react";

interface FilingReceipt {
  id: string;
  patent_id: string;
  filing_type: string;
  confirmation_number: string | null;
  application_number: string | null;
  filing_date: string | null;
  receipt_date: string | null;
  entity_type: string;
  filing_fee_paid: number | null;
  search_fee_paid: number | null;
  examination_fee_paid: number | null;
  total_fees_paid: number | null;
  claims_count: number | null;
  independent_claims_count: number | null;
  notes: string | null;
  created_at: string;
}

interface Patent {
  id: string;
  nickname: string;
  patent_number: string;
}

export function FilingReceiptTracker() {
  const [receipts, setReceipts] = useState<FilingReceipt[]>([]);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    patent_id: "",
    filing_type: "nonprovisional",
    confirmation_number: "",
    application_number: "",
    filing_date: "",
    receipt_date: "",
    entity_type: "micro",
    total_fees_paid: "",
    claims_count: "",
    independent_claims_count: "",
    notes: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [receiptsRes, patentsRes] = await Promise.all([
      supabase.from("patent_filing_receipts").select("*").order("created_at", { ascending: false }),
      supabase.from("patents").select("id, nickname, patent_number").order("nickname"),
    ]);

    if (receiptsRes.data) setReceipts(receiptsRes.data as unknown as FilingReceipt[]);
    if (patentsRes.data) setPatents(patentsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    if (!form.patent_id) {
      toast.error("Select a patent");
      return;
    }
    setSaving(true);

    const { error } = await supabase.from("patent_filing_receipts").insert([{
      patent_id: form.patent_id,
      filing_type: form.filing_type,
      confirmation_number: form.confirmation_number || null,
      application_number: form.application_number || null,
      filing_date: form.filing_date || null,
      receipt_date: form.receipt_date || null,
      entity_type: form.entity_type,
      total_fees_paid: form.total_fees_paid ? parseFloat(form.total_fees_paid) : null,
      claims_count: form.claims_count ? parseInt(form.claims_count) : null,
      independent_claims_count: form.independent_claims_count ? parseInt(form.independent_claims_count) : null,
      notes: form.notes || null,
    }] as never);

    setSaving(false);
    if (error) {
      toast.error("Failed to save: " + error.message);
      return;
    }

    toast.success("Filing receipt recorded");
    setDialogOpen(false);
    setForm({ patent_id: "", filing_type: "nonprovisional", confirmation_number: "", application_number: "", filing_date: "", receipt_date: "", entity_type: "micro", total_fees_paid: "", claims_count: "", independent_claims_count: "", notes: "" });
    fetchData();
  };

  const getPatentName = (id: string) => patents.find(p => p.id === id)?.nickname || id;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Filing Receipt Tracker</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-2" />Record Receipt</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Record Filing Receipt</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Patent *</Label>
                    <Select value={form.patent_id} onValueChange={v => setForm(f => ({ ...f, patent_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select patent..." /></SelectTrigger>
                      <SelectContent>
                        {patents.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.nickname} ({p.patent_number})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Confirmation #</Label>
                      <Input value={form.confirmation_number} onChange={e => setForm(f => ({ ...f, confirmation_number: e.target.value }))} placeholder="12345678" />
                    </div>
                    <div>
                      <Label>Application #</Label>
                      <Input value={form.application_number} onChange={e => setForm(f => ({ ...f, application_number: e.target.value }))} placeholder="17/XXX,XXX" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Filing Date</Label>
                      <Input type="date" value={form.filing_date} onChange={e => setForm(f => ({ ...f, filing_date: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Receipt Date</Label>
                      <Input type="date" value={form.receipt_date} onChange={e => setForm(f => ({ ...f, receipt_date: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Entity Type</Label>
                      <Select value={form.entity_type} onValueChange={v => setForm(f => ({ ...f, entity_type: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="micro">Micro</SelectItem>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Total Claims</Label>
                      <Input type="number" value={form.claims_count} onChange={e => setForm(f => ({ ...f, claims_count: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Total Fees ($)</Label>
                      <Input type="number" step="0.01" value={form.total_fees_paid} onChange={e => setForm(f => ({ ...f, total_fees_paid: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any additional notes..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSave} disabled={saving} className="w-full">
                    {saving ? "Saving..." : "Save Receipt"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardDescription>Track USPTO confirmation numbers and filing receipts for all nonprovisional applications</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
        ) : receipts.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No filing receipts recorded yet</p>
            <p className="text-xs text-muted-foreground mt-1">Record receipts as nonprovisional applications are filed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patent</TableHead>
                  <TableHead>Confirmation #</TableHead>
                  <TableHead>Application #</TableHead>
                  <TableHead>Filed</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead>Claims</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-sm">{getPatentName(r.patent_id)}</TableCell>
                    <TableCell>
                      {r.confirmation_number ? (
                        <code className="text-xs font-mono bg-secondary px-2 py-0.5 rounded">{r.confirmation_number}</code>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      {r.application_number ? (
                        <code className="text-xs font-mono">{r.application_number}</code>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-xs">{r.filing_date || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px]">{r.entity_type}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {r.total_fees_paid ? `$${Number(r.total_fees_paid).toLocaleString()}` : "—"}
                    </TableCell>
                    <TableCell className="text-xs">{r.claims_count || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
