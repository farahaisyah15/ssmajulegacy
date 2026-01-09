import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// 1. Ikon SVG Custom
const Icons = {
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  ChevronLeft: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  ),
  MessageCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
  ),
  Sofa: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z"/><path d="M12 18v-2"/></svg>
  ),
  Utensils: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
  ),
  Bed: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
  ),
  All: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
    </svg>
  )
};

// 2. Komponen Butang WhatsApp dengan Hover Effect
const WhatsappButton = ({ link, label, styles }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <a 
      href={link} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...styles.btnWhatsapp,
        backgroundColor: isHovered ? '#16a34a' : '#22c55e',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isHovered ? '0 10px 20px rgba(34, 197, 94, 0.3)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <Icons.MessageCircle /> {label}
    </a>
  );
};

// 3. Komponen Card Produk dengan Hover Effect
const ProductCard = ({ p, styles, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease'
      }} 
      onClick={() => onSelect(p)}
    >
      <div style={{ overflow: 'hidden' }}>
        <img src={p.thumb} style={{ width: '100%', height: '300px', objectFit: 'cover', transform: isHovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.5s ease' }} alt={p.name} />
      </div>
      <div style={{ padding: '20px' }}>
        <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: 'bold' }}>{p.cat}</span>
        <h3 style={{ margin: '10px 0' }}>{p.name}</h3>
        <p style={styles.priceTag}>RM {Number(p.price).toLocaleString('en-MY')}</p>
      </div>
    </div>
  );
};

// 4. Komponen Utama App
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

  const styles = {
    container: { backgroundColor: '#f9fafb', minHeight: '100vh', width: '100%', fontFamily: 'sans-serif', color: '#111827', margin: 0, padding: 0 },
    hero: {
      height: '450px',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/src/assets/gambarkedai.jpg')`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', padding: '20px'
    },
    searchContainer: {
      maxWidth: '600px', margin: '-35px auto 30px', padding: '0 20px', position: 'relative', zIndex: 101
    },
    searchInputWrapper: {
      position: 'relative', display: 'flex', alignItems: 'center'
    },
    searchIcon: {
      position: 'absolute', left: '20px', color: '#9ca3af'
    },
    searchInput: {
      width: '100%', padding: '18px 20px 18px 55px', borderRadius: '50px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', fontSize: '16px', outline: 'none'
    },
    nav: { backgroundColor: 'white', padding: '20px', display: 'flex', justifyContent: 'center', gap: '25px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    catBtn: (isActive) => ({
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer',
      color: isActive ? '#2563eb' : '#9ca3af', transition: 'all 0.3s'
    }),
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 350px))', gap: '30px', padding: '50px 20px', maxWidth: '1200px', margin: '0 auto', justifyContent: 'center' },
    card: { backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', cursor: 'pointer', textAlign: 'center' },
    priceTag: { fontSize: '24px', fontWeight: '900', color: '#111827', margin: '15px 0' },
    btnWhatsapp: { backgroundColor: '#22c55e', color: 'white', padding: '15px 30px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '10px' }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '100px'}}>Memuatkan Katalog Perabot...</div>;

  return (
    <div style={styles.container}>
      {currentScreen === 'home' ? (
        <>
          <div style={styles.hero}>
            <h1 style={{ fontSize: '56px', fontWeight: '900', margin: 0, textTransform: 'uppercase' }}>PERABOT PREMIUM JATI</h1>
            <p style={{ fontSize: '14px', letterSpacing: '6px', borderTop: '1px solid rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.3)', padding: '12px 0', marginTop: '15px' }}>KUALITI PREMIUM • TERUS DARI KILANG</p>
          </div>

          {/* --- SEARCH BAR DENGAN IKON --- */}
          <div style={styles.searchContainer}>
            <div style={styles.searchInputWrapper}>
              <div style={styles.searchIcon}><Icons.Search /></div>
              <input 
                type="text" placeholder="Cari perabot idaman anda..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          <div style={styles.nav}>
            {['Semua', 'Sofa', 'Meja Makan', 'Katil'].map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={styles.catBtn(filter === cat)}>
                <div style={{ padding: '12px', backgroundColor: filter === cat ? '#eff6ff' : '#f9fafb', borderRadius: '50%' }}>
                  {cat === 'Sofa' && <Icons.Sofa />} {cat === 'Meja Makan' && <Icons.Utensils />} {cat === 'Katil' && <Icons.Bed />} {cat === 'Semua' && <Icons.All />}
                </div>
                <span style={{ fontWeight: 'bold', fontSize: '11px' }}>{cat}</span>
              </button>
            ))}
          </div>

          <div style={styles.grid}>
            {filteredData.length > 0 ? (
              filteredData.map(p => (
                <ProductCard key={p.id} p={p} styles={styles} onSelect={(prod) => { setSelectedProduct(prod); setCurrentScreen('gallery'); window.scrollTo(0,0); }} />
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#9ca3af' }}>Tiada produk ditemui untuk "{searchTerm}".</div>
            )}
          </div>
        </>
      ) : (
        <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '20px', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
            <button onClick={() => setCurrentScreen('home')} style={{ border: 'none', background: '#f3f4f6', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><Icons.ChevronLeft /></button>
            <h2 style={{ margin: 0 }}>{selectedProduct.name}</h2>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
            {selectedProduct.variants?.map((v, i) => (
              <div key={i} style={{ marginBottom: '80px' }}>
                <img src={v.img} style={{ width: '100%', maxWidth: '500px', height: 'auto', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', margin: '0 auto 25px', display: 'block' }} alt="" />
                <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Warna: {v.color}</h3>
                <WhatsappButton styles={styles} label="HUBUNGI WHATSAPP" link={`https://wa.me/60143106207?text=Saya berminat dengan ${selectedProduct.name} warna ${v.color}`} />
              </div>
            ))}
          </div>
        </div>
      )}
      <footer style={{ backgroundColor: '#000', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontWeight: '900', marginBottom: '10px' }}>PERABOT PREMIUM JATI</h2>
        <p style={{ color: '#666', fontSize: '12px', letterSpacing: '2px' }}>BY SSMAJU LEGACY</p>
      </footer>
    </div>
  );
};

export default App;