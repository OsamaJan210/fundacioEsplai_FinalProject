// postalCodes.js
const postalCodesData = {
  ES: { // España
    Madrid: {
      Madrid: '28001',
      Alcobendas: '28100',
      Getafe: '28901',
      Móstoles: '28930',
      Leganés: '28910',
      Fuenlabrada: '28940',
      Alcorcón: '28920',
      Parla: '28980',
    },
    Catalonia: {
      Barcelona: '08001',
      Badalona: '08910',
      Hospitalet: '08901',
      Terrassa: '08220',
      Sabadell: '08201',
      Mataró: '08301',
      SantaColoma: '08920',
      Igualada: '08700',
    },
    Valencia: {
      Valencia: '46001',
      Gandia: '46700',
      Torrent: '46900',
      Paterna: '46980',
      Alcàsser: '46190',
    },
    Sevilla: {
      Sevilla: '41001',
      DosHermanas: '41701',
      AlcaláGuadaira: '41500',
      Utrera: '41710',
    },
    Andalucía: {
      Córdoba: '14001',
      Granada: '18001',
      Málaga: '29001',
      Cádiz: '11001',
    }
  },

  US: { // Estados Unidos
    California: {
      'Los Angeles': '90001',
      'San Francisco': '94101',
      'San Diego': '92101',
      Sacramento: '95814',
      Fresno: '93701',
      Oakland: '94601',
      SanJose: '95101',
    },
    Texas: {
      Houston: '77001',
      Dallas: '75201',
      Austin: '73301',
      SanAntonio: '78201',
      FortWorth: '76101',
      ElPaso: '79901',
    },
    NewYork: {
      'New York': '10001',
      Buffalo: '14201',
      Rochester: '14602',
      Yonkers: '10701',
      Syracuse: '13201',
    },
    Florida: {
      Miami: '33101',
      Orlando: '32801',
      Tampa: '33601',
      Jacksonville: '32099',
    }
  },

  MX: { // México
    'Ciudad de México': {
      'Ciudad de México': '01000',
      Coyoacán: '04000',
      Tlalpan: '14000',
      Iztapalapa: '09000',
      GustavoA_Madero: '07000',
      ÁlvaroObregón: '01000',
    },
    Jalisco: {
      Guadalajara: '44100',
      Zapopan: '45100',
      Tlaquepaque: '45500',
      Tonalá: '45400',
      Tlajomulco: '45600',
    },
    NuevoLeon: {
      Monterrey: '64000',
      Guadalupe: '67100',
      SanNicolas: '66400',
      Apodaca: '66600',
    }
  },

  FR: { // Francia
    'Île-de-France': {
      Paris: '75000',
      Versailles: '78000',
      BoulogneBillancourt: '92100',
      SaintDenis: '93200',
      Nanterre: '92000',
    },
    'Provence-Alpes-Côte d\'Azur': {
      Marseille: '13000',
      Nice: '06000',
      Toulon: '83000',
      AixEnProvence: '13100',
    },
    'Auvergne-Rhône-Alpes': {
      Lyon: '69000',
      Grenoble: '38000',
      SaintEtienne: '42000',
    }
  },

  DE: { // Alemania
    Bayern: {
      München: '80331',
      Nürnberg: '90402',
      Augsburg: '86150',
      Regensburg: '93047',
    },
    Berlin: {
      Berlin: '10115',
    },
    Hessen: {
      Frankfurt: '60311',
      Wiesbaden: '65183',
      Darmstadt: '64283',
    },
    NordrheinWestfalen: {
      Köln: '50667',
      Düsseldorf: '40210',
      Dortmund: '44135',
    }
  },

  IT: { // Italia
    Lombardia: {
      Milano: '20100',
      Bergamo: '24100',
      Brescia: '25100',
      Monza: '20900',
      Como: '22100',
    },
    Lazio: {
      Roma: '00100',
      Latina: '04100',
      Frosinone: '03100',
    },
    Toscana: {
      Firenze: '50100',
      Pisa: '56100',
      Siena: '53100',
      Livorno: '57100',
    }
  },

  UK: { // Reino Unido
    England: {
      London: 'EC1A',
      Manchester: 'M1',
      Birmingham: 'B1',
      Leeds: 'LS1',
      Liverpool: 'L1',
    },
    Scotland: {
      Edinburgh: 'EH1',
      Glasgow: 'G1',
      Aberdeen: 'AB10',
    },
    Wales: {
      Cardiff: 'CF10',
      Swansea: 'SA1',
      Newport: 'NP20',
    },
    NorthernIreland: {
      Belfast: 'BT1',
    }
  },

  CA: { // Canadá
    Ontario: {
      Toronto: 'M5H',
      Ottawa: 'K1A',
      Hamilton: 'L8P',
      London: 'N6A',
    },
    Quebec: {
      Montreal: 'H1A',
      QuebecCity: 'G1A',
      Laval: 'H7A',
    },
    BritishColumbia: {
      Vancouver: 'V5K',
      Victoria: 'V8W',
    }
  },

  AU: { // Australia
    'New South Wales': {
      Sydney: '2000',
      Newcastle: '2300',
      Wollongong: '2500',
    },
    Victoria: {
      Melbourne: '3000',
      Geelong: '3220',
      Ballarat: '3350',
    },
    Queensland: {
      Brisbane: '4000',
      GoldCoast: '4217',
    }
  },

  BR: { // Brasil
    SãoPaulo: {
      SãoPaulo: '01000-000',
      Campinas: '13010-000',
      Santos: '11010-000',
    },
    RioDeJaneiro: {
      RioDeJaneiro: '20000-000',
      Niterói: '24010-000',
    }
  },

  AR: { // Argentina
    BuenosAires: {
      BuenosAires: '1000',
      LaPlata: '1900',
      MarDelPlata: '7600',
    },
    Córdoba: {
      Córdoba: '5000',
      VillaCarlosPaz: '5152',
    }

  },
    CL: { // Chile
        Santiago: {
        Santiago: '8320000',
        Valparaíso: '2340000',
        Concepción: '4030000',
        },
        Antofagasta: {
        Antofagasta: '1240000',
        }
    },
    CO: { // Colombia
        Bogotá: {
        Bogotá: '110111',
        Medellín: '050001',
        Cali: '760001',
        Barranquilla: '080001',
        Cartagena: '130001',
        },
        Antioquia: {
        Medellín: '050001',
        }
    },
    IN: { // India
        Delhi: {
        NewDelhi: '110001',
        Gurgaon: '122001',
        Noida: '201301',
        },
        Maharashtra: {
        Mumbai: '400001',
        Pune: '411001',
        Nagpur: '440001',
        }
    },
    CN: { // China
        Beijing: {
        Beijing: '100000',
        },
        Shanghai: {
        Shanghai: '200000',
        },
        Guangdong: {
        Guangzhou: '510000',
        }
    },
    JP: { // Japón
        Tokyo: {
        Tokyo: '100-0001',
        Yokohama: '220-0001',
        },
        Osaka: {
        Osaka: '530-0001',
        Kyoto: '600-0001',
        }
    },
    RU: { // Rusia
        Moscow: {
        Moscow: '101000',
        },
        SaintPetersburg: {
        SaintPetersburg: '190000',
        }
    },
    CA: { // Canadá
        Ontario: {
        Toronto: 'M5H',
        Ottawa: 'K1A',
        },
        Quebec: {
        Montreal: 'H1A',
        QuebecCity: 'G1A',
        }
    },
    US: { // Estados Unidos
        California: {
        LosAngeles: '90001',
        SanFrancisco: '94101',
        SanDiego: '92101',
        },
        Texas: {
        Houston: '77001',
        Dallas: '75201',
        Austin: '73301',
        }
    },
    GB: { // Reino Unido
        England: {
        London: 'EC1A',
        Manchester: 'M1',
        Birmingham: 'B1',
        },
        Scotland: {
        Edinburgh: 'EH1',
        Glasgow: 'G1',
        }
    },
};
export default postalCodesData;
