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

        body.append("<span id='SpeedText' />");
        
        var speedText = $("#SpeedText");

        speedText.css("position", "absolute");
        speedText.css("left", "100px");
        speedText.css("top", "100px");
        speedText.css("zindex", "1");

        body.append("<span id='ShiftText' />");

        var shiftText = $("#ShiftText");

        shiftText.css("position", "absolute");
        shiftText.css("left", "100px");
        shiftText.css("top", "150px");
        shiftText.css("zindex", "1");

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