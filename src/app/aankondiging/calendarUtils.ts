export interface CalendarEvent<MetaType = any> {
    id?: string | number;
    start: Date;
    title: string;
    groep: String;
    resizable?: {
      beforeStart?: boolean;
      afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: MetaType;
  }