/// <reference path="../libs/jquery.min.js" />
/// <reference path="../libs/can.jquery.min.js" />
/// <reference path="../libs/three.min.js" />

can.Construct("CarGame.Camera", {}, {
    Element: null,
    SelectedCamera: 6,
    init: function ()
    {
        var aspectRatio = $("#Container").width() / $("#Container").height();

        // 45mm'lik bir kamera kullanıyoruz. Görüş mesafesi 8km
        this.Element = new THREE.PerspectiveCamera(45, aspectRatio, 0.01, 8000);

        this.Element.position.set(120, 5, -120);
    },
    Animate: function (keyboardState, car)
    {
        // Klavyeye göre kameranın değişmesini sağlıyoruz
        this.HandleKeyboard(keyboardState, car);

        // Kameranın sahnedeki hedefini, arabanın konumuna göre ayarlıyoruz (Sadece 5. ve 6. kameralar için geçerli)
        this.SetCameraTarget(car);
    },
    HandleKeyboard: function (keyboardState, car)
    {
        if (keyboardState.pressed("1"))
        {
            // Arkadan takip eden kamera
            this.SelectedCamera = 1;

            // Kemaranın, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada kamerayı arabanın 1 metre yukarısına ve 6 metre gerisine yerleştirdik
            var relativeCameraOffset = new THREE.Vector3(0, 1, 6);

            // Kemaranın baktığı hedefin, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada hedef noktası olarak arabanın 1 metre yukarısını verdik
            var relativeTargetOffset = new THREE.Vector3(0, 1, 0);

            // Kamerayı hesaplanan noktaya taşıyoruz
            this.Element.position.copy(relativeCameraOffset);

            // Kameranın hesaplanan noktaya bakmasını sağlıyoruz
            this.Element.lookAt(relativeTargetOffset);

            // Kamerayı, arabanın grubuna ekliyoruz. Böylece hiyerarşi sebebiyle, araba hareket ettikçe kamera da hareket edecek
            car.Element.add(this.Element);
        }
        else if (keyboardState.pressed("2"))
        {
            // Arkadan ve yüksekten takip eden kamera
            this.SelectedCamera = 2;

            // Kemaranın, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada kamerayı arabanın 2 metre yukarısına ve 10 metre gerisine yerleştirdik
            var relativeCameraOffset = new THREE.Vector3(0, 2, 10);

            // Kemaranın baktığı hedefin, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada hedef noktası olarak arabanın 1 metre yukarısını verdik
            var relativeTargetOffset = new THREE.Vector3(0, 1, 0);

            // Kamerayı hesaplanan noktaya taşıyoruz
            this.Element.position.copy(relativeCameraOffset);

            // Kameranın hesaplanan noktaya bakmasını sağlıyoruz
            this.Element.lookAt(relativeTargetOffset);

            // Kamerayı, arabanın grubuna ekliyoruz. Böylece hiyerarşi sebebiyle, araba hareket ettikçe kamera da hareket edecek
            car.Element.add(this.Element);
        }
        else if (keyboardState.pressed("3"))
        {
            // Tampon kamerası
            this.SelectedCamera = 3;

            // Kemaranın, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada kamerayı arabanın tamponuna yerleştirdik
            var relativeCameraOffset = new THREE.Vector3(0, -0.5, -3.5);

            // Kemaranın baktığı hedefin, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada hedef noktası olarak dümdüz ileriyi verdik
            var relativeTargetOffset = new THREE.Vector3(0, -0.5, -5);

            // Kamerayı hesaplanan noktaya taşıyoruz
            this.Element.position.copy(relativeCameraOffset);

            // Kameranın hesaplanan noktaya bakmasını sağlıyoruz
            this.Element.lookAt(relativeTargetOffset);

            // Kamerayı, arabanın grubuna ekliyoruz. Böylece hiyerarşi sebebiyle, araba hareket ettikçe kamera da hareket edecek
            car.Element.add(this.Element);
        }
        else if (keyboardState.pressed("4"))
        {
            // Ön kaput üstü kamerası
            this.SelectedCamera = 4;

            // Kemaranın, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada kamerayı arabanın ön kaputunun üzerine yerleştirdik
            var relativeCameraOffset = new THREE.Vector3(0, -0.25, -2.8);

            // Kemaranın baktığı hedefin, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada hedef noktası olarak hafif yere doğru ileriyi verdik
            var relativeTargetOffset = new THREE.Vector3(0, -0.9, -5);

            // Kamerayı hesaplanan noktaya taşıyoruz
            this.Element.position.copy(relativeCameraOffset);

            // Kameranın hesaplanan noktaya bakmasını sağlıyoruz
            this.Element.lookAt(relativeTargetOffset);

            // Kamerayı, arabanın grubuna ekliyoruz. Böylece hiyerarşi sebebiyle, araba hareket ettikçe kamera da hareket edecek
            car.Element.add(this.Element);
        }
        else if (keyboardState.pressed("5"))
        {
            // Alçak perspektif kamera
            this.SelectedCamera = 5;

            // İlk dört kamera sebebiye kamerayı arabanın grubuna eklenme ihtimaline karşın, gruptan çıkartıyoruz ki araba ile birlikte hareket etmesin
            car.Element.remove(this.Element);

            // Kamerayı zemine yerleştiriyoruz
            this.Element.position.set(120, 0.1, -135);
        }
        else if (keyboardState.pressed("6"))
        {
            // Yüksek perspektif kamera
            this.SelectedCamera = 6;

            // İlk dört kamera sebebiye kamerayı arabanın grubuna eklenme ihtimaline karşın, gruptan çıkartıyoruz ki araba ile birlikte hareket etmesin
            car.Element.remove(this.Element);

            // Kamerayı yerden 5 metre yukarıya yerleştiriyoruz
            this.Element.position.set(120, 5, -120);
        }
    },
    SetCameraTarget: function (car)
    {
      if (this.SelectedCamera == 5)
        {
            // Kameranın direk arabaya bakmasını sağlıyoruz
            this.Element.lookAt(car.Element.position);
        }
        else if (this.SelectedCamera == 6)
        {
            // Kameranın direk arabaya bakmasını sağlıyoruz
            this.Element.lookAt(car.Element.position);
        }
    }
});