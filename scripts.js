$(document).ready(function() {
        // Fetch data from the JSON file (or from a local path)
        fetch('data/events.json')
        .then(response => response.json())  // Convert the response to JSON
        .then(data => {
            // Store the JSON data in localStorage
            localStorage.setItem('eventData', JSON.stringify(data));
            new DataTable('#eventsTable', {
                layout: {
                    topStart: 'search',
                    bottom2: 'paging',
                    bottomStart: 'info',
                    bottomEnd: null,
                    topEnd: function () {
                        let create_btn = document.createElement('div');
                        create_btn.innerHTML = '<button type="button" class="btn btn-outline-success tive2" onclick=create_trigger()> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="rgba(65, 214, 194, 0.84)" class="bi bi-plus-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg> Create Event </button>';
                        return create_btn;
                    }
                },
                data: data,
                columns: [
                    { "data": null, "render": function (data, type, row, meta) {
                        return meta.row + 1;
                    }},
                    { "data": "EventName" },
                    { "data": "EventDateTime" },
                    { "data": "StoreTotal" },
                    { "data": "Province" },
                    { "data": "EventLocation" },
                    { "data": "Status", "render": function (data, type, row) {
                        if (data === '1') {
                            return '<button type="button" class="btn tive1">Active</button>';
                        } else {
                            return '<button type="button" class="btn btn-danger">Inactive</button>';
                        }
                    }},
                    { "data": null, "render": function (data, type, row) {
                        return `
                            <div class="dropdown ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="rgba(65, 214, 194, 0.84)" class="bi bi-three-dots dropdown-toggle "  viewBox="0 0 16 16" data-bs-toggle="dropdown" aria-expanded="false">
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                                </svg>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="dropdown-item g" href="#" onclick="edit_trigger(${row.EventId})">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="grey" class="bi bi-pencil-fill g" viewBox="0 0 16 16" style="margin-right: 5px;">
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                        </svg>                                     
                                        Edit
                                        </a>
                                    </li>
                                    <li><a class="dropdown-item g " href="#" onclick="delete_trigger(${row.EventId},'${row.EventName}')">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="grey" class="bi bi-trash-fill" viewBox="0 0 16 16" style="margin-right: 5px;">
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                                    </svg>
                                    Delete
                                    </a></li>
                                    <li><a class="dropdown-item g " href="tables.html?EventId=${row.EventId}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="grey" class="bi bi-people-fill" viewBox="0 0 16 16" style="margin-right: 5px;">
                                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                                    </svg>
                                    Tables
                                    </a></li>
                                </ul>
                            </div>
                        `;
                    }}
                ]
            });
            fetch('data/tables.json')
            .then(response => response.json())  // Convert the response to JSON
            .then(data => {
                // Store the JSON data in localStorage
                localStorage.setItem('tableData', JSON.stringify(data));
            });

            fetch('data/seats.json')
            .then(response => response.json())  // Convert the response to JSON
            .then(data => {
                // Store the JSON data in localStorage
                localStorage.setItem('seatData', JSON.stringify(data));
            });

            fetch('data/stores.json')
            .then(response => response.json())  // Convert the response to JSON
            .then(data => {
                // Store the JSON data in localStorage
                localStorage.setItem('storeData', JSON.stringify(data));
                reloadEvents();
            });
    });
});

// EVENT LISTENERS FOR EDIT AND CREATING

$(document).ready(function() {
    // Add event listeners for input fields based on mode (create or edit)
    addEventListeners('create'); // Example: for create mode
    addEventListeners('edit'); // Example: for create mode
    // Example: For edit mode, you would call addEventListeners('edit')
});

function reloadEvents() {
    // Fetch the JSON data from the hidden div
    var table = $('#eventsTable').DataTable();
    const eventData = JSON.parse(localStorage.getItem('eventData'));
    
    // Clear existing rows in the DataTable
    table.clear();
    // Add the new rows
    table.rows.add(eventData).draw();

    if (eventData) {
        let sidebarEvents = document.querySelector('#sidebar-events .nav-treeview');
        sidebarEvents.innerHTML = ''; // Clear existing events in the sidebar

        // Loop through the events and add them to the sidebar
        eventData.forEach(function(event) {
            let listItem = document.createElement('li');
            listItem.className = 'nav-item fontclr';
            listItem.innerHTML = `
                <a href="tables.html?EventId=${event.EventId}" class="nav-link fontclr">
                    <i class="far fa-circle nav-icon"></i>
                    <p>${event.EventName}</p>
                </a>
            `;
            sidebarEvents.appendChild(listItem);
        });
    } else {
        console.error('Failed to fetch events');
    }
}

