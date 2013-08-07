/// <reference path="../libs/jquery.min.js" />
/// <reference path="../libs/can.jquery.min.js" />
/// <reference path="../libs/three.min.js" />

can.Construct("CarGame.Light", {}, {
    Element: null,
    DirectionalLight: null,
    AmbientLight: null,
    init: function ()
    {
        // Işık grubumuz
        this.Element = new THREE.Object3D();

        // Gölge düşüren Spot ışığımız
        this.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);

        this.DirectionalLight.position.set(500, 500, -250);

        this.DirectionalLight.castShadow = true;

        // Gölge koyuluğu
        this.DirectionalLight.shadowDarkness = 0.5;

        // Gölge çözünürlüğü
        this.DirectionalLight.shadowMapWidth = 1024;
        this.DirectionalLight.shadowMapHeight = 1024;

        // Gölge düşürülecek alan boyutu
        this.DirectionalLight.shadowCameraNear = 490;
        this.DirectionalLight.shadowCameraFar = 1000;
        this.DirectionalLight.shadowCameraLeft = -10;
        this.DirectionalLight.shadowCameraRight = 10;
        this.DirectionalLight.shadowCameraTop = 10;
        this.DirectionalLight.shadowCameraBottom = -10;

        // Yerdeki gölgeleme problemlerini gidermek için shadowBias değerini biraz arttırıyoruz
        this.DirectionalLight.shadowBias = 0.01;

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
            this.DirectionalLight.intensity = 0.1;
            this.AmbientLight.visible = false;
        }
        
        if (keyboardState.pressed("d"))
        {
            // Gündüz modu için ışığı açıyoruz
            this.DirectionalLight.intensity = 1;
            this.AmbientLight.visible = true;
        }
    },
    SetLightTarget: function (car)
    {
        // Işığın sahnedeki hedefini, arabanın konumuna göre ayarlıyoruz
        this.DirectionalLight.target.position = car.Element.position;
    }
});