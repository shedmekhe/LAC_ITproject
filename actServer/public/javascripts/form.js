const form = document.querySelector("form"),
        nextBtn = form.querySelector(".nextBtn"),
        backBtn = form.querySelector(".backBtn"),
        allInput = form.querySelectorAll(".first input"),
        academic = document.querySelector("#academic"),
        semester = document.querySelector("#semester"),
        currYear = document.querySelector("#currYear");

nextBtn.addEventListener("click", ()=> {
    allInput.forEach(input => {
        if(input.value != ""){
            form.classList.add('secActive');
        }else{
            form.classList.remove('secActive');
        }
    })
})
nextBtn.addEventListener("click", ()=> {
   if(academic.value && semester.value && currYear.value){
    form.classList.add('secActive');
   }
})


backBtn.addEventListener("click", () => form.classList.remove('secActive'));

const addBtn = document.querySelector('.add');
const input = document.querySelector(".member-info");

function removeInput(){
    this.parentElement.remove();
}

function addInput(){
    const name = document.createElement("input");
    name.type = "text";
    name.placeholder = "Enter Member Name";

    const prn = document.createElement("input");
    prn.type = "text";
    prn.placeholder = "Enter Member PRN";

    const btn=document.createElement("a");
    btn.className= "delete";
    btn.innerHTML="&times";

    btn.addEventListener("click", removeInput);

    const flex=document.createElement("div");
    flex.className="flex";

    input.appendChild(flex);
    flex.appendChild(name);
    flex.appendChild(prn);
    flex.appendChild(btn);


}
addBtn.addEventListener("click", addInput);
const currentYear = new Date().getFullYear();
const select = document.getElementById("year");

for (let year = currentYear; year >= currentYear-5; year--) {
  const option = document.createElement("option");
  option.value = year;
  option.text = year;
  select.appendChild(option);
}