function addEventListeners(mode) {
    // Determine IDs and names based on mode
    var storesId = (mode === 'create') ? 'inputCreateStores' : 'inputEditStores';
    var seatsId = (mode === 'create') ? 'inputCreateSeats' : 'inputEditSeats';
    var colsId = (mode === 'create') ? 'inputCreateCols' : 'inputEditCols';
    var rowsId = (mode === 'create') ? 'inputCreateRows' : 'inputEditRows';
    var dateId = (mode === 'create') ? 'inputCreateStartDate' : 'inputEditStartDate';

    // Add event listeners based on IDs
    document.getElementById(storesId).addEventListener('input', function() {
        updateTables(mode);
    });
    document.getElementById(seatsId).addEventListener('input', function() {
        updateTables(mode);
    });
    document.getElementById(colsId).addEventListener('input', function() {
        updateTables(mode);
    });
    document.getElementById(rowsId).addEventListener('input', function() {
        updateTables(mode);
    });
    document.getElementById(dateId).addEventListener('input', function() {
        updateEndDate(mode);
    });
}

function updateEndDate(mode) {
    var DateId = (mode === 'create') ? 'inputCreateStartDate' : 'inputEditStartDate';
    var endDateId = (mode === 'create') ? 'inputCreateEndDate' : 'inputEditEndDate';

    var DateValue = document.getElementById(DateId).value;
    document.getElementById(endDateId).setAttribute('min', DateValue);
    document.getElementById(endDateId).value = DateValue;
}

function updateTables(mode) {
    // Determine IDs based on mode
    var storesId = (mode === 'create') ? 'inputCreateStores' : 'inputEditStores';
    var seatsId = (mode === 'create') ? 'inputCreateSeats' : 'inputEditSeats';
    var colsId = (mode === 'create') ? 'inputCreateCols' : 'inputEditCols';
    var rowsId = (mode === 'create') ? 'inputCreateRows' : 'inputEditRows';
    var tablesId = (mode === 'create') ? 'inputCreateTables' : 'inputEditTables';
    var tablesAvailableId = (mode === 'create') ? 'create-tables-available' : 'edit-tables-available';

    var storesValue = document.getElementById(storesId).value;
    var seatsValue = document.getElementById(seatsId).value;
    var colsValue = document.getElementById(colsId).value;
    var rowsValue = document.getElementById(rowsId).value;

    // Parse input values to integers
    var stores = parseInt(storesValue);
    var seats = parseInt(seatsValue);
    var cols = parseInt(colsValue);
    var rows = parseInt(rowsValue);

    // Calculate tables needed and available
    var tables_needed = (storesValue !== '' && seatsValue !== '') ? Math.ceil(stores / seats) : 0;
    var tables_available = (colsValue !== '' && rowsValue !== '') ? cols * rows : 0; //16

    // Update inputCreateTables and tables-available based on mode
    document.getElementById(tablesId).value = (storesValue !== '' && seatsValue !== '') ? tables_needed : "";
    document.getElementById(tablesAvailableId).innerHTML = (colsValue !== '' && rowsValue !== '') ? tables_available : "-";
    document.getElementById(tablesId).style.boxShadow = "rgb(156, 156, 157)";
    document.getElementById(tablesId).style.textAlign = "center";

    // Perform action based on comparison
    var availableIndicatorId = (mode === 'create') ? 'create-available-indicator' : 'edit-available-indicator';
    var createBtnId = (mode === 'create') ? 'create-btn' : 'edit-btn';

    if (storesValue !== '' && seatsValue !== '' && colsValue !== '' && rowsValue !== '') {
        if (tables_available >= tables_needed) {
            // Tables available are sufficient or more
            console.log("Tables available are sufficient or more.");
            document.getElementById(availableIndicatorId).style.backgroundColor = "rgba(65, 214, 194, 0.84)";
            document.getElementById(availableIndicatorId).style.color = "white";
            document.getElementById(createBtnId).disabled = false;
        } else {
            // Tables available are insufficient
            console.log("Tables available are insufficient.");
            document.getElementById(availableIndicatorId).style.backgroundColor = "red";
            document.getElementById(availableIndicatorId).style.color = "white";
            document.getElementById(createBtnId).disabled = true;
        }
    } else {
        // Reset indicator style if any input is missing
        document.getElementById(availableIndicatorId).style.backgroundColor = "";
        document.getElementById(availableIndicatorId).style.color = "";
        document.getElementById(createBtnId).disabled = true;
    }
}

// EDIT EVENTS

