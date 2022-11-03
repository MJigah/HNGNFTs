# HNGNFTs
A guide to implement the tested scripts
 The CSV file to be worked should be rename to CSV_file.csv
In order to implement the url should be asigned to csvFileLink in app.js

<!-- Importing Variables -->
Run npm install to install required modules
NOTE: The only npm  package used in the script is crypto to create the hashes

Once npm package is installed, check the CSV file to see if rows are adequately separated by comma, and adjust if necessary

<!-- RUN THE SCRPT -->
run node app.js to run the script

<!-- OUTPUT -->
The output generate: 
 => filename.output.csv for appended csv with hashes
 => Multiple CHIP format JSON files for each row in the csv
 => Output.json which is a combination of all JSON files
