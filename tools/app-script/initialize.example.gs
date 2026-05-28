function initialize() {
  const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();
  const SHEET = SPREADSHEET.getSheetByName("<INSERT SHEET NAME>");
  const LAST_ROW = SHEET.getLastRow();
  // ! If you have a specific number of columns for the table ONLY, hardcode the number of columns.
  const LAST_COLUMN = SHEET.getLastColumn();
  const SECRET_TOKEN = "";

  // TODO: Set the indexes of these data based on their position in the table.
  const INDEXES = {
    name: null,
    email: null,
    phone: null,
    invited: null,
    status: null,
    notes: null
  }

  // * (starting row, starting column, number of rows, number of columns)
  const RANGE = SHEET.getRange(1, 1, LAST_ROW, LAST_COLUMN);
  const DATA = RANGE.getValues();

  return {
    INDEXES, SHEET, LAST_ROW, LAST_COLUMN, DATA, SECRET_TOKEN
  }
}