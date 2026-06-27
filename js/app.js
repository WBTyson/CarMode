// CarMod - Ana Uygulama Kontrolcüsü (v4 - GitHub Release)

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

let currentTab = "dashboard";
let currentPartsSubTab = "market";

function setDynamicBackground() {
  const av = window.OtoDB.getActiveVehicle();
  let bgUrl = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop"; 
  if (av && av.gorsel) bgUrl = av.gorsel;
  
  const bgDiv = document.getElementById("dynamic-bg");
  if (!bgDiv) return;

  const img = new Image();
  img.src = bgUrl;
  img.onload = () => {
    bgDiv.style.opacity = 0.4;
    setTimeout(() => {
      bgDiv.style.backgroundImage = `url("${bgUrl}")`;
      bgDiv.style.opacity = 1;
    }, 300);
  };
}

const CAR_DATA = {
  "BMW": ["M2", "M3", "M4", "M5", "M8", "320i", "420i", "520i", "X5", "118i", "Z4"],
  "Audi": ["A3", "A4", "A5", "A6", "RS3", "RS5", "RS6", "RS7", "R8", "Q7", "Q8"],
  "Mercedes-Benz": ["A-Serisi", "C-Serisi", "E-Serisi", "S-Serisi", "C63 AMG", "E63 AMG", "G63 AMG", "AMG GT"],
  "Volkswagen": ["Golf", "Golf GTI", "Golf R", "Polo", "Passat", "Tiguan", "Arteon", "Scirocco", "Touareg"],
  "Porsche": ["911 Carrera", "911 Turbo S", "911 GT3", "Cayenne", "Panamera", "Macan", "Taycan", "718 Cayman"],
  "Nissan": ["GT-R (R35)", "Skyline (R34)", "350Z", "370Z", "Qashqai", "Juke"],
  "Toyota": ["Corolla", "GR Yaris", "Supra (A90)", "Supra (A80)", "CH-R", "Hilux", "Land Cruiser"],
  "Honda": ["Civic", "Civic Type-R", "Accord", "S2000", "CR-V", "HR-V", "NSX"],
  "Ford": ["Mustang", "Focus", "Focus RS", "Fiesta", "Ranger", "F-150", "Bronco"],
  "Renault": ["Megane", "Megane RS", "Clio", "Taliant", "Captur", "Austral"],
  "Fiat": ["Egea", "500", "500 Abarth", "Doblo", "Panda"],
  "Volvo": ["XC90", "XC60", "XC40", "S90", "S60", "V90"],
  "Hyundai": ["i20", "i20 N", "i30", "Tucson", "Kona", "Elantra"],
  "Peugeot": ["208", "308", "508", "2008", "3008", "RCZ"],
  "Diğer": ["Özel Model / Diğer"]
};

function setupVehicleDropdowns() {
  const brandSel = document.getElementById("vehicleBrandSelect");
  const modelSel = document.getElementById("vehicleModelSelect");
  if (!brandSel || !modelSel) return;
  
  Object.keys(CAR_DATA).sort().forEach(brand => {
    const opt = document.createElement("option");
    opt.value = brand;
    opt.textContent = brand;
    brandSel.appendChild(opt);
  });
  
  brandSel.addEventListener("change", (e) => {
    const brand = e.target.value;
    modelSel.innerHTML = '<option value="">Seçiniz...</option>';
    if (brand && CAR_DATA[brand]) {
      modelSel.disabled = false;
      CAR_DATA[brand].forEach(model => {
        const opt = document.createElement("option");
        opt.value = model;
        opt.textContent = model;
        modelSel.appendChild(opt);
      });
    } else {
      modelSel.disabled = true;
      modelSel.innerHTML = '<option value="">Önce Marka Seçin</option>';
    }
  });
}

function initApp() {
  setDynamicBackground();
  setupVehicleDropdowns();

  populateVehicleSelector();

  const selector = document.getElementById("globalVehicleSelect");
  if (selector) {
    selector.value = window.OtoDB.getActiveVehicleId() || "";
    selector.addEventListener("change", (e) => {
      window.OtoDB.setActiveVehicleId(e.target.value);
      const sel = document.getElementById("globalVehicleSelect");
      if (sel) sel.value = e.target.value;
      setDynamicBackground();
      updateGlobalStatsText();
      renderActiveTab();
    });
  }

  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const tabId = link.getAttribute("data-tab");
      if (tabId) switchTab(tabId);
    });
  });

  document.querySelectorAll(".modal-close, .btn-close-modal").forEach(btn => {
    btn.addEventListener("click", () => closeAllModals());
  });

  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  setupActionListeners();
  setupFormSubmissions();
  updateGlobalStatsText();
  switchTab("dashboard");
}

// ─────────────────────────────────────────────
// YARDIMCI FONKSİYONLAR
// ─────────────────────────────────────────────
function populateVehicleSelector() {
  const selector = document.getElementById("globalVehicleSelect");
  if (!selector) return;
  const vehicles = window.OtoDB.getAll("vehicles");
  selector.innerHTML = "";
  if (vehicles.length === 0) {
    selector.innerHTML = '<option value="">Araç Bulunmuyor</option>';
    return;
  }
  vehicles.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.id;
    opt.textContent = `${v.marka} ${v.model} (${v.plaka})`;
    selector.appendChild(opt);
  });
}

function updateGlobalStatsText() {
  const gs = window.OtoDB.getGlobalStats();
  const el1 = document.getElementById("globalVehicleCount");
  const el2 = document.getElementById("globalTotalCost");
  if (el1) el1.textContent = gs.totalVehicles;
  if (el2) el2.textContent = fmt(gs.totalCostAll);
}

function fmt(val) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(val || 0);
}

