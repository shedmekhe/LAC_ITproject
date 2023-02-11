var prevBtn = document.getElementById("prev"),
    saveBtn = document.getElementById("save"),
    nextBtn = document.getElementById("next"),
    dirBtn = document.getElementById("dir"),
    buttonsContainer = document.getElementById("buttonsCTN"),
    step=1;
function createDir() {
        document.getElementById("save").required = true;
}
saveBtn.addEventListener("click",() => {
      alert("Loading Pls WAIT !!");
})
