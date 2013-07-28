﻿can.Construct("CarGame.Car", {}, {
    Element: null,

    // Sabitlerimiz
    DIRECTION_FORWARD: 1,
    DIRECTION_NONE: 0,
    DIRECTION_BACKWARD: -1,

    // Arabanın güncel vites değeri
    Shift: 0,

    // Arabanın güncel hızı
    Speed: 0,

    // Arabanın güncel motor devri
    EngineCycle: 0,

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

        var carBody = new THREE.Mesh(geometry, material);

        carBody.position.set(0, 0, 0);

        carBody.castShadow = true;

        this.car.Element.add(carBody);
    },
    CarWheelModelLoaded: function (geometry, materials)
    {
        // CarWheel.js dosyasının yüklenmesi tamamlandığı zaman bu metot işletilir
        // Yüklenen modeli nesnemize ekliyoruz
        var material = new THREE.MeshFaceMaterial(materials);

        var frontLeftWheel = new THREE.Mesh(geometry, material);

        frontLeftWheel.position.set(-1, -0.72, -1.5);

        frontLeftWheel.castShadow = true;

        this.car.Element.add(frontLeftWheel);

        var frontRightWheel = new THREE.Mesh(geometry.clone(), material);

        frontRightWheel.position.set(1, -0.72, -1.5);

        frontRightWheel.castShadow = true;

        this.car.Element.add(frontRightWheel);

        var backLeftWheel = new THREE.Mesh(geometry, material);

        backLeftWheel.position.set(-1, -0.72, 1.5);

        backLeftWheel.castShadow = true;

        this.car.Element.add(backLeftWheel);

        var backRightWheel = new THREE.Mesh(geometry.clone(), material);

        backRightWheel.position.set(1, -0.72, 1.5);

        backRightWheel.castShadow = true;

        this.car.Element.add(backRightWheel);
    },
    Animate: function (keyboardState, deltaTime)
    {
        // (Gerekliyse) Otomatik vites değişimi yapıyoruz
        this.CheckShiftChange();

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

        if (direction != this.DIRECTION_NONE && !keyboardState.pressed("up") && !keyboardState.pressed("down"))
        {
            // Eğer araba durmuyorsa ve ileri-geri tuşlarına basılmıyorsa, arabanın yavaşlamasını sağlıyoruz
            this.SlowDown(deltaTime, direction);
        }

        if (keyboardState.pressed("up"))
        {
            if (direction == this.DIRECTION_FORWARD)
            {
                // İleri giden arabanın daha da hızlanmasını sağlıyoruz
                this.Accelerate(deltaTime, direction);
            }
            else if (direction == this.DIRECTION_NONE)
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
            if (direction == this.DIRECTION_BACKWARD)
            {
                // Geri giden arabanın daha da hızlanmasını sağlıyoruz
                this.Accelerate(deltaTime, direction);
            }
            else if (direction == this.DIRECTION_NONE)
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

        if (direction != this.DIRECTION_NONE)
        {
            if (keyboardState.pressed("left"))
            {
                // Eğer araba hareket ediyorsa, sola dönmesini sağlıyoruz
                this.TurnLeft(deltaTime);
            }

            if (keyboardState.pressed("right"))
            {
                // Eğer araba hareket ediyorsa, sağa dönmesini sağlıyoruz
                this.TurnRight(deltaTime);
            }
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
            return this.DIRECTION_FORWARD;
        }
        else if (this.Speed < 0)
        {
            return this.DIRECTION_BACKWARD;
        }
        else
        {
            return this.DIRECTION_NONE;
        }
    },
    Move: function (deltaTime)
    {
        // Arabayı belirtilen hızda, locak z ekseninde hareket ettiriyoruz
        // Hızımız km/h olduğu için, 3,6'ya bölerek m/sn'ye çeviriyoruz
        // Çünkü metrik koordinat sisteminde her koordinatı 1 metreye karşılık geliyor diye kabul etmiştik
        this.Element.translateZ(-1 * this.Speed / (3.6 / deltaTime));
    },
    TurnLeft: function (deltaTime)
    {
        var angle = Math.PI / 3;

        // Geri giderken arabanın burnu ters tarafa dönmeli
        if (this.Speed < 0)
        {
            angle *= -1;
        }

        this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle * deltaTime);
    },
    TurnRight: function (deltaTime)
    {
        var angle = -1 * Math.PI / 3;

        // Geri giderken arabanın burnu ters tarafa dönmeli
        if (this.Speed < 0)
        {
            angle *= -1;
        }

        this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle * deltaTime);
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