function edit_trigger(id) {
    // Show the modal
    $('#editModal').modal('show');
    
    const eventData = JSON.parse(localStorage.getItem('eventData'));
    var event = eventData.find(e => e.EventId == id);

    if (event) {
        // Populate the modal with event details
        document.getElementById("inputEditName").value = event.EventName;
        document.getElementById("inputEditStartDate").value = event.EventDateTime;
        document.getElementById("inputEditEndDate").value = event.EventDateTimeEnd;
        document.getElementById("inputEditStores").value = event.StoreTotal;
        document.getElementById("inputEditSeats").value = event.NumberOfSeats;
        document.getElementById("inputEditTables").value = event.NumberofTables;
        document.getElementById("inputEditRows").value = event.NumberOfRows;
        document.getElementById("inputEditCols").value = event.NumberOfCols;
        document.getElementById("inputEditLocation").value = event.EventLocation;
        document.getElementById("inputEditProvince").value = event.Province;
        document.getElementById("editEventId").value = event.EventId;

        // Call update functions
        updateTables('edit');
        updateEndDate('edit');

        // Handle status radio buttons
        var statusRadios = document.querySelectorAll('.btn-check.edit-status');
        statusRadios.forEach(function(radio) {
            if (radio.value == event.Status) {
                radio.checked = true;
            }
        });
    } else {
        console.error("Event with ID " + id + " not found in JSON data.");
    }
}

document.getElementById("editForm").addEventListener("submit", function(event) {
    event.preventDefault();
    edit_save();
});

function edit_save() {
    var eventData = JSON.parse(localStorage.getItem('eventData') || '[]');

    // Retrieve input values from the form
    var id = document.getElementById("editEventId").value;
    var name = document.getElementById("inputEditName").value;
    var date = document.getElementById("inputEditStartDate").value;
    var dateend = document.getElementById("inputEditEndDate").value;
    var status = document.querySelector('input[name="edit-status"]:checked').value;
    var stores = document.getElementById("inputEditStores").value;
    var seats = document.getElementById("inputEditSeats").value;
    var tables = document.getElementById("inputEditTables").value;
    var rows = document.getElementById("inputEditRows").value;
    var cols = document.getElementById("inputEditCols").value;
    var location = document.getElementById("inputEditLocation").value;
    var province = document.getElementById("inputEditProvince").value;

    // Find the event in the eventData array by ID
    var event = eventData.findIndex(e => e.EventId == id);

    if (event !== -1) {
        // Update the event in the eventData array
        eventData[event] = {
            EventId: id,
            EventName: name,
            EventDateTime: date,
            EventDateTimeEnd: dateend,
            StoreTotal: stores,
            NumberOfSeats: seats,
            NumberOfRows: rows,
            NumberofTables: tables,
            NumberOfCols: cols,
            EventLocation: location,
            Province: province,
            Status: status
        };

        localStorage.setItem('eventData', JSON.stringify(eventData)); // Store the updated eventData back into localStorage

        // Call any necessary functions to refresh the UI
        edit_success(name, location, date); // Assuming this function updates the modal/UI
    } else {
        console.error("Event with ID " + id + " not found.");
    }
}

function edit_success(name, location, date) {
    // Define what happens when the event update is successful
    $('#editModal').modal('hide');
    $('#successModal').modal('show');
    document.getElementById("success-dialog").innerHTML = "Event Edited";
    document.getElementById("success-info").innerHTML = "'"+ name + "'" + " at " + location + " on " + date;
    reloadEvents();
}

// CREATE EVENTS

function create_trigger() {
    $('#createModal').modal('show');

    // Set min attribute for inputCreateDate to today with time
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var hh = String(today.getHours()).padStart(2, '0');
    var min = String(today.getMinutes()).padStart(2, '0');
    var formattedDateTime = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + min;
    var inputStartDate = document.getElementById('inputCreateStartDate');
    var inputEndDate = document.getElementById('inputCreateEndDate');
    
    inputStartDate.value = formattedDateTime;
    inputEndDate.value = formattedDateTime;
    document.getElementById('inputCreateStartDate').setAttribute('min', formattedDateTime);
    document.getElementById('inputCreateEndDate').setAttribute('min', formattedDateTime);
}

document.getElementById("eventForm").addEventListener("submit", function(event) {
    event.preventDefault();
    create_event();
});

