//require('dotenv').config();
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

//require executablePath from puppeteer
const {executablePath} = require('puppeteer')

puppeteer.use(StealthPlugin())



let countFalse =0;
register();
// puppeteer usage as normal

async function register(){
const localUser = "d"+require("shortid").generate();
console.log(localUser);
await  puppeteer.launch({ 
      headless: false,
      args: ['--lang=vi-VN','--proxy-server=192.168.1.189:9102'],
      executablePath: executablePath(), 
      userDataDir:"./data/webs/"+localUser
  }).then(async browser => {
    console.log('Running tests..')
    const page = await browser.newPage()
    await page.goto('https://arpwallet.com/')

    await delay(2000);
    const allResultsSelector = "text/Create Account";
    await page.waitForSelector(allResultsSelector);
    await page.click(allResultsSelector);
    await delay(2000);

    const f = await page.$("#username")
    // //enter text
    f.type(localUser)

    await delay(1000);
    const email = await page.$("#email")
    // //enter text
    email.type(localUser+"@hhkorean.com")

    await delay(1000);
    const fname = await page.$("#fname")
    // //enter text
    fname.type("Nguyen Van "+localUser)

    await delay(1000);
    await page.select('#currency', 'USD')

    await delay(1000);
    const log = await page.$("#password")
    log.type('tintin@123')



    await delay(1000);
    const submitResultsSelector = "text/Complete Sign Up";
    await page.waitForSelector(submitResultsSelector);
    await page.click(submitResultsSelector);

    await delay(5000);
    const activeResultsSelector = "text/Activate My Account Here";
    await page.waitForSelector(activeResultsSelector);
    await page.click(activeResultsSelector);

    await delay(10000);
    const widrawResultsSelector = "text/Withdraw Ripple (XRP)";
    await page.waitForSelector(widrawResultsSelector);
    await page.click(widrawResultsSelector);

    await widraw(page,browser);
  })
}
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}


async function widraw (page,browser) {
  await delay(2000);
  await page.goto('https://arpwallet.com/withdraw_xrp.html')
  await delay(2000);
  const address = await page.$("#address")
  address.type('rNxp4h8apvRis6mJf9Sh8C6iRxfrDWN7AV')
  await delay(2000);

  const code = await page.$("#memotag")
  code.type('60847033')

  await delay(2000);
  const submitResultsSelector = "text/Confirm Withdrawal Transaction";
  await page.waitForSelector(submitResultsSelector);
  await page.click(submitResultsSelector);

  await delay(2000);
  const mess = await page.waitForSelector(".message_box > div")
  const text = await page.evaluate(element => element.textContent, mess);
  console.log(text);
  await delay(60000);
  console.log("Chờ 60s...");
  if(text != null &&  text.includes("failed"))
  {
    countFalse++;
  }
  if(countFalse<5){
    await widraw(page)
  }else{
    countFalse =0;
    await browser.close();
    await delay(1000);
    await register();
  }
}