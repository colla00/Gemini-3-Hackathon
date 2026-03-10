import { useState } from 'react';
import { Users, Plus, Search, Phone, Mail, Building2, Calendar, ChevronDown, ChevronUp, MessageSquare, ExternalLink } from 'lucide-react';

type PipelineStage = 'identified' | 'contacted' | 'responded' | 'meeting_scheduled' | 'meeting_completed' | 'pilot_discussion' | 'contract_sent' | 'closed';

type Contact = {
  id: string;
  name: string;
  title: string;
  organization: string;
  email: string;
  phone?: string;
  linkedin?: string;
  stage: PipelineStage;
  notes: string[];
  lastContact?: string;
  nextAction?: string;
  priority: 'high' | 'medium' | 'low';
};

const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'identified', label: 'Identified', color: '#6b7280' },
  { id: 'contacted', label: 'Contacted', color: '#8b5cf6' },
  { id: 'responded', label: 'Responded', color: '#3b82f6' },
  { id: 'meeting_scheduled', label: 'Meeting Set', color: '#f59e0b' },
  { id: 'meeting_completed', label: 'Meeting Done', color: '#f97316' },
  { id: 'pilot_discussion', label: 'Pilot Discussion', color: '#10b981' },
  { id: 'contract_sent', label: 'Contract Sent', color: '#06b6d4' },
  { id: 'closed', label: 'Closed Won', color: '#00c8b4' },
];

const INITIAL_CONTACTS: Contact[] = [
  {
    id: '1',
    name: '',
    title: 'CMIO / VP Clinical Informatics',
    organization: 'Target Hospital System #1',
    email: '',
    stage: 'identified',
    notes: ['Ideal first pilot — academic medical center with Epic EHR'],
    priority: 'high',
    nextAction: 'Research organization and identify contact via LinkedIn',
  },
  {
    id: '2',
    name: '',
    title: 'Chief Nursing Informatics Officer',
    organization: 'Target Hospital System #2',
    email: '',
    stage: 'identified',
    notes: ['Focus on nurse burnout angle — CNIO will champion internally'],
    priority: 'high',
    nextAction: 'Find CNIO contact at ANIA 2026 conference',
  },
  {
    id: '3',
    name: '',
    title: 'VP Quality & Patient Safety',
    organization: 'Target Hospital System #3',
    email: '',
    stage: 'identified',
    notes: ['CMS health equity compliance is their immediate pain point'],
    priority: 'medium',
    nextAction: 'Draft outreach email emphasizing CMS compliance angle',
  },
];

const priorityColors = { high: '#ef4444', medium: '#f59e0b', low: '#6b7280' };

