import { Component } from "@angular/core";

@Component({
    selector: 'app-csv',
    templateUrl: 'csv.component.html'
})
export class CsvComponent {

    headingLines = [];
    rowLines = [];

    fileUpload(files: any) {
        let fileList = (<HTMLInputElement>files.target).files;
        if (fileList && fileList.length > 0) {
            let file : File = fileList[0];
            console.log(file.name);

            let reader: FileReader =  new FileReader();
            reader.readAsText(file);
            reader.onload = (e) => {
                let csv: any = reader.result;
                let allTextLines = [];
                allTextLines = csv.split(/\r|\n|\r/);

                console.log(allTextLines)
            }
        }
    }
}