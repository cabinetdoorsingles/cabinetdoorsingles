import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, ChevronDown, Calculator, 
  Menu, X as XIcon, Plus, Trash2, TrendingUp, CheckCircle2, ChevronRight,
  ArrowRight, Heart, X, Info, Layers, Flame, Package, ShieldCheck, Truck, Store, MailCheck,
  Ruler, Upload, FileDown
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dating App (Catalog) State
  const initialProfiles = [
    { id: 1, name: "Standard Base", age: 24, distance: "1 mile away", bio: "Perfect for your lower cabinets. I'm 15\" wide and 30\" tall. Classic Shaker style.", style: "shaker", width: '15', height: '30', cliche: 'fish' },
    { id: 2, name: "Upper Vanity", age: 36, distance: "3 miles away", bio: "Need something above the sink? I'm 18\" wide and 36\" tall. Elegant Raised Panel.", style: "raised", width: '18', height: '36', cliche: 'neon' },
    { id: 3, name: "Wide Drawer Front", age: 18, distance: "Just around the corner", bio: "Short, wide, and modern. 30\" wide and 10\" tall. Seamless Slab style.", style: "slab", width: '30', height: '10', cliche: 'gym' },
    { id: 4, name: "Tall Pantry", age: 60, distance: "5 miles away", bio: "I'm tall and imposing. 18\" wide and 60\" tall. Classic Shaker.", style: "shaker", width: '18', height: '60', cliche: 'travel' },
    { id: 5, name: "The Custom Catch", age: 99, distance: "Everywhere", bio: "Have specific needs? Swipe right on me and I'll take you straight to the custom calculator.", style: "shaker", width: '15', height: '30', isCustom: true, cliche: 'custom' }
  ];
  
  const [profiles, setProfiles] = useState(initialProfiles);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [matchCount, setMatchCount] = useState(0);

  // Quoter & Funnel state
  const [funnelStep, setFunnelStep] = useState(1);
  const [funnelData, setFunnelData] = useState({ layout: '', linearFeet: 30, material: '' });
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showCsvGuide, setShowCsvGuide] = useState(false);
  const [orderLines, setOrderLines] = useState([
    { id: 1, roomLabel: 'Standard Base', style: 'shaker', width: '15', height: '30', qty: 1, isCustomLabel: false },
  ]);
  const [globalOptions, setGlobalOptions] = useState({ sanding: true, boring: false, hinges: false });
  const [isProMember, setIsProMember] = useState(true);
  const [clientMarkup, setClientMarkup] = useState(30);
  
  // 3D Viewer Focus & Interaction State
  const [activeLineId, setActiveLineId] = useState(1);
  const [rotation, setRotation] = useState({ x: 5, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Checkout & Payment State
  const [shippingMethod, setShippingMethod] = useState('pickup');
  const [checkoutForm, setCheckoutForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', zip: ''
  });
  const [calculatedShippingCost, setCalculatedShippingCost] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const paypalContainerRef = useRef(null);

  const isProTheme = (currentView === 'quoter' && funnelStep === 4) || currentView === 'checkout';
  const isDarkTheme = currentView === 'catalog' || currentView === 'home';

  // Standard Labels for Dropdown
  const standardLabels = [
    "Standard Base", "Upper Vanity", "Wide Drawer Front", "Tall Pantry", "Custom"
  ];

  useEffect(() => {
    setRotation(prev => ({ ...prev, y: globalOptions.boring ? 180 : 0 }));
  }, [globalOptions.boring]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    setRotation(prev => ({ x: prev.x - deltaY * 0.6, y: prev.y + deltaX * 0.6 }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const navigateTo = (view, e) => {
    if (e) e.preventDefault();
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const nextProfile = () => {
    if (currentProfileIndex >= profiles.length - 2) {
      const doorStyles = ['shaker', 'raised', 'slab'];
      const names = ['Micro-Shaker', 'Beaded Panel', 'Modern Euro Slab', 'Craftsman Shaker', 'Ogee Raised', 'Minimalist Slab'];
      const bios = [
        "Slim, elegant, and modern. I have thin stiles but a strong core.",
        "A little extra detail never hurt anyone. I bring texture to the relationship.",
        "Sleek and uncomplicated. Let's make this seamless.",
        "I'm a hard worker with a sturdy build. Ready for a busy kitchen.",
        "I like the finer things in life. Lots of edges, lots of character.",
        "Zero drama. Completely flat and flawless. Take me home and paint me."
      ];
      
      const newProfiles = Array(3).fill(null).map((_, i) => {
        const w = Math.floor(Math.random() * 15) + 12; 
        const h = Math.floor(Math.random() * 30) + 15; 
        const baseBio = bios[Math.floor(Math.random() * bios.length)];
        
        return {
          id: Date.now() + i,
          name: names[Math.floor(Math.random() * names.length)],
          age: Math.floor(Math.random() * 30) + 18,
          distance: `${Math.floor(Math.random() * 15) + 1} miles away`,
          bio: `${baseBio} I am ${w}" wide and ${h}" tall.`,
          style: doorStyles[Math.floor(Math.random() * 3)],
          width: w.toString(),
          height: h.toString(),
          cliche: ['fish', 'neon', 'gym', 'travel'][Math.floor(Math.random() * 4)] // Assign random cliche
        };
      });
      
      setProfiles(prev => [...prev, ...newProfiles]);
    }
    setCurrentProfileIndex(prev => prev + 1);
  };

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    setTimeout(() => {
      const profile = profiles[currentProfileIndex];
      
      if (direction === 'right') {
        if (profile.isCustom) {
          handleMatchAction('quote', null, true);
        } else {
          setShowMatch(true);
        }
      } else {
        nextProfile();
      }
      setSwipeDirection(null);
    }, 400);
  };

  const handleMatchAction = (action, e, directToQuote = false) => {
    const profile = profiles[currentProfileIndex];
    
    setOrderLines(prevLines => {
      let currentLines = [...prevLines];
      if (matchCount === 0 && currentLines.length === 1 && currentLines[0].roomLabel === 'Standard Base') {
        currentLines = [];
      }
      
      const newId = currentLines.length > 0 ? Math.max(...currentLines.map(l => l.id)) + 1 : 1;
      const newLine = {
        id: newId,
        roomLabel: profile.isCustom ? 'Custom' : `${profile.name} (Match)`,
        style: profile.style,
        width: profile.width || '15',
        height: profile.height || '30',
        qty: 1,
        isCustomLabel: profile.isCustom
      };
      
      if (action === 'quote' || directToQuote) {
        setTimeout(() => setActiveLineId(newId), 0);
      }
      
      return [...currentLines, newLine];
    });

    setMatchCount(prev => prev + 1);
    setFunnelData(prev => ({...prev, layout: 'Custom Match Roster'}));
    
    if (action === 'quote' || directToQuote) {
      setShowMatch(false);
      navigateTo('quoter', e);
      setFunnelStep(4);
    } else {
      setShowMatch(false);
      nextProfile();
    }
  };

  const addLine = () => {
    const newId = orderLines.length > 0 ? Math.max(...orderLines.map(l => l.id)) + 1 : 1;
    setOrderLines([...orderLines, { id: newId, roomLabel: 'Standard Base', style: 'shaker', width: '15', height: '30', qty: 1, isCustomLabel: false }]);
    setActiveLineId(newId);
  };

  const updateLine = (id, field, value) => {
    setOrderLines(orderLines.map(line => {
      if (line.id === id) {
        // Handle switching to/from custom label
        if (field === 'roomLabel') {
          if (value === 'Custom') {
             return { ...line, roomLabel: '', isCustomLabel: true };
          } else if (standardLabels.includes(value)) {
             return { ...line, roomLabel: value, isCustomLabel: false };
          }
        }
        return { ...line, [field]: value };
      }
      return line;
    }));
  };

  const removeLine = (id) => {
    const newLines = orderLines.filter(line => line.id !== id);
    setOrderLines(newLines);
    if (activeLineId === id && newLines.length > 0) setActiveLineId(newLines[0].id);
  };
  
  const toggleOption = (option) => setGlobalOptions({ ...globalOptions, [option]: !globalOptions[option] });

  const activeLine = orderLines.find(l => l.id === activeLineId) || orderLines[0];

  // Pricing & Weight Math
  const basePricePerSqFt = 12.50;
  const sandingPricePerSqFt = globalOptions.sanding ? 2.50 : 0;
  const boringPricePerDoor = globalOptions.boring ? 3.50 : 0;
  const hingesPricePerDoor = globalOptions.hinges ? 8.00 : 0;
  const proDiscount = isProMember ? 0.30 : 0; 

  const calculations = orderLines.reduce((acc, line) => {
    const w = parseFloat(line.width) || 0;
    const h = parseFloat(line.height) || 0;
    const qty = parseInt(line.qty) || 0;
    
    let sqFtPerDoor = (w * h) / 144;
    if (sqFtPerDoor > 0 && sqFtPerDoor < 1) sqFtPerDoor = 1;
    
    const totalSqFt = sqFtPerDoor * qty;
    const doorBaseCost = totalSqFt * basePricePerSqFt;
    const sandingCost = totalSqFt * sandingPricePerSqFt;
    const hardwareCost = (boringPricePerDoor + hingesPricePerDoor) * qty;
    
    const lineRetail = doorBaseCost + sandingCost + hardwareCost;
    const lineWholesale = lineRetail * (1 - proDiscount);
    
    return {
      totalSqFt: acc.totalSqFt + totalSqFt,
      retailTotal: acc.retailTotal + lineRetail,
      wholesaleTotal: acc.wholesaleTotal + lineWholesale
    };
  }, { totalSqFt: 0, retailTotal: 0, wholesaleTotal: 0 });

  calculations.profit = (calculations.wholesaleTotal * (1 + (clientMarkup / 100))) - calculations.wholesaleTotal;
  calculations.clientPrice = calculations.wholesaleTotal + calculations.profit;
  
  const totalWeightLbs = calculations.totalSqFt * 3.5;

  // Shipping logic
  useEffect(() => {
    if (shippingMethod === 'pickup') { setCalculatedShippingCost(0); return; }
    if (shippingMethod === 'parcel') {
      const zip = checkoutForm.zip.trim();
      if (zip.length >= 5) {
        const firstDigit = parseInt(zip.charAt(0));
        let zoneMultiplier = 1.0;
        if (firstDigit >= 8) zoneMultiplier = 1.8; 
        else if (firstDigit >= 5 && firstDigit <= 7) zoneMultiplier = 1.4;
        else if (firstDigit === 3 || firstDigit === 4) zoneMultiplier = 1.1; 
        else zoneMultiplier = 1.3; 
        
        const baseBoxFee = 15.00; 
        const weightFee = totalWeightLbs * 0.85; 
        setCalculatedShippingCost((baseBoxFee + weightFee) * zoneMultiplier);
      } else {
        setCalculatedShippingCost(null); 
      }
    }
  }, [shippingMethod, checkoutForm.zip, totalWeightLbs]);

  const grandTotal = calculations.wholesaleTotal + (calculatedShippingCost || 0);

  // PayPal refs
  const grandTotalRef = useRef(grandTotal);
  const checkoutFormRef = useRef(checkoutForm);
  const shippingReadyRef = useRef(calculatedShippingCost !== null);
  
  useEffect(() => {
    grandTotalRef.current = grandTotal;
    checkoutFormRef.current = checkoutForm;
    shippingReadyRef.current = calculatedShippingCost !== null;
  }, [grandTotal, checkoutForm, calculatedShippingCost]);

  // Live PayPal Integration (No Environment Detector)
  useEffect(() => {
    if (currentView === 'checkout' && !paymentSuccess) {
      if (paypalContainerRef.current) paypalContainerRef.current.innerHTML = '';
      
      const renderPayPalButtons = () => {
        if (!window.paypal) return;
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            const form = checkoutFormRef.current;
            if (!form.name || !form.email || !form.phone) {
              alert("Please fill out your contact information before paying.");
              return null;
            }
            if (shippingMethod === 'parcel' && !shippingReadyRef.current) {
              alert("Please enter a valid ZIP code to calculate Shipping.");
              return null;
            }
            return actions.order.create({
              purchase_units: [{
                amount: { value: grandTotalRef.current.toFixed(2) },
                description: `CDS Order - ${form.name}`
              }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              setOrderId(details.id);
              setPaymentSuccess(true);
            });
          }
        }).render(paypalContainerRef.current);
      };

      if (!window.paypal) {
        const script = document.createElement('script');
        script.src = "https://www.paypal.com/sdk/js?client-id=Ad6MGdoeS4YyhAtC14EVdRGkfQ2e-o4nBMjXacQ7GtAaYaWW15hceM_Jt_HojsKR3-zFMcxNNkEQBUqg&currency=USD"; 
        script.async = true;
        script.onload = renderPayPalButtons;
        document.body.appendChild(script);
      } else {
        renderPayPalButtons();
      }
    }
  }, [currentView, paymentSuccess, shippingMethod]);

  const generateWorkOrderEmail = () => {
    const subject = `NEW WORK ORDER: ${orderId || 'PENDING'} - ${checkoutForm.name}`;
    let body = `✅ NEW ORDER RECEIVED\n\n--- CUSTOMER DETAILS ---\n`;
    body += `Name: ${checkoutForm.name}\nEmail: ${checkoutForm.email}\nPhone: ${checkoutForm.phone}\n\n`;
    body += `--- FULFILLMENT ---\n`;
    body += `Method: ${shippingMethod === 'parcel' ? 'Standard Parcel Delivery (UPS/FedEx)' : 'Local Shop Pickup'}\n`;
    body += `Total Weight: ${totalWeightLbs.toFixed(1)} lbs\n`;
    if (shippingMethod === 'parcel') {
      body += `Address: ${checkoutForm.address}, ${checkoutForm.city}, ${checkoutForm.state} ${checkoutForm.zip}\n`;
    }
    body += `\n--- GLOBAL ADD-ONS ---\n`;
    body += `220-Grit Sanding: ${globalOptions.sanding ? 'YES' : 'NO'}\n`;
    body += `Hinge Boring: ${globalOptions.boring ? 'YES' : 'NO'}\n`;
    body += `Premium Hinges: ${globalOptions.hinges ? 'YES' : 'NO'}\n`;
    body += `\n--- COMPONENT CUTLIST ---\n`;
    orderLines.forEach(line => {
      body += `[${line.qty}x] ${line.style.toUpperCase()} - ${line.width}" W x ${line.height}" H  (Room: ${line.roomLabel})\n`;
    });
    body += `\n--- FINANCIALS ---\n`;
    body += `Materials Total: $${calculations.wholesaleTotal.toFixed(2)}\n`;
    body += `Shipping Cost: $${(calculatedShippingCost || 0).toFixed(2)}\n`;
    body += `GRAND TOTAL PAID: $${grandTotal.toFixed(2)}\n`;
    window.location.href = `mailto:orders@yourshopdomain.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const render3DDoorFaces = (style, cliche) => {
    return (
      <>
        {/* Front Face */}
        <div className="absolute inset-0 bg-[#e3d1b5] border border-[#c3ac8c] shadow-lg rounded-sm overflow-hidden flex items-center justify-center backface-hidden z-10 pointer-events-none" style={{ transform: 'translateZ(10px)' }}>
            {style === 'shaker' && (
              <div className="absolute inset-3 border-[18px] border-[#d4bfa1] bg-[#e3d1b5] shadow-inner">
                <div className="w-full h-full border border-[#c3ac8c]/30 shadow-inner"></div>
              </div>
            )}
            {style === 'raised' && (
              <div className="absolute inset-3 border-[18px] border-[#d4bfa1] bg-[#e3d1b5] shadow-inner flex items-center justify-center">
                  <div className="absolute inset-2 bg-[#d4bfa1] shadow-md border border-[#c3ac8c]"></div>
              </div>
            )}
            {style === 'slab' && (
              <div className="absolute inset-0 opacity-40 bg-gradient-to-b from-white/40 to-transparent"></div>
            )}
        </div>
        
        {/* Back Face & Boring/Hinges */}
        <div className="absolute inset-0 bg-[#d4bfa1] border border-[#c3ac8c] rounded-sm backface-hidden flex flex-col justify-between py-8 items-end px-4 pointer-events-none" style={{ transform: 'translateZ(-10px) rotateY(180deg)' }}>
            {globalOptions.boring && (
              <>
                <div className="relative w-8 h-8 rounded-full bg-[#9e8361] shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)] border border-[#8a7051] flex items-center justify-center">
                  {globalOptions.hinges && (
                      <div className="absolute inset-[-1px] rounded-full bg-gradient-to-br from-slate-200 to-slate-400 shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-slate-400 flex items-center justify-center z-20">
                        {/* Top/Bottom Cup Flanges */}
                        <div className="absolute -top-1 w-10 h-3 bg-gradient-to-b from-slate-200 to-slate-300 border border-slate-400 rounded-t-md -z-10 flex justify-between px-1.5 items-start pt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shadow-inner"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shadow-inner"></div>
                        </div>
                        <div className="absolute -bottom-1 w-10 h-3 bg-gradient-to-t from-slate-200 to-slate-300 border border-slate-400 rounded-b-md -z-10 flex justify-between px-1.5 items-end pb-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shadow-inner"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shadow-inner"></div>
                        </div>
                        {/* Blum Soft Close Damper */}
                        <div className="w-4 h-5 bg-slate-600 rounded-[3px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border border-slate-700 flex flex-col justify-start items-center pt-0.5 relative z-10">
                            <div className="w-2 h-1 bg-slate-400 rounded-sm opacity-90"></div>
                            <div className="w-2 h-2 bg-slate-800 rounded-sm mt-0.5 shadow-inner"></div>
                        </div>
                        {/* Articulated Arm */}
                        <div className="absolute left-3.5 w-8 h-5 bg-gradient-to-r from-slate-300 via-slate-200 to-slate-400 shadow-md border-y border-slate-400 rounded-r-sm flex items-center justify-end z-20">
                            <div className="absolute left-1 w-1 h-full bg-slate-500/30 border-x border-slate-400/50"></div>
                            {/* Cruciform Mounting Plate */}
                            <div className="absolute -right-6 w-6 h-12 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 border border-slate-400 shadow-lg rounded-sm flex flex-col justify-between py-1.5 items-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400 shadow-inner flex items-center justify-center relative">
                                  <div className="w-1.5 h-[1px] bg-slate-500 absolute rotate-45"></div>
                                  <div className="w-[1px] h-1.5 bg-slate-500 absolute rotate-45"></div>
                              </div>
                              <div className="w-3.5 h-1.5 rounded-full bg-slate-600 shadow-inner"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400 shadow-inner flex items-center justify-center relative">
                                  <div className="w-1.5 h-[1px] bg-slate-500 absolute rotate-45"></div>
                                  <div className="w-[1px] h-1.5 bg-slate-500 absolute rotate-45"></div>
                              </div>
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[4px] text-slate-400/80 font-black tracking-widest">
                                blum
                              </div>
                            </div>
                        </div>
                      </div>
                  )}
                </div>
                
                <div className="relative w-8 h-8 rounded-full bg-[#9e8361] shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)] border border-[#8a7051] flex items-center justify-center">
                  {globalOptions.hinges && (
                      <div className="absolute inset-[-1px] rounded-full bg-gradient-to-br from-slate-200 to-slate-400 shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-slate-400 flex items-center justify-center z-20">
                        {/* Top/Bottom Cup Flanges */}
                        <div className="absolute -top-1 w-10 h-3 bg-gradient-to-b from-slate-200 to-slate-300 border border-slate-400 rounded-t-md -z-10 flex justify-between px-1.5 items-start pt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shadow-inner"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shadow-inner"></div>
                        </div>
                        <div className="absolute -bottom-1 w-10 h-3 bg-gradient-to-t from-slate-200 to-slate-300 border border-slate-400 rounded-b-md -z-10 flex justify-between px-1.5 items-end pb-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shadow-inner"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shadow-inner"></div>
                        </div>
                        {/* Blum Soft Close Damper */}
                        <div className="w-4 h-5 bg-slate-600 rounded-[3px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border border-slate-700 flex flex-col justify-start items-center pt-0.5 relative z-10">
                            <div className="w-2 h-1 bg-slate-400 rounded-sm opacity-90"></div>
                            <div className="w-2 h-2 bg-slate-800 rounded-sm mt-0.5 shadow-inner"></div>
                        </div>
                        {/* Articulated Arm */}
                        <div className="absolute left-3.5 w-8 h-5 bg-gradient-to-r from-slate-300 via-slate-200 to-slate-400 shadow-md border-y border-slate-400 rounded-r-sm flex items-center justify-end z-20">
                            <div className="absolute left-1 w-1 h-full bg-slate-500/30 border-x border-slate-400/50"></div>
                            {/* Cruciform Mounting Plate */}
                            <div className="absolute -right-6 w-6 h-12 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 border border-slate-400 shadow-lg rounded-sm flex flex-col justify-between py-1.5 items-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400 shadow-inner flex items-center justify-center relative">
                                  <div className="w-1.5 h-[1px] bg-slate-500 absolute rotate-45"></div>
                                  <div className="w-[1px] h-1.5 bg-slate-500 absolute rotate-45"></div>
                              </div>
                              <div className="w-3.5 h-1.5 rounded-full bg-slate-600 shadow-inner"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400 shadow-inner flex items-center justify-center relative">
                                  <div className="w-1.5 h-[1px] bg-slate-500 absolute rotate-45"></div>
                                  <div className="w-[1px] h-1.5 bg-slate-500 absolute rotate-45"></div>
                              </div>
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[4px] text-slate-400/80 font-black tracking-widest">
                                blum
                              </div>
                            </div>
                        </div>
                      </div>
                  )}
                </div>
              </>
            )}
        </div>
        
        {/* Thickness Edges */}
        <div className="absolute top-0 left-0 h-full w-[20px] bg-[#c3ac8c] pointer-events-none" style={{ transform: 'rotateY(-90deg) translateZ(10px)' }}></div>
        <div className="absolute top-0 right-0 h-full w-[20px] bg-[#c3ac8c] pointer-events-none" style={{ transform: 'rotateY(90deg) translateZ(10px)' }}></div>
        <div className="absolute top-0 left-0 w-full h-[20px] bg-[#ebdcc4] pointer-events-none" style={{ transform: 'rotateX(90deg) translateZ(10px)' }}></div>
        <div className="absolute bottom-0 left-0 w-full h-[20px] bg-[#c3ac8c] pointer-events-none" style={{ transform: 'rotateX(-90deg) translateZ(10px)' }}></div>
      
        {/* Swiper Cliché Overlay Accessories */}
        {cliche === 'fish' && (
          <>
            <div className="absolute top-[-30px] left-[50%] text-[60px] z-50 pointer-events-none drop-shadow-xl" style={{ transform: 'translateX(-50%) translateZ(20px) rotate(-10deg)' }}>🧢</div>
            <div className="absolute top-[20%] right-[-50px] text-[70px] z-50 pointer-events-none drop-shadow-2xl" style={{ transform: 'translateZ(40px) rotate(15deg)' }}>🎣</div>
            <div className="absolute top-[60%] right-[-40px] text-[50px] z-50 pointer-events-none drop-shadow-2xl" style={{ transform: 'translateZ(45px) rotate(-80deg)' }}>🐟</div>
          </>
        )}
        {cliche === 'neon' && (
           <div className="absolute bottom-[-10px] right-[-30px] text-7xl z-50 pointer-events-none drop-shadow-2xl" style={{ transform: 'translateZ(30px) rotate(15deg)' }}>🍸</div>
        )}
        {cliche === 'gym' && (
           <div className="absolute top-[10%] left-[-20px] text-[80px] z-50 pointer-events-none drop-shadow-2xl" style={{ transform: 'translateZ(35px) rotate(-20deg)' }}>💪</div>
        )}
        {cliche === 'travel' && (
          <>
           <div className="absolute top-[20%] right-[-30px] text-[60px] z-50 pointer-events-none drop-shadow-2xl" style={{ transform: 'translateZ(40px) rotate(15deg)' }}>📸</div>
           <div className="absolute bottom-[20%] left-[-20px] text-[60px] z-50 pointer-events-none drop-shadow-2xl" style={{ transform: 'translateZ(20px) rotate(-35deg)' }}>✈️</div>
          </>
        )}
        {cliche === 'custom' && (
          <>
            <div className="absolute top-[20%] right-[-30px] text-[70px] z-50 pointer-events-none drop-shadow-2xl" style={{ transform: 'translateZ(40px) rotate(15deg)' }}>📏</div>
            <div className="absolute bottom-[20%] left-[-20px] text-[60px] z-50 pointer-events-none drop-shadow-2xl" style={{ transform: 'translateZ(30px) rotate(-25deg)' }}>✏️</div>
            <div className="absolute top-[-20px] right-[20px] text-[50px] z-50 pointer-events-none drop-shadow-md" style={{ transform: 'translateZ(10px) rotate(5deg)' }}>✨</div>
          </>
        )}
      </>
    );
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-500 ${isDarkTheme ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <nav className={`border-b sticky top-0 z-50 shadow-sm transition-all duration-500 ${isDarkTheme ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={(e) => navigateTo('home', e)}>
              {isProTheme ? (
                <div className="bg-gradient-to-br from-rose-600 to-orange-500 p-2 rounded-xl shadow-md transition-all">
                  <Layers className="h-6 w-6 text-white" />
                </div>
              ) : (
                <div className="bg-gradient-to-br from-rose-500 to-orange-400 p-2 rounded-full shadow-md transition-all">
                  <Flame className="h-6 w-6 text-white" />
                </div>
              )}
              <span className={`font-black text-xl md:text-2xl tracking-tight transition-all duration-500 ${isProTheme ? 'text-slate-900' : (isDarkTheme ? 'text-white' : 'text-slate-900')}`}>
                {isProTheme ? 'CDS' : 'CabinetDoorSingles.com'}
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" onClick={(e) => navigateTo('home', e)} className={`font-bold transition-colors ${isProTheme ? 'text-slate-600 hover:text-slate-900' : (isDarkTheme ? 'text-slate-400 hover:text-rose-400' : 'text-slate-600 hover:text-rose-500')}`}>Home</a>
              <a href="#" onClick={(e) => navigateTo('catalog', e)} className={`font-bold transition-colors ${isProTheme ? 'text-slate-600 hover:text-slate-900' : (isDarkTheme ? 'text-slate-400 hover:text-rose-400' : 'text-slate-600 hover:text-rose-500')}`}>Browse Singles</a>
              <button 
                onClick={(e) => navigateTo('quoter', e)} 
                className={`relative text-white px-6 py-2.5 font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 ${
                  isProTheme 
                    ? 'bg-slate-900 hover:bg-slate-800 rounded-xl' 
                    : 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-full'
                }`}
              >
                Match & Quote
                {/* MATCH NOTIFICATION BADGE */}
                {matchCount > 0 && (
                  <span className={`absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-black shadow-lg border-2 animate-in zoom-in duration-300 ${isProTheme ? 'bg-rose-500 text-white border-slate-900' : 'bg-white text-rose-600 border-rose-500'}`}>
                    {matchCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex md:hidden items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={isDarkTheme ? "text-slate-300" : "text-slate-600"}>
                {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className={`md:hidden absolute w-full shadow-lg ${isDarkTheme ? 'bg-slate-900 border-t border-slate-800' : 'bg-white border-t border-slate-100'}`}>
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#" onClick={(e) => navigateTo('home', e)} className={`block px-4 py-3 rounded-xl font-bold ${isDarkTheme ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'}`}>Home</a>
              <a href="#" onClick={(e) => navigateTo('catalog', e)} className={`block px-4 py-3 rounded-xl font-bold ${isDarkTheme ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'}`}>Browse Singles</a>
              <a href="#" onClick={(e) => navigateTo('quoter', e)} className={`relative flex justify-between items-center px-4 py-3 rounded-xl font-bold ${isProTheme ? 'text-slate-900 bg-slate-100' : 'text-rose-600 bg-rose-50'}`}>
                Match & Quote
                {matchCount > 0 && (
                  <span className="bg-rose-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-black shadow-sm">
                    {matchCount}
                  </span>
                )}
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 flex flex-col relative">
        
        {/* HOME VIEW */}
        {currentView === 'home' && (
          <div className="animate-in fade-in duration-500 flex-1 flex flex-col justify-center pb-24">
            <div className="relative bg-gradient-to-br from-slate-950 via-rose-950 to-orange-950 text-white overflow-hidden py-32 flex flex-col items-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="flex justify-center mb-8">
                  <span className="bg-white/10 border border-white/20 backdrop-blur-md text-white rounded-full px-5 py-2 text-sm font-bold uppercase tracking-widest flex items-center shadow-lg">
                    <Flame className="w-4 h-4 mr-2 text-orange-400" /> 100% Free to Browse
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">
                  Hot, Single Doors <br/> in Your Area.
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-10 font-medium max-w-2xl mx-auto">
                  No Minimum Order Quantities. No strings attached. Find the perfect replacement door and get it shipped overnight.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button onClick={(e) => navigateTo('catalog', e)} className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-8 py-4 rounded-full font-black text-lg flex items-center justify-center transition-all shadow-xl hover:-translate-y-1">
                    Start Swiping <Flame className="ml-2 w-5 h-5 fill-white" />
                  </button>
                  <button onClick={(e) => navigateTo('quoter', e)} className="bg-white/10 border-2 border-white/30 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all">
                    I Already Know My Type
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-900 border-t border-slate-800 pt-20 pb-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-black text-white mb-4">Serious hardware for serious builders.</h2>
                  <p className="text-slate-400 text-lg">We might be a dating app, but we don't play games with your materials.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                    <Layers className="w-10 h-10 text-rose-500 mb-6" />
                    <h3 className="text-xl font-bold text-white mb-3">Architectural Grade MDF</h3>
                    <p className="text-slate-400">Available in standard and moisture-resistant (MR). CNC routed from a single slab for supreme durability and perfectly seamless paint joints that will never separate.</p>
                  </div>
                  <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                    <Package className="w-10 h-10 text-rose-500 mb-6" />
                    <h3 className="text-xl font-bold text-white mb-3">One Door or One Thousand</h3>
                    <p className="text-slate-400">Whether you are repairing a single bathroom vanity or building out a massive multi-unit apartment complex, we have zero minimums and infinite capacity.</p>
                  </div>
                  <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                    <ShieldCheck className="w-10 h-10 text-rose-500 mb-6" />
                    <h3 className="text-xl font-bold text-white mb-3">Job-Ready Fulfillment</h3>
                    <p className="text-slate-400">Add 220-grit orbital sanding, custom Blum hinge boring, and premium soft-close hardware to your quote. Everything arrives ready to install.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CATALOG (DATING APP) VIEW */}
        {currentView === 'catalog' && (
          <div className="py-12 max-w-md mx-auto px-4 flex-1 flex flex-col justify-center items-center w-full min-h-[80vh]">
            {!showMatch ? (
              <div className="w-full relative h-[600px] flex items-center justify-center">
                {profiles.map((profile, index) => {
                  if (index < currentProfileIndex) return null;
                  const isTop = index === currentProfileIndex;
                  
                  return (
                    <div 
                      key={profile.id}
                      className={`absolute w-full h-full bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden transition-all duration-300 ease-out flex flex-col
                        ${isTop ? 'z-20 scale-100 opacity-100' : 'z-10 scale-95 opacity-50 -translate-y-4'}
                        ${isTop && swipeDirection === 'left' ? '-translate-x-full rotate-[-20deg] opacity-0' : ''}
                        ${isTop && swipeDirection === 'right' ? 'translate-x-full rotate-[20deg] opacity-0' : ''}
                      `}
                    >
                      <div className="relative flex-1 overflow-hidden bg-slate-800">
                        
                        {/* Cliché Backgrounds - Hardcoded via inline styles for guaranteed delivery */}
                        {profile.cliche === 'neon' && <div className="absolute inset-0 bg-cover bg-center opacity-80 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542451313056-b7c8e6266459?q=80&w=1000')" }}></div>}
                        {profile.cliche === 'fish' && <div className="absolute inset-0 bg-cover bg-center opacity-80 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000')" }}></div>}
                        {profile.cliche === 'gym' && <div className="absolute inset-0 bg-cover bg-center opacity-80 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000')" }}></div>}
                        {profile.cliche === 'travel' && <div className="absolute inset-0 bg-cover bg-center opacity-80 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000')" }}></div>}
                        {profile.cliche === 'custom' && <div className="absolute inset-0 bg-cover bg-center opacity-60 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000')", filter: 'invert(1)' }}></div>}

                        {/* GLOBAL ADD-ONS OVERLAY */}
                        {isTop && (
                          <div className="absolute top-4 left-0 w-full flex justify-center gap-2 px-2 z-30">
                            <button onClick={() => toggleOption('sanding')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${globalOptions.sanding ? 'bg-rose-500 border-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-slate-900/60 border-slate-700 text-slate-300 backdrop-blur-md hover:bg-slate-800'}`}>
                              Sanding
                            </button>
                            <button onClick={() => toggleOption('boring')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${globalOptions.boring ? 'bg-rose-500 border-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-slate-900/60 border-slate-700 text-slate-300 backdrop-blur-md hover:bg-slate-800'}`}>
                              Boring
                            </button>
                            <button onClick={() => toggleOption('hinges')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${globalOptions.hinges ? 'bg-rose-500 border-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-slate-900/60 border-slate-700 text-slate-300 backdrop-blur-md hover:bg-slate-800'}`}>
                              Hinges
                            </button>
                          </div>
                        )}

                        <div 
                          className={`absolute inset-0 ${profile.cliche ? 'bg-slate-950/40' : 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-700 to-slate-950'} flex items-center justify-center pb-24 perspective-[1000px] select-none z-10 ${isTop && isDragging ? 'cursor-grabbing' : (isTop ? 'cursor-grab' : '')}`}
                          onMouseDown={isTop ? handleMouseDown : undefined}
                          onMouseMove={isTop ? handleMouseMove : undefined}
                          onMouseUp={isTop ? handleMouseUp : undefined}
                          onMouseLeave={isTop ? handleMouseUp : undefined}
                        >
                          <div className="absolute bottom-[140px] left-1/2 -translate-x-1/2 text-white/70 text-[10px] uppercase tracking-widest font-bold pointer-events-none z-20 text-center w-full drop-shadow-md">
                            {profile.isCustom ? 'Match to customize dimensions' : 'Drag to rotate 3D Profile'}
                          </div>

                          <div 
                            className={`relative preserve-3d ${(!isDragging && isTop) ? 'transition-all duration-500 ease-out' : ''}`}
                            style={{ 
                              width: '160px', 
                              height: `${(parseFloat(profile.height) / parseFloat(profile.width)) * 160}px`,
                              maxHeight: '260px',
                              transform: isTop ? `scale(${Math.min(1, 260 / ((parseFloat(profile.height) / parseFloat(profile.width)) * 160))}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` : `rotateX(5deg) rotateY(-5deg)`
                            }}
                          >
                             {render3DDoorFaces(profile.style, profile.cliche)}
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none z-20"></div>
                        
                        <div className="absolute bottom-0 w-full p-6 text-white pointer-events-none z-30">
                          <div className="flex items-center mb-1">
                            <h2 className="text-3xl font-black mr-2 drop-shadow-md">{profile.name}</h2>
                            <span className="text-2xl font-light drop-shadow-md">{profile.age}</span>
                            <CheckCircle2 className="w-6 h-6 text-blue-400 fill-blue-400 ml-2 drop-shadow-sm" />
                          </div>
                          
                          <div className="flex items-center text-slate-300 text-sm font-medium mb-3 flex-wrap gap-2">
                            <div className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                              Active Now • {profile.distance}
                            </div>
                            <span className="px-2 py-0.5 bg-white/20 rounded-md text-xs font-bold text-white border border-white/30 backdrop-blur-sm shadow-sm flex items-center">
                              <Ruler className="w-3 h-3 mr-1" /> {profile.width}" W x {profile.height}" H
                            </span>
                          </div>

                          <p className="text-slate-300 line-clamp-2 text-sm drop-shadow-md">{profile.bio}</p>
                        </div>
                      </div>
                      
                      {/* Swipe Controls */}
                      <div className="h-24 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-6 px-6 z-40">
                        <button onClick={() => handleSwipe('left')} className="w-14 h-14 rounded-full bg-slate-800 border-2 border-red-900/50 text-red-500 flex items-center justify-center shadow-sm hover:bg-red-900/30 hover:border-red-500 hover:scale-110 transition-all">
                          <X className="w-6 h-6" strokeWidth={3} />
                        </button>
                        <button onClick={() => handleSwipe('right')} className="w-14 h-14 rounded-full bg-slate-800 border-2 border-green-900/50 text-green-500 flex items-center justify-center shadow-sm hover:bg-green-900/30 hover:border-green-500 hover:scale-110 transition-all">
                          <Heart className="w-6 h-6 fill-green-500 text-green-500" strokeWidth={0} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // MATCH SCREEN UI
              <div className="w-full h-[600px] bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
                <Flame className="w-24 h-24 text-white mb-6 animate-bounce fill-white" />
                <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter">It's a Match!</h2>
                <p className="text-white/90 text-lg font-medium mb-6">
                  You and <span className="font-bold">{profiles[currentProfileIndex].name}</span> are a perfect fit. 
                </p>

                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 mb-10 w-full">
                   <p className="text-white font-bold">You have matched with {matchCount + 1} door{matchCount + 1 !== 1 ? 's' : ''} so far.</p>
                </div>

                <button 
                  onClick={(e) => handleMatchAction('quote', e)} 
                  className="w-full bg-white text-rose-600 py-4 rounded-full font-black text-xl mb-4 hover:bg-rose-50 transition-colors shadow-lg flex items-center justify-center"
                >
                  Review Matches & Checkout <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button 
                  onClick={(e) => handleMatchAction('swipe', e)}
                  className="text-white/80 font-bold hover:text-white transition-colors"
                >
                  Keep Swiping (Save to Roster)
                </button>
              </div>
            )}
          </div>
        )}

        {/* QUOTER ENGINE VIEW */}
        {currentView === 'quoter' && (
          <div className={`py-12 flex-1 w-full flex flex-col relative transition-colors duration-500 ${isProTheme ? 'bg-slate-50' : 'bg-rose-50'}`}>
            
            {funnelStep < 4 && (
              <div className="max-w-2xl mx-auto w-full px-4 mt-4">
                <div className="bg-white rounded-3xl shadow-xl border border-rose-200 p-8 md:p-12 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex space-x-3">
                      {[1, 2, 3].map(step => (
                        <div key={step} className={`w-12 h-2.5 rounded-full transition-colors duration-500 ${funnelStep >= step ? 'bg-rose-500' : 'bg-rose-100'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-black text-rose-300 tracking-wider">STEP {funnelStep}</span>
                  </div>

                  {funnelStep === 1 && (
                    <div className="animate-in slide-in-from-right-8 duration-500">
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight">What's your type?</h2>
                      <div className="grid gap-4">
                        {[
                          'One-Night Stand (Single Door)', 
                          'Long-Term Commitment (Full Kitchen)', 
                          'Friends With Benefits (Closets)', 
                          'Polyamorous (Multi-Unit)'
                        ].map(type => (
                          <button 
                            key={type}
                            onClick={() => { setFunnelData({...funnelData, layout: type}); setFunnelStep(2); }}
                            className="text-left px-6 py-5 rounded-2xl border-2 border-rose-100 hover:border-rose-500 hover:bg-rose-50 font-bold text-slate-700 hover:text-rose-700 text-lg transition-all shadow-sm flex items-center justify-between group"
                          >
                            {type}
                            <ChevronRight className="w-5 h-5 text-rose-300 group-hover:text-rose-500 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {funnelStep === 2 && (
                    <div className="animate-in slide-in-from-right-8 duration-500">
                      <div className="flex items-start justify-between mb-6">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Estimated linear footage?</h2>
                        <button 
                          onClick={() => setShowGuideModal(true)}
                          className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center transition-colors"
                        >
                          <Info className="w-4 h-4 mr-1" /> Guide
                        </button>
                      </div>
                      <p className="text-slate-500 mb-8 font-medium">This helps us apply the correct volume discounts to your profile.</p>
                      <div className="px-4 bg-rose-50 py-10 rounded-3xl border border-rose-200">
                        <input 
                          type="range" min="5" max="100" step="5"
                          value={funnelData.linearFeet}
                          onChange={(e) => setFunnelData({...funnelData, linearFeet: e.target.value})}
                          className="w-full h-4 bg-rose-200 rounded-full appearance-none cursor-pointer accent-rose-500"
                        />
                        <div className="text-center mt-8 text-5xl font-black text-rose-600">
                          {funnelData.linearFeet} <span className="text-2xl text-rose-400 font-bold">ft.</span>
                        </div>
                      </div>
                      <button onClick={() => setFunnelStep(3)} className="mt-8 w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-rose-500 transition-colors shadow-lg">
                        Continue
                      </button>
                    </div>
                  )}

                  {funnelStep === 3 && (
                    <div className="animate-in slide-in-from-right-8 duration-500">
                      <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Preferred Material?</h2>
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {['Standard MDF', 'Moisture Resistant (MR)'].map(mat => (
                          <button 
                            key={mat}
                            onClick={() => setFunnelData({...funnelData, material: mat})}
                            className={`px-4 py-8 rounded-2xl border-2 text-center font-bold transition-all ${funnelData.material === mat ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-md' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                          >
                            {mat}
                          </button>
                        ))}
                      </div>
                      <button 
                        disabled={!funnelData.material}
                        onClick={() => { setFunnelStep(4); if (orderLines.length === 0) addLine(); }} 
                        className="w-full bg-gradient-to-r from-rose-500 to-orange-500 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white py-5 rounded-2xl font-black text-xl hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg flex items-center justify-center group"
                      >
                        Generate Quote <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {funnelStep === 4 && (
              <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 animate-in zoom-in-95 duration-500 flex-1 flex flex-col">
                <div className="mb-6 flex flex-col md:flex-row justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Calculator</h2>
                    <p className="text-slate-500 font-medium">Layout: {funnelData.layout || 'Custom Match Roster'}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-3 flex-wrap">
                    
                    {/* CSV UPLOAD BUTTON */}
                    <button 
                      onClick={() => setShowCsvGuide(true)}
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center transition-colors border border-emerald-200"
                    >
                      <Upload className="w-4 h-4 mr-2" /> Upload CSV
                    </button>

                    {/* MEASURING GUIDE BUTTON */}
                    <button 
                      onClick={() => setShowGuideModal(true)}
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center transition-colors border border-blue-200"
                    >
                      <Ruler className="w-4 h-4 mr-2" /> How to Measure
                    </button>
                    
                    <div className="flex items-center bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                      <button 
                        onClick={() => setIsProMember(false)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${!isProMember ? 'bg-slate-100 shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Retail Pricing
                      </button>
                      <button 
                        onClick={() => setIsProMember(true)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center ${isProMember ? 'bg-slate-900 shadow-sm text-white' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Pro Trade Pricing
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6 flex-1 mb-12">
                  <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[400px] relative w-full">
                    <div className="absolute top-6 left-6 z-10 bg-black/40 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl border border-white/10 flex items-center shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse"></span>
                      Live Interactive 3D Preview
                    </div>
                    <div className="absolute top-6 right-6 z-10 text-white/40 text-sm font-bold uppercase tracking-widest pointer-events-none">
                      Drag to Rotate
                    </div>
                    
                    <div 
                      className={`flex-1 flex items-center justify-center p-8 perspective-[1000px] overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      {activeLine && (
                        <div 
                          className={`relative preserve-3d ${!isDragging ? 'transition-all duration-500 ease-out' : ''}`}
                          style={{ 
                            width: '180px', 
                            height: `${(parseFloat(activeLine.height) / parseFloat(activeLine.width)) * 180}px`,
                            maxHeight: '320px',
                            transform: `scale(${Math.min(1, 300 / ((parseFloat(activeLine.height) / parseFloat(activeLine.width)) * 180))}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                          }}
                        >
                          {render3DDoorFaces(activeLine.style, null)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-7/12 flex flex-col gap-6">
                      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                        <div className="bg-slate-50 p-6 border-b border-slate-200 flex flex-wrap gap-6 items-center">
                          <span className="font-black text-slate-800">Global Add-ons:</span>
                          <label className="flex items-center cursor-pointer group">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 mr-2 transition-colors ${globalOptions.sanding ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white'}`}>
                              {globalOptions.sanding && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={globalOptions.sanding} onChange={() => toggleOption('sanding')} />
                            <span className="text-slate-700 font-bold">220-Grit Prep (+$2.50/sqft)</span>
                          </label>
                          <label className="flex items-center cursor-pointer group">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 mr-2 transition-colors ${globalOptions.boring ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white'}`}>
                              {globalOptions.boring && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={globalOptions.boring} onChange={() => toggleOption('boring')} />
                            <span className="text-slate-700 font-bold">Hinge Boring (+$3.50/ea)</span>
                          </label>
                          <label className="flex items-center cursor-pointer group">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 mr-2 transition-colors ${globalOptions.hinges ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white'}`}>
                              {globalOptions.hinges && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={globalOptions.hinges} onChange={() => toggleOption('hinges')} />
                            <span className="text-slate-700 font-bold">Premium Hinges (+$8.00/ea)</span>
                          </label>
                        </div>

                        <div className="overflow-x-auto flex-1 min-h-[300px]">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-white border-b border-slate-200 text-slate-400 text-xs font-black uppercase tracking-wider">
                                <th className="p-5 w-[28%]">Label / Room</th>
                                <th className="p-5 w-[22%]">Style <Info className="inline w-3 h-3 ml-1 cursor-help" title="Shaker (5-piece), Raised (Classic), Slab (Flat)" /></th>
                                <th className="p-5 w-1/6">Width (in)</th>
                                <th className="p-5 w-1/6">Height (in)</th>
                                <th className="p-5 w-1/6">Qty</th>
                                <th className="p-5 w-12"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {orderLines.map((line) => (
                                <tr 
                                  key={line.id} 
                                  onClick={() => setActiveLineId(line.id)}
                                  className={`transition-colors cursor-pointer ${activeLineId === line.id ? 'bg-slate-50 border-l-4 border-slate-900' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                                >
                                  <td className="p-4 relative">
                                    {!line.isCustomLabel ? (
                                      <select 
                                        value={line.roomLabel}
                                        onChange={(e) => updateLine(line.id, 'roomLabel', e.target.value)}
                                        className={`w-full border rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-colors cursor-pointer ${activeLineId === line.id ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200'}`}
                                      >
                                        {standardLabels.map(label => (
                                          <option key={label} value={label}>{label}</option>
                                        ))}
                                      </select>
                                    ) : (
                                      <div className="flex items-center">
                                        <input 
                                          type="text" 
                                          placeholder="Type custom label..."
                                          value={line.roomLabel}
                                          onChange={(e) => updateLine(line.id, 'roomLabel', e.target.value)}
                                          className={`w-full border rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-colors ${activeLineId === line.id ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200'}`}
                                          autoFocus
                                        />
                                        <button 
                                          onClick={() => updateLine(line.id, 'roomLabel', 'Standard Base')} 
                                          className="absolute right-6 text-slate-400 hover:text-slate-700"
                                          title="Cancel Custom Label"
                                        >
                                          <XIcon className="w-4 h-4" />
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                  <td className="p-4">
                                    <select 
                                      value={line.style}
                                      onChange={(e) => updateLine(line.id, 'style', e.target.value)}
                                      className={`w-full border rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-colors cursor-pointer ${activeLineId === line.id ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200'}`}
                                    >
                                      <option value="shaker">Shaker</option>
                                      <option value="raised">Raised Panel</option>
                                      <option value="slab">Modern Slab</option>
                                    </select>
                                  </td>
                                  <td className="p-4">
                                    <input 
                                      type="number" min="5" step="0.125"
                                      value={line.width}
                                      onChange={(e) => updateLine(line.id, 'width', e.target.value)}
                                      className={`w-full border rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-colors ${activeLineId === line.id ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                  </td>
                                  <td className="p-4">
                                    <input 
                                      type="number" min="5" step="0.125"
                                      value={line.height}
                                      onChange={(e) => updateLine(line.id, 'height', e.target.value)}
                                      className={`w-full border rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-colors ${activeLineId === line.id ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                  </td>
                                  <td className="p-4">
                                    <input 
                                      type="number" min="1"
                                      value={line.qty}
                                      onChange={(e) => updateLine(line.id, 'qty', e.target.value)}
                                      className={`w-full border rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-colors ${activeLineId === line.id ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                  </td>
                                  <td className="p-4 text-center">
                                    <button onClick={(e) => { e.stopPropagation(); removeLine(line.id); }} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="p-4 border-t border-slate-200 bg-white">
                          <button onClick={addLine} className="flex items-center text-slate-700 font-black hover:text-slate-900 px-4 py-2 rounded-xl transition-colors bg-slate-50 hover:bg-slate-100">
                            <Plus className="w-5 h-5 mr-1" strokeWidth={3} /> Add Item
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-5/12 flex flex-col gap-6">
                      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex-1 flex flex-col h-full">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                          <h3 className="text-xl font-black text-slate-900 flex items-center"><TrendingUp className="w-6 h-6 mr-2 text-slate-900" /> Proposal Engine</h3>
                          <div className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md border border-blue-200">
                            Est. {totalWeightLbs.toFixed(0)} lbs
                          </div>
                        </div>
                        
                        <div className="p-6 space-y-4 flex-1">
                          <div className="flex justify-between items-center text-slate-600 font-medium">
                            <span>Total Material</span>
                            <span className="font-mono text-slate-900">{calculations.totalSqFt.toFixed(1)} sqft</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-600 font-medium">
                            <span>Wholesale Base</span>
                            <span className="font-mono text-xl text-slate-900 font-black">${calculations.wholesaleTotal.toFixed(2)}</span>
                          </div>
                          
                          <div className="pt-6 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-slate-800 font-bold">Apply Client Markup</span>
                              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-sm font-black">{clientMarkup}%</span>
                            </div>
                            <input 
                              type="range" min="0" max="100" step="5"
                              value={clientMarkup} 
                              onChange={(e) => setClientMarkup(parseInt(e.target.value))}
                              className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900"
                            />
                            <div className="flex justify-between items-center mt-4 text-sm font-bold">
                              <span className="text-slate-500">Your Profit:</span>
                              <span className="text-emerald-500 font-mono">+${calculations.profit.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100">
                          <div className="flex justify-between items-end mb-6">
                            <div>
                              <span className="block text-slate-500 text-xs uppercase tracking-widest font-black mb-1">Retail Proposal Total</span>
                              <span className="text-4xl font-black text-slate-900">${calculations.clientPrice.toFixed(2)}</span>
                            </div>
                          </div>
                          <button onClick={(e) => navigateTo('checkout', e)} className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white py-5 rounded-xl font-black text-xl transition-all shadow-lg hover:-translate-y-1 transform">
                            Save Quote & Checkout
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECURE CHECKOUT VIEW */}
        {currentView === 'checkout' && (
          <div className="py-12 bg-slate-50 animate-in fade-in duration-500 w-full flex-1">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {!paymentSuccess ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Secure Checkout</h2>
                    <p className="text-slate-500 font-medium mt-1">Review your order and provide fulfillment details.</p>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-3/5 space-y-6">
                      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                        <h3 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4">1. Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name / Company Name</label>
                            <input type="text" value={checkoutForm.name} onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-900 outline-none transition-colors" placeholder="John Doe Construction" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                            <input type="email" value={checkoutForm.email} onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-900 outline-none transition-colors" placeholder="john@example.com" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
                            <input type="tel" value={checkoutForm.phone} onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-900 outline-none transition-colors" placeholder="(555) 123-4567" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                          <h3 className="text-xl font-black text-slate-900">2. Fulfillment Method</h3>
                          <span className="bg-slate-100 text-slate-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center">
                            <Package className="w-4 h-4 mr-1.5 text-slate-500" /> Weight: {totalWeightLbs.toFixed(0)} lbs
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <button 
                            onClick={() => setShippingMethod('pickup')}
                            className={`p-5 rounded-2xl border-2 text-left flex flex-col items-start transition-all ${shippingMethod === 'pickup' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                          >
                            <div className="flex items-center justify-between w-full mb-2">
                              <span className={`font-black ${shippingMethod === 'pickup' ? 'text-slate-900' : 'text-slate-700'}`}>Local Pickup</span>
                              <Store className={`w-5 h-5 ${shippingMethod === 'pickup' ? 'text-slate-900' : 'text-slate-400'}`} />
                            </div>
                            <span className="text-sm font-black text-emerald-600">FREE</span>
                            <span className="text-xs text-slate-500 font-medium mt-1.5">Pick up directly from our manufacturing facility.</span>
                          </button>
                          
                          <button 
                            onClick={() => setShippingMethod('parcel')}
                            className={`p-5 rounded-2xl border-2 text-left flex flex-col items-start transition-all ${shippingMethod === 'parcel' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                          >
                            <div className="flex items-center justify-between w-full mb-2">
                              <span className={`font-black ${shippingMethod === 'parcel' ? 'text-slate-900' : 'text-slate-700'}`}>Standard Parcel</span>
                              <Truck className={`w-5 h-5 ${shippingMethod === 'parcel' ? 'text-slate-900' : 'text-slate-400'}`} />
                            </div>
                            <span className="text-sm font-black text-slate-800">
                              {calculatedShippingCost ? `$${calculatedShippingCost.toFixed(2)} Calculated` : 'Calculated at checkout'}
                            </span>
                            <span className="text-xs text-slate-500 font-medium mt-1.5">Securely boxed and shipped via UPS/FedEx Ground.</span>
                          </button>
                        </div>

                        {shippingMethod === 'parcel' && (
                          <div className="animate-in slide-in-from-top-4 grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">Street Address</label>
                              <input type="text" value={checkoutForm.address} onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-900 outline-none transition-colors" placeholder="123 Job Site Lane" />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">City</label>
                              <input type="text" value={checkoutForm.city} onChange={e => setCheckoutForm({...checkoutForm, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-900 outline-none transition-colors" placeholder="Atlanta" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">State</label>
                                <input type="text" value={checkoutForm.state} onChange={e => setCheckoutForm({...checkoutForm, state: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-900 outline-none transition-colors" placeholder="GA" />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Zip Code</label>
                                <input 
                                  type="text" 
                                  maxLength={5}
                                  value={checkoutForm.zip} 
                                  onChange={e => setCheckoutForm({...checkoutForm, zip: e.target.value})} 
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-900 outline-none transition-colors font-mono" 
                                  placeholder="30301" 
                                />
                              </div>
                            </div>
                            {!calculatedShippingCost && checkoutForm.zip.length < 5 && (
                              <div className="md:col-span-2 mt-2 bg-amber-50 text-amber-700 border border-amber-200 p-3 rounded-xl text-sm font-bold flex items-center">
                                <Info className="w-4 h-4 mr-2" /> Please enter a valid 5-digit ZIP code to calculate your parcel rate.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:w-2/5">
                      <div className="bg-slate-900 rounded-3xl shadow-xl p-8 sticky top-24 border border-slate-800">
                        <h3 className="text-xl font-black text-white border-b border-slate-800 pb-5 mb-5">Order Summary</h3>
                        
                        <div className="space-y-4 mb-8">
                          <div className="flex justify-between text-slate-400 font-medium">
                            <span>Material Subtotal</span>
                            <span className="text-white">${calculations.wholesaleTotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-slate-400 font-medium">
                            <span>Shipping ({shippingMethod === 'parcel' ? 'Parcel' : 'Pickup'})</span>
                            {shippingMethod === 'parcel' ? (
                              calculatedShippingCost ? (
                                <span className="text-white">${calculatedShippingCost.toFixed(2)}</span>
                              ) : (
                                <span className="text-amber-400 italic text-sm">Pending ZIP Code</span>
                              )
                            ) : (
                              <span className="text-emerald-400 font-bold">FREE</span>
                            )}
                          </div>
                          <div className="pt-6 border-t border-slate-800 flex justify-between text-white font-black text-3xl">
                            <span>Total</span>
                            <span>${grandTotal.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl shadow-inner min-h-[160px] flex flex-col justify-center relative items-center">
                          <div id="paypal-button-container" ref={paypalContainerRef} className={`w-full z-10 transition-opacity ${shippingMethod === 'parcel' && !calculatedShippingCost ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}></div>
                          
                          {!window.paypal && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold text-sm z-0">
                              Loading Secure Checkout...
                            </div>
                          )}
                          {window.paypal && shippingMethod === 'parcel' && !calculatedShippingCost && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-bold text-sm z-20 text-center px-4 backdrop-blur-[2px] bg-white/50 rounded-2xl">
                              Calculate shipping to enable payment
                            </div>
                          )}
                        </div>
                        
                        <p className="text-center text-slate-500 text-xs mt-5 flex items-center justify-center font-bold tracking-wide">
                          <ShieldCheck className="w-4 h-4 mr-1.5" /> PAYMENTS SECURELY PROCESSED
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-10 md:p-14 text-center animate-in zoom-in duration-500 border border-slate-200">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Payment Successful!</h2>
                  <p className="text-slate-600 text-lg mb-8 font-medium">Thank you, {checkoutForm.name.split(' ')[0]}. Your order has been securely processed.</p>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 text-left shadow-sm">
                    <p className="text-sm text-slate-500 font-black uppercase tracking-wider mb-2">Order Reference Number</p>
                    <p className="text-3xl font-mono font-black text-slate-900">{orderId || 'ORD-99812A'}</p>
                  </div>

                  <div className="border-t border-slate-200 pt-8 mt-8">
                    <h3 className="text-xl font-black text-slate-900 mb-3 flex items-center justify-center">
                      <Package className="w-6 h-6 mr-2 text-slate-900" /> Finalize Your Order
                    </h3>
                    <p className="text-slate-600 mb-8 font-medium">
                      Click the button below to automatically generate and send your official cutlist Work Order directly to our manufacturing floor.
                    </p>
                    <button 
                      onClick={generateWorkOrderEmail}
                      className="w-full bg-slate-900 hover:bg-rose-600 text-white py-5 rounded-2xl font-black text-xl transition-all flex justify-center items-center shadow-lg hover:-translate-y-1 transform"
                    >
                      <MailCheck className="w-6 h-6 mr-3" /> Send Work Order to Shop
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      <footer className={`py-12 border-t mt-auto transition-colors duration-500 ${isDarkTheme ? 'bg-slate-950 border-slate-900 text-slate-500' : 'bg-white border-slate-200 text-slate-500'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            {isProTheme ? (
               <div className="bg-gradient-to-br from-rose-600 to-orange-500 p-1.5 rounded-lg shadow-sm">
                 <Layers className="h-5 w-5 text-white" />
               </div>
            ) : (
               <Flame className="h-6 w-6 text-rose-500 transition-colors" />
            )}
            <span className={`font-black text-xl tracking-tight transition-all duration-500 ${isProTheme ? 'text-slate-900' : (isDarkTheme ? 'text-white' : 'text-slate-900')}`}>
              {isProTheme ? 'CDS' : 'CabinetDoorSingles.com'}
            </span>
          </div>
          <p className="text-sm font-medium">
            © 2026 CDS Platform. 100% Free to browse. Pro trade discounts apply.
          </p>
        </div>
      </footer>

      {/* CSV UPLOAD GUIDE MODAL */}
      {showCsvGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50">
              <h2 className="text-2xl font-black text-emerald-900 flex items-center">
                <Upload className="w-6 h-6 mr-3 text-emerald-600" />
                Bulk CSV Upload
              </h2>
              <button onClick={() => setShowCsvGuide(false)} className="text-emerald-700 hover:text-emerald-900 transition-colors p-2 bg-white rounded-full border border-emerald-200 hover:bg-emerald-100">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8">
              <p className="text-slate-600 mb-6 font-medium">
                Have a massive cutlist? Don't type it by hand. Upload a standard CSV file (from Excel or Google Sheets) and we'll instantly generate your quote.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Required CSV Format</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600">
                      <tr>
                        <th className="p-3">Room_Label</th>
                        <th className="p-3">Style</th>
                        <th className="p-3">Width</th>
                        <th className="p-3">Height</th>
                        <th className="p-3">Qty</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-600 font-mono">
                      <tr className="border-b border-slate-100">
                        <td className="p-3">Master Bath</td>
                        <td className="p-3">shaker</td>
                        <td className="p-3">18.5</td>
                        <td className="p-3">36</td>
                        <td className="p-3">2</td>
                      </tr>
                      <tr>
                        <td className="p-3">Kitchen Upper</td>
                        <td className="p-3">raised</td>
                        <td className="p-3">24</td>
                        <td className="p-3">42.25</td>
                        <td className="p-3">4</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 mt-4 font-medium italic">
                  * Note: "Style" must be exactly 'shaker', 'raised', or 'slab'. Dimensions must be decimals (e.g., use 18.5 instead of 18 1/2).
                </p>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 py-4 rounded-xl font-bold transition-all flex items-center justify-center">
                  <FileDown className="w-5 h-5 mr-2" /> Download Template
                </button>
                <button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center shadow-md relative overflow-hidden group"
                >
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".csv" />
                  <Upload className="w-5 h-5 mr-2" /> Select CSV File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEASURING GUIDE MODAL */}
      {showGuideModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-blue-50">
              <h2 className="text-2xl font-black text-blue-900 flex items-center">
                <Ruler className="w-6 h-6 mr-3 text-blue-600" />
                How to Measure Cabinet Doors
              </h2>
              <button onClick={() => setShowGuideModal(false)} className="text-blue-700 hover:text-blue-900 transition-colors p-2 bg-white rounded-full border border-blue-200 hover:bg-blue-100">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8 flex items-center justify-between border border-slate-800 shadow-lg">
                <div>
                  <h3 className="text-lg font-black text-rose-400 mb-1 uppercase tracking-widest">The Golden Rule</h3>
                  <p className="text-slate-300 font-medium text-lg">
                    Always format your measurements as <strong className="text-white">Width x Height</strong>. Measure to the nearest <strong className="text-white">1/16th of an inch</strong>.
                  </p>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                   <span className="text-sm font-bold text-slate-400 mb-1">Example</span>
                   <span className="font-mono text-2xl font-black text-white">18.5" <span className="text-slate-500">x</span> 36"</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* OVERLAY EXPLANATION */}
                <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 flex flex-col items-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 w-full text-center">Overlay Doors (Standard)</h3>
                  <p className="text-slate-500 text-sm font-medium text-center mb-8 h-10">The door sits *on top* of the cabinet frame opening, overlapping the edges.</p>
                  
                  {/* CSS Diagram of OVERLAY */}
                  <div className="relative w-48 h-56 border-[16px] border-[#8a7051] bg-slate-900 flex items-center justify-center rounded-sm transition-transform group-hover:scale-105">
                    <span className="text-slate-600 font-bold text-sm z-0 text-center leading-tight">Empty<br/>Cabinet<br/>Opening</span>
                    
                    {/* The "Door" outline overlaying the opening */}
                    <div className="absolute w-[calc(100%+32px)] h-[calc(100%+32px)] border-4 border-dashed border-blue-500 bg-blue-500/20 z-10 flex flex-col items-center justify-center backdrop-blur-[1px] transition-all">
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">Door overlaps frame</span>
                    </div>

                    {/* Width measurement line */}
                    <div className="absolute -top-10 w-[calc(100%+32px)] h-4 border-x-2 border-slate-400 flex items-center justify-center">
                       <div className="w-full h-[2px] bg-slate-400"></div>
                       <span className="absolute bg-slate-50 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-300">Width</span>
                    </div>

                    {/* Height measurement line */}
                    <div className="absolute -left-12 h-[calc(100%+32px)] w-4 border-y-2 border-slate-400 flex items-center justify-center">
                       <div className="h-full w-[2px] bg-slate-400"></div>
                       <span className="absolute bg-slate-50 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-300 -rotate-90 whitespace-nowrap">Height</span>
                    </div>
                  </div>

                  <div className="mt-12 bg-white border border-slate-200 p-4 rounded-xl w-full">
                    <span className="text-xs font-black uppercase text-slate-400 block mb-2">How to calculate:</span>
                    <p className="text-sm font-bold text-slate-700">1. Measure the opening exactly.</p>
                    <p className="text-sm font-bold text-slate-700">2. Add your desired overlay (e.g., 1/2" overlay on all sides = Add 1" to total Width and 1" to total Height).</p>
                  </div>
                </div>

                {/* INSET EXPLANATION */}
                <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 flex flex-col items-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 w-full text-center">Inset Doors (Custom)</h3>
                  <p className="text-slate-500 text-sm font-medium text-center mb-8 h-10">The door sits *inside* the cabinet frame, flush with the face.</p>
                  
                  {/* CSS Diagram of INSET */}
                  <div className="relative w-48 h-56 border-[16px] border-[#8a7051] bg-slate-900 flex items-center justify-center rounded-sm transition-transform group-hover:scale-105">
                    
                    {/* The "Door" outline sitting INSIDE the opening */}
                    <div className="absolute w-[calc(100%-8px)] h-[calc(100%-8px)] border-4 border-dashed border-emerald-500 bg-emerald-500/20 z-10 flex flex-col items-center justify-center backdrop-blur-[1px] transition-all">
                      <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm text-center leading-tight">Door fits<br/>inside gap</span>
                    </div>

                     {/* Width measurement line */}
                    <div className="absolute -top-10 w-full h-4 border-x-2 border-slate-400 flex items-center justify-center">
                       <div className="w-full h-[2px] bg-slate-400"></div>
                       <span className="absolute bg-slate-50 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-300">Width</span>
                    </div>

                    {/* Height measurement line */}
                    <div className="absolute -left-12 h-full w-4 border-y-2 border-slate-400 flex items-center justify-center">
                       <div className="h-full w-[2px] bg-slate-400"></div>
                       <span className="absolute bg-slate-50 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-300 -rotate-90 whitespace-nowrap">Height</span>
                    </div>
                  </div>

                  <div className="mt-12 bg-white border border-slate-200 p-4 rounded-xl w-full">
                    <span className="text-xs font-black uppercase text-slate-400 block mb-2">How to calculate:</span>
                    <p className="text-sm font-bold text-slate-700">1. Measure the opening exactly.</p>
                    <p className="text-sm font-bold text-slate-700">2. Subtract 1/8" from Width and Height (This leaves a perfect 1/16" reveal gap on all 4 sides).</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-start bg-slate-50 p-6 rounded-2xl">
                <div className="bg-white p-3 rounded-full border border-slate-200 shadow-sm mr-4 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-[#9e8361] shadow-inner border border-[#8a7051] flex items-center justify-center">
                     <div className="w-3 h-2 bg-slate-400 rounded-sm"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Hinge Boring Specifications</h3>
                  <p className="text-sm text-slate-600 mb-3">If you select our <strong>Hinge Boring</strong> add-on, we precisely CNC drill standard 35mm cup holes for European concealed hinges (like the Blum soft-close hinges we offer).</p>
                  <ul className="text-sm text-slate-700 space-y-2 font-medium">
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Doors under 40" tall receive <strong>2 hinge holes</strong>.</li>
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Doors 40" - 60" tall receive <strong>3 hinge holes</strong>.</li>
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Holes are centered 3" from top/bottom edges with a standard 3mm setback.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => setShowGuideModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-md"
              >
                Got It, Let's Quote
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}} />
    </div>
  );
}