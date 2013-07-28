can.Construct("CarGame.Light", {}, {
    Element: null,
    DirectionalLight: null,
    init: function ()
    {
        // Işık grubumuz
        this.Element = new THREE.Object3D();

        // Gölge düşüren Spot ışığımız
        this.DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.7);

        this.DirectionalLight.position.set(0, 500, 0);

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
        var hemisphereLight = new THREE.HemisphereLight(0x454545, 0x454545, 2);

        this.Element.add(hemisphereLight);
    },
    Animate: function (car)
    {
        // Işığın sahnedeki hedefini, arabanın konumuna göre ayarlıyoruz
        this.SetLightTarget(car);
    },
    SetLightTarget: function (car)
    {
        // Işığın sahnedeki hedefini, arabanın konumuna göre ayarlıyoruz
        this.DirectionalLight.target.position = car.Element.position;
    }
});