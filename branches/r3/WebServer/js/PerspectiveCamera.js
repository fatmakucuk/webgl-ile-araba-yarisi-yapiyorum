can.Construct("CarGame.PerspectiveCamera", {}, {
    Element: null,
    init: function ()
    {
        var aspectRatio = $("#Container").width() / $("#Container").height();

        // 45mm'lik bir kamera kullanıyoruz. Görüş mesafesi 2km
        this.Element = new THREE.PerspectiveCamera(45, aspectRatio, 0.01, 2000);

        this.Element.position.set(0, 10, 20);

        this.Element.lookAt(new THREE.Vector3(0, 5, 0));
    }
});