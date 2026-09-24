# Malameran — Yol haritası ve mevcut konum

## Neredeyiz

**Faz 1 · Aşama B — Müşteri paneli ve yönetim paneli.** Başladı. Blok 1 (panel
kabuğu) bitti: her iki panelin paylaştığı kabuk, gezinme, sayfa başlığı deseni,
boş ve yükleniyor durumları. Sadece arayüz — kimlik doğrulama, veritabanı ve RLS
henüz yok, bu yüzden `(panel)` altındaki tüm rotalar üretimde 404 veriyor.
Sıradaki: Blok 2 (müşteri paneli ekranları) ve Blok 3 (yönetim paneli ekranları);
ikisi de `docs/tasks/f1-b.md` içindeki açık kararlar netleşince başlar.

**Faz 1 · Aşama A — Tanıtım sitesi ve talep toplama.** Kod tarafı tamamlandı;
yayına alma bekleniyor.

On iki sayfa, iki form, dört bildirim e-postası, SEO ve güvenlik başlıkları
yerinde. Veri katmanı: dört tablo, hepsinde RLS açık ve hiç politika yok, dosya
erişimi imzalı ve süreli, hız sınırlayıcı Postgres içinde ve hata durumunda
kapanıyor. Aşama A güvenlik geçişi yapıldı ve `docs/tasks/f1-a.md` içinde
işaretlendi.

Teslim belgeleri hazır: `README.md` (kurulum, ortam değişkenleri, dağıtım) ve
`docs/delivery-notes.md` (müşterinin bilmesi ve karar vermesi gerekenler).

Sıradaki adım — bunlar müşteri/proje sahibi tarafından yapılır:
alan adının Vercel'e bağlanması (`NEXT_PUBLIC_SITE_URL=https://malameran.com`),
Turnstile widget'ının `malameran.com` alan adını içermesi, SPF/DKIM/DMARC
doğrulaması ve teslimat testi, Lighthouse kontrolü, üretime dağıtım ve müşteri
onayı.

Yayından önce kapatılması gerekenler: şablon yasal metinlerin gerçek metinle
değiştirilmesi (21 placeholder), analitik ölçüm kimliğinin gizlilik politikası
ile birlikte tek seferde ayarlanması, ve logonun vektör sürümü.

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
