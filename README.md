# WordSpectrum

**WordSpectrum**, insanların farklı olasılık ifadelerini (örneğin: "belki", "banko", "ölme eşeğim ölme") duyduklarında zihinlerinde canlanan olasılık yüzdelerini matematiksel eğriler ve renk spektrumları ile görselleştiren bir veri analiz projesidir.

## 🚀 Proje Kapsamında Neler Yapıldı?

Bu proje, ham anket verilerini alıp onları anlamlı, estetik ve paylaşılabilir birer görsel analize dönüştüren uçtan uca bir sistem sunar:

### 1. Dinamik Veri Toplama ve İşleme
*   **Otomatik Senkronizasyon**: Google Forms analiz sayfasındaki ham verileri Python (`update_data.py`) scripti ile otomatik olarak çeken bir sistem kuruldu.
*   **Veri Modelleme**: 11 noktalı (0-10 ölçeği) anket yanıtları, JSON formatında normalize edilerek görselleştirme motoruna hazır hale getirildi.

### 2. İleri Matematiksel İnterpolasyon
Verilerin pürüzsüzleştirilmesi için üç farklı yöntem koda entegre edildi:
*   **Whittaker-Shannon (Sinc) İnterpolasyonu**: Sinyal işlemede kullanılan bu yöntemle veriler aslına en sadık şekilde pürüzsüzleştirildi.
*   **Cubic Spline**: Klasik, estetik ve yumuşak geçişli eğriler için eklendi.
*   **Monotone Cubic (Fritsch-Carlson)**: Değerlerin asla eksiye düşmemesini sağlayan ve örneklem sınırlarının dışına taşmayan (overshoot yapmayan) en güvenilir yöntem varsayılan olarak uygulandı.

### 3. Modern Görselleştirme ve Tasarım
*   **Renk Spektrumu (HSL)**: Her kelime, tepe noktasındaki olasılık değerine göre **Kırmızı (0%) → Sarı (50%) → Yeşil (100%)** bandında otomatik olarak renklendirildi. Pastel tonlar seçilerek premium bir görünüm elde edildi.
*   **Alan Dolgusu (Area Fill)**: Eğrilerin altı %50 şeffaf renk dolgusu ile doldurularak grafiklerin dolgunluğu artırıldı.
*   **Kompakt Düzen**: Sosyal medya paylaşımlarına uygun, dikey akışlı ve çerçevesiz (minimalist) bir "Kelime : Grafik" tablosu tasarlandı.
*   **Tepe Noktası Analizi**: Her grafiğin en yüksek mutabakat noktası tespit edilerek üzerine otomatik olarak olasılık yüzdesi etiketlendi.

### 4. Geliştirici ve Kullanıcı Deneyimi
*   **Cache-Busting**: CSS ve JS dosyalarının tarayıcıda takılı kalmaması için her yüklemede zaman damgalı versiyonlama sistemi kuruldu.
*   **Lokal Sunucu**: Projenin CORS sorunlarına takılmadan lokalde çalışabilmesi için Python tabanlı hızlı sunucu desteği sağlandı.
*   **Git Entegrasyonu**: Projenin tüm aşamaları versiyon kontrol sistemi ile kayıt altına alındı.

## 🛠️ Nasıl Çalıştırılır?

1.  **Verileri Güncellemek İçin:**
    ```bash
    python update_data.py
    ```
2.  **Lokal Sunucuyu Başlatmak İçin:**
    ```bash
    python -m http.server 8000
    ```
3.  **Tarayıcıda Görüntülemek İçin:**
    `http://localhost:8000` adresine gidin.

---
*Bu proje, verinin sadece sayı değil, bir renk ve duygu spektrumu olduğunu kanıtlamak amacıyla geliştirilmiştir.*