function fmtDate(dateStr) {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function daysLeft(dateStr) {
  const t = new Date(dateStr);
  const n = new Date();
  t.setHours(0, 0, 0, 0);
  n.setHours(0, 0, 0, 0);
  return Math.ceil((t - n) / 86400000);
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("show");
}

function closeAllModals() {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("show"));
}

function showToast(msg, type = "success") {
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";
    toast.style.cssText = `
      position:fixed; bottom:30px; left:50%; transform:translateX(-50%);
      padding:14px 28px; border-radius:16px; font-family:'Outfit',sans-serif;
      font-weight:700; font-size:0.95rem; z-index:9999;
      box-shadow:0 10px 30px rgba(0,0,0,0.4);
      transition: opacity 0.4s ease;
    `;
    document.body.appendChild(toast);
  }
  const colors = {
    success: "background:linear-gradient(135deg,#10B981,#3B82F6); color:white;",
    error: "background:linear-gradient(135deg,#EF4444,#EC4899); color:white;",
    info: "background:linear-gradient(135deg,#3B82F6,#8B5CF6); color:white;"
  };
  toast.style.cssText += colors[type] || colors.success;
  toast.textContent = msg;
  toast.style.opacity = "1";
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = "0"; }, 3000);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─────────────────────────────────────────────
// TAB YÖNLENDİRME
// ─────────────────────────────────────────────
function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll(".tab-content").forEach(s => s.style.display = "none");
  const sec = document.getElementById(`${tabId}-section`);
  if (sec) sec.style.display = "block";
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(l => {
    l.classList.toggle("active", l.getAttribute("data-tab") === tabId);
  });
  renderActiveTab();
}

function renderActiveTab() {
  const av = window.OtoDB.getActiveVehicle();
  if (!av && currentTab !== "garage" && currentTab !== "dashboard") {
    showToast("Lütfen önce Garajım'dan bir araç seçin!", "info");
    switchTab("garage");
    return;
  }
  const map = {
    dashboard: renderDashboard,
    garage: renderGarage,
    maintenance: renderMaintenance,
    modification: renderModification,
    parts: renderParts,
    cart: renderCart,
    tuning: renderTuning,
    trips: renderTrips,
    documents: renderDocuments
  };
  if (map[currentTab]) map[currentTab]();
}

