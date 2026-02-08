// Real Cape Town service locations
// These can be inserted into Supabase via the Admin page or SQL

export const capeTownServices = [
  // Restaurants
  {
    name: "The Test Kitchen",
    type: "restaurant",
    address: "375 Albert Rd, Woodstock, Cape Town, 7915",
    lat: -33.9268,
    lng: 18.4478,
    phone: "+27 21 447 2337",
    hours: "Tue-Sat 12:00-15:00, 19:00-22:00",
    description: "Award-winning fine dining restaurant by chef Luke Dale-Roberts"
  },
  {
    name: "Kloof Street House",
    type: "restaurant",
    address: "30 Kloof St, Gardens, Cape Town, 8001",
    lat: -33.9304,
    lng: 18.4132,
    phone: "+27 21 423 4413",
    hours: "Mon-Sun 12:00-22:00",
    description: "Charming Victorian house restaurant with contemporary cuisine"
  },
  {
    name: "Gold Restaurant",
    type: "restaurant",
    address: "15 Bennett St, Green Point, Cape Town, 8005",
    lat: -33.9121,
    lng: 18.4195,
    phone: "+27 21 421 4653",
    hours: "Mon-Sun 18:30-23:00",
    description: "African dining experience with traditional entertainment"
  },
  {
    name: "Olympia Café & Deli",
    type: "restaurant",
    address: "134 Main Rd, Kalk Bay, Cape Town, 7975",
    lat: -34.1287,
    lng: 18.4486,
    phone: "+27 21 788 6396",
    hours: "Mon-Sun 07:00-21:00",
    description: "Popular seaside café known for breakfast and fresh baked goods"
  },
  {
    name: "La Colombe",
    type: "restaurant",
    address: "Silvermist Wine Estate, Constantia Nek, Cape Town, 7806",
    lat: -34.0089,
    lng: 18.4012,
    phone: "+27 21 794 2390",
    hours: "Wed-Sun 12:00-14:30, 18:30-21:00",
    description: "World-renowned fine dining with stunning mountain views"
  },

  // Police Stations
  {
    name: "Cape Town Central Police Station",
    type: "police",
    address: "2 Buitenkant St, Cape Town City Centre, 8001",
    lat: -33.9258,
    lng: 18.4247,
    phone: "+27 21 467 8000",
    hours: "24 hours",
    description: "Main SAPS station serving Cape Town CBD"
  },
  {
    name: "Sea Point Police Station",
    type: "police",
    address: "129 Main Rd, Sea Point, Cape Town, 8005",
    lat: -33.9167,
    lng: 18.3867,
    phone: "+27 21 430 8777",
    hours: "24 hours",
    description: "SAPS station serving Sea Point and surrounds"
  },
  {
    name: "Claremont Police Station",
    type: "police",
    address: "Cnr Lansdowne & Main Rd, Claremont, Cape Town, 7708",
    lat: -33.9847,
    lng: 18.4647,
    phone: "+27 21 657 3300",
    hours: "24 hours",
    description: "SAPS station serving Claremont and Southern Suburbs"
  },
  {
    name: "Bellville Police Station",
    type: "police",
    address: "Voortrekker Rd, Bellville, Cape Town, 7530",
    lat: -33.9017,
    lng: 18.6267,
    phone: "+27 21 941 6200",
    hours: "24 hours",
    description: "SAPS station serving Bellville area"
  },
  {
    name: "Muizenberg Police Station",
    type: "police",
    address: "Main Rd, Muizenberg, Cape Town, 7945",
    lat: -34.1087,
    lng: 18.4697,
    phone: "+27 21 787 9000",
    hours: "24 hours",
    description: "SAPS station serving Muizenberg and False Bay"
  },

  // Parks
  {
    name: "Table Mountain National Park",
    type: "park",
    address: "Tafelberg Rd, Cape Town, 8001",
    lat: -33.9628,
    lng: 18.4098,
    phone: "+27 21 712 0527",
    hours: "05:00-18:00 (varies seasonally)",
    description: "Iconic flat-topped mountain and UNESCO World Heritage Site"
  },
  {
    name: "Kirstenbosch National Botanical Garden",
    type: "park",
    address: "Rhodes Dr, Newlands, Cape Town, 7735",
    lat: -33.9881,
    lng: 18.4328,
    phone: "+27 21 799 8783",
    hours: "08:00-18:00 (summer), 08:00-17:00 (winter)",
    description: "World-famous botanical garden on the slopes of Table Mountain"
  },
  {
    name: "Company's Garden",
    type: "park",
    address: "Queen Victoria St, Cape Town City Centre, 8001",
    lat: -33.9275,
    lng: 18.4178,
    phone: "+27 21 400 2521",
    hours: "07:00-19:00",
    description: "Historic park in the heart of Cape Town, established in 1652"
  },
  {
    name: "Green Point Urban Park",
    type: "park",
    address: "1 Fritz Sonnenberg Rd, Green Point, Cape Town, 8005",
    lat: -33.9047,
    lng: 18.4098,
    hours: "07:00-19:00",
    description: "Eco-friendly urban park with biodiversity garden and play areas"
  },
  {
    name: "Tokai Forest",
    type: "park",
    address: "Tokai Rd, Tokai, Cape Town, 7945",
    lat: -34.0587,
    lng: 18.4147,
    phone: "+27 21 712 7471",
    hours: "Sunrise to sunset",
    description: "Pine forest with walking and mountain biking trails"
  },
  {
    name: "Silvermine Nature Reserve",
    type: "park",
    address: "Ou Kaapse Weg, Silvermine, Cape Town, 7975",
    lat: -34.0847,
    lng: 18.4267,
    phone: "+27 21 712 0527",
    hours: "07:00-18:00",
    description: "Nature reserve with hiking trails and a reservoir for swimming"
  },

  // Hospitals
  {
    name: "Groote Schuur Hospital",
    type: "hospital",
    address: "Main Rd, Observatory, Cape Town, 7925",
    lat: -33.9417,
    lng: 18.4617,
    phone: "+27 21 404 9111",
    hours: "24 hours",
    description: "Historic teaching hospital, site of first human heart transplant"
  },
  {
    name: "Tygerberg Hospital",
    type: "hospital",
    address: "Francie van Zijl Dr, Parow Valley, Cape Town, 7505",
    lat: -33.8917,
    lng: 18.6117,
    phone: "+27 21 938 4911",
    hours: "24 hours",
    description: "One of the largest hospitals in the Western Cape"
  },
  {
    name: "Red Cross War Memorial Children's Hospital",
    type: "hospital",
    address: "Klipfontein Rd, Rondebosch, Cape Town, 7700",
    lat: -33.9567,
    lng: 18.4737,
    phone: "+27 21 658 5111",
    hours: "24 hours",
    description: "Specialist children's hospital serving Southern Africa"
  },
  {
    name: "Christiaan Barnard Memorial Hospital",
    type: "hospital",
    address: "181 Longmarket St, Cape Town City Centre, 8001",
    lat: -33.9237,
    lng: 18.4217,
    phone: "+27 21 480 6111",
    hours: "24 hours",
    description: "Private hospital in the Cape Town CBD"
  },
  {
    name: "Vincent Pallotti Hospital",
    type: "hospital",
    address: "Alexandra Rd, Pinelands, Cape Town, 7405",
    lat: -33.9367,
    lng: 18.5117,
    phone: "+27 21 506 5111",
    hours: "24 hours",
    description: "Private hospital in the Southern Suburbs"
  },

  // Pharmacies
  {
    name: "Clicks Pharmacy V&A Waterfront",
    type: "pharmacy",
    address: "Shop 6140, Victoria Wharf, V&A Waterfront, Cape Town, 8001",
    lat: -33.9047,
    lng: 18.4207,
    phone: "+27 21 419 0037",
    hours: "Mon-Sat 09:00-21:00, Sun 10:00-21:00",
    description: "Pharmacy and health store at the V&A Waterfront"
  },
  {
    name: "Dis-Chem Pharmacy Canal Walk",
    type: "pharmacy",
    address: "Canal Walk Shopping Centre, Century City, Cape Town, 7441",
    lat: -33.8947,
    lng: 18.5117,
    phone: "+27 21 555 3710",
    hours: "Mon-Fri 09:00-21:00, Sat-Sun 09:00-20:00",
    description: "Large pharmacy in Canal Walk mall"
  },
  {
    name: "M-Kem Pharmacy Claremont",
    type: "pharmacy",
    address: "Cavendish Square, Claremont, Cape Town, 7708",
    lat: -33.9847,
    lng: 18.4617,
    phone: "+27 21 683 3090",
    hours: "Mon-Fri 08:30-18:00, Sat 09:00-14:00",
    description: "Independent pharmacy serving Claremont area"
  },
  {
    name: "Clicks Pharmacy Gardens Centre",
    type: "pharmacy",
    address: "Gardens Centre, Mill St, Gardens, Cape Town, 8001",
    lat: -33.9337,
    lng: 18.4147,
    phone: "+27 21 465 4640",
    hours: "Mon-Fri 08:00-20:00, Sat 08:00-18:00, Sun 09:00-14:00",
    description: "Pharmacy in Gardens shopping centre"
  },

  // Schools
  {
    name: "South African College Schools (SACS)",
    type: "school",
    address: "Newlands Ave, Newlands, Cape Town, 7700",
    lat: -33.9617,
    lng: 18.4617,
    phone: "+27 21 689 4164",
    hours: "Mon-Fri 07:30-14:30",
    description: "Historic boys' school founded in 1829"
  },
  {
    name: "Rustenburg Girls' High School",
    type: "school",
    address: "Rondebosch, Cape Town, 7700",
    lat: -33.9617,
    lng: 18.4717,
    phone: "+27 21 686 2281",
    hours: "Mon-Fri 07:30-14:30",
    description: "Leading girls' high school in the Southern Suburbs"
  },
  {
    name: "Rondebosch Boys' High School",
    type: "school",
    address: "Canigou Ave, Rondebosch, Cape Town, 7700",
    lat: -33.9587,
    lng: 18.4747,
    phone: "+27 21 686 1070",
    hours: "Mon-Fri 07:30-14:30",
    description: "Premier boys' school with strong academic tradition"
  },
  {
    name: "Camps Bay High School",
    type: "school",
    address: "5 Theresa Ave, Camps Bay, Cape Town, 8005",
    lat: -33.9517,
    lng: 18.3767,
    phone: "+27 21 438 1524",
    hours: "Mon-Fri 07:45-14:15",
    description: "Public high school with stunning ocean views"
  },
  {
    name: "Westerford High School",
    type: "school",
    address: "Main Rd, Rondebosch, Cape Town, 7700",
    lat: -33.9647,
    lng: 18.4747,
    phone: "+27 21 689 9643",
    hours: "Mon-Fri 07:30-14:30",
    description: "Co-educational public high school"
  },

  // Additional Food Banks
  {
    name: "FoodForward SA - Cape Town",
    type: "food",
    address: "11 Mowbray St, Epping Industria, Cape Town, 7460",
    lat: -33.9317,
    lng: 18.5247,
    phone: "+27 21 531 9920",
    hours: "Mon-Fri 08:00-16:30",
    description: "Food redistribution warehouse supporting 700+ beneficiary organisations"
  },
  {
    name: "Ladles of Love",
    type: "food",
    address: "9 Park Lane, Gardens, Cape Town, 8001",
    lat: -33.9347,
    lng: 18.4097,
    phone: "+27 21 422 2205",
    hours: "Mon-Fri 08:00-17:00",
    description: "Community kitchen providing nutritious meals"
  },

  // Additional Libraries
  {
    name: "Cape Town Central Library",
    type: "library",
    address: "Drill Hall, Darling St, Cape Town City Centre, 8001",
    lat: -33.9247,
    lng: 18.4217,
    phone: "+27 21 444 0711",
    hours: "Mon-Fri 10:00-18:00, Sat 09:00-13:00",
    description: "Main public library in the Cape Town CBD"
  },
  {
    name: "Rondebosch Library",
    type: "library",
    address: "Sandown Rd, Rondebosch, Cape Town, 7700",
    lat: -33.9647,
    lng: 18.4747,
    phone: "+27 21 689 4028",
    hours: "Mon-Fri 09:00-17:00, Sat 09:00-12:00",
    description: "Community library in the Southern Suburbs"
  },

  // Additional Clinics
  {
    name: "Woodstock Community Day Centre",
    type: "clinic",
    address: "Bromwell St, Woodstock, Cape Town, 7925",
    lat: -33.9267,
    lng: 18.4447,
    phone: "+27 21 404 5312",
    hours: "Mon-Fri 07:30-16:00",
    description: "Primary healthcare clinic serving Woodstock community"
  },
  {
    name: "Khayelitsha Site B Community Health Centre",
    type: "clinic",
    address: "Walter Sisulu Rd, Khayelitsha, Cape Town, 7784",
    lat: -34.0387,
    lng: 18.6747,
    phone: "+27 21 360 5200",
    hours: "24 hours",
    description: "Large community health centre in Khayelitsha"
  }
];

// Helper function to seed services (can be called from Admin page)
export const seedServices = async (supabase: any) => {
  const { data, error } = await supabase
    .from('services')
    .upsert(
      capeTownServices.map(service => ({
        ...service,
        id: crypto.randomUUID()
      })),
      { onConflict: 'name' }
    );
  
  return { data, error };
};
