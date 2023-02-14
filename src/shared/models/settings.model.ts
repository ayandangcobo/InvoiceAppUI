export default class Settings {
    id: number;

    company_name: string;
    website: string;
    phone: string;

    address: string;
    postal_code: string;
    city: string;
    country: string;

    business_number: string;
    vat: string;

    bank: string;
    bank_account: string;

    email: string;
    password: string;
    smtp: string;
    smtp_port: number;

    invoice_prefix: string;

    logo: string;
    show_logo: boolean;
    show_logo_in_pdf: boolean;
    color: string;
}
