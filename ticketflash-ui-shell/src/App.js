import React, { useState, useEffect } from 'react';

// --- STILURI GENERALE ---
const styles = {
  container: { fontFamily: "'Inter', sans-serif", color: '#f8fafc', paddingBottom: '100px', position: 'relative', minHeight: '100vh', overflowX: 'hidden' },
  videoBg: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2 },
  videoOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(31, 61, 141, 0.75)', backdropFilter: 'blur(3px)', zIndex: -1 },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.1)' },
  navLinks: { display: 'flex', gap: '40px', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px' },
  navItem: (active) => ({ color: active ? '#22d3ee' : '#94a3b8', cursor: 'pointer', transition: 'all 0.3s', textTransform: 'uppercase', borderBottom: active ? '2px solid #22d3ee' : '2px solid transparent', paddingBottom: '5px' }),
  logo: { fontSize: '28px', fontWeight: '900', background: 'linear-gradient(to right, #f472b6, #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px', cursor: 'pointer' },
  sectionTitle: { textAlign: 'center', fontSize: '40px', fontWeight: '900', margin: '60px 0 40px 0', color: '#fff', textShadow: '0 0 20px rgba(168, 85, 247, 0.5)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
  card: { background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', transition: 'transform 0.3s', display: 'flex', flexDirection: 'column' },
  btn: (color, disabled) => ({ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: disabled ? '#334155' : color, color: disabled ? '#94a3b8' : '#000', fontWeight: '800', cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 'auto', transition: 'opacity 0.2s', textTransform: 'uppercase' }),
  
  // LOGIN STYLES
  loginOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  loginCard: { background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', padding: '50px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', width: '350px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  loginInput: { width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #334155', background: '#1e293b', color: 'white', fontSize: '16px', marginBottom: '15px', boxSizing: 'border-box', outline: 'none' },
  loginBtn: { width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: 'linear-gradient(90deg, #f472b6, #a855f7)', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s', marginTop: '10px' },
  errorMsg: { color: '#ef4444', fontSize: '14px', marginBottom: '15px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '5px' },

  // ADMIN & PROFILE STYLES
  adminBadge: { position: 'absolute', top: '20px', right: '20px', background: '#ef4444', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', zIndex: 10 },
  stockBadge: { position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.7)', color: '#4ade80', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', zIndex: 10, border: '1px solid #4ade80' },
  editInput: { background: 'rgba(0,0,0,0.5)', border: '1px solid #475569', color: 'white', padding: '5px', borderRadius: '5px', width: '80%', marginBottom: '5px' },
  saveBtn: { background: '#22c55e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', marginTop: '5px' },
  cartPanel: { position: 'fixed', right: '0', top: '0', height: '100vh', width: '400px', background: '#0f172a', borderLeft: '1px solid #334155', padding: '30px', paddingBottom: '120px', zIndex: 200, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
  notification: { position: 'fixed', bottom: '20px', left: '20px', background: 'rgba(34, 197, 94, 0.9)', color: '#fff', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideIn 0.3s' },
  
  // PROFILE SPECIFIC
  profileHeader: { background: 'rgba(15, 23, 42, 0.8)', padding: '40px', borderRadius: '20px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '30px', border: '1px solid rgba(255,255,255,0.1)' },
  avatar: { width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #f472b6, #a855f7)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px', fontWeight: 'bold' },
  ticketRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #22d3ee' },
  
  // DASHBOARD SPECIFIC
  statCard: { background: '#1e293b', padding: '25px', borderRadius: '15px', border: '1px solid #334155', flex: 1, textAlign: 'center' },
  statNumber: { fontSize: '36px', fontWeight: '900', color: '#22d3ee', margin: '10px 0' },
  chartContainer: { background: '#0f172a', borderRadius: '20px', padding: '30px', marginTop: '30px', border: '1px solid #334155' },
  
  faqContainer: { maxWidth: '900px', margin: '0 auto', padding: '0 20px' },
  faqItem: { background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.1)' },
  faqQuestion: { padding: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', color: '#fff', display: 'flex', justifyContent: 'space-between', listStyle: 'none' },
  faqAnswer: { padding: '0 20px 20px 20px', color: '#cbd5e1', lineHeight: '1.6', fontSize: '15px' },
  artistGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', padding: '0 40px', maxWidth: '1300px', margin: '0 auto' },
  artistCard: { position: 'relative', height: '350px', borderRadius: '15px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'transform 0.3s', marginBottom: '15px' },
  artistName: { position: 'absolute', bottom: '0', left: '0', right: '0', padding: '20px', background: 'linear-gradient(to top, #000, transparent)', fontSize: '24px', fontWeight: '900', textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,1)' },
  artistDesc: { color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', textAlign: 'center', padding: '0 10px' },
};

// --- DATA INITIALA ---
const initialTickets = [
  { id: 'GA', name: 'General Access', price: 299, currency: 'RON', color: '#22d3ee', tag: 'STANDARD', stock: 2000, img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800', benefits: ['Acces 4 zile', 'Food Court', 'Free WiFi'] },
  { id: 'EARLY', name: 'Early Entry GA', price: 349, currency: 'RON', color: '#fb923c', tag: 'LIMITED', stock: 2000, img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800', benefits: ['Prioritate', 'Acces devreme', 'No queue'] },
  { id: 'CAMP_GA', name: 'GA + Camping', price: 449, currency: 'RON', color: '#4ade80', tag: 'COMBO', stock: 2000, img: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800', benefits: ['Bilet 4 Zile', 'Cort asigurat', 'Dusuri'] },
  { id: 'GOLDEN', name: 'Golden Circle', price: 499, currency: 'RON', color: '#facc15', tag: 'BEST VIEW', stock: 2000, img: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800', benefits: ['Fata scena', 'Bar dedicat', 'View'] },
  { id: 'VIP', name: 'VIP Experience', price: 899, currency: 'RON', color: '#a855f7', tag: 'PREMIUM', stock: 2000, img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800', benefits: ['Platforma VIP', 'Intrare separata', 'Mese'] },
  { id: 'ULTRA', name: 'Backstage Ultra', price: 1599, currency: 'RON', color: '#f472b6', tag: 'ALL IN', stock: 2000, img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800', benefits: ['Backstage', 'Meet & Greet', 'Free Food'] }
];

const artists = [
  { name: "DUA LIPA", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800", desc: "The ultimate disco-pop experience." }, 
  { name: "THE WEEKND", img: "https://images.unsplash.com/photo-1514525253440-b39345208668?q=80&w=800", desc: "A cinematic journey through R&B." }, 
  { name: "ARMIN VAN BUUREN", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800", desc: "The legend of Trance." }, 
];

const experiences = [
    { title: "NEON CAMPING", color: "#a855f7", img: "https://images.unsplash.com/photo-1517056463914-749e7949826d?q=80&w=800", desc: "Premium pre-pitched tents." },
    { title: "FOOD DISTRICT", color: "#22d3ee", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800", desc: "Over 60 gourmet food trucks." },
    { title: "THE SKY WHEEL", color: "#f472b6", img: "https://images.unsplash.com/photo-1574345710688-66236b284814?q=80&w=800", desc: "See the festival from above." },
    { title: "ART ZONES", color: "#22d3ee", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800", desc: "Mind-bending light installations." }
];

const faqData = [
  { q: "Care este vârsta minimă?", a: "Minim 14 ani." },
  { q: "Ce acte să iau cu mine?", a: "Un bilet valid și un act de identitate." },
  { q: "Pot schimba numele de pe bilet?", a: "Nu, biletele sunt nominale." },
  { q: "Există locuri de parcare?", a: "Da, limitate, în zona Sălii Polivalente." }
];

// --- COMPONENTA CUSTOM SVG AREA CHART ---
const SimpleAreaChart = ({ data }) => {
    // data e un array: [{label: 'GA', value: 50}, ...]
    if (!data || data.length === 0) return null;

    const height = 200;
    const width = 800;
    const padding = 40;
    
    const maxValue = Math.max(...data.map(d => d.value), 10); // Minim 10 ca sa nu fie plat
    
    // Calculam punctele
    const points = data.map((d, i) => {
        const x = padding + (i * ((width - 2 * padding) / (data.length - 1)));
        const y = height - padding - ((d.value / maxValue) * (height - 2 * padding));
        return `${x},${y}`;
    }).join(' ');

    // Coordonate pentru zona plina (inchidere poligon)
    const firstX = padding;
    const lastX = width - padding;
    const bottomY = height - padding;
    const areaPath = `${points} ${lastX},${bottomY} ${firstX},${bottomY}`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{width: '100%', height: '100%', overflow: 'visible'}}>
            {/* Grids */}
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="2" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="2" />
            
            {/* Area Fill */}
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={areaPath} fill="url(#chartGradient)" />
            
            {/* Stroke Line */}
            <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Points & Labels */}
            {data.map((d, i) => {
                const x = padding + (i * ((width - 2 * padding) / (data.length - 1)));
                const y = height - padding - ((d.value / maxValue) * (height - 2 * padding));
                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r="4" fill="#fff" />
                        <text x={x} y={height - 10} textAnchor="middle" fill="#94a3b8" fontSize="12" style={{fontFamily: 'monospace'}}>{d.label}</text>
                        <text x={x} y={y - 10} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">{d.value}</text>
                    </g>
                );
            })}
        </svg>
    );
};

// --- COMPONENTA LOGIN ---
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) onLogin(data.username, data.token);
      else setError(data.detail || 'Login failed');
    } catch (err) { setError('Connection failed. Make sure Backend is running on port 8000.'); }
    setLoading(false);
  };

  return (
    <div style={styles.loginOverlay}>
      <div style={styles.loginCard}>
        <h1 style={{ marginBottom: '10px', background: 'linear-gradient(to right, #f472b6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '36px', fontWeight: '900' }}>FESTFLOW 9-13 JUNE 2026</h1>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Secure Access Required</p>
        {error && <div style={styles.errorMsg}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input style={styles.loginInput} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" style={styles.loginInput} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" style={{...styles.loginBtn, opacity: loading ? 0.7 : 1}} disabled={loading}>{loading ? 'VERIFYING...' : 'LOGIN'}</button>
        </form>
        <p style={{marginTop: '20px', fontSize: '12px', color: '#64748b'}}>Admin: admin / admin123 | User: guest / festflow</p>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---
function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); 
  const [page, setPage] = useState('HOME');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [status, setStatus] = useState("READY");
  const [logs, setLogs] = useState([]);
  const [notification, setNotification] = useState(null);

  // --- STARE PRODUSE ---
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('festflow_products');
    return saved ? JSON.parse(saved) : initialTickets;
  });
  
  const [tempEdits, setTempEdits] = useState({});

  const [userOrders, setUserOrders] = useState(() => {
    return [
      { id: 'ORD-99382', item: 'General Access', price: 299, date: '2026-01-10', status: 'CONFIRMED' },
      { id: 'ORD-11234', item: 'Camping Pass', price: 150, date: '2026-01-11', status: 'CONFIRMED' }
    ];
  });

  
  const [dashboardStats, setDashboardStats] = useState({ revenue: 42900, sold: 1240 });
  

  const [categorySales, setCategorySales] = useState(() => {
      const saved = localStorage.getItem('festflow_category_sales');
     
      return saved ? JSON.parse(saved) : {
          'GA': 450,
          'EARLY': 300,
          'CAMP_GA': 200,
          'GOLDEN': 150,
          'VIP': 90,
          'ULTRA': 50
      };
  });

  useEffect(() => {
    if (page === 'DASHBOARD') {
        const savedStats = localStorage.getItem('festflow_stats');
        if (savedStats) setDashboardStats(JSON.parse(savedStats));
        
        const savedCats = localStorage.getItem('festflow_category_sales');
        if (savedCats) setCategorySales(JSON.parse(savedCats));
    }
  }, [page]);

  const isAdmin = user === 'admin'; 

  useEffect(() => {
    const savedUser = localStorage.getItem('festflow_user');
    const savedToken = localStorage.getItem('festflow_token');
    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NOTIFICATION") {
        setNotification(data.message);
        setTimeout(() => setNotification(null), 4000);
      }
    };
    return () => ws.close();
  }, []);

  const handleLogin = (username, receivedToken) => {
    localStorage.setItem('festflow_user', username);
    localStorage.setItem('festflow_token', receivedToken);
    setUser(username);
    setToken(receivedToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('festflow_user');
    localStorage.removeItem('festflow_token');
    window.location.reload(); 
  };

  const addToCart = (ticket) => {
    if (ticket.stock <= 0) { alert("Sorry, this ticket is SOLD OUT!"); return; }
    setCart(prev => {
      const existing = prev.find(item => item.id === ticket.id);
      if (existing) {
          if (existing.qty >= ticket.stock) { alert(`Only ${ticket.stock} tickets available!`); return prev; }
          return prev.map(item => item.id === ticket.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...ticket, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleTempEdit = (id, field, value) => {
    setTempEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const saveProductChanges = (id) => {
    const changes = tempEdits[id];
    if (!changes) return;
    const newProducts = products.map(p => p.id === id ? { ...p, ...changes } : p);
    setProducts(newProducts);
    localStorage.setItem('festflow_products', JSON.stringify(newProducts));
    const remainingEdits = {...tempEdits};
    delete remainingEdits[id];
    setTempEdits(remainingEdits);
    alert("Product updated successfully!");
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
          const product = products.find(p => p.id === id);
          if (delta > 0 && item.qty >= product.stock) return item;
          return { ...item, qty: Math.max(1, item.qty + delta) };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleCheckout = async () => {
    setStatus("PROCESSING...");
    setLogs([]);
    for (const item of cart) {
        try {
          const response = await fetch('http://localhost:8000/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ user_email: user + "@festflow.com", ticket_type: item.id, total: item.price, items: [{ id: item.id, title: item.name, price: item.price, quantity: 1 }] })
          });
          if (response.ok) {
             setLogs(prev => [`✔ ${item.name}: Authenticated & Sent`, ...prev]);
             setUserOrders(prev => [{id: 'ORD-' + Math.floor(Math.random()*10000), item: item.name, price: item.price, date: new Date().toISOString().split('T')[0], status: 'PROCESSING'}, ...prev]);
          }
          else setLogs(prev => [`❌ Auth Failed (401)`, ...prev]);
        } catch (e) { setLogs(prev => [`❌ Connection Error`, ...prev]); }
    }
    
    // --- ACTUALIZARE STATS ---
    const currentStatsStr = localStorage.getItem('festflow_stats');
    const currentStats = currentStatsStr ? JSON.parse(currentStatsStr) : { revenue: 42900, sold: 1240 };
    const newStats = { revenue: currentStats.revenue + total, sold: currentStats.sold + totalQty };
    localStorage.setItem('festflow_stats', JSON.stringify(newStats));
    setDashboardStats(newStats);

    // --- ACTUALIZARE STOC ---
    const updatedProducts = products.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        if (cartItem) return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
        return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem('festflow_products', JSON.stringify(updatedProducts));

    // --- ACTUALIZARE GRAFIC (Category Sales) ---
    const currentCatStr = localStorage.getItem('festflow_category_sales');
    const currentCats = currentCatStr ? JSON.parse(currentCatStr) : categorySales;
    cart.forEach(item => {
        if (!currentCats[item.id]) currentCats[item.id] = 0;
        currentCats[item.id] += item.qty;
    });
    setCategorySales(currentCats);
    localStorage.setItem('festflow_category_sales', JSON.stringify(currentCats));

    setStatus("COMPLETED");
    setTimeout(() => setCart([]), 2000);
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (page) {
      case 'LINEUP': return <div style={{animation: 'fadeIn 0.5s', padding: '100px 20px'}}><h1 style={styles.sectionTitle}>LINEUP</h1><div style={styles.artistGrid}>{artists.map((a, i) => <div key={i}><div style={{...styles.artistCard, backgroundImage: `url(${a.img})`, backgroundSize: 'cover'}}></div><h3 style={{color: 'white', textAlign: 'center'}}>{a.name}</h3></div>)}</div></div>;
      
      case 'EXPERIENCE': return <div style={{animation: 'fadeIn 0.5s', padding: '100px 20px'}}><h1 style={styles.sectionTitle}>EXPERIENCE</h1><div style={styles.grid}>{experiences.map((e, i) => <div key={i} style={{background: '#1e293b', padding: '20px', borderRadius: '15px'}}><img src={e.img} style={{width:'100%', borderRadius:'15px', height: '250px', objectFit: 'cover'}} alt={e.title}/><h3 style={{color: e.color, marginTop: '15px'}}>{e.title}</h3><p style={{color: 'white'}}>{e.desc}</p></div>)}</div></div>;
      
      case 'INFO': return (
          <div style={{animation: 'fadeIn 0.5s', padding: '100px 20px'}}>
            <h1 style={styles.sectionTitle}>USEFUL INFO</h1>
            <div style={{maxWidth:'800px', margin:'0 auto', background:'rgba(15, 23, 42, 0.9)', padding:'40px', borderRadius:'20px', border: '1px solid #334155', marginBottom: '40px'}}>
                <h3 style={{color:'#22d3ee'}}>📍 LOCATION</h3>
                <p style={{marginBottom:'30px', color:'#cbd5e1'}}>Cluj Arena, Aleea Stadionului 2, Cluj-Napoca.</p>
                <h3 style={{color:'#f472b6'}}>📅 DATES</h3>
                <p style={{marginBottom:'30px', color:'#cbd5e1'}}>July 15 - July 19, 2026</p>
                <h3 style={{color:'#a855f7'}}>🕒 ACCESS</h3>
                <p style={{color:'#cbd5e1'}}>Gates open at 14:00 PM every day.</p>
            </div>
            <div style={styles.faqContainer}>
                {faqData.map((f, i) => (
                    <div key={i} style={styles.faqItem}>
                        <div style={styles.faqQuestion}>{f.q}</div>
                        <div style={styles.faqAnswer}>{f.a}</div>
                    </div>
                ))}
            </div>
          </div>
      );
      
      case 'PROFILE': return (
        <div style={{animation: 'fadeIn 0.5s', maxWidth: '800px', margin: '0 auto', padding: '100px 20px'}}>
            <div style={styles.profileHeader}>
                <div style={styles.avatar}>{user.charAt(0).toUpperCase()}</div>
                <div>
                    <h1 style={{margin: 0, fontSize: '32px'}}>{user.toUpperCase()}</h1>
                    <p style={{color: '#94a3b8'}}>Member since 2026 • Verified Fan</p>
                </div>
            </div>
            <h2 style={{borderBottom: '1px solid #334155', paddingBottom: '10px'}}>MY TICKETS</h2>
            {userOrders.length === 0 ? <p>No tickets yet.</p> : userOrders.map((ord, i) => (
                <div key={i} style={styles.ticketRow}>
                    <div>
                        <div style={{fontWeight: 'bold', fontSize: '18px'}}>{ord.item}</div>
                        <div style={{color: '#94a3b8', fontSize: '14px'}}>Order #{ord.id} • {ord.date}</div>
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <div style={{fontWeight: 'bold', color: ord.status === 'CONFIRMED' ? '#4ade80' : '#fb923c'}}>{ord.status}</div>
                        <button style={{marginTop: '5px', background: 'transparent', border: '1px solid #22d3ee', color: '#22d3ee', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer'}}>VIEW QR</button>
                    </div>
                </div>
            ))}
        </div>
      );

      case 'DASHBOARD': return (
        <div style={{animation: 'fadeIn 0.5s', maxWidth: '1000px', margin: '0 auto', padding: '100px 20px'}}>
             <h1 style={styles.sectionTitle}>ADMIN DASHBOARD</h1>
             
             {/* STATS CARDS */}
             <div style={{display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap'}}>
                <div style={styles.statCard}><div style={{color: '#94a3b8'}}>Total Sales</div><div style={styles.statNumber}>€ {dashboardStats.revenue.toLocaleString()}</div><div style={{color: '#4ade80'}}>▲ Updated Realtime</div></div>
                <div style={styles.statCard}><div style={{color: '#94a3b8'}}>Tickets Sold</div><div style={styles.statNumber}>{dashboardStats.sold}</div><div style={{color: '#22d3ee'}}>Live Count</div></div>
                <div style={styles.statCard}><div style={{color: '#94a3b8'}}>System Status</div><div style={styles.statNumber}>ONLINE</div><div style={{color: '#4ade80'}}>● RabbitMQ & Kafka</div></div>
             </div>

             {/* CHART SECTION */}
             <h2 style={{borderBottom: '1px solid #334155', paddingBottom: '10px'}}>SALES ANALYTICS (BY CATEGORY)</h2>
             <div style={styles.chartContainer}>
                 <SimpleAreaChart data={Object.entries(categorySales).map(([key, val]) => ({label: key, value: val}))} />
             </div>

             <h2 style={{borderBottom: '1px solid #334155', paddingBottom: '10px', marginTop: '40px'}}>RECENT SYSTEM ACTIVITY</h2>
             <div style={{background: '#0f172a', padding: '20px', borderRadius: '15px', fontFamily: 'monospace', color: '#94a3b8', height: '300px', overflowY: 'auto'}}>
                 <div>[17:01:23] INFO: Inventory Service connected to RabbitMQ</div>
                 <div>[17:02:10] INFO: User 'guest_939' initiated checkout</div>
                 <div>[17:02:11] SUCCESS: Order #ORD-3929 processed.</div>
                 <div>[17:02:11] KAFKA: Event 'TICKET_SOLD' emitted to topic 'email_notifications'</div>
                 {logs.map((l, i) => <div key={i} style={{color: '#fff'}}>[REALTIME] {l}</div>)}
             </div>
        </div>
      );

      default: return (
          <div style={{animation: 'fadeIn 0.5s'}}>
            <div style={{textAlign: 'center', padding: '120px 20px', marginBottom:'40px'}}>
              <h1 style={{fontSize: '90px', fontWeight: '900', marginBottom: '20px', textShadow: '0 0 50px rgba(168,85,247,0.8)', lineHeight: '1'}}>FEEL THE <span style={{color: '#a855f7'}}>RHYTHM.</span></h1>
              <p style={{fontSize: '26px', color: '#fff', fontWeight: 'bold'}}>The definitive digital experience.</p>
              <button onClick={() => document.getElementById('tickets-section').scrollIntoView({behavior: 'smooth'})} style={{marginTop: '40px', padding: '18px 50px', fontSize: '18px', borderRadius: '50px', border: 'none', background: '#22d3ee', color: '#000', fontWeight: '900', cursor: 'pointer'}}>SECURE YOUR SPOT</button>
            </div>
            
            <div id="tickets-section" style={styles.grid}>
              {products.map(t => (
                <div key={t.id} style={styles.card}>
                  <div style={{height: '220px', overflow: 'hidden', position: 'relative'}}>
                     <img src={t.img} alt={t.name} style={{width:'100%', height:'100%', objectFit:'cover', filter: t.stock === 0 ? 'grayscale(100%)' : 'none'}}/>
                     {isAdmin && <div style={styles.adminBadge}>ADMIN MODE</div>}
                     {isAdmin && <div style={styles.stockBadge}>STOCK: {t.stock}</div>}
                  </div>
                  <div style={{padding:'30px', flex:1, display:'flex', flexDirection:'column'}}>
                    <span style={{background:t.color, color:'#000', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'800', width:'fit-content', marginBottom:'15px'}}>{t.tag}</span>
                    
                    {isAdmin ? (
                      <div style={{marginBottom: '10px', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px'}}>
                        <label style={{color: '#94a3b8', fontSize: '10px'}}>Name:</label>
                        <input value={tempEdits[t.id]?.name ?? t.name} onChange={(e) => handleTempEdit(t.id, 'name', e.target.value)} style={styles.editInput} />
                        <label style={{color: '#94a3b8', fontSize: '10px'}}>Price:</label>
                        <input type="number" value={tempEdits[t.id]?.price ?? t.price} onChange={(e) => handleTempEdit(t.id, 'price', parseFloat(e.target.value))} style={styles.editInput} />
                        <label style={{color: '#94a3b8', fontSize: '10px'}}>Stock (Manual Update):</label>
                        <input type="number" value={tempEdits[t.id]?.stock ?? t.stock} onChange={(e) => handleTempEdit(t.id, 'stock', parseFloat(e.target.value))} style={styles.editInput} />
                        <button onClick={() => saveProductChanges(t.id)} style={styles.saveBtn}>💾 SAVE CHANGES</button>
                      </div>
                    ) : (
                      <>
                        <h2 style={{margin:0}}>{t.name}</h2>
                        <div style={{fontSize:'36px', fontWeight:'800', margin:'15px 0', color: t.stock === 0 ? '#94a3b8' : '#fff'}}>{t.stock === 0 ? 'SOLD OUT' : `${t.price} ${t.currency}`}</div>
                      </>
                    )}

                    <ul style={{listStyle:'none', padding:0, color:'#94a3b8', fontSize:'14px', marginBottom:'20px'}}>{t.benefits.map((b,i) => <li key={i} style={{marginBottom:'8px', display:'flex', gap:'10px'}}><span style={{color:t.color}}>✓</span> {b}</li>)}</ul>
                    <button style={styles.btn(t.color, t.stock === 0)} onClick={() => addToCart(t)} disabled={t.stock === 0}>{t.stock === 0 ? 'SOLD OUT' : 'ADD TO CART'}</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{height: '50px'}}></div>
          </div>
        );
    }
  };

  if (!user || !token) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div style={styles.container}>
      <video autoPlay loop muted playsInline style={styles.videoBg}><source src="https://assets.mixkit.co/videos/preview/mixkit-crowd-cheering-and-flashing-lights-at-a-concert-14297-large.mp4" type="video/mp4" /></video><div style={styles.videoOverlay}></div>
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => setPage('HOME')}>FESTFLOW</div>
        <div style={styles.navLinks}><span style={styles.navItem(page === 'HOME')} onClick={() => setPage('HOME')}>TICKETS</span><span style={styles.navItem(page === 'LINEUP')} onClick={() => setPage('LINEUP')}>LINEUP</span><span style={styles.navItem(page === 'EXPERIENCE')} onClick={() => setPage('EXPERIENCE')}>EXPERIENCE</span><span style={styles.navItem(page === 'INFO')} onClick={() => setPage('INFO')}>INFO</span></div>
        <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
          <div style={{color: '#fff', cursor: 'pointer', fontWeight: 'bold', borderBottom: '1px solid #fff'}} onClick={() => setPage(isAdmin ? 'DASHBOARD' : 'PROFILE')}>{isAdmin ? 'ADMIN DASHBOARD' : 'MY PROFILE'}</div>
          <div style={{cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setIsCartOpen(true)}>🛒 <span style={{background: '#22d3ee', color: 'black', padding: '2px 6px', borderRadius: '10px', fontSize: '12px'}}>{cart.reduce((a,b)=>a+b.qty,0)}</span></div>
          <button onClick={handleLogout} style={{background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'}}>LOGOUT</button>
        </div>
      </nav>
      {renderContent()}
      {notification && <div style={styles.notification}><span>🔔</span><div><div style={{fontWeight: 'bold', fontSize: '14px'}}>Notification</div><div style={{fontSize: '12px'}}>{notification}</div></div></div>}
      {isCartOpen && <div style={styles.cartPanel}><div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px', borderBottom: '1px solid #334155', paddingBottom: '20px'}}><h2 style={{margin: 0}}>Cart</h2><button onClick={()=>setIsCartOpen(false)} style={{background:'none', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>✕</button></div><div style={{flex: 1, overflowY: 'auto'}}>{cart.map(item => <div key={item.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#1e293b', padding:'15px', borderRadius:'12px', marginBottom:'10px'}}><div><div style={{fontWeight:'bold'}}>{item.name}</div><div style={{fontSize:'12px', color: item.color}}>{item.price} RON</div></div><div style={{display:'flex', gap:'10px'}}><button onClick={()=>updateQty(item.id, -1)}>-</button><span>{item.qty}</span><button onClick={()=>updateQty(item.id, 1)}>+</button></div></div>)}</div><div style={{marginTop: 'auto'}}><div style={{fontSize:'24px', fontWeight:'bold', marginBottom:'20px'}}>TOTAL: <span style={{color: '#22d3ee'}}>{total} RON</span></div>{logs.length > 0 && <div style={{background: '#000', padding: '15px', borderRadius: '12px', marginBottom: '20px', maxHeight: '150px', overflowY: 'auto', fontSize: '12px', color: '#4ade80', fontFamily: 'monospace'}}>{logs.map((l, i) => <div key={i}>{l}</div>)}</div>}<button onClick={handleCheckout} style={{width: '100%', padding: '15px', background: '#22d3ee', borderRadius: '10px', fontWeight: '900', border: 'none'}}>CHECKOUT</button></div></div>}
    </div>
  );
}

export default App;