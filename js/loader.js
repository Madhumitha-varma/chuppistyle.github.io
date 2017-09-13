/// <reference path="babylon.js" />
var createScene = function() {

var canvas = document.getElementById("renderCanvas");
var totalScreen = document.getElementById("totalScreen");


// UI
var controlPanel = document.getElementById("controlPanel");
var cameraPanel = document.getElementById("cameraPanel");
var divFps = document.getElementById("fps");
var aboutPanel = document.getElementById("aboutPanel");
var enableDebug = document.getElementById("enableDebug");
var status = document.getElementById("status");
var fullscreen = document.getElementById("fullscreen");
var viewCam = document.querySelectorAll(".view");
var camerasList = document.querySelectorAll(".view input");
var toggleAnimate = document.getElementById("animation");
var toggleMove = document.getElementById("move");

var toggleFsaa4 = document.getElementById("toggleFsaa4");
var toggleFxaa = document.getElementById("toggleFxaa");
var toggleBandW = document.getElementById("toggleBandW");
var sceneChecked;

var sceneLocation = "../../../Scenes/";

// Babylon
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);
var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, new BABYLON.Vector3(61.97, -2.72, 23.92), scene);
    camera.setPosition(new BABYLON.Vector3(-68.12, 52.98, -159.90));

//Loader
var loadScene = function (name, incremental, sceneLocation, then) {
    sceneChecked = false;

    BABYLON.SceneLoader.ForceFullSceneLoadingForIncremental = true;

    engine.resize();
    var dlCount = 0;

    BABYLON.SceneLoader.Load(sceneLocation + name + "/", name + incremental + ".babylon", engine, function (newScene) {
        scene = newScene;
    
        scene.executeWhenReady(function () {
            canvas.style.opacity = 1;  
              if (scene.activeCamera) {
                scene.activeCamera = camera;
                scene.activeCamera.attachControl(canvas);
                scene.forcePointsCloud = false;
                scene.activeCamera.alpha += .01;
                scene.activeCamera.beta += .01;
                scene.activeCamera.upperRadiusLimit = 370;
                scene.activeCamera.lowerRadiusLimit = 200;
                scene.activeCamera.wheelPrecision = 1.3;
                scene.activeCamera.upperBetaLimit = 3.10;
                scene.animationsEnabled=false;
                scene.clearColor = new BABYLON.Color4(0,0,0,0);

                var newAnim = scene.registerBeforeRender(function() {
                camera.alpha += 0.00047;
                });

// ОБЯЗАТЕЛЬНО ЗАДЕЙСТВОВАТЬ СВОЙСТВО для меша внутри движка pickable:true!!!  или mesh.isPickable() в коде;
// Все меши собраны в массив scene.meshes и имеет длину lenght как и любой другой массив

                var mesh = scene.getMeshByName("Sol");
                mesh.isPickable = true;
                for (var i = 0; i < scene.meshes.length; i++) {
                    scene.meshes[i].isPickable = true;
                }
                var light = scene.getLightByName("Omni007");
                mesh.actionManager = new BABYLON.ActionManager(scene);
                scene.actionManager = new BABYLON.ActionManager(scene);
                var action = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, mesh, "visibility", 0.7, 1000);
                var action2 = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, mesh, "visibility", 1, 1000);
                var action3 = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnLongPressTrigger, camera, "alpha", -0.1);
                scene.actionManager.registerAction(action3);
                mesh.actionManager.registerAction(action).then(action2);

            }
        });

    },

    function (evt) {
        if (evt.lengthComputable) {
            engine.loadingUIText = "Loading, please wait..." + (evt.loaded * 100 / evt.total).toFixed() + "%";
        } else {
            dlCount = evt.loaded / (1024 * 1024);
            engine.loadingUIText = "Loading, please wait..." + Math.floor(dlCount * 100.0) / 100.0 + " MB already loaded.";
        }
    });
    canvas.style.opacity = 0;
};

