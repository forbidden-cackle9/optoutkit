/* Opt Out Kit running costs and support received.
   Update "received" (money that actually reached the account, AFTER payment fees) and "updated"
   whenever you check your GitHub Sponsors and Ko-fi balances. When received >= the total of costs,
   the site hides the support links and thanks people instead.
   Leave a link "" to hide it. With no links set, nothing about support is shown at all. */
window.OOK_FUNDING = {
  period: "November 2026 to October 2027",
  periodEnds: "2027-10-31",
  costs: [
    { item: "Domain name (optoutkit.org)", amount: 11.99 },
    { item: "Claude Pro (AI used to build and maintain the site)", amount: 240 }
  ],
  note: "Hosting is free. The full Claude Pro subscription ($20 a month) is counted.",  // shown under the cost table; say how the AI tools cost is counted
  received: 0,
  updated: "2026-10-30",
  links: {
    github: "",  // e.g. "https://github.com/sponsors/forbidden-cackle9"
    kofi: "https://ko-fi.com/forbidden-cackle9"
  }
};
