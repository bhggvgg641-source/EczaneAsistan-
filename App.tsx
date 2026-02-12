import React, { useState, useEffect, useCallback } from 'react';
import { initializeDatabase, searchMedicineLocally } from './services/medicineService';
import { classifyMedicineWithGemini } from './services/geminiService';
import { sendTelegramMessage } from './services/telegramService';
import { MedicineResult, SearchStatus } from './types';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import { Pill } from 'lucide-react';

function App() {
  const [status, setStatus] = useState<SearchStatus>(SearchStatus.IDLE);
  const [result, setResult] = useState<MedicineResult | null>(null);
  const [initialQuery, setInitialQuery] = useState('');

  // Initialize DB on Mount
  useEffect(() => {
    initializeDatabase();
    
    // Check for query parameters (e.g., from AutoHotkey)
    // URL example: http://localhost:3000/?q=Aspirin
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get('q');
    
    if (queryParam) {
      setInitialQuery(queryParam);
      handleSearch(queryParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) return;

    setStatus(SearchStatus.SEARCHING);
    setResult(null);

    try {
      // 1. Check Local Database
      const location = searchMedicineLocally(query);
      
      let finalResult: MedicineResult;

      if (location) {
        // Found in DB
        finalResult = {
          name: query.toUpperCase(),
          location: location,
          source: 'DATABASE',
          found: true,
          timestamp: new Date().toLocaleString('tr-TR'),
        };
        setStatus(SearchStatus.SUCCESS);
        
        // Notify Telegram
        const telegramMsg = `Konum: ${finalResult.location}\n💊 İsim: ${finalResult.name}\n✅ İLAÇ BULUNDU`;
        sendTelegramMessage(telegramMsg);

      } else {
        // 2. Not found, use Gemini
        setStatus(SearchStatus.CLASSIFYING);
        const category = await classifyMedicineWithGemini(query);
        
        finalResult = {
          name: query.toUpperCase(),
          category: category,
          source: 'AI_CLASSIFICATION',
          found: false,
          timestamp: new Date().toLocaleString('tr-TR'),
        };
        setStatus(SearchStatus.SUCCESS);

        // Notify Telegram
        const telegramMsg = `⚠️ İLAÇ BULUNAMADI - AI TAHMİNİ\n\n💊 İsim: ${finalResult.name}\n🧠 Kategori: ${finalResult.category}`;
        sendTelegramMessage(telegramMsg);
      }

      setResult(finalResult);

    } catch (error) {
      console.error(error);
      setStatus(SearchStatus.ERROR);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2 rounded-lg text-white">
              <Pill size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">Eczane Asistanı</h1>
              <span className="text-xs text-teal-600 font-medium tracking-wide">AKILLI RAF SİSTEMİ</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="text-center mb-10">
           <h2 className="text-4xl font-bold text-gray-900 mb-4">İlaç Ara</h2>
           <p className="text-lg text-gray-500 max-w-2xl mx-auto">
             İlacın adını girerek raf konumunu bulun. Veritabanında yoksa, yapay zeka ile kategorisini öğrenin.
           </p>
        </div>

        <SearchBar 
          onSearch={handleSearch} 
          isLoading={status === SearchStatus.SEARCHING || status === SearchStatus.CLASSIFYING} 
          initialValue={initialQuery}
        />

        {/* Status Indicators */}
        <div className="mt-8 text-center h-8">
           {status === SearchStatus.SEARCHING && (
             <span className="inline-flex items-center text-teal-600 font-medium animate-pulse">
               Veritabanı taranıyor...
             </span>
           )}
           {status === SearchStatus.CLASSIFYING && (
             <span className="inline-flex items-center text-purple-600 font-medium animate-pulse">
               Google Gemini ile analiz ediliyor...
             </span>
           )}
           {status === SearchStatus.ERROR && (
             <span className="text-red-500 font-medium">
               Bir hata oluştu. Lütfen tekrar deneyin.
             </span>
           )}
        </div>

        {/* Results */}
        {result && <ResultCard result={result} />}

        {/* Instructions */}
        {!result && status === SearchStatus.IDLE && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-70">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 font-bold">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Otomatik Seçim</h3>
              <p className="text-sm text-gray-500">Bilgisayarınızda herhangi bir metni seçip kısayol (Alt+D) kullanın.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4 font-bold">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Hızlı Arama</h3>
              <p className="text-sm text-gray-500">Veritabanında kayıtlı ilaçlar anında raf bilgisiyle birlikte listelenir.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4 font-bold">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Desteği</h3>
              <p className="text-sm text-gray-500">Kayıtlı olmayan ilaçlar için yapay zeka destekli kategori tahmini yapılır.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;