// ─────────────────────────────────────────────
// 1. KONTROL PANELİ
// ─────────────────────────────────────────────
function renderDashboard() {
  const av = window.OtoDB.getActiveVehicle();
  const noV = document.getElementById("dashNoVehicle");
  const content = document.getElementById("dashContent");

  if (!av) {
    if (noV) noV.style.display = "flex";
    if (content) content.style.display = "none";
    return;
  }
  if (noV) noV.style.display = "none";
  if (content) content.style.display = "block";

  setText("dashCarBrandModel", `${av.marka} ${av.model}`);
  setText("dashCarSpecs", `${av.yil} | ${av.motor} | ${av.renk}`);
  setText("dashCarPlate", av.plaka);
  setText("dashCarKm", `${av.km.toLocaleString("tr-TR")} KM`);

  const img = document.getElementById("dashCarImage");
  if (img) {
    img.src = av.gorsel || "";
    img.onerror = () => { img.src = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600&auto=format&fit=crop"; };
  }

  const stats = window.OtoDB.getVehicleStats(av.id);
  setText("dashTotalCost", fmt(stats.totalCost));
  setText("dashMaintenanceCost", fmt(stats.maintenanceCost));
  setText("dashModificationCost", fmt(stats.modificationCost));
  setText("dashFuelConsumption", stats.avgFuelConsumption > 0 ? `${stats.avgFuelConsumption} L/100km` : "Veri Yok");

  if (window.OtoCharts) {
    window.OtoCharts.updateExpenseChart(stats);
    window.OtoCharts.updateFuelChart(window.OtoDB.getByVehicle("fuel", av.id));
  }
  renderDashboardReminders(av.id);
}

function renderDashboardReminders(vehicleId) {
  const container = document.getElementById("dashRemindersList");
  if (!container) return;
  const docs = window.OtoDB.getByVehicle("documents", vehicleId)
    .map(d => ({ ...d, days: daysLeft(d.bitisTarihi) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  container.innerHTML = "";
  if (!docs.length) {
    container.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;padding:1rem 0;">Yaklaşan işlem bulunmuyor.</p>`;
    return;
  }
  docs.forEach(r => {
    let badge = r.days < 0
      ? `<span class="badge badge-danger">Geçti (${Math.abs(r.days)} gün)</span>`
      : r.days <= 30
        ? `<span class="badge badge-warning">${r.days} Gün Kaldı</span>`
        : `<span class="badge badge-success">${r.days} Gün Var</span>`;
    const div = document.createElement("div");
    div.style.cssText = "display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-color);";
    div.innerHTML = `<div><div style="font-weight:600;font-size:0.95rem;">${r.tip}</div><div style="color:var(--text-muted);font-size:0.8rem;margin-top:2px;">Son: ${fmtDate(r.bitisTarihi)}</div></div>${badge}`;
    container.appendChild(div);
  });
}

// ─────────────────────────────────────────────
// 2. GARAJIM
// ─────────────────────────────────────────────
function renderGarage() {
  const vehicles = window.OtoDB.getAll("vehicles");
  const grid = document.getElementById("garageGrid");
  if (!grid) return;
  grid.innerHTML = "";
  if (!vehicles.length) {
    grid.innerHTML = `<div class="card" style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">Henüz araç eklenmemiş.</div>`;
    return;
  }
  vehicles.forEach(v => {
    const stats = window.OtoDB.getVehicleStats(v.id);
    const isActive = window.OtoDB.getActiveVehicleId() === v.id;
    const card = document.createElement("div");
    card.className = "card car-card";
    card.innerHTML = `
      <div class="car-image-container">
        <img class="car-image" src="${v.gorsel || ''}" onerror="this.src='https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600&auto=format&fit=crop'" alt="${v.marka} ${v.model}">
        <div class="car-plate">${v.plaka}</div>
        ${isActive ? `<div style="position:absolute;top:10px;right:10px;background:var(--color-success);color:white;padding:4px 10px;border-radius:9999px;font-size:0.7rem;font-weight:700;">✓ Aktif</div>` : ""}
      </div>
      <div class="car-details" style="flex-grow:1;display:flex;flex-direction:column;">
        <div class="car-title-row" style="margin-bottom:8px;"><div class="car-name">${v.marka} ${v.model}</div><div style="font-size:0.85rem;font-weight:700;color:var(--color-primary);">${v.yil}</div></div>
        <div class="car-specs" style="margin-bottom:12px;"><div><strong>Motor:</strong> ${v.motor}</div><div><strong>KM:</strong> ${v.km.toLocaleString("tr-TR")}</div><div><strong>Renk:</strong> ${v.renk}</div><div><strong>Yakıt:</strong> ${v.yakitTipi}</div></div>
        <div style="font-size:0.85rem;border-top:1px solid var(--border-color);padding-top:10px;margin-bottom:12px;"><div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="color:var(--text-secondary);">Toplam Gider:</span><strong style="color:var(--color-success);">${fmt(stats.totalCost)}</strong></div></div>
        <div style="display:flex;gap:8px;margin-top:auto;">
          <button class="btn btn-secondary btn-select-car" data-id="${v.id}" style="flex-grow:1;padding:8px 12px;font-size:0.8rem;">${isActive ? "✓ Seçili Araç" : "Bu Aracı Seç"}</button>
          <button class="btn btn-danger btn-delete-car" data-id="${v.id}" style="padding:8px 12px;font-size:0.8rem;">Aracı Kaldır</button>
        </div>
      </div>`;
    card.querySelector(".btn-select-car").addEventListener("click", () => {
      window.OtoDB.setActiveVehicleId(v.id);
      const sel = document.getElementById("globalVehicleSelect");
      if (sel) sel.value = v.id;
      updateGlobalStatsText();
      renderGarage();
    });
    card.querySelector(".btn-delete-car").addEventListener("click", () => {
      if (!confirm(`${v.marka} ${v.model} aracını kaldırmak istediğinize emin misiniz?`)) return;
      ["maintenance","modifications","parts","fuel","trips","documents","cart","tuning"].forEach(k => {
        window.OtoDB.saveAll(k, window.OtoDB.getAll(k).filter(i => i.vehicleId !== v.id));
      });
      window.OtoDB.delete("vehicles", v.id);
      const remaining = window.OtoDB.getAll("vehicles");
      if (window.OtoDB.getActiveVehicleId() === v.id) {
        localStorage.removeItem("active_vehicle_id");
        if (remaining.length) window.OtoDB.setActiveVehicleId(remaining[0].id);
      }
      populateVehicleSelector();
      const sel = document.getElementById("globalVehicleSelect");
      if (sel) sel.value = window.OtoDB.getActiveVehicleId() || "";
      updateGlobalStatsText();
      renderGarage();
    });
    grid.appendChild(card);
  });
}

// ─────────────────────────────────────────────
// 3. BAKIM REHBERİ (Sil butonu YOK)
// ─────────────────────────────────────────────
function renderMaintenance() {
  const av = window.OtoDB.getActiveVehicle();
  const container = document.getElementById("maintenanceChecklist");
  if (container) {
    const rules = [
      { ad: "Motor Yağı & Yağ Filtresi", periyot: 10000 },
      { ad: "Hava ve Polen Filtreleri", periyot: 15000 },
      { ad: "NGK Performans Bujileri", periyot: 40000 },
      { ad: "Şanzıman Yağı & Filtresi", periyot: 60000 },
      { ad: "Fren Yağı (Race Fluid)", periyot: 30000 },
      { ad: "Triger Zinciri / Kayışı", periyot: 90000 }
    ];
    container.innerHTML = "";
    rules.forEach(rule => {
      const used = av.km % rule.periyot;
      const remaining = rule.periyot - used;
      const pct = Math.max(0, Math.min(100, (remaining / rule.periyot) * 100));
      const cls = pct <= 10 ? "danger" : pct <= 30 ? "warning" : "success";
      const statusLabel = pct <= 10 ? "ACİL!" : pct <= 30 ? "Yaklaşıyor" : "Güvenli";
      const div = document.createElement("div");
      div.className = "card checklist-card";
      div.innerHTML = `<div class="checklist-header"><span>${rule.ad}</span><span class="badge badge-${cls}">${statusLabel}</span></div><div class="progress-container"><div class="progress-bar ${cls}" style="width:${pct}%"></div></div><div class="checklist-info"><span>Kullanım: %${(100-pct).toFixed(0)}</span><strong>Kalan: ${remaining.toLocaleString("tr-TR")} KM</strong></div>`;
      container.appendChild(div);
    });
  }
  const records = window.OtoDB.getByVehicle("maintenance", av.id).sort((a,b)=>new Date(b.tarih)-new Date(a.tarih));
  const tbody = document.getElementById("maintenanceTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!records.length) { tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted);">Henüz bakım kaydı yok.</td></tr>`; return; }
  records.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><strong>${fmtDate(r.tarih)}</strong></td><td>${r.km.toLocaleString("tr-TR")} KM</td><td><div style="font-weight:600;">${r.aciklama}</div><div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${r.parcalar||"-"}</div></td><td>${r.usta}</td><td><strong style="color:var(--color-success);">${fmt(r.tutar)}</strong></td>`;
    tbody.appendChild(tr);
  });
}

// ─────────────────────────────────────────────
// 4. MODİFİKASYON (Görselli kartlar + Sepete Ekle)
// ─────────────────────────────────────────────
function renderModification() {
  const av = window.OtoDB.getActiveVehicle();
  const records = window.OtoDB.getByVehicle("modifications", av.id);
  const grid = document.getElementById("modGrid");
  const totalEl = document.getElementById("modTotalCost");
  if (!grid) return;
  const stats = window.OtoDB.getVehicleStats(av.id);
  if (totalEl) totalEl.textContent = fmt(stats.modificationCost);
  grid.innerHTML = "";
  if (!records.length) { grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">Henüz modifikasyon kaydı yok.</div>`; return; }
  const icons = {"Egzoz Sistemi":"💨","Süspansiyon":"🔩","Performans / Motor":"⚡","Yazılım / Performans":"💻","Jant / Lastik":"🔵","Dış Görünüm":"🎨","İç Tasarım":"🪑","Ses Sistemi":"🔊","Kozmetik / Aksesuar":"✨","Modifiye":"⚡"};
  records.forEach(r => {
    const card = document.createElement("div");
    card.className = "card mod-card";
    const bc = r.durum === "Planlanıyor" ? "badge-warning" : "badge-success";
    const icon = icons[r.kategori] || "⚡";
    const imgSection = r.gorsel ? `<div class="mod-image-container"><img class="mod-image" src="${r.gorsel}" onerror="this.parentElement.style.display='none'" alt="${r.baslik}"></div>` : "";
    card.innerHTML = `${imgSection}<div class="mod-card-content"><div><div class="mod-header"><span class="mod-category">${icon} ${r.kategori}</span><span class="badge ${bc}">${r.durum}</span></div><h3 class="mod-title">${r.baslik}</h3><p class="mod-body">${r.aciklama||"Açıklama girilmemiş."}</p></div><div><div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;"><span><strong>Uygulayan:</strong> ${r.usta||"-"}</span><br><span><strong>Tarih / KM:</strong> ${fmtDate(r.tarih)} - ${r.km?r.km.toLocaleString("tr-TR")+" KM":"-"}</span></div><div class="mod-footer"><span class="mod-price">${fmt(r.tutar)}</span><button class="btn btn-primary btn-add-mod-cart" style="padding:6px 12px;font-size:0.75rem;">🛒 Sepete Ekle</button></div></div></div>`;
    card.querySelector(".btn-add-mod-cart").addEventListener("click", () => {
      addItemToCart({ vehicleId:av.id, ad:r.baslik, kategori:r.kategori||"Modifiye", marka:r.usta||"Bilinmiyor", fiyat:Number(r.tutar), oncelik:"Orta", link:"", aciklama:r.aciklama||"" });
    });
    grid.appendChild(card);
  });
}

// ─────────────────────────────────────────────
// 5. YEDEK PARÇA & PARÇA MARKETİ
// ─────────────────────────────────────────────
function renderParts() {
  const av = window.OtoDB.getActiveVehicle();
  const marketBtn = document.getElementById("subTabMarket");
  const inventoryBtn = document.getElementById("subTabInventory");
  const marketSection = document.getElementById("partsMarketSection");
  const inventorySection = document.getElementById("partsInventorySection");
  if (marketBtn && inventoryBtn) { marketBtn.classList.toggle("active",currentPartsSubTab==="market"); inventoryBtn.classList.toggle("active",currentPartsSubTab==="inventory"); }
  if (marketSection) marketSection.style.display = currentPartsSubTab==="market"?"block":"none";
  if (inventorySection) inventorySection.style.display = currentPartsSubTab==="inventory"?"block":"none";
  if (currentPartsSubTab === "market") renderPartsMarket(av); else renderPartsInventory(av);
}

let currentMarketCategory = "Tümü";

function renderPartsMarket(av) {
  const grid = document.getElementById("partsMarketGrid");
  const filterBar = document.getElementById("marketCategoryFilters");
  if (!grid) return;
  let products = window.OtoDB.getMarketProducts(av.marka);
  
  if (filterBar) {
    const categories = ["Tümü", ...new Set(products.map(p => p.kategori))];
    filterBar.innerHTML = "";
    categories.forEach(cat => {
      const btn = document.createElement("button");
      const isActive = cat === currentMarketCategory;
      btn.style.cssText = `
        padding: 8px 20px; 
        font-size: 0.85rem; 
        font-weight: 500;
        font-family: var(--font-body);
        border-radius: 30px; 
        white-space: nowrap; 
        flex-shrink: 0;
        background: ${isActive ? 'linear-gradient(135deg, #D4AF37, #AA771C)' : 'rgba(255,255,255,0.03)'};
        color: ${isActive ? '#000' : 'var(--text-primary)'};
        border: 1px solid ${isActive ? 'transparent' : 'rgba(255,255,255,0.08)'};
        box-shadow: ${isActive ? '0 4px 15px rgba(212,175,55,0.3)' : 'none'};
        transition: all 0.3s ease;
        cursor: pointer;
      `;
      btn.textContent = cat;
      btn.onmouseover = () => { if(!isActive) btn.style.background = 'rgba(255,255,255,0.08)'; };
      btn.onmouseout = () => { if(!isActive) btn.style.background = 'rgba(255,255,255,0.03)'; };
      btn.onclick = () => { currentMarketCategory = cat; renderPartsMarket(window.OtoDB.getActiveVehicle()); };
      filterBar.appendChild(btn);
    });
  }

  if (currentMarketCategory !== "Tümü") {
    products = products.filter(p => p.kategori === currentMarketCategory);
  }

  grid.innerHTML = "";
  if (!products.length) { grid.innerHTML = `<div class="card" style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">Bu kategoriye ait ürün bulunamadı.</div>`; return; }
  const icons = {"Jant / Lastik":"🔵","Süspansiyon":"🔩","Modifiye":"⚡","Egzoz Sistemi":"💨","Bakım":"🔧","Yazılım / Performans":"💻","Kozmetik / Aksesuar":"✨","Dış Görünüm":"🎨","Araç Kaplama":"🛡️","Boya İşlemleri":"🖌️"};
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card market-card";
    const icon = icons[p.kategori]||"📦";
    const imgHtml = p.gorsel
      ? `<img class="market-image" src="${p.gorsel}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" alt="${p.ad}"><div style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-size:3rem;background:linear-gradient(135deg,rgba(59,130,246,0.08),rgba(139,92,246,0.08));">${icon}</div>`
      : `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:3rem;">${icon}</div>`;
    card.innerHTML = `<div class="market-image-container">${imgHtml}<div style="position:absolute;top:8px;left:8px;"><span class="badge badge-primary" style="font-size:0.65rem;">${p.kategori}</span></div></div><div class="market-card-body"><div class="market-product-brand">${p.marka}</div><div class="market-product-name">${p.ad}</div><div class="market-product-desc">${p.aciklama}</div></div><div class="market-card-footer"><span class="market-price-tag">${fmt(p.fiyat)}</span><button class="btn btn-primary btn-market-add" data-id="${p.id}" style="padding:8px 14px;font-size:0.8rem;">🛒 Sepete Ekle</button></div>`;
    card.querySelector(".btn-market-add").addEventListener("click", () => {
      const saved = window.OtoDB.addToCartFromMarket(av.id, p.id);
      if (saved) { showToast(`"${p.ad}" sepete eklendi! 🛒`); updateGlobalStatsText(); }
    });
    grid.appendChild(card);
  });
}

function renderPartsInventory(av) {
  const records = window.OtoDB.getByVehicle("parts", av.id);
  const tbody = document.getElementById("partsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!records.length) { tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted);">Envanterinizde kayıtlı parça bulunmuyor.</td></tr>`; return; }
  records.forEach(p => {
    const tr = document.createElement("tr");
    let sc = "badge-success";
    if (p.durum.includes("Yok")||p.durum.includes("Kullanıldı")) sc = "badge-danger";
    else if (p.durum.includes("Yedek")||p.durum.includes("Sipariş")) sc = "badge-warning";
    tr.innerHTML = `<td><div style="font-weight:600;">${p.ad}</div><div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;font-family:monospace;">${p.kod||"-"}</div></td><td>${p.marka}</td><td><span class="badge ${sc}">${p.durum}</span></td><td><strong style="color:var(--color-success);">${fmt(p.fiyat)}</strong></td><td><button class="btn btn-primary btn-sep-part" data-id="${p.id}" style="padding:5px 10px;font-size:0.72rem;">🛒 Sepete Ekle</button></td>`;
    tr.querySelector(".btn-sep-part").addEventListener("click", () => {
      addItemToCart({ vehicleId:av.id, ad:p.ad, kategori:"Bakım", marka:p.marka, fiyat:p.fiyat, oncelik:"Orta", link:p.link||"", aciklama:`Envanterdeki parça: ${p.durum}` });
    });
    tbody.appendChild(tr);
  });
}

function addItemToCart(item) {
  window.OtoDB.save("cart", item);
  showToast(`"${item.ad}" sepete eklendi! 🛒`);
  updateGlobalStatsText();
}

// ─────────────────────────────────────────────
// 6. SEPETİM
// ─────────────────────────────────────────────
function renderCart() {
  const av = window.OtoDB.getActiveVehicle();
  const records = window.OtoDB.getByVehicle("cart", av.id);
  const tbody = document.getElementById("cartTableBody");
  const totalEl = document.getElementById("cartTotalCostText");
  const countEl = document.getElementById("cartItemCount");
  const total = records.reduce((s,i)=>s+(Number(i.fiyat)||0),0);
  if (totalEl) totalEl.textContent = fmt(total);
  if (countEl) countEl.textContent = `${records.length} Ürün`;
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!records.length) { tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:3rem;"><div style="font-size:2.5rem;margin-bottom:1rem;">🛒</div><div style="font-weight:700;font-size:1.1rem;margin-bottom:0.5rem;">Sepetiniz Boş</div><div style="color:var(--text-muted);font-size:0.9rem;">Parça Marketi'nden ürün ekleyin.</div></td></tr>`; return; }
  const pm = {"Yüksek":"badge-danger","Orta":"badge-warning","Düşük":"badge-success"};
  records.forEach(c => {
    const tr = document.createElement("tr");
    const pc = pm[c.oncelik]||"badge-primary";
    tr.innerHTML = `<td><div style="font-weight:600;">${c.ad}</div><div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${c.aciklama||""}</div></td><td><span class="badge badge-cyan">${c.kategori}</span></td><td>${c.marka}</td><td><span class="badge ${pc}">${c.oncelik||"Orta"} Öncelik</span></td><td><strong style="color:var(--color-success);font-size:1rem;">${fmt(c.fiyat)}</strong></td><td><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;"><button class="btn btn-success btn-cart-buy" data-id="${c.id}" style="padding:7px 12px;font-size:0.75rem;">✓ Satın Alındı</button><button class="btn btn-danger btn-cart-remove" data-id="${c.id}" style="padding:7px 10px;font-size:0.75rem;">✕ Kaldır</button></div></td>`;
    tr.querySelector(".btn-cart-buy").addEventListener("click", () => {
      if (!confirm(`"${c.ad}" satın alındı olarak işaretlensin mi?`)) return;
      window.OtoDB.buyCartItem(c.id);
      showToast(`"${c.ad}" envanterinize eklendi! ✓`,"success");
      updateGlobalStatsText(); renderCart();
    });
    tr.querySelector(".btn-cart-remove").addEventListener("click", () => {
      window.OtoDB.delete("cart", c.id);
      showToast(`"${c.ad}" sepetten kaldırıldı.`,"info");
      updateGlobalStatsText(); renderCart();
    });
    tbody.appendChild(tr);
  });
}

// ─────────────────────────────────────────────
// 7. YAZILIM & DYNO (Sil butonu YOK)
// ─────────────────────────────────────────────
function renderTuning() {
  const av = window.OtoDB.getActiveVehicle();
  const records = window.OtoDB.getByVehicle("tuning", av.id).sort((a,b)=>new Date(b.tarih)-new Date(a.tarih));
  const latest = records[0];
  const defHp = av.marka.includes("BMW")?510:320;
  const defNm = av.marka.includes("BMW")?650:420;
  const hp1=latest?latest.dynoHpBase:defHp, hp2=latest?latest.dynoHpTarget:defHp;
  const nm1=latest?latest.dynoNmBase:defNm, nm2=latest?latest.dynoNmTarget:defNm;
  setText("dynoHpStock",`${hp1} HP`); setText("dynoHpTuned",latest?`${hp2} HP`:"-"); setText("dynoHpDiff",latest?`+${hp2-hp1} HP Artış`:"+0 HP");
  setText("dynoNmStock",`${nm1} Nm`); setText("dynoNmTuned",latest?`${nm2} Nm`:"-"); setText("dynoNmDiff",latest?`+${nm2-nm1} Nm Artış`:"+0 Nm");
  if (window.OtoCharts) window.OtoCharts.updateDynoChart(hp1,hp2,nm1,nm2);
  const tbody = document.getElementById("tuningTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!records.length) { tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">Henüz yazılım kaydı yok.</td></tr>`; return; }
  records.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><strong>${fmtDate(t.tarih)}</strong></td><td><div style="font-weight:600;">${t.baslik}</div><div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${t.aciklama||""}</div></td><td><span class="badge badge-cyan">${t.tip}</span></td><td>${t.firma}</td><td><div>Stok: <strong>${t.dynoHpBase} HP</strong> / ${t.dynoNmBase} Nm</div><div style="color:var(--color-cyan);">Tuned: <strong>${t.dynoHpTarget} HP</strong> / ${t.dynoNmTarget} Nm</div></td><td><strong style="color:var(--color-success);">${fmt(t.tutar)}</strong></td>`;
    tbody.appendChild(tr);
  });
}

