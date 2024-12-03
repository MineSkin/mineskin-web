export interface Stats {
    generated: {
        time: {
            hour: {
                current: NewDup;
                last: NewDup;
            },
            day: {
                current: NewDup;
                last: NewDup;
            },
            month: {
                current: NewDup;
            },
            year: {
                current: NewDup;
            }
        },
        total: NewDup
    },
    generator: {
        capacity: {
            global: number
        },
        active: {
            global: number
        }
    },
    accounts: {
        usable: {
            global: number
        }
    }
}

export interface NewDup {
    new: number;
    duplicate: number;
}