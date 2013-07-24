can.Construct("CarGame.Light", {}, {
    Element: null,
    init: function ()
    {
        // Işık grubumuz
        this.Element = new THREE.Object3D();


        // Gölge düşüren Spot ışığımız
        var spotLight = new THREE.SpotLight(0xffffff, 0.7);

        spotLight.position.set(0, 150, 150);

        spotLight.target.position.set(0, 0, 0);

        spotLight.castShadow = true;

        spotLight.shadowDarkness = 0.7;

        this.Element.add(spotLight);
        

        // Sahne ışığımız
        var hemisphereLight = new THREE.HemisphereLight(0x454545, 0x454545, 2);

        this.Element.add(hemisphereLight);
    }
});