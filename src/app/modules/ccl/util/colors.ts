import { Injectable } from "@angular/core";
import { ModeleInfraService } from "../services/modele-infra/modele-infra.service";
import {  map } from 'rxjs/operators';
import {Observable} from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class Colors {
    constructor(private modeleInfraService: ModeleInfraService) {}

    private colorList: string[] = [
        'AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue',
        'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk',
        'Crimson', 'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenrod', 'DarkGray', 'DarkGreen', 'DarkKhaki', 'DarkMagenta',
        'DarkOliveGreen', 'DarkOrange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkSlateGray',
        'DarkTurquoise', 'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DimGray', 'DodgerBlue', 'Firebrick', 'FloralWhite',
        'ForestGreen', 'Fuchsia', 'Gainsboro', 'GhostWhite', 'Gold', 'Goldenrod', 'Gray', 'Green', 'GreenYellow', 'Honeydew',
        'HotPink', 'IndianRed', 'Indigo', 'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon',
        'LightBlue', 'LightCoral', 'LightCyan', 'LightGoldenrodYellow', 'LightGreen', 'LightGrey', 'LightPink', 'LightSalmon',
        'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen',
        'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue',
        'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin',
        'NavajoWhite', 'Navy', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenrod', 'PaleGreen',
        'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'RebeccaPurple',
        'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver',
        'SkyBlue', 'SlateBlue', 'SlateGray', 'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise',
        'Violet', 'Wheat', 'White', 'WhiteSmoke', 'Yellow', 'YellowGreen'
    ];

    public getListWithout(colorsWithout: string[]): string[] {
        const lowerWithout = colorsWithout.map(c => c.toLowerCase());
        return this.colorList.filter(c => !lowerWithout.includes(c.toLowerCase()));
    }

    public getAvailableColors(): Observable<string[]> {
        return this.modeleInfraService.getColorsExist().pipe(
            map(existingColors => this.getListWithout(existingColors))
        );
    }
}