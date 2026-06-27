
function buildFormHtml(presenter) {
    const presenterFolder = emailToSafeFolder(presenter);
    currentPresenterFolder = presenterFolder
    html = `
    <div id = "presenterDiv">
        <form id="presenterForm">
          <div  class = "divButton" onclick="toggleVisibility('presenterTbody')">Update Presenter Information</div>
          <table>
                <tbody id = "presenterTbody" style="display: none;">
                    <tr>
                        <td>
                            <input type="text" id="form-recordId" name="form-recordId" value = "" style="display: none;">
                            <input type="text" id="form-presenterEmail" name="form-presenterEmail" value = "${presenter}"  style="display: none;">
                            <input type="text" id="form-presenterFolder" name="form-presenterFolder" value = "${presenterFolder}"  style="display: none;">
                            <label for="form-presenterName">Name:</label>
                        </td>
                        <td>
                            <input type="text" id="form-presenterName" name="form-presenterName" required>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="form-presenterPhone">Phone:</label>
                        </td>
                        <td>
                            <input type="text" id="form-presenterPhone" name="form-presenterPhone" required>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="form-presenterAddressLine1">Address:</label>
                        </td>
                        <td>
                            <input type="text" id="form-presenterAddressLine1" name="form-presenterAddressLine1">
                        </td>
                    </tr>
                    <tr>
                        <td>     
                            <label for="form-presenterAddressLine2">line2:</label>
                        </td>
                        <td>
                            <input type="text" id="form-presenterAddressLine2" name="form-presenterAddressLine2">
                        </td>
                    </tr>
                    <tr>
                        <td>     
                            <label for="cityStateZip">City:</label>
                        </td>
                        <td>
                            <input type="text" size="10" id="form-presenterCity" name="form-presenterCity" style="display: inline;">&nbsp
                            State: &nbsp: <input type="text" size="2" id="form-presenterState" name="form-presenterState" style="display: inline;">&nbsp
                            Zip: &nbsp: <input type="text" size="7" id="form-presenterZip" name="form-presenterZip" style="display: inline;">&nbsp
                    </td>
                    </tr>
                    <tr>
                        <td>     
                            <label for="form-presenterAbout">Abut:</label>
                        </td>
                        <td> 
                            <textarea id="form-presenterAbout" name="form-presenterAbout"></textarea>
                    </td>
                    </tr>
                    <tr>
                        <td>     
                            <label for="form-presenterWebsite">Website:</label>
                        </td>
                        <td>
                            <input type="text" id="form-presenterAbout" name="form-presenterWebsite" >
                        </td>
                    </tr>
                    <tr>
                        <td>     
                            <label for="form-presenterDateAdded">Website:</label>
                        </td>
                        <td>
                            <input type="datetime" readonly id="form-presenterDateAdded" name="form-presenterDateAdded" >
                    </td>
                    
                    </tr>
                    <tr>
                        <td>
                            <button type="submit" id="presenterUpdateBtn">Update</button>
                        </td>
                        <td>
                            <button type="submit" id="presenterDeletetBtn">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>

        </form>
        </div>
    <div id="result"  style="display: none;"></div>
            <div id="presentationDivision"></div>
                `;
    return html;


}


async function editPresenter(presenter) {

    // fetch data
    const html = await buildFormHtml(presenter);
    document.getElementById('contentArea').innerHTML = html;

    // form now exists
    return true;
}

