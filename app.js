//Importing native modules
const fs = require("fs");
const { createHash } = require("crypto");

//Reading CSV File
const csvFileLink = "HNGi9 CSV FILE - Sheet1.csv";
csvfile = fs.readFileSync(csvFileLink);

//Creating hahing function
const hash = (string) => {
  return createHash("sha256").update(string).digest("hex");
};

//Differentiating header and rows from csv File
var arr = csvfile.toString().split("\n");
var jsonObject = [];
var headers = arr[0].split(",");
var newHeaders = headers.map((heading) => {
  if (heading === "Series Number") {
    return "SerialNumber";
  } else if (heading === "TEAM NAMES") {
    return "TeamNames";
  } else {
    return heading;
  }
});

//initializiing hash Array
var allJsonHash = [];
var temp;

// //Creating sha 0007 json format from CSV file
for (var i = 1; i < arr.length; i++) {
  var data = arr[i].split(",");
  var object = {};
  for (var j = 0; j < newHeaders.length; j++) {
    if (newHeaders[j].startsWith("TeamNames")) {
      if (data[j] === "") {
        data[j] = temp;
        object[newHeaders[j]] = data[j];
      } else {
        object[newHeaders[j]] = data[j];
        temp = data[j];
      }
    } else {
      object[newHeaders[j]] = data[j];
    }
  }
  var attArray = [];
  var attObj = {};
  var attArr = object.Attributes.split(";");
  var shaAttr = attArr.map((row) => {
    return row.split(":");
  });
  var subAttr = shaAttr.map((row) => {
    return {
      trait_type: row[0],
      value: row[1],
    };
  });
  var shaObj = {
    format: "CHIP-0007",
    name: object.Name,
    description: object.description,
    minting_tool: object.TeamNames,
    sensitive_content: false,
    series_number: object.SerialNumber,
    series_total: 420,
    attributes: subAttr,
    collection: {
      name: "Zuri NFT tickets for free lunch",
      id: "b774f676-c1d5-422e-beed-00ef5510c64d",
      attributes: [
        {
          type: "description",
          value: "Rewards for accomplishments during HNGi9.",
        },
      ],
    },
    data: {
      example_data: "",
    },
  };
  let json = JSON.stringify(shaObj);
  var jsonHash = hash(json);
  //   var newFilename = object.Filename.replace(/-/g, ' ');
  var objJson = JSON.stringify({ ...shaObj, hash: jsonHash });
  allJsonHash.push(jsonHash);
  if(fs.existsSync("./json_files")){
    fs.writeFile(`./json_files/${object.Filename}.json`, objJson, (err) => {
      if (err) throw err;
    });
  } else {
    fs.mkdirSync(`./json_files`)
  }
}

var updatedAllJsonHash = allJsonHash.map((row) => {
  return row + "/n";
});

//Appending hash to csv row
var csvArray = [];
for (var i = 1; i < arr.length; i++) {
  var data = arr[i].split(",");
  data.push(updatedAllJsonHash[i - 1]);
  csvArray.push(data);
}

// Appending Hash header to header
headers.push("HASH\n");
var csvHeader = headers.map((row) => {
  return row.trim();
});
csvHeader.join(",");
var newCsvHeader = csvHeader.map((row) => {
  if (row === "HASH") {
    return "Hash\n";
  } else {
    return row;
  }
});

//Creating output CSV file
csvArray.unshift(newCsvHeader.join(","));
fs.writeFileSync("filename.output.csv", csvArray.join(""));
