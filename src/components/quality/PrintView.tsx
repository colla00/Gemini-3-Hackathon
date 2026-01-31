import { forwardRef } from 'react';
import { BarChart3, Calendar, Clock, User, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { patients, riskCategories } from '@/data/nursingOutcomes';
import { cn } from '@/lib/utils';
import type { ViewType } from '@/hooks/useAutoDemo';

interface PrintViewProps {
  viewType: ViewType;
}

export const PrintView = forwardRef<HTMLDivElement, PrintViewProps>(({ viewType }, ref) => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const highRiskPatients = patients.filter(p => p.fallsLevel === 'HIGH');
  const moderateRiskPatients = patients.filter(p => p.fallsLevel === 'MODERATE');

  return (
    <div ref={ref} className="hidden print:block bg-white text-black p-8 min-h-screen relative">
      {/* Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
        <div className="text-6xl font-bold text-gray-500 transform -rotate-45 whitespace-nowrap">
          RESEARCH PROTOTYPE
        </div>
      </div>
      
      {/* Research Warning Banner */}
      <div className="bg-amber-100 border-2 border-amber-500 rounded-lg p-3 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <span className="text-amber-800 font-bold text-sm">
          ⚠ RESEARCH PROTOTYPE — NO CLINICAL VALIDATION CONDUCTED — NOT FOR CLINICAL USE
        </span>
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold">NSO Quality Dashboard Report</h1>
            <p className="text-sm text-gray-600">Nurse-Sensitive Outcomes Monitoring • Research Prototype</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <div className="flex items-center gap-2 justify-end">
            <Calendar className="w-4 h-4" />
            <span>{currentDate}</span>
          </div>
          <div className="flex items-center gap-2 justify-end mt-1">
            <Clock className="w-4 h-4" />
            <span>{currentTime}</span>
          </div>
          <div className="flex items-center gap-2 justify-end mt-1">
            <User className="w-4 h-4" />
            <span>Unit 4C - Med/Surg</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="border border-gray-300 rounded p-4 text-center">
          <span className="text-3xl font-bold">{patients.length}</span>
          <p className="text-sm text-gray-600">Total Patients</p>
        </div>
        <div className="border border-red-500 rounded p-4 text-center bg-red-50">
          <span className="text-3xl font-bold text-red-600">{highRiskPatients.length}</span>
          <p className="text-sm text-gray-600">High Risk</p>
        </div>
        <div className="border border-yellow-500 rounded p-4 text-center bg-yellow-50">
          <span className="text-3xl font-bold text-yellow-600">{moderateRiskPatients.length}</span>
          <p className="text-sm text-gray-600">Moderate Risk</p>
        </div>
        <div className="border border-gray-300 rounded p-4 text-center">
          <span className="text-3xl font-bold">87%</span>
          <p className="text-sm text-gray-600">Avg Confidence</p>
        </div>
      </div>

      {/* Risk Categories */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 border-b pb-2">Risk Categories Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          {riskCategories.map((cat) => (
            <div key={cat.category} className="border border-gray-300 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{cat.label}</span>
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-bold",
                  cat.level === 'HIGH' ? 'bg-red-100 text-red-700' :
                  cat.level === 'MODERATE' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                )}>
                  {cat.level}
                </span>
              </div>
              <div className="text-2xl font-bold mb-2">{cat.score}%</div>
              <div className="text-xs text-gray-600">
                <strong>Key Factors:</strong>
                <ul className="mt-1">
                  {cat.factors.slice(0, 2).map((f, i) => (
                    <li key={i}>• {f.label}: {f.value}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High Risk Patient List */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 border-b pb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          High Risk Patients Requiring Attention
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left text-sm">Patient</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm">Room</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm">Falls Risk</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm">HAPI Risk</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm">CAUTI Risk</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm">Diagnosis</th>
            </tr>
          </thead>
          <tbody>
            {highRiskPatients.map((patient) => (
              <tr key={patient.id}>
                <td className="border border-gray-300 px-3 py-2 text-sm font-medium">
                  {patient.mrn} ({patient.age}{patient.sex})
                </td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{patient.bed}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm font-bold text-red-600">
                  {patient.fallsRisk}%
                </td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{patient.hapiRisk}%</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{patient.cautiRisk}%</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{patient.diagnosis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t-2 border-black text-xs text-gray-600 relative z-10">
        {/* Prominent Warning */}
        <div className="bg-amber-100 border-2 border-amber-500 rounded p-2 mb-3 text-center">
          <span className="font-bold text-amber-800">
            ⚠ RESEARCH PROTOTYPE — NO CLINICAL VALIDATION CONDUCTED — ALL METRICS ARE ILLUSTRATIVE DESIGN TARGETS
          </span>
        </div>
        
        <div className="text-center mb-3 font-semibold">
          Copyright © Dr. Alexis Collier | NSO Quality Dashboard – 4 U.S. Patents Filed | Protected Design – Do Not Copy
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span className="font-semibold">RESEARCH PROTOTYPE</span>
            <span>- Synthetic data for demonstration purposes only</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Generated: {currentDate} at {currentTime}</span>
          </div>
        </div>
        <p className="mt-2 text-[10px]">
          This report contains AI-generated risk predictions and should be used as a clinical decision support tool only. 
          All predictions require human clinical verification. NOT CLINICALLY VALIDATED. Not intended for diagnostic or treatment decisions.
        </p>
        <p className="mt-2 text-[9px] text-center">
          Created by Dr. Alexis Collier • U.S. Patents: 63/946,187 | 63/932,953 | 63/966,117 | 63/966,099
        </p>
      </div>
    </div>
  );
});

PrintView.displayName = 'PrintView';