function create_event() {
    // Retrieve existing eventData from localStorage or initialize as an empty array
    var eventData = JSON.parse(localStorage.getItem('eventData') || '[]');
    var tableData = JSON.parse(localStorage.getItem('tableData') || '[]');

    // Get the latest EventId (if any) to generate the next EventId
    var latestEventId = eventData.length > 0 ? parseInt(eventData[eventData.length - 1].EventId) : 0;
    var latestTableId = tableData.length > 0 ? parseInt(tableData[tableData.length - 1].TableId) : 0;

    // Fetch values from input fields
    var name = document.getElementById("inputCreateName").value;
    var status = document.querySelector('input[name="create-status"]:checked').value;
    var date = document.getElementById("inputCreateStartDate").value;
    var dateend = document.getElementById("inputCreateEndDate").value;
    var stores = document.getElementById("inputCreateStores").value;
    var seats = document.getElementById("inputCreateSeats").value;
    var tables = document.getElementById("inputCreateTables").value;
    var rows = document.getElementById("inputCreateRows").value;
    var cols = document.getElementById("inputCreateCols").value;
    var location = document.getElementById("inputCreateLocation").value;
    var province = document.getElementById("inputCreateProvince").value;

    var eventId = (latestEventId + 1).toString(); // New EventId
    // Create a new event object
    var data = {
        EventId: eventId,
        EventName: name,
        EventDateTime: date,
        EventDateTimeEnd: dateend,
        StoreTotal: stores,
        NumberOfSeats: seats,
        NumberOfRows: rows,
        NumberofTables: tables,
        NumberOfCols: cols,
        EventLocation: location,
        Province: province,
        Status: status
    };
    eventData.push(data);  // Add the new event to the array
    localStorage.setItem('eventData', JSON.stringify(eventData));  // Store the updated eventData back into localStorage

    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var tableName = letters[i] + (j + 1); // Generate table name, e.g., A1, A2, B1, B2, etc.
            latestTableId++; // Increment TableId for the next table
            var tableDataItem = {
                TableId: latestTableId.toString(),   // Unique TableId
                TableName: tableName,
                Nickname: "",                        // Default empty Nickname
                Status: "1",                         // Default Status (active)
                EventId: eventId,                    // Associate with the new EventId
            };
            tableData.push(tableDataItem); // Add the new table to the array
            console.log('Table created:', tableDataItem);
        }
    }
    localStorage.setItem('tableData', JSON.stringify(tableData));
    create_success(name, location, date);  // Call success function and reload events
    reloadEvents();
}

function create_success(name, location, date) {
    // Define what happens when the event creation is successful
    $('#createModal').modal('hide');
    $('#successModal').modal('show');
    document.getElementById("success-dialog").innerHTML = "Event Created";
    document.getElementById("success-info").innerHTML = "'" + name + "'" + " at " + location + " on " + date;
}

// DELETE EVENTS

function delete_trigger(id, name) {
    $('#deleteModal').modal('show');
    document.getElementById('delete-event-name').innerHTML = name
    document.getElementById('confirmDeleteButton').onclick = function() {
        delete_confirm(id, name);
    };
}

function delete_confirm(id, name) {
    // Retrieve the JSON data from localStorage
    var eventData = JSON.parse(localStorage.getItem('eventData') || '[]');
    var tableData = JSON.parse(localStorage.getItem('tableData') || '[]');
    var seatData = JSON.parse(localStorage.getItem('seatData') || '[]');

    // Find the index of the event with the specified ID
    var eventIndex = eventData.findIndex(e => e.EventId == id);

    if (eventIndex !== -1) {
        // Remove the event from the array
        eventData.splice(eventIndex, 1);

        // Find all tables with the specified eventId and remove them
        var tablesToRemove = tableData.filter(table => table.EventId == id);
        tableData = tableData.filter(table => table.EventId != id);

        // Find all seats with the tableId of the removed tables and remove them
        tablesToRemove.forEach(table => {
            seatData = seatData.filter(seat => seat.TableId != table.TableId);
        });

        // Update the JSON data in localStorage
        localStorage.setItem('eventData', JSON.stringify(eventData));
        localStorage.setItem('tableData', JSON.stringify(tableData));
        localStorage.setItem('seatData', JSON.stringify(seatData));

        // Close the delete confirmation modal
        $('#deleteModal').modal('hide');

        // Show a success message
        delete_success(name); // Assuming this function displays a notification
    } else {
        console.log(`Event with ID ${id} not found.`);
    }
}

function delete_success(name) {
    // Define what happens when the event creation is successful
    $('#deleteModal').modal('hide');
    $('#successModal').modal('show');
    document.getElementById("success-dialog").innerHTML = "'"+ name +"' deleted.";
    document.getElementById("success-info").innerHTML = '';
    reloadEvents();
}
