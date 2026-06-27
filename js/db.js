// CarMod - LocalStorage Veritabanı ve Sabit Veriler

const DEFAULT_VEHICLES = [
  {
    id: "v-1",
    marka: "BMW",
    model: "M4 Competition",
    yil: 2022,
    plaka: "34 OTO 99",
    km: 28450,
    yakitTipi: "Benzin",
    motor: "3.0L Twin-Turbo L6",
    renk: "Yarı Mat Bavyera Mavisi",
    sasiNo: "WBA43XX290X123456",
    gorsel: "file:///C:/Users/PC/.gemini/antigravity/brain/430e99df-77f9-4411-992c-a785d7bb427a/bmw_m4_1782564147144.png"
  },
  {
    id: "v-2",
    marka: "Volkswagen",
    model: "Golf R",
    yil: 2021,
    plaka: "06 GOL 55",
    km: 42100,
    yakitTipi: "Benzin",
    motor: "2.0L TSI AWD",
    renk: "Lapiz Mavi",
    sasiNo: "WVWZZZCDZMW123456",
    gorsel: "file:///C:/Users/PC/.gemini/antigravity/brain/430e99df-77f9-4411-992c-a785d7bb427a/vw_golf_r_1782564163428.png"
  }
];

const DEFAULT_MAINTENANCE = [
  { id: "m-1", vehicleId: "v-1", tarih: "2023-11-15", km: 25000, aciklama: "Periyodik Bakım", usta: "Borusan Oto", tutar: 12500, parcalar: "Motor Yağı, Yağ Filtresi, Hava Filtresi" },
  { id: "m-2", vehicleId: "v-1", tarih: "2024-03-10", km: 28000, aciklama: "Fren Disk ve Balata Değişimi", usta: "M-Power Garage", tutar: 35000, parcalar: "Ön Fren Diskleri, M Performance Balata" },
  { id: "m-3", vehicleId: "v-2", tarih: "2023-09-20", km: 38000, aciklama: "DSG Şanzıman Yağı Değişimi", usta: "Doğuş Oto", tutar: 8500, parcalar: "DSG Yağı, Filtre" }
];

