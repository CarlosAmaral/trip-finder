export interface IDeals {
    currency: string;
    deals: IDeal[];
}

export interface IDeal {
    transport: Transport;
    departure: string;
    arrival: string;
    duration: IDuration;
    cost: number;
    discount: number;
    reference: string;
}

export interface IDuration {
    h: string;
    m: string;
}

export interface IDeparture {
    key: string;
    departure: string;
}

export interface IArrival {
    key: string;
    arrival: string;
}

export interface INodes {
    key: string;
    edges: IEdges[];
}

export interface IFormValues{
    departure: string;
    weight: string;
    arrival: string;
}

interface IEdges {
    departure: any;
    arrival: any;
    duration: any;
    cost: number;
}

