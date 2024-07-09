const { CricNews } = require('./index');

async function testCricket(){

  const data = await CricNews();
  console.log("\n🔄 Running All News Getter...\n");
  console.log(await data.fetch_all());
console.log("✅ Success Run All News Getter.");
  await waitsec();
  console.log("\n🔄 Running Latest News Getter...\n");
  console.log(await data.fetch_latest());
console.log("✅ Success Run Latest News Getter.");
  await waitsec();
  console.log("\n🔄 Running News From Link Getter...\n");
  console.log(await data.fetchfrom_link("https://sporty.lk/sports-news/%e0%b6%a2%e0%b6%b1%e0%b6%b8%e0%b7%8f%e0%b6%b0%e0%b7%8a%e0%b6%ba-%e0%b6%85%e0%b6%b8%e0%b7%8f%e0%b6%ad%e0%b7%8a%e0%b6%ba%e0%b6%82%e0%b7%81-%e0%b6%9a%e0%b7%8a%e0%b6%bb%e0%b7%92/"));
console.log("✅ Success Run News From Link Getter.");
  
}
testCricket();



function waitsec() {
console.log("=======================================")
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
}
