
function getHelp(subject) {
    var myModal = document.getElementById("myPopup");
    //alert(myModal.classList);
    myModal.classList.toggle("show");
    //alert(myModal.classList);
    if (subject && subject == "text") {
        myModal.innerHTML = "<p>[slide Name]:[text to appear across slide] or [a comma delimted list of options availble]</p>";
        myModal.innerHTML += '<ul>';
        myModal.innerHTML += '<li>Notes:</li>';
        myModal.innerHTML += '<li>&nbsp&nbsp&nbsptext can be pasted in from standard text file with lne breaks</li>';
        myModal.innerHTML += '<li>&nbsp&nbsp&nbsptext can be formatted using standard HTML format for line and paragraph spacing</li>';
        myModal.innerHTML += '<li>&nbsp&nbsp&nbspSqequnce of slideshow is determined by sequence of text files</li>';
        myModal.innerHTML += '<li>Q and Answer Slides</li>';
        myModal.innerHTML += '<li>&nbsp&nbsp&nbspQuestion Slide file names should be Q or QM followed by a squuence number</li>';
        myModal.innerHTML += '<li>&nbsp&nbsp&nbspMutiple choice Option Slides are optional, file names should be CM followed by the same squuence number</li>';
        myModal.innerHTML += '<li>&nbsp&nbsp&nbspChoice Option text should a comma delimted list of options availble</li>';
        myModal.innerHTML += '<li>&nbsp&nbsp&nbspAnswer Slide file names should be A or AM followed by the same squuence number</li>';
        myModal.innerHTML += '</ul>';
    }
}