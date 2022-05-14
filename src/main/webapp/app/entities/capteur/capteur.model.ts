export interface ICapteur {
  id?: number;
  type?: string | null;
  reference?: string | null;
  photo?: string | null;
  frequence?: number | null;
  reftype : string   ;
}

export class Capteur implements ICapteur {
  constructor(
    public id?: number,
    public type?: string | null,
    public reference?: string | null,
    public photo?: string | null,
    public frequence?: number | null,
    public reftype : string  = `MBR${String(reference)}${String(" - ")}${String(reference)}`  ,
  ) {}
}

export function getCapteurIdentifier(capteur: ICapteur): number | undefined {
  return capteur.id;
}

