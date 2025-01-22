$(document).ready(function() {
    load_event_data();
    load_sidebar_events();
    load_table_display();
});

function get_event_id() {
    var urlParams = new URLSearchParams(window.location.search);
    var eventId = urlParams.get('EventId');

    return eventId;
}

function load_event_data() {
    // Get the EventId from the URL
    var eventId = get_event_id()

    const eventData = JSON.parse(localStorage.getItem('eventData'));
    var event = eventData.find(e => e.EventId == eventId);
    if (event) {
        var stores = load_event_stores();
        var numRegistered = stores.length;
        
        var eventProvince = event.province;
        var storeData = JSON.parse(localStorage.getItem('storeData')) || [];
        var totalStores = storeData.filter(store => store.province === eventProvince).length;

        document.getElementById("event-total-stores").innerText = `Total Attending: ${numRegistered}`;
        
        //calculate percentage of stores registered

        var percentageRegistered = (numRegistered / totalStores) * 100;
        document.getElementById("event-registered-stores").innerText = `Registered: ${percentageRegistered.toFixed(2)}%`;
        
        //calculate percentage of stores that have not registered
        var numUnregistered = totalStores - numRegistered;

        var percentagNotRegistered = (numUnregistered / totalStores)*100;
        document.getElementById("event-total-stores-not").innerText = `Total Not Attending: ${numUnregistered}`;
        document.getElementById("event-Not-registered-stores").innerText = `Unregistered: ${percentagNotRegistered.toFixed(2)}%`;

        // Populate the event info
        document.getElementById("event-name").innerText = event.EventName;
        document.getElementById("event-date").innerText = event.EventDateTime;

        // Calculate number of tables based on rows and columns
        var numTables = event.NumberOfRows * event.NumberOfCols;

        // Populate the event layout info
        document.getElementById("event-layout").innerText = `${event.NumberOfRows} x ${event.NumberOfCols}: ${numTables} Tables`;
        
        load_tables()
    } else {
        console.log(response.message);
    }
}

