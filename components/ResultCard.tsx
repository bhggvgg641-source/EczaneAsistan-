import React from 'react';
import { MedicineResult } from '../types';
import { MapPin, BrainCircuit, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResultCardProps {
  result: MedicineResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const isDatabaseSource = result.source === 'DATABASE';

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-in-up">
      <div className={`rounded-3xl shadow-xl overflow-hidden bg-white border ${isDatabaseSource ? 'border-teal-100' : 'border-amber-100'}`}>
        {/* Header Section */}
        <div className={`p-6 ${isDatabaseSource ? 'bg-teal-50' : 'bg-amber-50'} border-b ${isDatabaseSource ? 'border-teal-100' : 'border-amber-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${isDatabaseSource ? 'text-teal-600' : 'text-amber-600'}`}>
                {isDatabaseSource ? 'Veritabanında Bulundu' : 'Yapay Zeka Sınıflandırması'}
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900">{result.name}</h2>
            </div>
            <div className={`p-3 rounded-full ${isDatabaseSource ? 'bg-teal-100 text-teal-600' : 'bg-amber-100 text-amber-600'}`}>
              {isDatabaseSource ? <CheckCircle2 size={32} /> : <BrainCircuit size={32} />}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {isDatabaseSource ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="text-teal-500 mt-1 shrink-0" size={28} />
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Konum / Raf Bilgisi</p>
                  <p className="text-4xl font-black text-gray-800 tracking-tight leading-tight">
                    {result.location}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="text-amber-600" size={20} />
                    <p className="text-amber-800 font-medium">Bu ilaç veritabanında bulunamadı.</p>
                </div>
                <p className="text-amber-700 text-sm">
                   Aşağıdaki bilgi yapay zeka tarafından tahmin edilmiştir.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <BrainCircuit className="text-purple-500 mt-1 shrink-0" size={28} />
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Tahmini Kategori</p>
                  <p className="text-3xl font-bold text-gray-800">{result.category}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 flex justify-between items-center text-xs text-gray-400">
          <span>{result.timestamp}</span>
          <span>Telegram'a iletildi</span>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;