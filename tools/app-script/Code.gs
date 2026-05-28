const { INDEXES, SHEET, LAST_ROW, LAST_COLUMN, DATA, SECRET_TOKEN } = initialize();

/**
 * Find user from the list of invitees
 * @params String name
 * 
 * @return Error || Object
 */
function findUser(name) {
  // Formatting the conditions in the find method to lowercase
  const index = DATA.findIndex(item => item[INDEXES['name']].toLowerCase() === name.toLowerCase());
  let user = DATA[index] ?? null;

  // ! ERROR: User does not exist
  if (!user) { 
    const error = new Error("We can't seem to find you in the list.")
    error.status = 404;
    throw error;
  }

  return { user, index }
}

/**
 * Format payload
 * @params Number index
 * @params Object payload
 * @params Array oldData
 * 
 * @return Array values
 * 
 */
function formatPayload(payload, oldData) {
  let values = [];

  for (let i = 0; i < LAST_COLUMN; i++) {
    let key = Object.keys(payload).find(key => INDEXES[key] === i);

    if (!key) {
      values.push(oldData[i]);
    } else {
      values.push(payload[key]);
    }
  }

  return values;
}

/**
 * Updated RSVP details of user
 *  - Main method that the website will call
 * 
 * @return JSON
 */
function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  try {
    // Ensure that the API is only called by the authorized website
    if (data.token !== SECRET_TOKEN) {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }

    const USER_DATA = this.findUser(data['name']);
    const USER_INDEX = USER_DATA['index'] + 1; // Row counting starts at 1, not 0.
    let user = USER_DATA['user'];
    
    let payload = this.formatPayload(data, user);

    let range = SHEET.getRange(`A${USER_INDEX}:K${USER_INDEX}`);
    range.setValues([payload]);

    return ContentService.createTextOutput(
      JSON.stringify({ 
        status: 200, 
        message: 'Successfully updated user details'
      })
    )
    .setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    return ContentService.createTextOutput(
      JSON.stringify({ 
        status: error.status ?? 400,
        message: error.message ?? error.toString(),
        name: data.name
      })
    )
    .setMimeType(ContentService.MimeType.JSON);
  }
 
}