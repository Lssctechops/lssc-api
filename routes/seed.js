const express = require("express");
const router = express.Router();
const GoverningCouncil = require("../models/GoverningCouncil");
const TeamMember = require("../models/TeamMember");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const IMG = (id) =>
  `https://imagedelivery.net/QG8_dZ1qAgTI1Cq9RSDiZg/${id}/public`;

const councilChairman = {
  name: "Shri Sanjay Leekha",
  designation: "Chairman, Leather Sector Skill Council",
  company: "CMD, Alpine Apparels Pvt. Ltd.",
  id: "2798584d-3d85-4f2d-8461-0a25f190e700",
  chairman: true,
};

const councilMembers = [
  ["Shri Mukhtarul Amin", "Former Chairman, LSSC", "CMD, Super House Ltd", "be5ec496-fd75-476a-775a-9ad008643e00"],
  ["Shri Habib Hussain", "Former Chairman, LSSC", "Director, AV Thomas", "6631a9a7-87b5-4019-ff6a-bca86c5e4600"],
  ["Shri Rajendra K. Jalan", "Director", "AFPL Global Pvt. Ltd.", "6de98bf3-d491-48c0-9af4-fab9faaa5700"],
  ["Shri Rakesh Suri", "Director", "Irus International Pvt. Ltd", "af9b74fe-9c45-47b1-4128-054ce44b8300"],
  ["Shri Puran Chand Dawar", "Managing Director", "Dawar Footwear Pvt. Ltd", "fc3107e7-5e1d-4ffa-7df5-dbd8a8bf5200"],
  ["Shri Motilal Sethi", "Managing Director", "Saroj International Leathers Pvt. Ltd.", "e4680a6d-550a-47ba-6f91-c88462f64500"],
  ["Shri Gopal Gupta", "Managing Director", "Gupta HC Overseas Exports (I) Pvt. Ltd", "51602bc2-c894-4a76-5385-604295571900"],
  ["Shri N. Shafeeq Ahmed", "Managing Director", "Shafeeq Shameel & Co", "ca161eb2-e2af-4f30-c3b0-efb1f1594b00"],
  ["Shri Ramesh Kumar Juneja", "Director", "JC International", "01efe762-0fb2-462c-9daa-7f52d691d200"],
  ["Shri Rajiv Bhatia", "Director", "D2 International", "92beca67-52be-4853-8fbe-e36e88fac300"],
  ["Shri Sunil Taneja", "Director", "M/s. Cheyyar SEZ Developers", "2051bd1d-2b56-4ac1-5972-c46ea5332a00"],
  ["Dr. J. Rafiq Ahmed", "Managing Director", "M/s. Kothari Industrial Corpn. Ltd.", "a4f47a67-4bff-43ff-9caf-6fcdbe703700"],
  ["Shri Sahil Malik", "Managing Director", "M/s. Da Milano Leather Pvt. Ltd.", "91dd01c8-d5ef-41cb-77a6-7bc9f35d1f00"],
  ["Shri Dilip Kapur", "Managing Director", "M/s. Hidesign India Pvt. Ltd", "e2945b00-5027-4353-97b8-ca723bb95000"],
  ["Shri Javed Iqbal", "Managing Director", "Naaz Exports Pvt. Ltd.", "2a92b3f9-ab7b-4c3d-2207-7aa62e157b00"],
  ["Shri Kumar Nitesh", "CEO - Footwear Business", "M/s. Reliance Retail Ltd.", "58e7e526-ef6b-4fc0-aa82-54815b58b400"],
  ["Mr. P. S. Suresh", "CEO of Calsea Footwear (P) Ltd.", "A wholly-owned subsidiary of TATA International Limited", "08f33ecc-02a2-41f0-5ed0-61a691056800"],
  ["Shri Anjan Kundu", "Head - Supply Chain Management", "M/s. Bata India Ltd.", "73ced810-c765-4637-ac59-a292b9593c00"],
  ["Shri Sanjay Gupta", "President", "IFCOMA", "75809d65-a157-4936-68e1-6f7dcd244a00"],
  ["Dr. P. Thanikaivelan", "Director", "Central Leather Research Institute", "18bd254e-0a16-4b05-67da-c93de6924900"],
  ["Shri Vivek Sharma, IRS", "Managing Director", "Footwear Design & Development Institute (FDDI)", "60b6ff4d-4d2f-4779-d3d9-020285d01c00"],
  ["Shri K. Murali", "Director", "Central Footwear Training Institute", "afb6dfac-75fc-4858-55dd-ad0c64bf7f00"],
  ["Shri Dharmendra Kumar", "Nominee Director", "NSDC", "7f369bd5-ad1a-4d8c-407c-cb89286e9800"],
];

