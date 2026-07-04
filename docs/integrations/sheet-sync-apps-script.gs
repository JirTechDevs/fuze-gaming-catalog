/**
 * Fuzevalo — Google Sheet -> Website sync
 *
 * Install: open the Financial Report workbook -> Extensions ->
 * Apps Script -> paste this file -> save. Then attach an
 * installable onEdit trigger via Triggers -> Add Trigger:
 *   - Function to run: onFuzeSheetEdit
 *   - Event source: From spreadsheet
 *   - Event type: On edit
 *
 * Set the shared secret via Project Settings -> Script properties:
 *   Property: SHEET_SYNC_SECRET
 *   Value: <same string as SHEET_SYNC_SECRET env in Vercel>
 *
 * Behavior: whenever a cell in the STATUS column of any monthly tab
 * changes, POSTs the row's { code, status, sheet } payload to the
 * website. Only monthly tabs are watched — Master_Status, DATA STOK,
 * looker_output, etc. are ignored.
 */

// ---- Config ----------------------------------------------------------

var WEBHOOK_URL = 'https://fuzevalo.com/api/sheet-sync';

// Column layout on every monthly tab (1 = A, 2 = B, ...)
var STATUS_COLUMN = 3; // C
var CODE_COLUMN = 4;   // D
var HEADER_ROW = 1;

// Sheet-name pattern. Matches tabs named after a month + a 2- or 4-digit
// year. Accepts Indonesian full names (Januari, Oktober, Desember),
// Indonesian abbreviations (Jan, Okt, Des), English full names
// (January, October, December), and English abbreviations (Jan, Oct,
// Dec). Case-insensitive; year separator must be whitespace.
//
// Matches: "Januari 26", "October 2026", "Okt 26", "OCT 26",
//          "Oktober 2026", "Jan 26"
// Rejects: "Notes 26", "Bulan Oktober 26", "Oktober-26", "TODO"
var MONTHLY_TAB_REGEX =
  /^(january|januari|jan|february|februari|feb|march|maret|mar|april|apr|may|mei|june|juni|jun|july|juli|jul|august|agustus|aug|agu|september|sep|october|oktober|oct|okt|november|nov|december|desember|dec|des)\s+\d{2,4}$/i;

// Product codes are shaped like "FZ1234". This is a safety net so a
// stray edit in a matched tab (or a header row) can't trigger a sync.
var CODE_SHAPE_REGEX = /^FZ\d+/i;

// ---- Entry point -----------------------------------------------------

function onFuzeSheetEdit(e) {
  try {
    if (!e || !e.range) return;

    var sheet = e.range.getSheet();
    var sheetName = sheet.getName();

    // Only react to edits inside monthly tabs.
    if (!MONTHLY_TAB_REGEX.test(sheetName)) return;

    // Only react to edits in the STATUS column.
    if (e.range.getColumn() !== STATUS_COLUMN) return;

    var row = e.range.getRow();
    if (row <= HEADER_ROW) return; // skip header edits

    var status = String(e.value || '').trim();
    var code = String(sheet.getRange(row, CODE_COLUMN).getValue() || '').trim();

    if (!code) return; // no code in this row, nothing to sync
    if (!CODE_SHAPE_REGEX.test(code)) return; // not an FZ product row

    var secret = PropertiesService.getScriptProperties()
      .getProperty('SHEET_SYNC_SECRET');

    if (!secret) {
      console.error('SHEET_SYNC_SECRET script property is not set.');
      return;
    }

    var payload = {
      code: code,
      status: status,
      sheet: sheetName,
    };

    var options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-sheet-secret': secret,
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    var response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    var code_ = response.getResponseCode();
    var body = response.getContentText();

    if (code_ >= 200 && code_ < 300) {
      console.log('Sync OK for ' + code + ' (' + status + '): ' + body);
    } else {
      console.error('Sync FAILED ' + code_ + ' for ' + code + ': ' + body);
    }
  } catch (err) {
    console.error('onFuzeSheetEdit error: ' + err);
  }
}

/**
 * Optional: manually re-sync a whole sheet.
 * Useful if the trigger was disabled for a while and things drifted.
 *
 * Run from the Apps Script editor: select this function, click Run.
 */
function backfillActiveSheet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var name = sheet.getName();
  if (!MONTHLY_TAB_REGEX.test(name)) {
    throw new Error('Active tab "' + name + '" is not a monthly tab.');
  }

  var lastRow = sheet.getLastRow();
  if (lastRow <= HEADER_ROW) return;

  var range = sheet.getRange(
    HEADER_ROW + 1,
    Math.min(STATUS_COLUMN, CODE_COLUMN),
    lastRow - HEADER_ROW,
    Math.abs(STATUS_COLUMN - CODE_COLUMN) + 1,
  );
  var values = range.getValues();

  var secret = PropertiesService.getScriptProperties()
    .getProperty('SHEET_SYNC_SECRET');
  if (!secret) throw new Error('SHEET_SYNC_SECRET script property missing.');

  values.forEach(function (row, index) {
    var status = String(row[0] || '').trim();
    var code = String(row[1] || '').trim();
    if (!code) return;
    if (!CODE_SHAPE_REGEX.test(code)) return;

    var options = {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-sheet-secret': secret },
      payload: JSON.stringify({
        code: code,
        status: status,
        sheet: name,
      }),
      muteHttpExceptions: true,
    };

    try {
      UrlFetchApp.fetch(WEBHOOK_URL, options);
    } catch (err) {
      console.error('Backfill row ' + (index + 2) + ' failed: ' + err);
    }
  });
}
