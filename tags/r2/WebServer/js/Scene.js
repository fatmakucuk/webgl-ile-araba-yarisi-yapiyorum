can.Construct("CarGame.Scene", {}, {
    Renderer: null,
    Element: null,
    init: function ()
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