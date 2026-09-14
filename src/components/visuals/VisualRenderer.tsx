import React, { useState } from 'react';
import { VisualConfig } from '../../types';
import { VariationTable, validateVariationTable } from './VariationTable';
import { FunctionGraph } from './FunctionGraph';
import { Geometry2D, Geometry3D, CoordinateSystem } from './Geometry';
import { Maximize2, X } from 'lucide-react';

export function VisualRenderer({ visual }: { visual?: VisualConfig }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!visual || visual.type === 'NONE') return null;

  const renderContent = () => {
    switch (visual.type) {
      case 'IMAGE':
        return (
          <img 
            src={visual.source} 
            alt={visual.alt || 'Visual'} 
            className="max-w-full h-auto mx-auto rounded-lg object-contain"
            style={{ 
              maxWidth: visual.width || '100%', 
              aspectRatio: visual.aspectRatio || 'auto',
              maxHeight: isFullscreen ? '90vh' : '400px'
            }} 
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        );
      case 'VARIATION_TABLE':
        const isStudentView = typeof window !== 'undefined' && (window.location.pathname.includes('/exam') || window.location.pathname.includes('/result'));
        if (!validateVariationTable(visual.data)) {
           if (visual.source) {
             return <img src={visual.source} alt="fallback" className="max-w-full h-auto mx-auto rounded-lg object-contain" style={{ maxHeight: isFullscreen ? '90vh' : '400px' }} />;
           }
           if (isStudentView) {
             return null;
           }
        }
        return <VariationTable data={visual.data} />;
      case 'FUNCTION_GRAPH':
        return <FunctionGraph data={visual.data} />;
      case 'GEOMETRY_2D':
        return <Geometry2D data={visual.data} />;
      case 'GEOMETRY_3D':
        return <Geometry3D data={visual.data} />;
      case 'OXY':
      case 'OXYZ':
        return <CoordinateSystem data={visual.data} type={visual.type} />;
      default:
        if (visual.source) {
           return <img src={visual.source} alt="fallback" className="max-w-full h-auto mx-auto rounded-lg" style={{ maxHeight: '400px' }} />;
        }
        return null;
    }
  };

  return (
    <div className="my-6 relative group visual-renderer-container">
      {renderContent()}
      
      {/* Fullscreen toggle button for mobile/detail view */}
      <button 
        onClick={() => setIsFullscreen(true)}
        className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200"
        title="Phóng to hình"
      >
        <Maximize2 size={16} className="text-slate-600" />
      </button>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsFullscreen(false)}>
          <button 
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={() => setIsFullscreen(false)}
          >
            <X size={24} />
          </button>
          <div className="bg-white p-4 sm:p-8 rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="text-xl font-bold mb-4 border-b pb-2 text-slate-800">Chi tiết hình minh họa</div>
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
}
