import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { ParametersService } from "src/app/services/parameters.service";
import { ModalDismissReasons,NgbModal} from '@ng-bootstrap/ng-bootstrap';



interface CheckBox {
    id: number,
    label: String,
    isChecked: boolean
}
import { PreloadCsv, PreloadStatistic } from "src/app/_model/preload.model";
import { Observable } from "rxjs";
import { MessageService } from "../home.service";
import { UserdatasetsComponent } from "./userdatasets/userdatasets.component";

@Component({
    selector: 'app-csv',
    templateUrl: 'csv.component.html'
})


export class CsvComponent implements OnInit {  
    

    @ViewChild(UserdatasetsComponent) child: any; //pozivamo komponentu userDatasets da bi pristupili njenim metodama
    //zato sto ne radi poziv iz konstuktora

    
    
    privateOrPublic: boolean = false ;

    hidden: boolean;
    currentCorrResult: any;
    currentStatsResult: any;
    selectedDatasetUser:any;

    showMe: boolean = false;
    showMe2:boolean = false;
    showMe3:boolean = false;
    showMeChosenDataset:boolean = false;

    preloadedDataset:number;

    showMeMatrix: boolean = false;
    prikazPreucitano:boolean = false;
    odabrano:boolean=false;

    selectedValue:any="";
    selectedValue1:any="";

    session:any;
    chosen:any;

    currentResult:string;
    encodingArray: any = [];
    
    selectChange(event:any) {
        this.changeSelection();
        this.showMe2=true;
        if (this.selectedValue != event.target.value) {
            this.selectedValue=event.target.value;
            this.sendHp = this.sendHp.concat(',' + this.selectedValue);
        }
    }
    selectChange1(event:any) {
        this.odabrano=true;
        this.selectedValue1=event.target.value;
    }

    dataObject:any = [];
    headingLines: any = [];
    rowLines: any = [];
    allData: any = [];
    rowsArray: any = [];
    matrix: any = [];
    itemsPerPage: number = 15;
    itemPosition: number = 0;
    currentPage: number = 1;
    response: any;

    headersStatistics: any = ['Columns', 'Q1', 'Q2', 'Q3', 'count', 'freq', 'max', 'mean', 'min', 'std', 'top', 'unique'];
    rowLinesStatistics: any = [];

    headersMatrix: any = [];
    rowLinesMatrix:any = [];

    flag: number = 0;

    headers: any;

    searchInputField: any ;

    outputs: Array<CheckBox> = [];
    selectedInputs: Array<CheckBox> = [];
    inputsArray: Array<CheckBox> = [];
    sendHp: string = "";

    datasetTitle:string = '';
    uploadedFile:any = false;
    
    ngOnInit(): void {
        this.parametersService.getShowHp().subscribe(res => {
            this.hidden = res;
        }),
        this.service.messageSubject.subscribe({
            next: x => {
                if (x == 0)
                {
                    this.hidden = false;
                }
                else
                {
                    this.hidden = true;
                    this.showHp();
                }
            }
        });

        this.loadRegressionDataset();

        
        this.session = sessionStorage.getItem('username');
        this.chosen = false;
    }





    constructor(private http: HttpClient, 
        private parametersService: ParametersService, 
        private service: MessageService, 
        private modalService: NgbModal) {
    }
/////////
    searchDatasets(){
        //poziva searchDatasets iz UserDatasets
        this.child.searchDatasets(this.searchInputField);
    }

    fetchSelectedItems() {
        this.selectedInputs = this.inputsArray.filter((value, index) => {
          return value.isChecked
        })
    }

    fetchOutputs() {
        this.outputs = this.inputsArray.filter((value, index) => {
            return value.isChecked == false
        })
    }

    changeSelection() {
        this.sendHp = "";
        this.fetchSelectedItems();
        this.fetchOutputs();

        for (let i = 0; i < this.selectedInputs.length; i++) {
            const str = this.selectedInputs[i].label;
            if (i != 0) {
               this.sendHp = this.sendHp.concat("," + str);
            }
            else
                this.sendHp = this.sendHp.concat('' + str);
        }
        this.selectedValue = "";
    }

    showHp() {
       // this.parametersService.setShowHp(true);
       // this.parametersService.setParamsObs(this.hp);
    }

    prikazPreload:boolean=true;

    userUploadedFile:any;

    onemogucenaPredaja:boolean = true;
    onemogucenoIme: boolean = true;

    onemoguceno:boolean = true;

