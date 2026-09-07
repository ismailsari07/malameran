# Malameran — Yol haritası ve mevcut konum

## Neredeyiz

**Faz 1 · Aşama A — Tanıtım sitesi ve talep toplama.** Devam ediyor.

Tanıtım sitesinin on iki sayfası da yayında: Home, How It Works, Services,
Industries, For Suppliers, About, Contact, gizlilik, şartlar ve 404. Veri katmanı
kuruldu — dört tablo, hepsinde RLS açık ve hiç politika yok, dosya erişimi imzalı
ve süreli, hız sınırlayıcı Postgres içinde ve hata durumunda kapanıyor. Her iki
form da çalışıyor: sourcing talebi (`/request`, üç adım, dosya ekli) ve tedarikçi
başvurusu (`/suppliers/apply`, tek adım, dosyasız).

Sıradaki adım: e-posta. Resend'in `send.` alt alan adında kurulması, SPF/DKIM/
DMARC kayıtları, alıcıya onay ve ekibe bildirim e-postaları. Ondan sonra alan adı,
SEO, analitik ve yayına alma.

Yayından önce kapatılması gerekenler `docs/tasks/f1-a.md` içinde: şablon yasal
metinlerin gerçek metinle değiştirilmesi, `robots.txt` açılması, `/tokens`
sayfasının silinmesi ve üç Vercel ortamında `RATE_LIMIT_IP_SALT` ile
`SUBMISSION_TOKEN_SECRET` değerlerinin ayarlanması.

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
