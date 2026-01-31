import html2canvas from 'html2canvas';

export interface ModuleScreenshot {
  moduleId: string;
  dataUrl: string;
  width: number;
  height: number;
}

export interface ScreenshotProgress {
  current: number;
  total: number;
  moduleName: string;
}

const MODULE_IDS = [
  'clinical-notes',
  'risk-narrative', 
  'interventions',
  'health-equity',
  'pressure-injury',
  'smart-alert',
  'unit-trends',
  'multi-risk'
] as const;

const MODULE_NAMES: Record<string, string> = {
  'clinical-notes': 'Clinical Notes Analysis',
  'risk-narrative': 'Explainable Risk Narrative',
  'interventions': 'Intervention Recommender',
  'health-equity': 'Health Equity Analyzer',
  'pressure-injury': 'Pressure Injury Assessment',
  'smart-alert': 'Smart Alert Generation',
  'unit-trends': 'Unit Trend Analysis',
  'multi-risk': 'Multi-Risk Assessment'
};

/**
 * Captures a screenshot of a specific module's result area
 */
export const captureModuleScreenshot = async (moduleId: string): Promise<ModuleScreenshot | null> => {
  // Look for the module card by data attribute or id
  const moduleElement = document.querySelector(`[data-module-id="${moduleId}"]`) as HTMLElement;
  
  if (!moduleElement) {
    console.warn(`Module element not found: ${moduleId}`);
    return null;
  }

  // Find the result area within the module (the expanded content)
  const resultArea = moduleElement.querySelector('[data-result-area]') as HTMLElement 
    || moduleElement.querySelector('.module-result') as HTMLElement
    || moduleElement;

  if (!resultArea) {
    console.warn(`Result area not found for module: ${moduleId}`);
    return null;
  }

  try {
    const canvas = await html2canvas(resultArea, {
      backgroundColor: null,
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true,
      // Ignore certain elements that might cause issues
      ignoreElements: (element) => {
        return element.classList?.contains('screenshot-ignore') || false;
      }
    });

    return {
      moduleId,
      dataUrl: canvas.toDataURL('image/png'),
      width: canvas.width,
      height: canvas.height
    };
  } catch (error) {
    console.error(`Failed to capture screenshot for ${moduleId}:`, error);
    return null;
  }
};

/**
 * Captures the entire AI tools panel
 */
export const captureFullPanel = async (): Promise<string | null> => {
  const panel = document.querySelector('[data-ai-tools-panel]') as HTMLElement;
  
  if (!panel) {
    console.warn('AI Tools panel not found');
    return null;
  }

  try {
    const canvas = await html2canvas(panel, {
      backgroundColor: '#ffffff',
      scale: 1.5,
      logging: false,
      useCORS: true,
      windowWidth: 1200,
      windowHeight: panel.scrollHeight
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to capture full panel:', error);
    return null;
  }
};

/**
 * Captures all module screenshots with progress callback
 */
export const captureAllModuleScreenshots = async (
  onProgress?: (progress: ScreenshotProgress) => void
): Promise<Map<string, ModuleScreenshot>> => {
  const screenshots = new Map<string, ModuleScreenshot>();
  
  for (let i = 0; i < MODULE_IDS.length; i++) {
    const moduleId = MODULE_IDS[i];
    
    onProgress?.({
      current: i + 1,
      total: MODULE_IDS.length,
      moduleName: MODULE_NAMES[moduleId] || moduleId
    });

    const screenshot = await captureModuleScreenshot(moduleId);
    if (screenshot) {
      screenshots.set(moduleId, screenshot);
    }
    
    // Small delay between captures to prevent browser lag
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return screenshots;
};

/**
 * Captures a specific DOM element by selector
 */
export const captureElement = async (selector: string): Promise<string | null> => {
  const element = document.querySelector(selector) as HTMLElement;
  
  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return null;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error(`Failed to capture element ${selector}:`, error);
    return null;
  }
};

/**
 * Converts base64 data URL to a format suitable for PptxGenJS
 */
export const dataUrlToBase64 = (dataUrl: string): string => {
  // PptxGenJS expects base64 without the data:image/png;base64, prefix
  return dataUrl.replace(/^data:image\/\w+;base64,/, '');
};

export { MODULE_IDS, MODULE_NAMES };