const DEFAULT_MODIFICATIONS = [
  { id: "mod-1", vehicleId: "v-1", baslik: "Akrapovič Titanyum Egzoz", kategori: "Egzoz Sistemi", km: 26000, tarih: "2023-12-01", usta: "Egzosçu Ahmet", tutar: 168000, durum: "Tamamlandı", aciklama: "Komple titanyum egzoz sistemi takıldı.", gorsel: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=400&auto=format&fit=crop" },
  { id: "mod-2", vehicleId: "v-1", baslik: "KW V3 Coilover", kategori: "Süspansiyon", km: 26500, tarih: "2023-12-15", usta: "Suspension Plus", tutar: 84000, durum: "Tamamlandı", aciklama: "Yükseklik ve sertlik ayarlı coilover kiti.", gorsel: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400&auto=format&fit=crop" },
  { id: "mod-3", vehicleId: "v-1", baslik: "M Performance Karbon Splitter", kategori: "Dış Görünüm", km: 27000, tarih: "2024-01-10", usta: "Aero Dynamics", tutar: 28000, durum: "Tamamlandı", aciklama: "Ön karbon splitter montajı.", gorsel: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=400&auto=format&fit=crop" },
  { id: "mod-4", vehicleId: "v-2", baslik: "H&R Spor Helezon Yay", kategori: "Süspansiyon", km: 40000, tarih: "2023-10-05", usta: "VW Tuning", tutar: 14500, durum: "Tamamlandı", aciklama: "25mm alçaltma sağlayan spor yay takıldı.", gorsel: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400&auto=format&fit=crop" },
  { id: "mod-5", vehicleId: "v-2", baslik: "Wagner Intercooler", kategori: "Modifiye", km: 41000, tarih: "2023-11-20", usta: "Boost Garage", tutar: 38000, durum: "Tamamlandı", aciklama: "Gen.2 Competition intercooler kiti.", gorsel: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop" },
  { id: "mod-6", vehicleId: "v-2", baslik: "BBS Jant Takımı", kategori: "Jant / Lastik", km: 41500, tarih: "2023-12-05", usta: "Wheel Center", tutar: 125000, durum: "Tamamlandı", aciklama: "BBS CH-R II 19 inç jant takımı.", gorsel: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400&auto=format&fit=crop" }
];

const DEFAULT_PARTS = [
  { id: "p-1", vehicleId: "v-1", ad: "NGK Laser Iridium Soğuk Buji", kod: "SILZKBR8D8S", marka: "NGK", fiyat: 4600, link: "", durum: "Yedek" },
  { id: "p-2", vehicleId: "v-2", ad: "Motul 300V Power 5W-40", kod: "300V-5W40", marka: "Motul", fiyat: 3800, link: "", durum: "Kullanıldı" }
];

const DEFAULT_FUEL = [
  { id: "f-1", vehicleId: "v-1", tarih: "2024-03-01", km: 28000, litre: 50, litreFiyati: 45.5, toplamTutar: 2275, tamDolum: true },
  { id: "f-2", vehicleId: "v-1", tarih: "2024-03-15", km: 28300, litre: 45, litreFiyati: 46.0, toplamTutar: 2070, tamDolum: true },
  { id: "f-3", vehicleId: "v-2", tarih: "2024-03-05", km: 42000, litre: 40, litreFiyati: 45.5, toplamTutar: 1820, tamDolum: true }
];

const DEFAULT_TRIPS = [
  { id: "t-1", vehicleId: "v-1", tarih: "2024-02-15", baslangic: "İstanbul", bitis: "İzmir", km: 450, aciklama: "Hafta sonu gezisi" }
];

const DEFAULT_DOCUMENTS = [
  { id: "d-1", vehicleId: "v-1", tip: "Araç Muayenesi", baslangicTarihi: "2022-05-10", bitisTarihi: "2024-05-10", tutar: 1130, aciklama: "TÜVTÜRK muayenesi" },
  { id: "d-2", vehicleId: "v-2", tip: "Kasko", baslangicTarihi: "2023-08-01", bitisTarihi: "2024-08-01", tutar: 25000, aciklama: "Genişletilmiş Kasko" }
];

const DEFAULT_CART = [
  { id: "c-1", vehicleId: "v-1", ad: "Liqui Moly Gear Oil", kategori: "Bakım", marka: "Liqui Moly", fiyat: 850, oncelik: "Orta", link: "", aciklama: "Şanzıman yağı eksiği için." }
];

const DEFAULT_TUNING = [
  { id: "tu-1", vehicleId: "v-1", baslik: "Stage 2 Yazılım", tip: "ECU Remap", firma: "Bootmod3", dynoHpBase: 510, dynoHpTarget: 620, dynoNmBase: 650, dynoNmTarget: 800, tarih: "2024-01-20", tutar: 35000, aciklama: "Stage 2 yazılım atıldı, downpipe ile desteklendi." }
];

const MARKET_PRODUCTS = [
  // BMW Ürünleri (17 adet)
  { id: "mp-bmw-1", compatibleWith: ["BMW"], ad: "Vossen HF-5 20\" Forged Parlak Siyah Jant Takımı", kategori: "Jant / Lastik", marka: "Vossen Wheels", fiyat: 185000, aciklama: "BMW M4 için özel ölçülerde üretilmiş, ultra hafif dövme (forged) alüminyum spor jant kiti.", gorsel: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-2", compatibleWith: ["BMW"], ad: "BBS LM 20\" Gümüş Çift Parçalı Vidalı Jant Takımı", kategori: "Jant / Lastik", marka: "BBS", fiyat: 245000, aciklama: "Klasik efsanevi çift parçalı, vidalı yarış jantı tasarımı.", gorsel: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-3", compatibleWith: ["BMW"], ad: "KW Variant 3 (V3) Yükseklik & Sertlik Ayarlı Coilover", kategori: "Süspansiyon", marka: "KW Suspension", fiyat: 84000, aciklama: "Sıkıştırma ve geri tepme sönümleme ayarlı coilover.", gorsel: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-4", compatibleWith: ["BMW"], ad: "Eventuri M4 G82 Karbon Fiber Emiş Sistemi", kategori: "Modifiye", marka: "Eventuri", fiyat: 46000, aciklama: "Patentli hava emiş tasarımı. Tam karbon fiber yapı.", gorsel: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-5", compatibleWith: ["BMW"], ad: "Akrapovič Evolution Titanyum Komple Egzoz Sistemi", kategori: "Egzoz Sistemi", marka: "Akrapovič", fiyat: 168000, aciklama: "Komple titanyum ultra hafif egzoz sistemi.", gorsel: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-6", compatibleWith: ["BMW"], ad: "Brembo GT 6P Ön Fren Kiti (380mm Delikli Disk)", kategori: "Modifiye", marka: "Brembo", fiyat: 142000, aciklama: "Kırmızı kaliperli, monoblok 6 pistonlu Brembo GT.", gorsel: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-7", compatibleWith: ["BMW"], ad: "M Performance Karbon Fiber Ön Splitter", kategori: "Dış Görünüm", marka: "M Performance", fiyat: 28000, aciklama: "Orijinal karbon fiber ön tampon altı lip.", gorsel: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-8", compatibleWith: ["BMW"], ad: "M Performance Karbon Direksiyon (LED Vites Göstergeli)", kategori: "Kozmetik / Aksesuar", marka: "M Performance", fiyat: 44000, aciklama: "Alcantara/Karbon kaplama spor direksiyon.", gorsel: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-9", compatibleWith: ["BMW"], ad: "H&R 25mm Ön + 20mm Arka Spacer Seti", kategori: "Süspansiyon", marka: "H&R", fiyat: 12500, aciklama: "CNC işlenmiş alüminyum flanşlı jant aralayıcı.", gorsel: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-10", compatibleWith: ["BMW"], ad: "Akrapovič Slip-On Race Titanyum Egzoz", kategori: "Egzoz Sistemi", marka: "Akrapovič", fiyat: 95000, aciklama: "Yarım sistem titanyum egzoz.", gorsel: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-11", compatibleWith: ["BMW"], ad: "Racing Dynamics Karbon Fiber Kaput", kategori: "Dış Görünüm", marka: "Racing Dynamics", fiyat: 55000, aciklama: "2x2 örgülü gerçek karbon fiber kaput.", gorsel: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-12", compatibleWith: ["BMW"], ad: "DINAN Stage 2 Performans Paketi", kategori: "Yazılım / Performans", marka: "DINAN", fiyat: 78000, aciklama: "Stage 2 ECU + TCU yazılım paketi.", gorsel: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-13", compatibleWith: ["BMW"], ad: "Apex EC-7 19\" Saten Siyah Jant Takımı", kategori: "Jant / Lastik", marka: "Apex Wheels", fiyat: 128000, aciklama: "Monoblock alüminyum döküm jant.", gorsel: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-14", compatibleWith: ["BMW"], ad: "KW Clubsport 3-Way Ayarlı Coilover", kategori: "Süspansiyon", marka: "KW Suspension", fiyat: 145000, aciklama: "Pist odaklı 3 yönlü ayar.", gorsel: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-15", compatibleWith: ["BMW"], ad: "OEM BMW M4 Yarım Deri/Alcantara Koltuk", kategori: "Kozmetik / Aksesuar", marka: "BMW", fiyat: 92000, aciklama: "M logosu işlemeli spor koltuk.", gorsel: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-16", compatibleWith: ["BMW"], ad: "Rotiform LHR 19\" Parlak Bronz Jant", kategori: "Jant / Lastik", marka: "Rotiform", fiyat: 96000, aciklama: "Vintage spor görünümü katan döküm jant.", gorsel: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-bmw-17", compatibleWith: ["BMW"], ad: "Brembo Karbon Seramik Ön Disk Seti", kategori: "Modifiye", marka: "Brembo", fiyat: 285000, aciklama: "Tam karbon seramik disk seti.", gorsel: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400&auto=format&fit=crop" },

  // VW Ürünleri (12 adet)
  { id: "mp-vw-1", compatibleWith: ["Volkswagen"], ad: "Pretoria 19\" Parlak Siyah OEM Jant", kategori: "Jant / Lastik", marka: "VW R", fiyat: 58000, aciklama: "Hafif alüminyum alaşım orijinal opsiyon.", gorsel: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-vw-2", compatibleWith: ["Volkswagen"], ad: "BBS CH-R II 19\" Titanyum Gri Jant", kategori: "Jant / Lastik", marka: "BBS", fiyat: 125000, aciklama: "Motorsporları tasarımı iki parçalı hafif jant.", gorsel: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-vw-3", compatibleWith: ["Volkswagen"], ad: "Rotiform LAS-R 19\" Mat Siyah Jant", kategori: "Jant / Lastik", marka: "Rotiform", fiyat: 82000, aciklama: "Aerodinamik çok kollu jant tasarımı.", gorsel: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-vw-4", compatibleWith: ["Volkswagen"], ad: "RacingLine R600 Soğuk Hava Filtre Kiti", kategori: "Modifiye", marka: "RacingLine", fiyat: 24000, aciklama: "Çift katmanlı emme kiti.", gorsel: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-vw-5", compatibleWith: ["Volkswagen"], ad: "Milltek Sport Valved Cat-Back Egzoz", kategori: "Egzoz Sistemi", marka: "Milltek", fiyat: 52000, aciklama: "Paslanmaz çelik spor egzoz.", gorsel: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-vw-6", compatibleWith: ["Volkswagen"], ad: "KW Variant 1 (V1) Coilover", kategori: "Süspansiyon", marka: "KW Suspension", fiyat: 46000, aciklama: "Sadece yükseklik ayarlı coilover.", gorsel: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-vw-7", compatibleWith: ["Volkswagen"], ad: "Wagner Tuning Gen.2 Intercooler", kategori: "Modifiye", marka: "Wagner Tuning", fiyat: 38000, aciklama: "Performans intercooler.", gorsel: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-vw-8", compatibleWith: ["Volkswagen"], ad: "TVS Engineering DSG Debriyaj Kiti", kategori: "Modifiye", marka: "TVS", fiyat: 65000, aciklama: "Güçlendirilmiş kavrama seti.", gorsel: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-vw-9", compatibleWith: ["Volkswagen"], ad: "Maxton Design Ön Lip", kategori: "Dış Görünüm", marka: "Maxton", fiyat: 9500, aciklama: "Agresif ön lip seti.", gorsel: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-vw-10", compatibleWith: ["Volkswagen"], ad: "H&R Spor Yay Seti", kategori: "Süspansiyon", marka: "H&R", fiyat: 14500, aciklama: "25mm alçaltma spor yay.", gorsel: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-vw-11", compatibleWith: ["Volkswagen"], ad: "COBB Tuning ECU Flasher", kategori: "Yazılım / Performans", marka: "COBB Tuning", fiyat: 32000, aciklama: "OBD-II bağlantılı ECU cihazı.", gorsel: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-vw-12", compatibleWith: ["Volkswagen"], ad: "Brembo Sport Arka Fren Diski", kategori: "Modifiye", marka: "Brembo", fiyat: 22000, aciklama: "Delikli arka disk ve balata.", gorsel: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400&auto=format&fit=crop" },

  // Evrensel Ürünler (8 adet)
  { id: "mp-univ-1", compatibleWith: ["BMW", "Volkswagen"], ad: "Motul 300V Power 5W-40 Yağ", kategori: "Bakım", marka: "Motul", fiyat: 3800, aciklama: "Ester bazlı yarış yağı.", gorsel: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-2", compatibleWith: ["BMW", "Volkswagen"], ad: "Michelin Pilot Sport 4S (Adet)", kategori: "Jant / Lastik", marka: "Michelin", fiyat: 9200, aciklama: "Ultra yüksek performanslı lastik.", gorsel: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-3", compatibleWith: ["BMW", "Volkswagen"], ad: "Pirelli P Zero Trofeo R", kategori: "Jant / Lastik", marka: "Pirelli", fiyat: 11500, aciklama: "Yarı yarış lastik kategorisi.", gorsel: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-4", compatibleWith: ["BMW", "Volkswagen"], ad: "NGK Laser Iridium Soğuk Buji", kategori: "Bakım", marka: "NGK", fiyat: 4600, aciklama: "Soğuk buji takımı.", gorsel: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-5", compatibleWith: ["BMW", "Volkswagen"], ad: "Brembo Racing Fren Hidroliği", kategori: "Bakım", marka: "Brembo", fiyat: 1100, aciklama: "Yarış fren hidroliği.", gorsel: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-6", compatibleWith: ["BMW", "Volkswagen"], ad: "Liqui Moly Gear Oil", kategori: "Bakım", marka: "Liqui Moly", fiyat: 850, aciklama: "Şanzıman ve diferansiyel yağı.", gorsel: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-7", compatibleWith: ["BMW", "Volkswagen"], ad: "Compomotive 18\" Jant Takımı", kategori: "Jant / Lastik", marka: "Compomotive", fiyat: 68000, aciklama: "Klasik yarış jantı.", gorsel: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-8", compatibleWith: ["BMW", "Volkswagen"], ad: "OMP WRC-R Spor Direksiyon", kategori: "Kozmetik / Aksesuar", marka: "OMP Racing", fiyat: 18500, aciklama: "Alcantara/karbon direksiyon.", gorsel: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-9", compatibleWith: ["BMW", "Volkswagen"], ad: "Hexis Nardo Gri Araç Kaplama", kategori: "Araç Kaplama", marka: "Hexis", fiyat: 45000, aciklama: "Premium kalite, kendinden iyileşebilen nardo gri folyo.", gorsel: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-10", compatibleWith: ["BMW", "Volkswagen"], ad: "3M 2080 Saten Siyah Kaplama", kategori: "Araç Kaplama", marka: "3M", fiyat: 52000, aciklama: "Tam araç saten siyah folyo kaplama.", gorsel: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-11", compatibleWith: ["BMW", "Volkswagen"], ad: "PPF Şeffaf Boya Koruma Filmi (Tam Araç)", kategori: "Araç Kaplama", marka: "Xpel", fiyat: 85000, aciklama: "Taş izi ve çiziklere karşı tam koruma sağlayan poliüretan film.", gorsel: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-12", compatibleWith: ["BMW", "Volkswagen"], ad: "Jant Boyama (Elektrostatik Toz Boya)", kategori: "Boya İşlemleri", marka: "Custom", fiyat: 12000, aciklama: "4 adet jantın fırınlı toz boya ile istenilen renge boyanması.", gorsel: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-13", compatibleWith: ["BMW", "Volkswagen"], ad: "Kaliper Boyama (Isıya Dayanıklı)", kategori: "Boya İşlemleri", marka: "Custom", fiyat: 6500, aciklama: "Fren kaliperlerinin ısıya dayanıklı özel fırın boya ile boyanması.", gorsel: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-14", compatibleWith: ["BMW", "Volkswagen"], ad: "Seramik Kaplama (Çift Kat)", kategori: "Boya İşlemleri", marka: "Gyeon", fiyat: 18000, aciklama: "Boyayı asit, reçine ve güneş yanığına karşı koruyan 9H seramik uygulaması.", gorsel: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-15", compatibleWith: ["BMW", "Volkswagen"], ad: "Recaro Pole Position Yarış Koltuğu", kategori: "İç Tasarım", marka: "Recaro", fiyat: 65000, aciklama: "Ultra hafif karbon iskeletli profesyonel yarış koltuğu.", gorsel: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-16", compatibleWith: ["BMW", "Volkswagen"], ad: "M Performance Tarzı Karbon Aynalar", kategori: "Dış Görünüm", marka: "Custom", fiyat: 14000, aciklama: "Gerçek karbon fiber ayna kapak seti.", gorsel: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-17", compatibleWith: ["BMW", "Volkswagen"], ad: "Wagner Tuning Downpipe", kategori: "Egzoz Sistemi", marka: "Wagner Tuning", fiyat: 22000, aciklama: "Katalizörsüz yüksek akışlı downpipe.", gorsel: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-18", compatibleWith: ["BMW", "Volkswagen"], ad: "Garrett GTX3071R Gen II Turbo", kategori: "Performans / Motor", marka: "Garrett", fiyat: 110000, aciklama: "700HP kapasiteli performans bilyalı turboşarj.", gorsel: "https://images.unsplash.com/photo-1596700684534-110f00f074d2?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-19", compatibleWith: ["BMW", "Volkswagen"], ad: "Forged Karbon LED Direksiyon", kategori: "İç Tasarım", marka: "Custom", fiyat: 48000, aciklama: "RPM göstergeli özel dökme karbon spor direksiyon.", gorsel: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=400&auto=format&fit=crop" },
  { id: "mp-univ-20", compatibleWith: ["BMW", "Volkswagen"], ad: "Özel Tasarım Bi-LED Farlar", kategori: "Dış Görünüm", marka: "Custom", fiyat: 35000, aciklama: "Siyah tabanlı, lazer görünümlü gündüz farı (DRL) tasarımı.", gorsel: "https://images.unsplash.com/photo-1546545167-28562145b232?q=80&w=400&auto=format&fit=crop" }
];

class OtoDB {
  constructor() {
    this.prefix = "otodb_";
    this.init();
  }

  init() {
    if (!localStorage.getItem("otodb_v7_updated")) {
      localStorage.clear();
      localStorage.setItem("otodb_v7_updated", "true");
    }
    this._checkAndInit("vehicles", DEFAULT_VEHICLES);
    this._checkAndInit("maintenance", DEFAULT_MAINTENANCE);
    this._checkAndInit("modifications", DEFAULT_MODIFICATIONS);
    this._checkAndInit("parts", DEFAULT_PARTS);
    this._checkAndInit("fuel", DEFAULT_FUEL);
    this._checkAndInit("trips", DEFAULT_TRIPS);
    this._checkAndInit("documents", DEFAULT_DOCUMENTS);
    this._checkAndInit("cart", DEFAULT_CART);
    this._checkAndInit("tuning", DEFAULT_TUNING);

    if (!localStorage.getItem("active_vehicle_id") && DEFAULT_VEHICLES.length > 0) {
      localStorage.setItem("active_vehicle_id", DEFAULT_VEHICLES[0].id);
    }
  }

  _checkAndInit(key, defaultData) {
    if (!localStorage.getItem(this.prefix + key)) {
      localStorage.setItem(this.prefix + key, JSON.stringify(defaultData));
    }
  }

  getAll(key) {
    try {
      return JSON.parse(localStorage.getItem(this.prefix + key)) || [];
    } catch {
      return [];
    }
  }

  saveAll(key, data) {
    localStorage.setItem(this.prefix + key, JSON.stringify(data));
  }

  getById(key, id) {
    return this.getAll(key).find(item => item.id === id);
  }

  save(key, item) {
    const items = this.getAll(key);
    if (!item.id) {
      item.id = key.charAt(0) + "-" + Date.now() + Math.floor(Math.random() * 1000);
      items.push(item);
    } else {
      const idx = items.findIndex(i => i.id === item.id);
      if (idx !== -1) items[idx] = item;
      else items.push(item);
    }
    this.saveAll(key, items);
    return item;
  }

  delete(key, id) {
    const items = this.getAll(key).filter(i => i.id !== id);
    this.saveAll(key, items);
  }

  getByVehicle(key, vehicleId) {
    return this.getAll(key).filter(item => item.vehicleId === vehicleId);
  }

  getActiveVehicleId() {
    return localStorage.getItem("active_vehicle_id");
  }

  setActiveVehicleId(id) {
    if (id) localStorage.setItem("active_vehicle_id", id);
    else localStorage.removeItem("active_vehicle_id");
  }

  getActiveVehicle() {
    const id = this.getActiveVehicleId();
    if (!id) return null;
    return this.getById("vehicles", id);
  }

  getMarketProducts(brand) {
    return MARKET_PRODUCTS.filter(p => p.compatibleWith.includes(brand) || p.compatibleWith.includes("Evrensel"));
  }

  getVehicleStats(vehicleId) {
    const maintenance = this.getByVehicle("maintenance", vehicleId).reduce((sum, item) => sum + (Number(item.tutar) || 0), 0);
    const modifications = this.getByVehicle("modifications", vehicleId).reduce((sum, item) => sum + (Number(item.tutar) || 0), 0);
    const fuel = this.getByVehicle("fuel", vehicleId).reduce((sum, item) => sum + (Number(item.toplamTutar) || 0), 0);
    const tuning = this.getByVehicle("tuning", vehicleId).reduce((sum, item) => sum + (Number(item.tutar) || 0), 0);
    const documents = this.getByVehicle("documents", vehicleId).reduce((sum, item) => sum + (Number(item.tutar) || 0), 0);
    
    const fuelRecords = this.getByVehicle("fuel", vehicleId);
    let avgFuelConsumption = 0;
    if (fuelRecords.length > 1) {
      const sorted = fuelRecords.sort((a,b) => new Date(a.tarih) - new Date(b.tarih));
      const firstKm = sorted[0].km;
      const lastKm = sorted[sorted.length-1].km;
      const totalKm = lastKm - firstKm;
      let totalLiters = 0;
      for (let i = 1; i < sorted.length; i++) {
        totalLiters += sorted[i].litre;
      }
      if (totalKm > 0) avgFuelConsumption = ((totalLiters / totalKm) * 100).toFixed(1);
    }

    const trips = this.getByVehicle("trips", vehicleId).reduce((sum, item) => sum + (Number(item.km) || 0), 0);

    return {
      maintenanceCost: maintenance,
      modificationCost: modifications,
      fuelCost: fuel,
      tuningCost: tuning,
      documentCost: documents,
      totalCost: maintenance + modifications + fuel + tuning + documents,
      avgFuelConsumption,
      totalTripKm: trips
    };
  }

  getGlobalStats() {
    const vehicles = this.getAll("vehicles");
    let totalCostAll = 0;
    vehicles.forEach(v => {
      totalCostAll += this.getVehicleStats(v.id).totalCost;
    });
    return {
      totalVehicles: vehicles.length,
      totalCostAll
    };
  }

  buyCartItem(itemId) {
    const item = this.getById("cart", itemId);
    if (!item) return;

    if (item.kategori === "Modifiye" || item.kategori === "Dış Görünüm" || item.kategori === "İç Tasarım" || item.kategori === "Süspansiyon" || item.kategori === "Egzoz Sistemi" || item.kategori === "Jant / Lastik") {
      this.save("modifications", {
        vehicleId: item.vehicleId,
        baslik: item.ad,
        kategori: item.kategori,
        km: this.getActiveVehicle()?.km || 0,
        tarih: new Date().toISOString().split('T')[0],
        usta: item.marka,
        tutar: item.fiyat,
        durum: "Planlanıyor",
        aciklama: item.aciklama,
        gorsel: ""
      });
    } else {
      this.save("parts", {
        vehicleId: item.vehicleId,
        ad: item.ad,
        kod: "-",
        marka: item.marka,
        fiyat: item.fiyat,
        link: item.link || "",
        durum: "Yedek"
      });
    }
    this.delete("cart", itemId);
  }

  addToCartFromMarket(vehicleId, productId) {
    const product = MARKET_PRODUCTS.find(p => p.id === productId);
    if (!product) return false;
    
    return this.save("cart", {
      vehicleId: vehicleId,
      ad: product.ad,
      kategori: product.kategori,
      marka: product.marka,
      fiyat: product.fiyat,
      oncelik: "Orta",
      link: "",
      aciklama: product.aciklama
    });
  }
}

window.OtoDB = new OtoDB();
console.log('CarMod DB başarıyla yüklendi.');
