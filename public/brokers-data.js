/* People-search sites on the removal checklist. tools/sync.py builds brokers.json from this. */
window.OOK_BROKERS=[
 {id:"beenverified",name:"BeenVerified",p:1,search:"",opt:"https://www.beenverified.com/app/optout/search",tip:"Also covers PeopleLooker and PeopleSmart. One opt-out per email address; confirm by the email link."},
 {id:"checkpeople",name:"CheckPeople",p:1,search:"",opt:"https://checkpeople.com/opt-out",tip:"Request your data first under Right to Know. The opt-out asks for birthdate and full legal name."},
 {id:"intelius",name:"Intelius / PeopleConnect",p:1,search:"",opt:"https://suppression.peopleconnect.us/login",tip:"Skip intelius.com, where searches are slow and end in a paid report. The opt-out page finds your record itself. One form covers Instant Checkmate, TruthFinder, US Search, ZabaSearch, Classmates and more."},
 {id:"mylife",name:"MyLife",p:1,search:"",opt:"https://www.mylife.com/privacyrequest",tip:"It may push you to make an account with ID. Emailing privacy@mylife.com with your profile link is an alternative."},
 {id:"nuwber",name:"Nuwber",p:1,search:"https://nuwber.com/",opt:"https://nuwber.com/removal/link",tip:"Filter by state to find your profile link, then paste it in the removal form. Skip the paid report."},
 {id:"smartbgc",name:"SmartBackgroundChecks",p:1,search:"",opt:"https://www.smartbackgroundchecks.com/optout",tip:"Usually removes you from PeopleFinders too."},
 {id:"spokeo",name:"Spokeo",p:1,search:"https://www.spokeo.com/search",opt:"https://www.spokeo.com/optout",tip:"Paste your profile link and email, then confirm by the email link."},
 {id:"thatsthem",name:"That's Them",p:1,search:"",opt:"https://thatsthem.com/optout",tip:"Ignore the identity-protection upsell links."},
 {id:"whitepages",name:"Whitepages",p:1,search:"https://www.whitepages.com/",opt:"https://www.whitepages.com/suppression_requests",tip:"Copy the link to your listing first, then paste it in the removal form. Verifies by phone call with a code. Also removes you from 411.com."},
 {id:"fastpeople",name:"FastPeopleSearch",p:1,search:"",opt:"https://www.fastpeoplesearch.com/optout",tip:"Expect a captcha. Ignore offers for full reports."},
 {id:"familytree",name:"FamilyTreeNow",p:1,search:"",opt:"https://www.familytreenow.com/optout",tip:""},
 {id:"usphonebook",name:"USPhoneBook",p:1,search:"",opt:"https://www.usphonebook.com/opt-out/",tip:"Search by your phone number. If the form hangs, email support+optout@usphonebook.com."},
 {id:"truepeople",name:"TruePeopleSearch",p:0,search:"",opt:"https://www.truepeoplesearch.com/removal",tip:"Several captchas."},
 {id:"cyberbgc",name:"Cyber Background Checks",p:0,search:"https://www.cyberbackgroundchecks.com/",opt:"https://www.cyberbackgroundchecks.com/removal",tip:"Copy the link to your listing first, then paste it in the removal form."},
 {id:"searchpeoplefree",name:"SearchPeopleFree",p:0,search:"",opt:"https://www.searchpeoplefree.com/opt-out",tip:"Search by name, phone, address and email separately."},
 {id:"peoplesearchnow",name:"PeopleSearchNow",p:0,search:"",opt:"https://www.peoplesearchnow.com/opt-out",tip:""},
 {id:"usapeople",name:"USA People Search",p:0,search:"",opt:"https://www.usa-people-search.com/removal",tip:""},
 {id:"acxiom",name:"Acxiom",p:0,search:"",opt:"https://www.acxiom.com/optout/",tip:"A marketing data broker with no public search. Opt out anyway."}
];
window.OOK_STATUS=[["","Not checked"],["not-listed","Not listed"],["listed","Listed"],["sent","Opt-out sent"],["removed","Removed"]];
