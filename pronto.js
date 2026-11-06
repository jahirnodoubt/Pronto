import React, { useState } from 'react';

// ==========================================
// BASE DE DATOS FICTICIA (MULTI-MARCA Y MARKETPLACE)
// ==========================================
const KITCHENS_DATA = [
  {
    id: "kitchen-1",
    location: "Obarrio, Ciudad de Panamá",
    brands: [
      {
        id: "brand-1",
        name: "Burger Republic",
        slug: "burger-republic",
        whatsapp: "+50760000000",
        logo: "🍔",
        banner: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80",
        rating: 4.8,
        deliveryTime: "25-35 min",
        categories: ["Hamburguesas", "Acompañantes", "Bebidas"],
        products: [
          { id: "p1", brandId: "brand-1", brandName: "Burger Republic", category: "Hamburguesas", name: "Classic Cheddar", price: 8.50, desc: "Blend de carne 150g, queso cheddar y salsa secreta." },
          { id: "p2", brandId: "brand-1", brandName: "Burger Republic", category: "Hamburguesas", name: "Bacon Monster", price: 10.50, desc: "Doble carne, doble cheddar y crujiente tocino." },
          { id: "p3", brandId: "brand-1", brandName: "Burger Republic", category: "Acompañantes", name: "Papas Trufadas", price: 4.50, desc: "Papas fritas con aceite de trufa y parmesano." }
        ]
      },
      {
        id: "brand-2",
        name: "Taco Loco (Misma Cocina)",
        slug: "taco-loco",
        whatsapp: "+50760000000",
        logo: "🌮",
        banner: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80",
        rating: 4.7,
        deliveryTime: "25-35 min",
        categories: ["Tacos", "Entradas", "Bebidas"],
        products: [
          { id: "p4", brandId: "brand-2", brandName: "Taco Loco", category: "Tacos", name: "Tacos al Pastor (3 uds)", price: 7.99, desc: "Carne de cerdo marinada, piña, cilantro y cebolla." },
          { id: "p5", brandId: "brand-2", brandName: "Taco Loco", category: "Entradas", name: "Guacamole & Totopos", price: 5.00, desc: "Guacamole fresco con totopos artesanales." }
        ]
      }
    ]
  },
  {
    id: "kitchen-2",
    location: "San Francisco, Ciudad de Panamá",
    brands: [
      {
        id: "brand-3",
        name: "Sushi Wok Express",
        slug: "sushi-wok",
        whatsapp: "+50761111111",
        logo: "🍣",
        banner: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
        rating: 4.9,
        deliveryTime: "30-45 min",
        categories: ["Rolls", "Wok"],
        products: [
          { id: "p6", brandId: "brand-3", brandName: "Sushi Wok Express", category: "Rolls", name: "Roll Dinamita", price: 11.00, desc: "Salmón, queso crema y tope de kani especiado." }
        ]
      }
    ]
  }
];

