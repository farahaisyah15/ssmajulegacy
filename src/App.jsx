import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// 1. Ikon SVG Custom
const Icons = {
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  ChevronLeft: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  MessageCircle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>,
  Sofa: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z"/><path d="M12 18v-2"/></svg>,
  Mejamakan: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>,
  Bed: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>,
  All: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
  Lacitepi: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M3 12h18M11 9h2M11 15h2"/></svg>,
  Bidai: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3z"/></svg>,
  Buaian: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2v16m12-16v16M4 18h16M7 10h10a5 5 0 0 1-10 0z"/></svg>,
  Kerusi: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 20v-8m10 8v-8M5 12h14V8a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4zm2 0v3h10v-3"/></svg>,
  Cermin: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="12" rx="7" ry="10"/></svg>,
  Tingkap: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="18" x="5" y="3" rx="1"/><path d="M5 12h14M12 3v18"/></svg>,
  WhatsApp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" stroke="white" strokeWidth="0.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  ),
  TikTok: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.84-.6-4.13-1.46-.14 2.45-.12 4.9.01 7.35.11 1.95-.33 3.99-1.61 5.56-1.34 1.71-3.6 2.61-5.74 2.53-2.31-.08-4.57-1.25-5.76-3.25-1.52-2.38-1.29-5.75.52-7.89 1.4-1.74 3.73-2.61 5.91-2.22V14.5c-1.11-.27-2.36-.05-3.23.72-.94.77-1.3 2.1-1.02 3.26.25 1.16 1.25 2.13 2.43 2.34 1.16.23 2.48-.15 3.19-1.1.66-.81.87-1.92.83-2.93-.05-3.66-.02-7.32-.03-10.98.01-2.26 0-4.52.02-6.79z" fill="#000000"/><path d="M12.525.02c-.02 2.27-.01 4.53-.02 6.79 0 3.66-.02 7.32.03 10.98.04 1.01-.17 2.12-.83 2.93-.71.95-2.03 1.33-3.19 1.1-1.18-.21-2.18-1.18-2.43-2.34-.28-1.16.08-2.49 1.02-3.26.87-.77 2.12-.99 3.23-.72v-4.04c-2.18-.39-4.51.48-5.91 2.22-1.81 2.14-2.04 5.51-.52 7.89 1.19 2 3.45 3.17 5.76 3.25 2.14.08 4.4-.82 5.74-2.53 1.28-1.57 1.72-3.61 1.61-5.56-.13-2.45-.15-4.9-.01-7.35 1.29.86 2.69 1.29 4.13 1.46V5.96c-1.54-.17-3.12-.68-4.24-1.79-1.12-1.08-1.67-2.64-1.75-4.17-1.3.01-2.6.01-3.91.02z" fill="#ff2d55" style={{mixBlendMode:'screen'}}/><path d="M12.525.02c-.02 2.27-.01 4.53-.02 6.79 0 3.66-.02 7.32.03 10.98.04 1.01-.17 2.12-.83 2.93-.71.95-2.03 1.33-3.19 1.1-1.18-.21-2.18-1.18-2.43-2.34-.28-1.16.08-2.49 1.02-3.26.87-.77 2.12-.99 3.23-.72v-4.04c-2.18-.39-4.51.48-5.91 2.22-1.81 2.14-2.04 5.51-.52 7.89 1.19 2 3.45 3.17 5.76 3.25 2.14.08 4.4-.82 5.74-2.53 1.28-1.57 1.72-3.61 1.61-5.56-.13-2.45-.15-4.9-.01-7.35 1.29.86 2.69 1.29 4.13 1.46V5.96c-1.54-.17-3.12-.68-4.24-1.79-1.12-1.08-1.67-2.64-1.75-4.17-1.3.01-2.6.01-3.91.02z" fill="#25f4ee" style={{mixBlendMode:'multiply'}}/></svg>
  ),
  Facebook: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/><path d="M16.671 15.458l.532-3.47h-3.328V9.738c0-.949.465-1.874 1.956-1.874h1.513V4.91s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.67v2.613H7.078v3.47h3.047v8.385a12.09 12.09 0 001.938.157c.65 0 1.284-.052 1.906-.152v-8.39h2.702z" fill="white"/></svg>
  ),
};

