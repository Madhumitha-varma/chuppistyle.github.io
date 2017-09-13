function mainScene() {
    var engineSection = document.querySelector("#engine");
    var navSection = document.querySelector("#nav");

    function animateAll() {
        var li = document.querySelectorAll('.nav-tabs li');
        var animate = document.querySelector('.animate-full-with');
        var amimateLi = document.querySelectorAll('.animate-full-with li');

        for (var i = 0; i < li.length; i++) {
            li[i].onclick = function () {
                engineSection.classList.add('off');
                navSection.classList.remove('off');
                animate.style.zIndex = '10';
                for (var e = 0; e < amimateLi.length; e++) {
                    amimateLi[e].classList.add('before');
                    amimateLi[e].style.border = "none";
                    setTimeout(animLi, 500);
                    setTimeout(zIndex, 1000);
                }};
            function animLi() {
                for (var e = 0; e < amimateLi.length; e++) {
                    amimateLi[e].classList.remove('before');
                    amimateLi[e].style.borderLeft = "1px solid rgba(99, 99, 99, 0.3)";
                    amimateLi[e].style.borderRight = "1px solid rgba(99, 99, 99, 0.3)";
                }
            };

            function zIndex() {
                animate.style.zIndex = '0';
            }


        }
    }
    animateAll();
    function buttonClose() {
        var button = document.querySelector('.close-nav');
        button.onclick = function () {
            navSection.classList.add('off');
            engineSection.classList.remove('off');
        }
    }
    buttonClose();
}
mainScene();