export default function ProntoWebPrototype() {
  // Estado para simular vistas: 'marketplace' | 'store' | 'admin'
  const [currentView, setCurrentView] = useState('marketplace');
  const [selectedKitchen, setSelectedKitchen] = useState(KITCHENS_DATA[0]);
  const [activeBrandId, setActiveBrandId] = useState(KITCHENS_DATA[0].brands[0].id);
  const [selectedCategory, setSelectedCategory] = useState("Hamburguesas");
  
  // Estado del Carrito Multi-Marca
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);

  // Pedidos entrantes para el Panel del Comercio
  const [liveOrders, setLiveOrders] = useState([]);

  // Datos del Cliente
  const [form, setForm] = useState({ name: '', phone: '', address: '', paymentMethod: 'Yappy' });

  // Agregar al Carrito
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const totalCart = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  // Procesar Checkout
  const handleCheckout = (e) => {
    e.preventDefault();
    const orderCode = `PRONTO-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceUrl = `https://prontoapp.com/invoice/${orderCode}`;

    const newOrder = {
      orderCode,
      customer: form.name,
      phone: form.phone,
      address: form.address,
      payment: form.paymentMethod,
      items: [...cart],
      total: totalCart,
      status: 'PENDIENTE',
      createdAt: new Date().toLocaleTimeString()
    };

    // Notificar al Panel de Comercio
    setLiveOrders((prev) => [newOrder, ...prev]);

    // Mensaje para WhatsApp
    const itemsList = cart.map((i) => `• [${i.brandName}] ${i.qty}x ${i.name} ($${(i.price * i.qty).toFixed(2)})`).join('\n');
    const waText = `👋 *¡Nuevo Pedido Multi-Marca en Pronto App!*

📄 *Orden:* #${orderCode}
👤 *Cliente:* ${form.name}
📍 *Dirección:* ${form.address}
💳 *Pago:* ${form.paymentMethod}

📝 *Items:*
${itemsList}

💰 *Total a pagar:* $${totalCart.toFixed(2)}

 Factura Digital & Ubicación GPS:
${invoiceUrl}`;

    const mainBrand = selectedKitchen.brands[0];
    const waLink = `https://wa.me/${mainBrand.whatsapp.replace('+', '')}?text=${encodeURIComponent(waText)}`;

    setOrderSummary({ orderCode, waLink });
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col font-sans pb-24 shadow-2xl relative border-x">
      
      {/* BARRA SUPERIOR DE PRUEBAS / SWITCHER DE VISTAS */}
      <div className="bg-gray-900 text-white p-2 text-xs flex justify-between items-center sticky top-0 z-50">
        <span className="font-extrabold text-orange-400">PRONTO APP MVP</span>
        <div className="flex gap-1">
          <button 
            onClick={() => setCurrentView('marketplace')} 
            className={`px-2 py-1 rounded ${currentView === 'marketplace' ? 'bg-orange-500 font-bold' : 'bg-gray-800'}`}
          >
            Marketplace
          </button>
          <button 
            onClick={() => setCurrentView('store')} 
            className={`px-2 py-1 rounded ${currentView === 'store' ? 'bg-orange-500 font-bold' : 'bg-gray-800'}`}
          >
            Menú Eathh
          </button>
          <button 
            onClick={() => setCurrentView('admin')} 
            className={`px-2 py-1 rounded relative ${currentView === 'admin' ? 'bg-orange-500 font-bold' : 'bg-gray-800'}`}
          >
            Comercio
            {liveOrders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {liveOrders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================
          VISTA 1: MARKETPLACE ESTILO PEDIDOSYA
         ========================================================= */}
      {currentView === 'marketplace' && (
        <div className="p-4 space-y-4">
          {/* Header de Ubicación */}
          <div className="bg-white p-3 rounded-2xl border shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Entregar en</span>
              <p className="text-xs font-extrabold text-gray-800 flex items-center gap-1">📍 Obarrio, Ciudad de Panamá</p>
            </div>
            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">Cambiar</span>
          </div>

          <h2 className="font-extrabold text-gray-900 text-base">Restaurantes cerca de ti</h2>

          {/* Tarjetas de Restaurantes */}
          <div className="space-y-4">
            {KITCHENS_DATA.map((kitchen) => {
              const mainBrand = kitchen.brands[0];
              const isMultiBrand = kitchen.brands.length > 1;

              return (
                <div
                  key={kitchen.id}
                  onClick={() => {
                    setSelectedKitchen(kitchen);
                    setActiveBrandId(kitchen.brands[0].id);
                    setSelectedCategory(kitchen.brands[0].categories[0]);
                    setCurrentView('store');
                  }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="h-32 bg-gray-200 relative">
                    <img src={mainBrand.banner} alt={mainBrand.name} className="w-full h-full object-cover" />
                    {isMultiBrand && (
                      <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
                        ⚡ 2 Marcas en 1 Carrito
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1">
                          {mainBrand.name}
                        </h3>
                        <p className="text-xs text-gray-500">{kitchen.location}</p>
                      </div>
                      <span className="bg-gray-100 font-extrabold text-xs px-2 py-0.5 rounded-md text-gray-800">
                        ⭐ {mainBrand.rating}
                      </span>
                    </div>

                    {/* Si tiene varias marcas desde la misma cocina */}
                    {isMultiBrand && (
                      <div className="mt-2 pt-2 border-t flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400">Marcas disponibles:</span>
                        <div className="flex gap-1">
                          {kitchen.brands.map((b) => (
                            <span key={b.id} className="text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded-md font-bold">
                              {b.logo} {b.name.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          VISTA 2: MENÚ E-COMMERCE MULTI-MARCA (ESTILO ORDER EATHH)
         ========================================================= */}
      {currentView === 'store' && (
        <div>
          {/* Header del Comercio */}
          <div className="bg-white p-4 border-b sticky top-10 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-extrabold text-gray-900 text-base">{selectedKitchen.brands[0].name}</h1>
                <p className="text-[10px] text-emerald-600 font-bold">🟢 Cocina activa • Envíos directos</p>
              </div>
              <button onClick={() => setCurrentView('marketplace')} className="text-xs text-gray-400 underline font-semibold">
                Ver todos
              </button>
            </div>

            {/* Selector de Marcas (Si la cocina tiene varias marcas estilo Clau.io) */}
            {selectedKitchen.brands.length > 1 && (
              <div className="mt-3 bg-gray-100 p-1 rounded-xl flex gap-1">
                {selectedKitchen.brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => {
                      setActiveBrandId(brand.id);
                      setSelectedCategory(brand.categories[0]);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                      activeBrandId === brand.id ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    {brand.logo} {brand.name}
                  </button>
                ))}
              </div>
            )}

            {/* Categorías deslizables */}
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar py-1">
              {selectedKitchen.brands
                .find((b) => b.id === activeBrandId)
                ?.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      selectedCategory === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
            </div>
          </div>

          {/* Lista de Productos */}
          <div className="p-4 space-y-3">
            {selectedKitchen.brands
              .find((b) => b.id === activeBrandId)
              ?.products.filter((p) => p.category === selectedCategory)
              .map((product) => (
                <div key={product.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                  <div className="pr-3 flex-1">
                    <span className="text-[9px] font-extrabold text-orange-500 uppercase">{product.brandName}</span>
                    <h3 className="font-bold text-gray-900 text-sm">{product.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{product.desc}</p>
                    <span className="text-sm font-black text-gray-900 mt-1 block">${product.price.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-9 h-9 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl flex items-center justify-center text-lg active:scale-95 transition-transform"
                  >
                    +
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* =========================================================
          VISTA 3: PANEL DEL COMERCIO (SIMULACIÓN DE PEDIDOS EN VIVO)
         ========================================================= */}
      {currentView === 'admin' && (
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="font-bold text-gray-900 text-base">Panel del Local (KDS)</h2>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">En Línea</span>
          </div>

          {liveOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              <p>No hay pedidos pendientes.</p>
              <p className="mt-1">Realiza un pedido desde la vista del cliente para verlo aquí en tiempo real.</p>
            </div>
          ) : (
            liveOrders.map((ord) => (
              <div key={ord.orderCode} className="bg-white p-4 rounded-2xl border-2 border-orange-400 shadow-md space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-black text-gray-900">#{ord.orderCode}</span>
                  <span className="text-xs text-gray-400 font-semibold">{ord.createdAt}</span>
                </div>

                <div className="text-xs space-y-1">
                  <p><strong>Cliente:</strong> {ord.customer} ({ord.phone})</p>
                  <p><strong>Dirección:</strong> {ord.address}</p>
                  <p><strong>Método de pago:</strong> <span className="font-bold text-emerald-600">{ord.payment}</span></p>
                </div>

                <div className="bg-gray-50 p-2 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-gray-500 text-[10px] uppercase">Detalle del Pedido:</p>
                  {ord.items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>{it.qty}x {it.name}</span>
                      <span className="font-bold">${(it.price * it.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-1 font-extrabold flex justify-between text-gray-900">
                    <span>Total:</span>
                    <span>${ord.total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`🚀 Pedido #${ord.orderCode} confirmado. ¡Notificación enviada a la APK de motorizados más cercanos!`)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-3 rounded-xl text-xs shadow-md"
                >
                  Confirmar Pago y Solicitar Motorizado 🛵
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* =========================================================
          CARRITO FLOTANTE PERMANENTE (CUMPLE CON LA SELECCIÓN MULTI-MARCA)
         ========================================================= */}
      {cart.length > 0 && currentView !== 'admin' && !orderSummary && (
        <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4 z-40">
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl shadow-xl flex justify-between items-center font-bold text-sm transition-transform active:scale-95"
          >
            <span className="bg-orange-600 px-2.5 py-1 rounded-lg text-xs font-black">{totalItems} ítems</span>
            <span>Ver mi carrito multi-marca</span>
            <span>${totalCart.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* =========================================================
          MODAL DE CHECKOUT
         ========================================================= */}
      {isCheckoutOpen && !orderSummary && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900">Finalizar Pedido</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 font-bold">✕</button>
            </div>

            {/* Resumen de los ítems añadidos */}
            <div className="bg-gray-50 p-3 rounded-2xl space-y-2 border text-xs">
              <p className="font-bold text-gray-500 uppercase text-[10px]">Resumen de compra:</p>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.qty}x {item.name} <span className="text-[10px] text-orange-500 font-bold">({item.brandName})</span></span>
                  <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleCheckout} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-600 uppercase">Nombre Completo</label>
                <input
                  required
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  className="w-full p-3 border rounded-xl mt-1 bg-gray-50 focus:outline-orange-500"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-gray-600 uppercase">WhatsApp</label>
                <input
                  required
                  type="tel"
                  placeholder="Ej. +507 6000-0000"
                  className="w-full p-3 border rounded-xl mt-1 bg-gray-50 focus:outline-orange-500"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-gray-600 uppercase">Dirección de Entrega</label>
                <input
                  required
                  type="text"
                  placeholder="Ej. Obarrio, Calle 50, Apt 3B"
                  className="w-full p-3 border rounded-xl mt-1 bg-gray-50 focus:outline-orange-500"
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-gray-600 uppercase">Método de Pago</label>
                <select
                  className="w-full p-3 border rounded-xl mt-1 bg-gray-50 font-bold text-gray-800"
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                >
                  <option value="Yappy">Yappy</option>
                  <option value="Zelle">Zelle</option>
                  <option value="Efectivo">Efectivo contra entrega</option>
                  <option value="Transferencia">Transferencia Bancaria</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-4 rounded-xl shadow-lg mt-2 text-sm"
              >
                Confirmar Orden ($${totalCart.toFixed(2)})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          PANTALLA DE CONFIRMACIÓN Y BOTÓN DE WHATSAPP
         ========================================================= */}
      {orderSummary && (
        <div className="fixed inset-0 bg-white z-50 p-6 flex flex-col justify-center items-center text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-black">
            ✓
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">¡Pedido Enviado!</h2>
            <p className="text-xs text-gray-400 mt-1">Orden #{orderSummary.orderCode}</p>
          </div>

          <a
            href={orderSummary.waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs"
          >
            <span>💬 Enviar pedido por WhatsApp al comercio</span>
          </a>

          <button
            onClick={() => { setOrderSummary(null); setCart([]); setIsCheckoutOpen(false); setCurrentView('admin'); }}
            className="text-xs text-orange-500 font-bold underline"
          >
            Ver orden recibida en el Panel del Comercio →
          </button>
        </div>
      )}

    </div>
  );
}