# Malameran — Kapsam

Bu dosya projenin tamamının kapsamıdır. Üç fazın hepsini içerir.
Şu an hangi noktada olduğumuz `yol-haritasi.md` dosyasında.

## Ürün nedir

Malameran, Kanada merkezli bir global sourcing şirketi. Alıcı ihtiyacını yazar,
Malameran doğru üreticiyi bulur ve süreci baştan sona yönetir: teklif toplama,
pazarlık, numune, fabrika doğrulama, üretim takibi, kalite kontrol, lojistik,
evrak ve gümrük.

Bu bir pazar yeri veya ürün kataloğu **değildir**. Alibaba alternatifi değildir.
Kullanıcıya "işte üreticiler, sen seç" denmez.

Faz 1'de yazılım, insan yürütülen bir hizmetin yönetim aracıdır.
Faz 2 ve 3'te platform hizmetin kendisini otomatikleştirmeye başlar.

## Faz 1 — Temel platform

Site İngilizce. Çok dilli destek yok.

### Public site
Ana sayfa, How It Works, Services, Industries, For Suppliers, About, Contact,
gizlilik politikası, kullanım şartları. Responsive. SEO temeli, sitemap, analitik.

### Talep toplama
Sourcing talep formu (üyelik gerektirmez): iletişim bilgileri, sektör, talep tipi,
ürün tanımı, miktar, tercih edilen üretici ülkesi, hedef teslim tarihi, hedef fiyat,
istenen sertifikalar, serbest açıklama, dosya ekleme.
Tedarikçi başvuru formu: firma adı, ülke, üretim kategorisi, kapasite, sertifikalar,
web sitesi, iletişim.

### Hesap sistemi
Üye olma, giriş, şifre sıfırlama, e-posta doğrulama, korumalı rotalar.
Roller: müşteri, admin.
Veri yalıtımı veritabanı seviyesinde (RLS) — arayüz filtresine güvenilmez.

### Müşteri paneli
Proje listesi, proje detayı, profil ayarları.
Süreç takip çizelgesi: Talep Alındı → Tedarikçi Araştırması → Teklif Toplama →
Pazarlık → Üretim → Kalite Kontrol → Sevkiyat → Teslim Edildi.

### Yönetim paneli
Tüm projeler, filtreleme ve arama, durum güncelleme, müşteriye kapalı iç notlar,
kullanıcı listesi, tedarikçi başvuruları.

### Dosya ve mesajlaşma
Proje bazlı dosya alanı (çift yönlü, imzalı ve süreli indirme linkleri).
Proje bazlı mesaj alanı — asenkron, e-posta mantığında. Canlı chat değil.
Okunmamış işaretleri.

### Bildirim e-postaları
Hoş geldiniz / doğrulama, şifre sıfırlama, yeni talep (müşteriye onay + ekibe
bildirim), durum değişikliği, yeni mesaj, yeni dosya.
Gönderim `send.` alt alan adından yapılır.

### Altyapı
Alan adı ve kurumsal e-posta kurulumu, DNS, SPF/DKIM/DMARC, SSL, test ortamı,
otomatik yedekleme, deploy.

### Faz 1 sonunda güvenlik kontrolü
Veri yalıtımı testi (başka müşterinin proje id'siyle erişim denemesi), şifre
saklama, hız sınırlama, girdi doğrulama (SQL injection / XSS), bot koruması,
dosya yükleme güvenliği, oturum ve CSRF koruması, admin paneli erişim kontrolü,
güvenlik başlıkları, e-posta doğrulama kayıtları, yedek geri dönüş testi,
bağımlılık taraması. Sonuç yazılı kontrol listesi olarak teslim edilir.

## Faz 2 — Tedarikçi ağı ve teklif yönetimi

- Tedarikçi portalı: hesap, firma profili, kapasite, MOQ, belge yükleme,
  Malameran tarafından doğrulama durumu
- RFQ akışı: projeyi seçili tedarikçilere iletme, tedarikçinin sistemden teklif
  girmesi, son tarih ve hatırlatma
- Teklif karşılaştırma tablosu: fiyat, teslim süresi, MOQ, sertifikalar, ülke
- Genişletilmiş süreç yönetimi: özelleştirilebilir aşamalar, görev atama,
  numune takibi, üretim ara raporları, yapılandırılmış QC kayıtları
- Rol ve yetki yönetimi, işlem kaydı (audit log)
- Bildirim merkezi, canlı mesajlaşma, haftalık özet e-postaları,
  aynı şirketten çoklu kullanıcı
- Raporlama: talep sayısı, sektör/ülke dağılımı, dönüşüm, süreç süresi

## Faz 3 — Yapay zekâ ve otomasyon

- İhtiyaç analizi: serbest metni yapılandırılmış ürün/miktar listesine çevirme
- Tedarikçi eşleştirme ve puanlama
- Toplam maliyet ve risk hesabı, "en iyi 3 seçenek" önerisi
- Otomatik RFQ gönderimi ve tekliflerin normalize edilmesi
- Sözleşme ve evrak desteği, riskli madde işaretleme
- Operasyonel entegrasyonlar: escrow, konteyner takibi, gümrük koordinasyonu,
  denetim rezervasyonu, sigorta, ERP

## Kapsam dışı (Faz 1)

Online ödeme, escrow, faturalandırma · tedarikçi hesapları ve portalı ·
otomatik RFQ ve teklif karşılaştırma · yapay zekâ eşleştirme, maliyet veya risk
skoru · canlı chat, push bildirim · konteyner/gümrük takibi · mobil uygulama ·
ERP veya muhasebe entegrasyonu · ürün kataloğu veya pazar yeri · çok dillilik

## Sorumluluk paylaşımı

**Müşteri sağlar:** site metinleri, hizmet ve sektör açıklamaları, About içeriği,
logo ve marka görselleri. Abonelikler müşterinin adına ve kartıyla.

**Geliştirici sağlar:** tasarım, geliştirme, alan adı ve e-posta kurulumu, DNS,
veritabanı tasarımı ve güvenlik, yedekleme, test, deploy, teslim ve eğitim.