function buildPresentationFormHtml(ip_presenterEmail, ip_slideshow) {
    const presenterFolder = emailToSafeFolder(ip_presenterEmail);
        html = `
            <div id = "presentationDateTimeDiv">
                <form id="presentationForm">
                    Add new Presentation for <input type="text" readonly id="form-presentationSlideshow" name="form-presentationSlideshow" value = "${ip_slideshow}">
                    &nbsp on <select id="dateSelect"></select>
                     &nbsp at <select id="timeSelect"></select>

                    <input type="text" id="form-recordId" name="form-recordId" value = "currentPresenterID" style="display: none;">
                    <input type="text" id="form-presenterEmail" name="form-presenterEmail" value = "${currentPresenter}"  style="display: none;">
                    <input type="text" id="form-presenterFolder" name="form-presenterFolder" value = "${currentPresenterFolder}"  style="display: none;">
                     &nbsp <button type = "button" onclick = "addSubmitPresenter()" id="presentationButton" style="display: none;">Update Presentation</button>
                </form>
            </div>
            <div id="PresentationResult"  style="display: none;"></div>
                    `;
    return html;


};

   function addSubmitPresenter() {
        const presentationForm = document.getElementById('presentationForm');
          if (presentationForm) {
                alert (' presentationForm now in addSubmitPresenter');
        } else {return;};
    alert (' starting addSubmitPresenter');
    document.getElementById('presenterTbody').style.display="inline";
    presentationArea = document.getElementById('presentationArea');
    /*

    presentationForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    const resultDiv = document.getElementById('PresentationResult');
    resultDiv.innerHTML = 'Processing...';
    return true;
    })

 try {
        const response = await fetch('process_transaction.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const text = await response.text();
        console.log('Raw:', text);
        const result = JSON.parse(text);

        if (result.code === 200) {
            resultDiv.style.borderColor = 'green';
            resultDiv.innerHTML = `<strong>✅ Success!</strong><br>${result.message}`;
            // Refresh dropdown after insert/update/delete
            if (data.operation !== 'insert') loadTransactions();
        } else {
            resultDiv.style.borderColor = 'red';
            resultDiv.innerHTML = `<strong>❌ Error</strong><br>${result.message}`;
        }
    } catch (error) {
        console.error(error);
        resultDiv.style.borderColor = 'red';
        resultDiv.innerHTML = `<strong>❌ Error</strong><br>${error.message}`;
    }
    });
*/
}


function editPresentation(ip_presenterEmail, ip_slideshow) {

    // fetch data
    const html = buildPresentationFormHtml(ip_presenterEmail, ip_slideshow);

    document.getElementById('presentationDivision').innerHTML = html;
    
// ===== Date Dropdown =====
const dateSelect = document.getElementById('dateSelect');

for (let i = 0; i < 8; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const option = document.createElement('option');

    // Value format: YYYY-MM-DD
    option.value = date.toISOString().split('T')[0];

    // Display format: Thu Jun 25, 2026
    option.textContent = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    dateSelect.appendChild(option);
}

// ===== Time Dropdown =====
const timeSelect = document.getElementById('timeSelect');

const now = new Date();
let startHour = now.getHours();
let startMinute = Math.ceil(now.getMinutes() / 15) * 15;

if (startMinute === 60) {
    startMinute = 0;
    startHour = (startHour + 1) % 24;
}

for (let i = 0; i < 96; i++) {
    const totalMinutes =
        (startHour * 60 + startMinute + i * 15) % (24 * 60);

    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;

    const option = document.createElement('option');

    option.value =
        String(hour).padStart(2, '0') + ':' +
        String(minute).padStart(2, '0');

    let displayHour = hour % 12;
    if (displayHour === 0) displayHour = 12;

    option.textContent =
        displayHour + ':' +
        String(minute).padStart(2, '0') +
        ' ' +
        (hour < 12 ? 'AM' : 'PM');

    timeSelect.appendChild(option);

}
    timeSelect.addEventListener('change', handleTimeSelectionChange);

//timeSelect.addEventListener('change', (event) => {
 //   alert("Selected time: " + event.target.value);
//});

    // form now exists
     async function handleTimeSelectionChange() {
       // if (!selectedValue) return;
        const presentationDate = document.getElementById('dateSelect');
        const presentationTime = document.getElementById('timeSelect');
        const presentationButton = document.getElementById('presentationButton');

        if (!presentationButton) {
            alert("presentationButton not found in handleTimeSelectionChange!");
        } else {
            presentationButton.style.display="inline";
        }
        //const timeSelect = document.getElementById('timeSelect');
        console.log('user = ' + currentUser + ' currentPresenter = ' + currentPresenter+ ' currentPresenterFolder = ' + currentPresenterFolder);
        console.log(' presentationDate = ' + presentationDate.value + ' presentationTime = ' + presentationTime.value);
        console.log(' presentationButton.innerText = ' + presentationButton.innerText);
        

        return true;
        }
    }

    //timeSelect.addEventListener('change', handleSelectionChange);