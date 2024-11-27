let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("tax-info");
    console.log(taxInfo);
    for (let info of taxInfo) {
        info.classList.toggle("show");
    }
})