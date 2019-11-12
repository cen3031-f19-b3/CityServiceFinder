import { Document, Types } from 'mongoose';
import ICategory from './CategoryInterface';

export interface IAddress extends Types.Subdocument {
    line_1: string;
    line_2?: string;
    city: string;
    state: string;
    zip: string;
}

export interface IPhoneNumber extends Types.Subdocument {
    contact?: string;
    number: string;
}

export interface IAppointment extends Types.Subdocument {
    is_required: boolean;
    phone: string;
    website: string;
    email: string;
    other_info: string;
}

export interface IApplication extends Types.Subdocument {
    is_required: boolean;
    apply_online: boolean;
    apply_in_person: boolean;
    phone: string;
    website: string;
    email: string;
    other_info: string;
}

export interface IService extends Document {
    name: string;
    addresses: IAddress[];
    phone_numbers: IPhoneNumber[];
    services_freeform?: string;
    eligibility_criteria?: string;
    emails: string[];
    bus_routes: string[];
    website: string[];
    walk_ins: string;
    hours: string[];
    appointment: IAppointment;
    service_area: string;
    application: IApplication;
    cost_info: string;
    translation_available: string;
    united_way_approval: boolean;
    additional_information: string;
    categories: ICategory[];
}
