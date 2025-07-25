import {downloadFile} from "./utils.js";

//Not really a events class lol - but that's how things works
class events {

    constructor(parent){
        this.parent = parent;
        this.plusButton = this.plusButton.bind(this);
        this.minusButton = this.minusButton.bind(this);
        this.picker = this.picker.bind(this);
        this.updateSwitchModeIcon = this.updateSwitchModeIcon.bind(this);
        this.handleSpacebar = this.handleSpacebar.bind(this);
        this.jsonExport = this.jsonExport.bind(this);
        this.csvExport = this.csvExport.bind(this);
        this.trigger_download_menu = this.trigger_download_menu.bind(this);
        this.jsonImport = this.jsonImport.bind(this);
        this.jsonImportHandle = this.jsonImportHandle.bind(this);
    
        this.pdfButton = this.pdfButton.bind(this);
    

        document.addEventListener('keydown', this.handleSpacebar);
    }

    handleSpacebar(e) {
        if (e.code === 'Space' && !e.repeat) {
            this.parent.generateNewPalette();
        }
    }

    plusButton(){
        window.numColumns++;
        this.parent.renderColumns();
        this.parent.applyPalette(this.parent.currentColor.hex);
    }

    minusButton(){

        if (window.numColumns > 3) {
            window.numColumns--;
            this.parent.renderColumns();
            this.parent.applyPalette(this.parent.currentColor.hex);
          }
    }

    picker(e) {
        const hex = e.target.value.toUpperCase();
        this.parent.currentColor = new Color(hex, 'hex');
        window.currentColor = this.parent.currentColor;
        this.parent.applyPalette(hex);
    }


    updateSwitchModeIcon() {
        if (window.generatedType === 'monochromatic') {
            window.generatedType = "complementary";
            this.parent.switchModeBtn.classList.add('active');
            this.parent.switchModeBtn.title = 'Mode: Complementary';
        } else {
            window.generatedType = "monochromatic";
            this.parent.switchModeBtn.classList.remove('active');
            this.parent.switchModeBtn.title = 'Mode: Monochromatic';
        }

        //trying to fix a dumb bug.... still investigating
        const hex = this.parent.colorPicker.value.toUpperCase();
        this.parent.currentColor = new Color(hex, 'hex');
        this.parent.applyPalette(hex);
    }

    trigger_download_menu(){
        
        if(this.parent.files_pop_up.className == "modern-select" ) this.parent.files_pop_up.classList.add("active");
        else this.parent.files_pop_up.classList.remove("active");
    }

    jsonExport(){
        this.trigger_download_menu();
        let palette = this.parent.palette;
        let paletteToExport = [];
        palette.forEach(color => {
            paletteToExport.push(color.toJSONCompatible());
        });

        downloadFile("palette.json",JSON.stringify(paletteToExport,null,2),"application/json");   
    }

    jsonImport(){            
        let file_picker = this.parent.file_picker;
        let files = file_picker.files;
        if(files.length){
            let filename = files[0];
            let jsonfile = URL.createObjectURL(filename); 
            file_picker.value = "";

            fetch(jsonfile)
                .then(response => response.blob())
                .then(data => data.text())
                .then(data => {

                    data = JSON.parse(data);

                    this.parent.palette = data.map(color => new Color(color.Hex, 'hex'));
                    this.parent.handleImport();
                })
                .catch(error => console.error('Error reading the file:', error));
        
            URL.revokeObjectURL(jsonfile);
        
        
        }




    }    

    jsonImportHandle(){

        this.parent.file_picker.click();

    }

    csvExport(){
        this.trigger_download_menu();

        let palette = this.parent.palette;
        let paletteToExport = '"Color name",Hexadecimal,Red,Green,Blue,Hue,Saturation,Value\n';
        this.parent.palette.forEach(color => {
            paletteToExport += (color.toCsvCompatible()) + "\n";
        });

        downloadFile("palette.csv",paletteToExport,"text/csv");   


    }

    pdfButton(){
        this.trigger_download_menu();
        this.printButton();
    }

    printButton(){
        print();
    }


}

export {events};