const xlsx = require('xlsx')

console.log('Loading data from spreadsheet...')

var workbook = xlsx.readFile('test.xlsx')

console.log('Loading complete. Data:')
console.log(workbook)
