import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// 1. Ikon SVG Custom (Saiz dioptimumkan untuk UX)
const Icons = {
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  ChevronLeft: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  MessageCircle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>,
  Sofa: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z"/><path d="M12 18v-2"/></svg>,
  Utensils: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>,
  Bed: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>,
  All: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
};

// 2. Komponen Card Produk (Improved UI)
const ProductCard = ({ p, onSelect }) => {
  const totalStok = p.variants?.reduce((acc, curr) => acc + (Number(curr.stok) || 0), 0) || 0;

  return (
    <div 
      onClick={() => onSelect(p)}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={p.thumb} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt={p.name} 
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-600 shadow-sm border border-white/20">
            {p.cat}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
          {p.name}
        </h3>
        <p className={`text-[11px] font-bold uppercase tracking-wider mb-4 ${totalStok > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {totalStok > 0 ? `Stok: ${totalStok} Unit` : 'Stok Habis'}
        </p>
        <div className="flex flex-col border-t border-gray-50 pt-4">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Bermula Dari</span>
          <div className="flex items-center justify-between">
            <p className="text-xl font-black text-gray-900">
              <span className="text-xs font-medium mr-1">RM</span>
              {Number(p.price).toLocaleString('en-MY')}
            </p>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Komponen Utama
const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filter, setFilter] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [perabotData, setPerabotData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ambilData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('perabot').select('*');
      if (error) console.error("Error tarik data:", error);
      else setPerabotData(data || []);
      setLoading(false);
    };
    ambilData();
  }, []);

  const filteredData = perabotData.filter(p => {
    const matchFilter = filter === 'Semua' || p.cat === filter;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Memuatkan Katalog...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans text-gray-900">
      {currentScreen === 'home' ? (
        <>
          {/* Hero Section */}
          <header className="relative h-[450px] flex items-center justify-center text-center px-6 overflow-hidden">
            <img 
              src="https://knwgotcdbfxgdmumblqq.supabase.co/storage/v1/object/public/asset/gambarkedai.jpg" 
              className="absolute inset-0 w-full h-full object-cover opacity-70" 
              alt="Hero"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#fafafa]"></div>
            
            <div className="relative z-10 max-w-3xl">
              <span className="inline-block px-4 py-1 border border-white/30 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-4 backdrop-blur-sm">
                Edisi Eksklusif 2026
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase">
                Premium <span className="text-blue-500 italic font-serif normal-case tracking-normal">Jati</span>
              </h1>
              <p className="text-white/80 text-xs md:text-sm tracking-[0.3em] uppercase font-medium">Kualiti Terbaik • Terus Dari Kilang</p>
            </div>
          </header>

          <div className="sticky top-0 z-50 -mt-10">
            <div className="max-w-6xl mx-auto px-4">
              <div className="relative group mb-6">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Icons.Search />
                </div>
                <input 
                  type="text" 
                  placeholder="Cari koleksi idaman anda..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl shadow-xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-700 transition-all font-medium"
                />
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-sm border border-gray-100 flex items-center justify-center gap-2 md:gap-8 overflow-x-auto no-scrollbar">
                {['Semua', 'Sofa', 'Meja Makan', 'Katil'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => { setFilter(cat); window.scrollTo({top: 380, behavior: 'smooth'}); }}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all whitespace-nowrap
                      ${filter === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <div className={filter === cat ? 'text-white' : 'text-gray-400'}>
                      {cat === 'Sofa' && <Icons.Sofa />} 
                      {cat === 'Meja Makan' && <Icons.Utensils />} 
                      {cat === 'Katil' && <Icons.Bed />} 
                      {cat === 'Semua' && <Icons.All />}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredData.length > 0 ? (
                filteredData.map(p => (
                  <ProductCard key={p.id} p={p} onSelect={(prod) => { setSelectedProduct(prod); setCurrentScreen('gallery'); window.scrollTo(0,0); }} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="inline-flex p-5 rounded-full bg-gray-50 mb-4">
                    <Icons.Search />
                  </div>
                  <p className="text-gray-400 font-medium italic">Tiada produk ditemui untuk "{searchTerm}"</p>
                </div>
              )}
            </div>
          </main>
        </>
      ) : (
        <div className="bg-white min-h-screen">
          <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-50 px-6 py-4 flex items-center justify-between">
            <button 
              onClick={() => setCurrentScreen('home')} 
              className="p-2 hover:bg-gray-100 rounded-full transition-all flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest"
            >
              <Icons.ChevronLeft />
              <span className="hidden md:inline">Kembali</span>
            </button>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] line-clamp-1">{selectedProduct.name}</h2>
            <div className="w-10" />
          </nav>

          <div className="max-w-4xl mx-auto px-6 py-12">
            <header className="text-center mb-16">
              <span className="text-blue-600 font-black text-[10px] tracking-[0.3em] uppercase">{selectedProduct.cat}</span>
              <h1 className="text-4xl md:text-5xl font-black mt-3 mb-6 tracking-tight text-gray-900">{selectedProduct.name}</h1>
            </header>

            <div className="space-y-24">
              {selectedProduct.variants?.map((v, i) => (
                <div key={i} className="group animate-in fade-in slide-in-from-bottom-10 duration-700">
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-50 mb-8 border border-gray-100">
                    <img src={v.img} className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105" alt={v.color} />
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">{v.color}</h3>
                        <span className="text-lg font-black text-blue-600">RM {Number(v.price || selectedProduct.price).toLocaleString('en-MY')}</span>
                      </div>
                      <p className={`text-sm font-bold uppercase tracking-widest mt-2 ${Number(v.stok) > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {Number(v.stok) > 0 ? `Stok Yang Tersedia: ${v.stok}` : 'Maaf, Kehabisan Stok'}
                      </p>
                    </div>
                    
                    <a 
                      href={`https://wa.me/60143106207?text=${encodeURIComponent(`Saya berminat dengan ${selectedProduct.name} (Warna: ${v.color}) - Harga: RM ${Number(v.price || selectedProduct.price).toLocaleString('en-MY')}${Number(v.stok) > 0 ? '' : '. Bila stok akan datang?'}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-[10px] tracking-[0.15em] shadow-xl transition-all ${Number(v.stok) > 0 ? 'bg-[#22c55e] hover:bg-[#16a34a] shadow-emerald-200' : 'bg-[#22c55e] hover:bg-[#16a34a] shadow-emerald-200'} text-white active:scale-95`}
                    >
                      <Icons.MessageCircle /> 
                      {Number(v.stok) > 0 ? "TEMPAH SEKARANG" : "TANYA STOK AKAN DATANG"}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#0f172a] text-white py-20 px-6 text-center mt-20">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-black tracking-[0.3em] mb-4 uppercase">Perabot Premium Jati</h2>
          <p className="text-blue-400 text-[10px] tracking-[0.5em] uppercase mb-10 font-bold">By SSMAJU Legacy</p>
          <div className="h-px w-full bg-white/10 mb-10"></div>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-loose">
            © 2026 Semua Hak Terpelihara.<br/>Kualiti Jati Terbaik Untuk Kediaman Anda.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;