function load_sidebar_events() {
    const eventData = JSON.parse(localStorage.getItem('eventData'));

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

function load_table_details() {
    let tableDetails = [];
    var eventId = get_event_id()

    // Retrieve data from localStorage
    var eventData = JSON.parse(localStorage.getItem('eventData'));
    var seatData = JSON.parse(localStorage.getItem('seatData'));
    var tableData = JSON.parse(localStorage.getItem('tableData'));
    var tables = tableData.filter(table => table.EventId === eventId);

    // Find the event corresponding to the given EventId
    var event = eventData.find(event => event.EventId == parseInt(eventId));

    tables.forEach(table => {
        // Calculate the sum of ReserveSeat and Seat for the current table
        var totalReserveSeat = seatData.filter(seat => seat.TableId === table.TableId)
                                        .reduce((sum, seat) => sum + parseInt(seat.ReserveSeat), 0);            

        var totalSeat = seatData.filter(seat => seat.TableId === table.TableId)
                                .reduce((sum, seat) => sum + parseInt(seat.Seat), 0);
        
        // Calculate FreeSeats
        var freeSeats = event.NumberOfSeats - totalSeat;

        // Add the table's details to the tableDetails array
        tableDetails.push({
            TableId: table.TableId,
            TableName: table.TableName,
            TotalReserveSeat: totalReserveSeat,
            Status: table.Status,
            TotalSeat: totalSeat,
            FreeSeats: freeSeats
        });
    });

    // Store the tableDetails array as a JSON string in localStorage
    localStorage.setItem('tableDetails', JSON.stringify(tableDetails));
}

function load_tables() {
    load_table_details();
    return new Promise((resolve, reject) => {
        var urlParams = new URLSearchParams(window.location.search);
        var eventId = urlParams.get('EventId');
        
        // Retrieve data from localStorage
        var eventData = JSON.parse(localStorage.getItem('eventData'));
        var event = eventData.find(event => event.EventId == parseInt(eventId));

        if (!event) {
            console.error("Event not found.");
            reject("Event not found.");
            return;
        }
        
        // Get the number of rows and columns
        var numRows = event.NumberOfRows;
        var numCols = event.NumberOfCols;
        
        const tableLayout = document.getElementById('table-layout');
        tableLayout.innerHTML = ''; // Clear previous content
        let tableDetails = JSON.parse(localStorage.getItem('tableDetails'));
        if (tableDetails) {
            
            for (let row = 0; row < numRows; row++) {
                // Create a new row div
                let rowDiv = document.createElement('div');
                rowDiv.className = 'd-flex justify-content-center mt-2';
                rowDiv.style.width = 'min-content';
                rowDiv.style.minWidth = '100%';
                
                for (let col = 0; col < numCols; col++) {
                    let tableIndex = row * numCols + col;
                    if (tableIndex < tableDetails.length) {
                        // Determine the status of the table
                        let table = tableDetails[tableIndex];
                        let template;
                        switch (parseInt(table.Status)) {
                            case 1: // Enabled table
                                template = document.getElementById('table-card-template');
                                break;
                            case 0: // Disabled table
                                template = document.getElementById('disabled-card-template');
                                break;
                            case 3: // Locked table
                                template = document.getElementById('locked-card-template');
                                break;
                            default:
                                console.error('Unknown table status:', table.Status);
                                continue;
                        }
                
                        if (template) {
                            let clone = template.content.cloneNode(true);
                
                            if (table.Status == 1) {       
                                // Update content with table data for enabled tables
                                clone.querySelector('#table-name').textContent = table.TableName;
                                clone.querySelector('#seats').textContent = event.NumberOfSeats;
                                clone.querySelector('#table-message').textContent = `${table.TotalReserveSeat} reserved`; // Display reserved seats
                                clone.querySelector('#seats-taken').textContent = `${table.TotalSeat}`; // Display total seats
                                
                                let total = event.NumberOfSeats - table.TotalSeat;
                                if (total == 0) {
                                    clone.querySelector('.card').classList.add('card-full');
                                } else if (total == event.NumberOfSeats) {
                                    clone.querySelector('.card').classList.add('card-free');
                                } else if (total === Math.floor(event.NumberOfSeats / 2)) {
                                    clone.querySelector('.card').classList.add('card-available-half');
                                } else {
                                    clone.querySelector('.card').classList.add('card-available');
                                }
                
                                clone.querySelector('.card').id = `table-${table.TableName}`;
                                clone.querySelector('a').setAttribute('onclick', `edit_table('${table.TableId}')`);
                                clone.querySelector('a#disable-table-dropdown').setAttribute('onclick', `disable_table(${table.TableId})`);
                                clone.querySelector('a#lock-table-dropdown').setAttribute('onclick', `lock_table(${table.TableId})`);
                            }  else if (table.Status == 0) {
                                // Update content with table data for disabled tables
                                clone.querySelector('.card').id = `table-${table.TableName}`;
                                clone.querySelector('.card-header .row .col-6:first-child').textContent = table.TableName;
                                clone.querySelector('a').setAttribute('onclick', `enable_table('${table.TableId}')`);
                            } else if (table.Status == 3) {
                                // Update content with table data for locked tables
                                clone.querySelector('.card').id = `table-${table.TableName}`;
                                clone.querySelector('.table-name').textContent = table.TableName;
                                clone.querySelector('.card').id = `nickname-${table.Nickname}`;
                                clone.querySelector('.nickname-nn').textContent = table.Nickname;
                                clone.querySelector('a#lock-table-dropdown').setAttribute('onclick', `unlock_table('${table.TableId}')`);
                                clone.querySelector('#seats').textContent = event.NumberOfSeats;
        
                                clone.querySelector('#table-message').textContent = `${table.TotalReserveSeat} reserved`; // Display reserved seats
                                clone.querySelector('#seats-taken').textContent = `${table.TotalSeat}`; // Display total seats
                            }
                
                            // Append the cloned template to the row div
                            rowDiv.appendChild(clone);
                        } else {
                            console.error('Template not found');
                        }
                    }
                }
                
                // Append the row div to the table layout
                tableLayout.appendChild(rowDiv);
            }
            // Resolve the promise to indicate success
            resolve();
        } else {
            console.error('Table details not found');
            reject('Table details not found');
        }
    });
}

function edit_table(tableId) {
    $('#editModal').modal('show');
    load_edit(tableId)
}


function load_table_display() {
    let tableDetails = JSON.parse(localStorage.getItem('tableDetails')) || [];
    let seatData = JSON.parse(localStorage.getItem('seatData')) || [];
    let storeData = JSON.parse(localStorage.getItem('storeData'));
    let validTableIds = tableDetails.map(table => table.TableId);
    let validSeatData = seatData.filter(seat => validTableIds.includes(seat.TableId));
    tableDisplay = [];

    validSeatData.forEach(seat => {
        let store = storeData.find(store => store.StoreId == seat.StoreId);
        let table = tableDetails.find(table => table.TableId == seat.TableId);
        

        let data = {
            SeatId: seat.SeatId,
            StoreId: store.StoreId,
            StoreName: store.StoreName,
            Seats: store.People,
            ReserveSeats: seat.ReserveSeat,
            TableId: seat.TableId,
            TableName: table.TableName
        };
        tableDisplay.push(data);
    });
    localStorage.setItem('tableDisplay', JSON.stringify(tableDisplay));
}

function load_edit(tableId) {
    load_table_display();
    let seatDetails = document.getElementById("seat-details");
    seatDetails.innerHTML = '';
    var tableDetails = JSON.parse(localStorage.getItem('tableDetails'));
    var table = tableDetails.find(table => table.TableId == tableId);

    if (table.Status === 3) {
        alert('This table is locked and cannot be edited.');
        return;
    }

    var eventId = get_event_id();
    
    // Retrieve data from localStorage
    var eventData = JSON.parse(localStorage.getItem('eventData'));
    var event = eventData.find(event => event.EventId == parseInt(eventId));

    document.getElementById("table-edit-title").innerText = `${table.TableName}:`;
    document.getElementById("table-details-text").innerText = `${event.NumberOfSeats - table.FreeSeats}/${event.NumberOfSeats} Seats`;
    
    let freeSeats = table.FreeSeats;
    
    tableDisplay = JSON.parse(localStorage.getItem('tableDisplay'));
    storeData = tableDisplay.filter(store => store.TableId == tableId);
   // Get the store card template
   let template = document.getElementById('store-card-template');
    
    // Iterate over store data and create store cards
    storeData.forEach(store => {
        // Clone the template
        let clone = template.content.cloneNode(true);
        // Update content with store data
        clone.querySelector('#store-card-title').textContent = `${store.StoreName}`; // Assuming StoreName is part of store data
        clone.querySelector('#store-card-seat').textContent = `${store.Seats} seats`;
        clone.querySelector('#store-card-rseat').textContent = `reserved: ${store.ReserveSeats}`;

        let tables = JSON.parse(localStorage.getItem('tableDetails'));
        let table = tables.find(t => t.TableId == store.TableId);
        let freeSeats = table.FreeSeats;
       
        if (freeSeats == 0) {
            clone.querySelector('.card').classList.add('table-full');
        } else {
            clone.querySelector('.card').classList.add('table-free');
        }
        
       // Set unique ID or other attributes as needed
       clone.querySelector('.card').id = `store-${store.SeatId}`;
       
       let deleteTrigger = clone.querySelector('#delete_trigger');
       deleteTrigger.setAttribute('onclick', `delete_store(${store.SeatId}, ${tableId}, ${store.StoreId})`);
       
       let edit_store_trigger = clone.querySelector('#edit-store-trigger');
       edit_store_trigger.setAttribute('onclick', `edit_store(${store.SeatId}, ${tableId}, ${store.StoreId})`);

       let move_store_trigger = clone.querySelector('#move-store-trigger');
       move_store_trigger.setAttribute('onclick', `move_store(${store.StoreId}, ${tableId},${store.Seats},${store.SeatId})`);
       
       // Append the cloned store card to seatDetails
       seatDetails.appendChild(clone);
   });
   
   // Add the "add card" template at the end only if freeSeats equals event.NumberOfSeats
   if (freeSeats != 0) {
       let addCardTemplate = document.getElementById('add-card-template').innerHTML;
       let addCard = addCardTemplate
       .replace('{tableID}', tableId)
       .replace('{tableName}', table.TableName)
       .replace('{FreeSeats}', freeSeats); // Example value for FreeSeats, adjust as needed
       
       // Create a temporary container to parse the string into HTML elements
       let tempDiv = document.createElement('div');
       tempDiv.innerHTML = addCard;
       
       // Append the created add card to seatDetails
       seatDetails.appendChild(tempDiv.firstElementChild);
   }
}

function load_event_stores() {
    console.log("TEST");
    var eventId = get_event_id();
    var eventData = JSON.parse(localStorage.getItem('eventData'));
    var event = eventData.find(e => e.EventId == eventId);
    const province = event.Province;

    storeData = JSON.parse(localStorage.getItem('storeData'));
    tableDisplay = JSON.parse(localStorage.getItem('tableDisplay'));

    let filteredStores = storeData.filter(store => store.Province === province);
    let eventStores = filteredStores.filter(store => 
        !tableDisplay.some(table => table.StoreId === store.StoreId)
    ).map(store => {
        return {
            StoreId: store.StoreId,
            StoreName: store.StoreName,
            Province: store.Province,
            People: store.People // Assuming "people" refers to a field in storeData
        };
    });

    return eventStores;
}


function add_store(tableID, freeSeats) {
    $('#addModal').modal('show');
    let stores = load_event_stores();
    document.getElementById('inputAddStoreID').value = '';
    document.getElementById('inputAddSeat').value = '';
    document.getElementById('inputAddReserveSeat').value = 0;
    document.getElementById('inputAddTableID').value = tableID;
    document.getElementById('inputAddSeat').max = freeSeats;

    let selectElement = document.getElementById('inputAddName');
    
    // Clear existing options
    selectElement.innerHTML = '';
    
    // Add default option
    let defaultOption = document.createElement('option');
    defaultOption.text = '--- Select Store ---';
    defaultOption.value = '';
    selectElement.appendChild(defaultOption);
    
    // Iterate over store data and create options
    stores.forEach(store => {
        let option = document.createElement('option');
        option.text = store.StoreName;
        option.value = store.StoreId;
        selectElement.appendChild(option);
    });
    
    // Add event listener to update inputs when a store name is selected
    document.getElementById('inputAddName').addEventListener('change', function() {
        let selectedStoreId = this.value;
        let selectedStore = stores.find(store => store.StoreId == selectedStoreId);
        if (selectedStore) {
            document.getElementById('inputAddStoreID').value = selectedStore.StoreId;
            document.getElementById('inputAddSeat').value = selectedStore.People;
        }
        if (selectedStore.People > freeSeats) {
            document.getElementById('add-btn').disabled = true;
        } else {
            document.getElementById('add-btn').disabled = false;
        }
    });
}

document.getElementById("addForm").addEventListener("submit", function(event) {
    event.preventDefault();
    add_store_submit();
});


function add_store_submit() {
    var tableID = document.getElementById('inputAddTableID').value;
    var storeID = document.getElementById('inputAddStoreID').value;
    var seat = document.getElementById('inputAddSeat').value;
    var reserveSeat = document.getElementById('inputAddReserveSeat').value;
    var seatData = JSON.parse(localStorage.getItem('seatData')) || [];
    var latestSeatId = seatData.length > 0 ? parseInt(seatData[seatData.length - 1].SeatId) : 0;
    
    var seatId = (latestSeatId + 1).toString();
    // Create a data object to hold the values
    var data = {
        SeatId: seatId,
        StoreId: storeID,
        Seat: seat,
        ReserveSeat: reserveSeat,
        TableId: tableID
    };
    // Add the new store data to seatData in localStorage
    seatData.push(data);
    localStorage.setItem('seatData', JSON.stringify(seatData));

    // Handle success
    $('#addModal').modal('hide');
    add_success(tableID, seat);
}

function add_success(tableID, seat) {
    // success message
    let tables = JSON.parse(localStorage.getItem('tableData'));
    let table = tables.find(t => t.TableId == tableID);
    let tableName = table.TableName;
    $('#successModal').modal('show');
    document.getElementById("success-dialog").innerHTML = "Store Added";
    document.getElementById("success-info").innerHTML = seat + " seats added to table "+ tableName;
    edit_refresh(tableID);
}



function edit_refresh(tableID) {
    load_tables().then(() => {
        load_edit(tableID);
    }).catch(error => {
        console.error('Error loading tables:', error);
    });
}

function delete_store(seatId, tableID, storeId) {
    // Retrieve seatData from localStorage
    var seatData = JSON.parse(localStorage.getItem('seatData')) || [];

    // Find the index of the seat to be deleted
    var index = seatData.findIndex(data => data.SeatId == seatId);

    // Remove the seat data if found
    if (index !== -1) {
        seatData.splice(index, 1);
    }

    // Save the updated seatData back to localStorage
    localStorage.setItem('seatData', JSON.stringify(seatData));

    // Handle success
    delete_success(tableID, storeId);    
}

function delete_success(tableID,storeID) {
    $('#successModal').modal('show');
     // success message
    //  console.log('Store deleted!')
    // let tables = JSON.parse(localStorage.getItem('tableData'));
    // let table = tables.find(t => t.TableId == tableID);
    // let tableName = table.TableName;
    //  console.log(tableID)
     $('#successModal').modal('show');
     document.getElementById("success-dialog").innerHTML = "Store Removed";
     document.getElementById("success-info").innerHTML = "store " + storeID + " removed from table ";
     edit_refresh(tableID);
}

function edit_store(seatId, tableID, storeID) {
    document.getElementById('init-store-id').value = storeID;
    $('#editStoreModal').modal('show');

    // Retrieve tableDisplay from localStorage
    let tableDisplay = JSON.parse(localStorage.getItem('tableDisplay')) || [];
    let seat = tableDisplay.find(s => s.SeatId == seatId);

    if (seat) {
        document.getElementById('inputEditStoreID').value = seat.StoreId;
        document.getElementById('inputEditTableID').value = tableID;
        document.getElementById('inputEditSeat').value = seat.Seats;
        document.getElementById('inputEditReserveSeat').value = seat.ReserveSeats;
        document.getElementById('edit-seat-id').value = seat.SeatId;

        // Retrieve eventStores using load_event_stores function
        let eventStores = load_event_stores();
        let selectElement = document.getElementById('inputEditName');
        
        
        // Clear existing options
        selectElement.innerHTML = '';
        
        // Add default option
        let defaultOption = document.createElement('option');
        defaultOption.text = seat.StoreName;
        defaultOption.value = seat.StoreId;
        selectElement.appendChild(defaultOption);
        selectElement.text = seat.StoreName;
        
        // Iterate over store data and create options
        eventStores.forEach(store => {
            let option = document.createElement('option');
            option.text = store.StoreName;
            option.value = store.StoreId;
            selectElement.appendChild(option);
        });

        eventStores.push({
            "StoreId": storeID,
            "StoreName": seat.StoreName,
            "People": seat.Seats,
            "Reserved": seat.ReserveSeats
        });
        
        // Add event listener to update inputs when a store name is selected
        document.getElementById('inputEditName').addEventListener('change', function() {
            let selectedStoreId = this.value;
            let selectedStore = eventStores.find(store => store.StoreId == selectedStoreId);
            if (selectedStore) {
                document.getElementById('inputEditStoreID').value = selectedStore.StoreId;
                document.getElementById('inputEditSeat').value = selectedStore.People;
            }
        });
    } else {
        console.error('Seat not found in tableDisplay');
    }
}

document.getElementById("editStoreForm").addEventListener("submit", function(event) {
    event.preventDefault();
    edit_store_submit();
});

function edit_store_submit() {
    var storeID = document.getElementById('inputEditStoreID').value;
    var seat = document.getElementById('inputEditSeat').value;
    var reserveSeat = document.getElementById('inputEditReserveSeat').value;
    var seatID = document.getElementById('edit-seat-id').value;
    var tableID = document.getElementById('inputEditTableID').value;

    // Retrieve seatData from localStorage
    var seatData = JSON.parse(localStorage.getItem('seatData')) || [];

    // Find the index of the seat to be updated
    var index = seatData.findIndex(data => data.SeatId == seatID);

    // Update the seat data if found
    if (index !== -1) {
        seatData[index].StoreId = storeID;
        seatData[index].Seat = seat;
        seatData[index].ReserveSeat = reserveSeat;
        seatData[index].TableId = tableID;

        // Save the updated seatData back to localStorage
        localStorage.setItem('seatData', JSON.stringify(seatData));

        // Handle success
        // console.log('Store updated successfully');
        $('#editStoreModal').modal('hide');
        edit_success(tableID, storeID, reserveSeat);
    } else {
        console.error('Seat not found in seatData');
    }
}

function edit_success(tableID,storeID,reserveSeat) {
    // edit message
    // console.log('edit sucess')
    let tables = JSON.parse(localStorage.getItem('tableDetails'));
    let table = tables.find(t => t.TableId == tableID);
    let tableName = table.TableName;
    $('#successModal').modal('show');
    document.getElementById("success-dialog").innerHTML = "Store Edited";
    document.getElementById("success-info").innerHTML = "Store " + storeID +" now has " + reserveSeat +  " reserved seats";
    edit_refresh(tableID);
}


function move_store(storeID, tableID, seats, seatID) {
   load_tables();
    $('#moveModal').modal('show');
    let tables = JSON.parse(localStorage.getItem('tableDetails'));
    let currentTable = tables.find(t => t.TableId == tableID);
    document.getElementById('MoveTableID').value = tableID;
    document.getElementById('MoveSeatID').value = seatID;
    document.getElementById('moving-store').innerHTML = `Moving Store ID: ${storeID} from table ${currentTable.TableName} `;
 
    // Clear existing options
    let selectElement = document.getElementById('inputMoveTable');
    selectElement.innerHTML = '';

    let defaultOption = document.createElement('option');
    defaultOption.text = '--- Select Table ---';
    defaultOption.value = '';
    selectElement.appendChild(defaultOption);

    // Iterate through tables and find tables with enough free seats
    tables.forEach(table => {
        if (table.FreeSeats >= seats && table.TableId != currentTable.TableId && table.Status==1) {
            let option = document.createElement('option');
            option.text = table.TableName;
            option.value = table.TableId;
            selectElement.appendChild(option);
        }
    });
    
    selectElement.addEventListener('change', function() {
        var eventData = JSON.parse(localStorage.getItem('eventData')) || [];
        var eventId = get_event_id();
        var event = eventData.find(e => e.EventId == eventId);

        let selectedTableID = selectElement.value;
        let selectedTable = tables.find(t => t.TableId == selectedTableID);
        if (selectedTable) {
                document.getElementById('move-table-details').innerHTML = `Table ${selectedTable.TableName}: ${selectedTable.TotalSeat}/${event.NumberOfSeats} seats, ${selectedTable.TotalReserveSeat} Reserved`;
            
            } else {
                document.getElementById('move-table-details').innerHTML = 'Select a table to move to'; 
            
            }
    });

    //show the layout of the tables
    return new Promise((resolve, reject) => {
        // Retrieve event from localStorage
        var eventData = JSON.parse(localStorage.getItem('eventData')) || [];
        var eventId = get_event_id();
        var event = eventData.find(e => e.EventId == eventId);
        
        // Get the number of rows and columns
        var numRows = event.NumberOfRows;
        var numCols = event.NumberOfCols;
        
        const tableLayout = document.getElementById('move-layout');
        tableLayout.innerHTML = ''; // Clear previous content

         // Retrieve tables from localStorage
         let tableDetails = JSON.parse(localStorage.getItem('tableDetails'));
        
        for (let row = 0; row < numRows; row++) {
            // Create a new row div
            let rowDiv = document.createElement('div');
            rowDiv.className = 'd-flex justify-content-center mt-2';
            rowDiv.style.width = 'min-content';
            rowDiv.style.minWidth = '100%';

            for (let col = 0; col < numCols; col++) {
                let tableIndex = row * numCols + col;
                if (tableIndex < tableDetails.length) {
                    // Determine the status of the table

                    let table = tableDetails[tableIndex];
                    let template;
                    switch (parseInt(table.Status)) {
                        case 1: // Enabled table
                            template = document.getElementById('table-card-template');
                            break;
                        case 0: // Disabled table
                            template = document.getElementById('disabled-card-template');
                            break;
                        case 3: // Locked table
                            template = document.getElementById('locked-card-template');
                            break;
                        default:
                            console.error('Unknown table status:', table.Status);
                            continue;
                    }

                    if (template) {
                        let clone = template.content.cloneNode(true);
                        clone.querySelector('.card').style.width = '10rem';
                        if (table.Status == 1) {
                            // Update content with table data for enabled tables
                            clone.querySelector('#table-name').textContent = table.TableName;
                            clone.querySelector('#seats').textContent = event.NumberOfSeats;
                            clone.querySelector('#table-message').textContent = `${table.TotalReserveSeat} reserved`; // Display reserved seats
                            clone.querySelector('.dropdown').style.display = 'none';
                            clone.querySelector('#seats-taken').textContent = `${table.TotalSeat}`; // Display total seats

                            let total = event.NumberOfSeats - table.TotalSeat;
                            if (total == 0) {
                                clone.querySelector('.card').classList.add('card-full');
                            } else if (total == event.NumberOfSeats) {
                                clone.querySelector('.card').classList.add('card-free');
                            } else if (total <= (event.NumberOfSeats / 2)) {
                                clone.querySelector('.card').classList.add('card-available-half');
                            } else {
                                clone.querySelector('.card').classList.add('card-available');
                            }

                            clone.querySelector('.card').id = `table-${table.TableName}`;
                            clone.querySelector('a').setAttribute('onclick', `edit_table('${table.TableId}')`);
                            clone.querySelector('a#disable-table-dropdown').setAttribute('onclick', `disable_table(${table.TableId})`);
                            clone.querySelector('a#lock-table-dropdown').setAttribute('onclick', `lock_table(${table.TableId})`);
                        } else if (table.Status == 0) {
                            // Update content with table data for disabled tables
                            clone.querySelector('.card').id = `table-${table.TableName}`;
                            clone.querySelector('.card-header .row .col-6:first-child').textContent = table.TableName;
                            clone.querySelector('a').setAttribute('onclick', `enable_table('${table.TableId}')`);
                        } else if (table.Status == 3) {
                            // Update content with table data for locked tables
                            clone.querySelector('.card').id = `table-${table.TableName}`;
                            clone.querySelector('.table-name').textContent = table.TableName;

                            clone.querySelector('.card').id = `nickname-${table.Nickname}`;
                            clone.querySelector('.nickname-nn').textContent = table.Nickname;
                            clone.querySelector('a#lock-table-dropdown').setAttribute('onclick', `unlock_table('${table.TableId}')`);
                            clone.querySelector('#seats').textContent = event.NumberOfSeats;

                            clone.querySelector('#table-message').textContent = `${table.TotalReserveSeat} reserved`; // Display reserved seats
                            clone.querySelector('#seats-taken').textContent = `${table.TotalSeat}`; // Display total seats
                        }

                        // Append the cloned template to the row div
                        rowDiv.appendChild(clone);
                    } else {
                        console.error('Template not found');
                    }
                }
            }

            // Append the row div to the table layout
            tableLayout.appendChild(rowDiv);
        }

        // Resolve the promise to indicate success
        resolve();
    });
}

document.getElementById("moveForm").addEventListener("submit", function(event) {
    event.preventDefault();
    move_store_submit();
    
});

function move_store_submit() {
    var currentTableID = document.getElementById('MoveTableID').value;
    var newTableID = document.getElementById('inputMoveTable').value;
    var seatID = document.getElementById('MoveSeatID').value;
    
    // Retrieve seatData from localStorage
    var seatData = JSON.parse(localStorage.getItem('seatData')) || [];

    // Find the index of the seat to be moved
    var index = seatData.findIndex(data => data.SeatId == seatID);
    
    // Update the seat data if found
    if (index !== -1) {
        seatData[index].TableId = newTableID;

        // Save the updated seatData back to localStorage
        localStorage.setItem('seatData', JSON.stringify(seatData));

        // Handle success
        // console.log('Seat moved successfully');
        move_success(currentTableID, newTableID);
        $('#moveModal').modal('hide');
    } else {
        console.error('Seat not found in seatData');
    }
}

function move_success(currentTableID, newTableID) {
    // console.log('Store moved!')
    $('#successModal').modal('show');
    document.getElementById("success-dialog").innerHTML = "Store Moved";
    document.getElementById("success-info").innerHTML = `StoreID: ... moved from ... to ...`;
    edit_refresh(currentTableID);
}

function disable_table(tableID) {
    $('#disableModal').modal('show');
    let tables = JSON.parse(localStorage.getItem('tableDetails'));
    let table = tables.find(t => t.TableId == tableID);
    document.getElementById("disable-btn").setAttribute('onclick', `disable_confirm('${tableID}','${table.TableName}')`);
    document.getElementById("disable-tableID").innerHTML = table.TableName;
}

function disable_confirm(tableId, tableName) {
    // Retrieve tableData from localStorage
    var tableData = JSON.parse(localStorage.getItem('tableData')) || [];

    // Find the index of the table to be disabled
    var index = tableData.findIndex(table => table.TableId == tableId);

    // Update the table status if found
    if (index !== -1) {
        tableData[index].Status = 0;

        // Save the updated tableData back to localStorage
        localStorage.setItem('tableData', JSON.stringify(tableData));

        // Retrieve seatData from localStorage
        var seatData = JSON.parse(localStorage.getItem('seatData')) || [];

        // Remove all seats with the given TableId
        seatData = seatData.filter(seat => seat.TableId != tableId);

        // Save the updated seatData back to localStorage
        localStorage.setItem('seatData', JSON.stringify(seatData));

        // Handle success
        // console.log('Table disabled and seats removed successfully');
        load_tables();
        $('#disableModal').modal('hide');
        $('#successModal').modal('show');
        document.getElementById("success-dialog").innerHTML = "Table Disabled";
        document.getElementById("success-info").innerHTML = `Table '${tableName}' has been disabled.`;
    } else {
        console.error('Table not found in tableData');
    }
}

function enable_table(tableID) {
    // Retrieve tableData from localStorage
    var tableData = JSON.parse(localStorage.getItem('tableData')) || [];

    // Find the index of the table to be enabled
    var index = tableData.findIndex(table => table.TableId == tableID);

    // Update the table status if found
    if (index !== -1) {
        tableData[index].Status = 1;

        // Save the updated tableData back to localStorage
        localStorage.setItem('tableData', JSON.stringify(tableData));

        // Handle success
        // console.log('Table enabled successfully');
        load_tables();
        $('#successModal').modal('show');
        document.getElementById("success-dialog").innerHTML = "Table Enabled";
        document.getElementById("success-info").innerHTML = `Table '${tableData[index].TableName}' has been enabled.`;
    } else {
        console.error('Table not found in tableData');
    }
}

function lock_table(tableID) {
    //lock the table from being changed and edited
    $('#lockModal').modal('show');
    let tables = JSON.parse(localStorage.getItem('tableDetails'));
    let table = tables.find(t => t.TableId == tableID);
    document.getElementById("lock-btn").setAttribute('onclick', `lock_confirm('${tableID}','${table.TableName}')`);
    document.getElementById("lock-tableID").innerHTML = table.TableName;
}

function lock_confirm(tableId, tableName) {
    let nickname = document.getElementById("inputTableName").value;

    // Retrieve tableData from localStorage
    var tableData = JSON.parse(localStorage.getItem('tableData')) || [];

    // Find the index of the table to be locked
    var index = tableData.findIndex(table => table.TableId == tableId);

    // Update the table status and nickname if found
    if (index !== -1) {
        tableData[index].Status = 3;
        tableData[index].Nickname = nickname;

        // Save the updated tableData back to localStorage
        localStorage.setItem('tableData', JSON.stringify(tableData));

        // Handle success
        load_tables();
        $('#lockModal').modal('hide');
        $('#successModal').modal('show');
        document.getElementById("success-dialog").innerHTML = "Table Locked";
        document.getElementById("success-info").innerHTML = `Table '${tableName}' has been Locked.`;
        document.getElementById(`nickname-${tableId}`).textContent = `(${nickname})`;
    } else {
        console.error('Table not found in tableData');
    }
}

function unlock_table(tableID) {
    // Retrieve tableData from localStorage
    var tableData = JSON.parse(localStorage.getItem('tableData')) || [];

    // Find the index of the table to be unlocked
    var index = tableData.findIndex(table => table.TableId == tableID);

    // Update the table status and remove the nickname if found
    if (index !== -1) {
        tableData[index].Status = 1;
        tableData[index].Nickname = null;

        // Save the updated tableData back to localStorage
        localStorage.setItem('tableData', JSON.stringify(tableData));

        // Handle success
        load_tables();
        $('#successModal').modal('show');
        document.getElementById("success-dialog").innerHTML = "Table Unlocked";
        document.getElementById("success-info").innerHTML = `Table '${tableData[index].TableName}' has been unlocked.`;
    } else {
        console.error('Table not found in tableData');
    }
}