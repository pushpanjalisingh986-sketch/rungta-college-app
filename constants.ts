
import { Section } from './types';

const getAvatar = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

export const SECTIONS: Section[] = [
  {
    id: "SEC-1",
    name: "CS1-1",
    facultyName: "Aditya Kumar",
    facultyPhone: "7987453931",
    facultyPic: getAvatar("Aditya"),
    currentStrength: 0,
    lastUpdate: new Date().toISOString(),
    crs: [
      { name: "Aakash Bhagat", phone: "9340578319", email: "aakash.bhagat@rungta.org", reliability: 98, profilePic: getAvatar("Aakash") },
      { name: "Aishwary Tiwari", phone: "9039268348", email: "aishwary.tiwari@rungta.org", reliability: 92, profilePic: getAvatar("Aishwary") },
      { name: "Akshara Sharma", phone: "9589915997", email: "akshara.sharma@rungta.org", reliability: 85, profilePic: getAvatar("Akshara") },
      { name: "Aastha Jha", phone: "7033478233", email: "aastha.jha@rungta.org", reliability: 95, profilePic: getAvatar("Aastha") }
    ]
  },
  {
    id: "SEC-2",
    name: "CS1-2",
    facultyName: "Dr. Manju Sanghi",
    facultyPhone: "9827467643",
    facultyPic: getAvatar("Manju"),
    currentStrength: 0,
    lastUpdate: new Date().toISOString(),
    crs: [
      { name: "Anshu Kumar", phone: "8507651417", email: "anshu.kumar@rungta.org", reliability: 89, profilePic: getAvatar("Anshu") },
      { name: "Arsh Kamal", phone: "8709936477", email: "arsh.arsh@rungta.org", reliability: 94, profilePic: getAvatar("Arsh") },
      { name: "Anshika Gupta", phone: "9993915195", email: "anshika.gupta@rungta.org", reliability: 88, profilePic: getAvatar("Anshika") },
      { name: "Amrita Mandal", phone: "8539003200", email: "amrita.mandal@rungta.org", reliability: 91, profilePic: getAvatar("Amrita") }
    ]
  },
  {
    id: "SEC-3",
    name: "CS1-3",
    facultyName: "Dr. Onika Parmar",
    facultyPhone: "7879821068",
    facultyPic: getAvatar("Onika"),
    currentStrength: 0,
    lastUpdate: new Date().toISOString(),
    crs: [
      { name: "Bipin Pandey", phone: "9229731712", email: "bipin.pandey@rungta.org", reliability: 97, profilePic: getAvatar("Bipin") },
      { name: "Aditi Singh", phone: "8102817906", email: "aditi.singh1@rungta.org", reliability: 93, profilePic: getAvatar("Aditi") },
      { name: "Aryan Yadav", phone: "8602201956", email: "aryan.yadav@rungta.org", reliability: 90, profilePic: getAvatar("Aryan") },
      { name: "Arya Singh", phone: "9918705492", email: "arya.singh@rungta.org", reliability: 86, profilePic: getAvatar("Arya") }
    ]
  },
  {
    id: "SEC-4",
    name: "CS1-4",
    facultyName: "Akshay Kumar",
    facultyPhone: "8709953902",
    facultyPic: getAvatar("AkshayK"),
    currentStrength: 0,
    lastUpdate: new Date().toISOString(),
    crs: [
      { name: "Eklavya Pandey", phone: "9039854580", email: "eklavya.pandy@rungta.org", reliability: 92, profilePic: getAvatar("Eklavya") },
      { name: "Jaya Ghosh", phone: "9203319395", email: "jaya.ghosh@rungta.org", reliability: 95, profilePic: getAvatar("Jaya") },
      { name: "Jatin Choudhary", phone: "9285020250", email: "jatin.choudhary@rungta.org", reliability: 84, profilePic: getAvatar("Jatin") },
      { name: "Hanshika Jain", phone: "8269944688", email: "hanshika.jain@rungta.org", reliability: 88, profilePic: getAvatar("Hanshika") }
    ]
  },
  {
    id: "SEC-5",
    name: "CS1-5",
    facultyName: "Bhumika Shrivastava",
    facultyPhone: "9753466625",
    facultyPic: getAvatar("Bhumika"),
    currentStrength: 0,
    lastUpdate: new Date().toISOString(),
    crs: [
      { name: "Keshav Mazumdar", phone: "8252613698", email: "keshav.mazumdar@rungta.org", reliability: 91, profilePic: getAvatar("Keshav") },
      { name: "Mahek Siddiqui", phone: "8839468235", email: "mahek.siddiqui@rungta.org", reliability: 89, profilePic: getAvatar("Mahek") },
      { name: "Khushi Singh", phone: "7766959996", email: "khushi.singh@rungta.org", reliability: 96, profilePic: getAvatar("Khushi") },
      { name: "Krish Lalwani", phone: "7240832165", email: "krish.lalwani@rungta.org", reliability: 87, profilePic: getAvatar("Krish") }
    ]
  },
  {
    id: "SEC-6",
    name: "CS1-6",
    facultyName: "Harshali Vaishnaw",
    facultyPhone: "8305994142",
    facultyPic: getAvatar("Harshali"),
    currentStrength: 0,
    lastUpdate: new Date().toISOString(),
    crs: [
      { name: "Nidhi Shailja Singh", phone: "6264412030", email: "nidhi.shailja.singh@rungta.org", reliability: 94, profilePic: getAvatar("Nidhi") },
      { name: "Palak Kumari", phone: "8709029972", email: "palak.kumari1@rungta.org", reliability: 92, profilePic: getAvatar("Palak") },
      { name: "Piyush Kumar Barnwal", phone: "9234010179", email: "piyush.kumar.barnwal@rungta.org", reliability: 85, profilePic: getAvatar("Piyush") },
      { name: "Meraj Husain", phone: "9931229825", email: "meraj.husain@rungta.org", reliability: 93, profilePic: getAvatar("Meraj") }
    ]
  },
  {
    id: "SEC-7",
    name: "CS1-7",
    facultyName: "Ishita Gupta",
    facultyPhone: "6265332497",
    facultyPic: getAvatar("Ishita"),
    currentStrength: 0,
    lastUpdate: new Date().toISOString(),
    crs: [
      { name: "Raj Narayan Singh", phone: "8102848776", email: "raj.narayan.singh@rungta.org", reliability: 98, profilePic: getAvatar("RajN") },
      { name: "Rashmaan Kaur Dhiman", phone: "7898882859", email: "rashmaan.kaur.dhiman@rungta.org", reliability: 95, profilePic: getAvatar("Rashmaan") },
      { name: "Raj Singh", phone: "8789140160", email: "raj.singh@rungta.org", reliability: 88, profilePic: getAvatar("RajS") },
      { name: "Rakhi Katankar", phone: "9589491092", email: "rakhi.katankar@rungta.org", reliability: 91, profilePic: getAvatar("Rakhi") }
    ]
  },
  {
    id: "SEC-8",
    name: "CS1-8",
    facultyName: "Shweta Pandey",
    facultyPhone: "9755110168",
    facultyPic: getAvatar("Shweta"),
    currentStrength: 0,
    lastUpdate: new Date().toISOString(),
    crs: [
      { name: "Sadiya Fatima", phone: "9179733802", email: "sadiya.fatima@rungta.org", reliability: 86, profilePic: getAvatar("Sadiya") },
      { name: "Sahil Raja", phone: "9572765391", email: "sahil.raja@rungta.org", reliability: 94, profilePic: getAvatar("Sahil") },
      { name: "Rimjhim Gupta", phone: "9039368807", email: "rimjhim.gupta@rungta.org", reliability: 92, profilePic: getAvatar("Rimjhim") },
      { name: "Raushan Kumar", phone: "9359991736", email: "raushan.kumar@rungta.org", reliability: 89, profilePic: getAvatar("Raushan") }
    ]
  },
  {
    id: "SEC-9",
    name: "CS1-9",
    facultyName: "Firdaush Jahan",
    facultyPhone: "9340331642",
    facultyPic: getAvatar("Firdaush"),
    currentStrength: 0,
    lastUpdate: new Date().toISOString(),
    crs: [
      { name: "Shejal Das", phone: "9302809738", email: "shejal.das@rungta.org", reliability: 93, profilePic: getAvatar("Shejal") },
      { name: "Shivam Kumar Kunwar", phone: "9142045643", email: "shivam.kumar.kunwar@rungta.org", reliability: 87, profilePic: getAvatar("Shivam") },
      { name: "Shaurya Khandelwal", phone: "6232552177", email: "shaurya.khandelwar@rungta.org", reliability: 95, profilePic: getAvatar("Shaurya") },
      { name: "Sargam Poddar", phone: "7470330200", email: "sargam.poddar@rungta.org", reliability: 91, profilePic: getAvatar("Sargam") }
    ]
  },
  {
    id: "SEC-10",
    name: "CS1-10",
    facultyName: "Lakshman Sahu",
    facultyPhone: "7898679082",
    facultyPic: getAvatar("Lakshman"),
    currentStrength: 0,
    lastUpdate: new Date().toISOString(),
    crs: [
      { name: "Vikash Kumar", phone: "9905802499", email: "vikash.kumar2@rungta.org", reliability: 96, profilePic: getAvatar("Vikash") },
      { name: "Ujjawal", phone: "9155993199", email: "ujjawal.kumar3@rungta.org", reliability: 90, profilePic: getAvatar("Ujjawal") },
      { name: "Sunidhi Chauhan", phone: "6206275820", email: "sunidhi.chauhan@rungta.org", reliability: 92, profilePic: getAvatar("Sunidhi") },
      { name: "Tamanna Sindhu", phone: "7691933751", email: "tamanna.sindhu@rungta.org", reliability: 88, profilePic: getAvatar("Tamanna") }
    ]
  },
  {
    id: "SEC-11",
    name: "CS1-11",
    facultyName: "Dr. Pankaj Sarde",
    facultyPhone: "9131206151",
    facultyPic: getAvatar("Pankaj"),
    currentStrength: 0,
    lastUpdate: new Date().toISOString(),
    crs: [
      { name: "Apeksha Thawkar", phone: "9373800686", email: "apeksha.thawkar@rungta.org", reliability: 94, profilePic: getAvatar("Apeksha") },
      { name: "Yashna Mahilang", phone: "9244081104", email: "yashna.mahilang@rungta.org", reliability: 85, profilePic: getAvatar("Yashna") },
      { name: "Yachhat Sharma", phone: "9399189022", email: "yachhat.sharma@rungta.org", reliability: 97, profilePic: getAvatar("Yachhat") },
      { name: "Sahitya Singh", phone: "9835096471", email: "sahitya.singh@rungta.org", reliability: 91, profilePic: getAvatar("Sahitya") }
    ]
  },
  {
    id: "SEC-12",
    name: "CS1 IBM-12",
    facultyName: "Rubi Kambo",
    facultyPhone: "8817777122",
    facultyPic: getAvatar("Rubi"),
    currentStrength: 0,
    lastUpdate: new Date().toISOString(),
    crs: [
      { name: "Ashish Kumar Singh", phone: "9343993617", email: "ashish.kumar.singh@rungta.org", reliability: 92, profilePic: getAvatar("Ashish") },
      { name: "Naitik Raj", phone: "9693034763", email: "naitik.raj@rungta.org", reliability: 89, profilePic: getAvatar("Naitik") },
      { name: "Aditi Sahu", phone: "9981990218", email: "aditi.sahu@rungta.org", reliability: 95, profilePic: getAvatar("AditiS") },
      { name: "Nitika Dewangan", phone: "8770369615", email: "nitika.dewangan@rungta.org", reliability: 93, profilePic: getAvatar("Nitika") }
    ]
  },
  {
    id: "SEC-13",
    name: "CS1 IBM-13",
    facultyName: "Ashish Agrawal",
    facultyPhone: "8319152798",
    facultyPic: getAvatar("AshishA"),
    currentStrength: 0,
    lastUpdate: new Date().toISOString(),
    crs: [
      { name: "Samarjeet Singh", phone: "8602937113", email: "samarjeet.singh@rungta.org", reliability: 94, profilePic: getAvatar("Samarjeet") },
      { name: "Shikha Yadav", phone: "9800177330", email: "shikha.yadav@rungta.org", reliability: 96, profilePic: getAvatar("Shikha") },
      { name: "Tushar Giri", phone: "8957521214", email: "tushar.giri@rungta.org", reliability: 87, profilePic: getAvatar("Tushar") },
      { name: "Trisha", phone: "6267652496", email: "trisha.soni@rungta.org", reliability: 91, profilePic: getAvatar("Trisha") }
    ]
  }
];

export const LOGO_URL = "https://images.unsplash.com/photo-1592288333291-700dc3ad4426?auto=format&fit=crop&q=80&w=400";
