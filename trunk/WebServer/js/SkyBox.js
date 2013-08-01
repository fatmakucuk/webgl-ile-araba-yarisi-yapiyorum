can.Construct("CarGame.SkyBox", {}, {
    Element: null,
    init: function ()
    {
        // 3D dünyamızın sınırlarını belirleyen 4km yarıçağındaki küremizi tanımlıyoruz ve bulut texture ile kaplıyoruz
        this.Element = new THREE.Mesh(new THREE.SphereGeometry(4000, 3, 3),
                                      new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("texture/clouds.jpg"), side: THREE.BackSide }));
    }
});