    fileUpload(files:any)
    {
        this.userUploadedFile = files;
        this.onemogucenaPredaja = false;
        

        let fileList = (<HTMLInputElement>files.target).files;
        
        if (fileList && fileList.length > 0) {
            let file : File = fileList[0];

            let defFileName = file.name;
            defFileName = defFileName.replace(".csv","");
            //alert("Naziv je -"+defFileName+"-");
            //set filename
            this.datasetTitle = defFileName;
            this.onemogucenoIme = false;

            
            this.changeButtonEnable();
        }

        
    }

    

    checkButtonEnable()
    {
        //alert("Provera");
        if (this.datasetTitle == "") this.onemogucenoIme = true;
        else this.onemogucenoIme = false;  

        this.changeButtonEnable();
    }  
    
    changeButtonEnable(){
        this.onemoguceno = this.onemogucenoIme || this.onemogucenaPredaja;
    }

    /*
    fileUploaddddd(files: any) {
        this.encodingArray = [];
        this.prikazPreload=false;
        this.uploadedFile = true;

        this.chosen = true;
        this.sendHp = '';
        this.showMe2 = true;
        this.showMeMatrix = false;
        this.inputsArray = [];

       

        this.flag = 1;
        

        this.dataObject = [];
        this.headingLines = [];
        this.rowLines = [];
        this.rowLinesStatistics = [];

        let fileList = (<HTMLInputElement>files.target).files;
        
        if (fileList && fileList.length > 0) {
            let file : File = fileList[0];

            let reader: FileReader =  new FileReader();
            reader.readAsText(file);
            reader.onload = (e) => {
                let csv: any = reader.result;
                let allTextLines = [];
                allTextLines = csv.split('\n');
                
                this.headers = allTextLines[0].split(/;|,/).map((x:string) => x.trim());
                let data = this.headers;
                let headersArray = [];

                for (let i = 0; i < this.headers.length; i++) {
                    headersArray.push(data[i]);
                    this.encodingArray.push(data[i]);
                }


                console.log(this.encodingArray);
                this.headingLines.push(headersArray);

                this.outputs[0] = headersArray[headersArray.length - 1];
                
                this.inputsArray = [];

                for (let i = 0; i < headersArray.length; i++) {
                    
                    let isChecked;
                    let id = i + 1;
                    let label = headersArray[i];
                    if (i != headersArray.length - 1)
                        isChecked = true;
                    else
                        isChecked = false;
                    
                    const myObject: CheckBox = {
                        id: id,
                        label: label,
                        isChecked: isChecked
                    }

                    this.inputsArray.push(myObject);
                }

                this.fetchSelectedItems();
                this.fetchOutputs();

                for (let i = 0; i < this.selectedInputs.length; i++) {
                    const str = this.selectedInputs[i].label;
                    if (i != 0) {
                       this.sendHp = this.sendHp.concat("," + str);
                    }
                    else
                        this.sendHp = this.sendHp.concat('' + str);
                }
                this.selectedValue = this.outputs[0].label;
                this.sendHp = this.sendHp.concat(',' + this.selectedValue);                

                this.rowsArray = [];

                let length = allTextLines.length - 1;
                
                let rows:any = [];
                for (let i = 1; i < length; i++) {
                    rows.push(allTextLines[i].split(/;|,/).map((x:string) => x.trim()));
                    const obj:any = {};
                    headersArray.forEach((header:any, j:any) => {
                        obj[header] = rows[i - 1][j];
                    })
                    this.dataObject.push(obj);
                }
                length = rows.length;
                for (let j = 0; j < length; j++) {
                    this.rowsArray.push(rows[j]);
                }
                this.rowLines = this.rowsArray.slice(0, this.itemsPerPage);
                this.allData = this.rowsArray;
                
                this.http.post<any>('https://localhost:7167/api/LoadData/csv', {
                    csvData: JSON.stringify(this.dataObject),
                    Name: file.name
                }).subscribe(result => {
                    for(let i = 0; i < this.headers.length; i++){
                        const currentRow = [this.headers[i],
                            result[this.headers[i]].Q1 ? result[this.headers[i]].Q1 : 'null',
                            result[this.headers[i]].Q2 ? result[this.headers[i]].Q2 : 'null', 
                            result[this.headers[i]].Q3 ? result[this.headers[i]].Q3 : 'null', 
                            result[this.headers[i]].count ? result[this.headers[i]].count : 'null',
                            result[this.headers[i]].freq ? result[this.headers[i]].freq : 'null', 
                            result[this.headers[i]].max ? result[this.headers[i]].max : 'null', 
                            result[this.headers[i]].mean ? result[this.headers[i]].mean : 'null', 
                            result[this.headers[i]].min ? result[this.headers[i]].min : 'null', 
                            result[this.headers[i]].std ? result[this.headers[i]].std : 'null', 
                            result[this.headers[i]].top ? result[this.headers[i]].top : 'null', 
                            result[this.headers[i]].unique ? result[this.headers[i]].unique : 'null'
                        ];
                        this.rowLinesStatistics.push(currentRow);
                    }
                    console.log(this.rowLinesStatistics);
                });


            }
        }

    }
    */
   
