import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

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
  Almari: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="18" x="5" y="3" rx="1"/><path d="M12 3v18M5 10h14M5 14h14"/></svg>,
  WhatsApp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" stroke="white" strokeWidth="0.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  ),
  Facebook: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/><path d="M16.671 15.458l.532-3.47h-3.328V9.738c0-.949.465-1.874 1.956-1.874h1.513V4.91s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.67v2.613H7.078v3.47h3.047v8.385a12.09 12.09 0 001.938.157c.65 0 1.284-.052 1.906-.152v-8.39h2.702z" fill="white"/></svg>
  ),
  TikTok: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.84-.6-4.13-1.46-.14 2.45-.12 4.9.01 7.35.11 1.95-.33 3.99-1.61 5.56-1.34 1.71-3.6 2.61-5.74 2.53-2.31-.08-4.57-1.25-5.76-3.25-1.52-2.38-1.29-5.75.52-7.89 1.4-1.74 3.73-2.61 5.91-2.22V14.5c-1.11-.27-2.36-.05-3.23.72-.94.77-1.3 2.1-1.02 3.26.25 1.16 1.25 2.13 2.43 2.34 1.16.23 2.48-.15 3.19-1.1.66-.81.87-1.92.83-2.93-.05-3.66-.02-7.32-.03-10.98.01-2.26 0-4.52.02-6.79z" fill="#000000"/><path d="M12.525.02c-.02 2.27-.01 4.53-.02 6.79 0 3.66-.02 7.32.03 10.98.04 1.01-.17 2.12-.83 2.93-.71.95-2.03 1.33-3.19 1.1-1.18-.21-2.18-1.18-2.43-2.34-.28-1.16.08-2.49 1.02-3.26.87-.77 2.12-.99 3.23-.72v-4.04c-2.18-.39-4.51.48-5.91 2.22-1.81 2.14-2.04 5.51-.52 7.89 1.19 2 3.45 3.17 5.76 3.25 2.14.08 4.4-.82 5.74-2.53 1.28-1.57 1.72-3.61 1.61-5.56-.13-2.45-.15-4.9-.01-7.35 1.29.86 2.69 1.29 4.13 1.46V5.96c-1.54-.17-3.12-.68-4.24-1.79-1.12-1.08-1.67-2.64-1.75-4.17-1.3.01-2.6.01-3.91.02z" fill="#25f4ee" style={{mixBlendMode:'multiply'}}/></svg>
  ),
  Edit: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Save: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  X: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
};

