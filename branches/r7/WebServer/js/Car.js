﻿can.Construct("CarGame.Car", {}, {
    Element: null,
    CarBody: null,
    CarBodyContainer: null,
    FrontLeftWheel: null,
    FrontRightWheel: null,
    BackLeftWheel: null,
    BackRightWheel: null,
    FrontLeftWheelContainer: null,
    FrontRightWheelContainer: null,
    BackLeftWheelContainer: null,
    BackRightWheelContainer: null,

    // Sabitlerimiz
    NONE: 0,
    FORWARD: 1,
    BACKWARD: -1,
    FRONT: 1,
    BACK: 2,
    LEFT: 3,
    RIGHT: 4,

    // Yüklemesi beklenen model sayısı
    RemainingModelCount: 2,

    // Arabanın güncel vites değeri
    Shift: 0,

    // Arabanın güncel hızı
    Speed: 0,

    // Arabanın güncel motor devri
    EngineCycle: 0,

    // Arabanın ivmelenme sırasındaki eğilme durumları
    CarBodyBendingForBreak: 0,
    CarBodyBendingForTurn: 0,

    // Ön tekerlek yönleri
    FrontWheelWay: 0,

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

    init: function ()
    {
        this.Element = new THREE.Object3D();

        var jsonLoader = new THREE.JSONLoader();

        jsonLoader.load("models/CarBody.js", this.CarBodyModelLoaded);

        jsonLoader.load("models/CarWheel.js", this.CarWheelModelLoaded);

        // Hızlanmayı daha iyi görebilmek için açılışta arabayı biraz sağa çekiyoruz
        this.Element.position.set(10, 1.07, 0);

        // Açılışta şık dursun diye arabayı 45 derece çeviriyoruz
        this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);
    },
    CarBodyModelLoaded: function (geometry, materials)
    {
        // CarBody.js dosyasının yüklenmesi tamamlandığı zaman bu metot işletilir
        // Yüklenen modeli nesnemize ekliyoruz
        var material = new THREE.MeshFaceMaterial(materials);

        this.car.CarBodyContainer = new THREE.Object3D();

        // Arabanın dönüş ekseni olan pivot noktasını arka aksın ortasına getirmek için gövdeyi ileri alıyoruz
        this.car.CarBodyContainer.position.set(0, -0.4, -1.5);

        this.car.CarBody = new THREE.Mesh(geometry, material);

        this.car.CarBody.castShadow = true;

        this.car.CarBodyContainer.add(this.car.CarBody);

        this.car.Element.add(this.car.CarBodyContainer);

        // Yüklemesi beklenen model sayısını bir azaltıyoruz
        this.car.RemainingModelCount--
    },
    CarWheelModelLoaded: function (geometry, materials)
    {
        // CarWheel.js dosyasının yüklenmesi tamamlandığı zaman bu metot işletilir
        // Yüklenen modeli nesnemize ekliyoruz
        var material = new THREE.MeshFaceMaterial(materials);

        // Sol ön tekerlek
        this.car.FrontLeftWheelContainer = new THREE.Object3D();

        this.car.FrontLeftWheelContainer.position.set(-1, -0.72, -3.0);

        this.car.FrontLeftWheel = new THREE.Mesh(geometry, material);

        this.car.FrontLeftWheel.castShadow = true;

        this.car.FrontLeftWheelContainer.add(this.car.FrontLeftWheel);

        this.car.Element.add(this.car.FrontLeftWheelContainer);

        // Sağ ön tekerlek
        this.car.FrontRightWheelContainer = new THREE.Object3D();

        this.car.FrontRightWheelContainer.position.set(1, -0.72, -3.0);

        this.car.FrontRightWheel = new THREE.Mesh(geometry.clone(), material);

        this.car.FrontRightWheel.castShadow = true;

        this.car.FrontRightWheelContainer.add(this.car.FrontRightWheel);

        this.car.Element.add(this.car.FrontRightWheelContainer);

        // Sol arka tekerlek
        this.car.BackLeftWheelContainer = new THREE.Object3D();

        // Arabanın dönüş ekseni olan pivot noktasını arka aksın ortasına getirmek için arka tekerlekleri z = 0'a yerleştiriyoruz
        this.car.BackLeftWheelContainer.position.set(-1, -0.72, 0);

        this.car.BackLeftWheel = new THREE.Mesh(geometry, material);

        this.car.BackLeftWheel.castShadow = true;

        this.car.BackLeftWheelContainer.add(this.car.BackLeftWheel);

        this.car.Element.add(this.car.BackLeftWheelContainer);

        // Sağ arka tekerlek
        this.car.BackRightWheelContainer = new THREE.Object3D();

        // Arabanın dönüş ekseni olan pivot noktasını arka aksın ortasına getirmek için arka tekerlekleri z = 0'a yerleştiriyoruz
        this.car.BackRightWheelContainer.position.set(1, -0.72, 0);

        this.car.BackRightWheel = new THREE.Mesh(geometry.clone(), material);

        this.car.BackRightWheel.castShadow = true;

        this.car.BackRightWheelContainer.add(this.car.BackRightWheel);

        this.car.Element.add(this.car.BackRightWheelContainer);

        // Yüklemesi beklenen model sayısını bir azaltıyoruz
        this.car.RemainingModelCount--;
    },
    Animate: function (keyboardState, deltaTime)
    {
        // (Gerekliyse) Otomatik vites değişimi yapıyoruz
        this.CheckShiftChange();

        // Eğer arabanın gövdesi bir önceki animasyonda fren sebebiyle eğildi ise, eski konumuna geri getiriyoruz
        if (this.CarBodyBendingForBreak != this.NONE)
        {
            if (this.CarBodyBendingForBreak == this.FRONT)
            {
                this.CarBody.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 90);
            }
            else if (this.CarBodyBendingForBreak == this.BACK)
            {
                this.CarBody.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1 * Math.PI / 90);
            }

            this.CarBodyBendingForBreak = this.NONE;
        }

        // Eğer arabanın gövdesi bir önceki animasyonda dönüş sebebiyle eğildi ise, eski konumuna geri getiriyoruz
        if (this.CarBodyBendingForTurn != this.NONE)
        {
            if (this.CarBodyBendingForTurn == this.RIGHT)
            {
                this.CarBodyContainer.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 45);
            }
            else if (this.CarBodyBendingForTurn == this.LEFT)
            {
                this.CarBodyContainer.rotateOnAxis(new THREE.Vector3(0, 0, 1), -1 * Math.PI / 45);
            }

            this.CarBodyBendingForTurn = this.NONE;
        }

        // Eğer arabanın ön tekerlekleri bir önceki animasyonda dönüş sebebiyle döndü ise, eski konumuna geri getiriyoruz
        if (this.FrontWheelWay != this.NONE)
        {
            if (this.FrontWheelWay == this.LEFT)
            {
                this.FrontLeftWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 10);
                this.FrontRightWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 10);
            }
            else if (this.FrontWheelWay == this.RIGHT)
            {
                this.FrontLeftWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 10);
                this.FrontRightWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 10);
            }

            this.FrontWheelWay = this.NONE;
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

        if (direction != this.NONE && !keyboardState.pressed("up") && !keyboardState.pressed("down"))
        {
            // Eğer araba durmuyorsa ve ileri-geri tuşlarına basılmıyorsa, arabanın yavaşlamasını sağlıyoruz
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
    },
    Accelerate: function (deltaTime, direction)
    {
        // Eğer motor maksimum devir sayısına ulaşmadıysa, devir sayısını uygun formüle göre arttırıyoruz
        // Gaza basıldığı takdirde, aracın hızını arttırmıyoruz. Gerçek dünyada olduğu gibi, motor devrini arttırıyoruz
        // Sonradan motor devrine ve vitese göre hız hesaplanıyor
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

                this.CarBody.rotateOnAxis(new THREE.Vector3(1, 0, 0), -1 * Math.PI / 90);
            }
            else if (direction == this.BACKWARD)
            {
                this.CarBodyBendingForBreak = this.BACK;

                this.CarBody.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 90);
            }
        }
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
        // Eğer araba hareket ediyorsa, dönüş hareketini gerçekleştiriyoruz
        if (this.Speed != 0)
        {
            // Dönüş açısını hesaplıyoruz
            var angle = (Math.PI / 40) * Math.sqrt(Math.abs(this.Speed)) * deltaTime;

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

                this.CarBodyContainer.rotateOnAxis(new THREE.Vector3(0, 0, 1), -1 * Math.PI / 45);
            }
        }

        // Hızdan bağımsız şekilde ön tekerlekleri sola doğru çeviriyoruz
        if (this.FrontWheelWay == this.NONE)
        {
            this.FrontLeftWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 10);
            this.FrontRightWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 10);

            this.FrontWheelWay = this.LEFT;
        }
    },
    TurnRight: function (handbreak, deltaTime)
    {
        // Eğer araba hareket ediyorsa, dönüş hareketini gerçekleştiriyoruz
        if (this.Speed != 0)
        {
            // Dönüş açısını hesaplıyoruz
            var angle = -1 * (Math.PI / 40) * Math.sqrt(Math.abs(this.Speed)) * deltaTime;

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

                this.CarBodyContainer.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 45);
            }
        }

        // Hızdan bağımsız şekilde ön tekerlekleri sağa doğru çeviriyoruz
        if (this.FrontWheelWay == this.NONE)
        {
            this.FrontLeftWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 10);
            this.FrontRightWheelContainer.rotateOnAxis(new THREE.Vector3(0, 1, 0), -1 * Math.PI / 10);

            this.FrontWheelWay = this.RIGHT;
        }
    },
    RotateWheels: function (deltaTime)
    {
        // Aracın hızına ve tekerleğin çevre ölçüsüne göre dönülmesi gereken açıyı hesaplıyoruz
        var angle = -1 * (this.Speed / 3.6) / (2 * 0.325 * Math.PI) * deltaTime * 2 * Math.PI;

        //Dört tekerleği de bulunan açıda döndürüyoruz
        this.FrontLeftWheel.rotateOnAxis(new THREE.Vector3(1, 0, 0), angle);
        this.FrontRightWheel.rotateOnAxis(new THREE.Vector3(1, 0, 0), angle);
        this.BackLeftWheel.rotateOnAxis(new THREE.Vector3(1, 0, 0), angle);
        this.BackRightWheel.rotateOnAxis(new THREE.Vector3(1, 0, 0), angle);
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