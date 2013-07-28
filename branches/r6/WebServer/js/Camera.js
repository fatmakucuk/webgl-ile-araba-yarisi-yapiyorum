can.Construct("CarGame.Camera", {}, {
    Element: null,
    SelectedCamera: 6,
    init: function ()
    {
        var aspectRatio = $("#Container").width() / $("#Container").height();

        // 45mm'lik bir kamera kullanıyoruz. Görüş mesafesi 2km
        this.Element = new THREE.PerspectiveCamera(45, aspectRatio, 0.01, 2000);
    },
    Animate: function (keyboardState, car)
    {
        // Klavyeye göre kameranın değişmesini sağlıyoruz
        this.HandleKeyboard(keyboardState);

        // Kameranın sahnedeki pozisyonunu ve hedefini, arabanın konumuna göre ayarlıyoruz
        this.SetCameraPosition(car);
    },
    HandleKeyboard: function (keyboardState)
    {
        if (keyboardState.pressed("1"))
        {
            // Arkadan takip eden kamera
            this.SelectedCamera = 1;

            this.Element.position.set(0, 10, 20);
        }
        else if (keyboardState.pressed("2"))
        {
            // Arkadan ve yüksekten takip eden kamera
            this.SelectedCamera = 2;

            this.Element.position.set(0, 20, 30);
        }
        else if (keyboardState.pressed("3"))
        {
            // Tampon kamerası
            this.SelectedCamera = 3;

            this.Element.position.set(0, 20, 30);
        }
        else if (keyboardState.pressed("4"))
        {
            // Ön kaput üstü kamerası
            this.SelectedCamera = 4;

            this.Element.position.set(0, 20, 30);
        }
        else if (keyboardState.pressed("5"))
        {
            // Alçak perspektif kamera
            this.SelectedCamera = 5;

            this.Element.position.set(0, 20, 30);
        }
        else if (keyboardState.pressed("6"))
        {
            // Yüksek perspektif kamera
            this.SelectedCamera = 6;

            this.Element.position.set(0, 20, 30);
        }
    },
    SetCameraPosition: function (car)
    {
        if (this.SelectedCamera == 1)
        {
            // Kemaranın, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada kamerayı arabanın 2 metre yukarısına ve 10 metre gerisine yerleştirdik
            var relativeCameraOffset = new THREE.Vector3(0, 2, 10);

            // Kemaranın baktığı hedefin, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada hedef noktası olarak arabanın 1 metre yukarısını verdik
            var relativeTargetOffset = new THREE.Vector3(0, 1, 0);

            // Belirttiğimiz bağıl konumların sahnedeki gerçek konum karşılıklarını buluyoruz
            var cameraOffset = relativeCameraOffset.applyMatrix4(car.Element.matrixWorld);
            var targetOffset = relativeTargetOffset.applyMatrix4(car.Element.matrixWorld);

            // Kamerayı hesaplanan noktaya taşıyoruz
            this.Element.position.set(cameraOffset.x, cameraOffset.y, cameraOffset.z);

            // Kameranın hesaplanan noktaya bakmasını sağlıyoruz
            this.Element.lookAt(targetOffset);
        }
        else if (this.SelectedCamera == 2)
        {
            // Kemaranın, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada kamerayı arabanın 4 metre yukarısına ve 20 metre gerisine yerleştirdik
            var relativeCameraOffset = new THREE.Vector3(0, 4, 20);

            // Kemaranın baktığı hedefin, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada hedef noktası olarak arabanın 1 metre yukarısını verdik
            var relativeTargetOffset = new THREE.Vector3(0, 1, 0);

            // Belirttiğimiz bağıl konumların sahnedeki gerçek konum karşılıklarını buluyoruz
            var cameraOffset = relativeCameraOffset.applyMatrix4(car.Element.matrixWorld);
            var targetOffset = relativeTargetOffset.applyMatrix4(car.Element.matrixWorld);

            // Kamerayı hesaplanan noktaya taşıyoruz
            this.Element.position.set(cameraOffset.x, cameraOffset.y, cameraOffset.z);

            // Kameranın hesaplanan noktaya bakmasını sağlıyoruz
            this.Element.lookAt(targetOffset);
        }
        else if (this.SelectedCamera == 3)
        {
            // Kemaranın, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada kamerayı arabanın tamponuna yerleştirdik
            var relativeCameraOffset = new THREE.Vector3(0, 0, -5);

            // Kemaranın baktığı hedefin, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada hedef noktası olarak arabanın 6 metre ilerisini verdik
            var relativeTargetOffset = new THREE.Vector3(0, 0, -6);

            // Belirttiğimiz bağıl konumların sahnedeki gerçek konum karşılıklarını buluyoruz
            var cameraOffset = relativeCameraOffset.applyMatrix4(car.Element.matrixWorld);
            var targetOffset = relativeTargetOffset.applyMatrix4(car.Element.matrixWorld);

            // Kamerayı hesaplanan noktaya taşıyoruz
            this.Element.position.set(cameraOffset.x, cameraOffset.y, cameraOffset.z);

            // Kameranın hesaplanan noktaya bakmasını sağlıyoruz
            this.Element.lookAt(targetOffset);
        }
        else if (this.SelectedCamera == 4)
        {
            // Kemaranın, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada kamerayı arabanın ön kaputunun üstüne yerleştirdik
            var relativeCameraOffset = new THREE.Vector3(0, 0.5, -2);

            // Kemaranın baktığı hedefin, arabanın pozisyonuna göre alacağı bağıl konumunu yazıyoruz
            // Burada hedef noktası olarak arabanın 4 metre ilerisini verdik
            var relativeTargetOffset = new THREE.Vector3(0, 0, -4);

            // Belirttiğimiz bağıl konumların sahnedeki gerçek konum karşılıklarını buluyoruz
            var cameraOffset = relativeCameraOffset.applyMatrix4(car.Element.matrixWorld);
            var targetOffset = relativeTargetOffset.applyMatrix4(car.Element.matrixWorld);

            // Kamerayı hesaplanan noktaya taşıyoruz
            this.Element.position.set(cameraOffset.x, cameraOffset.y, cameraOffset.z);

            // Kameranın hesaplanan noktaya bakmasını sağlıyoruz
            this.Element.lookAt(targetOffset);
        }
        else if (this.SelectedCamera == 5)
        {
            // Kamerayı yerden 10 santim yukarıya yerleştiriyoruz
            this.Element.position.set(-10, 0.1, -10);

            // Kameranın direk arabaya bakmasını sağlıyoruz
            this.Element.lookAt(car.Element.position);
        }
        else if (this.SelectedCamera == 6)
        {
            // Kamerayı yerden 5 metre yukarıya yerleştiriyoruz
            this.Element.position.set(-10, 5, -10);

            // Kameranın direk arabaya bakmasını sağlıyoruz
            this.Element.lookAt(car.Element.position);
        }
    }
});