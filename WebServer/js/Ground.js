/// <reference path="../libs/jquery.min.js" />
/// <reference path="../libs/can.jquery.min.js" />
/// <reference path="../libs/three.min.js" />

can.Construct("CarGame.Ground", {}, {
    Element: null,
    RaceTrackGrass: null,
    RaceTrackRoad: null,

    // Yüklemesi beklenen model sayısı
    RemainingModelCount: 2,

    init: function ()
    {
        this.Element = new THREE.Object3D();

        var jsonLoader = new THREE.JSONLoader();

        // Yarış pistinin çim zemin modelini yüklüyoruz
        jsonLoader.load("models/RaceTrackGrass.js", this.RaceTrackGrassModelLoaded, "texture");

        // Yarış pistinin yol modelini yüklüyoruz
        jsonLoader.load("models/RaceTrackRoad.js", this.RaceTrackRoadModelLoaded, "texture");

    },
    RaceTrackGrassModelLoaded: function (geometry, materials)
    {
        // RaceTrackGrass.js dosyasının yüklenmesi tamamlandığı zaman bu metot işletilir
        // Yüklenen modeli nesnemize ekliyoruz
        var material = new THREE.MeshFaceMaterial(materials);

        this.ground.RaceTrackGrass = new THREE.Mesh(geometry, material);

        // Çim ve yol modelleri üst üste gelince titreme olmaması için, çim modelini 3 santim aşağı indiriyoruz
        this.ground.RaceTrackGrass.position.y -= 0.03;

        // Yüzeyin üzerine gölge düşeceğini belirtiyoruz
        this.ground.RaceTrackGrass.receiveShadow = true;

        this.ground.Element.add(this.ground.RaceTrackGrass);

        // Yüklemesi beklenen model sayısını bir azaltıyoruz
        this.ground.RemainingModelCount--
    },
    RaceTrackRoadModelLoaded: function (geometry, materials)
    {
        // RaceTrackRoad.js dosyasının yüklenmesi tamamlandığı zaman bu metot işletilir
        // Yüklenen modeli nesnemize ekliyoruz
        var material = new THREE.MeshFaceMaterial(materials);

        this.ground.RaceTrackRoad = new THREE.Mesh(geometry, material);

        // Yüzeyin üzerine gölge düşeceğini belirtiyoruz
        this.ground.RaceTrackRoad.receiveShadow = true;
        
        this.ground.Element.add(this.ground.RaceTrackRoad);

        // Yüklemesi beklenen model sayısını bir azaltıyoruz
        this.ground.RemainingModelCount--
    }
});