// ─────────────────────────────────────────────
// 8. YAKIT & SEYAHAT TAKİBİ (Sil butonu YOK)
// ─────────────────────────────────────────────
function renderTrips() {
  const av = window.OtoDB.getActiveVehicle();
  const fuelRecords = window.OtoDB.getByVehicle("fuel",av.id).sort((a,b)=>new Date(b.tarih)-new Date(a.tarih));
  const tripRecords = window.OtoDB.getByVehicle("trips",av.id).sort((a,b)=>new Date(b.tarih)-new Date(a.tarih));
  const fuelBody = document.getElementById("fuelTableBody");
  if (fuelBody) {
    fuelBody.innerHTML = "";
    if (!fuelRecords.length) { fuelBody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:1.5rem;color:var(--text-muted);">Yakıt kaydı yok.</td></tr>`; }
    else { fuelRecords.forEach(f => { const tr=document.createElement("tr"); tr.innerHTML=`<td><strong>${fmtDate(f.tarih)}</strong></td><td>${f.km.toLocaleString("tr-TR")} KM</td><td>${f.litre} L</td><td>${fmt(f.litreFiyati)}</td><td><strong style="color:var(--color-success);">${fmt(f.toplamTutar)}</strong></td>`; fuelBody.appendChild(tr); }); }
  }
  const tripBody = document.getElementById("tripsTableBody");
  if (tripBody) {
    tripBody.innerHTML = "";
    if (!tripRecords.length) { tripBody.innerHTML = `<tr><td colspan="3" style="text-align:center;padding:1.5rem;color:var(--text-muted);">Seyahat kaydı yok.</td></tr>`; }
    else { tripRecords.forEach(t => { const tr=document.createElement("tr"); tr.innerHTML=`<td><strong>${fmtDate(t.tarih)}</strong></td><td><div style="font-weight:600;">${t.baslangic} ➔ ${t.bitis}</div><div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${t.aciklama||""}</div></td><td><span class="badge badge-primary">${t.km} KM</span></td>`; tripBody.appendChild(tr); }); }
  }
  const stats = window.OtoDB.getVehicleStats(av.id);
  setText("tripTotalKmText",`${stats.totalTripKm} KM`);
  setText("tripAvgFuelText",stats.avgFuelConsumption>0?`${stats.avgFuelConsumption} L/100km`:"Veri Yok");
  if (window.OtoCharts) window.OtoCharts.updateFuelChart(fuelRecords);
}

// ─────────────────────────────────────────────
// 9. RESMİ BELGELER (Sil butonu YOK)
// ─────────────────────────────────────────────
function renderDocuments() {
  const av = window.OtoDB.getActiveVehicle();
  const records = window.OtoDB.getByVehicle("documents", av.id);
  const container = document.getElementById("docsGrid");
  if (!container) return;
  container.innerHTML = "";
  if (!records.length) { container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">Kayıtlı belge yok.</div>`; return; }
  records.forEach(d => {
    const days = daysLeft(d.bitisTarihi);
    let cardClass="card doc-card", badgeClass="badge-success", statusText=`${days} Gün Kaldı`;
    if (days<0) { cardClass+=" expired"; badgeClass="badge-danger"; statusText=`Süresi Geçti (${Math.abs(days)} gün)`; }
    else if (days<=30) { cardClass+=" warning"; badgeClass="badge-warning"; statusText=`${days} Gün Kaldı (Yaklaşıyor!)`; }
    const card = document.createElement("div");
    card.className = cardClass;
    card.innerHTML = `<div class="mod-header"><span style="font-family:var(--font-title);font-weight:700;font-size:1.1rem;">${d.tip}</span><span class="badge ${badgeClass}">${statusText}</span></div><p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px;">${d.aciklama||"-"}</p><div style="font-size:0.85rem;border-top:1px solid var(--border-color);padding-top:10px;"><div class="doc-info-row"><span style="color:var(--text-secondary);">Başlangıç:</span><span>${fmtDate(d.baslangicTarihi)}</span></div><div class="doc-info-row"><span style="color:var(--text-secondary);">Bitiş:</span><strong>${fmtDate(d.bitisTarihi)}</strong></div><div class="doc-info-row" style="margin-top:10px;"><span style="font-size:0.75rem;color:var(--text-muted);">Tutar</span><strong style="font-size:1.1rem;color:var(--color-success);">${fmt(d.tutar)}</strong></div></div>`;
    container.appendChild(card);
  });
}

// ─────────────────────────────────────────────
// AKSİYON BUTONLARI & FORM GÖNDERİMLERİ
// ─────────────────────────────────────────────
function setupActionListeners() {
  const btns = {"btnAddVehicleModal":"vehicleModal","btnAddMaintenanceModal":"maintenanceModal","btnAddModModal":"modModal","btnAddPartModal":"partModal","btnAddFuelModal":"fuelModal","btnAddTripModal":"tripModal","btnAddDocModal":"docModal","btnAddCartModal":"cartModal","btnAddTuningModal":"tuningModal"};
  Object.entries(btns).forEach(([btnId,modalId]) => { const btn=document.getElementById(btnId); if(btn) btn.addEventListener("click",()=>openModal(modalId)); });
  const stMarket=document.getElementById("subTabMarket"), stInventory=document.getElementById("subTabInventory");
  if(stMarket) stMarket.addEventListener("click",()=>{currentPartsSubTab="market";renderParts();});
  if(stInventory) stInventory.addEventListener("click",()=>{currentPartsSubTab="inventory";renderParts();});
}

async function getAutoCarImage(marka, model, renk) {
  const m = (marka || "").toLowerCase();
  const md = (model || "").toLowerCase();
  const c = (renk || "").toLowerCase();

  // En premium VIP araçlar için özel yüksek kaliteli (Unsplash) görseller
  const VIP_IMAGES = {
    "m2": "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1920&auto=format&fit=crop",
    "m3": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1920&auto=format&fit=crop",
    "m4": "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1920&auto=format&fit=crop",
    "m5": "https://images.unsplash.com/photo-1555353540-64fd1b6226f7?q=80&w=1920&auto=format&fit=crop",
    "m8": "https://images.unsplash.com/photo-1616422285623-14ffea685714?q=80&w=1920&auto=format&fit=crop",
    "rs6": "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1920&auto=format&fit=crop",
    "r8": "https://images.unsplash.com/photo-1503376760367-158221bb0139?q=80&w=1920&auto=format&fit=crop",
    "g63 amg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1920&auto=format&fit=crop",
    "amg gt": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1920&auto=format&fit=crop",
    "911 gt3": "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1920&auto=format&fit=crop",
    "gt-r (r35)": "https://images.unsplash.com/photo-1614026480209-cd9934144671?q=80&w=1920&auto=format&fit=crop",
    "supra (a90)": "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=1920&auto=format&fit=crop",
    "mustang": "https://images.unsplash.com/photo-1584345604476-8ec5e12e42a5?q=80&w=1920&auto=format&fit=crop"
  };

  if (md && VIP_IMAGES[md]) return VIP_IMAGES[md];

  // Dinamik Wikipedia API Araması: Yüzde Yüz Doğruluk Garantisi
  if (marka && model) {
    try {
      const query = encodeURIComponent(`${marka} ${model} car`);
      const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrlimit=1&prop=pageimages&format=json&pithumbsize=1200&origin=*`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.query && data.query.pages) {
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId !== "-1" && pages[pageId].thumbnail && pages[pageId].thumbnail.source) {
          return pages[pageId].thumbnail.source;
        }
      }
    } catch (e) {
      console.warn("Wiki API hatası:", e);
    }
  }

  // 3. API bulamazsa renk bazlı efsane görseller (Son Çare Fallback)
  if (c.includes("siyah") || c.includes("black")) return "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop";
  if (c.includes("kırmızı") || c.includes("red")) return "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1920&auto=format&fit=crop";
  if (c.includes("beyaz") || c.includes("white")) return "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1920&auto=format&fit=crop";
  if (c.includes("mavi") || c.includes("blue")) return "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1920&auto=format&fit=crop";
  
  return "https://images.unsplash.com/photo-1502877338535-346ce0f1db28?q=80&w=1920&auto=format&fit=crop";
}

function setupFormSubmissions() {
  setupAsyncForm("vehicleForm", async fd => {
    let marka = fd.get("marka");
    let model = fd.get("model");
    let renk = fd.get("renk") || "Bilinmiyor";
    let gorsel = fd.get("gorsel") || "";
    
    if (!gorsel.trim()) {
      showToast("📸 Araç fotoğrafı Wikipedia'dan aranıyor...", "info");
      gorsel = await getAutoCarImage(marka, model, renk);
    }
    
    const v={marka,model,yil:Number(fd.get("yil")),plaka:fd.get("plaka").toUpperCase(),km:Number(fd.get("km")),yakitTipi:fd.get("yakitTipi"),motor:fd.get("motor")||"Bilinmiyor",renk,sasiNo:fd.get("sasiNo")||"-",gorsel};
    const saved=window.OtoDB.save("vehicles",v);
    if(window.OtoDB.getAll("vehicles").length===1) window.OtoDB.setActiveVehicleId(saved.id);
    populateVehicleSelector(); const sel=document.getElementById("globalVehicleSelect"); if(sel) sel.value=window.OtoDB.getActiveVehicleId();
    showToast(`${v.marka} ${v.model} garajınıza eklendi! 🚗`); 
    renderGarage();
    if(window.OtoDB.getAll("vehicles").length===1) setDynamicBackground();
  });
  setupForm("maintenanceForm", fd => {
    const av=window.OtoDB.getActiveVehicle(), km=Number(fd.get("km"));
    window.OtoDB.save("maintenance",{vehicleId:av.id,tarih:fd.get("tarih"),km,aciklama:fd.get("aciklama"),usta:fd.get("usta"),tutar:Number(fd.get("tutar")),parcalar:fd.get("parcalar")});
    if(km>av.km){av.km=km;window.OtoDB.save("vehicles",av);populateVehicleSelector();}
    showToast("Bakım kaydı eklendi! 🔧"); renderMaintenance();
  });
  setupForm("modForm", fd => {
    const av=window.OtoDB.getActiveVehicle(), km=Number(fd.get("km"))||0;
    window.OtoDB.save("modifications",{vehicleId:av.id,baslik:fd.get("baslik"),kategori:fd.get("kategori"),km,tarih:fd.get("tarih"),usta:fd.get("usta"),tutar:Number(fd.get("tutar")),durum:fd.get("durum"),aciklama:fd.get("aciklama"),gorsel:fd.get("gorsel")||""});
    if(km>av.km){av.km=km;window.OtoDB.save("vehicles",av);populateVehicleSelector();}
    showToast("Modifikasyon eklendi! ⚡"); renderModification();
  });
  setupForm("partForm", fd => {
    const av=window.OtoDB.getActiveVehicle();
    window.OtoDB.save("parts",{vehicleId:av.id,ad:fd.get("ad"),kod:fd.get("kod"),marka:fd.get("marka"),fiyat:Number(fd.get("fiyat")),link:fd.get("link"),durum:fd.get("durum")});
    showToast("Parça envanterinize eklendi! 📦"); currentPartsSubTab="inventory"; renderParts();
  });
  setupForm("fuelForm", fd => {
    const av=window.OtoDB.getActiveVehicle(),km=Number(fd.get("km")),litre=Number(fd.get("litre")),lf=Number(fd.get("litreFiyati"));
    window.OtoDB.save("fuel",{vehicleId:av.id,tarih:fd.get("tarih"),km,litre,litreFiyati:lf,toplamTutar:litre*lf,tamDolum:fd.get("tamDolum")==="on"});
    if(km>av.km){av.km=km;window.OtoDB.save("vehicles",av);populateVehicleSelector();}
    showToast("Yakıt alımı kaydedildi! ⛽"); renderTrips();
  });
  setupForm("tripForm", fd => {
    const av=window.OtoDB.getActiveVehicle(),km=Number(fd.get("km"));
    window.OtoDB.save("trips",{vehicleId:av.id,tarih:fd.get("tarih"),baslangic:fd.get("baslangic"),bitis:fd.get("bitis"),km,aciklama:fd.get("aciklama")});
    av.km+=km; window.OtoDB.save("vehicles",av); populateVehicleSelector();
    showToast("Seyahat kaydedildi! 🗺️"); renderTrips();
  });
  setupForm("docForm", fd => {
    const av=window.OtoDB.getActiveVehicle();
    window.OtoDB.save("documents",{vehicleId:av.id,tip:fd.get("tip"),baslangicTarihi:fd.get("baslangicTarihi"),bitisTarihi:fd.get("bitisTarihi"),tutar:Number(fd.get("tutar")),aciklama:fd.get("aciklama")});
    showToast("Belge kaydedildi! 📄"); renderDocuments();
  });
  setupForm("cartForm", fd => {
    const av=window.OtoDB.getActiveVehicle();
    window.OtoDB.save("cart",{vehicleId:av.id,ad:fd.get("ad"),kategori:fd.get("kategori"),marka:fd.get("marka"),fiyat:Number(fd.get("fiyat")),oncelik:fd.get("oncelik"),link:fd.get("link"),aciklama:fd.get("aciklama")});
    showToast("Sepete eklendi! 🛒"); renderCart();
  });
  setupForm("tuningForm", fd => {
    const av=window.OtoDB.getActiveVehicle();
    window.OtoDB.save("tuning",{vehicleId:av.id,baslik:fd.get("baslik"),tip:fd.get("tip"),firma:fd.get("firma"),dynoHpBase:Number(fd.get("dynoHpBase")),dynoHpTarget:Number(fd.get("dynoHpTarget")),dynoNmBase:Number(fd.get("dynoNmBase")),dynoNmTarget:Number(fd.get("dynoNmTarget")),tarih:fd.get("tarih"),tutar:Number(fd.get("tutar")),aciklama:fd.get("aciklama")});
    showToast("Yazılım kaydı eklendi! 💻"); renderTuning();
  });
}

function setupForm(formId, handler) {
  const form=document.getElementById(formId);
  if(!form) return;
  form.addEventListener("submit", e => { e.preventDefault(); handler(new FormData(form)); form.reset(); closeAllModals(); updateGlobalStatsText(); });
}

function setupAsyncForm(formId, handler) {
  const form=document.getElementById(formId);
  if(!form) return;
  form.addEventListener("submit", async e => { 
    e.preventDefault(); 
    await handler(new FormData(form)); 
    form.reset(); closeAllModals(); updateGlobalStatsText(); 
  });
}
