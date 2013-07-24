can.Construct("CarGame.PerspectiveCamera", {}, {
    Element: null,
    init: function ()
    {
        var aspectRatio = $("#Container").width() / $("#Container").height();

        this.Element = new THREE.PerspectiveCamera(45, aspectRatio, 0.01, 2000);

        this.Element.position.set(0, 10, 20);

        this.Element.lookAt(new THREE.Vector3(0, 5, 0));
    }
});