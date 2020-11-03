'use strict';

$(document).on('turbolinks:load', function () {
  const userId = $('#currentBalance').data('user-id');
  let currentBalance;
  let newEntryBalance;
  let decNewBal;

  // get the current balance from the db, convert it to decimal format, and save it into a variable
  $.get('/users/' + userId).success(function (user) {
    currentBalance = user.current_balance;
    newEntryBalance = currentBalance;
    decNewBal = parseFloat(newEntryBalance / 100);
  });

  // update current balance
  $('#currentBalanceCell').on('click', '[data-current-balance]', function () {
    let el = $(this);
    let decBal = currentBalance / 100;
    decBal = decBal.toFixed(2);

    let input = $('<input type="number"/>').val(decBal);
    el.replaceWith(input.select());

    const save = function () {
      const updatedDecBal = input.val();
      const span = $('<span data-current-balance id="currentBalance" />').text(
        updatedDecBal * 100
      );
      input.replaceWith(span);

      const updatedBalance = document.getElementById('currentBalance')
        .innerHTML;

      $.post('/users/' + userId, {
        _method: 'PUT',
        user: {
          current_balance: updatedBalance,
          success: setTimeout(window.location.reload.bind(window.location), 50),
        },
      });
    };

    input.keyup(event => {
      if (event.keyCode == 13) {
        save();
      } else {
        return false;
      }
    });
    input.one('blur', save).focus();
  });

  // create new table row for each entry
  function createEntryRow(entry) {
    const decAmount = entry.amount / 100;
    decNewBal += decAmount;
    const intNewBal = Math.round(decNewBal);
    let entryColorClass = '';
    let entryActionsClass = '';
    const currentDate = new Date();
    if (new Date(entry.date + 'T00:00:00.000-04:00') < currentDate) {
      entryColorClass = ' past-date ';
    } else if (
      parseInt(entry.amount) >= 0 &&
      new Date(entry.date + 'T00:00:00.000-04:00') >= currentDate
    ) {
      entryColorClass = ' credit ';
    }
    if (entry.isEarliest === false) {
      entryActionsClass = ' d-none';
    }
    const entryRow =
      '<tr class="entryRow' +
      entryColorClass +
      '"><td><span data-date data-id="' +
      entry.id +
      '">' +
      entry.date +
      '</span></td><td><span data-description data-id="' +
      entry.id +
      '">' +
      entry.description +
      '</span></td><td><span data-frequency data-id="' +
      entry.id +
      '">' +
      entry.frequency +
      '</span></td><td>$<span data-amount data-id="' +
      entry.id +
      '">' +
      decAmount.toFixed(2) +
      '</span></td><td>$' +
      intNewBal +
      '</td><td class="entry-actions-cell pl-2' +
      entryActionsClass +
      '"><i class="fas fa-check"' +
      ' data-id="' +
      entry.id +
      '" data-user-id="' +
      entry.user_id +
      '" data-amount-to-clear="' +
      Math.round(entry.amount / 100.0) +
      '"></i><i class="far fa-trash-alt ml-2"' +
      ' data-id="' +
      entry.id +
      '"></i></td></tr>';
    return entryRow;
  }

  // get all entries for current user in JSON format
  $.get('/entries').success(function (data) {
    let allEntryRows = '';

    $.each(data, function (index, entry) {
      allEntryRows += createEntryRow(entry);
    });

    let entriesTable = $('.entries-table');
    entriesTable.html(allEntryRows);

    // update date
    $('.entryRow').on('click', '[data-date]', function (e) {
      const entryId = $(e.target).data('id');
      let el = $(this);
      let input = $('<input type="date" />').val(el.text());
      el.replaceWith(input);

      const save = function () {
        const span = $('<span data-date id="updatedDateCell" />').text(
          input.val()
        );
        input.replaceWith(span);
        const updatedDate = document.getElementById('updatedDateCell')
          .innerHTML;

        $.post('/entries/' + entryId, {
          _method: 'PUT',
          id: entryId,
          entry: {
            date: updatedDate,
            success: location.reload(),
          },
        });
      };

      input.keyup(event => {
        if (event.keyCode == 13) {
          save();
        } else {
          return false;
        }
      });
      input.one('blur', save).focus();
    });

    // update description
    $('.entryRow').on('click', '[data-description]', function (e) {
      const entryId = $(e.target).data('id');
      let el = $(this);
      let input = $('<input/>').val(el.text());
      el.replaceWith(input);

      const save = function () {
        const span = $(
          '<span data-description id="updatedDescriptionCell" />'
        ).text(input.val());
        input.replaceWith(span);
        const updatedDescription = document.getElementById(
          'updatedDescriptionCell'
        ).innerHTML;

        $.post('/entries/' + entryId, {
          _method: 'PUT',
          id: entryId,
          entry: {
            description: updatedDescription,
            success: location.reload(),
          },
        });
      };

      input.keyup(event => {
        if (event.keyCode == 13) {
          save();
        } else {
          return false;
        }
      });
      input.one('blur', save).focus();
    });

    // update frequency
    $('.entryRow').on('click', '[data-frequency]', function (e) {
      const entryId = $(e.target).data('id');
      let el = $(this);
      let select = $(
        '<select id="frequency-select"><option value="one-time">One-time</option><option value="weekly">Weekly</option><option value="bi-weekly">Bi-weekly</option><option value="monthly">Monthly</option><option value="bi-monthly">Bi-monthly</option><option value="quarterly">Quarterly</option><option value="annually">Annually</option></select>'
      ).val(el.text());
      el.replaceWith(select);

      const save = function () {
        const span = $(
          '<span data-frequency id="updatedFrequencyCell" />'
        ).text(select.val());
        select.replaceWith(span);
        const updatedFrequency = document.getElementById('updatedFrequencyCell')
          .innerHTML;

        $.post('/entries/' + entryId, {
          _method: 'PUT',
          id: entryId,
          entry: {
            frequency: updatedFrequency,
            success: location.reload(),
          },
        });
      };

      select.keyup(event => {
        if (event.keyCode == 13) {
          save();
        } else {
          return false;
        }
      });
      select.one('blur', save).focus();
    });

    // update amount
    $('.entryRow').on('click', '[data-amount]', function (e) {
      const entryId = $(e.target).data('id');
      let entryAmt;

      $.get('/entries').success(function (data) {
        $.each(data, function (index, entry) {
          if (entry.id == 253) {
            entryAmt = entry.amount;
          }
        });
      });

      const decEntryAmt = parseFloat(entryAmt);
      const el = $('span[data-amount][data-id="' + entryId + '"]');
      // why are these here?
      // const textAmt = el.text();
      // var $decAmt = parseFloat(textAmt).toFixed(2);
      let input = $('<input type="number"/>').val(decEntryAmt);
      el.replaceWith(input.select());

      const save = function () {
        const updatedDecAmt = input.val();
        const span = $('<span data-amount id="updatedAmountCell" />').text(
          updatedDecAmt * 100
        );
        input.replaceWith(span);

        const updatedAmount = document.getElementById('updatedAmountCell')
          .innerHTML;

        $.post('/entries/' + entryId, {
          _method: 'PUT',
          id: entryId,
          entry: {
            amount: updatedAmount,
            success: location.reload(),
          },
        });
      };

      input.keyup(event => {
        if (event.keyCode == 13) {
          save();
        } else {
          return false;
        }
      });
      input.one('blur', save).focus();
    });

    // clear entry - update balance and either delete (one-time) or update date to next occurence (recurring)
    $('.fa-check').click(function (e) {
      const entryId = $(e.target).data('id');
      const amountToClear = $(e.target).data('amount-to-clear');
      const newClearedBalance =
        (parseInt(currentBalance) + amountToClear) * 100;

      // this is calibrated for eastern time right now
      // I may add support for other time zones in the future
      const dateString =
        $("span[data-id='" + entryId + "'][data-date]").html() +
        'T00:00:00.000-04:00';
      let newDate = new Date(dateString);
      const entryFrequency = $(
        "span[data-id='" + entryId + "'][data-frequency]"
      ).html();

      $.post('/users/' + userId, {
        _method: 'PUT',
        user: {
          current_balance: newClearedBalance,
        },
      });

      if (entryFrequency == 'one-time') {
        $.ajax({
          type: 'DELETE',
          url: '/entries/' + entryId,
          success: setTimeout(window.location.reload.bind(window.location), 50),
        });
      } else {
        if (entryFrequency == 'weekly') {
          newDate.setDate(newDate.getDate() + 7);
        } else if (entryFrequency === 'bi-weekly') {
          newDate.setDate(newDate.getDate() + 14);
        } else if (entryFrequency === 'monthly') {
          newDate.setMonth(newDate.getMonth() + 1);
        } else if (entryFrequency === 'bi-monthly') {
          newDate.setMonth(newDate.getMonth() + 2);
        } else if (entryFrequency === 'quarterly') {
          newDate.setMonth(newDate.getMonth() + 3);
        } else if (entryFrequency === 'annually') {
          newDate.setMonth(newDate.getMonth() + 12);
        }

        $.post('/entries/' + entryId, {
          _method: 'PUT',
          id: entryId,
          entry: {
            date: newDate,
            success: setTimeout(
              window.location.reload.bind(window.location),
              50
            ),
          },
        });
      }
    });

    // delete entry
    $('.fa-trash-alt').click(function (e) {
      const entryId = $(e.target).data('id');

      $.ajax({
        type: 'DELETE',
        url: '/entries/' + entryId,
        success: location.reload(),
      });
    });
  });
});
