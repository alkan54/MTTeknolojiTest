# Akıllı Depo Yönetimi - Çalışma Raporu

## 1. Ne Yapıldığının Kısa Özeti
Bu proje kapsamında, "Akıllı Depo Yönetimi" senaryosuna uygun olarak, ürün tanımlamalarının yapılabildiği ve bu ürünlerin depolara (lokasyonlara) giriş/çıkış (stok hareketi) işlemlerinin gerçekleştirilebildiği uçtan uca (Backend + Frontend) bir sistem geliştirilmiştir. 

- Backend tarafında ürün, kategori, lokasyon ve stok hareketi gibi varlıklar (entity) modellenerek ilişkisel bir veritabanı kurulmuştur.
- Katmanlı mimari kullanılarak kurallar gereği PUT ve DELETE HTTP metotları yasaklanmış, tüm güncellemeler POST metotlarıyla karşılanmıştır.
- Frontend tarafında karanlık tema kullanan modern bir arayüz ile özet bilgi kartları, server-side pagination destekli DataGrid tablolar ve form modalları geliştirilmiştir.

## 2. Kullanılan Teknolojiler ve Versiyonları
- **Backend:** .NET 9.0 (ASP.NET Core Web API)
- **Veritabanı:** MS SQL Server LocalDB
- **ORM:** Entity Framework Core 9.0
- **Frontend:** React 18 (Vite ile kuruldu)
- **Frontend Dil:** TypeScript
- **UI Kütüphanesi:** Material-UI (MUI) v6
- **Diğer Kütüphaneler:** Axios (HTTP İstekleri), React-Router-Dom (Yönlendirme), @mui/x-data-grid (Tablolama)

## 3. Karşılaşılan Sorunlar ve Çözüm Yolları
- **EF Core Design Paketi Sürüm Uyumu:** Başlangıçta EF Core 10.0.9 versiyonunun `.NET 9.0` ile uyumsuzluk sorunu vermesi nedeniyle kurulumda bir hata oluştu.
  - **Çözüm:** Nuget paketleri `9.0.*` sürümüne sabitlenerek uyum sorunu giderildi ve veritabanı migration'ları başarıyla oluşturuldu.
- **PUT ve DELETE Metotlarının Yasaklanması:** Restful standartları dışında sadece GET ve POST metotlarıyla çalışma zorunluluğu, router yapısını biraz değiştirdi.
  - **Çözüm:** Güncelleme ve silme işlemleri için endpoint isimleri özelleştirildi (Örn: `/api/products/update` ve `/api/products/delete`).
- **Server-Side Pagination & Stok Hesaplama:** Stok bakiyelerinin doğrudan ayrı bir tablo olarak tutulması yerine hareketlerden (transactions) beslenmesi performans sorunu yaratabilir.
  - **Çözüm:** Ürün listesi çekilirken ilgili ürünlerin stok hareketleri gruplanıp `Sum` fonksiyonuyla hesaplanarak DataGrid'e basıldı. `IQueryable` üzerinden `Skip` ve `Take` ile sayfalama uygulandı.

## 4. Mimari Kararlar ve Nedenleri
- **Katmanlı Yapı:** Proje monolitik yapıda tek çözüm (solution) altında ancak klasörleme (Entities, Repositories, Managers, Controllers, DTOs) ile katmanlara ayrıldı. Bu sayede kod yönetimi daha temiz tutuldu.
- **Generic Repository Pattern:** EF Core'un DB setlerini doğrudan business katmanına açmak yerine `IRepository<T>` arayüzü ile sarılarak (wrap edilerek) test edilebilirlik ve bağımlılıkların azaltılması hedeflendi. Soft delete mekanizması `IsDeleted` property'si üzerinden uygulanırken, DbContext seviyesinde **Global Query Filter** (HasQueryFilter) kullanılarak hiçbir sorguda silinmiş verilerin gelmemesi garanti altına alındı.
- **Multi-Tenant (CompanyId):** Her tabloya `CompanyId` eklendi. Gelen isteklerde HTTP header içerisinden `X-Company-Id` okunarak tüm sorgulara parametre olarak geçildi. Bu sayede veri izolasyonu sağlandı.
- **Soft Delete ve Güncelleme Kuralı:** Veritabanından fiziksel silme yapılmamış, güncelleme işlemlerinde `_context.Entry(entity).State = EntityState.Modified` zorunluluğu kodda açıkça yazılmıştır.

## 5. Yapay Zeka Kullanımı
Proje geliştirme sürecinde yapay zeka araçlarından (Antigravity ve Gemini) destek alınmış olup, proje geliştirici ve yapay zeka işbirliği ile tamamlanmıştır. İş bölümü genel olarak şu şekildedir:
- **Veritabanı ve Temel Altyapı:** Veritabanı modellemesi, ilişkilerin kurulması ve projenin temel backend altyapısı geliştirici (tarafımca) tarafından kurgulanıp oluşturulmuştur.
- **Frontend Geliştirme:** React ve Material-UI kullanılarak modern, kullanıcı dostu arayüzün tasarlanması ve bileşenlerin (component) oluşturulması aşamalarında yapay zekadan destek alınmıştır.
- **API Entegrasyonları:** Frontend tarafında backend API'lerinin tetiklenmesi, servislerin yazılması ve veri alışverişinin sağlanması (fetch/axios işlemleri) gibi noktalarda Antigravity / Gemini ile ortaklaşa çalışılmıştır.
- **Genel Destek:** Geliştirme esnasında karşılaşılan hataların çözümlenmesi ve kod düzenlemelerinde (refactoring) yapay zekadan yardım alınarak süreç hızlandırılmıştır.
