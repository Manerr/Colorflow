function randomhexColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}


function adaptColor([h, s, v]) {
    if (v < 50) return "#FFF";
    else if (v > 70) return "#111";
    if (s < 20 && v > 50) return "#111";
    return "#FFF";
}


function downloadFile(filename,content,type = "text/plain"){
    let fileBlob = new Blob([content],{type:type});

    let tempLink = document.createElement("a");

    tempLink.download = filename;
    tempLink.href = URL.createObjectURL(fileBlob);

    tempLink.click();


    URL.revokeObjectURL(tempLink.href);
    // document.removeChild(tempLink);
}




export {randomhexColor,adaptColor,downloadFile};