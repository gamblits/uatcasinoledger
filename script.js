document.addEventListener('DOMContentLoaded', function () {
    const calculateButton = document.getElementById('calculate');
    const saveButton = document.getElementById('save');
    const newEntryButton = document.getElementById('new-entry');
    const undoButton = document.getElementById('undo');
    const resetButton = document.getElementById('reset');
    const downloadButton = document.getElementById('download');
    const ledgerTable = document.querySelector('.ledger table tbody');
    const commentsField = document.getElementById('comments');

    function preventDeletingDollarSign(event) {
        const input = event.target;
        const value = input.value;

        // Exclude the comments field
        if (!value.startsWith('$')) {
            input.value = '$' + value.slice(1);
        }
    }

    const dollarSignFields = ['free-play', 'free-play-gains', 'jackpot', 'walked-out', 'bankroll'];

    dollarSignFields.forEach(field => {
        document.getElementById(field).addEventListener('input', preventDeletingDollarSign);
    });

    function placeCursorAfterDollarSign(event) {
        const input = event.target;
        const value = input.value;

        if (input.id !== 'casino-name' && input.id !== 'comments') {
            if (!value.startsWith('$')) {
                input.value = '$' + value;
            }

            input.setSelectionRange(1, value.length);
        }
    }

    document.querySelectorAll('.input-field input').forEach(input => {
        input.addEventListener('click', placeCursorAfterDollarSign);
    });

    calculateButton.addEventListener('click', function () {
        const bankrollInput = document.getElementById('bankroll');
        const jackpotInput = document.getElementById('jackpot');
        const walkedOutInput = document.getElementById('walked-out');

        const bankroll = parseFloat(bankrollInput.value.slice(1));
        const jackpot = parseFloat(jackpotInput.value.slice(1));
        const walkedOut = parseFloat(walkedOutInput.value.slice(1));

        const gains = walkedOut - bankroll;
        const losses = bankroll - walkedOut;

        document.getElementById('gains').value = gains >= 0 ? '$' + gains.toFixed(2) : '$0.00';
        document.getElementById('losses').value = losses >= 0 ? '$' + losses.toFixed(2) : '$0.00';
    });

    saveButton.addEventListener('click', function () {
        const date = document.getElementById('date').value;
        const casinoName = document.getElementById('casino-name').value;
        const freePlay = document.getElementById('free-play').value;
        const freePlayGains = document.getElementById('free-play-gains').value;
        const bankroll = document.getElementById('bankroll').value;
        const jackpot = document.getElementById('jackpot').value;
        const walkedOut = document.getElementById('walked-out').value;
        const gains = document.getElementById('gains').value;
        const losses = document.getElementById('losses').value;
        const comments = commentsField.value;

        const newRow = `
            <tr>
                <td class="date">${date}</td>
                <td class="casino">${casinoName}</td>
                <td class="free-play">${freePlay}</td>
                <td class="free-play-gains">${freePlayGains}</td>
                <td class="bankroll">${bankroll}</td>
                <td class="jackpot">${jackpot}</td>
                <td class="walked-out">${walkedOut}</td>
                <td class="gains">${gains}</td>
                <td class="losses">${losses}</td>
                <td class="comments">${comments}</td>
            </tr>
        `;

        ledgerTable.insertAdjacentHTML('beforeend', newRow);
    });

    newEntryButton.addEventListener('click', function () {
        const inputFields = document.querySelectorAll('.input-field input');
        inputFields.forEach(input => {
            if (input.id !== 'casino-name' && !dollarSignFields.includes(input.id) && input.id !== 'comments') {
                input.value = '$';
            }
        });

        document.getElementById('casino-name').value = '';
        dollarSignFields.forEach(field => {
            document.getElementById(field).value = '$';
        });
        document.getElementById('gains').value = '$0.00';
        document.getElementById('losses').value = '$0.00';
        commentsField.value = ''; // Reset comments field
    });

    undoButton.addEventListener('click', function () {
        const rows = document.querySelectorAll('.ledger table tbody tr');
        if (rows.length > 0) {
            rows[rows.length - 1].remove();
        }
    });

    resetButton.addEventListener('click', function () {
        const inputFields = document.querySelectorAll('.input-field input');
        inputFields.forEach(input => {
            if (input.id !== 'casino-name' && !dollarSignFields.includes(input.id) && input.id !== 'comments') {
                input.value = '$';
            }
        });

        document.getElementById('casino-name').value = '';
        dollarSignFields.forEach(field => {
            document.getElementById(field).value = '$';
        });
        document.getElementById('gains').value = '$0.00';
        document.getElementById('losses').value = '$0.00';
        commentsField.value = ''; // Reset comments field

        ledgerTable.innerHTML = '';
    });

    function convertTableToCSV() {
        const table = document.querySelector('.ledger table');
        const rows = Array.from(table.querySelectorAll('tr'));
        const headerCols = Array.from(rows[0].querySelectorAll('th'));
        const headers = headerCols.map(col => col.innerText);

        const dataRows = rows.slice(1).map(row => {
            const cols = Array.from(row.querySelectorAll('td'));
            return cols.map(col => col.innerText).join(',');
        });

        return [headers.join(','), ...dataRows].join('\n');
    }

    downloadButton.addEventListener('click', function () {
        const csvContent = convertTableToCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gambling_ledger.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});


