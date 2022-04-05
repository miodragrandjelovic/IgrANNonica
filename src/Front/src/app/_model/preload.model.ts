export class PreloadCsv {
    No: any;
    Transaction_date: any;
    House_age: any;
    Distance_MRT: any;
    Convenience_stores: any;
    Latitude: any;
    Longitude: any;
    Unit_price:any;
}

export class PreloadStatistic {
    Count: any;
    Unique: any;
    Top: any;
    Freq: any;
    Mean: any;
    Std: any;
    Min: any;
    Q1:any;
    Q2:any;
    Q3:any;
    Max:any;

    constructor(  Count: any,
        Unique: any,
        Top: any,
        Freq: any,
        Mean: any,
        Std: any,
        Min: any,
        Q1:any,
        Q2:any,
        Q3:any,
        Max:any,)
        {
            this.Unique=Unique;
            this.Top=Top;
            this.Freq= Freq;
            this.Mean=Mean;
            this.Std=Std;
            this.Min= Min;
            this.Q1=Q1;
            this.Q2=Q2;
            this.Q3=Q3;
            this.Max=Max;
    }
}
