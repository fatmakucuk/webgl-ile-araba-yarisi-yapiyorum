can.Construct("CarGame.SkyBox", {}, {
    Element: null,
    init: function ()
    {
        this.Element = new THREE.Mesh(new THREE.CubeGeometry(2000, 2000, 2000),
                                      new THREE.MeshBasicMaterial({ color: 0xe0eeee, side: THREE.BackSide }));

        // Belirli bir mesafeden sonrasında gökyüzü renginde sislenme yapıyoruz
        scene.Element.fog = new THREE.FogExp2(0xe0eeee, 0.00025);
    }
});