can.Construct("CarGame.Car", {}, {
    Element: null,
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
    HandleKeyboard: function (keyboardState)
    {
        var directionForward = false;
        var directionBack = false;

        if (keyboardState.pressed("up"))
        {
            this.Forward();

            directionForward = true;
        }

        if (keyboardState.pressed("down"))
        {
            this.Backward();

            directionBack = true;
        }

        if (directionForward && !directionBack || !directionForward && directionBack)
        {
            if (keyboardState.pressed("left"))
            {
                this.TurnLeft(directionBack);
            }

            if (keyboardState.pressed("right"))
            {
                this.TurnRight(directionBack);
            }
        }
    },
    Forward: function ()
    {
        this.Element.translateZ(-0.25);
    },
    Backward: function ()
    {
        this.Element.translateZ(0.25);
    },
    TurnLeft: function (directionBack)
    {
        var angle = Math.PI / 180;

        // Geri giderken arabanın burnu ters tarafa dönmeli
        if (directionBack)
        {
            angle *= -1;
        }

        this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
    },
    TurnRight: function (directionBack)
    {
        var angle = -1 * Math.PI / 180;

        // Geri giderken arabanın burnu ters tarafa dönmeli
        if (directionBack)
        {
            angle *= -1;
        }

        this.Element.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
    }
});