    changePage() {
        this.rowLines = this.allData.slice(this.itemsPerPage * (this.currentPage - 1),this.itemsPerPage * (this.currentPage - 1) + this.itemsPerPage)
    }

    sendNewFile(fileName:string,privatePublic:boolean){
        this.encodingArray = [];
        this.prikazPreload=false;
        this.uploadedFile = true;

        this.chosen = true;
        this.sendHp = '';
        this.showMe2 = true;
        this.showMeMatrix = false;
        this.inputsArray = [];

       

        this.flag = 1;
        

        this.dataObject = [];
        this.headingLines = [];
        this.rowLines = [];
        this.rowLinesStatistics = [];

        let fileList = (<HTMLInputElement>this.userUploadedFile.target).files;
        
        if (fileList && fileList.length > 0) {
            let file : File = fileList[0];

            let reader: FileReader =  new FileReader();
            reader.readAsText(file);
            reader.onload = (e) => {
                let csv: any = reader.result;
                let allTextLines = [];
                allTextLines = csv.split('\n');
                
                this.headers = allTextLines[0].split(/;|,/).map((x:string) => x.trim());
                let data = this.headers;
                let headersArray = [];

                for (let i = 0; i < this.headers.length; i++) {
                    headersArray.push(data[i]);
                    this.encodingArray.push(data[i]);
                }


                console.log(this.encodingArray);
                this.headingLines.push(headersArray);

                this.outputs[0] = headersArray[headersArray.length - 1];
                
                this.inputsArray = [];

                for (let i = 0; i < headersArray.length; i++) {
                    
                    let isChecked;
                    let id = i + 1;
                    let label = headersArray[i];
                    if (i != headersArray.length - 1)
                        isChecked = true;
                    else
                        isChecked = false;
                    
                    const myObject: CheckBox = {
                        id: id,
                        label: label,
                        isChecked: isChecked
                    }

                    this.inputsArray.push(myObject);
                }

                this.fetchSelectedItems();
                this.fetchOutputs();

                for (let i = 0; i < this.selectedInputs.length; i++) {
                    const str = this.selectedInputs[i].label;
                    if (i != 0) {
                       this.sendHp = this.sendHp.concat("," + str);
                    }
                    else
                        this.sendHp = this.sendHp.concat('' + str);
                }
                this.selectedValue = this.outputs[0].label;
                this.sendHp = this.sendHp.concat(',' + this.selectedValue);                

                this.rowsArray = [];

                let length = allTextLines.length - 1;
                
                let rows:any = [];
                for (let i = 1; i < length; i++) {
                    rows.push(allTextLines[i].split(/;|,/).map((x:string) => x.trim()));
                    const obj:any = {};
                    headersArray.forEach((header:any, j:any) => {
                        obj[header] = rows[i - 1][j];
                    })
                    this.dataObject.push(obj);
                }
                length = rows.length;
                for (let j = 0; j < length; j++) {
                    this.rowsArray.push(rows[j]);
                }
                this.rowLines = this.rowsArray.slice(0, this.itemsPerPage);
                this.allData = this.rowsArray;
                //alert("Now saving dataset under name "+fileName);
                
                // privatePublic lepo kupi vrednost, ali iz nekog razloga na beku je false...
                this.http.post<any>('https://localhost:7167/api/LoadData/csv?publicData='+privatePublic, {
                    csvData: JSON.stringify(this.dataObject),
                    Name: fileName
                }).subscribe(result => {
                    for(let i = 0; i < this.headers.length; i++){
                        const currentRow = [this.headers[i],
                            result[this.headers[i]].Q1 ? result[this.headers[i]].Q1 : 'null',
                            result[this.headers[i]].Q2 ? result[this.headers[i]].Q2 : 'null', 
                            result[this.headers[i]].Q3 ? result[this.headers[i]].Q3 : 'null', 
                            result[this.headers[i]].count ? result[this.headers[i]].count : 'null',
                            result[this.headers[i]].freq ? result[this.headers[i]].freq : 'null', 
                            result[this.headers[i]].max ? result[this.headers[i]].max : 'null', 
                            result[this.headers[i]].mean ? result[this.headers[i]].mean : 'null', 
                            result[this.headers[i]].min ? result[this.headers[i]].min : 'null', 
                            result[this.headers[i]].std ? result[this.headers[i]].std : 'null', 
                            result[this.headers[i]].top ? result[this.headers[i]].top : 'null', 
                            result[this.headers[i]].unique ? result[this.headers[i]].unique : 'null'
                        ];
                        this.rowLinesStatistics.push(currentRow);
                    }
                    console.log(this.rowLinesStatistics);
                });


            }
        }
    }

