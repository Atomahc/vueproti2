const xlsx = require('xlsx');
const wb = xlsx.readFile('/data/data/com.termux/files/home/Desktop/项目/22f8840d8d0578e950cd4d9f92e05f91.xlsx');
console.log(wb.SheetNames);
wb.SheetNames.forEach(name => {
    console.log('===', name, '===');
    console.log(xlsx.utils.sheet_to_json(wb.Sheets[name]));
});
