can.Construct("CarGame.Light", {}, {
    Element: null,
    init: function ()
    {
        // Işık grubumuz
        this.Element = new THREE.Object3D();

        // Gölge düşüren Spot ışığımız
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);

        directionalLight.position.set(25, 58, 5);

        directionalLight.target.position.set(0, 0, 0);

        directionalLight.castShadow = true;

        // Gölge koyuluğu
        directionalLight.shadowDarkness = 0.5;

        // Gölge çözünürlüğü
        directionalLight.shadowMapWidth = 2048;
        directionalLight.shadowMapHeight = 2048;

        // Gölge düşürülecek alan boyutu
        directionalLight.shadowCameraNear = 2;
        directionalLight.shadowCameraFar = 500;
        directionalLight.shadowCameraLeft = -100;
        directionalLight.shadowCameraRight = 100;
        directionalLight.shadowCameraTop = 100;
        directionalLight.shadowCameraBottom = -100;

        this.Element.add(directionalLight);
        

        // Sahne ışığımız
        var hemisphereLight = new THREE.HemisphereLight(0x454545, 0x454545, 2);

        this.Element.add(hemisphereLight);
    }
});