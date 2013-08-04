/// <reference path="../libs/jquery.min.js" />
/// <reference path="../libs/can.jquery.min.js" />
/// <reference path="../libs/three.min.js" />

can.Construct("CarGame.Ground", {}, {
    Element: null,

    // Yüklemesi beklenen model sayısı
    RemainingModelCount: 1,

    init: function ()
    {
        this.Element = new THREE.Object3D();

        var jsonLoader = new THREE.JSONLoader();

        // Yarış pisti modelimizi yüklüyoruz
        jsonLoader.load("models/RaceTrack.js", this.RaceTrackModelLoaded, "texture");

        // Yüzeyin üzerine gölge düşeceğini belirtiyoruz
        this.Element.receiveShadow = true;

    },
    RaceTrackModelLoaded: function (geometry, materials)
    {
        // RaceTrack.js dosyasının yüklenmesi tamamlandığı zaman bu metot işletilir
        // Yüklenen modeli nesnemize ekliyoruz
        var material = new THREE.MeshFaceMaterial(materials);

        var raceTrack = new THREE.Mesh(geometry, material);

        this.ground.Element.add(raceTrack);

        // Yüklemesi beklenen model sayısını bir azaltıyoruz
        this.ground.RemainingModelCount--
    }
});