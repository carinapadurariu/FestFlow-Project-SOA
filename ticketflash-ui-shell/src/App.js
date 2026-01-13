import React, { useState, useEffect } from 'react';


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
  btn: (color) => ({ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: color, color: '#000', fontWeight: '800', cursor: 'pointer', marginTop: 'auto', transition: 'opacity 0.2s', textTransform: 'uppercase' }),
  artistGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', padding: '0 40px', maxWidth: '1300px', margin: '0 auto' },
  artistCard: { position: 'relative', height: '350px', borderRadius: '15px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'transform 0.3s', marginBottom: '15px' },
  artistName: { position: 'absolute', bottom: '0', left: '0', right: '0', padding: '20px', background: 'linear-gradient(to top, #000, transparent)', fontSize: '24px', fontWeight: '900', textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,1)' },
  artistDesc: { color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', textAlign: 'center', padding: '0 10px' },
  faqContainer: { maxWidth: '900px', margin: '0 auto', padding: '0 20px' },
  faqItem: { background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.1)' },
  faqQuestion: { padding: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', color: '#fff', display: 'flex', justifyContent: 'space-between', listStyle: 'none' },
  faqAnswer: { padding: '0 20px 20px 20px', color: '#cbd5e1', lineHeight: '1.6', fontSize: '15px' },
  cartPanel: { position: 'fixed', right: '0', top: '0', height: '100vh', width: '400px', background: '#0f172a', borderLeft: '1px solid #334155', padding: '30px', paddingBottom: '120px', zIndex: 200, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
  notification: { position: 'fixed', bottom: '20px', left: '20px', background: 'rgba(34, 197, 94, 0.9)', color: '#fff', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideIn 0.3s' }
};

const artists = [
  { name: "DUA LIPA", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800", desc: "The ultimate disco-pop experience. A full band live performance." }, 
  { name: "THE WEEKND", img: "https://images.unsplash.com/photo-1514525253440-b39345208668?q=80&w=800", desc: "A cinematic journey through R&B and synth-pop. Dark and mysterious." }, 
  { name: "ARMIN VAN BUUREN", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800", desc: "The legend of Trance. A 3-hour extended set." }, 
  { name: "CALVIN HARRIS", img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800", desc: "Summer vibes personified. The hitmaker brings the bounce." }, 
  { name: "DAVID GUETTA", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800", desc: "The father of modern EDM. Future rave sounds and nostalgia." },
  { name: "BILLIE EILISH", img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800", desc: "Hauntingly beautiful vocals and heavy basslines." }
];


const tickets = [
  { 
    id: 'GA', 
    name: 'General Access', 
    price: 299, 
    currency: 'RON', 
    color: '#22d3ee', 
    tag: 'STANDARD', 
    img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800', 
    benefits: ['Acces 4 zile', 'Food Court Zone', 'Free WiFi'] 
  },
  { 
    id: 'EARLY', 
    name: 'Early Entry GA', 
    price: 349, 
    currency: 'RON', 
    color: '#fb923c', 
    tag: 'LIMITED TIME', 
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800', 
    benefits: ['Intrare prioritara', 'Acces cu 2h mai devreme', 'Eviti cozile'] 
  },
  { 
    id: 'CAMP_GA', 
    name: 'GA + Camping', 
    price: 449, 
    currency: 'RON', 
    color: '#4ade80', 
    tag: 'COMBO', 
    img: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800', 
    benefits: ['Bilet GA 4 Zile', 'Loc de cort asigurat', 'Dusuri & Toalete'] 
  },
  { 
    id: 'GOLDEN', 
    name: 'Golden Circle', 
    price: 499, 
    currency: 'RON', 
    color: '#facc15', 
    tag: 'BEST VIEW', 
    img: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800', 
    benefits: ['Zona din fata scenei', 'Bar dedicat Golden', 'Vedere perfecta'] 
  },
  { 
    id: 'VIP', 
    name: 'VIP Experience', 
    price: 899, 
    currency: 'RON', 
    color: '#a855f7', 
    tag: 'PREMIUM', 
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800', 
    benefits: ['Platforma VIP inaltata', 'Intrare separata', 'Mese rezervate'] 
  },
  { 
    id: 'ULTRA', 
    name: 'Backstage Ultra', 
    price: 1599, 
    currency: 'RON', 
    color: '#f472b6', 
    tag: 'ALL INCLUSIVE', 
    img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800', 
    benefits: ['Acces Backstage', 'Meet & Greet', 'Bautura & Mancare Free'] 
  }
];

const experiences = [
    { title: "NEON CAMPING", color: "#a855f7", img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800", desc: "Premium pre-pitched tents right next to the festival grounds." },
    { title: "FOOD DISTRICT", color: "#22d3ee", img: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?q=80&w=800", desc: "Over 60 gourmet food trucks serving exotic cuisines." },
    { title: "THE SKY WHEEL", color: "#f472b6", img: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=800", desc: "See the festival from above on our massive LED Ferris Wheel." },
    { title: "ART ZONES", color: "#22d3ee", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800", desc: "Walk through mind-bending light installations and digital art." }
];

const faqData = [
  { q: "Care este vârsta de la care pot participa la festival?", a: "Din motive de securitate, vârsta minimă de la care poți participa la Festival este 14 ani." },
  { q: "Ce acte să iau cu mine la festival?", a: "Un bilet valid și un act de identitate original." },
  { q: "Pot schimba numele de pe bilet?", a: "Toate biletele sunt nominale și netransmisibile." },
  { q: "Sunt valide invitațiile nenominale?", a: "Nu. Toate invitațiile sunt nominale." },
  { q: "Există acces la camping?", a: "Da, dacă achiziționați biletul 'GA + Camping' sau separat un Camping Pass." }
];

function App() {
  const [page, setPage] = useState('HOME');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [status, setStatus] = useState("READY");
  const [logs, setLogs] = useState([]);
  const [notification, setNotification] = useState(null);


  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onopen = () => console.log(" [WS] Connected");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NOTIFICATION") {
        setNotification(data.message);
        setTimeout(() => setNotification(null), 4000);
      }
    };
    return () => ws.close();
  }, []);

  const addToCart = (ticket) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === ticket.id);
      if (existing) return prev.map(item => item.id === ticket.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...ticket, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, qty: Math.max(1, item.qty + delta) };
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleCheckout = async () => {
    setStatus("PROCESSING...");
    setLogs([]);
    for (const item of cart) {
      for (let i = 0; i < item.qty; i++) {
        try {
          await fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: "guest_" + Math.floor(Math.random()*1000), ticket_type: item.id })
          });
          setLogs(prev => [`✔ ${item.name}: Sent to RabbitMQ`, ...prev]);
        } catch (e) {
          setLogs(prev => [`❌ Connection Error`, ...prev]);
        }
      }
    }
    setStatus("COMPLETED");
    setTimeout(() => setCart([]), 2000);
  };

  const FAQSection = () => (
    <div style={styles.faqContainer}>
      <h2 style={{...styles.sectionTitle, fontSize: '30px', marginTop: '60px'}}>ÎNTREBĂRI FRECVENTE</h2>
      {faqData.map((item, index) => (
        <details key={index} style={styles.faqItem}>
          <summary style={styles.faqQuestion}>{item.q} <span style={{color: '#22d3ee'}}>+</span></summary>
          <p style={styles.faqAnswer}>{item.a}</p>
        </details>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (page) {
      case 'LINEUP': return (
          <div style={{animation: 'fadeIn 0.5s'}}>
            <h1 style={styles.sectionTitle}>THE 2026 LINEUP</h1>
            <div style={styles.artistGrid}>
              {artists.map((artist, i) => (
                <div key={i} style={{display:'flex', flexDirection:'column'}}>
                  <div style={{...styles.artistCard, backgroundImage: `url(${artist.img})`, backgroundSize: 'cover', backgroundPosition: 'center'}} className="artist-card-hover"><div style={styles.artistName}>{artist.name}</div></div>
                  <p style={styles.artistDesc}>{artist.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'EXPERIENCE': return (
          <div style={{animation: 'fadeIn 0.5s', padding: '0 20px'}}>
            <h1 style={styles.sectionTitle}>BEYOND THE MUSIC</h1>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(450px, 1fr))', gap:'40px', maxWidth:'1200px', margin:'0 auto'}}>
              {experiences.map((exp, i) => (
                  <div key={i} style={{background: 'rgba(15, 23, 42, 0.8)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)'}}><img src={exp.img} style={{width:'100%', borderRadius:'15px', height: '250px', objectFit: 'cover'}} alt={exp.title}/><h2 style={{color: exp.color, marginTop: '25px', fontSize: '28px'}}>{exp.title}</h2><p style={{color:'#cbd5e1', lineHeight:'1.8', fontSize: '16px'}}>{exp.desc}</p></div>
              ))}
            </div>
          </div>
        );
      case 'INFO': return (
          <div style={{animation: 'fadeIn 0.5s'}}>
            <h1 style={styles.sectionTitle}>USEFUL INFO</h1>
            <div style={{maxWidth:'800px', margin:'0 auto', background:'rgba(15, 23, 42, 0.9)', padding:'40px', borderRadius:'20px', border: '1px solid #334155', marginBottom: '40px'}}><h3 style={{color:'#22d3ee'}}>📍 LOCATION</h3><p style={{marginBottom:'30px', color:'#cbd5e1'}}>Cluj Arena, Aleea Stadionului 2, Cluj-Napoca.</p><h3 style={{color:'#f472b6'}}>📅 DATES</h3><p style={{marginBottom:'30px', color:'#cbd5e1'}}>July 15 - July 19, 2026</p></div>
            <FAQSection />
          </div>
        );
      default: return (
          <div style={{animation: 'fadeIn 0.5s'}}>
            <div style={{textAlign: 'center', padding: '120px 20px', marginBottom:'40px'}}>
              <h1 style={{fontSize: '90px', fontWeight: '900', marginBottom: '20px', textShadow: '0 0 50px rgba(168,85,247,0.8)', lineHeight: '1'}}>FEEL THE <span style={{color: '#a855f7'}}>RHYTHM.</span></h1>
              <p style={{fontSize: '26px', color: '#fff', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>The definitive digital experience of 2026.</p>
              <button onClick={() => document.getElementById('tickets-section').scrollIntoView({behavior: 'smooth'})} style={{marginTop: '40px', padding: '18px 50px', fontSize: '18px', borderRadius: '50px', border: 'none', background: '#22d3ee', color: '#000', fontWeight: '900', cursor: 'pointer', boxShadow: '0 0 30px rgba(34, 211, 238, 0.5)', transition: 'transform 0.2s'}}>SECURE YOUR SPOT</button>
            </div>
            <div id="tickets-section" style={styles.grid}>
              {tickets.map(t => (
                <div key={t.id} style={styles.card}>
                  <div style={{height: '220px', overflow: 'hidden'}}><img src={t.img} alt={t.name} style={{width:'100%', height:'100%', objectFit:'cover', transition: 'transform 0.5s'}} className="ticket-img"/></div>
                  <div style={{padding:'30px', flex:1, display:'flex', flexDirection:'column'}}>
                    <span style={{background:t.color, color:'#000', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'800', width:'fit-content', marginBottom:'15px'}}>{t.tag}</span><h2 style={{margin:0}}>{t.name}</h2><div style={{fontSize:'36px', fontWeight:'800', margin:'15px 0', color:'#fff'}}>{t.price} {t.currency}</div>
                    <ul style={{listStyle:'none', padding:0, color:'#94a3b8', fontSize:'14px', marginBottom:'20px'}}>{t.benefits.map((b,i) => <li key={i} style={{marginBottom:'8px', display:'flex', gap:'10px'}}><span style={{color:t.color}}>✓</span> {b}</li>)}</ul>
                    <button style={styles.btn(t.color)} onClick={() => addToCart(t)}>ADD TO CART</button>
                  </div>
                </div>
              ))}
            </div>
            <FAQSection /><div style={{height: '50px'}}></div>
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <video autoPlay loop muted playsInline style={styles.videoBg}><source src="https://assets.mixkit.co/videos/preview/mixkit-crowd-cheering-and-flashing-lights-at-a-concert-14297-large.mp4" type="video/mp4" /></video><div style={styles.videoOverlay}></div>
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => setPage('HOME')}>FESTFLOW.</div>
        <div style={styles.navLinks}><span style={styles.navItem(page === 'HOME')} onClick={() => setPage('HOME')}>TICKETS</span><span style={styles.navItem(page === 'LINEUP')} onClick={() => setPage('LINEUP')}>LINEUP</span><span style={styles.navItem(page === 'EXPERIENCE')} onClick={() => setPage('EXPERIENCE')}>EXPERIENCE</span><span style={styles.navItem(page === 'INFO')} onClick={() => setPage('INFO')}>INFO</span></div>
        <div style={{cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setIsCartOpen(true)}>🛒 CART <span style={{background: '#22d3ee', color: 'black', padding: '2px 6px', borderRadius: '10px', fontSize: '12px'}}>{cart.reduce((a,b)=>a+b.qty,0)}</span></div>
      </nav>
      {renderContent()}
      {notification && (
        <div style={styles.notification}>
          <span style={{fontSize: '20px'}}>🔔</span>
          <div><div style={{fontWeight: 'bold', fontSize: '14px'}}>Server Notification</div><div style={{fontSize: '12px'}}>{notification}</div></div>
        </div>
      )}
      {isCartOpen && (
        <>
          <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:150}} onClick={()=>setIsCartOpen(false)}/>
          <div style={styles.cartPanel}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px', borderBottom: '1px solid #334155', paddingBottom: '20px'}}><h2 style={{margin: 0}}>Your Cart</h2><button onClick={()=>setIsCartOpen(false)} style={{background:'none', border:'none', color:'white', fontSize:'24px', cursor:'pointer'}}>✕</button></div>
            <div style={{flex: 1, overflowY: 'auto', marginBottom: '20px'}}>
              {cart.length === 0 ? <p style={{color: '#64748b', textAlign: 'center', marginTop: '50px'}}>Your cart is empty.</p> : cart.map(item => (
                <div key={item.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#1e293b', padding:'15px', borderRadius:'12px', marginBottom:'10px', border: `1px solid ${item.color}44`}}>
                  <div><div style={{fontWeight:'bold'}}>{item.name}</div><div style={{fontSize:'12px', color: item.color}}>{item.price} RON</div></div>
                  <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}><div style={{display:'flex', gap:'10px', alignItems: 'center'}}><button onClick={()=>updateQty(item.id, -1)} style={{background: '#0f172a', border: 'none', color: 'white', width: '25px', height: '25px', borderRadius: '5px', cursor: 'pointer'}}>-</button><span style={{fontWeight: 'bold'}}>{item.qty}</span><button onClick={()=>updateQty(item.id, 1)} style={{background: '#0f172a', border: 'none', color: 'white', width: '25px', height: '25px', borderRadius: '5px', cursor: 'pointer'}}>+</button></div></div>
                </div>
              ))}
            </div>
            <div style={{marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #334155'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'24px', fontWeight:'bold', marginBottom:'20px'}}><span>TOTAL:</span> <span style={{color: '#22d3ee'}}>{total} RON</span></div>
              {logs.length > 0 && <div style={{background: '#000', padding: '15px', borderRadius: '12px', marginBottom: '20px', maxHeight: '150px', overflowY: 'auto', fontSize: '12px', color: '#4ade80', fontFamily: 'monospace'}}>{logs.map((l, i) => <div key={i} style={{marginBottom: '5px'}}>{l}</div>)}</div>}
              <button onClick={handleCheckout} disabled={cart.length===0 || status==="PROCESSING..."} style={{width: '100%', padding: '15px', background: cart.length===0 ? '#334155' : '#22d3ee', color: cart.length===0 ? '#94a3b8' : '#000', border: 'none', borderRadius: '10px', fontWeight: '900', cursor: cart.length===0 ? 'default' : 'pointer', transition: 'all 0.3s', opacity: status==="PROCESSING..." ? 0.7 : 1}}>{status === "PROCESSING..." ? "PROCESSING..." : "CHECKOUT SECURELY"}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;