
function buildFormHtml(presenter) {
    const presenterFolder = emailToSafeFolder(presenter);
    html = `
        <div id = "presenterDiv">
        <h2>Editing presenter ${presenter}</h2>
                    <h2>Presenter Management</h2>

        <form id="presenterForm">
            <table>
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
            </table>

        </form>
        </div>
                `;
        return html;


}


async function editPresenter(presenter) {

    // fetch data
    const html = buildFormHtml(presenter);

    document.getElementById('contentArea').innerHTML = html;

    // form now exists
    return true;
}
