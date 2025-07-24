import { colors } from "../data/colors.js";
import {hsvToRgb, rgbToHex,hslToRgb,hexToRgb,hexToHsl,rgbToHsl,rgbToHsv} from "./colorconvert.js";


class Color {
    constructor(arg, type = "hex") {
        switch (type) {
            case "hex":
                this.hex = arg.toUpperCase();
                this.rgb = hexToRgb(this.hex);
                this.hsl = hexToHsl(this.hex);
                this.hsv = rgbToHsv(...this.rgb);
                break;
            case "rgb":
                this.rgb = arg.map(Math.round);
                this.hex = rgbToHex(...this.rgb);
                this.hsl = rgbToHsl(...this.rgb);
                this.hsv = rgbToHsv(...this.rgb);
                break;
            case "hsv":
                this.hsv = arg.map((v, i) => i === 0 ? Math.round(v) : Math.round(v));
                this.rgb = hsvToRgb(this.hsv);
                this.hex = rgbToHex(...this.rgb);
                this.hsl = rgbToHsl(...this.rgb);
                break;
            case "hsl":
                this.hsl = arg.map((v, i) => i === 0 ? Math.round(v) : Math.round(v));
                this.rgb = hslToRgb(...this.hsl);
                this.hex = rgbToHex(...this.rgb);
                this.hsv = rgbToHsv(...this.rgb);
                break;
            default:
                throw new Error("Type de couleur non supporté");
        }
        this.name = this.getName();
    }

    setRgb(rgb){

      this.rgb = rgb;

    }

    getName() {

      let closestColor = null;
      let minDistance = Infinity;
  
        colors.forEach(color => {


        // const rgb = color.rgb;
        // const currentrgb = this.rgb;

        // const r = rgb[0] - currentrgb[0];
        // const g = rgb[1] - currentrgb[1];
        // const b = rgb[2] - currentrgb[2];

        // const distance = r**2 + g**2 + b**2 ;

        const hsv = color.hsv;
        const currenthsv = this.hsv;

        const h = Math.abs(hsv[0] - currenthsv[0]);
        const s = Math.abs(hsv[1] - currenthsv[1]);
        const v = Math.abs(hsv[2] - currenthsv[2]);

        const distance = h**3 + s**2 + v**2.5 ;







        // (0.32 * (r * r)) + (0.5 * (g * g)) + (0.1 * (b *b));


          if (distance < minDistance) {
            minDistance = distance;
            closestColor = color.name;
          }
        });
  
        return closestColor;

    }
  
  
    toString() {
      return {
        name: this.name,
        hex: this.hex.replace('#','').toUpperCase(),
        rgb: `rgb(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]})`,
        hsv: `hsv(${this.hsv[0]}, ${this.hsv[1]}%, ${this.hsv[2]}%)`
      };
    }

    toJSONCompatible(){

      return {
        "Name": this.name,
        "Hex": this.hex,
        "Red": this.rgb[0],
        "Green": this.rgb[1],
        "Blue": this.rgb[2],
        "Hue": this.hsv[0],
        "Saturation": this.hsv[1],
        "Value": this.hsv[2],
      }

    }

    toCsvCompatible(){

      return `"${this.name}" ${this.hex},${this.rgb},${this.hsv}`;

    }


}


export{Color};