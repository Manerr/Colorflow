import {Color} from "./color.js";
// import {hsvToRgb, rgbToHex} from "./colorconvert.js";

function generateMonochromatic(baseColor,numColors){

    const [h, s, v] = baseColor.hsv;
    const palette = [];
    const center = Math.floor(numColors / 2);
    let lessThanCenterCounter = 0;


    const before = center;
    let moreThanCenterCounter = numColors - center;
    let saturationMoreThanCenterCounter = 0;

    for (let index = 0; index < numColors; index++) {

        if(index == center) palette.push(baseColor);
        else if(index < center ){

            let new_v = (v * ++lessThanCenterCounter / (center + 1));
            
            let color = new Color([h,s,new_v],"hsv");
            palette.push(color);
        }
        else{

            // Not ready for now i guess - almost working
            let new_v = v;
            //something that doesnt exist on existing generators: a color without saturation (like a grayscale one) will not give variations on saturation 
            if(s < 10) new_v = v * (1 + ++saturationMoreThanCenterCounter / (center + 1));

            let new_s = (s *  --moreThanCenterCounter / (center + 1));
            let color = new Color([h,new_s,Math.min(new_v,100)],"hsv");
            
            palette.push(color);

        }
        

    }

    return palette;

}


function generatePalette(baseColorHex,type,numColors = 3) {

    const baseColor = new Color(baseColorHex);

    let palette;

    switch(type){
        
        case "":
        case undefined:
        case null:
        case "monochromatic":
            palette = generateMonochromatic(baseColor,numColors);
        break;
        case "complementary": 
            
            palette = generateMonochromatic(baseColor, numColors);

            const compColor = new Color([(baseColor.hsv[0] + 180 ) % 360,baseColor.hsv[1],baseColor.hsv[2]],"hsv");
            palette = palette.concat(generateMonochromatic(compColor, numColors));
            
        break;        
    }



    return palette;
    }



export {generatePalette};