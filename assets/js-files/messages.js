async function loadMessagesSetup() {

    let editState = 0;
    let userId = 0;

    try {
        const response = await fetch('/user-data');
        const userData = await response.json();

        editState = userData.editState;
        userId = userData.id;

        if (editState == 1 || editState == 2) {
            document.getElementById("messageContainer").style.visibility = "visible";
            document.getElementById("saveMessageButton").style.visibility = "visible";
        } else {
            document.getElementById("messageContainer").style.visibility = "hidden";
            document.getElementById("saveMessageButton").style.visibility = "hidden";
        }

    } catch (error) {
        console.error('Error fetching user edit status:', error);
    }

    try {
        const response = await fetch('/messages');
        const messages = await response.json();
    
        // Populate the text areas with the fetched messages and set editability
        for (let i = 0; i < 3; i++) {
            const textArea = document.getElementById(`infoWindowSetup${i+1}`);
            const message = messages[i].message;
            const cid = messages[i].cid;

            textArea.value = message || '';

            if (editState === 2 || cid == userId || message === "" && editState === 1) {
                textArea.disabled = false;
            } else {
                textArea.disabled = true;
            }
        }
    
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

// Save messages
document.querySelector('.saveMessageButton').addEventListener('click', async function(event) {
    
    event.preventDefault();
    let messagesToSave = [];

    for (let i = 0; i < 3; i++) {
        const textArea = document.getElementById(`infoWindowSetup${i+1}`);
        if (!textArea.disabled) {
            messagesToSave.push({
                id: i + 1,
                message: textArea.value
            });
        }
    }

    console.log('Messages to save:', messagesToSave);

    try {
        const response = await fetch('/save-messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: messagesToSave })
        });
        

        if (response.ok) {
            alert('Messages saved successfully.');
        } else {
            const errorText = await response.text();
            console.error('Failed to save messages:', errorText);
            alert('Failed to save messages.');
        }
    } catch (error) {
        console.error('Error saving messages:', error);
        alert('Failed to save messages.');
    }
});
