import PptxGenJS from 'pptxgenjs';

// AI module definitions for slides
const AI_MODULES = [
  {
    id: 'clinical-notes',
    title: 'Clinical Notes Analysis',
    icon: '📋',
    description: 'AI-powered extraction of warning signs and recommended actions from unstructured clinical documentation.',
    voiceoverScript: 'This module demonstrates real-time clinical notes analysis. The AI identifies warning signs like nocturnal confusion, unsafe mobility attempts, and sedative administration. It provides prioritized recommended actions including bed alarm activation and increased safety rounds.',
    keyFeatures: [
      'Natural language processing of nursing notes',
      'Automatic extraction of warning signs with severity levels',
      'Evidence-based action recommendations',
      'Sub-second processing time'
    ],
    demoScenario: 'Patient restless overnight. Found attempting to climb out of bed at 0230hrs. Lorazepam 2mg PO given per protocol.',
    expectedOutput: 'HIGH risk level with 94% confidence. Actions: Activate bed alarm, increase rounds to q1h.'
  },
  {
    id: 'risk-narrative',
    title: 'Explainable Risk Narrative (SHAP)',
    icon: '🧠',
    description: 'Translates complex SHAP explainability scores into clinician-friendly narratives for transparent AI decision-making.',
    voiceoverScript: 'The SHAP explainability module transforms technical machine learning outputs into understandable clinical narratives. It shows exactly WHY a patient is high-risk, not just that they are. This transparency builds trust and supports clinical judgment.',
    keyFeatures: [
      'SHAP value visualization with interactive sliders',
      'Plain-language factor explanations',
      'Weighted contribution breakdown',
      'Clinical interpretation guidance'
    ],
    demoScenario: 'SHAP score: 0.73 with age, sedation, and mobility factors active.',
    expectedOutput: 'HIGH fall risk (73% probability). Primary factors: Age-related balance changes, Lorazepam effects, walker dependence.'
  },
  {
    id: 'interventions',
    title: 'Intervention Recommender',
    icon: '💡',
    description: 'Evidence-based intervention suggestions with implementation timelines and projected risk reduction.',
    voiceoverScript: 'The intervention recommender provides tiered, evidence-based actions categorized by priority. Each intervention includes evidence level ratings from Class I to Best Practice, implementation timelines, and projected risk reduction percentages.',
    keyFeatures: [
      'Tiered priority system (Immediate, Urgent, Routine)',
      'Evidence level citations (AHA/ACC, TJC)',
      'Implementation timeline guidance',
      'Projected risk reduction metrics'
    ],
    demoScenario: 'HIGH Falls risk patient with sedation and mobility limitations.',
    expectedOutput: '65% projected risk reduction. Immediate: Bed alarm, pathway clearance. Urgent: Medication review, PT consult.'
  },
  {
    id: 'health-equity',
    title: 'Health Equity Analyzer',
    icon: '⚖️',
    description: 'Disparity detection across demographic groups with root cause analysis and equity recommendations.',
    voiceoverScript: 'The health equity analyzer identifies care disparities across age, payer status, language, and gender. It presents findings as a heatmap with disparity ratios, root cause analysis, and actionable recommendations for achieving equity targets.',
    keyFeatures: [
      'Multi-demographic disparity heatmap',
      'Statistical significance indicators',
      'Root cause analysis per finding',
      'Regulatory compliance tracking (CMS, TJC)'
    ],
    demoScenario: 'Unit 4C, 7-day analysis across 24 patients.',
    expectedOutput: 'Age-related PI gap: 2.3x higher in >75. Language barrier: 2.0x longer response time.'
  },
  {
    id: 'pressure-injury',
    title: 'Pressure Injury Assessment',
    icon: '🩹',
    description: 'AI-powered wound staging from clinical images with treatment recommendations.',
    voiceoverScript: 'This multimodal module analyzes wound images to provide staging assessment, measurement estimates, wound bed evaluation, and healing trajectory predictions. It demonstrates Gemini\'s vision capabilities for clinical decision support.',
    keyFeatures: [
      'Automated stage classification (I-IV)',
      'Size estimation from images',
      'Wound bed characterization',
      'Treatment protocol recommendations'
    ],
    demoScenario: 'Sacral wound image analysis requested.',
    expectedOutput: 'Stage II (Partial Thickness), ~3cm x 2cm, pink/red moist bed, appropriate progression.'
  },
  {
    id: 'smart-alert',
    title: 'Smart Alert Generation',
    icon: '🔔',
    description: 'Context-aware clinical alerts with actionable checklists and reassessment timelines.',
    voiceoverScript: 'Smart alerts go beyond simple notifications. They provide patient-specific context, actionable checklists with urgency levels, clinical rationale, and automatic reassessment scheduling. This reduces alert fatigue while ensuring critical items aren\'t missed.',
    keyFeatures: [
      'Priority-based alert categorization',
      'Actionable checklist generation',
      'Clinical rationale explanation',
      'Automatic reassessment scheduling'
    ],
    demoScenario: 'Sedation + Mobility Risk trigger for patient 847261.',
    expectedOutput: 'IMMEDIATE priority. Actions: Bed alarm NOW, q1h rounds, reassess risk score. Rationale: Sedative peak effect window.'
  },
  {
    id: 'unit-trends',
    title: 'Unit Trend Analysis',
    icon: '📊',
    description: 'Temporal pattern recognition across the unit with staffing correlation and system-level recommendations.',
    voiceoverScript: 'Unit trend analysis identifies temporal patterns across all patients. It correlates risk peaks with staffing ratios, identifies systemic issues like shift-change gaps, and provides both immediate actions and long-term system change recommendations.',
    keyFeatures: [
      'Multi-risk temporal visualization',
      'Peak period identification with context',
      'Staffing ratio correlation',
      'System-level improvement recommendations'
    ],
    demoScenario: '24-hour trend analysis for Unit 4C with Falls, PI, and CAUTI risks.',
    expectedOutput: 'Falls peak 2-6 AM (r=0.78 staffing correlation). PI risk elevated at shift change. 28% projected improvement.'
  },
  {
    id: 'multi-risk',
    title: 'Multi-Risk Assessment',
    icon: '🎯',
    description: 'Unified assessment across Falls, Pressure Injury, and CAUTI with consolidated interventions.',
    voiceoverScript: 'The multi-risk assessment provides a unified view of all nurse-sensitive outcome risks for a single patient. Rather than siloed assessments, clinicians see a holistic picture with consolidated intervention recommendations that address multiple risk factors simultaneously.',
    keyFeatures: [
      'Unified 3-risk dashboard view',
      'Cross-risk factor correlation',
      'Consolidated intervention planning',
      'Care plan integration'
    ],
    demoScenario: '82yo male with walker, recent Lorazepam, Braden 14, no catheter.',
    expectedOutput: 'Falls: HIGH (8.2/10), Pressure: MODERATE (5.5/10), CAUTI: LOW (2.0/10). Priority: Falls intervention focus.'
  }
];

