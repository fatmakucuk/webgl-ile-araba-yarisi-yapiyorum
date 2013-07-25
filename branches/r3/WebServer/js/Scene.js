can.Construct("CarGame.Scene", {}, {
    Renderer: null,
    Element: null,
    init: function (stats)
    {
        // HTML'e, üzerine Render edilmiş görüntüleri yansıtacağımız ve tüm sayfayı kaplayan bir Div ekliyoruz
        var body = $("body");

        body.append("<div id='Container' />");

        var container = $("#Container");

        container.css("position", "absolute");
        container.css("left", "0px");
        container.css("top", "0px");
        container.css("width", "100%");
        container.css("height", "100%");
        container.css("overflow", "hidden");
        container.css("zindex", "2");

        body.append("<span id='Tachometer' />");

        var Tachometer = $("#Tachometer");

        Tachometer.css("position", "absolute");
        Tachometer.css("left", (window.innerWidth - 120) + "px");
        Tachometer.css("top", "20px");
        Tachometer.css("zindex", "1");
        Tachometer.css("color", "#ff00ff");

        body.append("<span id='Speedometer' />");
        
        var Speedometer = $("#Speedometer");

        Speedometer.css("position", "absolute");
        Speedometer.css("left", (window.innerWidth - 120) + "px");
        Speedometer.css("top", "50px");
        Speedometer.css("zindex", "1");
        Speedometer.css("color", "#ff00ff");

        body.append("<span id='ShiftIndicator' />");

        var ShiftIndicator = $("#ShiftIndicator");

        ShiftIndicator.css("position", "absolute");
        ShiftIndicator.css("left", (window.innerWidth - 120) + "px");
        ShiftIndicator.css("top", "80px");
        ShiftIndicator.css("zindex", "1");
        ShiftIndicator.css("color", "#ff00ff");

        body.append("<div id='Stats' />");

        var statsDiv = $("#Stats");

        statsDiv.css("position", "absolute");
        statsDiv.css("left", "0px");
        statsDiv.css("top", "0px");
        statsDiv.css("zindex", "1");

        statsDiv.append(stats.domElement);

        this.Renderer = new THREE.WebGLRenderer({ antialias: true });

        this.Renderer.setSize(container.width(), container.height());

        this.Renderer.shadowMapEnabled = true;

        container.append(this.Renderer.domElement);

        this.Element = new THREE.Scene();
    },
    Render: function (camera)
    {
        // Belirtilen kameranın gözünden sahne Render ediliyor
        this.Renderer.render(this.Element, camera);
    },
    Add: function (object)
    {
        // Belirtilen nesne sahneye ekleniyor
        this.Element.add(object.Element);
    }
});