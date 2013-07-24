can.Construct("CarGame.Car", {}, {
    Element: null,
    Shift: 1,
    Speed: 0,
    ShiftSpecs: [{ Shift: "R", Min: -50, Max: 1 },
                 { Shift: "1", Min: 0, Max: 49 },
                 { Shift: "2", Min: 30, Max: 109 },
                 { Shift: "3", Min: 90, Max: 159 },
                 { Shift: "4", Min: 140, Max: 209 },
                 { Shift: "5", Min: 190, Max: 259 },
                 { Shift: "6", Min: 240, Max: 340 }],
    AccelerationSpecs: [{ Min: 0, Max: 10, Acceleration: 50 },
                        { Min: 10, Max: 20, Acceleration: 25 },
                        { Min: 20, Max: 30, Acceleration: 14.29 },
                        { Min: 30, Max: 40, Acceleration: 10 },
                        { Min: 40, Max: 50, Acceleration: 7.69 },
                        { Min: 50, Max: 60, Acceleration: 6.25 },
                        { Min: 60, Max: 70, Acceleration: 5 },
                        { Min: 70, Max: 80, Acceleration: 4.17 },
                        { Min: 80, Max: 90, Acceleration: 3.57 },
                        { Min: 90, Max: 100, Acceleration: 3.03 },
                        { Min: 100, Max: 110, Acceleration: 2.63 },
                        { Min: 110, Max: 120, Acceleration: 2.27 },
                        { Min: 120, Max: 130, Acceleration: 2 },
                        { Min: 130, Max: 140, Acceleration: 1.75 },
                        { Min: 140, Max: 150, Acceleration: 1.56 },
                        { Min: 150, Max: 160, Acceleration: 1.37 },
                        { Min: 160, Max: 170, Acceleration: 1.2 },
                        { Min: 170, Max: 180, Acceleration: 1.06 },
                        { Min: 180, Max: 190, Acceleration: 0.94 },
                        { Min: 190, Max: 200, Acceleration: 0.84 },
                        { Min: 200, Max: 210, Acceleration: 0.75 },
                        { Min: 210, Max: 220, Acceleration: 0.66 },
                        { Min: 220, Max: 230, Acceleration: 0.58 },
                        { Min: 230, Max: 240, Acceleration: 0.52 },
                        { Min: 240, Max: 250, Acceleration: 0.45 },
                        { Min: 250, Max: 260, Acceleration: 0.4 },
                        { Min: 260, Max: 270, Acceleration: 0.35 },
                        { Min: 270, Max: 280, Acceleration: 0.31 },
                        { Min: 280, Max: 290, Acceleration: 0.27 },
                        { Min: 290, Max: 300, Acceleration: 0.24 },
                        { Min: 300, Max: 310, Acceleration: 0.21 },
                        { Min: 310, Max: 320, Acceleration: 0.19 },
                        { Min: 320, Max: 330, Acceleration: 0.16 },
                        { Min: 330, Max: 340, Acceleration: 0.14 }],
    init: function ()
    {
        this.Element = new THREE.Object3D();

        var jsonLoader = new THREE.JSONLoader();

        jsonLoader.load("models/CarBody.js", this.CarBodyModelLoaded);

        jsonLoader.load("models/CarWheel.js", this.CarWheelModelLoaded);

        this.Element.position.set(0, 1.07, 0);

        // Açılışta şık dursun diye arabayı 45 derece çeviriyoruz
        this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);
    },
    CarBodyModelLoaded: function (geometry, materials)
    {
        var material = new THREE.MeshFaceMaterial(materials);

        var carBody = new THREE.Mesh(geometry, material);

        carBody.position.set(0, 0, 0);

        carBody.castShadow = true;

        this.car.Element.add(carBody);
    },
    CarWheelModelLoaded: function (geometry, materials)
    {
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
        this.HandleKeyboard(keyboardState, deltaTime);

        this.CheckShiftChange();


        if (this.Speed > 0)
        {
            this.Forward(deltaTime);
        }
        else if (this.Speed < 0)
        {
            this.Backward(deltaTime);
        }

        $("#SpeedText").text(Math.round(this.Speed, 2));
        $("#ShiftText").text(this.Shift);
    },
    HandleKeyboard: function (keyboardState, deltaTime)
    {
        if (keyboardState.pressed("up"))
        {
            if (this.Speed > 0)
            {
                this.Speed += this.CalculateAcceleration(this.Shift, this.Speed, false) * deltaTime * 7;
            }
            else
            {
                this.Speed += this.CalculateAcceleration(this.Shift, this.Speed, true) * deltaTime * 7;
            }
        }

        if (keyboardState.pressed("down"))
        {
            if (this.Speed < 0)
            {
                this.Speed -= this.CalculateAcceleration(this.Shift, this.Speed, false) * deltaTime * 7;
            }
            else
            {
                this.Speed -= this.CalculateAcceleration(this.Shift, this.Speed, true) * deltaTime * 7;
            }
        }

        if (this.Speed != 0)
        {
            if (!keyboardState.pressed("up") && !keyboardState.pressed("down"))
            {
                // idle

                if (this.Speed > 0)
                {
                    this.Speed -= 0.25;
                }
                else
                {
                    this.Speed += 0.25;
                }
            }

            if (keyboardState.pressed("left"))
            {
                this.TurnLeft();
            }

            if (keyboardState.pressed("right"))
            {
                this.TurnRight();
            }
        }
    },
    Forward: function (deltaTime)
    {
        this.Element.translateZ(-1 * this.Speed / (3.6 / deltaTime));
    },
    Backward: function (deltaTime)
    {
        this.Element.translateZ(-1 * this.Speed / (3.6 / deltaTime));
    },
    TurnLeft: function ()
    {
        var angle = Math.PI / 180;

        // Geri giderken arabanın burnu ters tarafa dönmeli
        if (this.Speed < 0)
        {
            angle *= -1;
        }

        this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
    },
    TurnRight: function ()
    {
        var angle = -1 * Math.PI / 180;

        // Geri giderken arabanın burnu ters tarafa dönmeli
        if (this.Speed < 0)
        {
            angle *= -1;
        }

        this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
    },
    CheckShiftChange: function ()
    {
        if (this.Speed > this.ShiftSpecs[this.Shift].Max && this.Shift != 6)
        {
            // Güncel hız, güncel vitesin maksimum hızından fazlaysa ve vites zaten 6. viteste değilse, vites arttırımı gerekiyor
            this.Shift++;
        }
        else if (this.Speed < this.ShiftSpecs[this.Shift].Min && this.Shift != 0)
        {
            // Güncel hız, güncel vitesin minimum hızından azsa ve vites zaten geri viteste değilse, vites azaltımı gerekiyor
            this.Shift--;
        }
    },
    CalculateAcceleration: function (shift, speed, forBreak)
    {
        if (forBreak)
        {
            return 10;
        }
        else
        {
            if (shift == 0)
            {
                if (this.Speed > -50)
                {
                    return 5;
                }
                else
                {
                    return -1;
                }
            }

            for (var i = 0; i < this.AccelerationSpecs.length; i++)
            {
                if (speed >= this.AccelerationSpecs[i].Min && speed <= this.AccelerationSpecs[i].Max)
                {
                    return this.AccelerationSpecs[i].Acceleration;
                }
            }

            return 0;
        }
    }
});