//Camera`s test
for (var i = 0; i<camerasList.length; i++){
camerasList[i].addEventListener("click", function() {
    if(camerasList[0].checked){
        scene.forcePointsCloud = false;
        scene.forceWireframe = false;
    }
    else if(camerasList[1].checked){
        scene.forcePointsCloud = false;
        scene.forceWireframe = true;
    }
    else if(camerasList[2].checked){
        scene.forcePointsCloud = true;
        scene.forceWireframe = false;
    };
}); 
}; 


toggleAnimate.addEventListener("click", function(){
    if (toggleAnimate.checked){
        scene.animationsEnabled=true;
        }
    else if (!toggleAnimate.checked){
        scene.animationsEnabled=false;
    };
});

canvas.addEventListener("mousewheel", function() {
    // scene.animationsEnabled=false;
    // scene.forcePointsCloud = false;
    // scene.forceWireframe = false;
    console.log('цель:'+scene.activeCamera.target);
    console.log('позиция:'+scene.activeCamera.position);
});

// Render loop
var renderFunction = function () {
    // Fps
    divFps.innerHTML = engine.getFps().toFixed() + " fps";

    // Render scene
    if (scene) {
        if (!sceneChecked) {
            var remaining = scene.getWaitingItemsCount();
            engine.loadingUIText = "Streaming items..." + (remaining ? (remaining + " remaining") : "");

            if (remaining === 0) {
                sceneChecked = true;
            }            
        }

        scene.render();

        // Streams
        if (scene.useDelayedTextureLoading) {
            var waiting = scene.getWaitingItemsCount();
            if (waiting > 0) {
                status.innerHTML = "Streaming items..." + waiting + " remaining";
            } else {
                status.innerHTML = "";
            }
        }
    }
};

// Launch render loop
engine.runRenderLoop(renderFunction);

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

// UI
var panelIsClosed = true;
var aboutIsClosed = true;

// document.getElementById("clickableTag").addEventListener("click", function () {
//     if (panelIsClosed) {
//         panelIsClosed = false;
//         controlPanel.style.webkitTransform = "translateY(0px)";
//         controlPanel.style.transform = "translateY(0px)";
//     } else {
//         panelIsClosed = true;
//         controlPanel.style.webkitTransform = "translateY(100px)";
//         controlPanel.style.transform = "translateY(100px)";
//     }
// });

document.getElementById("notSupported").addEventListener("click", function () {
document.getElementById("notSupported").className = "hidden";
});

//Debug

// enableDebug.addEventListener("click", function () {
//     if (scene) {
//         if (scene.debugLayer.isVisible()) {
//             scene.debugLayer.hide();
//         } else {
//             scene.debugLayer.show();
//         }
//     }
// });

// fullscreen.addEventListener("click", function () {
//     if (engine) {
//         engine.switchFullscreen(true);
//     }
// });


// Check support
if (!BABYLON.Engine.isSupported()) {
    document.getElementById("notSupported").className = "";
} else {
    if (window.location.hostname.indexOf("localhost") === -1 && !demo.forceLocal) {
        if (demo.doNotUseCDN) {
            sceneLocation = "/Scenes/";
        }
        else {
            sceneLocation = "/Scenes/";
        }
    }

    var mode = "";

    if (demo.incremental) {
        mode = ".incremental";
    } else if (demo.binary) {
        mode = ".binary";
    }

    if (demo.offline) {
        engine.enableOfflineSupport = true;
    }
    else {
        engine.enableOfflineSupport = false;
    }

    loadScene(demo.scene, mode, sceneLocation, function () {
        BABYLON.StandardMaterial.BumpTextureEnabled = true;
        if (demo.collisions !== undefined) {
            scene.collisionsEnabled = demo.collisions;
        }

        if (demo.onload) {
            demo.onload();
        }
    });
};
}();

