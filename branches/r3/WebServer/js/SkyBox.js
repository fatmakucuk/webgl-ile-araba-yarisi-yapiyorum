can.Construct("CarGame.SkyBox", {}, {
    Element: null,
    init: function ()
    {
        // 3D dünyamızın sınırlarını belirleyen 2km x 2km x 2km boyutlarındaki küpümüzü tanımlıyoruz ve rengini gökyüzü rengine boyuyoruz
        this.Element = new THREE.Mesh(new THREE.CubeGeometry(2000, 2000, 2000),
                                      new THREE.MeshBasicMaterial({ color: 0xe0eeee, side: THREE.BackSide }));

        // Belirli bir mesafeden sonrasında gökyüzü renginde sislenme yapıyoruz
        scene.Element.fog = new THREE.FogExp2(0xe0eeee, 0.00025);
    }
});