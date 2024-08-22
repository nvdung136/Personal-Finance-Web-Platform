function Full_screen(){
    //Create a front backdrop area ......................

    //CSV load file backdrop
    const LoaderScr = document.createElement('div');
    LoaderScr.classList.add("loader");
    document.body.style.position = "fixed";
    document.body.appendChild(LoaderScr);

    // Closing ----- exit Loading screen
    const cls_btn = document.createElement('span');
    cls_btn.classList.add('close-btn')
    cls_btn.innerText += 'Close';
    cls_btn.addEventListener("click", function () {
        document.body.removeChild(LoaderScr)
        document.body.style.position = "static";
    });

    //Weaving initial drop
    LoaderScr.appendChild(cls_btn);
    
    //CSV processing file
    const LoaderLine = document.createElement('div');
    LoaderLine.classList.add("loader__element");
}
