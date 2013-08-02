can.Construct("CarGame.Light", {}, {
    Element: null,
    DirectionalLight: null,
    AmbientLight: null,
    init: function ()
    {
        // Işık grubumuz
        this.Element = new THREE.Object3D();

        // Gölge düşüren Spot ışığımız
        this.DirectionalLight = new THREE.DirectionalLight(0xffffff, 2);

        this.DirectionalLight.position.set(500, 500, 500);

        this.DirectionalLight.castShadow = true;

        // Gölge koyuluğu
        this.DirectionalLight.shadowDarkness = 0.5;

        // Gölge çözünürlüğü
        this.DirectionalLight.shadowMapWidth = 2048;
        this.DirectionalLight.shadowMapHeight = 2048;

        // Gölge düşürülecek alan boyutu
        this.DirectionalLight.shadowCameraNear = 490;
        this.DirectionalLight.shadowCameraFar = 5000;
        this.DirectionalLight.shadowCameraLeft = -100;
        this.DirectionalLight.shadowCameraRight = 100;
        this.DirectionalLight.shadowCameraTop = 100;
        this.DirectionalLight.shadowCameraBottom = -100;

        this.Element.add(this.DirectionalLight);
        

        // Sahne ışığımız
        this.AmbientLight = new THREE.AmbientLight(0x454545);
        
        this.Element.add(this.AmbientLight);
    },
    Animate: function (keyboardState, car)
    {
        // Işığın sahnedeki hedefini, arabanın konumuna göre ayarlıyoruz
        this.SetLightTarget(car);

        this.HandleKeyboard(keyboardState);
    },
    HandleKeyboard: function (keyboardState)
    {
        if (keyboardState.pressed("n"))
        {
            // Gece modu için ışığı kısıyoruz
            this.DirectionalLight.intensity = 0.2;
            this.AmbientLight.visible = false;
        }
        
        if (keyboardState.pressed("d"))
        {
            // Gündüz modu için ışığı açıyoruz
            this.DirectionalLight.intensity = 2;
            this.AmbientLight.visible = true;
        }
    },
    SetLightTarget: function (car)
    {
        // Işığın sahnedeki hedefini, arabanın konumuna göre ayarlıyoruz
        this.DirectionalLight.target.position = car.Element.position;
    }
});