import jsPDF from 'jspdf';

export const generateInvestorDeck = () => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [1920, 1080] });
  const W = 1920;
  const H = 1080;
  const margin = 120;
  let slideNum = 0;

  const addSlide = () => {
    if (slideNum > 0) doc.addPage();
    slideNum++;
    // Dark background
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, W, H, 'F');
    // Accent bar
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, W, 6, 'F');
  };

  const slideFooter = () => {
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text('VitaSignal™  |  Confidential', margin, H - 40);
    doc.text(`${slideNum}`, W - margin, H - 40, { align: 'right' });
    doc.setFontSize(11);
    doc.text('⚠ Research Prototype — Not Clinically Validated — Synthetic Data Only', W / 2, H - 40, { align: 'center' });
  };

  // ─── SLIDE 1: Title ───
  addSlide();
  doc.setFontSize(72);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('VitaSignal™', margin, 360);
  doc.setFontSize(32);
  doc.setTextColor(16, 185, 129);
  doc.text('AI-Powered Nurse-Sensitive Outcome Prediction', margin, 420);
  doc.setFontSize(22);
  doc.setTextColor(148, 163, 184);
  doc.text('Executive Financial & Clinical Summary', margin, 470);
  doc.text('March 2026', margin, 510);
  // Divider
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(2);
  doc.line(margin, 540, margin + 300, 540);
  doc.setFontSize(20);
  doc.setTextColor(203, 213, 225);
  doc.text('Dr. Alexis Collier, DHA', margin, 580);
  doc.text('Founder & CEO, VitaSignal LLC', margin, 610);
  doc.text('vitasignal.ai', margin, 650);
  slideFooter();

  // ─── SLIDE 2: Problem ───
  addSlide();
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('The Problem', margin, 180);
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, 220, W - margin * 2, 280, 16, 16, 'F');
  doc.setFontSize(26);
  doc.setTextColor(203, 213, 225);
  const problems = [
    '• 400,000+ preventable hospital deaths annually in the U.S.',
    '• Clinical deterioration often undetected until crisis — especially in under-resourced settings',
    '• Existing predictive systems require expensive physiological monitoring hardware',
    '• Alert fatigue: nurses override 72–99% of clinical alerts',
    '• Documentation burden consumes 35% of nursing time',
  ];
  problems.forEach((p, i) => doc.text(p, margin + 40, 280 + i * 48));
  slideFooter();

  // ─── SLIDE 3: Solution ───
  addSlide();
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('The Solution', margin, 180);
  doc.setFontSize(28);
  doc.setTextColor(16, 185, 129);
  doc.text('Equipment-independent clinical AI that works with existing EHR data', margin, 240);
  // Three pillars
  const pillars = [
    { title: 'IDI Score', desc: 'Intervention Delay Index — predicts mortality\nfrom nursing documentation timestamps', metric: 'AUROC 0.9063' },
    { title: 'DBS Score', desc: 'Documentation Burden Score — quantifies\nnurse documentation workload', metric: 'NPV 0.947' },
    { title: 'ChartMinder™', desc: 'AI copilot for clinical decision support\nwith cognitive load optimization', metric: '90 min/shift saved' },
  ];
  pillars.forEach((p, i) => {
    const x = margin + i * 560;
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(x, 300, 520, 360, 16, 16, 'F');
    doc.setFontSize(30);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(p.title, x + 40, 360);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text(p.desc, x + 40, 410);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(p.metric, x + 40, 580);
  });
  slideFooter();

  // ─── SLIDE 4: Validation Metrics ───
  addSlide();
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Clinical Validation', margin, 180);
  const metrics = [
    { label: 'IDI Cohort', value: '65,157', sub: 'patients' },
    { label: 'IDI Best AUROC', value: '0.9063', sub: 'mortality prediction' },
    { label: 'DBS Cohort', value: '28,362', sub: 'patients' },
    { label: 'DBS External AUROC', value: '0.758', sub: 'external validation' },
    { label: 'DBS Internal AUROC', value: '0.802', sub: 'internal validation' },
    { label: 'DBS NPV', value: '0.947', sub: 'negative predictive value' },
  ];
  metrics.forEach((m, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = margin + col * 560;
    const y = 240 + row * 300;
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(x, y, 520, 250, 16, 16, 'F');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(m.label, x + 40, y + 50);
    doc.setFontSize(56);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(m.value, x + 40, y + 140);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text(m.sub, x + 40, y + 190);
  });
  slideFooter();

  // ─── SLIDE 5: ROI / Financial ───
  addSlide();
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Financial Impact', margin, 180);
  const roi = [
    { label: 'Cost Savings', value: '$2,847', sub: 'per patient' },
    { label: 'Return on Investment', value: '1,240%', sub: 'projected ROI' },
    { label: 'Time Saved', value: '90 min', sub: 'per shift per nurse' },
  ];
  roi.forEach((r, i) => {
    const x = margin + i * 560;
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(x, 240, 520, 340, 16, 16, 'F');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(r.label, x + 40, 300);
    doc.setFontSize(72);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(r.value, x + 40, 420);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text(r.sub, x + 40, 480);
  });
  slideFooter();

  // ─── SLIDE 6: IP Portfolio ───
  addSlide();
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Intellectual Property', margin, 180);
  doc.setFontSize(96);
  doc.setTextColor(16, 185, 129);
  doc.text('11', margin, 340);
  doc.setFontSize(32);
  doc.setTextColor(203, 213, 225);
  doc.text('U.S. Provisional Patent Applications Filed — February 28, 2026', margin + 160, 320);
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, 400, W - margin * 2, 380, 16, 16, 'F');
  const patents = [
    'Core Platform — IDI Scoring, DBS Scoring, Clinical Risk Intelligence',
    'ChartMinder™ — Neural Reasoning, Cognitive Load Optimization',
    'Trust-Based Alert System — Adaptive Thresholds, Equity Monitoring',
    'Performance Benchmarking — Cross-Institution Comparison Engine',
    'Digital Twin — Patient Simulation & Forecasting',
  ];
  doc.setFontSize(24);
  patents.forEach((p, i) => {
    doc.setTextColor(16, 185, 129);
    doc.text('●', margin + 40, 460 + i * 60);
    doc.setTextColor(203, 213, 225);
    doc.text(p, margin + 70, 460 + i * 60);
  });
  slideFooter();

  // ─── SLIDE 7: NIH & Research ───
  addSlide();
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Research & Funding', margin, 180);
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, 230, W - margin * 2, 160, 16, 16, 'F');
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('NIH AIM-AHEAD', margin + 40, 280);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Award No. 1OT2OD032581 — CLINAQ Fellowship, Morehouse School of Medicine', margin + 40, 320);
  doc.text('Co-Investigator: Dr. Sophia Z. Shalhout, PhD — Harvard / Mass Eye and Ear', margin + 40, 360);
  // Publications
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Manuscripts Under Review', margin, 460);
  const pubs = [
    { journal: 'Manuscript A', title: 'IDI — Intensive Documentation Index validation' },
    { journal: 'Manuscript B', title: 'Multinational IDI external validation' },
    { journal: 'Manuscript C', title: 'Healthcare disparities analysis' },
  ];
  pubs.forEach((p, i) => {
    const y = 510 + i * 80;
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(margin, y, W - margin * 2, 65, 12, 12, 'F');
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(p.journal, margin + 40, y + 40);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text(p.title, margin + 320, y + 40);
  });
  doc.setFontSize(18);
  doc.setTextColor(148, 163, 184);
  doc.text('ESDBI Preprint DOI: 10.64898/2026.02.10.26345827', margin, 780);
  slideFooter();

  // ─── SLIDE 8: Team ───
  addSlide();
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Leadership', margin, 180);
  // Inventor
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, 240, 780, 400, 16, 16, 'F');
  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Dr. Alexis Collier, DHA', margin + 40, 310);
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129);
  doc.text('Founder & CEO, VitaSignal LLC', margin + 40, 350);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  const bio = [
    'NIH AIM-AHEAD CLINAQ Fellow',
    'Adjunct Faculty, University of North Georgia',
    'Alexis.Collier@ung.edu',
  ];
  bio.forEach((b, i) => doc.text(b, margin + 40, 400 + i * 36));
  // Co-I
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin + 840, 240, 780, 400, 16, 16, 'F');
  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Dr. Sophia Z. Shalhout, PhD', margin + 880, 310);
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129);
  doc.text('Co-Investigator', margin + 880, 350);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Harvard Medical School', margin + 880, 400);
  doc.text('Massachusetts Eye and Ear', margin + 880, 436);
  slideFooter();

  // ─── SLIDE 9: Contact / CTA ───
  addSlide();
  doc.setFontSize(56);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Get in Touch', W / 2, 300, { align: 'center' });
  doc.setFontSize(28);
  doc.setTextColor(16, 185, 129);
  doc.text('vitasignal.ai', W / 2, 400, { align: 'center' });
  doc.setFontSize(24);
  doc.setTextColor(203, 213, 225);
  doc.text('Alexis.Collier@ung.edu', W / 2, 460, { align: 'center' });
  doc.text('info@alexiscollier.com', W / 2, 500, { align: 'center' });
  // Patent notice
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(W / 2 - 500, 560, 1000, 80, 12, 12, 'F');
  doc.setFontSize(18);
  doc.setTextColor(148, 163, 184);
  doc.text('Patent Pending — 11 U.S. Provisional Applications Filed Feb 28, 2026', W / 2, 600, { align: 'center' });
  doc.text('USPTO Patent Pending Notice', W / 2, 625, { align: 'center' });
  doc.setFontSize(16);
  doc.text('© 2025–2026 Dr. Alexis M. Collier, DHA. All rights reserved.', W / 2, 720, { align: 'center' });
  doc.text('RESEARCH PROTOTYPE — Not Clinically Validated — Synthetic Data Only', W / 2, 750, { align: 'center' });
  slideFooter();

  // Watermark on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(80);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('RESEARCH PROTOTYPE', W / 2, H / 2, { align: 'center', angle: 30 });
  }

  doc.save('VitaSignal-Investor-Deck.pdf');
};
