can.Construct("CarGame.Ground", {}, {
    Element: null,
    init: function ()
    {
        this.Element = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 1, 1),
                                      new THREE.MeshLambertMaterial({ color: 0x777777 }));

        this.Element.position.set(0, -0.5, 0);

        this.Element.rotation.x = -1 * Math.PI / 2;

        this.Element.receiveShadow = true;
    }
});