const ProductCard = ({ p, onSelect }) => {
  const totalStok = p.variants?.reduce((acc, curr) => acc + (Number(curr.stok) || 0), 0) || 0;
  return (
    <div onClick={() => onSelect(p)} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={p.thumb} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-600 shadow-sm border border-white/20">{p.cat}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{p.name}</h3>
        <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${totalStok > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{totalStok > 0 ? `Stok: ${totalStok} Unit` : 'Stok Habis'}</p>
        
{p.note && (
          <div className="flex items-start gap-1 mb-4">
            <span className="text-blue-500 text-[10px]">*</span>
            <p className="text-[10px] text-red-400 italic leading-tight">
              {p.note}
            </p>
          </div>
        )}

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

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filter, setFilter] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [perabotData, setPerabotData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCatBar, setShowCatBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Ambil Data dari Supabase
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

  // Logic Skrol (Hanya Cat Bar yang hilang)
  useEffect(() => {
    const controlCatBar = () => {
    const currentScrollY = window.scrollY;

    // Tambah threshold (5px) untuk elakkan flickering pada pergerakan halus
    if (Math.abs(currentScrollY - lastScrollY) < 5) return;

    if (currentScrollY > lastScrollY && currentScrollY > 300) {
      setShowCatBar(false);
    } else {
      setShowCatBar(true);
    }
    
    setLastScrollY(currentScrollY);
  };
    window.addEventListener('scroll', controlCatBar);
    return () => window.removeEventListener('scroll', controlCatBar);
  }, [lastScrollY]);

  const categoryList = [
    { id: 'Semua', label: 'Semua', icon: <Icons.All /> },
    { id: 'Sofa', label: 'Sofa', icon: <Icons.Sofa /> },
    { id: 'Meja Makan', label: 'Meja Makan', icon: <Icons.Mejamakan /> },
    { id: 'Katil', label: 'Katil', icon: <Icons.Bed /> },
    { id: 'Laci Tepi', label: 'Laci', icon: <Icons.Lacitepi /> },
    { id: 'Bidai', label: 'Bidai', icon: <Icons.Bidai /> },
    { id: 'Buaian', label: 'Buaian', icon: <Icons.Buaian /> },
    { id: 'Kerusi', label: 'Kerusi', icon: <Icons.Kerusi /> },
    { id: 'Cermin', label: 'Cermin', icon: <Icons.Cermin /> },
    { id: 'Tingkap', label: 'Tingkap', icon: <Icons.Tingkap /> },
  ];

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
          <header className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center px-6 overflow-hidden bg-slate-900">
            <div className="absolute inset-0 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 scale-105" alt="Hero" style={{animationDuration: '30s'}} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#fafafa]"></div>
            <div className="relative z-10 max-w-5xl flex flex-col items-center">
              <div className="inline-flex items-center gap-3 px-6 py-2 border border-yellow-600/40 rounded-full bg-black/40 backdrop-blur-md mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.3em]">Koleksi Eksklusif 2026</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 tracking-tight leading-[1.1]">
                Perabot <span className="italic text-yellow-500 font-serif"> Premium Jati</span>
                <br />
                <span className="text-2xl md:text-5xl font-sans font-light tracking-[0.3em] uppercase mt-4 block text-white/90">Terus dari Kilang</span>
              </h1>
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-white/30 hidden md:block"></div>
                <p className="text-gray-300 text-xs md:text-sm tracking-[0.2em] uppercase font-light max-w-xl leading-relaxed">by ssmaju legacy</p>
                <div className="h-[1px] w-12 bg-white/30 hidden md:block"></div>
              </div>
            </div>
          </header>

          {/* Sticky Search & Category Bar */}
          <div className="sticky top-0 z-50 -mt-8 px-4">
            <div className="max-w-3xl mx-auto space-y-2">
              {/* Search Bar - Sentiasa Ada */}
              <div className="relative shadow-xl">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></div>
                <input 
                  type="text" 
                  placeholder="Cari perabot idaman..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border-none shadow-lg outline-none" 
                />
              </div>

              {/* Category Bar - Boleh Hilang */}
              <div className={`transition-all duration-500 ease-in-out origin-top ${showCatBar ? 'opacity-100 scale-100 h-auto' : 'opacity-0 scale-95 pointer-events-none h-0 overflow-hidden'}`}>
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-1 shadow-md border border-gray-100">
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
                    {categoryList.map(cat => (
                      <button key={cat.id} onClick={() => setFilter(cat.id)} className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all ${filter === cat.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <div className={`scale-75 ${filter === cat.id ? 'text-white' : 'text-gray-400'}`}>{cat.icon}</div>
                        <span className="text-[8px] font-bold uppercase tracking-tighter leading-none">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredData.length > 0 ? filteredData.map(p => (
                <ProductCard key={p.id} p={p} onSelect={(prod) => { setSelectedProduct(prod); setCurrentScreen('gallery'); window.scrollTo(0,0); }} />
              )) : (
                <div className="col-span-full text-center py-20">
                  <div className="inline-flex p-5 rounded-full bg-gray-50 mb-4"><Icons.Search /></div>
                  <p className="text-gray-400 font-medium italic">Tiada produk ditemui untuk "{searchTerm}"</p>
                </div>
              )}
            </div>
          </main>
        </>
      ) : (
        <div className="bg-white min-h-screen">
          <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-50 px-6 py-4 flex items-center justify-between">
            <button onClick={() => setCurrentScreen('home')} className="p-2 hover:bg-gray-100 rounded-full transition-all flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
              <Icons.ChevronLeft /><span className="hidden md:inline">Kembali</span>
            </button>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] line-clamp-1">{selectedProduct.name}</h2>
            <div className="w-10" />
          </nav>
          <div className="max-w-4xl mx-auto px-6 py-12">
            <header className="text-center mb-16">
              <span className="text-blue-600 font-black text-[10px] tracking-[0.3em] uppercase">{selectedProduct.cat}</span>
              <h1 className="text-4xl md:text-5xl font-black mt-3 mb-6 tracking-tight text-gray-900">{selectedProduct.name}</h1>
</header>
            
            {/* Grid 1 kolum (mobile), 2 kolum (laptop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {selectedProduct.variants?.map((v, i) => (
                <div key={i} className="group animate-in fade-in slide-in-from-bottom-10 duration-700">
                  {/* Gambar Varians */}
                  <div className="relative rounded-[2rem] overflow-hidden shadow-xl bg-gray-50 mb-6 border border-gray-100 aspect-square">
                    <img 
                      src={v.img} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      alt={v.color} 
                    />
                  </div>

                  {/* Info Varians */}
                  <div className="px-2 mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{v.color}</h3>
                        <p className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${Number(v.stok) > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {Number(v.stok) > 0 ? `Stok Yang Tersedia: ${v.stok}` : 'Maaf, Kehabisan Stok'}
                        </p>
                      </div>
                      <span className="text-lg font-black text-blue-600">RM {Number(v.price || selectedProduct.price).toLocaleString('en-MY')}</span>
                    </div>
                  </div>

                  {/* Butang WhatsApp */}
                  <a 
                    href={`https://wa.me/60143106207?text=${encodeURIComponent(`Saya berminat dengan ${selectedProduct.name} (Warna: ${v.color})`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-[10px] tracking-[0.15em] shadow-xl transition-all bg-[#22c55e] hover:bg-[#16a34a] text-white active:scale-95"
                  >
                    <Icons.MessageCircle /> {Number(v.stok) > 0 ? "TEMPAH SEKARANG" : "TANYA STOK AKAN DATANG"}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#0f172a] text-white py-20 px-6 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-black tracking-[0.3em] mb-4 uppercase">Perabot Premium Jati</h2>
            <p className="text-blue-400 text-[10px] tracking-[0.5em] uppercase font-bold">By SSMAJU Legacy</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="space-y-5">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 border-l-2 border-green-500 pl-3">Tempahan WhatsApp</h4>
              <div className="flex flex-col gap-4">
                <a href="https://wa.me/601156588884" target="_blank" className="group flex items-center gap-3 text-sm hover:text-green-400 transition-all">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-green-500/20"><Icons.WhatsApp /></div>
                  <span>Amka (Sales)</span>
                </a>
                <a href="https://wa.me/601136829632" target="_blank" className="group flex items-center gap-3 text-sm hover:text-green-400 transition-all">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-green-500/20"><Icons.WhatsApp /></div>
                  <span>Pie (Sales)</span>
                </a>
                <a href="https://wa.me/60123456789" target="_blank" className="group flex items-center gap-3 text-sm hover:text-green-400 transition-all">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-green-500/20"><Icons.WhatsApp /></div>
                  <span>Pejabat / Office</span>
                </a>
              </div>
            </div>
            <div className="space-y-5">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 border-l-2 border-blue-500 pl-3">Media Sosial</h4>
              <div className="flex flex-col gap-4">
                <a href="https://tiktok.com/@premiumjati" target="_blank" className="group flex items-center gap-3 text-sm hover:text-pink-500 transition-all">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-pink-500/20"><Icons.TikTok /></div>
                  <span>TikTok @premiumjati</span>
                </a>
                <a href="https://facebook.com/SSMajuLegacy" target="_blank" className="group flex items-center gap-3 text-sm hover:text-blue-500 transition-all">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/20"><Icons.Facebook /></div>
                  <span>Facebook SS Maju Legacy</span>
                </a>
              </div>
            </div>
            <div className="space-y-5">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 border-l-2 border-yellow-500 pl-3">Waktu Operasi</h4>
              <div className="text-sm text-gray-400 leading-relaxed">
                <p className="font-bold text-white">Isnin - Jumaat </p>
                <p>2:00 PM - 12:00 AM</p>
                <p className="font-bold text-white">Sabtu - Ahad </p>
                <p>10:00 AM- 12:00 AM</p>
                <p className="mt-2 font-bold text-red-400">Rabu: Tutup</p>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-white/10 mb-10"></div>
          <div className="text-center">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-loose">
              © 2026 SSMAJU Legacy. Semua Hak Terpelihara.<br/>
              Pakar Perabot Jati Berkualiti Tinggi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;