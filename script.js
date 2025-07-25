import {Color} from "./classes/color.js";
import {generatePalette} from "./classes/generator.js";
import { adaptColor,downloadFile} from "./classes/utils.js";
import { events } from "./classes/events.js";
window.downloadFile = downloadFile;

window.numColumns = 5;

window.generatedType = "monochromatic";
window.lastgeneratedType = "";
window.currentColor;

class mainapp{

  constructor(){

    this.palette = null;
    this.exportMode = "pdf";

    this.eventsmanager = new events(this);

    this.genBtn = document.getElementById('gen-btn');
    this.generateNewPalette = this.generateNewPalette.bind(this);
    this.genBtn.addEventListener('click', this.generateNewPalette);

    this.plusBtn = document.getElementById('plus-btn');
    this.plusBtn.addEventListener('click', this.eventsmanager.plusButton);

    this.minusBtn = document.getElementById('minus-btn');
    this.minusBtn.addEventListener('click', this.eventsmanager.minusButton);

    this.switchModeBtn = document.getElementById('switch-mode-btn');
    this.switchModeBtn.onclick = this.eventsmanager.updateSwitchModeIcon;

    this.colorPicker = document.getElementById('base-color-picker');
    this.colorPicker.addEventListener('input', this.eventsmanager.picker );

    this.pdfButton = document.getElementById('pdf-download-btn');
    this.printButton = document.getElementById('print-btn');
    this.pdfButton.addEventListener('click',this.eventsmanager.pdfButton);
    this.printButton.addEventListener('click',this.eventsmanager.printButton);

    this.jsonBtn = document.getElementById('json-download-btn');
    this.jsonBtn.addEventListener('click',this.eventsmanager.jsonExport);

    this.csvBtn = document.getElementById('csv-download-btn');
    this.csvBtn.addEventListener('click',this.eventsmanager.csvExport);

    this.files_pop_up = document.getElementById('file-export-select');
    this.files_pop_up_btn = document.getElementById('download-btn');

    this.files_pop_up_btn.addEventListener('click',this.eventsmanager.trigger_download_menu);


    this.file_picker = document.getElementById('open-file-input');
    this.file_picker_btn = document.getElementById('open-file-btn');

    this.file_picker_btn.addEventListener('click',this.eventsmanager.jsonImportHandle);
    this.file_picker.addEventListener('input',this.eventsmanager.jsonImport);





    this.generateNewPalette();

  }

  
  randomHsvColor() {

    return [Math.floor(Math.random() * 360),Math.floor(Math.random() * 50 + 50),Math.floor(Math.random() * 50 + 50)]

  }

  renderColumns() {
    const container = document.querySelector('.palette-output');
    container.innerHTML = '';

    let type = window.generatedType;

    if( !container.classList.contains("complementary") && type == "complementary" ) container.className = "palette-output complementary";
    if( !container.classList.contains("monochromatic") && type == "monochromatic" ) container.className = "palette-output monochromatic";

    if (type === "complementary") {
      // Create two rows, each with numColumns columns
      for (let row = 0; row < 2; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'palette-row';
        for (let i = 0; i < numColumns; i++) {
          const div = document.createElement('div');
          div.className = 'palette-column';
          rowDiv.appendChild(div);
        }
        container.appendChild(rowDiv);
      }
    } else {
      // Monochromatic: single row
      for (let i = 0; i < numColumns; i++) {
        const div = document.createElement('div');
        div.className = 'palette-column';
        container.appendChild(div);
      }
    }
  }

  applyPalette(baseHex) {
    if( window.lastgenerated != window.generatedType ){
      this.renderColumns();
      window.lastgenerated = window.generatedType;
    }
    const palette = generatePalette(baseHex,window.generatedType,numColumns);

    let columns;
    if (window.generatedType === "complementary") {
      // Select all palette-column in both rows
      columns = document.querySelectorAll('.palette-row .palette-column');
    } else {
      columns = document.querySelectorAll('.palette-column');
    }
    columns.forEach((col, i) => {
      let currentColor = palette[i];
      if (currentColor) {
        col.style.backgroundColor = currentColor.hex;
        col.innerHTML = `
          <div class="color-info">
            <div class="hex">${currentColor.hex}</div>
            <div class="name">${currentColor.name || ''}</div>
            <div class="rgb">${currentColor.rgb}</div>
          </div>
        `;
        col.style.color = (adaptColor(currentColor.hsv));
      }
    });
    this.palette = palette;
  }

  generateNewPalette() {
    let newcolor = this.randomHsvColor();

    this.currentColor = new Color(newcolor,"hsv");
    this.colorPicker.value = this.currentColor.hex;
    this.applyPalette(this.currentColor.hex);

  }
  
  handleImport() {

    window.numColumns = this.palette.length;

    this.currentColor = this.palette[Math.ceil(window.numColumns / 2)];

    this.colorPicker.value = this.currentColor.hex; 
    this.renderColumns();
    
    let columns = document.querySelectorAll('.palette-column');
    columns.forEach((col, i) => {
    let currentColor = this.palette[i];
    if (currentColor) {
      col.style.backgroundColor = currentColor.hex;
      col.innerHTML = `
        <div class="color-info">
          <div class="hex">${currentColor.hex}</div>
          <div class="name">${currentColor.name || ''}</div>
          <div class="rgb">${currentColor.rgb}</div>
        </div>
      `;
      col.style.color = (adaptColor(currentColor.hsv));
    }
    });


  }

}

















function main() {
    try {

        window.app = new mainapp();

        window.Color = Color;
 
 
      } catch (error) {
      console.error('Erreur:', error);
    }
}


main();