export interface AIToolsPptExportOptions {
  includeVoiceover?: boolean;
  includeNotes?: boolean;
  theme?: 'light' | 'dark';
}

export const generateAIToolsPowerPoint = async (options: AIToolsPptExportOptions = {}) => {
  const { includeVoiceover = true, includeNotes = true, theme = 'light' } = options;
  
  const pptx = new PptxGenJS();
  
  // Set presentation properties
  pptx.author = 'Alexis Collier, PhD, RN';
  pptx.title = 'Clinical AI Engine - Demo Voiceover';
  pptx.subject = 'NSO Quality Dashboard AI Capabilities';
  pptx.company = 'Research Prototype';
  
  // Define colors based on theme
  const colors = theme === 'light' ? {
    background: 'FFFFFF',
    primary: '3B82F6',
    accent: '8B5CF6',
    text: '1F2937',
    muted: '6B7280',
    cardBg: 'F8FAFC',
    warning: 'F59E0B'
  } : {
    background: '0F172A',
    primary: '60A5FA',
    accent: 'A78BFA',
    text: 'F8FAFC',
    muted: '9CA3AF',
    cardBg: '1E293B',
    warning: 'FBBF24'
  };
  
  // ===== TITLE SLIDE =====
  const titleSlide = pptx.addSlide();
  titleSlide.bkgd = colors.primary;
  
  // Research prototype warning banner
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: 0.5,
    fill: { color: 'FEF3C7' },
  });
  titleSlide.addText('⚠ RESEARCH PROTOTYPE - NO CLINICAL VALIDATION CONDUCTED', {
    x: 0, y: 0.15, w: '100%', h: 0.3,
    align: 'center', fontSize: 11, bold: true, color: 'B45309'
  });
  
  // Main title
  titleSlide.addText('Clinical AI Engine', {
    x: 0.5, y: 2, w: 9, h: 1,
    fontSize: 44, bold: true, color: 'FFFFFF',
    fontFace: 'Arial'
  });
  
  titleSlide.addText('8 Interactive Modules for Clinical Decision Support', {
    x: 0.5, y: 3, w: 9, h: 0.5,
    fontSize: 20, color: 'FFFFFF', fontFace: 'Arial'
  });
  
  titleSlide.addText('Powered by Google Gemini 3 Flash + Pro', {
    x: 0.5, y: 3.6, w: 9, h: 0.4,
    fontSize: 14, color: 'FFFFFF', italic: true
  });
  
  titleSlide.addText('NSO Quality Dashboard · Demo Voiceover Presentation', {
    x: 0.5, y: 4.8, w: 9, h: 0.4,
    fontSize: 12, color: 'FFFFFF'
  });
  
  if (includeNotes) {
    titleSlide.addNotes('TITLE SLIDE\n\nIntroduction: Welcome to the Clinical AI Engine demonstration. This presentation showcases 8 interactive AI modules designed for clinical decision support in nursing-sensitive outcomes. All analysis is powered by Google Gemini 3 models.\n\nKey talking points:\n- Research prototype status\n- 8 distinct modules\n- Gemini 3 Flash for speed, Pro for complex reasoning');
  }
  
  // ===== OVERVIEW SLIDE =====
  const overviewSlide = pptx.addSlide();
  overviewSlide.bkgd = colors.background;
  
  overviewSlide.addText('AI Module Overview', {
    x: 0.5, y: 0.5, w: 9, h: 0.6,
    fontSize: 28, bold: true, color: colors.text
  });
  
  // Create 2x4 grid of modules
  AI_MODULES.forEach((module, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.5 + col * 4.7;
    const y = 1.3 + row * 1.3;
    
    // Module card
    overviewSlide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 4.5, h: 1.1,
      fill: { color: colors.cardBg },
      line: { color: colors.primary, width: 1 },
      rectRadius: 0.1
    });
    
    // Icon + Title
    overviewSlide.addText(`${module.icon} ${module.title}`, {
      x: x + 0.15, y: y + 0.15, w: 4.2, h: 0.4,
      fontSize: 13, bold: true, color: colors.text
    });
    
    // Description
    overviewSlide.addText(module.description.substring(0, 80) + '...', {
      x: x + 0.15, y: y + 0.55, w: 4.2, h: 0.45,
      fontSize: 9, color: colors.muted, valign: 'top'
    });
  });
  
  if (includeNotes) {
    overviewSlide.addNotes('OVERVIEW SLIDE\n\nThis slide shows all 8 AI modules at a glance. Each module addresses a specific clinical decision support need:\n\n1. Clinical Notes Analysis - NLP for unstructured documentation\n2. SHAP Explainability - Transparent AI reasoning\n3. Intervention Recommender - Evidence-based actions\n4. Health Equity - Disparity detection\n5. Pressure Injury - Multimodal image analysis\n6. Smart Alerts - Context-aware notifications\n7. Unit Trends - Temporal pattern recognition\n8. Multi-Risk Assessment - Unified risk view');
  }
  
  // ===== INDIVIDUAL MODULE SLIDES =====
  AI_MODULES.forEach((module, idx) => {
    const slide = pptx.addSlide();
    slide.bkgd = colors.background;
    
    // Header with icon
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: 1.2,
      fill: { color: colors.primary }
    });
    
    slide.addText(`${module.icon} ${module.title}`, {
      x: 0.5, y: 0.35, w: 8, h: 0.5,
      fontSize: 24, bold: true, color: 'FFFFFF'
    });
    
    slide.addText(`Module ${idx + 1} of 8`, {
      x: 8.5, y: 0.4, w: 1, h: 0.4,
      fontSize: 11, color: 'FFFFFF', align: 'right'
    });
    
    // Description
    slide.addText(module.description, {
      x: 0.5, y: 1.4, w: 9, h: 0.6,
      fontSize: 14, color: colors.text, italic: true
    });
    
    // Key Features section
    slide.addText('Key Features', {
      x: 0.5, y: 2.2, w: 4, h: 0.4,
      fontSize: 16, bold: true, color: colors.primary
    });
    
    module.keyFeatures.forEach((feature, fi) => {
      slide.addText(`✓ ${feature}`, {
        x: 0.7, y: 2.6 + fi * 0.35, w: 4.5, h: 0.35,
        fontSize: 11, color: colors.text
      });
    });
    
    // Demo Scenario section
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 5.3, y: 2.2, w: 4.2, h: 2.5,
      fill: { color: colors.cardBg },
      line: { color: colors.accent, width: 1 },
      rectRadius: 0.1
    });
    
    slide.addText('Demo Scenario', {
      x: 5.5, y: 2.35, w: 3.8, h: 0.35,
      fontSize: 12, bold: true, color: colors.accent
    });
    
    slide.addText(`"${module.demoScenario}"`, {
      x: 5.5, y: 2.75, w: 3.8, h: 0.9,
      fontSize: 10, color: colors.muted, italic: true, valign: 'top'
    });
    
    slide.addText('Expected Output:', {
      x: 5.5, y: 3.7, w: 3.8, h: 0.3,
      fontSize: 10, bold: true, color: colors.text
    });
    
    slide.addText(module.expectedOutput, {
      x: 5.5, y: 4, w: 3.8, h: 0.65,
      fontSize: 9, color: colors.text, valign: 'top'
    });
    
    // Voiceover script box
    if (includeVoiceover) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.5, y: 4.2, w: 9, h: 0.9,
        fill: { color: 'FEF3C7' },
        line: { color: colors.warning, width: 1 },
        rectRadius: 0.08
      });
      
      slide.addText('🎤 Voiceover Script:', {
        x: 0.65, y: 4.3, w: 8.7, h: 0.25,
        fontSize: 9, bold: true, color: 'B45309'
      });
      
      slide.addText(module.voiceoverScript.substring(0, 200) + '...', {
        x: 0.65, y: 4.55, w: 8.7, h: 0.5,
        fontSize: 8, color: '92400E', valign: 'top'
      });
    }
    
    // Add speaker notes with full voiceover script
    if (includeNotes) {
      slide.addNotes(`${module.title.toUpperCase()}\n\n${'-'.repeat(40)}\n\nVOICEOVER SCRIPT:\n${module.voiceoverScript}\n\n${'-'.repeat(40)}\n\nKEY FEATURES TO HIGHLIGHT:\n${module.keyFeatures.map(f => `• ${f}`).join('\n')}\n\n${'-'.repeat(40)}\n\nDEMO SCENARIO:\n${module.demoScenario}\n\nEXPECTED OUTPUT:\n${module.expectedOutput}`);
    }
  });
  
  // ===== SUMMARY SLIDE =====
  const summarySlide = pptx.addSlide();
  summarySlide.bkgd = colors.background;
  
  summarySlide.addText('Summary & Next Steps', {
    x: 0.5, y: 0.5, w: 9, h: 0.6,
    fontSize: 28, bold: true, color: colors.text
  });
  
  const summaryPoints = [
    '8 AI modules covering clinical notes, risk assessment, interventions, equity, and more',
    'Powered by Google Gemini 3 for fast, accurate clinical decision support',
    'SHAP explainability ensures transparent, trustworthy AI recommendations',
    'Multi-risk unified view eliminates siloed assessment workflows',
    'Evidence-based interventions with regulatory compliance tracking'
  ];
  
  summaryPoints.forEach((point, i) => {
    summarySlide.addText(`✓ ${point}`, {
      x: 0.7, y: 1.4 + i * 0.5, w: 8.5, h: 0.45,
      fontSize: 14, color: colors.text
    });
  });
  
  // Disclaimer
  summarySlide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 4.2, w: 9, h: 0.8,
    fill: { color: 'FEE2E2' },
    line: { color: 'DC2626', width: 1 },
    rectRadius: 0.08
  });
  
  summarySlide.addText('⚠ RESEARCH PROTOTYPE - This system has not undergone clinical validation. AI-generated analysis is for decision support only. All findings require clinical verification.', {
    x: 0.7, y: 4.4, w: 8.6, h: 0.5,
    fontSize: 10, color: 'DC2626', valign: 'middle'
  });
  
  if (includeNotes) {
    summarySlide.addNotes('SUMMARY SLIDE\n\nClosing talking points:\n\n1. Recap the 8 modules and their clinical value\n2. Emphasize Gemini 3 speed and accuracy\n3. Highlight SHAP explainability for trust\n4. Mention unified multi-risk view as differentiator\n5. Stress research prototype status and need for clinical validation\n\nQ&A preparation:\n- Be ready to discuss validation roadmap\n- Explain integration possibilities with existing EHR systems\n- Discuss customization for specific clinical workflows');
  }
  
  // Generate and download
  const fileName = `ai-tools-demo-voiceover-${new Date().toISOString().split('T')[0]}.pptx`;
  await pptx.writeFile({ fileName });
  
  return fileName;
};
