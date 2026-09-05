# Malameran — Yol haritası ve mevcut konum

## Neredeyiz

**Faz 1 · Aşama A — Tanıtım sitesi ve talep toplama.** Devam ediyor.

Tasarım yönü belirlendi: `design/*.html` referans dosyaları çıkarıldı, token
tablosu `docs/design.md` içine yazıldı. Proje kurulumu tamamlandı — Next.js,
TypeScript, Tailwind v4, tasarım tokenları ve Supabase istemcileri hazır.

Sıradaki adım: paylaşılan bileşenler (header, footer, buton, form kontrolleri,
bölüm sarmalayıcı), ardından Home sayfası.

## Faz 1 aşamaları

Her aşama kendi başına yayına alınabilir ve tamamlandığında site çalışır durumda
kalır.

### F1-A · Tanıtım sitesi ve talep toplama
Public site, sourcing talep formu, tedarikçi başvuru formu, bildirim e-postaları,
alan adı ve kurumsal e-posta kurulumu, SEO, analitik, yasal sayfalar, deploy.

**Bitti sayılır:** site canlıda, form çalışıyor, gelen talep ekibe e-posta olarak
ulaşıyor, müşteriye onay e-postası gidiyor.

### F1-B · Müşteri paneli ve yönetim paneli
Hesap sistemi, veritabanı şeması ve RLS, müşteri paneli, süreç takip çizelgesi,
yönetim paneli, iç notlar, kullanıcı ve başvuru listeleri.

**Bitti sayılır:** müşteri giriş yapıp projesinin durumunu görüyor, ekip tüm
projeleri panelden yönetiyor, bir müşteri başkasının verisine hiçbir yoldan
erişemiyor.

### F1-C · Dosya paylaşımı, mesajlaşma ve güvenlik
Proje bazlı dosya alanı, mesaj alanı, ilgili bildirimler, okunmamış işaretleri,
detaylı güvenlik kontrolü, teslim ve yönetim paneli eğitimi.

**Bitti sayılır:** dosya ve mesaj akışı çalışıyor, güvenlik kontrol listesi
tamamlanmış ve yazılı olarak teslim edilmiş.

## Sonraki fazlar

**Faz 2** — tedarikçi portalı, RFQ, teklif karşılaştırma. Faz 1 yayına girip
gerçek talepler alınmaya başladıktan sonra kapsamı netleşecek.

**Faz 3** — yapay zekâ ve otomasyon. Faz 1 ve 2'de biriken gerçek veriye bağlı.

Fazlar ilerledikçe bu dosyanın "Neredeyiz" bölümü güncellenir. Proje, repo ve
bilgi tabanı üç fazın tamamı boyunca aynı kalır.

## Sohbet düzeni

- `00 · Yönetim` — müşteri iletişimi, kararlar, kapsam soruları
- `01 · Tasarım` — tasarım yönü
- `F1-A`, `F1-B`, `F1-C` — build sohbetleri
- Faz 2 başlayınca `F2-A` diye devam eder

Bir build sohbeti 40-50 mesajı geçerse kapatılır, kararlar `docs/decisions.md`
dosyasına yazılır, yeni sohbet açılır.

## Tek doğru kaynak

Repo tek doğru kaynaktır. `docs/` altındaki dosyalar günceldir.
Project knowledge'daki bu iki dosya (`kapsam.md`, `yol-haritasi.md`) nadiren
değişen özetlerdir; değiştiklerinde repo'daki karşılıklarıyla birlikte güncellenir.