const team = [
  ["Atul Kumar Mishra", "Interim Chief Executive Officer", "ceo@leatherssc.org", "9971489936", "https://linkedin.com/in/atul-kumar-mishra-60090715", "0fe75bb2-cd9c-4a2e-a82a-41bd2cea6700", true],
  ["Mir Maqsood Ali", "Head - Administration & Governance", "maqsood@leatherssc.org", "7358588688", "https://linkedin.com/in/mir-maqsood-ali-7488641b1", "f96c1872-baba-4cde-cf73-027683bf5700", false],
  ["K Vimalathithan", "Head - Operations", "vimal@leatherssc.org", "9585011594", "https://linkedin.com/in/vimalathithan-krishnasamy-27386298", "658ccec6-b83a-4d9f-273d-5ae39b706a00", false],
  ["Ayush Chaturvedi", "Head - Assessments", "assessments@leatherssc.org", "9205615261", "https://linkedin.com/in/ayush-chaturvedi-176900138", "b88456cd-f8c1-4c69-28d9-f31148b22700", false],
  ["Amit Shukla", "Manager - Employer Relations", "amit@leatherssc.org", "8299227304", "https://linkedin.com/in/amit-shukla-486225215", "cc38bec2-fc39-4590-6980-e932f37d1000", false],
  ["Shahzeb Alam", "Manager - Employer Relations", "shahzeb@leatherssc.org", "9123381187", "https://linkedin.com/in/shahzeb-alam-448127110", "dbbfc40b-0988-4601-b78e-c4f641303300", false],
  ["Satish Kumar", "Manager - Accounts", "accounts@leatherssc.org", "7277239976", "", "65eeeae1-2f3a-4bad-671a-20a1ecfd3b00", false],
  ["Abhimanyu Kumar", "Manager - IT", "it@leatherssc.org", "9833040928", "https://linkedin.com/in/abhimanyu-kumar-98b94512b", "82f27cf8-318c-4ab2-cae4-2859df2ebf00", false],
  ["Neeraj Kumar Sharma", "Assistant Manager - Academics & Technical Research", "technical@leatherssc.org", "9910286513", "https://linkedin.com/in/neeraj-sharma-01946467", "d4e8f13a-c45d-46b8-e6c0-cd7e8a205700", false],
  ["Mohammed Yusuff", "Assistant Manager - IT & Assessment", "yusuff@leatherssc.org", "8939736143", "https://linkedin.com/in/mohammed-yusuff-b7835923b", "9408d4bc-4c5d-423d-a606-285bf096e500", false],
  ["Anuj Kumar Patel", "Executive - Assessments", "anuj@leatherssc.org", "9131473018", "https://linkedin.com/in/anuj-kumar-patel-94218436b", "9e3d1e55-23f9-4134-131d-1e6e64cb5100", false],
  ["Govindarajan B", "Master Trainer & SME", "govindarajan@leatherssc.org", "9445241516", "https://linkedin.com/in/govindarajan-balasundaram-33911421a", "a11a03b3-c504-484c-d9be-cb2973b29c00", false],
  ["M. Elangovan", "Pattern Maker & Master Trainer", "elangovan@leatherssc.org", "9176662820", "", "0e74893a-f2c6-4098-bc57-4928836d9300", false],
  ["Dhivakaran", "Executive", "lssc@leatherssc.org", "9994441917", "", "c5131a7a-0c5b-4f63-a395-ce038b5cbb00", false],
];

// Visit /api/seed/run ONCE to load all members. Remove this file after.
router.get("/run", async (req, res) => {
  try {
    await GoverningCouncil.deleteMany({});
    await TeamMember.deleteMany({});

    const councilDocs = [];
    councilDocs.push({
      name: councilChairman.name,
      designation: councilChairman.designation,
      company: councilChairman.company,
      thumbnail: { url: IMG(councilChairman.id), publicId: councilChairman.id },
      position: 1,
      isChairman: true,
      isActive: true,
    });
    councilMembers.forEach((m, i) => {
      councilDocs.push({
        name: m[0],
        designation: m[1],
        company: m[2],
        thumbnail: { url: IMG(m[3]), publicId: m[3] },
        position: i + 2,
        isChairman: false,
        isActive: true,
      });
    });

    const teamDocs = team.map((t, i) => ({
      name: t[0],
      designation: t[1],
      email: t[2],
      mobile: t[3],
      linkedin: t[4],
      thumbnail: { url: IMG(t[5]), publicId: t[5] },
      position: i + 1,
      isCeo: t[6],
      isActive: true,
    }));

    await GoverningCouncil.insertMany(councilDocs);
    await TeamMember.insertMany(teamDocs);

    res.json({
      success: true,
      message: "Seed complete",
      council: councilDocs.length,
      team: teamDocs.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// Visit /api/seed/admin ONCE to create the admin login. Remove this file after.
router.get("/admin", async (req, res) => {
  try {
    const mobile = "9999900000";
    const password = "Admin@123";
    await User.deleteOne({ mobile });
    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      name: "LSSC Admin",
      email: "admin@leatherssc.org",
      mobile,
      password: hashed,
      role: "admin",
      isVerified: true,
      isApproved: true,
      status: "active",
    });
    res.json({
      success: true,
      message: "Admin login created. Use these to log in, then change later.",
      mobile,
      password,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;