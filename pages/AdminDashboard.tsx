import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Product } from '../types';
import { Icon } from '../components/Icon';

const AdminDashboard: React.FC = () => {
    const { user, role, loading: authLoading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'products' | 'orders'>('products');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBulkAdding, setIsBulkAdding] = useState(false);

    interface BulkItem {
        id: string;
        file: File;
        preview: string;
        name: string;
        description: string;
        price: string;
        collectionId: string;
        status: 'pending' | 'uploading' | 'saving' | 'success' | 'error';
        error?: string;
    }
    const [bulkItems, setBulkItems] = useState<BulkItem[]>([]);

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [collectionId, setCollectionId] = useState('parejas');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const collections = [
        { id: 'parejas', name: 'Parejas' },
        { id: 'deporte', name: 'Deporte' },
        { id: 'graduacion', name: 'Graduación' },
        { id: 'amistad', name: 'Amistad' },
        { id: 'mascotas', name: 'Mascotas' },
        { id: 'musica', name: 'Música' },
        { id: 'amuletos', name: 'Amuletos' },
        { id: 'nacimientos', name: 'Nacimientos' },
        { id: 'minimalista', name: 'Minimalista' }
    ];

    useEffect(() => {
        if (!authLoading && role === 'admin') {
            if (view === 'products') fetchProducts();
            if (view === 'orders') fetchOrders();
        }
    }, [authLoading, role, view]);

    const fetchProducts = async () => {
        setLoading(true);
        console.log('[Admin] Cargando productos...');
        try {
            const fetchPromise = supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Tiempo de espera agotado al cargar productos')), 10000)
            );

            const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

            if (error) throw error;
            setProducts(data || []);
            console.log('[Admin] Productos cargados:', data?.length);
        } catch (error: any) {
            console.error('Error fetching products:', error);
            setError('No se pudieron cargar los productos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        console.log('[Admin] Cargando pedidos...');
        try {
            const fetchPromise = supabase
                .from('orders')
                .select(`
                    *,
                    order_items (*)
                `)
                .order('created_at', { ascending: false });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Tiempo de espera agotado al cargar pedidos')), 10000)
            );

            const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

            if (error) throw error;
            setOrders(data || []);
            console.log('[Admin] Pedidos cargados:', data?.length);
        } catch (error: any) {
            console.error('Error fetching orders:', error);
            setError('No se pudieron cargar los pedidos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) {
            alert('Error al actualizar estado: ' + error.message);
        } else {
            fetchOrders();
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        console.log('[Admin] Iniciando proceso de guardado...');

        try {
            let finalImageUrl = imageUrl;

            // Upload image if a file is selected
            if (imageFile) {
                console.log('[Admin] Subiendo imagen:', imageFile.name);
                setUploading(true);
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                // Set a 15-second timeout for image upload
                const uploadPromise = supabase.storage
                    .from('products')
                    .upload(filePath, imageFile);

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Tiempo de espera agotado al subir la imagen')), 15000)
                );

                const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]) as any;

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                finalImageUrl = publicUrl;
                console.log('[Admin] Imagen subida con éxito:', finalImageUrl);
                setUploading(false);
            }

            const cleanPrice = parseFloat(price);
            if (isNaN(cleanPrice)) {
                throw new Error('El precio debe ser un número válido');
            }

            const productData = {
                name: name.trim(),
                description: description.trim() || null,
                price: cleanPrice,
                collection_id: collectionId,
                image_url: finalImageUrl || 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=60'
            };

            console.log('[Admin] Payload final a enviar:', JSON.stringify(productData, null, 2));
            console.log('[Admin] Enviando datos a Supabase...');

            const dbOperation = editingId
                ? supabase.from('products').update(productData).eq('id', editingId)
                : supabase.from('products').insert([productData]);

            // Set a 10-second timeout for DB operation
            const dbTimeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Tiempo de espera agotado al conectar con la base de datos')), 10000)
            );

            const { error: dbError } = await Promise.race([dbOperation, dbTimeout]) as any;

            if (dbError) throw dbError;

            console.log(editingId ? '[Admin] Actualización exitosa' : '[Admin] Creación exitosa');
            alert(editingId ? 'Producto actualizado con éxito' : 'Producto agregado con éxito');

            setIsAdding(false);
            resetForm();
            await fetchProducts();
            console.log('[Admin] Catálogo refrescado');
        } catch (err: any) {
            console.error('[Admin] Error crítico en handleAddProduct:', err);
            setError('Error al guardar el producto: ' + (err.message || 'Error desconocido'));
            alert('Error: ' + (err.message || 'No se pudo guardar el producto por un fallo en la red o permisos'));
        } finally {
            setIsSubmitting(false);
            setUploading(false);
            console.log('[Admin] Proceso finalizado');
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setCollectionId('parejas');
        setImageUrl('');
        setImageFile(null);
        setImagePreview(null);
        setEditingId(null);
    };

    const handleEdit = (product: Product) => {
        setName(product.name);
        setDescription(product.description || '');
        setPrice(product.price.toString());
        setCollectionId(product.collection_id);
        setImageUrl(product.image_url || '');
        setImagePreview(product.image_url || null);
        setEditingId(product.id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []) as File[];
        if (files.length === 0) return;

        const newItems: BulkItem[] = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file), // Use object URL for efficiency
            name: file.name.split('.')[0].replace(/[-_]/g, ' '),
            description: '',
            price: '',
            collectionId: 'parejas',
            status: 'pending'
        }));

        setBulkItems(prev => [...prev, ...newItems]);
    };

    const updateBulkItem = (id: string, updates: Partial<BulkItem>) => {
        setBulkItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const removeBulkItem = (id: string) => {
        setBulkItems(prev => prev.filter(item => item.id !== id));
    };

    const handleBulkUpload = async () => {
        if (bulkItems.length === 0) return;
        setIsSubmitting(true);
        setError(null);
        console.log('[Bulk] Iniciando carga masiva de', bulkItems.length, 'productos');

        try {
            const finalProducts = [];

            for (const item of bulkItems) {
                if (item.status === 'success') continue; // Skip already success items

                updateBulkItem(item.id, { status: 'uploading' });

                try {
                    // 1. Upload Image
                    const fileExt = item.file.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;
                    const filePath = `bulk/${fileName}`;

                    console.log(`[Bulk] Subiendo imagen para: ${item.name}`);
                    const { error: uploadError } = await supabase.storage
                        .from('products')
                        .upload(filePath, item.file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('products')
                        .getPublicUrl(filePath);

                    // 2. Prepare Data
                    const cleanPrice = parseFloat(item.price);
                    if (isNaN(cleanPrice)) throw new Error('Precio inválido');

                    finalProducts.push({
                        name: item.name.trim(),
                        description: item.description.trim() || null,
                        price: cleanPrice,
                        collection_id: item.collectionId,
                        image_url: publicUrl
                    });

                    updateBulkItem(item.id, { status: 'success' });
                } catch (err: any) {
                    console.error(`[Bulk] Error en item ${item.name}:`, err);
                    updateBulkItem(item.id, { status: 'error', error: err.message });
                }
            }

            // 3. Batch Insert to DB
            if (finalProducts.length > 0) {
                console.log(`[Bulk] Insertando ${finalProducts.length} registros en DB...`);
                const { error: insertError } = await supabase
                    .from('products')
                    .insert(finalProducts);

                if (insertError) throw insertError;
            }

            alert(`Proceso completado. ${finalProducts.length} productos agregados.`);

            // If all were success, close bulk and refresh
            const hasErrors = bulkItems.some(item => item.status === 'error');
            if (!hasErrors) {
                setIsBulkAdding(false);
                setBulkItems([]);
                fetchProducts();
            } else {
                // Remove successful items to only show errors
                setBulkItems(prev => prev.filter(item => item.status !== 'success'));
            }

        } catch (err: any) {
            console.error('[Bulk] Error crítico:', err);
            setError('Error en la carga masiva: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImageUrl(''); // Clear URL if file is selected
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('¿Estás segura de que quieres eliminar este producto?')) return;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error al eliminar: ' + error.message);
        } else {
            fetchProducts();
        }
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

    if (role !== 'admin') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <Icon name="lock" className="text-6xl text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Acceso Restringido</h1>
                <p>Lo siento, necesitas ser administradora para ver esta página.</p>
                <a href="/" className="mt-4 text-primary hover:underline font-bold">Volver al inicio</a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-background-dark">
            <Header />

            <main className="max-w-[1400px] mx-auto pt-32 pb-20 px-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                    <div>
                        <h1 className="text-5xl font-display-serif italic mb-2 tracking-tighter">Panel de Gestión</h1>
                        <p className="text-stone-500 font-light">Control total de tu inventario y ventas</p>
                    </div>

                    <div className="flex flex-wrap gap-4 bg-white dark:bg-stone-900 p-2 rounded-2xl shadow-sm border border-stone-100 dark:border-white/5">
                        <button
                            onClick={() => setView('products')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'products' ? 'bg-primary text-white shadow-lg' : 'text-stone-400 hover:text-primary'
                                }`}
                        >
                            Catálogo
                        </button>
                        <button
                            onClick={() => setView('orders')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'orders' ? 'bg-primary text-white shadow-lg' : 'text-stone-400 hover:text-primary'
                                }`}
                        >
                            Pedidos
                        </button>
                    </div>

                    {view === 'products' && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setIsBulkAdding(!isBulkAdding);
                                    if (isAdding) setIsAdding(false);
                                    resetForm();
                                }}
                                className={`px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 ${isBulkAdding ? 'bg-stone-200 text-stone-600' : 'bg-stone-900 text-white shadow-xl hover:scale-105'
                                    }`}
                            >
                                <Icon name={isBulkAdding ? "close" : "auto_awesome_motion"} />
                                {isBulkAdding ? 'Cerrar Masiva' : 'Carga Masiva'}
                            </button>
                            <button
                                onClick={() => {
                                    if (isAdding) {
                                        setIsAdding(false);
                                        resetForm();
                                    } else {
                                        setIsAdding(true);
                                        if (isBulkAdding) setIsBulkAdding(false);
                                    }
                                }}
                                className={`px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 ${isAdding ? 'bg-stone-200 text-stone-600' : 'bg-primary text-white shadow-xl hover:scale-105'
                                    }`}
                            >
                                <Icon name={isAdding ? "close" : "add"} />
                                {isAdding ? 'Cancelar' : 'Nuevo Producto'}
                            </button>
                        </div>
                    )}
                </div>

                {view === 'products' ? (
                    <>
                        {isBulkAdding && (
                            <section className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-10 mb-16 shadow-2xl border border-stone-100 dark:border-white/5 animate-fade-in">
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-3xl font-display-serif italic">Carga Masiva de Productos</h2>
                                    <label className="bg-primary text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] cursor-pointer hover:scale-105 transition-all shadow-lg">
                                        <Icon name="upload_file" className="inline mr-2" /> Seleccionar Fotos
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleBulkFileChange} />
                                    </label>
                                </div>

                                {bulkItems.length > 0 ? (
                                    <div className="space-y-6">
                                        <div className="max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                                            {bulkItems.map((item) => (
                                                <div key={item.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-[1.5rem] border ${item.status === 'error' ? 'border-red-500 bg-red-50/10' : 'border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-black/20'
                                                    } mb-4 transition-all`}>
                                                    <div className="lg:col-span-2 relative group">
                                                        <img src={item.preview} className="w-full aspect-square object-cover rounded-2xl shadow-md" />
                                                        <button
                                                            onClick={() => removeBulkItem(item.id)}
                                                            className="absolute -top-2 -right-2 size-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                                                        >
                                                            <Icon name="close" size="small" />
                                                        </button>
                                                        {item.status === 'uploading' && <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center rounded-2xl"><Icon name="sync" className="animate-spin" /></div>}
                                                        {item.status === 'success' && <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center rounded-2xl"><Icon name="check_circle" className="text-green-500 text-3xl" /></div>}
                                                    </div>

                                                    <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="md:col-span-2 space-y-4">
                                                            <input
                                                                placeholder="Nombre del accesorio"
                                                                value={item.name}
                                                                onChange={(e) => updateBulkItem(item.id, { name: e.target.value })}
                                                                className="w-full bg-white dark:bg-white/5 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-primary text-sm font-bold"
                                                            />
                                                            <textarea
                                                                placeholder="Descripción corta..."
                                                                value={item.description}
                                                                onChange={(e) => updateBulkItem(item.id, { description: e.target.value })}
                                                                className="w-full bg-white dark:bg-white/5 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-primary text-[10px] min-h-[60px]"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-4">
                                                            <input
                                                                type="number"
                                                                placeholder="Precio $"
                                                                value={item.price}
                                                                onChange={(e) => updateBulkItem(item.id, { price: e.target.value })}
                                                                className="w-full bg-white dark:bg-white/5 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-primary text-sm font-black"
                                                            />
                                                            <select
                                                                value={item.collectionId}
                                                                onChange={(e) => updateBulkItem(item.id, { collectionId: e.target.value })}
                                                                className="w-full bg-white dark:bg-white/5 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-primary text-[10px] font-black uppercase tracking-widest"
                                                            >
                                                                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                            </select>
                                                            {item.error && <p className="text-[9px] text-red-500 font-bold truncate">Error: {item.error}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-end gap-6 pt-6 border-t border-stone-100 dark:border-white/5">
                                            <div className="flex flex-col items-end">
                                                <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">Total a procesar</p>
                                                <p className="text-xl font-bold">{bulkItems.length} Productos</p>
                                            </div>
                                            <button
                                                onClick={handleBulkUpload}
                                                disabled={isSubmitting || bulkItems.length === 0}
                                                className="bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-dark transition-all disabled:opacity-50 shadow-2xl"
                                            >
                                                {isSubmitting ? 'Procesando Lote...' : 'Publicar Todo el Lote'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-20 border-2 border-dashed border-stone-200 dark:border-white/5 rounded-[2rem] flex flex-col items-center justify-center opacity-40">
                                        <Icon name="photo_library" className="text-5xl mb-4" />
                                        <p className="font-black uppercase tracking-[0.2em] text-[10px]">Arrastra tus fotos aquí o usa el botón</p>
                                    </div>
                                )}
                            </section>
                        )}

                        {isAdding && (
                            <section className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-10 mb-16 shadow-2xl border border-stone-100 dark:border-white/5 animate-fade-in">
                                <h2 className="text-3xl font-display-serif mb-10 italic">{editingId ? 'Editar Pieza' : 'Añadir Nueva Pieza'}</h2>
                                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">Nombre del Producto</label>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-stone-50 dark:bg-white/5 border-none rounded-2xl px-8 py-5 outline-none focus:ring-2 focus:ring-primary transition-all text-lg"
                                                placeholder="Ej: Pulsera de Hilo Rojo"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">Descripción (Opcional)</label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="w-full bg-stone-50 dark:bg-white/5 border-none rounded-2xl px-8 py-5 outline-none focus:ring-2 focus:ring-primary transition-all min-h-[160px] text-lg font-display-serif"
                                                placeholder="Detalles sobre el tejido o significado..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">Precio ($)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    className="w-full bg-stone-50 dark:bg-white/5 border-none rounded-2xl px-8 py-5 outline-none focus:ring-2 focus:ring-primary transition-all text-lg font-bold"
                                                    placeholder="15.00"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">Colección</label>
                                                <select
                                                    value={collectionId}
                                                    onChange={(e) => setCollectionId(e.target.value)}
                                                    className="w-full bg-stone-50 dark:bg-white/5 border-none rounded-2xl px-8 py-5 outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
                                                >
                                                    {collections.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">Foto del Accesorio</label>
                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                        id="image-upload"
                                                    />
                                                    <label
                                                        htmlFor="image-upload"
                                                        className="flex flex-col items-center justify-center w-full aspect-video bg-stone-50 dark:bg-white/10 border-2 border-dashed border-stone-200 dark:border-white/10 rounded-[2rem] cursor-pointer hover:border-primary transition-all overflow-hidden shadow-inner"
                                                    >
                                                        {imagePreview ? (
                                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                                <Icon name="add_a_photo" className="text-4xl" />
                                                                <div className="text-center">
                                                                    <span className="text-[11px] font-black uppercase tracking-widest block">Subir Imagen</span>
                                                                    <span className="text-[9px] opacity-60">Recomendado: 800x800px</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || uploading}
                                            className="w-full bg-primary text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-dark transition-all disabled:opacity-50 shadow-2xl shadow-primary/20"
                                        >
                                            {isSubmitting ? (uploading ? 'Subiendo Imagen...' : 'Guardando...') : (editingId ? 'Actualizar Producto' : 'Publicar Producto')}
                                        </button>
                                    </div>
                                </form>
                            </section>
                        )}

                        <section className="bg-white dark:bg-stone-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-stone-100 dark:border-white/5">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-stone-100 dark:border-white/5">
                                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Pieza</th>
                                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Colección</th>
                                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Precio</th>
                                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-right">Manejo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-50 dark:divide-white/5">
                                        {products.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-10 py-32 text-center text-stone-400 font-display-serif italic text-2xl">
                                                    Tu catálogo está esperando su primera pieza.
                                                </td>
                                            </tr>
                                        ) : (
                                            products.map((product) => (
                                                <tr key={product.id} className="hover:bg-stone-50 dark:hover:bg-white/5 transition-colors group">
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center gap-6">
                                                            <div className="size-20 rounded-2xl overflow-hidden bg-stone-100 shadow-sm">
                                                                <img src={product.image_url || ''} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-lg">{product.name}</p>
                                                                <p className="text-[10px] text-stone-400 font-mono">ID: {product.id.slice(0, 8)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        <span className="px-4 py-1.5 bg-stone-100 dark:bg-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">
                                                            {collections.find(c => c.id === product.collection_id)?.name || product.collection_id}
                                                        </span>
                                                    </td>
                                                    <td className="px-10 py-8 font-display-serif text-2xl font-bold">${product.price}</td>
                                                    <td className="px-10 py-8 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEdit(product)}
                                                                className="size-12 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center"
                                                                title="Editar"
                                                            >
                                                                <Icon name="edit" />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteProduct(product.id)}
                                                                className="size-12 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                                                title="Eliminar"
                                                            >
                                                                <Icon name="delete" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                ) : (
                    <section className="space-y-8 animate-fade-in">
                        {orders.length === 0 ? (
                            <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-32 text-center border border-stone-100 dark:border-white/5 shadow-xl">
                                <Icon name="shopping_basket" className="text-6xl text-stone-100 mb-8" />
                                <h3 className="text-3xl font-display-serif italic text-stone-300">No hay pedidos registrados</h3>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-10 shadow-xl border border-stone-100 dark:border-white/5 overflow-hidden">
                                    <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10 pb-10 border-b border-stone-50 dark:border-white/5">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Pedido ID</p>
                                                <p className="font-mono text-sm bg-stone-50 dark:bg-white/5 px-3 py-1 rounded-lg">#{order.id.toUpperCase()}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-10">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Fecha</p>
                                                    <p className="font-medium">{new Date(order.created_at).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Total</p>
                                                    <p className="text-2xl font-bold text-primary">${order.total_amount}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 min-w-[240px]">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Actualizar Estado</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => updateOrderStatus(order.id, status)}
                                                        className={`text-[9px] font-black uppercase tracking-widest py-2 rounded-lg transition-all ${order.status === status
                                                            ? 'bg-text-main text-white'
                                                            : 'bg-stone-50 dark:bg-white/5 text-stone-400 hover:bg-stone-200'
                                                            }`}
                                                    >
                                                        {status === 'pending' ? 'Pendiente' :
                                                            status === 'paid' ? 'Pagado' :
                                                                status === 'shipped' ? 'Enviado' :
                                                                    status === 'delivered' ? 'Entregado' : 'Cancelado'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-12">
                                        {/* Customer Info */}
                                        <div className="bg-stone-50 dark:bg-black/20 p-8 rounded-3xl space-y-6">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                                                <Icon name="local_shipping" className="text-lg" /> Info de Envío
                                            </h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Cliente</p>
                                                    <p className="text-lg font-medium">{order.shipping_details.name} {order.shipping_details.lastname}</p>
                                                    <p className="opacity-60">{order.shipping_details.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Dirección</p>
                                                    <p className="text-lg leading-relaxed">{order.shipping_details.address}</p>
                                                    <p className="opacity-60 font-medium">{order.shipping_details.city}, {order.shipping_details.zip}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items Info */}
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                                                <Icon name="shopping_bag" className="text-lg" /> Productos ({order.order_items?.length})
                                            </h4>
                                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                                                {order.order_items?.map((item: any) => (
                                                    <div key={item.id} className="flex justify-between items-center p-5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-white/5 shadow-sm">
                                                        <div className="space-y-1">
                                                            <p className="font-bold">{item.quantity}x {item.product_name}</p>
                                                            {item.config?.color && (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="size-3 rounded-full" style={{ backgroundColor: item.config.color.hex }}></div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                                                        {item.config.color.name}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {item.config?.charms?.length > 0 && (
                                                                <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">
                                                                    Dijes: {item.config.charms.join(', ')}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <p className="text-xl font-bold font-display-serif">${item.price_at_purchase * item.quantity}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
