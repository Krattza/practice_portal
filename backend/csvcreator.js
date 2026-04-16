// import sqlite3 from 'sqlite3';
// import fs from 'fs';

// const db = new sqlite3.Database('factorysync'); // path to your SQLite DB
// const outputFile = 'users.csv';

// db.all("SELECT * FROM users", [], (err, rows) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   if (!rows.length) {
//     console.log("No data found");
//     return;
//   }

//   // Extract headers
//   const headers = Object.keys(rows[0]);

//   // Create CSV content
//   const csv = [
//     headers.join(','), // header row
//     ...rows.map(row =>
//       headers.map(field => {
//         const value = row[field] ?? '';
//         // Escape commas & quotes
//         return `"${String(value).replace(/"/g, '""')}"`;
//       }).join(',')
//     )
//   ].join('\n');

//   // Write to file
//   fs.writeFileSync(outputFile, csv);

//   console.log(`✅ CSV file created: ${outputFile}`);
// });

// db.close();