const ProductCard = ({ p, onSelect }) => {
  const totalStok = p.variants?.reduce((acc, curr) => acc + (Number(curr.stok) || 0), 0) || 0;
  const labelType = p.source_table === 'secondhand' ? 'SECONDHAND' : 'PREMIUM JATI';
  const labelColor = p.source_table === 'secondhand'
  ? 'bg-blue-900/50 backdrop-blur-md text-[#00FFFF] border border-[#00FFFF]/30 rounded-sm px-2 shadow-xl' 
  : 'bg-black/40 backdrop-blur-md text-[#FFD700] border border-[#FFD700]/50 rounded-sm px-2 shadow-xl';

    const ribbonUrl = "https://knwgotcdbfxgdmumblqq.supabase.co/storage/v1/object/public/asset/offerribbon.png";

  return (
    <div onClick={() => onSelect(p)} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100 relative">
      {p.is_offer && (
        <div className="absolute top-0 right-0 z-20 w-24 h-24 pointer-events-none">
          <img 
            src={ribbonUrl} 
            alt="Offer" 
            className="w-full h-full object-contain absolute top-[-5px] right-[-5px]" 
          />
        </div>
      )}

    <div className="relative aspect-[4/5] overflow-hidden">
        <img src={p.thumb} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
        <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
          
          {/* 1. Label Kategori (Atas) */}
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-600 shadow-sm border border-white/20">
            {p.cat}
          </span>

          {/* 2. Label Jenis (Bawah - Secondhand/Premium) */}
          <span className={`px-2 py-1 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border border-white/20 ${labelColor}`}>
            {labelType}
          </span>

        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{p.name}</h3>
        <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${totalStok > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{totalStok > 0 ? `Stok: ${totalStok} Unit` : 'Stok Habis'}</p>
        
        {p.note && (
          <div className="flex items-start gap-1 mb-4">
            <span className="text-blue-500 text-[12px]">*</span>
            <p className="text-[12px] text-red-400 italic leading-tight line-clamp-2">
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

const AdminDashboard = ({ perabotData, refreshData, onBack }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [visualVariants, setVisualVariants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedIds, setSelectedIds] = useState([]); 

  const emptyProduct = {
    name: '',
    cat: 'Sofa',
    price: '',
    thumb: '',
    note: '',
    is_visible: true,
    is_offer: false,
    source_table: 'perabot',
    variants: [] 
  };

  const filteredProducts = perabotData.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleVisibility = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('perabot')
        .update({ is_visible: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      refreshData();
    } catch (err) {
      alert("Gagal tukar status: " + err.message);
    }
  };

  const moveImage = async (fullUrl, oldCat, oldName, newCat, newName) => {
    try {
      if (!fullUrl) return null;
      const urlParts = fullUrl.split('/gambar%20jati/');
      if (urlParts.length < 2) return fullUrl;

      const relativePath = decodeURIComponent(urlParts[1]);
      const fileName = relativePath.split('/').pop();

      const oldPath = `${oldCat}/${oldName}/${fileName}`;
      const newPath = `${newCat}/${newName}/${fileName}`;

      if (oldPath === newPath) return fullUrl;

      const { error } = await supabase.storage
        .from('gambar jati')
        .move(oldPath, newPath);

      if (error) {
        console.warn("Gagal pindah fail:", error.message);
        return fullUrl;
      }

      const { data } = supabase.storage
        .from('gambar jati')
        .getPublicUrl(newPath);

      return data.publicUrl;
    } catch (err) {
      console.error(err);
      return fullUrl;
    }
  };


const handleFileUpload = async (file, type, variantIndex = null) => {
    if (!file) return;

    const targetBucket = editForm.source_table === 'secondhand' ? 'secondhand_storage' : 'gambar jati';

    setUploading(true);
    try {
      const cleanCat = (editForm.cat || 'Uncategorized').trim();
      const cleanName = (editForm.name || 'Unnamed').trim();
      const fileExt = file.name.split('.').pop();
      
      let fileName = '';
      let filePath = '';

      if (type === 'thumb') {
        fileName = `Thumbnail_${Date.now()}.${fileExt}`;
        filePath = `${cleanCat}/${cleanName}/${fileName}`;
      } else if (type === 'variant') {
        const colorName = visualVariants[variantIndex]?.color 
          ? visualVariants[variantIndex].color.trim() 
          : `Variant_${Date.now()}`;
        
        fileName = `${colorName}.${fileExt}`;
        filePath = `${cleanCat}/${cleanName}/${fileName}`;
      }

      const { error: uploadError } = await supabase.storage
        .from(targetBucket) 
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(targetBucket)
        .getPublicUrl(filePath);

      if (type === 'thumb') {
        setEditForm(prev => ({ ...prev, thumb: publicUrl }));
      } else if (type === 'variant') {
        const newVariants = [...visualVariants];
        newVariants[variantIndex].img = publicUrl;
        setVisualVariants(newVariants);
      }

    } catch (error) {
      alert("Gagal upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setEditForm(emptyProduct);
    setVisualVariants([{ color: "Warna Standard", price: 0, stok: 10, img: "" }]);
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
    try {
      const parsed = typeof product.variants === 'string' ? JSON.parse(product.variants) : product.variants;
      setVisualVariants(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setVisualVariants([]);
    }
    setIsModalOpen(true);
  };

  const addVariant = () => {
    setVisualVariants([...visualVariants, { color: "", price: 0, stok: 0, img: "" }]);
  };

  const removeVariant = (index) => {
    const newVars = visualVariants.filter((_, i) => i !== index);
    setVisualVariants(newVars);
  };

  const updateVariant = (index, field, value) => {
    const newVars = [...visualVariants];
    newVars[index][field] = value;
    setVisualVariants(newVars);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Adakah anda pasti mahu memadam produk ini?")) return;
    try {
      const { error } = await supabase.from('perabot').delete().eq('id', id);
      if (error) throw error;
      alert("Produk berjaya dipadam.");
      refreshData();
    } catch (err) {
      alert("Gagal memadam: " + err.message);
    }
  };

const handleSave = async () => {
    try {
      const targetTable = editForm.source_table === 'secondhand' ? 'secondhand' : 'perabot';
      
      let finalThumb = editForm.thumb;
      let finalVariants = [...visualVariants];
      if (editingId) {
        const originalData = perabotData.find(p => p.id === editingId && p.source_table === editForm.source_table);
        
        if (originalData && (originalData.cat !== editForm.cat || originalData.name !== editForm.name)) {
            
            const confirmMove = window.confirm("Anda telah menukar Nama atau Kategori. Adakah anda mahu memindahkan fail gambar ke folder baru yang sepadan?");
            
            if (confirmMove) {
                setUploading(true);
                
                if (editForm.thumb) {
                   finalThumb = await moveImage(editForm.thumb, originalData.cat, originalData.name, editForm.cat, editForm.name);
                }

                for (let i = 0; i < finalVariants.length; i++) {
                    if (finalVariants[i].img) {
                        finalVariants[i].img = await moveImage(finalVariants[i].img, originalData.cat, originalData.name, editForm.cat, editForm.name);
                    }
                }
                setUploading(false);
            }
        }
      }

      finalVariants = finalVariants.map(v => ({
        ...v,
        price: Number(v.price),
        stok: Number(v.stok)
      }));

      const finalData = {
        name: editForm.name,
        cat: editForm.cat,
        price: Number(editForm.price),
        thumb: finalThumb,
        note: editForm.note,
        is_visible: editForm.is_visible,
        is_offer: editForm.is_offer,
        variants: finalVariants
      };

      if (editingId) {
        const { error } = await supabase.from(targetTable).update(finalData).eq('id', editingId);
        if (error) throw error;
        alert('Data berjaya dikemas kini!');
      } else {
        const { error } = await supabase.from(targetTable).insert([finalData]);
        if (error) throw error;
        alert(`Produk berjaya ditambah ke ${targetTable === 'secondhand' ? 'Secondhand' : 'Premium Jati'}!`);
      }

      setIsModalOpen(false);
      refreshData();
    } catch (err) {
      setUploading(false);
      alert('Ralat semasa menyimpan: ' + err.message);
    }
  };
  const toggleSelect = (uniqueId) => {
    if (selectedIds.includes(uniqueId)) {
      setSelectedIds(selectedIds.filter(id => id !== uniqueId));
    } else {
      setSelectedIds([...selectedIds, uniqueId]);
    }
  };

  const handleBulkVisibility = async (status) => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Ubah status ${selectedIds.length} item kepada ${status ? 'Show' : 'Hide'}?`)) return;

    const itemsToUpdate = perabotData.filter(p => selectedIds.includes(p.id + p.source_table));
    const jatiIds = itemsToUpdate.filter(p => p.source_table === 'perabot').map(p => p.id);
    const secIds = itemsToUpdate.filter(p => p.source_table === 'secondhand').map(p => p.id);

    try {
      if (jatiIds.length > 0) await supabase.from('perabot').update({ is_visible: status }).in('id', jatiIds);
      if (secIds.length > 0) await supabase.from('secondhand').update({ is_visible: status }).in('id', secIds);
      
      setSelectedIds([]);
      refreshData();
      alert("Status berjaya dikemaskini!");
    } catch (e) {
      alert("Ralat bulk update");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Admin Dashboard</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Urus Katalog & Stok</p>
          </div>
          <div className="flex gap-2">
            <button onClick={openAdd} className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-lg flex items-center gap-2">
              <Icons.Plus /> Tambah Produk
            </button>
            <button onClick={onBack} className="px-5 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-700">
              Keluar
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Icons.Search size={18} />
            </span>
            <input 
              type="text"
              placeholder="Cari nama perabot atau kategori..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>


        {selectedIds.length > 0 && (
        <div className="bg-blue-600 text-white p-3 rounded-xl mb-4 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
            <span className="text-xs font-bold uppercase tracking-widest">{selectedIds.length} Produk Dipilih</span>
            <div className="flex gap-2">
                <button onClick={() => handleBulkVisibility(true)} className="px-3 py-1 bg-white text-blue-600 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-50">Show All</button>
                <button onClick={() => handleBulkVisibility(false)} className="px-3 py-1 bg-blue-800 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-blue-900">Hide All</button>
            </div>
        </div>
      )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-100 text-xs uppercase font-bold text-gray-500">
                <tr>
                  <th className="p-4 w-10">Pilih</th>
                  <th className="p-4">Produk</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga (RM)</th>
                  <th className="p-4 text-center">Stok</th>
                  <th className="p-4 text-center">Paparan</th>
                  <th className="p-4 text-center">Tindakan</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(p => {
                  const totalStok = p.variants?.reduce((acc, curr) => acc + (Number(curr.stok) || 0), 0) || 0;
                  const isVisible = p.is_visible !== false; 
                  const uniqueId = p.id + p.source_table;
                  const isSelected = selectedIds.includes(uniqueId);

                  return (
                    <tr key={uniqueId} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                        <td className="p-4">
                            <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => toggleSelect(uniqueId)}
                                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                            />
                        </td>                      
                        <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          {p.thumb ? <img src={p.thumb} className="w-full h-full object-cover" alt="" /> : <div className="text-[8px]">No IMG</div>}
                        </div>
                        <div>
                            {p.name}
                            <div className="flex gap-1 mt-1">
                                <span className={`text-[8px] px-1 rounded border ${p.source_table === 'secondhand' ? 'border-purple-200 text-purple-600 bg-purple-50' : 'border-amber-200 text-amber-600 bg-amber-50'}`}>
                                    {p.source_table === 'secondhand' ? '2ND' : 'JATI'}
                                </span>
                                {p.is_offer && <span className="text-[8px] px-1 rounded bg-red-100 text-red-600 font-bold border border-red-200">OFFER</span>}
                            </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase">{p.cat}</span>
                      </td>
                      <td className="p-4 font-mono">{Number(p.price).toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                          totalStok === 0 
                            ? 'bg-red-100 text-red-700'      
                            : totalStok < 3 
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'}`}>
                          {totalStok} Unit
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => toggleVisibility(p.id, isVisible)}
                            className={`relative w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${isVisible ? 'bg-emerald-500' : 'bg-red-500'}`}
                          >
                            <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-md transition-all duration-300 ${isVisible ? 'left-7' : 'left-1'}`}></div>
                          </button>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-tighter mt-1 block">
                          {isVisible ? 'Show' : 'Hide'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(p)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                            <Icons.Edit />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                            <Icons.Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black uppercase tracking-widest">{editingId ? "Edit Produk" : "Tambah Produk Baru"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><Icons.X /></button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <label className="block text-xs font-bold uppercase text-blue-600 mb-2">Jenis Produk (Table & Storage)</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="type" 
                                    checked={editForm.source_table === 'perabot'}
                                    onChange={() => setEditForm({...editForm, source_table: 'perabot'})}
                                    disabled={editingId}
                                    className="accent-blue-600"
                                />
                                <span className="text-sm font-bold text-gray-700">Premium Jati</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="type" 
                                    checked={editForm.source_table === 'secondhand'}
                                    onChange={() => setEditForm({...editForm, source_table: 'secondhand'})}
                                    disabled={editingId}
                                    className="accent-purple-600"
                                />
                                <span className="text-sm font-bold text-gray-700">Secondhand</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <span className="text-xs font-bold uppercase text-gray-500">Status Offer (Ribbon Merah)</span>
                        <button 
                            onClick={() => setEditForm({...editForm, is_offer: !editForm.is_offer})}
                            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${editForm.is_offer ? 'bg-red-500' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-md transition-all duration-300 ${editForm.is_offer ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>

                   <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Kategori</label>
                    <select 
                      value={editForm.cat} 
                      onChange={e => setEditForm({...editForm, cat: e.target.value})}
                      className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold outline-none"
                    >
                      <option value="Sofa">Sofa</option>
                      <option value="Meja Makan">Meja Makan</option>
                      <option value="Katil">Katil</option>
                      <option value="Laci Tepi">Laci Tepi</option>
                      <option value="Bidai">Bidai</option>
                      <option value="Buaian">Buaian</option>
                      <option value="Kerusi">Kerusi</option>
                      <option value="Cermin">Cermin</option>
                      <option value="Tingkap">Tingkap</option>
                      <option value="Almari">Almari</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nama Produk</label>
                    <input 
                      value={editForm.name} 
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold outline-none"
                      placeholder="Contoh: Pankin"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Harga Bermula dari (RM)</label>
                    <input 
                      type="number"
                      value={editForm.price} 
                      onChange={e => setEditForm({...editForm, price: e.target.value})}
                      className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold outline-none"
                    />
                  </div>

                   <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nota / Amaran</label>
                    <input 
                      value={editForm.note || ''} 
                      onChange={e => setEditForm({...editForm, note: e.target.value})}
                      className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-sm text-red-500 outline-none"
                      placeholder="Contoh: Pre-order sahaja"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-3">Gambar Utama (Thumbnail)</label>
                  
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-40 bg-gray-200 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                       {editForm.thumb ? (
                         <img src={editForm.thumb} className="w-full h-full object-cover" alt="Preview" />
                       ) : (
                         <span className="text-gray-400 text-[10px] text-center px-2">Tiada Gambar</span>
                       )}
                    </div>
                    
                    <div className="w-full">
                      <label className={`block w-full text-center py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${uploading ? 'bg-gray-100 border-gray-300' : 'border-blue-300 bg-blue-50 hover:bg-blue-100'}`}>
                        <span className="text-xs font-bold text-blue-600">{uploading ? "Sedang Upload..." : "Pilih Gambar Thumbnail"}</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) => handleFileUpload(e.target.files[0], 'thumb')}
                        />
                      </label>
                      <p className="text-[9px] text-gray-400 mt-2 text-center">Auto-save ke: {editForm.cat}/{editForm.name}/...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              <div>
                <div className="flex justify-between items-center mb-4">
                   <label className="block text-xs font-bold uppercase text-gray-400">Senarai Varians & Stok</label>
                   <button onClick={addVariant} className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold uppercase hover:bg-green-100 transition-colors">
                     + Tambah Warna
                   </button>
                </div>

                <div className="space-y-3">
                  {visualVariants.map((v, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                      
                      <div className="shrink-0 flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden relative">
                           {v.img ? <img src={v.img} className="w-full h-full object-cover" alt="" /> : <span className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-300">No Img</span>}
                        </div>
                        <label className="cursor-pointer bg-white px-3 py-1 rounded-md border border-gray-200 text-[9px] font-bold text-gray-600 hover:bg-gray-100 shadow-sm transition-colors">
                          {uploading ? "..." : "Upload"}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            disabled={uploading}
                            onChange={(e) => handleFileUpload(e.target.files[0], 'variant', idx)}
                          />
                        </label>
                      </div>

                      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
                        <div>
                          <label className="text-[9px] font-bold uppercase text-gray-400">Nama Warna</label>
                          <input 
                            value={v.color} 
                            onChange={e => updateVariant(idx, 'color', e.target.value)}
                            className="w-full p-2 bg-white rounded-lg border border-gray-200 text-xs font-bold outline-none"
                            placeholder="Contoh: Dark Walnut"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold uppercase text-gray-400">Harga (RM)</label>
                          <input 
                            type="number"
                            value={v.price} 
                            onChange={e => updateVariant(idx, 'price', e.target.value)}
                            className="w-full p-2 bg-white rounded-lg border border-gray-200 text-xs font-mono outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold uppercase text-gray-400">Stok</label>
                          <input 
                            type="number"
                            value={v.stok} 
                            onChange={e => updateVariant(idx, 'stok', e.target.value)}
                            className="w-full p-2 bg-white rounded-lg border border-gray-200 text-xs font-mono outline-none"
                          />
                        </div>
                      </div>

                      <button onClick={() => removeVariant(idx)} className="p-2 text-red-400 hover:text-red-600 self-center transition-colors">
                        <Icons.X />
                      </button>
                    </div>
                  ))}
                  
                  {visualVariants.length === 0 && (
                    <p className="text-center text-xs text-gray-400 italic py-4">Tiada varians. Sila tambah sekurang-kurangnya satu.</p>
                  )}
                </div>
              </div>

              <button 
                onClick={handleSave} 
                disabled={uploading}
                className={`w-full py-4 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg mt-4 flex items-center justify-center gap-2 transition-all
                  ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
              >
                <Icons.Save /> {uploading ? "Tunggu..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
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
  const [adminTapCount, setAdminTapCount] = useState(0);


  const ambilData = async () => {
    setLoading(true);
    
    const { data: jatiData, error: errJati } = await supabase
      .from('perabot')
      .select('*'); 
      
    const { data: secData, error: errSec } = await supabase
      .from('secondhand')
      .select('*');

    if (errJati || errSec) console.error("Error tarik data", errJati, errSec);


    const formattedJati = (jatiData || []).map(item => ({ ...item, source_table: 'perabot' }));
    const formattedSec = (secData || []).map(item => ({ ...item, source_table: 'secondhand' }));


    let combinedData = [...formattedJati, ...formattedSec];

    for (let i = combinedData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedData[i], combinedData[j]] = [combinedData[j], combinedData[i]];
    }

    setPerabotData(combinedData);
    setLoading(false);
  };

  const refreshDataSenyap = async () => {
    const p1 = supabase.from('perabot').select('*');
    const p2 = supabase.from('secondhand').select('*');
    const [res1, res2] = await Promise.all([p1, p2]);
     
    const d1 = (res1.data || []).map(i => ({...i, source_table: 'perabot'}));
    const d2 = (res2.data || []).map(i => ({...i, source_table: 'secondhand'}));
    
    let combinedData = [...d1, ...d2];

    for (let i = combinedData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedData[i], combinedData[j]] = [combinedData[j], combinedData[i]];
    }

    setPerabotData(combinedData);
  }

  useEffect(() => {
    ambilData();

    const subPerabot = supabase
      .channel('perabot_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'perabot' }, () => {
        refreshDataSenyap(); 
      })
      .subscribe();

    const subSecondhand = supabase
      .channel('secondhand_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'secondhand' }, () => {
        refreshDataSenyap(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subPerabot);
      supabase.removeChannel(subSecondhand);
    };
  }, []);

  useEffect(() => {
    const controlCatBar = () => {
      const currentScrollY = window.scrollY;
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

  const handleSecretTap = () => {
    setAdminTapCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) { 
        const pwd = prompt("🔐 ADMIN ACCESS: Masukkan Kod Keselamatan");
        if (pwd === "011368") {
          setCurrentScreen('admin');
          setAdminTapCount(0);
        } else {
          alert("Akses Ditolak.");
          setAdminTapCount(0);
        }
        return 0;
      }
      return newCount;
    });
  };

const handleTempahan = async (variant, index) => {
    const waUrl = `https://wa.me/60143106207?text=${encodeURIComponent(`Saya berminat dengan ${selectedProduct.name} (Warna: ${variant.color})`)}`;

    window.open(waUrl, '_blank');

    if (selectedProduct.source_table === 'secondhand') {
      const currentStok = Number(variant.stok);

      if (currentStok > 0) {
        const updatedVariants = [...selectedProduct.variants];
        updatedVariants[index].stok = currentStok - 1;
        
        setSelectedProduct(prev => ({
          ...prev,
          variants: updatedVariants
        }));

        try {
          const { error } = await supabase
            .from('secondhand')
            .update({ variants: updatedVariants })
            .eq('id', selectedProduct.id);
            
          if (error) console.error("Gagal tolak stok DB:", error);
          
          refreshDataSenyap(); 
        } catch (err) {
          console.error("Error update stok:", err);
        }
      }
    }
  };

  const categoryList = [
    { id: 'Semua', label: 'Semua', icon: <Icons.All /> },
    { id: 'Secondhand', label: 'Secondhand', icon: <Icons.Edit /> },
    { id: 'Hiasan', label: 'Hiasan', icon: <Icons.Cermin /> },
    { id: 'Sofa', label: 'Sofa', icon: <Icons.Sofa /> },
    { id: 'Meja Makan', label: 'Meja Makan', icon: <Icons.Mejamakan /> },
    { id: 'Katil', label: 'Katil', icon: <Icons.Bed /> },
    { id: 'Laci Tepi', label: 'Laci', icon: <Icons.Lacitepi /> },
    { id: 'Bidai', label: 'Bidai', icon: <Icons.Bidai /> },
    { id: 'Buaian', label: 'Buaian', icon: <Icons.Buaian /> },
    { id: 'Kerusi', label: 'Kerusi', icon: <Icons.Kerusi /> },
    { id: 'Cermin', label: 'Cermin', icon: <Icons.Cermin /> },
    { id: 'Tingkap', label: 'Tingkap', icon: <Icons.Tingkap /> },
    { id: 'Almari', label: 'Almari', icon: <Icons.Almari /> },
  ];

  const filteredData = perabotData.filter(p => {
    const isVisible = p.is_visible !== false; 
    const matchFilter = filter === 'Semua' || p.cat === filter;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return isVisible && matchFilter && matchSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Memuatkan Katalog...</p>
      </div>
    </div>
  );

  if (currentScreen === 'admin') {
    return <AdminDashboard perabotData={perabotData} refreshData={ambilData} onBack={() => setCurrentScreen('home')} />;
  }

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans text-gray-900 relative">
      {currentScreen === 'home' ? ( 
        <>
          <header className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center px-6 overflow-hidden bg-slate-900">
            <div className="absolute inset-0 overflow-hidden">
               <img src="https://knwgotcdbfxgdmumblqq.supabase.co/storage/v1/object/public/asset/maintumbnail.png" className="w-full h-full object-cover opacity-60 scale-105" alt="Hero" style={{animationDuration: '30s'}} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#fafafa]"></div>
            
            <div className="relative z-10 max-w-5xl flex flex-col items-center">
              <div 
  onClick={handleSecretTap}
  className="inline-flex items-center gap-3 px-6 py-2 border border-yellow-600/40 rounded-full bg-black/40 backdrop-blur-md mb-8 cursor-pointer select-none active:scale-95 transition-transform"
  title="Akses Eksklusif"
>
  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
  <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.3em]">
    Koleksi Eksklusif 2026
  </span>
</div>
              
              <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 tracking-tight leading-[1.1]">
                Perabot <span className="italic text-yellow-500 font-serif"> Premium</span>
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

          <div className="sticky top-0 z-50 -mt-8 px-4">
            <div className="max-w-3xl mx-auto space-y-2">
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

              <div className={`transition-all duration-500 ease-in-out origin-top ${showCatBar ? 'opacity-100 scale-100 h-auto' : 'opacity-0 scale-95 pointer-events-none h-0 overflow-hidden'}`}>
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-1 shadow-md border border-gray-100">
                  <div className="grid grid-cols-5 md:grid-cols-11 gap-1">
                    {categoryList.map(cat => (
                      <button key={cat.id} onClick={() => setFilter(cat.id)} className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all ${filter === cat.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <div className={`scale-75 ${filter === cat.id ? 'text-white' : 'text-gray-400'}`}>{cat.icon}</div>
                        <span className="text-[8px] font-bold uppercase tracking-tighter leading-none text-center">{cat.label}</span>
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
                <ProductCard key={`${p.source_table}-${p.id}`} 
                    p={p} 
                    onSelect={(prod) => { setSelectedProduct(prod); setCurrentScreen('gallery'); window.scrollTo(0,0); }} 
                />
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
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {selectedProduct.variants?.map((v, i) => (
                <div key={i} className="group animate-in fade-in slide-in-from-bottom-10 duration-700">
                  <div className="relative rounded-[2rem] overflow-hidden shadow-xl bg-gray-50 mb-6 border border-gray-100 aspect-square">
                    <img 
                      src={v.img} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      alt={v.color} 
                    />
                  </div>

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

                  <button 
                    onClick={() => handleTempahan(v, i)}
                    disabled={Number(v.stok) <= 0} 
                    className={`w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-[10px] tracking-[0.15em] shadow-xl transition-all active:scale-95
                    ${Number(v.stok) > 0 
                        ? 'bg-[#22c55e] hover:bg-[#16a34a] text-white cursor-pointer' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                    <Icons.MessageCircle /> 
                    {Number(v.stok) > 0 ? "TEMPAH SEKARANG" : "PRE-ORDER"}
                </button>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentScreen === 'home' && (
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
          <a href="https://wa.me/601156588884" target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-sm hover:text-green-400 transition-all">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-green-500/20"><Icons.WhatsApp /></div>
            <span>Amka (Sales)</span>
          </a>
          <a href="https://wa.me/601136829632" target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-sm hover:text-green-400 transition-all">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-green-500/20"><Icons.WhatsApp /></div>
            <span>Pie (Sales)</span>
          </a>
          <a href="https://wa.me/60123456789" target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-sm hover:text-green-400 transition-all">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-green-500/20"><Icons.WhatsApp /></div>
            <span>Pejabat / Office</span>
          </a>
        </div>
      </div>
      <div className="space-y-5">
        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 border-l-2 border-blue-500 pl-3">Media Sosial</h4>
        <div className="flex flex-col gap-4">
          <a href="https://tiktok.com/@premiumjati" target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-sm hover:text-pink-500 transition-all">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-pink-500/20"><Icons.TikTok /></div>
            <span>TikTok @premiumjati</span>
          </a>
          <a href="https://facebook.com/SSMajuLegacy" target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-sm hover:text-blue-500 transition-all">
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
      )}
    </div>
  );
};

export default App;