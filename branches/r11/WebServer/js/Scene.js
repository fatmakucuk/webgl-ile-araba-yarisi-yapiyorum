/// <reference path="../libs/jquery.min.js" />
/// <reference path="../libs/can.jquery.min.js" />
/// <reference path="../libs/three.min.js" />

can.Construct("CarGame.Scene", {}, {
    Renderer: null,
    Element: null,
    init: function (stats)
    {
        this.AddRenderContainer();

        this.AddKeyboardHint();

        this.AddTachometer();

        this.AddSpeedometer();

        this.AddShiftIndicator();

        this.AddStatsGadget();

        this.AddSplashScreen();

        this.PrepareScene();
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
    },
    AddSplashScreen: function ()
    {
        // HTML'e, üzerine Render edilmiş görüntüleri yansıtacağımız ve tüm sayfayı kaplayan bir Div ekliyoruz
        $("body").append("<div id='SplashScreen' />");

        var splashScreen = $("#SplashScreen");

        splashScreen.append("<div id='SplashScreenText'>Yükleniyor, lütfen bekleyiniz...</div>");

        splashScreen.css("position", "absolute");
        splashScreen.css("left", "0px");
        splashScreen.css("top", "0px");
        splashScreen.css("width", "100%");
        splashScreen.css("height", "100%");
        splashScreen.css("overflow", "hidden");
        splashScreen.css("backgroundColor", "#000000");
        splashScreen.css("display", "table");

        var splashScreenText = $("#SplashScreenText");

        splashScreenText.css("display", "table-cell");
        splashScreenText.css("verticalAlign", "middle");
        splashScreenText.css("textAlign", "center");
        splashScreenText.css("color", "#ffffff");
        
    },
    AddRenderContainer: function ()
    {
        // HTML'e, üzerine Render edilmiş görüntüleri yansıtacağımız ve tüm sayfayı kaplayan bir Div ekliyoruz
        $("body").append("<div id='Container' />");

        var container = $("#Container");

        container.css("position", "absolute");
        container.css("left", "0px");
        container.css("top", "0px");
        container.css("width", "100%");
        container.css("height", "100%");
        container.css("overflow", "hidden");
    },
    AddKeyboardHint: function ()
    {
        // HTML'e, klavyedeki geçerli tuşları gösteren bir Div ekliyoruz
        $("body").append("<span id='KeyboardHint' />");

        var KeyboardHint = $("#KeyboardHint");

        KeyboardHint.css("position", "absolute");
        KeyboardHint.css("left", "10px");
        KeyboardHint.css("top", "250px");
        KeyboardHint.css("color", "#ffff00");

        KeyboardHint.append("Kontrol Tuşları<br>");
        KeyboardHint.append("----------------------------------------------<br>");
        KeyboardHint.append("Yön Tuşları : Gaz, Fren, Sol, Sağ<br>");
        KeyboardHint.append("Ctrl : El freni<br>");
        KeyboardHint.append("<br>");
        KeyboardHint.append("1 : Arkadan takip eden kamera<br>");
        KeyboardHint.append("2 : Arkadan ve yüksekten takip eden kamera<br>");
        KeyboardHint.append("3 : Tampon kamerası<br>");
        KeyboardHint.append("4 : Ön kaput üstü kamerası<br>");
        KeyboardHint.append("5 : Alçak perspektif kamera<br>");
        KeyboardHint.append("6 : Yüksek perspektif kamera<br>");
        KeyboardHint.append("<br>");
        KeyboardHint.append("d : Gündüz ışıklandırması<br>");
        KeyboardHint.append("n : Gece ışıklandırması<br>");

    },
    AddTachometer: function ()
    {
        // HTML'e, araç motor devir göstergesi yerine geçecek bir Div ekliyoruz
        $("body").append("<span id='Tachometer' />");

        var Tachometer = $("#Tachometer");

        Tachometer.css("position", "absolute");
        Tachometer.css("left", (window.innerWidth - 120) + "px");
        Tachometer.css("top", "20px");
        Tachometer.css("color", "#ff00ff");
    },
    AddSpeedometer: function ()
    {
        // HTML'e, araç hız göstergesi yerine geçecek bir Div ekliyoruz
        $("body").append("<span id='Speedometer' />");

        var Speedometer = $("#Speedometer");

        Speedometer.css("position", "absolute");
        Speedometer.css("left", (window.innerWidth - 120) + "px");
        Speedometer.css("top", "50px");
        Speedometer.css("color", "#ff00ff");
    },
    AddShiftIndicator: function ()
    {
        // HTML'e, araç vites göstergesi yerine geçecek bir Div ekliyoruz
        $("body").append("<span id='ShiftIndicator' />");

        var ShiftIndicator = $("#ShiftIndicator");

        ShiftIndicator.css("position", "absolute");
        ShiftIndicator.css("left", (window.innerWidth - 120) + "px");
        ShiftIndicator.css("top", "80px");
        ShiftIndicator.css("color", "#ff00ff");
    },
    AddStatsGadget: function ()
    {
        // HTML'e, oyunun performans istatistiklerini gösterecek bir Div ekliyoruz
        $("body").append("<div id='Stats' />");

        var statsDiv = $("#Stats");

        statsDiv.css("position", "absolute");
        statsDiv.css("left", "0px");
        statsDiv.css("top", "0px");

        statsDiv.append(stats.domElement);
    },
    PrepareScene: function ()
    {
        // Render işleminden sorumlu nesnemizi tanımlıyoruz
        this.Renderer = new THREE.WebGLRenderer({ antialias: true });

        var container = $("#Container");

        this.Renderer.setSize(container.width(), container.height());

        this.Renderer.shadowMapEnabled = true;

        // Gölgelerin daha yumuşak Render edilmesini sağlıyoruz
        this.Renderer.shadowMapSoft = true;
        this.Renderer.shadowMapType = THREE.PCFSoftShadowMap

        // Render çıktısını gösterecek yüzeyi Container Div içerisine yerleştiriyoruz
        container.append(this.Renderer.domElement);

        // Sahnemizi tanımlıyoruz
        this.Element = new THREE.Scene();
    }
});