const HubCRM = () => {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [newNote, setNewNote] = useState<Record<string, string>>({});

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.organization.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const addContact = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: '',
      title: '',
      organization: '',
      email: '',
      stage: 'identified',
      notes: [],
      priority: 'medium',
    };
    setContacts(prev => [newContact, ...prev]);
    setExpandedId(newContact.id);
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addNote = (id: string) => {
    const note = newNote[id]?.trim();
    if (!note) return;
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setContacts(prev => prev.map(c =>
      c.id === id ? { ...c, notes: [`[${now}] ${note}`, ...c.notes], lastContact: now } : c
    ));
    setNewNote(prev => ({ ...prev, [id]: '' }));
  };

  const pipelineCounts = STAGES.map(s => ({
    ...s,
    count: contacts.filter(c => c.stage === s.id).length,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7" style={{ color: '#00c8b4' }} />
            Customer Discovery CRM
          </h1>
          <p className="text-sm text-white/60 mt-1">Target: 15 interviews · Goal: 1 paying pilot by June 30, 2026</p>
        </div>
        <button
          onClick={addContact}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ background: '#00c8b4' }}
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {/* Pipeline overview */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {pipelineCounts.map(s => (
          <div key={s.id} className="rounded-lg border border-white/10 p-2 text-center" style={{ background: '#151f35' }}>
            <div className="text-lg font-bold" style={{ color: s.color }}>{s.count}</div>
            <div className="text-[8px] text-white/40 uppercase tracking-wider leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-white/10 p-4" style={{ background: '#151f35' }}>
        <div className="flex justify-between text-xs text-white/40 mb-2">
          <span>Discovery Progress</span>
          <span>{contacts.length}/15 contacts</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (contacts.length / 15) * 100)}%`, background: '#00c8b4' }} />
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00c8b4]/50"
          style={{ background: '#151f35' }}
        />
      </div>

      {/* Contact list */}
      <div className="space-y-3">
        {filteredContacts.map(contact => {
          const expanded = expandedId === contact.id;
          const stageInfo = STAGES.find(s => s.id === contact.stage)!;

          return (
            <div key={contact.id} className="rounded-xl border border-white/10 overflow-hidden" style={{ background: '#151f35' }}>
              <button
                onClick={() => setExpandedId(expanded ? null : contact.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: priorityColors[contact.priority] }} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {contact.name || <span className="text-white/30 italic">Name TBD</span>}
                      {contact.organization && <span className="text-white/40 ml-2">— {contact.organization}</span>}
                    </div>
                    <div className="text-[10px] text-white/40">{contact.title}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ color: stageInfo.color, background: `${stageInfo.color}20` }}>
                    {stageInfo.label}
                  </span>
                  {expanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                </div>
              </button>

              {expanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                  {/* Editable fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={e => updateContact(contact.id, { name: e.target.value })}
                        placeholder="Contact name"
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00c8b4]/50"
                        style={{ background: '#0f1729' }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider">Title</label>
                      <input
                        type="text"
                        value={contact.title}
                        onChange={e => updateContact(contact.id, { title: e.target.value })}
                        placeholder="Job title"
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00c8b4]/50"
                        style={{ background: '#0f1729' }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider">Organization</label>
                      <input
                        type="text"
                        value={contact.organization}
                        onChange={e => updateContact(contact.id, { organization: e.target.value })}
                        placeholder="Hospital / Health System"
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00c8b4]/50"
                        style={{ background: '#0f1729' }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={e => updateContact(contact.id, { email: e.target.value })}
                        placeholder="email@hospital.org"
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00c8b4]/50"
                        style={{ background: '#0f1729' }}
                      />
                    </div>
                  </div>

                  {/* Stage + Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider">Pipeline Stage</label>
                      <select
                        value={contact.stage}
                        onChange={e => updateContact(contact.id, { stage: e.target.value as PipelineStage })}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-white/10 text-sm text-white focus:outline-none focus:border-[#00c8b4]/50"
                        style={{ background: '#0f1729' }}
                      >
                        {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider">Priority</label>
                      <select
                        value={contact.priority}
                        onChange={e => updateContact(contact.id, { priority: e.target.value as 'high' | 'medium' | 'low' })}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-white/10 text-sm text-white focus:outline-none focus:border-[#00c8b4]/50"
                        style={{ background: '#0f1729' }}
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Next Action */}
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-wider">Next Action</label>
                    <input
                      type="text"
                      value={contact.nextAction || ''}
                      onChange={e => updateContact(contact.id, { nextAction: e.target.value })}
                      placeholder="What's the next step?"
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00c8b4]/50"
                      style={{ background: '#0f1729' }}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-wider mb-2 block">Notes</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newNote[contact.id] || ''}
                        onChange={e => setNewNote(prev => ({ ...prev, [contact.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && addNote(contact.id)}
                        placeholder="Add a note..."
                        className="flex-1 px-3 py-2 rounded-lg border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00c8b4]/50"
                        style={{ background: '#0f1729' }}
                      />
                      <button
                        onClick={() => addNote(contact.id)}
                        className="px-3 py-2 rounded-lg text-xs font-medium text-white"
                        style={{ background: '#00c8b4' }}
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {contact.notes.map((note, i) => (
                        <div key={i} className="text-xs text-white/50 flex items-start gap-2">
                          <MessageSquare className="w-3 h-3 mt-0.5 shrink-0 text-white/20" />
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-12 text-white/30 text-sm">
          No contacts yet. Click "Add Contact" to start building your pipeline.
        </div>
      )}
    </div>
  );
};

export default HubCRM;