    addNewDatasetAndPreview()
    {
        // treba da se pokupi vrednost i prosledi 
        
        // fja za slanje na bek
        this.sendNewFile(this.datasetTitle, this.privateOrPublic);

        //alert("Uspesno slanje!");
        //podesavnja za sl put
        this.showMeChosenDataset = false;
        this.showMe = true;
        document.getElementById("closeModal")?.click();
        this.datasetTitle = '';
        this.privateOrPublic = false;
        this.uploadedFile = false;
        this.onemogucenaPredaja = true;
        this.onemogucenoIme = true;
        this.changeButtonEnable();
        this.parametersService.setDatasets();
        // treba i da se sacuva dataset!!!!!
    }

    korelacionaMatrica() {

        this.showMeMatrix = true;
        this.headersMatrix = [];
        this.rowLinesMatrix = [];
        this.matrix = [];
        this.showMe3 = true;
        let headersArray:any = ['Columns'];
        for (let k = 0; k < this.headers.length; k++) {
            if (!isNaN(this.rowsArray[0][k])) {
                headersArray.push(this.headers[k]);
                this.matrix.push(this.headers[k]);
            }
        }
        this.http.get<any>('https://localhost:7167/api/Python/kor').subscribe(result => {
            let currentRow: any = [];
            for (let i = 0; i < this.matrix.length; i++) {
                currentRow = [this.matrix[i]];
                for (let j = 0; j < this.matrix.length; j++) {
                    currentRow.push(result[this.matrix[i]][this.matrix[j]]);
                }
                this.rowLinesMatrix.push(currentRow);
                }
            });
            this.headersMatrix.push(headersArray);
        }





    loadRegressionDataset(){
        let csvFajl;
        
        this.preloadedDataset=0;

        this.http.get<any>('https://localhost:7167/api/Python/preloadCsv').subscribe(result =>{
            csvFajl = result;
            this.currentResult = result;
        });
        this.http.get<any>('https://localhost:7167/api/Python/preloadKor').subscribe(data =>{
            this.currentCorrResult = data;
        });
        this.http.get<any>('https://localhost:7167/api/Python/preloadStat').subscribe(result => {
            this.currentStatsResult = result;
        });
    }

    loadClassificationDataset() {   
        let csvFajl;
        
        this.preloadedDataset=1;

        this.http.get<any>('https://localhost:7167/api/Python/preloadCsvClass').subscribe(result => {
            console.log(result);
            csvFajl = result;
            this.currentResult = result;
        });

        this.http.get<any>('https://localhost:7167/api/Python/preloadKorClass').subscribe(data => {
            console.log(data);

            this.currentCorrResult = data;
        });
        this.http.get<any>('https://localhost:7167/api/Python/preloadStatClass').subscribe(result => {
            this.currentStatsResult = result;
        });
    }

    selectedKor:any;
    selectedStat:any;
    catchSelectedDataset($event:any){
        this.selectedDatasetUser = $event.dataset;
        this.selectedKor=$event.kor;
        this.selectedStat=$event.stat;
        this.showMe = false;
        //alert("PRIMIO SAM!");
        // u selectedDatasetUser se nalazi Dataset koji je korisnik izabrao (njegov sacuvan)
        console.log("PRIMLJENO ",this.selectedDatasetUser);

        this.showMeChosenDataset = true;


    }

    

    
    closeResult: string | undefined;
    addNewFile(newFile: any){
      //alert(contentLogin);
      //this.showMe = false;
      this.modalService.open(newFile, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        //alert("Zatvoreno1");
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        this.datasetTitle = "";
        this.privateOrPublic = false;
    });
    }
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return `with: ${reason}`;
      }
    }

    changePrivatePublic()
    {
        var slider = document.getElementById("labelPrivatePublic");
        
        if (slider!=null)
        {
            if(slider.innerHTML== "Private")
            {
                slider.innerHTML = "Public";
            }
            else
            {
                slider.innerHTML = "Private";
            }
        }
    }
}

    
