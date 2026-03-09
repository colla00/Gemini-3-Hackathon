import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Key, Plus, Copy, Shield, Trash2, RefreshCw, Eye, EyeOff } from "lucide-react";

interface VendorKey {
  id: string;
  vendor_name: string;
  vendor_id: string;
  api_key_prefix: string;
  environment: string;
  is_active: boolean;
  rate_limit_per_min: number;
  contact_email: string | null;
  contact_name: string | null;
  baa_signed: boolean;
  nda_signed: boolean;
  created_at: string;
  expires_at: string | null;
  last_used_at: string | null;
  total_requests: number;
}

function generateApiKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return "vs_" + Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export function VendorKeyManagement() {
  const [keys, setKeys] = useState<VendorKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newKeyRevealed, setNewKeyRevealed] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    vendor_name: "",
    vendor_id: "",
    environment: "sandbox" as "sandbox" | "production",
    contact_name: "",
    contact_email: "",
    rate_limit: 120,
    baa_signed: false,
    nda_signed: false,
  });

  const fetchKeys = useCallback(async () => {
    const { data, error } = await supabase
      .from("vendor_api_keys")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load vendor keys");
      return;
    }
    setKeys((data as unknown as VendorKey[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const handleCreate = async () => {
    if (!form.vendor_name || !form.vendor_id) {
      toast.error("Vendor name and ID are required");
      return;
    }

    if (form.environment === "production" && (!form.baa_signed || !form.nda_signed)) {
      toast.error("Production keys require signed BAA and NDA");
      return;
    }

    setCreating(true);
    const rawKey = generateApiKey();
    const keyHash = await hashApiKey(rawKey);
    const keyPrefix = rawKey.slice(0, 10) + "...";

    const { error } = await supabase.from("vendor_api_keys").insert([{
      vendor_name: form.vendor_name,
      vendor_id: form.vendor_id.toLowerCase().replace(/\s+/g, "-"),
      api_key_hash: keyHash,
      api_key_prefix: keyPrefix,
      environment: form.environment,
      rate_limit_per_min: form.rate_limit,
      contact_name: form.contact_name || null,
      contact_email: form.contact_email || null,
      baa_signed: form.baa_signed,
      nda_signed: form.nda_signed,
    }] as never);

    setCreating(false);

    if (error) {
      toast.error("Failed to create key: " + error.message);
      return;
    }

    setNewKeyRevealed(rawKey);
    toast.success("API key created");
    fetchKeys();
    setForm({ vendor_name: "", vendor_id: "", environment: "sandbox", contact_name: "", contact_email: "", rate_limit: 120, baa_signed: false, nda_signed: false });
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from("vendor_api_keys").update({ is_active: !active } as Record<string, unknown>).eq("id", id);
    toast.success(active ? "Key deactivated" : "Key activated");
    fetchKeys();
  };

  const deleteKey = async (id: string) => {
    await supabase.from("vendor_api_keys").delete().eq("id", id);
    toast.success("Key deleted");
    fetchKeys();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            <CardTitle>Vendor API Keys</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchKeys}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setNewKeyRevealed(null); }}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Key
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Vendor API Key</DialogTitle>
                </DialogHeader>

                {newKeyRevealed ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                        ⚠️ Copy this key now — it won't be shown again
                      </p>
                      <div className="flex gap-2">
                        <code className="flex-1 text-xs bg-background p-2 rounded break-all font-mono">{newKeyRevealed}</code>
                        <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(newKeyRevealed); toast.success("Copied"); }}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => { setDialogOpen(false); setNewKeyRevealed(null); }}>Done</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Vendor Name *</Label>
                        <Input value={form.vendor_name} onChange={e => setForm(f => ({ ...f, vendor_name: e.target.value }))} placeholder="Epic Systems" />
                      </div>
                      <div>
                        <Label>Vendor ID *</Label>
                        <Input value={form.vendor_id} onChange={e => setForm(f => ({ ...f, vendor_id: e.target.value }))} placeholder="epic" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Contact Name</Label>
                        <Input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} />
                      </div>
                      <div>
                        <Label>Contact Email</Label>
                        <Input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Environment</Label>
                        <Select value={form.environment} onValueChange={v => setForm(f => ({ ...f, environment: v as "sandbox" | "production" }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sandbox">Sandbox</SelectItem>
                            <SelectItem value="production">Production</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Rate Limit (req/min)</Label>
                        <Input type="number" value={form.rate_limit} onChange={e => setForm(f => ({ ...f, rate_limit: parseInt(e.target.value) || 120 }))} />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Switch checked={form.nda_signed} onCheckedChange={v => setForm(f => ({ ...f, nda_signed: v }))} />
                        <Label className="text-sm">NDA Signed</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={form.baa_signed} onCheckedChange={v => setForm(f => ({ ...f, baa_signed: v }))} />
                        <Label className="text-sm">BAA Signed</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreate} disabled={creating} className="w-full">
                        {creating ? "Generating..." : "Generate API Key"}
                      </Button>
                    </DialogFooter>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardDescription>Manage API keys for EHR vendor integrations</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
        ) : keys.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No vendor API keys created yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Key Prefix</TableHead>
                  <TableHead>Env</TableHead>
                  <TableHead>Legal</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map(k => (
                  <TableRow key={k.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{k.vendor_name}</p>
                        <p className="text-xs text-muted-foreground">{k.contact_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs font-mono bg-secondary px-2 py-0.5 rounded">{k.api_key_prefix}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={k.environment === "production" ? "destructive" : "secondary"} className="text-[10px]">
                        {k.environment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {k.nda_signed && <Badge variant="outline" className="text-[9px]">NDA</Badge>}
                        {k.baa_signed && <Badge variant="outline" className="text-[9px]">BAA</Badge>}
                        {!k.nda_signed && !k.baa_signed && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-mono">{k.total_requests.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={k.is_active ? "default" : "secondary"}>
                        {k.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleActive(k.id, k.is_active)}>
                          {k.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteKey(k.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
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
