can.Construct("CarGame.Ground", {}, {
    Element: null,
    init: function ()
    {
        // ileride, üzerinde ağaçların ve diğer güzelliklerin bulunduğu pistimizi içerecek olacan
        // 1km x 1km boyutlarındaki yüzeyiğimizi tanımlıyoruz ve rengini gri renge boyuyoruz
        this.Element = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 1, 1),
                                      new THREE.MeshLambertMaterial({ color: 0x777777 }));

        // Yüzey sahneye dik olarak eklendiğinden, 90 derece yana yatırıyoruz
        this.Element.rotation.x = -1 * Math.PI / 2;

        // Yüzeyin üzerine gölge düşeceğini belirtiyoruz
        this.Element.receiveShadow = true;
    }
});