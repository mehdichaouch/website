/* particlesjsConfig load */
// async function getJSONFile() {
//     let res = await fetch('/assets/js/particlesjs-config.json');
//     let particlesjsConfig = await res.json();
//     return particlesjsConfig;
// }

/* sweetScroll load */
document.addEventListener('DOMContentLoaded', function () {
    // new SweetScroll({ /* some options */});

    // getJSONFile().then(particlesjsConfig => particlesJS('particles-js', particlesjsConfig))

    particlesJS.load('particles-js', '/assets/js/particlesjs-config.json', function () {
        // console.log('callback - particles.js config loaded');
    });
}, false);

function decode(a) {
    return a.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    })
}

function openMailer(element, email) {
    var y = decode('znvygb:' + email);
    element.setAttribute('href', y);
    element.setAttribute('onclick', '');
    element.firstChild.nodeValue = 'Open email software';
}
