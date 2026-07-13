# Autonomous Drone


## Terms

Steerpoint (STPT): 
Aktif olarak yönlendirilen navigasyon noktası. F-16'da genellikle 1-25 arası numaralandırılmış waypoint'ler arasından biri aktif steerpoint olarak seçilir.

TOS (Time on Steerpoint): 
Mevcut hız/rotayla steerpoint'e varış tahmini zamanı (az önce konuştuğumuz).

DTG (Distance to Go): 
Aktif steerpoint'e kalan mesafe (genellikle nautical mile cinsinden).

TTG (Time to Go): 
Steerpoint'e ulaşmak için kalan tahmini süre (TOS ile ilişkili ama farklı — TTG "ne kadar süre kaldı", TOS "kaçta varırım").

DTS (Desired Time on Steerpoint): 
Pilotun steerpoint'e varmak istediği hedef zaman. Sistem, DTS ile TOS arasındaki farka göre pilotu hızlanması/yavaşlaması gerektiği konusunda uyarabilir (zaman kontrolü / TOT koordinasyonu için kritik).