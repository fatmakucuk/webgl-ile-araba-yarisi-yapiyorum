can.Construct("CarGame.Car", {}, {
    Element: null,

    DIRECTION_FORWARD: 1,
    DIRECTION_NONE: 0,
    DIRECTION_BACKWARD: -1,

    Shift: 1,
    Speed: 0,
    EngineCycle: 0,
    MaxCycle: 8000,

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

        this.Element.position.set(10, 1.07, 0);

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
        this.CheckShiftChange();

        this.HandleKeyboard(keyboardState, deltaTime);

        this.Speed = this.CalculateSpeed(this.Shift, this.EngineCycle);

        if (this.Speed > 0)
        {
            this.Forward(deltaTime);
        }
        else if (this.Speed < 0)
        {
            this.Backward(deltaTime);
        }
        else
        {
            // Araba duruyorken vitesi boşa alıyoruz ki, baskı balataları erimesin
            this.Shift = 0;
        }

        this.WriteCycle();
        this.WriteSpeed();
        this.WriteShift();
    },
    HandleKeyboard: function (keyboardState, deltaTime)
    {
        var direction = this.FindDirection();

        if (direction != this.DIRECTION_NONE && !keyboardState.pressed("up") && !keyboardState.pressed("down"))
        {
            this.SlowDown(deltaTime, direction);
        }

        if (keyboardState.pressed("up"))
        {
            if (direction == this.DIRECTION_FORWARD)
            {
                this.Accelerate(deltaTime, direction);
            }
            else if (direction == this.DIRECTION_NONE)
            {
                this.Shift = 1;

                this.Accelerate(deltaTime, direction);
            }
            else
            {
                this.Break(deltaTime, direction);
            }
        }

        if (keyboardState.pressed("down"))
        {
            if (direction == this.DIRECTION_BACKWARD)
            {
                this.Accelerate(deltaTime, direction);
            }
            else if (direction == this.DIRECTION_NONE)
            {
                this.Shift = -1;

                this.Accelerate(deltaTime, direction);
            }
            else
            {
                this.Break(deltaTime, direction);
            }
        }

        if (direction != this.DIRECTION_NONE)
        {
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
    Accelerate: function (deltaTime, direction)
    {
        if (this.EngineCycle < this.MaxCycle)
        {
            if (this.Shift == -1)
            {
                this.EngineCycle += Math.round((10 * this.ShiftSpecs[0].ShiftRate * this.ShiftSpecs[0].ShiftRate * this.ShiftSpecs[0].ShiftRate / (300 + this.EngineCycle)) * deltaTime);
            }
            else
            {
                this.EngineCycle += Math.round((5000 * this.ShiftSpecs[this.Shift].ShiftRate * this.ShiftSpecs[this.Shift].ShiftRate / (2000 + this.EngineCycle * this.Shift)) * deltaTime);
            }
        }
        else
        {
            this.EngineCycle = this.MaxCycle;
        }
    },
    Break: function (deltaTime, direction)
    {
        if (this.EngineCycle > 0)
        {
            this.EngineCycle -= Math.round(7000 * deltaTime);
        }
    },
    SlowDown: function (deltaTime, direction)
    {
        if (this.EngineCycle > 0)
        {
            this.EngineCycle -= Math.round(700 * deltaTime);
        }
    },
    CheckShiftChange: function ()
    {
        // Sadece ileri viteslerde, vites geçiş kontrolü var
        if (this.Shift > 0)
        {
            if (this.ShiftSpecs[this.Shift].UpCycle != null && this.EngineCycle >= this.ShiftSpecs[this.Shift].UpCycle)
            {
                this.EngineCycle = this.ShiftSpecs[this.Shift].AfterUpCycle;

                this.Shift++;
            }
            else if (this.ShiftSpecs[this.Shift].DownCycle != null && this.EngineCycle <= this.ShiftSpecs[this.Shift].DownCycle)
            {
                this.EngineCycle = this.ShiftSpecs[this.Shift].AfterDownCycle;

                this.Shift--;
            }
        }
    },
    CalculateSpeed: function (shift, engineCycle)
    {
        if (shift == 0)
        {
            return 0;
        }

        var multiplier = 0;

        switch (shift)
        {
            case -1:
                multiplier = -1 * this.ShiftSpecs[0].ShiftRate;
                break;
            default:
                multiplier = this.ShiftSpecs[shift].ShiftRate;
                break;
        }

        return Math.round(engineCycle / multiplier);
    },
    FindDirection: function ()
    {
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
    WriteCycle: function ()
    {
        $("#Tachometer").text("Cycle : " + this.EngineCycle + " rpm");
    },
    WriteSpeed: function ()
    {
        $("#Speedometer").text("Speed : " + this.Speed + " km/h");
    },
    WriteShift: function ()
    {
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