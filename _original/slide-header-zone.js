let slideIndexHeader = 0;
showSlidesHeader();
function showSlidesHeader() {
    let i;
    let slidesHeader = document.getElementsByClassName("sliderHeader");
    for (i = 0; i < slidesHeader.length; i++) {
        slidesHeader[i].style.display = "none"; 
    }
    slideIndexHeader++;
    if (slideIndexHeader > slidesHeader.length) {slideIndexHeader = 1} 
    slidesHeader[slideIndexHeader-1].style.display = "block"; 
    setTimeout(showSlidesHeader, 3000);
};

