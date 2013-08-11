/// <reference path="../libs/jquery.min.js" />
/// <reference path="../libs/can.jquery.min.js" />
/// <reference path="../libs/three.min.js" />

can.Construct("CarGame.Car", {}, {
    Element: null,
    CarBody: null,
    CarBodyContainerForBreakBending: null,
    CarBodyContainerForTurnBending: null,
    CarBodyLightContainer: null,
    FrontLeftWheel: null,
    FrontRightWheel: null,
    BackLeftWheel: null,
    BackRightWheel: null,
    FrontLeftCarBreak: null,
    FrontRightCarBreak: null,
    BackLeftCarBreak: null,
    BackRightCarBreak: null,
    FrontLeftWheelContainer: null,
    FrontRightWheelContainer: null,
    BackLeftWheelContainer: null,
    BackRightWheelContainer: null,
    FrontLight: null,
    BackLight: null,
    RearMirrorCamera: null,
    ground: null,

    // Sabitlerimiz
    NONE: 0,
    FORWARD: 1,
    BACKWARD: -1,
    FRONT: 1,
    BACK: 2,
    LEFT: 3,
    RIGHT: 4,

    // Arabanın çarpışma denetimi yapılacak noktaları
    CenterPoint: new THREE.Vector3(0, -1, -1.5),
    FrontPoint: new THREE.Vector3(0, -1, -5),
    FrontLeftPoint: new THREE.Vector3(-1.05, -1, -2.8),
    FrontRightPoint: new THREE.Vector3(1.05, -1, -2.8),
    BackPoint: new THREE.Vector3(0, -1, 0.8),
    BackLeftPoint: new THREE.Vector3(-1.2, -1, 0.4),
    BackRightPoint: new THREE.Vector3(1.2, -1, 0.4),
    LeftPoint: new THREE.Vector3(-0.95, -1, -1.5),
    RightPoint: new THREE.Vector3(0.95, -1, -1.5),

    // Yüklemesi beklenen model sayısı
    RemainingModelCount: 5,

    // Arabanın güncel vites değeri
    Shift: 0,

    // Arabanın güncel hızı
    Speed: 0,

    // Arabanın güncel motor devri
    EngineCycle: 0,

    // Arabanın ivmelenme sırasındaki eğilme durumları
    CarBodyBendingForBreak: 0,
    CarBodyBendingForTurn: 0,

    // Ön tekerlek açısı
    FrontWheelAngle: 0,

    // Işıkların açıklık durumu
    LightsOn: true,

    // Tekerleklerin asfalt zeminden dışarı çıkması sebebiyle arabaya uygulanacak hız limiti
    MaxOffRoadSpeed: 9999,

    // Son asfalt zemin kontrolünden bu yana geçen süre
    CheckOnRoadDeltaTime: 0,

    // Son bariyer çarpma kontrolünden bu yana geçen süre
    CheckBarrierCollisionDeltaTime: 0,

    // Arabanın motor bilgileri
    // Şimdilik sadece max. devir değerini barındırıyor
    EngineSpecs: { MaxCycle: 8000 },

    // Arabanın şansıman bilgileri
    // Sırasıyla vitesin adı, ivmelenmede ve hız hesaplamasında kullanılacak vites çarpanı, bir üst vitese geçilecek motor devri, bir üst vitese
    // geçildiği andaki motor devri(Vites yükseldiği için devir buraya düşecek), bir alt vitese geçilecek motor devri, bir alt vitese geçildiği
    // andaki motor devri(Vites azaldığı için devir buraya çıkacak)
    ShiftSpecs: [{ Shift: "R", ShiftRate: 150, UpCycle: null, AfterUpCycle: null, DownCycle: null, AfterDownCycle: null },
                 { Shift: "1", ShiftRate: 150, UpCycle: 7000, AfterUpCycle: 3884, DownCycle: null, AfterDownCycle: null },
                 { Shift: "2", ShiftRate: 83.2202, UpCycle: 7000, AfterUpCycle: 4196, DownCycle: 3000, AfterDownCycle: 5407 },
                 { Shift: "3", ShiftRate: 49.8805, UpCycle: 6500, AfterUpCycle: 4444, DownCycle: 3000, AfterDownCycle: 5005 },
                 { Shift: "4", ShiftRate: 34.1005, UpCycle: 6500, AfterUpCycle: 5165, DownCycle: 3500, AfterDownCycle: 5120 },
                 { Shift: "5", ShiftRate: 27.0965, UpCycle: 6500, AfterUpCycle: 5644, DownCycle: 3500, AfterDownCycle: 4405 },
                 { Shift: "6", ShiftRate: 23.5294, UpCycle: null, AfterUpCycle: null, DownCycle: 4000, AfterDownCycle: 4606 }],

    init: function (ground)
    {
        this.ground = ground;

        this.Element = new THREE.Object3D();

        // Arabanın gövde modelini yükleme işlemini başlatıyoruz
        var jsonLoader = new THREE.JSONLoader();

        jsonLoader.load("models/CarBody.js", this.CarBodyModelLoaded);

        // Açılışta arabayı biraz sağa çekiyoruz ve şık dursun diye 45 derece çeviriyoruz
        this.Element.position.set(160, 1.07, -70);

        this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);

        // Dikiz aynasındaki görüntüyü sağlayacak kamerayı, arabanın hemen üzerine yerleştiriyoruz ve geriye doğru bakmasını sağlıyoruz
        this.RearMirrorCamera = new THREE.PerspectiveCamera(45, 400 / 150, 0.01, 200);
        this.RearMirrorCamera.position.set(0, 0, 0);
        this.RearMirrorCamera.lookAt(new THREE.Vector3(0, 0, 5));

        // Ardından kamerayı arabanın 3D grubu içerisine yerleştiriyoruz ki, araba hareket ettiğinde kamera da aynı şekilde hareket etsin
        this.Element.add(this.RearMirrorCamera);
    },
    CarBodyModelLoaded: function (geometry, materials)
    {
        // CarBody.js dosyasının yüklenmesi tamamlandığı zaman bu metot işletilir
        // Yüklenen modeli nesnemize ekliyoruz
        var material = new THREE.MeshFaceMaterial(materials);

        this.car.CarBodyContainerForTurnBending = new THREE.Object3D();

        // Arabanın dönüş ekseni olan pivot noktasını arka aksın ortasına getirmek için gövdeyi ileri alıyoruz
        this.car.CarBodyContainerForTurnBending.position.set(0, -0.95, -1.5);

        // Modelleme yan yapıldığı için arabayı 90 derece çeviriyoruz
        this.car.CarBodyContainerForTurnBending.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 2);

        this.car.CarBodyContainerForBreakBending = new THREE.Object3D();

        this.car.CarBodyContainerForTurnBending.add(this.car.CarBodyContainerForBreakBending);

        this.car.CarBodyLightContainer = new THREE.Object3D();

        this.car.CarBodyContainerForBreakBending.add(this.car.CarBodyLightContainer);

        this.car.CarBody = new THREE.Mesh(geometry, material);

        this.car.CarBody.castShadow = true;

        this.car.CarBodyLightContainer.add(this.car.CarBody);

        this.car.Element.add(this.car.CarBodyContainerForTurnBending);

        // Yüklemesi beklenen model sayısını bir azaltıyoruz
        this.car.RemainingModelCount--

        // Arabanın tekerlek modelini yükleme işlemini başlatıyoruz
        var jsonLoader = new THREE.JSONLoader();

        jsonLoader.load("models/CarWheel.js", this.car.CarWheelModelLoaded);
    },
    CarWheelModelLoaded: function (geometry, materials)
    {
        // CarWheel.js dosyasının yüklenmesi tamamlandığı zaman bu metot işletilir
        // Yüklenen modeli nesnemize ekliyoruz
        var material = new THREE.MeshFaceMaterial(materials);

        // Sol ön tekerlek
        this.car.FrontLeftWheelContainer = new THREE.Object3D();

        this.car.FrontLeftWheelContainer.position.set(-0.8, -0.75, -2.75);

        this.car.FrontLeftWheel = new THREE.Mesh(geometry.clone(), material);

        this.car.FrontLeftWheel.castShadow = true;

        // Modelleme yan yapıldığı için tekerleği 90 derece çeviriyoruz
        this.car.FrontLeftWheel.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 2);

        this.car.FrontLeftWheelContainer.add(this.car.FrontLeftWheel);

        this.car.Element.add(this.car.FrontLeftWheelContainer);

        // Sağ ön tekerlek
        this.car.FrontRightWheelContainer = new THREE.Object3D();

        this.car.FrontRightWheelContainer.position.set(0.8, -0.75, -2.75);

        this.car.FrontRightWheel = new THREE.Mesh(geometry.clone(), material);

        this.car.FrontRightWheel.castShadow = true;

        // Modelleme yan yapıldığı için tekerleği 90 derece çeviriyoruz
        this.car.FrontRightWheel.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 2);

        // Tek bir tekerlek modelimiz olduğundan sağ taraftaki terkerlekler için modeli 180 derece çeviriyoruz
        this.car.FrontRightWheel.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1 * Math.PI);

        this.car.FrontRightWheelContainer.add(this.car.FrontRightWheel);

        this.car.Element.add(this.car.FrontRightWheelContainer);

        // Sol arka tekerlek
        this.car.BackLeftWheelContainer = new THREE.Object3D();

        // Arabanın dönüş ekseni olan pivot noktasını arka aksın ortasına getirmek için arka tekerlekleri z = 0'a yerleştiriyoruz
        this.car.BackLeftWheelContainer.position.set(-0.8, -0.75, -0.09);

        this.car.BackLeftWheel = new THREE.Mesh(geometry.clone(), material);

        this.car.BackLeftWheel.castShadow = true;

        // Modelleme yan yapıldığı için tekerleği 90 derece çeviriyoruz
        this.car.BackLeftWheel.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 2);

        this.car.BackLeftWheelContainer.add(this.car.BackLeftWheel);

        this.car.Element.add(this.car.BackLeftWheelContainer);

        // Sağ arka tekerlek
        this.car.BackRightWheelContainer = new THREE.Object3D();

        // Arabanın dönüş ekseni olan pivot noktasını arka aksın ortasına getirmek için arka tekerlekleri z = 0'a yerleştiriyoruz
        this.car.BackRightWheelContainer.position.set(0.8, -0.75, -0.09);

        this.car.BackRightWheel = new THREE.Mesh(geometry.clone(), material);

        this.car.BackRightWheel.castShadow = true;

        // Modelleme yan yapıldığı için tekerleği 90 derece çeviriyoruz
        this.car.BackRightWheel.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 2);

        // Tek bir tekerlek modelimiz olduğundan sağ taraftaki terkerlekler için modeli 180 derece çeviriyoruz
        this.car.BackRightWheel.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1 * Math.PI);

        this.car.BackRightWheelContainer.add(this.car.BackRightWheel);

        this.car.Element.add(this.car.BackRightWheelContainer);

        // Yüklemesi beklenen model sayısını bir azaltıyoruz
        this.car.RemainingModelCount--;

        // Arabanın fren tertibatı modelini yükleme işlemini başlatıyoruz
        var jsonLoader = new THREE.JSONLoader();

        jsonLoader.load("models/CarBreak.js", this.car.CarBreakModelLoaded);
    },
    CarBreakModelLoaded: function (geometry, materials)
    {
        // CarBreak.js dosyasının yüklenmesi tamamlandığı zaman bu metot işletilir
        // Yüklenen modeli nesnemize ekliyoruz
        var material = new THREE.MeshFaceMaterial(materials);

        this.car.FrontLeftCarBreak = new THREE.Mesh(geometry, material);

        // Modelleme yan yapıldığı için frenleri 90 derece çeviriyoruz
        this.car.FrontLeftCarBreak.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 2);

        this.car.FrontLeftCarBreak.position.set(-0.1, -0.4, 0);

        this.car.FrontLeftWheelContainer.add(this.car.FrontLeftCarBreak);

        // Sağ ön tekerlek
        this.car.FrontRightCarBreak = new THREE.Mesh(geometry.clone(), material);

        // Modelleme yan yapıldığı için frenleri 90 derece çeviriyoruz
        this.car.FrontRightCarBreak.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 2);

        // Tek bir fren modelimiz olduğundan sağ taraftaki frenler için modeli 180 derece çeviriyoruz
        this.car.FrontRightCarBreak.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1 * Math.PI);

        this.car.FrontRightCarBreak.position.set(0.1, 0.4, 0);

        this.car.FrontRightWheelContainer.add(this.car.FrontRightCarBreak);

        // Sol arka tekerlek
        this.car.BackLeftCarBreak = new THREE.Mesh(geometry, material);

        // Modelleme yan yapıldığı için frenleri 90 derece çeviriyoruz
        this.car.BackLeftCarBreak.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 2);

        this.car.BackLeftCarBreak.position.set(-0.1, -0.4, 0);

        this.car.BackLeftWheelContainer.add(this.car.BackLeftCarBreak);

        // Sağ arka tekerlek
        this.car.BackRightCarBreak = new THREE.Mesh(geometry.clone(), material);

        // Modelleme yan yapıldığı için frenleri 90 derece çeviriyoruz
        this.car.BackRightCarBreak.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 2);

        // Tek bir fren modelimiz olduğundan sağ taraftaki frenler için modeli 180 derece çeviriyoruz
        this.car.BackRightCarBreak.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1 * Math.PI);

        this.car.BackRightCarBreak.position.set(0.1, 0.4, 0);

        this.car.BackRightWheelContainer.add(this.car.BackRightCarBreak);

        // Yüklemesi beklenen model sayısını bir azaltıyoruz
        this.car.RemainingModelCount--;

        // Arabanın arka ışık modelini yükleme işlemini başlatıyoruz
        var jsonLoader = new THREE.JSONLoader();

        jsonLoader.load("models/BackLight.js", this.car.BackLightModelLoaded);
    },
    BackLightModelLoaded: function (geometry, materials)
    {
        // BackLight.js dosyasının yüklenmesi tamamlandığı zaman bu metot işletilir
        // Yüklenen modeli nesnemize ekliyoruz
        var material = new THREE.MeshFaceMaterial(materials);

        this.car.BackLight = new THREE.Mesh(geometry, material);

        this.car.CarBodyLightContainer.add(this.car.BackLight);

        // Yüklemesi beklenen model sayısını bir azaltıyoruz
        this.car.RemainingModelCount--;

        // Arabanın ön ışık modelini yükleme işlemini başlatıyoruz
        var jsonLoader = new THREE.JSONLoader();

        jsonLoader.load("models/FrontLight.js", this.car.FrontLightModelLoaded);
    },
    FrontLightModelLoaded: function (geometry, materials)
    {
        // FrontLight.js dosyasının yüklenmesi tamamlandığı zaman bu metot işletilir
        // Yüklenen modeli nesnemize ekliyoruz
        var material = new THREE.MeshFaceMaterial(materials);

        this.car.FrontLight = new THREE.Mesh(geometry, material);

        this.car.CarBodyLightContainer.add(this.car.FrontLight);

        // Yüklemesi beklenen model sayısını bir azaltıyoruz
        this.car.RemainingModelCount--;

        // Başlangıçta ışıklarımızı kapatıyoruz
        this.car.LightOff();
    },

    Animate: function (keyboardState, deltaTime)
    {
        // Arabanın dört tekerleğinin de yolda olup olmadığını kontrol ettiriyoruz
        this.CheckOnRoad(deltaTime);

        // Arabanın bariyere çarpıp çarpmadığını kontrol ettiriyoruz
        this.CheckBarrierCollision(deltaTime);

        // Bir önceki animasyon akışında fren ışığı yanıyorsa söndürüyoruz
        this.TurnBreakLightOff();

        // (Gerekliyse) Otomatik vites değişimi yapıyoruz
        this.CheckShiftChange();

        // Eğer arabanın gövdesi bir önceki animasyonda fren sebebiyle eğildi ise, eski konumuna geri getiriyoruz
        if (this.CarBodyBendingForBreak != this.NONE)
        {
            if (this.CarBodyBendingForBreak == this.FRONT)
            {
                this.CarBodyContainerForBreakBending.rotateOnAxis(new THREE.Vector3(0, 0, 1), -1 * Math.PI / 180);
            }
            else if (this.CarBodyBendingForBreak == this.BACK)
            {
                this.CarBodyContainerForBreakBending.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 180);
            }

            this.CarBodyBendingForBreak = this.NONE;
        }

        // Eğer arabanın gövdesi bir önceki animasyonda dönüş sebebiyle eğildi ise, eski konumuna geri getiriyoruz
        if (this.CarBodyBendingForTurn != this.NONE)
        {
            if (this.CarBodyBendingForTurn == this.RIGHT)
            {
                this.CarBodyContainerForTurnBending.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 180);
            }
            else if (this.CarBodyBendingForTurn == this.LEFT)
            {
                this.CarBodyContainerForTurnBending.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1 * Math.PI / 180);
            }

            this.CarBodyBendingForTurn = this.NONE;
        }

        // Eğer arabanın ön tekerlekleri düz konumda değilse ve an itibariyle sol veya sağ tuşlarına basılmıyorsa, tekerlekleri düz konumuna geri getiriyoruz
        if (!keyboardState.pressed("left") && !keyboardState.pressed("right") && this.FrontWheelAngle != 0)
        {
            var angle = Math.PI / 100;

            if (this.FrontWheelAngle > 0)
            {
                angle *= -1;
            }

            this.FrontWheelAngle += angle;

            this.FrontLeftWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
            this.FrontRightWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
        }


        // Klavyeye göre arabanın gerekli aksiyonları almasını sağlıyoruz
        this.HandleKeyboard(keyboardState, deltaTime);

        // Vites ve motor devrine göre aracın hızını hesaplatıyoruz
        this.Speed = this.CalculateSpeed();

        if (this.Speed == 0)
        {
            // Araba duruyorken vitesi boşa alıyoruz ki, baskı balataları erimesin
            this.Shift = 0;
            this.EngineCycle = 0;
        }
        else
        {
            // Arabanın belirtilen hızda hareket etmesini sağlıyoruz
            this.Move(deltaTime);

            // Tekerleklerin hıza orantılı dönmesini sağlıyoruz
            this.RotateWheels(deltaTime);
        }

        // Devir göstergesini dolduruyoruz
        this.WriteCycle();

        // Hız göstergesini dolduruyoruz
        this.WriteSpeed();

        // Vites indikatörünü dolduruyoruz
        this.WriteShift();
    },
    HandleKeyboard: function (keyboardState, deltaTime)
    {
        // Burada, klavyeden basılan tuşlara göre arabaya hareket kazandıran metotları çağırıyoruz
        // Dikkat edecek olursanız, buradaki tüm metotlara deltaTime değişkeni geçiliyor. Bu değişken, animasyonun
        // son çağırıldığı zamandan beri geçen süreyi barındırıyor. Bu, oyunun FPS (frame per second) hızına
        // bağımlı kalmaksızın aynı şekilde davranmasına imkan sağlamak için yapılıyor. Örneğin biz burada hızı
        // 0.5 birim arttırdık diyelim. 60 FPS'de çalıştığı bir makinede, saniyede 30 birimlik bir artış söz konusu
        // olur. Ancak 30 FPS'de çalıştığı bir makinede, saniyede 15 birimlik bir artış olur ve aynı oyun, farklı
        // bilgisayarlarda farklı şekilde çalışır. Bunun için hızı 30 * deltaTime şeklinde arttırırsak, 60 FPS'de
        // saniyede 60 kez 30 * 0.0166 şeklinde hız artarken, 30 FPS'de saniyede 30 kez 30 * 0.0333 şeklinde hız
        // artar ve her ikisinde de, bir saniye sonra 30 birimlik artış olmuş olur
        // Bu yüzden deltaTime önemli, atlamayalım

        var direction = this.FindDirection();

        if ((direction != this.NONE && !keyboardState.pressed("up") && !keyboardState.pressed("down")) || this.Speed > this.MaxOffRoadSpeed)
        {
            // Eğer araba durmuyorsa ve ileri-geri tuşlarına basılmıyorsa ya da tekerleklerin yolun dışına çıkması
            // sebebiyle hız limiti uygulanacaksa arabanın yavaşlamasını sağlıyoruz
            this.SlowDown(deltaTime, direction);
        }

        if (keyboardState.pressed("up"))
        {
            if (direction == this.FORWARD)
            {
                // İleri giden arabanın daha da hızlanmasını sağlıyoruz
                this.Accelerate(deltaTime, direction);
            }
            else if (direction == this.NONE)
            {
                // Duran arabanın vitesini 1'e geçirerek ileriye doğru hareket etmesini sağlıyoruz
                this.Shift = 1;

                this.Accelerate(deltaTime, direction);
            }
            else
            {
                // İleri giden arabanın yavaşlamasını sağlıyoruz
                this.Break(deltaTime, direction);
            }
        }

        if (keyboardState.pressed("down"))
        {
            if (direction == this.BACKWARD)
            {
                // Geri giden arabanın daha da hızlanmasını sağlıyoruz
                this.Accelerate(deltaTime, direction);
            }
            else if (direction == this.NONE)
            {
                // Duran arabanın vitesini R'ye geçirerek geriye doğru hareket etmesini sağlıyoruz
                this.Shift = -1;

                this.Accelerate(deltaTime, direction);
            }
            else
            {
                // Geri giden arabanın yavaşlamasını sağlıyoruz
                this.Break(deltaTime, direction);
            }
        }

        var handbreak = false;

        if (keyboardState.pressed("ctrl"))
        {
            // Arabanın biraz yavaşlaması sağlıyoruz
            this.Handbreak(deltaTime, direction);

            handbreak = true;
        }

        if (keyboardState.pressed("left"))
        {
            // Arabanın sola dönmesini sağlıyoruz
            this.TurnLeft(handbreak, deltaTime);
        }

        if (keyboardState.pressed("right"))
        {
            // Arabanın sağa dönmesini sağlıyoruz
            this.TurnRight(handbreak, deltaTime);
        }

        if (keyboardState.pressed("d"))
        {
            // Arabanın ışıklarını kapatıyoruz
            this.LightOff();
        }

        if (keyboardState.pressed("n"))
        {
            // Arabanın ışıklarını açıyoruz
            this.LightOn();
        }
    },
    Accelerate: function (deltaTime, direction)
    {
        // Eğer tekerleklerin asfalt zeminin dışına çıkması sebebiyle uygulanan hız limitine ulaşılmadıysa ve
        // motor maksimum devir sayısına ulaşmadıysa, devir sayısını uygun formüle göre arttırıyoruz
        // Gaza basıldığı takdirde, aracın hızını arttırmıyoruz. Gerçek dünyada olduğu gibi, motor devrini arttırıyoruz
        // Sonradan motor devrine ve vitese göre hız hesaplanıyor
        if (this.Speed < this.MaxOffRoadSpeed)
        {
            if (this.EngineCycle < this.EngineSpecs.MaxCycle)
            {
                var shift;

                if (this.Shift == -1)
                {
                    // Geriye doğru motor devri ivmelenme formülü
                    this.EngineCycle += Math.round((5000 * this.ShiftSpecs[0].ShiftRate * this.ShiftSpecs[0].ShiftRate / (2000 + this.EngineCycle)) * deltaTime);
                }
                else
                {
                    // İleriye doğru motor devri ivmelenme formülü
                    this.EngineCycle += Math.round((5000 * this.ShiftSpecs[this.Shift].ShiftRate * this.ShiftSpecs[this.Shift].ShiftRate / (2000 + this.EngineCycle * this.Shift)) * deltaTime);
                }
            }
            else
            {
                // Motorun maksimum devir sayısını geçmesini engelliyoruz
                this.EngineCycle = this.EngineSpecs.MaxCycle;
            }
        }
    },
    Break: function (deltaTime, direction)
    {
        if (this.EngineCycle > 0)
        {
            // Arabanın frene basıldığında yavaşlama formülü
            this.EngineCycle -= Math.round(7000 * deltaTime);

            // Fren sırasında arabanın gövdesini eğiyoruz
            if (direction == this.FORWARD)
            {
                this.CarBodyBendingForBreak = this.FRONT;

                this.CarBodyContainerForBreakBending.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 180);
            }
            else if (direction == this.BACKWARD)
            {
                this.CarBodyBendingForBreak = this.BACK;

                this.CarBodyContainerForBreakBending.rotateOnAxis(new THREE.Vector3(0, 0, 1), -1 * Math.PI / 180);
            }
        }

        // Fren durumunda fren ışıklarını yakıyoruz
        this.TurnBreakLightOn();
    },
    Handbreak: function (deltaTime, direction)
    {
        if (this.EngineCycle > 0)
        {
            // Arabanın frene basıldığında yavaşlama formülü
            this.EngineCycle -= Math.round(1500 * deltaTime);
        }
    },
    SlowDown: function (deltaTime, direction)
    {
        if (this.EngineCycle > 0)
        {
            // Arabanın kendi kendine yavaşlama formülü
            this.EngineCycle -= Math.round(700 * deltaTime);
        }
    },
    CheckOnRoad: function (deltaTime)
    {
        // Tekerleklerin yolun dışına çıkıp çıkmadığı testini yapmak için dört tekerlek modelinin de yüklenip yüklenmediğini kontrol ediyoruz
        if (this.FrontLeftWheel == null || this.FrontRightWheel == null || this.BackLeftWheel == null || this.BackRightWheel == null)
        {
            return;
        }

        // Ray Casting masraflı bir işlem olduğu için, bu işlemi saniyede 60 kere değil, 0.5 saniyede bir kez gerçekleştiriyoruz
        if (this.CheckOnRoadDeltaTime < 0.5)
        {
            this.CheckOnRoadDeltaTime += deltaTime;

            return;
        }

        this.CheckOnRoadDeltaTime = 0;

        // Bunun için ilk olarak dört tekerleğin de merkez noktasını buluyoruz
        var frontLeftWheelCenterPoint = this.FrontLeftWheel.localToWorld(this.FrontLeftWheel.position.clone());
        var frontRightWheelCenterPoint = this.FrontRightWheel.localToWorld(this.FrontRightWheel.position.clone());
        var backLeftWheelCenterPoint = this.BackLeftWheel.localToWorld(this.BackLeftWheel.position.clone());
        var backRightWheelCenterPoint = this.BackRightWheel.localToWorld(this.BackRightWheel.position.clone());

        // Ardından dört tekerlek için de, dikey eksende 1 metre daha aşağıda birer nokta daha tanımlıyoruz
        var frontLeftWheelBottomPoint = new THREE.Vector3(frontLeftWheelCenterPoint.x, frontLeftWheelCenterPoint.y - 1, frontLeftWheelCenterPoint.z);
        var frontRightWheelBottomPoint = new THREE.Vector3(frontRightWheelCenterPoint.x, frontRightWheelCenterPoint.y - 1, frontRightWheelCenterPoint.z);
        var backLeftWheelBottomPoint = new THREE.Vector3(backLeftWheelCenterPoint.x, backLeftWheelCenterPoint.y - 1, backLeftWheelCenterPoint.z);
        var backRightWheelBottomPoint = new THREE.Vector3(backRightWheelCenterPoint.x, backRightWheelCenterPoint.y - 1, backRightWheelCenterPoint.z);

        // Tanımlanan noktalar arasında aşağı yönlü dört adet doğru çiziyoruz
        var frontLeftWheelRay = new THREE.Raycaster(frontLeftWheelCenterPoint, frontLeftWheelBottomPoint.sub(frontLeftWheelCenterPoint).clone().normalize());
        var frontRightWheelRay = new THREE.Raycaster(frontRightWheelCenterPoint, frontRightWheelBottomPoint.sub(frontRightWheelCenterPoint).clone().normalize());
        var backLeftWheelRay = new THREE.Raycaster(backLeftWheelCenterPoint, backLeftWheelBottomPoint.sub(backLeftWheelCenterPoint).clone().normalize());
        var backRightWheelRay = new THREE.Raycaster(backRightWheelCenterPoint, backRightWheelBottomPoint.sub(backRightWheelCenterPoint).clone().normalize());

        // Çizilen doğruların asfalt zemini kesip kesmediğini kontrol ediyoruz
        // Eğer bir doğru asfalt zemini kesmiyorsa, doğrunun merkezinden geçtiği tekerlek de asfalt zeminin üzerinde değil demektir
        var intersectObjectWithFrontLeftWheel = frontLeftWheelRay.intersectObject(this.ground.RaceTrackRoad);
        var intersectObjectWithFrontRightWheelRay = frontRightWheelRay.intersectObject(this.ground.RaceTrackRoad);
        var intersectObjectWithBackLeftWheelRay = backLeftWheelRay.intersectObject(this.ground.RaceTrackRoad);
        var intersectObjectWithBackRightWheelRay = backRightWheelRay.intersectObject(this.ground.RaceTrackRoad);

        // Asfalt zemin üzerinde bulunmayan tekerlek sayısını buluyoruz
        var offRoadWheelCount = 0;

        if (intersectObjectWithFrontLeftWheel.length == 0)
        {
            offRoadWheelCount++;
        }

        if (intersectObjectWithFrontRightWheelRay.length == 0)
        {
            offRoadWheelCount++;
        }

        if (intersectObjectWithBackLeftWheelRay.length == 0)
        {
            offRoadWheelCount++;
        }

        if (intersectObjectWithBackRightWheelRay.length == 0)
        {
            offRoadWheelCount++;
        }

        // Asfalt zemin üzerinde bulunmayan tekerlek sayısına göre arabanın ulaşabileceği maksimum hız limitini belirliyoruz
        switch (offRoadWheelCount)
        {
            case 0:
                this.MaxOffRoadSpeed = 9999;
                break;
            case 1:
                this.MaxOffRoadSpeed = 125;
                break;
            case 2:
                this.MaxOffRoadSpeed = 100;
                break;
            case 3:
                this.MaxOffRoadSpeed = 75;
                break;
            case 4:
                this.MaxOffRoadSpeed = 50;
                break;
        }
    },
    CheckBarrierCollision: function (deltaTime)
    {
        // Ray Casting masraflı bir işlem olduğu için, bu işlemi saniyede 60 kere değil, 0.05 saniyede bir kez gerçekleştiriyoruz
        if (this.CheckBarrierCollisionDeltaTime < 0.05)
        {
            this.CheckBarrierCollisionDeltaTime += deltaTime;

            return;
        }

        this.CheckBarrierCollisionDeltaTime = 0;

        // Çarpışmayı denetlemek için öncelikle arabada önceden seçtiğimiz dokuz noktanın global koordinat değerlerini buluyoruz
        var centerPoint = this.Element.localToWorld(this.CenterPoint.clone());
        var frontPoint = this.Element.localToWorld(this.FrontPoint.clone());
        var frontLeftPoint = this.Element.localToWorld(this.FrontLeftPoint.clone());
        var frontRightPoint = this.Element.localToWorld(this.FrontRightPoint.clone());
        var backPoint = this.Element.localToWorld(this.BackPoint.clone());
        var backLeftPoint = this.Element.localToWorld(this.BackLeftPoint.clone());
        var backRightPoint = this.Element.localToWorld(this.BackRightPoint.clone());
        var leftPoint = this.Element.localToWorld(this.LeftPoint.clone());
        var rightPoint = this.Element.localToWorld(this.RightPoint.clone());

        // 8 yön için doğrultu vektörleri tanımlıyoruz
        var frontPointDirectionVector = frontPoint.sub(centerPoint);
        var frontLeftPointDirectionVector = frontLeftPoint.sub(centerPoint);
        var frontRightPointDirectionVector = frontRightPoint.sub(centerPoint);
        var backPointDirectionVector = backPoint.sub(centerPoint);
        var backLeftPointDirectionVector = backLeftPoint.sub(centerPoint);
        var backRightPointDirectionVector = backRightPoint.sub(centerPoint);
        var leftPointDirectionVector = leftPoint.sub(centerPoint);
        var rightPointDirectionVector = rightPoint.sub(centerPoint);

        // Arabanın merkezinden 8 yöne doğrular çiziyoruz
        var frontPointRay = new THREE.Raycaster(centerPoint, frontPointDirectionVector.clone().normalize());
        var frontLeftPointRay = new THREE.Raycaster(centerPoint, frontLeftPointDirectionVector.clone().normalize());
        var frontRightPointRay = new THREE.Raycaster(centerPoint, frontRightPointDirectionVector.clone().normalize());
        var backPointRay = new THREE.Raycaster(centerPoint, backPointDirectionVector.clone().normalize());
        var backLeftPointRay = new THREE.Raycaster(centerPoint, backLeftPointDirectionVector.clone().normalize());
        var backRightPointRay = new THREE.Raycaster(centerPoint, backRightPointDirectionVector.clone().normalize());
        var leftPointRay = new THREE.Raycaster(centerPoint, leftPointDirectionVector.clone().normalize());
        var rightPointRay = new THREE.Raycaster(centerPoint, rightPointDirectionVector.clone().normalize());

        // Çizilen doğruların bariyer ile kesişme noktasını buluyoruz
        var intersectObjectWithFrontPointRay = frontPointRay.intersectObject(this.ground.RaceTrackBarrier);
        var intersectObjectWithFrontLeftPointRay = frontLeftPointRay.intersectObject(this.ground.RaceTrackBarrier);
        var intersectObjectWithFrontRightPointRay = frontRightPointRay.intersectObject(this.ground.RaceTrackBarrier);
        var intersectObjectWithBackPointRay = backPointRay.intersectObject(this.ground.RaceTrackBarrier);
        var intersectObjectWithBackLeftPointRay = backLeftPointRay.intersectObject(this.ground.RaceTrackBarrier);
        var intersectObjectWithBackRightPointRay = backRightPointRay.intersectObject(this.ground.RaceTrackBarrier);
        var intersectObjectWithLeftPointRay = leftPointRay.intersectObject(this.ground.RaceTrackBarrier);
        var intersectObjectWithRightPointRay = rightPointRay.intersectObject(this.ground.RaceTrackBarrier);


        // Eğer kesişme mesafesi, merkez ile seçilen nokta mesafesinden küçük veya eşitse, çarpışma yaşanmıştır kabul ediyoruz ve gerekli aksiyonları alıyoruz

        // Ön tampona çarptıysa vitesi geriye alıp, devri yarıya düşürüyoruz. Bu bize geri sekme görüntüsü sağlayacak
        if (intersectObjectWithFrontPointRay.length > 0 && intersectObjectWithFrontPointRay[0].distance <= frontPointDirectionVector.length())
        {
            if (this.Speed > 0)
            {
                this.Shift = -1;
            }
        }

        // Sol-ön kısma çarptıysa arabayı hafif sağa taşıyor ve sağa döndürüyoruz
        if (intersectObjectWithFrontLeftPointRay.length > 0 && intersectObjectWithFrontLeftPointRay[0].distance <= frontLeftPointDirectionVector.length())
        {
            if (this.Speed > 0)
            {
                this.Element.translateX(0.05);

                this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 60);
            }
        }

        // Sağ-ön kısma çarptıysa arabayı hafif sola taşıyor ve sola  döndürüyoruz
        if (intersectObjectWithFrontRightPointRay.length > 0 && intersectObjectWithFrontRightPointRay[0].distance <= frontRightPointDirectionVector.length())
        {
            if (this.Speed > 0)
            {
                this.Element.translateX(-0.05);

                this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 60);
            }
        }

        // Arka tampona çarptıysa vitesi bire alıp, devri yarıya düşürüyoruz. Bu bize geri sekme görüntüsü sağlayacak
        if (intersectObjectWithBackPointRay.length > 0 && intersectObjectWithBackPointRay[0].distance <= backPointDirectionVector.length())
        {
            if (this.Speed < 0)
            {
                this.Shift = 1;
                this.EngineCycle /= 2;
            }
        }

        // Sol-arka kısma çarptıysa arabayı hafif sola taşıyor ve sola  döndürüyoruz
        if (intersectObjectWithBackLeftPointRay.length > 0 && intersectObjectWithBackLeftPointRay[0].distance <= backLeftPointDirectionVector.length())
        {
            if (this.Speed < 0)
            {
                this.Element.translateX(-0.05);

                this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 60);
            }
        }

        // Sağ-arka kısma çarptıysa arabayı hafif sağa taşıyor ve sağa döndürüyoruz
        if (intersectObjectWithBackRightPointRay.length > 0 && intersectObjectWithBackRightPointRay[0].distance <= backRightPointDirectionVector.length())
        {
            if (this.Speed < 0)
            {
                this.Element.translateX(0.05);

                this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 60);
            }
        }

        // Sol kısma çarptıysa arabayı hafif sağa taşıyoruz
        if (intersectObjectWithLeftPointRay.length > 0 && intersectObjectWithLeftPointRay[0].distance <= leftPointDirectionVector.length())
        {
            this.Element.translateX(0.1);
        }

        // Sağ kısma çarptıysa arabayı hafif sola taşıyoruz
        if (intersectObjectWithRightPointRay.length > 0 && intersectObjectWithRightPointRay[0].distance <= rightPointDirectionVector.length())
        {
            this.Element.translateX(-0.1);
        }
    },
    CheckShiftChange: function ()
    {
        // Sadece ileri viteslerde otomatik vites geçiş kontrolü var
        if (this.Shift > 0)
        {
            if (this.ShiftSpecs[this.Shift].UpCycle != null && this.EngineCycle >= this.ShiftSpecs[this.Shift].UpCycle)
            {
                // Vitesi arttırıp devri düşürüyoruz
                this.EngineCycle = this.ShiftSpecs[this.Shift].AfterUpCycle;

                this.Shift++;
            }
            else if (this.ShiftSpecs[this.Shift].DownCycle != null && this.EngineCycle <= this.ShiftSpecs[this.Shift].DownCycle)
            {
                // Vitesi azaltıp devri yükseltiyoruz
                this.EngineCycle = this.ShiftSpecs[this.Shift].AfterDownCycle;

                this.Shift--;
            }
        }
    },
    CalculateSpeed: function ()
    {
        // Bu metotta, motor devri ve vitese göre aracın hızı hesaplanıyor

        if (this.Shift == 0)
        {
            // Vites boşta iken araç duruyor
            // Henüz manuel vites olmadığından, boşta yokuş aşağı salma formülümüz yok
            return 0;
        }

        var rate = 0;

        if (this.Shift == -1)
        {
            rate = -1 * this.ShiftSpecs[0].ShiftRate;
        }
        else
        {
            rate = this.ShiftSpecs[this.Shift].ShiftRate;
        }

        return Math.round(this.EngineCycle / rate);
    },
    FindDirection: function ()
    {
        // Arabanın gittiği yönü buluyoruz

        if (this.Speed > 0)
        {
            return this.FORWARD;
        }
        else if (this.Speed < 0)
        {
            return this.BACKWARD;
        }
        else
        {
            return this.NONE;
        }
    },
    Move: function (deltaTime)
    {
        // Arabayı belirtilen hızda, locak z ekseninde hareket ettiriyoruz
        // Hızımız km/h olduğu için, 3,6'ya bölerek m/sn'ye çeviriyoruz
        // Çünkü metrik koordinat sisteminde her koordinatı 1 metreye karşılık geliyor diye kabul etmiştik
        this.Element.translateZ(-1 * this.Speed / (3.6 / deltaTime));
    },
    TurnLeft: function (handbreak, deltaTime)
    {
        // Hızdan bağımsız şekilde ön tekerlekleri sola doğru çeviriyoruz
        if (this.FrontWheelAngle < 0.6)
        {
            var angle = (Math.PI / 8) * deltaTime;

            // Eğer tekerlek hali hazırda ters tarafa dönük duruyorsa, düzelene kadar daha hızlı çeviriyoruz
            if (this.FrontWheelAngle < 0)
            {
                angle *= 8;
            }

            this.FrontWheelAngle += angle;

            this.FrontLeftWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
            this.FrontRightWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
        }

        // Eğer araba hareket ediyorsa, dönüş hareketini gerçekleştiriyoruz
        if (this.Speed != 0)
        {
            // Dönüş açısını hesaplıyoruz
            var angle = this.FrontWheelAngle * 2 * deltaTime;

            // Suni dönüş görüntüsünü engellemek için çok düşük hızlarda dönüş açısını kademeli olarak düşürüyoruz
            if (Math.abs(this.Speed) < 5)
            {
                angle /= 4;
            }
            else if (Math.abs(this.Speed) < 10)
            {
                angle /= 2;
            }
            else if (Math.abs(this.Speed) < 20)
            {
                angle /= 1.5;
            }
            else if (Math.abs(this.Speed) < 30)
            {
                angle /= 1.2;
            }

            // El frenine basılı olduğu takdirde dönüş açısını iki katına çıkarıyoruz
            if (handbreak)
            {
                angle *= 2;
            }

            // Geri giderken arabanın burnu ters tarafa dönmeli
            if (this.Speed < 0)
            {
                angle *= -1;
            }

            this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);

            // Dönüş sırasında arabanın gövdesini eğiyoruz
            if (this.CarBodyBendingForTurn == this.NONE)
            {
                this.CarBodyBendingForTurn = this.RIGHT;

                this.CarBodyContainerForTurnBending.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1 * Math.PI / 180);
            }
        }
    },
    TurnRight: function (handbreak, deltaTime)
    {
        // Hızdan bağımsız şekilde ön tekerlekleri sağa doğru çeviriyoruz
        if (this.FrontWheelAngle > -0.6)
        {
            var angle = -1 * (Math.PI / 8) * deltaTime;

            // Eğer tekerlek hali hazırda ters tarafa dönük duruyorsa, düzelene kadar daha hızlı çeviriyoruz
            if (this.FrontWheelAngle > 0)
            {
                angle *= 8;
            }

            this.FrontWheelAngle += angle;

            this.FrontLeftWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
            this.FrontRightWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
        }

        // Eğer araba hareket ediyorsa, dönüş hareketini gerçekleştiriyoruz
        if (this.Speed != 0)
        {
            // Dönüş açısını hesaplıyoruz
            var angle = this.FrontWheelAngle * 2 * deltaTime;

            // Suni dönüş görüntüsünü engellemek için çok düşük hızlarda dönüş açısını kademeli olarak düşürüyoruz
            if (Math.abs(this.Speed) < 5)
            {
                angle /= 4;
            }
            else if (Math.abs(this.Speed) < 10)
            {
                angle /= 2;
            }
            else if (Math.abs(this.Speed) < 20)
            {
                angle /= 1.5;
            }
            else if (Math.abs(this.Speed) < 30)
            {
                angle /= 1.2;
            }

            // El frenine basılı olduğu takdirde dönüş açısını iki katına çıkarıyoruz
            if (handbreak)
            {
                angle *= 2;
            }

            // Geri giderken arabanın burnu ters tarafa dönmeli
            if (this.Speed < 0)
            {
                angle *= -1;
            }

            this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);

            // Dönüş sırasında arabanın gövdesini eğiyoruz
            if (this.CarBodyBendingForTurn == this.NONE)
            {
                this.CarBodyBendingForTurn = this.LEFT;

                this.CarBodyContainerForTurnBending.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 180);
            }
        }
    },
    RotateWheels: function (deltaTime)
    {
        // Aracın hızına ve tekerleğin çevre ölçüsüne göre dönülmesi gereken açıyı hesaplıyoruz
        var angle = (this.Speed / 3.6) / (2 * 0.325 * Math.PI) * deltaTime * 2 * Math.PI;

        //Dört tekerleği de bulunan açıda döndürüyoruz
        this.FrontLeftWheel.rotateOnAxis(new THREE.Vector3(0, 0, 1), angle);
        this.BackLeftWheel.rotateOnAxis(new THREE.Vector3(0, 0, 1), angle);

        // Sağdaki tekerlekler 180 derece çevrilmiş olduğu için, tam ters açıda döndürüyoruz
        this.FrontRightWheel.rotateOnAxis(new THREE.Vector3(0, 0, 1), -1 * angle);
        this.BackRightWheel.rotateOnAxis(new THREE.Vector3(0, 0, 1), -1 * angle);
    },
    LightOn: function ()
    {
        // Arabanın ışıklarını yakmak için, ışık modellerini uygun renkli MeshBasicMaterial ile kaplıyoruz
        this.FrontLight.material = new THREE.MeshBasicMaterial({ color: 0xffffff });

        this.BackLight.material = new THREE.MeshBasicMaterial({ color: 0x990000 });

        this.LightsOn = true;
    },
    LightOff: function ()
    {
        // Arabanın ışıklarını söndürmek için, ışık modellerini gri renkli MeshBasicMaterial ile kaplıyoruz
        this.FrontLight.material = new THREE.MeshPhongMaterial({ color: 0x777777 });

        this.BackLight.material = new THREE.MeshPhongMaterial({ color: 0x777777 });

        this.LightsOn = false;
    },
    TurnBreakLightOn: function ()
    {
        // Arabanın fren ışıklarını yakmak için, arka ışık modelini kırmızı renkli MeshBasicMaterial ile kaplıyoruz
        this.BackLight.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    },
    TurnBreakLightOff: function ()
    {
        // Arabanın fren ışıklarını söndürmek için, arka ışık modelini duruma göre koyu kırmızı veya gri renkli MeshBasicMaterial ile kaplıyoruz
        if (this.BackLight != null)
        {
            if (this.LightsOn)
            {
                this.BackLight.material = new THREE.MeshBasicMaterial({ color: 0x990000 });
            }
            else
            {
                this.BackLight.material = new THREE.MeshBasicMaterial({ color: 0x777777 });
            }
        }
    },
    WriteCycle: function ()
    {
        // Devir göstergesini dolduruyoruz
        $("#Tachometer").text("Cycle : " + this.EngineCycle + " rpm");
    },
    WriteSpeed: function ()
    {
        // Hız göstergesini dolduruyoruz
        $("#Speedometer").text("Speed : " + this.Speed + " km/h");
    },
    WriteShift: function ()
    {
        // Vites indikatörünü, insan evladının anlayacağı şekilde dolduruyoruz

        var text;

        if (this.Shift == -1)
        {
            text = "R";
        }
        else if (this.Shift == 0)
        {
            text = "N";
        }
        else
        {
            text = this.Shift.toString();
        }

        $("#ShiftIndicator").text("Shift : " + text);
    }
});