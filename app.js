//Importing native modules
const fs = require("fs");
const { createHash } = require("crypto");

//Reading CSV File
const csvFileLink = "NFT Naming csv - Team Clutch.csv"
csvfile = fs.readFileSync(csvFileLink);

//Get the Team name
var teamName = csvFileLink.substr(17, csvFileLink.indexOf('.csv'));
var remName = teamName.replace('.csv', '')

//Creating hahing function
const hash = (string) => {
  return createHash("sha256").update(string).digest("hex");
};

//Differentiating header and rows from csv File
const arr = csvfile.toString().split("\n");
var jsonObject = [];
var headers = arr[0].split(",");
var newHeaders = headers.map((heading) => {
  if (heading === "Serial Number") {
    return "SerialNumber";
  } else {
    return heading;
  }
});

//Appending hash to csv row
var csvArray = []
for(var i =1; i<arr.length; i++){
  var data = arr[i].split(",");
  var hashed = `${hash(arr[i])}\n`;
  var newData = data + hashed;
  csvArray.push(newData);
}

//Creating output CSV file
csvArray.unshift(arr[0])
fs.writeFileSync("filename.output.csv", csvArray.join(""));

//Creating sha 0007 json format from CSV file
for (var i = 1; i < arr.length; i++) {
  var data = arr[i].split(",");
  var object = {};
  for (var j = 0; j < data.length; j++) {
    if (newHeaders[j].startsWith("HASH")) {
      object[newHeaders[j].trim()] = "hash(arr[i])";
    }
    object[newHeaders[j].trim()] = data[j].trim();
  }
  var shaObj = {
    format: "CHIP-0007",
    name: object.Filename,
    description: object.description,
    minting_tool: remName,
    sensitive_content: false,
    series_number: object.SerialNumber,
    series_total: arr.length,
    attributes: [
      {
        trait_type: "gender",
        value: object.Gender,
      }
    ],
    collection: {
      name: "Zuri NFT tickets for free lunch",
      id: "b774f676-c1d5-422e-beed-00ef5510c64d",
      attributes: [
        {
          type: "description",
          value: "Rewards for accomplishments during HNGi9.",
        }
      ],
    },
    data: {
      example_data: "",
    },
    hash: hash(arr[i]),
  };
  var newFilename = object.Filename.replace(/-/g, ' ');
  jsonObject.push(shaObj);
  let json = JSON.stringify(shaObj);
  fs.writeFileSync(`${newFilename}.json`, json);
}


//Creating General Json Format
let json = JSON.stringify(jsonObject);
fs.writeFileSync("output.json", json);
