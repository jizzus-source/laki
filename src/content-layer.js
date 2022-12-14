let lakiName;
let dots = [];
const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;

window.addEventListener('load', () => {
    lakiName = document.getElementById('laki-name')
    dots = document.getElementsByClassName('dot');
    console.log(dots);
})

window.addEventListener('scroll', function (evt) {
    const scroll = this.scrollY;
    
    lakiName.style.opacity = 1 - (scroll/1200);

    for(const dot of dots) {
        dot.style.transform = `rotate(${scroll % 360}deg)`
    }
})